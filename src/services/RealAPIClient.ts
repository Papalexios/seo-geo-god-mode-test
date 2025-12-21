// Real API Client with retry logic and error handling

export interface APIConfig {
  geminiKey: string;
  serperKey: string;
  openaiKey?: string;
  wpSiteUrl: string;
  wpUsername: string;
  wpAppPassword: string;
}

export class RateLimiter {
  private calls: Map<string, number[]> = new Map();

  async checkLimit(service: string, maxCalls: number, windowMs: number): Promise<void> {
    const now = Date.now();
    const serviceCalls = this.calls.get(service) || [];
    const validCalls = serviceCalls.filter(t => now - t < windowMs);
    
    if (validCalls.length >= maxCalls) {
      const oldestCall = validCalls[0];
      const waitTime = windowMs - (now - oldestCall);
      throw new Error(`Rate limit exceeded for ${service}. Wait ${Math.ceil(waitTime / 1000)}s`);
    }
    
    validCalls.push(now);
    this.calls.set(service, validCalls);
  }
}

export class RobustAPIClient {
  private rateLimiter = new RateLimiter();

  async callWithRetry<T>(
    fn: () => Promise<T>,
    service: string,
    maxRetries = 3
  ): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Rate limiting: Gemini 15 RPM, Serper 100 RPM
        const limits = {
          gemini: { max: 15, window: 60000 },
          serper: { max: 100, window: 60000 },
          wordpress: { max: 30, window: 60000 }
        };
        const limit = limits[service as keyof typeof limits] || { max: 10, window: 60000 };
        await this.rateLimiter.checkLimit(service, limit.max, limit.window);
        
        return await fn();
      } catch (error: any) {
        console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, error.message);
        
        if (attempt === maxRetries - 1) {
          throw new Error(`${service} failed after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        await this.exponentialBackoff(attempt);
      }
    }
    throw new Error('Unexpected error in retry logic');
  }

  private async exponentialBackoff(attempt: number): Promise<void> {
    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Real Gemini API Client
export class GeminiClient {
  private client = new RobustAPIClient();
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, model = 'gemini-2.0-flash-exp'): Promise<string> {
    return this.client.callWithRetry(async () => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
              topP: 0.95
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }, 'gemini');
  }
}

// Real Serper API Client
export class SerperClient {
  private client = new RobustAPIClient();
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, num = 10): Promise<any> {
    return this.client.callWithRetry(async () => {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: query, num })
      });

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.statusText}`);
      }

      return await response.json();
    }, 'serper');
  }
}

// Real WordPress API Client
export class WordPressClient {
  private client = new RobustAPIClient();
  private config: { siteUrl: string; username: string; appPassword: string };

  constructor(siteUrl: string, username: string, appPassword: string) {
    this.config = { siteUrl, username, appPassword };
  }

  private getAuthHeader(): string {
    return 'Basic ' + btoa(`${this.config.username}:${this.config.appPassword}`);
  }

  async getPostByURL(url: string): Promise<any> {
    return this.client.callWithRetry(async () => {
      const slug = url.split('/').filter(Boolean).pop();
      const response = await fetch(
        `${this.config.siteUrl}/wp-json/wp/v2/posts?slug=${slug}`,
        {
          headers: { 'Authorization': this.getAuthHeader() }
        }
      );

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.statusText}`);
      }

      const posts = await response.json();
      return posts[0] || null;
    }, 'wordpress');
  }

  async updatePost(postId: number, updates: any): Promise<any> {
    return this.client.callWithRetry(async () => {
      const response = await fetch(
        `${this.config.siteUrl}/wp-json/wp/v2/posts/${postId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`WordPress update failed: ${error.message || response.statusText}`);
      }

      return await response.json();
    }, 'wordpress');
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.siteUrl}/wp-json/wp/v2/users/me`, {
        headers: { 'Authorization': this.getAuthHeader() }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
