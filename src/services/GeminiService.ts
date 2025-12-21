// REAL Gemini API Integration
export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, model: string = 'gemini-2.0-flash-exp'): Promise<string> {
    if (!this.apiKey) throw new Error('Gemini API key not configured');

    try {
      const response = await fetch(`${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            topP: 0.95,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async generateSEOContent(keyword: string, wordCount: number, tone: string): Promise<{
    title: string;
    content: string;
    metaDescription: string;
    schema: any;
  }> {
    const prompt = `You are an elite SEO content writer. Create a comprehensive, SEO-optimized article.

Keyword: ${keyword}
Word Count: ${wordCount}
Tone: ${tone}

Requirements:
1. Create an engaging, click-worthy title (50-60 chars)
2. Write ${wordCount} words of high-quality content
3. Use proper heading hierarchy (H2, H3)
4. Include the keyword naturally (1-2% density)
5. Add internal linking suggestions [LINK: anchor text]
6. Include FAQ section for People Also Ask
7. Add expert insights and E-E-A-T signals
8. Write compelling meta description (150-160 chars)
9. Include relevant entities and LSI keywords

Format:
TITLE: [Your title]
META: [Your meta description]
CONTENT:
[Your article content with markdown formatting]

FAQ:
[Q&A pairs]
`;

    const response = await this.generateContent(prompt);
    return this.parseContentResponse(response, keyword);
  }

  private parseContentResponse(response: string, keyword: string) {
    const titleMatch = response.match(/TITLE:\s*(.+)/i);
    const metaMatch = response.match(/META:\s*(.+)/i);
    const contentMatch = response.match(/CONTENT:\s*([\s\S]+?)(?=FAQ:|$)/i);
    const faqMatch = response.match(/FAQ:\s*([\s\S]+)/i);

    const title = titleMatch?.[1]?.trim() || `Complete Guide to ${keyword}`;
    const metaDescription = metaMatch?.[1]?.trim() || `Expert insights on ${keyword}. Comprehensive guide with tips and strategies.`;
    let content = contentMatch?.[1]?.trim() || response;
    
    if (faqMatch) {
      content += '\n\n## Frequently Asked Questions\n\n' + faqMatch[1];
    }

    const schema = this.generateArticleSchema(title, content, keyword);

    return { title, content, metaDescription, schema };
  }

  private generateArticleSchema(title: string, content: string, keyword: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: content.substring(0, 200),
      keywords: keyword,
      author: {
        '@type': 'Person',
        name: 'Expert Author'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Your Site'
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
  }
}
