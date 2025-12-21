// Real Blue Ocean Gap Analysis with SERP data

import { SerperClient } from './RealAPIClient';

export interface BlueOceanOpportunity {
  topic: string;
  intent: 'informational' | 'commercial' | 'transactional';
  difficulty: number;
  opportunityScore: number;
  searchVolume: number;
  suggestedType: string;
  competitorGap: number;
  relatedKeywords: string[];
  serpFeatures: string[];
}

export class RealBlueOceanAnalyzer {
  private serperClient: SerperClient;

  constructor(serperApiKey: string) {
    this.serperClient = new SerperClient(serperApiKey);
  }

  // Main Blue Ocean analysis
  async findContentGaps(
    nicheTopic: string,
    competitorDomains: string[] = []
  ): Promise<BlueOceanOpportunity[]> {
    try {
      // 1. Get SERP data for main topic
      const mainSerpData = await this.serperClient.search(nicheTopic, 20);
      
      // 2. Extract keywords from SERP features
      const relatedKeywords = this.extractRelatedKeywords(mainSerpData);
      
      // 3. Analyze competitor coverage
      const competitorTopics = await this.analyzeCompetitorCoverage(
        competitorDomains,
        nicheTopic
      );
      
      // 4. Generate keyword variations
      const keywordVariations = this.generateKeywordVariations(nicheTopic);
      
      // 5. Analyze each variation for gaps
      const opportunities: BlueOceanOpportunity[] = [];
      
      for (const keyword of [...keywordVariations, ...relatedKeywords].slice(0, 10)) {
        try {
          const serpData = await this.serperClient.search(keyword, 10);
          
          const opportunity = await this.analyzeKeywordOpportunity(
            keyword,
            serpData,
            competitorTopics,
            competitorDomains
          );
          
          opportunities.push(opportunity);
          
          // Rate limiting - wait between requests
          await new Promise(r => setTimeout(r, 100));
        } catch (error) {
          console.error(`Failed to analyze ${keyword}:`, error);
        }
      }
      
      // 6. Sort by opportunity score
      return opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);
      
    } catch (error) {
      console.error('Blue Ocean analysis failed:', error);
      throw error;
    }
  }

  // Extract related keywords from SERP
  private extractRelatedKeywords(serpData: any): string[] {
    const keywords: string[] = [];
    
    // From related searches
    if (serpData.relatedSearches) {
      serpData.relatedSearches.forEach((search: any) => {
        if (search.query) keywords.push(search.query);
      });
    }
    
    // From People Also Ask
    if (serpData.peopleAlsoAsk) {
      serpData.peopleAlsoAsk.forEach((paa: any) => {
        if (paa.question) {
          // Extract key phrases from questions
          const keyPhrases = paa.question.match(/\b\w{4,}(?:\s+\w{4,}){0,2}\b/g) || [];
          keywords.push(...keyPhrases);
        }
      });
    }
    
    return [...new Set(keywords)].slice(0, 20);
  }

  // Analyze competitor content coverage
  private async analyzeCompetitorCoverage(
    domains: string[],
    nicheTopic: string
  ): Promise<Set<string>> {
    const coveredTopics = new Set<string>();
    
    try {
      const serpData = await this.serperClient.search(nicheTopic, 30);
      
      if (serpData.organic) {
        serpData.organic.forEach((result: any) => {
          // Check if result is from competitor
          const isCompetitor = domains.some(domain => result.link?.includes(domain));
          
          if (isCompetitor) {
            // Extract topics from title and snippet
            const text = `${result.title} ${result.snippet}`.toLowerCase();
            const topics = text.match(/\b\w{4,}(?:\s+\w{4,}){0,2}\b/g) || [];
            topics.forEach(topic => coveredTopics.add(topic));
          }
        });
      }
    } catch (error) {
      console.error('Competitor analysis failed:', error);
    }
    
    return coveredTopics;
  }

  // Generate keyword variations
  private generateKeywordVariations(baseTopic: string): string[] {
    const variations: string[] = [];
    
    // Modifiers
    const prefixes = ['best', 'top', 'how to', 'what is', 'guide to', 'ultimate'];
    const suffixes = ['guide', 'tips', 'for beginners', '2025', 'review', 'comparison'];
    const intents = ['vs', 'alternatives', 'benefits of', 'types of', 'examples of'];
    
    // Generate combinations
    prefixes.forEach(prefix => variations.push(`${prefix} ${baseTopic}`));
    suffixes.forEach(suffix => variations.push(`${baseTopic} ${suffix}`));
    intents.forEach(intent => variations.push(`${baseTopic} ${intent}`));
    
    return variations;
  }

  // Analyze individual keyword opportunity
  private async analyzeKeywordOpportunity(
    keyword: string,
    serpData: any,
    competitorTopics: Set<string>,
    competitorDomains: string[]
  ): Promise<BlueOceanOpportunity> {
    // Calculate difficulty based on competition
    const difficulty = this.calculateDifficulty(serpData, competitorDomains);
    
    // Estimate search volume (from SERP features)
    const searchVolume = this.estimateSearchVolume(serpData);
    
    // Calculate competitor gap
    const competitorGap = this.calculateCompetitorGap(keyword, competitorTopics);
    
    // Determine intent
    const intent = this.determineIntent(keyword);
    
    // Extract SERP features
    const serpFeatures = this.extractSERPFeatures(serpData);
    
    // Calculate opportunity score
    const opportunityScore = this.calculateOpportunityScore({
      difficulty,
      searchVolume,
      competitorGap,
      serpFeatures
    });
    
    // Suggest article type
    const suggestedType = this.suggestArticleType(keyword, intent, serpFeatures);
    
    return {
      topic: keyword,
      intent,
      difficulty,
      opportunityScore,
      searchVolume,
      suggestedType,
      competitorGap,
      relatedKeywords: this.extractRelatedKeywords(serpData).slice(0, 5),
      serpFeatures
    };
  }

  // Calculate keyword difficulty
  private calculateDifficulty(serpData: any, competitorDomains: string[]): number {
    let difficulty = 0;
    
    if (serpData.organic) {
      const results = serpData.organic;
      
      // High authority domains
      const authorityDomains = results.filter((r: any) => 
        /\.(gov|edu|org)$/.test(r.link || '')
      ).length;
      difficulty += authorityDomains * 10;
      
      // Competitor presence
      const competitorPresence = results.filter((r: any) =>
        competitorDomains.some(domain => r.link?.includes(domain))
      ).length;
      difficulty += competitorPresence * 5;
      
      // SERP features (indicate established content)
      if (serpData.answerBox) difficulty += 15;
      if (serpData.knowledgeGraph) difficulty += 20;
      if (serpData.featuredSnippet) difficulty += 10;
    }
    
    return Math.min(difficulty, 100);
  }

  // Estimate search volume from SERP signals
  private estimateSearchVolume(serpData: any): number {
    let volume = 1000; // Base estimate
    
    // More SERP features = higher volume
    if (serpData.answerBox) volume += 500;
    if (serpData.knowledgeGraph) volume += 1000;
    if (serpData.peopleAlsoAsk) volume += 300;
    if (serpData.relatedSearches) volume += 200;
    
    // Number of results
    if (serpData.searchInformation?.totalResults) {
      const total = parseInt(serpData.searchInformation.totalResults.replace(/,/g, ''));
      volume += Math.min(total / 1000, 2000);
    }
    
    return Math.round(volume);
  }

  // Calculate gap vs competitors
  private calculateCompetitorGap(keyword: string, competitorTopics: Set<string>): number {
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    
    // Check how many keyword components are covered by competitors
    const coveredWords = keywordWords.filter(word => competitorTopics.has(word));
    
    // Gap = uncovered percentage
    return Math.round((1 - coveredWords.length / keywordWords.length) * 100);
  }

  // Determine search intent
  private determineIntent(keyword: string): 'informational' | 'commercial' | 'transactional' {
    const lower = keyword.toLowerCase();
    
    // Transactional
    if (/\b(buy|purchase|order|price|cheap|deal|coupon|discount)\b/.test(lower)) {
      return 'transactional';
    }
    
    // Commercial
    if (/\b(best|top|review|compare|vs|alternative)\b/.test(lower)) {
      return 'commercial';
    }
    
    // Informational (default)
    return 'informational';
  }

  // Extract SERP features
  private extractSERPFeatures(serpData: any): string[] {
    const features: string[] = [];
    
    if (serpData.answerBox) features.push('Answer Box');
    if (serpData.knowledgeGraph) features.push('Knowledge Graph');
    if (serpData.featuredSnippet) features.push('Featured Snippet');
    if (serpData.peopleAlsoAsk) features.push('People Also Ask');
    if (serpData.relatedSearches) features.push('Related Searches');
    if (serpData.topStories) features.push('Top Stories');
    if (serpData.images) features.push('Image Pack');
    if (serpData.videos) features.push('Video Results');
    
    return features;
  }

  // Calculate opportunity score
  private calculateOpportunityScore(params: {
    difficulty: number;
    searchVolume: number;
    competitorGap: number;
    serpFeatures: string[];
  }): number {
    const { difficulty, searchVolume, competitorGap, serpFeatures } = params;
    
    // Normalize search volume (0-100)
    const volumeScore = Math.min((searchVolume / 5000) * 100, 100);
    
    // Lower difficulty = higher opportunity
    const difficultyScore = 100 - difficulty;
    
    // More gap = higher opportunity
    const gapScore = competitorGap;
    
    // SERP features indicate potential
    const featureScore = Math.min(serpFeatures.length * 10, 30);
    
    // Weighted score
    const score = 
      volumeScore * 0.30 +
      difficultyScore * 0.35 +
      gapScore * 0.25 +
      featureScore * 0.10;
    
    return Math.round(score);
  }

  // Suggest article type based on analysis
  private suggestArticleType(
    keyword: string,
    intent: string,
    serpFeatures: string[]
  ): string {
    const lower = keyword.toLowerCase();
    
    if (/^(what is|what are|define)/.test(lower)) return 'Definition Guide';
    if (/^(how to|how do)/.test(lower)) return 'Step-by-Step Tutorial';
    if (/\b(best|top \d+)/.test(lower)) return 'Listicle / Roundup';
    if (/\bvs\b/.test(lower)) return 'Comparison Article';
    if (/\b(guide|complete|ultimate)/.test(lower)) return 'Ultimate Guide';
    if (/\b(tips|tricks|hacks)/.test(lower)) return 'Tips & Tricks';
    if (/\b(review|reviews)/.test(lower)) return 'Review Article';
    if (/\b(example|examples)/.test(lower)) return 'Examples Showcase';
    if (serpFeatures.includes('People Also Ask')) return 'FAQ Article';
    
    return intent === 'informational' ? 'Informational Article' :
           intent === 'commercial' ? 'Commercial Content' :
           'Product/Service Page';
  }
}
