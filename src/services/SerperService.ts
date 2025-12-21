// REAL Serper API for Blue Ocean Analysis
export interface SerperResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  cpc?: number;
}

export class SerperService {
  private apiKey: string;
  private baseUrl = 'https://google.serper.dev';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, num: number = 100): Promise<SerperResult[]> {
    if (!this.apiKey) throw new Error('Serper API key not configured');

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
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

      const data = await response.json();
      return (data.organic || []).map((result: any, index: number) => ({
        position: index + 1,
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        date: result.date
      }));
    } catch (error) {
      console.error('Serper API Error:', error);
      throw error;
    }
  }

  async getRelatedSearches(query: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: query })
      });

      const data = await response.json();
      return data.relatedSearches?.map((s: any) => s.query) || [];
    } catch (error) {
      console.error('Error fetching related searches:', error);
      return [];
    }
  }

  async analyzeKeywordIntent(keyword: string): Promise<'informational' | 'commercial' | 'transactional' | 'navigational'> {
    const results = await this.search(keyword, 10);
    
    let commercialCount = 0;
    let transactionalCount = 0;
    let informationalCount = 0;

    results.forEach(result => {
      const text = (result.title + ' ' + result.snippet).toLowerCase();
      
      if (text.match(/buy|purchase|price|deal|discount|shop|order/)) transactionalCount++;
      else if (text.match(/best|top|review|vs|comparison|alternative/)) commercialCount++;
      else if (text.match(/what|how|why|guide|tutorial|learn/)) informationalCount++;
    });

    if (transactionalCount >= 3) return 'transactional';
    if (commercialCount >= 3) return 'commercial';
    if (informationalCount >= 3) return 'informational';
    return 'informational';
  }

  estimateSearchVolume(keyword: string): number {
    // Heuristic based on keyword length and structure
    const words = keyword.split(' ').length;
    const hasModifier = /best|top|how to|what is/.test(keyword.toLowerCase());
    
    let baseVolume = 1000;
    if (words <= 2) baseVolume = 5000;
    if (words <= 1) baseVolume = 10000;
    if (hasModifier) baseVolume *= 1.5;
    
    return Math.floor(baseVolume + Math.random() * baseVolume * 0.5);
  }

  calculateDifficulty(results: SerperResult[]): number {
    // Calculate based on domain authority proxies
    let difficulty = 0;
    
    results.slice(0, 10).forEach(result => {
      const domain = new URL(result.link).hostname;
      
      // High authority domains
      if (domain.match(/wikipedia|youtube|amazon|reddit|forbes|nytimes/)) {
        difficulty += 10;
      } else if (domain.match(/\.(gov|edu)/)) {
        difficulty += 8;
      } else {
        difficulty += 5;
      }
    });

    return Math.min(100, difficulty);
  }
}
