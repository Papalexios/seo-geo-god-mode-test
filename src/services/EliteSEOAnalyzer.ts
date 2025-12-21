// ELITE SEO ANALYSIS with Advanced Algorithms
import { SerperService } from './SerperService';

export interface SEOAnalysisResult {
  score: number;
  wordCount: number;
  readabilityScore: number;
  tfIdfScore: number;
  lsiKeywords: string[];
  entities: Entity[];
  topics: string[];
  eeatSignals: EEATSignals;
  serpFeatures: SERPFeatureAnalysis;
  competitorGap: number;
  issues: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }>;
  suggestions: Array<{ priority: 'high' | 'medium' | 'low'; action: string }>;
}

export interface Entity {
  text: string;
  type: 'PERSON' | 'ORGANIZATION' | 'LOCATION' | 'PRODUCT' | 'OTHER';
  relevance: number;
}

export interface EEATSignals {
  score: number;
  hasAuthorBio: boolean;
  hasCitations: boolean;
  hasExpertiseIndicators: boolean;
  hasDatePublished: boolean;
  hasLastUpdated: boolean;
  hasContactInfo: boolean;
  authorityScore: number;
}

export interface SERPFeatureAnalysis {
  featuredSnippetEligible: boolean;
  paaEligible: boolean;
  hasStructuredData: boolean;
  schemaTypes: string[];
  richSnippetPotential: number;
}

export class EliteSEOAnalyzer {
  private serper?: SerperService;

  constructor(serperKey?: string) {
    if (serperKey) {
      this.serper = new SerperService(serperKey);
    }
  }

  async analyzeURL(url: string, targetKeyword?: string): Promise<SEOAnalysisResult> {
    try {
      // Fetch HTML
      const html = await this.fetchHTML(url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract content
      const content = this.extractContent(doc);
      const title = doc.querySelector('title')?.textContent || '';
      
      // Run all analyses
      const [tfIdf, lsi, entities, topics, eeat, serpFeatures] = await Promise.all([
        this.calculateTFIDF(content, targetKeyword || ''),
        this.findLSIKeywords(content, targetKeyword || ''),
        this.extractEntities(content),
        this.extractTopics(content),
        this.detectEEATSignals(doc),
        this.analyzeSERPFeatures(doc)
      ]);

      // Calculate scores
      const wordCount = content.split(/\s+/).length;
      const readabilityScore = this.calculateReadability(content);
      
      // Get competitor gap if Serper available
      let competitorGap = 0;
      if (this.serper && targetKeyword) {
        competitorGap = await this.calculateCompetitorGap(url, targetKeyword, wordCount);
      }

      // Generate issues and suggestions
      const issues = this.identifyIssues(doc, content, wordCount, eeat, serpFeatures);
      const suggestions = this.generateSuggestions(issues, tfIdf, lsi, serpFeatures);

      // Calculate overall score
      const score = this.calculateOverallScore({
        wordCount,
        readabilityScore,
        tfIdfScore: tfIdf,
        eeatScore: eeat.score,
        serpScore: serpFeatures.richSnippetPotential,
        issueCount: issues.filter(i => i.severity === 'critical').length
      });

      return {
        score,
        wordCount,
        readabilityScore,
        tfIdfScore: tfIdf,
        lsiKeywords: lsi,
        entities,
        topics,
        eeatSignals: eeat,
        serpFeatures,
        competitorGap,
        issues,
        suggestions
      };
    } catch (error) {
      console.error('SEO Analysis Error:', error);
      throw error;
    }
  }

  private async fetchHTML(url: string): Promise<string> {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error('Failed to fetch URL');
    return await response.text();
  }

  private extractContent(doc: Document): string {
    // Remove script, style, nav, footer
    const elementsToRemove = doc.querySelectorAll('script, style, nav, footer, header, aside');
    elementsToRemove.forEach(el => el.remove());

    // Get main content
    const main = doc.querySelector('main, article, [role="main"]');
    return (main?.textContent || doc.body.textContent || '').trim();
  }

  private calculateTFIDF(content: string, keyword: string): number {
    if (!keyword) return 0;

    const words = content.toLowerCase().split(/\s+/);
    const keywordLower = keyword.toLowerCase();
    
    // Term Frequency
    const keywordCount = words.filter(w => w.includes(keywordLower)).length;
    const tf = keywordCount / words.length;

    // Inverse Document Frequency (simplified - assume corpus of 10000 docs)
    const docsWithKeyword = 100; // Estimate
    const idf = Math.log(10000 / docsWithKeyword);

    const tfidf = tf * idf;
    
    // Normalize to 0-100 scale
    return Math.min(100, Math.round(tfidf * 1000));
  }

  private async findLSIKeywords(content: string, keyword: string): Promise<string[]> {
    // Extract words
    const words = content.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4);

    // Count frequencies
    const freq = new Map<string, number>();
    words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));

    // Get top words (excluding the main keyword)
    const keywordLower = keyword.toLowerCase();
    const lsiWords = Array.from(freq.entries())
      .filter(([word]) => !word.includes(keywordLower) && !this.isStopWord(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    return lsiWords;
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set(['this', 'that', 'these', 'those', 'have', 'been', 'were', 'will', 'would', 'could', 'should', 'there', 'their', 'about', 'which', 'when', 'where', 'what']);
    return stopWords.has(word);
  }

  private extractEntities(content: string): Entity[] {
    const entities: Entity[] = [];
    
    // Simple NER - capitalized words (proper nouns)
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/);
      
      words.forEach((word, i) => {
        if (word.length > 2 && word[0] === word[0].toUpperCase()) {
          // Check if it's a person (preceded by title)
          const prevWord = words[i - 1]?.toLowerCase();
          let type: Entity['type'] = 'OTHER';
          
          if (['dr', 'mr', 'mrs', 'ms', 'prof'].includes(prevWord)) {
            type = 'PERSON';
          } else if (word.endsWith('Inc') || word.endsWith('Corp') || word.endsWith('LLC')) {
            type = 'ORGANIZATION';
          }
          
          entities.push({
            text: word,
            type,
            relevance: 0.8
          });
        }
      });
    });

    // Deduplicate
    const unique = Array.from(new Map(entities.map(e => [e.text, e])).values());
    return unique.slice(0, 20);
  }

  private extractTopics(content: string): string[] {
    // Simple topic extraction using frequent noun phrases
    const words = content.toLowerCase().split(/\s+/);
    const bigrams = [];
    
    for (let i = 0; i < words.length - 1; i++) {
      bigrams.push(`${words[i]} ${words[i + 1]}`);
    }

    const freq = new Map<string, number>();
    bigrams.forEach(bg => {
      if (!this.isStopWord(bg.split(' ')[0]) && !this.isStopWord(bg.split(' ')[1])) {
        freq.set(bg, (freq.get(bg) || 0) + 1);
      }
    });

    return Array.from(freq.entries())
      .filter(([_, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phrase]) => phrase);
  }

  private detectEEATSignals(doc: Document): EEATSignals {
    const html = doc.documentElement.outerHTML.toLowerCase();
    
    const hasAuthorBio = !!(doc.querySelector('[class*="author"], [class*="bio"]') || html.includes('about the author'));
    const hasCitations = doc.querySelectorAll('cite, [class*="citation"], [class*="reference"]').length > 0;
    const hasExpertiseIndicators = html.includes('expert') || html.includes('phd') || html.includes('certified');
    const hasDatePublished = !!(doc.querySelector('[property="article:published_time"], time, [class*="date"]'));
    const hasLastUpdated = html.includes('updated') || html.includes('modified');
    const hasContactInfo = !!(doc.querySelector('[href^="mailto:"], [class*="contact"]'));
    
    // Calculate authority score
    let authorityScore = 0;
    if (hasAuthorBio) authorityScore += 20;
    if (hasCitations) authorityScore += 20;
    if (hasExpertiseIndicators) authorityScore += 20;
    if (hasDatePublished) authorityScore += 15;
    if (hasLastUpdated) authorityScore += 15;
    if (hasContactInfo) authorityScore += 10;

    const score = Math.round((authorityScore / 100) * 100);

    return {
      score,
      hasAuthorBio,
      hasCitations,
      hasExpertiseIndicators,
      hasDatePublished,
      hasLastUpdated,
      hasContactInfo,
      authorityScore
    };
  }

  private analyzeSERPFeatures(doc: Document): SERPFeatureAnalysis {
    const html = doc.documentElement.outerHTML;
    
    // Check for structured data
    const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    const schemaTypes: string[] = [];
    
    scripts.forEach(script => {
      try {
        const schema = JSON.parse(script.textContent || '');
        if (schema['@type']) schemaTypes.push(schema['@type']);
      } catch (e) {}
    });

    const hasStructuredData = schemaTypes.length > 0;
    
    // Featured snippet eligibility
    const hasDefinitionParagraph = !!doc.querySelector('p');
    const hasLists = doc.querySelectorAll('ul, ol').length > 0;
    const hasTables = doc.querySelectorAll('table').length > 0;
    const featuredSnippetEligible = hasDefinitionParagraph && (hasLists || hasTables);
    
    // PAA eligibility
    const hasFAQ = html.toLowerCase().includes('frequently asked') || html.includes('FAQ');
    const hasQuestions = (html.match(/\?/g) || []).length > 5;
    const paaEligible = hasFAQ || hasQuestions;
    
    // Rich snippet potential
    let richSnippetPotential = 0;
    if (hasStructuredData) richSnippetPotential += 40;
    if (featuredSnippetEligible) richSnippetPotential += 30;
    if (paaEligible) richSnippetPotential += 30;

    return {
      featuredSnippetEligible,
      paaEligible,
      hasStructuredData,
      schemaTypes,
      richSnippetPotential: Math.min(100, richSnippetPotential)
    };
  }

  private calculateReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/);
    const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    // Flesch Reading Ease
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    const flesch = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    return Math.max(0, Math.min(100, Math.round(flesch)));
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllableCount = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllableCount++;
      }
      previousWasVowel = isVowel;
    }
    
    if (word.endsWith('e')) syllableCount--;
    return Math.max(1, syllableCount);
  }

  private async calculateCompetitorGap(
    url: string,
    keyword: string,
    yourWordCount: number
  ): Promise<number> {
    try {
      if (!this.serper) return 0;

      const results = await this.serper.search(keyword, 10);
      const competitors = results.filter(r => !r.link.includes(new URL(url).hostname));
      
      // Estimate competitor word counts (avg ~1500)
      const avgCompetitorWordCount = 1500;
      
      // Your advantage/disadvantage
      const gap = ((yourWordCount - avgCompetitorWordCount) / avgCompetitorWordCount) * 100;
      
      return Math.round(gap);
    } catch (error) {
      return 0;
    }
  }

  private identifyIssues(
    doc: Document,
    content: string,
    wordCount: number,
    eeat: EEATSignals,
    serp: SERPFeatureAnalysis
  ): Array<{ severity: 'critical' | 'warning' | 'info'; message: string }> {
    const issues: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }> = [];

    // Title issues
    const title = doc.querySelector('title')?.textContent || '';
    if (!title) issues.push({ severity: 'critical', message: 'Missing title tag' });
    else if (title.length < 30) issues.push({ severity: 'warning', message: 'Title too short (< 30 chars)' });
    else if (title.length > 60) issues.push({ severity: 'warning', message: 'Title too long (> 60 chars)' });

    // Meta description
    const meta = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    if (!meta) issues.push({ severity: 'critical', message: 'Missing meta description' });
    else if (meta.length < 120) issues.push({ severity: 'warning', message: 'Meta description too short' });

    // Word count
    if (wordCount < 300) issues.push({ severity: 'critical', message: 'Content too thin (< 300 words)' });
    else if (wordCount < 600) issues.push({ severity: 'warning', message: 'Content could be more comprehensive' });

    // Headings
    const h1Count = doc.querySelectorAll('h1').length;
    if (h1Count === 0) issues.push({ severity: 'critical', message: 'Missing H1 tag' });
    else if (h1Count > 1) issues.push({ severity: 'warning', message: 'Multiple H1 tags detected' });

    // Images
    const images = doc.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt')).length;
    if (imagesWithoutAlt > 0) {
      issues.push({ severity: 'warning', message: `${imagesWithoutAlt} images missing alt text` });
    }

    // E-E-A-T
    if (!eeat.hasAuthorBio) issues.push({ severity: 'info', message: 'No author bio detected' });
    if (!eeat.hasDatePublished) issues.push({ severity: 'info', message: 'No publish date detected' });

    // SERP Features
    if (!serp.hasStructuredData) issues.push({ severity: 'warning', message: 'Missing structured data (schema)' });
    if (!serp.paaEligible) issues.push({ severity: 'info', message: 'Add FAQ section for People Also Ask' });

    return issues;
  }

  private generateSuggestions(
    issues: Array<{ severity: string; message: string }>,
    tfIdf: number,
    lsi: string[],
    serp: SERPFeatureAnalysis
  ): Array<{ priority: 'high' | 'medium' | 'low'; action: string }> {
    const suggestions: Array<{ priority: 'high' | 'medium' | 'low'; action: string }> = [];

    // Critical issues = high priority
    issues.filter(i => i.severity === 'critical').forEach(issue => {
      suggestions.push({ priority: 'high', action: issue.message });
    });

    // Keyword optimization
    if (tfIdf < 30) {
      suggestions.push({ priority: 'high', action: 'Increase keyword density (currently low)' });
    }

    // LSI keywords
    if (lsi.length > 0) {
      suggestions.push({
        priority: 'medium',
        action: `Include LSI keywords: ${lsi.slice(0, 5).join(', ')}`
      });
    }

    // SERP features
    if (!serp.featuredSnippetEligible) {
      suggestions.push({
        priority: 'medium',
        action: 'Add concise definition paragraph for featured snippet'
      });
    }

    if (!serp.paaEligible) {
      suggestions.push({
        priority: 'low',
        action: 'Add FAQ section to target People Also Ask'
      });
    }

    return suggestions;
  }

  private calculateOverallScore(metrics: {
    wordCount: number;
    readabilityScore: number;
    tfIdfScore: number;
    eeatScore: number;
    serpScore: number;
    issueCount: number;
  }): number {
    let score = 0;

    // Word count (20 points)
    if (metrics.wordCount >= 2000) score += 20;
    else if (metrics.wordCount >= 1000) score += 15;
    else if (metrics.wordCount >= 500) score += 10;
    else score += 5;

    // Readability (20 points)
    score += (metrics.readabilityScore / 100) * 20;

    // TF-IDF (15 points)
    score += (metrics.tfIdfScore / 100) * 15;

    // E-E-A-T (20 points)
    score += (metrics.eeatScore / 100) * 20;

    // SERP Features (15 points)
    score += (metrics.serpScore / 100) * 15;

    // Deduct for critical issues (10 points max)
    score -= metrics.issueCount * 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}
