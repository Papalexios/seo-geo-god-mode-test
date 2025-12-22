// ═══════════════════════════════════════════════════════════════════
// ELITE SOTA AI ORCHESTRATOR v15.0
// Universal LLM Substrate: OpenAI, Anthropic, Gemini, OpenRouter, Groq
// ═══════════════════════════════════════════════════════════════════

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'groq';
  apiKey: string;
  model?: string; // For custom models
}

export class AIOrchestrator {
  
  async validateAPIKey(config: AIConfig): Promise<boolean> {
    try {
      switch (config.provider) {
        case 'openai':
          return await this.validateOpenAI(config.apiKey);
        case 'anthropic':
          return await this.validateAnthropic(config.apiKey);
        case 'gemini':
          return await this.validateGemini(config.apiKey);
        case 'openrouter':
          return await this.validateOpenRouter(config.apiKey);
        case 'groq':
          return await this.validateGroq(config.apiKey);
        default:
          return false;
      }
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }
  
  async validateOpenAI(apiKey: string): Promise<boolean> {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.ok;
  }
  
  async validateAnthropic(apiKey: string): Promise<boolean> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      })
    });
    return response.ok;
  }
  
  async validateGemini(apiKey: string): Promise<boolean> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    return response.ok;
  }
  
  async validateOpenRouter(apiKey: string): Promise<boolean> {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.ok;
  }
  
  async validateGroq(apiKey: string): Promise<boolean> {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.ok;
  }
  
  async generate(config: AIConfig, prompt: string): Promise<string> {
    switch (config.provider) {
      case 'openai':
        return this.generateOpenAI(config, prompt);
      case 'anthropic':
        return this.generateAnthropic(config, prompt);
      case 'gemini':
        return this.generateGemini(config, prompt);
      case 'openrouter':
        return this.generateOpenRouter(config, prompt);
      case 'groq':
        return this.generateGroq(config, prompt);
      default:
        throw new Error('Unknown provider');
    }
  }
  
  async generateOpenAI(config: AIConfig, prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async generateAnthropic(config: AIConfig, prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return data.content[0].text;
  }
  
  async generateGemini(config: AIConfig, prompt: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${config.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
  
  async generateOpenRouter(config: AIConfig, prompt: string): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model || 'anthropic/claude-3.5-sonnet',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async generateGroq(config: AIConfig, prompt: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
}