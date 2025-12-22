// ═══════════════════════════════════════════════════════════════════
// IMAGE ORCHESTRATOR - DALL-E 3 Automation
// ═══════════════════════════════════════════════════════════════════

export class ImageOrchestrator {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Generates cinematic images for each H2 heading
   */
  async generateForH2s(content: string): Promise<any[]> {
    // Extract H2 headings
    const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
    const h2Texts = h2Matches.map(h2 => h2.replace(/<[^>]+>/g, '').trim());
    
    const images: any[] = [];
    
    for (const h2 of h2Texts) {
      try {
        const prompt = this.enhancePrompt(h2);
        const imageUrl = await this.generateImage(prompt);
        images.push({
          heading: h2,
          prompt,
          url: imageUrl
        });
      } catch (error) {
        console.error('Image generation error:', error);
      }
    }
    
    return images;
  }
  
  /**
   * Enhances H2 text into cinematic DALL-E prompt
   */
  enhancePrompt(h2: string): string {
    return `Professional, cinematic, high-quality photograph of ${h2}, modern aesthetic, clean composition, editorial style, 4K resolution, dramatic lighting, business context`;
  }
  
  /**
   * Calls DALL-E 3 or Gemini Imagen
   */
  async generateImage(prompt: string): Promise<string> {
    if (!this.apiKey) {
      return 'https://via.placeholder.com/1024x1024?text=Image+Placeholder';
    }
    
    try {
      // Gemini Imagen API call
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-001:predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: '1024x1024'
        })
      });
      
      const data = await response.json();
      return data.predictions?.[0]?.mimeData || 'https://via.placeholder.com/1024x1024';
    } catch (error) {
      console.error('Image API error:', error);
      return 'https://via.placeholder.com/1024x1024?text=Error+Generating+Image';
    }
  }
}