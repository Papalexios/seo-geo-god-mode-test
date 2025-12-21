// Real Answer Engine Optimization (AEO)

export interface AEOMetrics {
  score: number;
  directAnswers: Array<{ question: string; answer: string }>;
  qaPairs: Array<{ q: string; a: string }>;
  citabilityScore: number;
  factDensity: number;
  conversationalScore: number;
  structuredDataPresent: boolean;
  answerEngineCompatibility: {
    chatgpt: number;
    perplexity: number;
    gemini: number;
  };
}

export class RealAEOOptimizer {
  // Extract direct answers for "What is X?" questions
  private extractDirectAnswers(text: string): Array<{ question: string; answer: string }> {
    const answers: Array<{ question: string; answer: string }> = [];
    const sentences = text.split(/[.!?]+/);
    
    // Look for definition patterns
    const definitionPatterns = [
      /([A-Z][a-z\s]+)\s+is\s+([^.!?]+)/,
      /([A-Z][a-z\s]+)\s+refers to\s+([^.!?]+)/,
      /([A-Z][a-z\s]+)\s+means\s+([^.!?]+)/
    ];
    
    sentences.forEach(sentence => {
      definitionPatterns.forEach(pattern => {
        const match = sentence.match(pattern);
        if (match) {
          answers.push({
            question: `What is ${match[1]}?`,
            answer: match[2].trim()
          });
        }
      });
    });
    
    return answers.slice(0, 5);
  }

  // Identify Q&A pairs
  private identifyQAPairs(html: string): Array<{ q: string; a: string }> {
    const pairs: Array<{ q: string; a: string }> = [];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Find headings that are questions
    const headings = Array.from(doc.querySelectorAll('h2, h3, h4'));
    
    headings.forEach(heading => {
      const text = heading.textContent || '';
      if (/^(what|how|why|when|where|who|which|can|should|do|does)/i.test(text)) {
        // Get next paragraph as answer
        let nextElement = heading.nextElementSibling;
        let answer = '';
        
        while (nextElement && nextElement.tagName === 'P' && answer.length < 300) {
          answer += nextElement.textContent + ' ';
          nextElement = nextElement.nextElementSibling;
        }
        
        if (answer.length > 20) {
          pairs.push({ q: text.trim(), a: answer.trim() });
        }
      }
    });
    
    return pairs;
  }

  // Calculate citability score
  private calculateCitability(html: string): number {
    let score = 0;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || '';
    
    // Has citations/references
    if (/\[\d+\]|\(source|\(citation|references:/i.test(text)) score += 25;
    
    // Has external authoritative links
    const links = Array.from(doc.querySelectorAll('a[href]'));
    const authoritativeDomains = links.filter(link => {
      const href = link.getAttribute('href') || '';
      return /\.(edu|gov|org)/.test(href);
    });
    score += Math.min(authoritativeDomains.length * 5, 25);
    
    // Has statistics/data
    if (/\d+%|\$\d+|\d+\s+(percent|million|billion|thousand)/i.test(text)) score += 20;
    
    // Has clear structure (headings)
    const headings = doc.querySelectorAll('h1, h2, h3');
    score += Math.min(headings.length * 3, 15);
    
    // Has author information
    if (/author|by\s+[A-Z]|written by/i.test(html)) score += 15;
    
    return Math.min(score, 100);
  }

  // Analyze fact density
  private analyzeFacts(text: string): number {
    const sentences = text.split(/[.!?]+/);
    let factCount = 0;
    
    // Patterns that indicate factual statements
    const factPatterns = [
      /\d{4}/,  // Years
      /\d+%/,   // Percentages
      /\d+\s+(million|billion|thousand|hundred)/i,  // Large numbers
      /according to/i,
      /research shows/i,
      /study found/i,
      /data indicates/i,
      /[A-Z][a-z]+\s+(university|institute|organization|company)/  // Institutions
    ];
    
    sentences.forEach(sentence => {
      if (factPatterns.some(pattern => pattern.test(sentence))) {
        factCount++;
      }
    });
    
    return Math.min((factCount / sentences.length) * 100, 100);
  }

  // Analyze conversational tone
  private analyzeConversationalTone(text: string): number {
    let score = 0;
    
    // Use of questions
    const questions = (text.match(/\?/g) || []).length;
    score += Math.min(questions * 5, 20);
    
    // Use of personal pronouns
    if (/\b(you|your|we|our|us)\b/i.test(text)) score += 20;
    
    // Direct address
    if (/\b(let's|here's|imagine|consider|think about)\b/i.test(text)) score += 15;
    
    // Simple sentence structure (avg < 20 words)
    const sentences = text.split(/[.!?]+/);
    const words = text.split(/\s+/);
    const avgSentenceLength = words.length / sentences.length;
    if (avgSentenceLength < 20) score += 25;
    
    // Active voice indicators
    if (!/\b(was|were|been|being)\s+\w+ed\b/i.test(text)) score += 20;
    
    return Math.min(score, 100);
  }

  // Check for structured data
  private hasStructuredData(html: string): boolean {
    return html.includes('application/ld+json') || 
           html.includes('schema.org') ||
           html.includes('itemscope');
  }

  // Calculate answer engine compatibility
  private calculateCompatibility(metrics: any): { chatgpt: number; perplexity: number; gemini: number } {
    // ChatGPT prefers conversational, factual content
    const chatgpt = Math.round(
      metrics.conversationalScore * 0.4 +
      metrics.factDensity * 0.3 +
      metrics.citabilityScore * 0.3
    );
    
    // Perplexity prefers highly citable, structured content
    const perplexity = Math.round(
      metrics.citabilityScore * 0.5 +
      metrics.factDensity * 0.3 +
      (metrics.structuredDataPresent ? 20 : 0)
    );
    
    // Gemini prefers comprehensive, well-structured content
    const gemini = Math.round(
      metrics.factDensity * 0.35 +
      metrics.conversationalScore * 0.25 +
      metrics.citabilityScore * 0.25 +
      (metrics.qaPairs.length * 3)
    );
    
    return {
      chatgpt: Math.min(chatgpt, 100),
      perplexity: Math.min(perplexity, 100),
      gemini: Math.min(gemini, 100)
    };
  }

  // Main AEO analysis
  async analyze(html: string): Promise<AEOMetrics> {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || '';
    
    const directAnswers = this.extractDirectAnswers(text);
    const qaPairs = this.identifyQAPairs(html);
    const citabilityScore = this.calculateCitability(html);
    const factDensity = this.analyzeFacts(text);
    const conversationalScore = this.analyzeConversationalTone(text);
    const structuredDataPresent = this.hasStructuredData(html);
    
    const answerEngineCompatibility = this.calculateCompatibility({
      conversationalScore,
      factDensity,
      citabilityScore,
      structuredDataPresent,
      qaPairs
    });
    
    // Calculate overall AEO score
    const score = Math.round(
      citabilityScore * 0.25 +
      factDensity * 0.20 +
      conversationalScore * 0.20 +
      (directAnswers.length * 5) * 0.15 +
      (qaPairs.length * 3) * 0.15 +
      (structuredDataPresent ? 5 : 0)
    );
    
    return {
      score: Math.min(score, 100),
      directAnswers,
      qaPairs,
      citabilityScore,
      factDensity,
      conversationalScore,
      structuredDataPresent,
      answerEngineCompatibility
    };
  }
}
