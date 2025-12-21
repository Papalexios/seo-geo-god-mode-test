// Elite SEO Analyzer with real algorithms

export interface EliteSEOMetrics {
  score: number;
  tfIdf: number;
  lsiKeywords: string[];
  entities: Array<{ text: string; type: string; salience: number }>;
  topics: string[];
  eeatScore: number;
  serpFeatureEligibility: string[];
  semanticRelevance: number;
  contentDepth: number;
  keywordDensity: number;
  readabilityScore: number;
}

export class EliteSEOAnalyzer {
  // Calculate TF-IDF (Term Frequency - Inverse Document Frequency)
  private calculateTFIDF(text: string, keyword: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const keywordLower = keyword.toLowerCase();
    const keywordWords = keywordLower.split(/\s+/);
    
    // Term Frequency
    let termFreq = 0;
    keywordWords.forEach(kw => {
      termFreq += words.filter(w => w === kw).length;
    });
    const tf = termFreq / words.length;
    
    // Simplified IDF (in real implementation, would use corpus)
    const idf = Math.log(1000 / (1 + termFreq)); // Assume 1000 doc corpus
    
    return tf * idf * 100;
  }

  // Extract LSI (Latent Semantic Indexing) keywords
  private findLSIKeywords(text: string, primaryKeyword: string): string[] {
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = new Map<string, number>();
    
    words.forEach(word => {
      if (!this.isStopWord(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
    
    // Sort by frequency and return top semantically related terms
    const sorted = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);
    
    return sorted.filter(w => !primaryKeyword.toLowerCase().includes(w));
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'be', 'are', 'was', 'were', 'been', 'have', 'has', 'had'];
    return stopWords.includes(word.toLowerCase());
  }

  // Extract named entities (simplified - in production use NLP library)
  private extractEntities(text: string): Array<{ text: string; type: string; salience: number }> {
    const entities: Array<{ text: string; type: string; salience: number }> = [];
    
    // Detect capitalized phrases (potential entities)
    const capitalizedMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const entityCounts = new Map<string, number>();
    
    capitalizedMatches.forEach(entity => {
      if (entity.length > 2) {
        entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
      }
    });
    
    // Calculate salience (relative importance)
    const totalEntities = Array.from(entityCounts.values()).reduce((a, b) => a + b, 0);
    
    entityCounts.forEach((count, entity) => {
      entities.push({
        text: entity,
        type: this.guessEntityType(entity),
        salience: count / totalEntities
      });
    });
    
    return entities.sort((a, b) => b.salience - a.salience).slice(0, 10);
  }

  private guessEntityType(entity: string): string {
    // Simple heuristics - in production use NER model
    if (/Inc\.|Corp\.|LLC|Ltd/i.test(entity)) return 'ORGANIZATION';
    if (/\d{4}/.test(entity)) return 'DATE';
    if (/^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(entity)) return 'PERSON';
    return 'CONCEPT';
  }

  // Topic extraction (simplified LDA)
  private extractTopics(text: string): string[] {
    const sentences = text.split(/[.!?]+/);
    const topics = new Map<string, number>();
    
    sentences.forEach(sentence => {
      const words = sentence.toLowerCase().match(/\b\w{5,}\b/g) || [];
      words.forEach(word => {
        if (!this.isStopWord(word)) {
          topics.set(word, (topics.get(word) || 0) + 1);
        }
      });
    });
    
    return Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  // E-E-A-T Signal Detection
  private detectEEATSignals(html: string): number {
    let score = 0;
    const text = html.toLowerCase();
    
    // Experience indicators
    if (/\b(we tested|our experience|we found|in our testing|after using)\b/i.test(text)) score += 15;
    
    // Expertise indicators
    if (/\b(expert|phd|doctor|certified|professional|years of experience)\b/i.test(text)) score += 20;
    if (html.includes('author') && html.includes('bio')) score += 10;
    
    // Authority indicators
    if (/\b(published|research|study|according to|source)\b/i.test(text)) score += 15;
    const externalLinks = (html.match(/href="http/g) || []).length;
    score += Math.min(externalLinks * 2, 20);
    
    // Trust indicators
    if (/\b(privacy policy|about us|contact|terms)\b/i.test(text)) score += 10;
    if (html.includes('https://')) score += 10;
    
    return Math.min(score, 100);
  }

  // SERP Feature Eligibility
  private analyzeSERPFeatures(html: string): string[] {
    const features: string[] = [];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Featured Snippet eligibility
    const paragraphs = doc.querySelectorAll('p');
    const hasDefinition = Array.from(paragraphs).some(p => 
      p.textContent && p.textContent.length > 40 && p.textContent.length < 160
    );
    if (hasDefinition) features.push('Featured Snippet');
    
    // People Also Ask eligibility
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    const hasQuestions = headings.some(h => 
      h.textContent && /^(what|how|why|when|where|who|which)/i.test(h.textContent)
    );
    if (hasQuestions) features.push('People Also Ask');
    
    // Schema markup
    if (html.includes('application/ld+json') || html.includes('schema.org')) {
      features.push('Rich Results');
    }
    
    // List eligibility
    const lists = doc.querySelectorAll('ol, ul');
    if (lists.length > 2) features.push('List Feature');
    
    return features;
  }

  // Semantic relevance (cosine similarity approximation)
  private calculateSemanticRelevance(text: string, keyword: string): number {
    const textWords = new Set(text.toLowerCase().match(/\b\w{3,}\b/g) || []);
    const keywordWords = new Set(keyword.toLowerCase().match(/\b\w{3,}\b/g) || []);
    
    const intersection = new Set([...textWords].filter(x => keywordWords.has(x)));
    const union = new Set([...textWords, ...keywordWords]);
    
    // Jaccard similarity as approximation
    return (intersection.size / union.size) * 100;
  }

  // Content depth analysis
  private analyzeContentDepth(text: string): number {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const paragraphs = text.split(/\n\n+/).length;
    
    let score = 0;
    
    // Word count scoring
    if (words > 2000) score += 30;
    else if (words > 1000) score += 20;
    else if (words > 500) score += 10;
    
    // Structural depth
    if (sentences > 50) score += 20;
    if (paragraphs > 10) score += 15;
    
    // Average sentence length (complexity indicator)
    const avgSentenceLength = words / sentences;
    if (avgSentenceLength > 15 && avgSentenceLength < 25) score += 15;
    
    // Unique word ratio (vocabulary richness)
    const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g) || []);
    const uniqueRatio = uniqueWords.size / words;
    if (uniqueRatio > 0.5) score += 20;
    
    return Math.min(score, 100);
  }

  // Main analysis function
  async analyze(html: string, targetKeyword: string): Promise<EliteSEOMetrics> {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || '';
    
    // Calculate all metrics
    const tfIdf = this.calculateTFIDF(text, targetKeyword);
    const lsiKeywords = this.findLSIKeywords(text, targetKeyword);
    const entities = this.extractEntities(text);
    const topics = this.extractTopics(text);
    const eeatScore = this.detectEEATSignals(html);
    const serpFeatureEligibility = this.analyzeSERPFeatures(html);
    const semanticRelevance = this.calculateSemanticRelevance(text, targetKeyword);
    const contentDepth = this.analyzeContentDepth(text);
    
    // Keyword density
    const keywordCount = (text.toLowerCase().match(new RegExp(targetKeyword.toLowerCase(), 'g')) || []).length;
    const wordCount = text.split(/\s+/).length;
    const keywordDensity = (keywordCount / wordCount) * 100;
    
    // Readability (Flesch Reading Ease)
    const sentences = text.split(/[.!?]+/).length;
    const syllables = this.countSyllables(text);
    const readabilityScore = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount);
    
    // Calculate overall score
    const score = Math.round(
      tfIdf * 0.15 +
      eeatScore * 0.20 +
      semanticRelevance * 0.15 +
      contentDepth * 0.20 +
      (serpFeatureEligibility.length * 5) * 0.10 +
      Math.min(readabilityScore, 100) * 0.10 +
      Math.min(keywordDensity * 20, 100) * 0.10
    );
    
    return {
      score: Math.min(score, 100),
      tfIdf,
      lsiKeywords,
      entities,
      topics,
      eeatScore,
      serpFeatureEligibility,
      semanticRelevance,
      contentDepth,
      keywordDensity,
      readabilityScore: Math.max(0, Math.min(readabilityScore, 100))
    };
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let count = 0;
    
    words.forEach(word => {
      // Simplified syllable counting
      const vowels = word.match(/[aeiouy]+/g) || [];
      count += vowels.length;
      if (word.endsWith('e')) count--;
      if (count === 0) count = 1;
    });
    
    return count;
  }
}
