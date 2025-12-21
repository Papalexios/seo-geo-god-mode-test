// REAL Blue Ocean Gap Analysis
import { SerperService } from './SerperService';
import { GeminiService } from './GeminiService';

export interface BlueOceanTopic {
  topic: string;
  intent: 'informational' | 'commercial' | 'transactional';
  difficulty: number;
  opportunityScore: number;
  suggestedType: string;
  searchVolume: number;
  gap: string;
  competitorCoverage: number;
}

export class BlueOceanAnalyzer {
  private serper: SerperService;
  private gemini: GeminiService;

  constructor(serperKey: string, geminiKey: string) {
    this.serper = new SerperService(serperKey);
    this.gemini = new GeminiService(geminiKey);
  }

  async findContentGaps(
    nicheTopic: string,
    competitorDomains: string[] = []
  ): Promise<BlueOceanTopic[]> {
    try {
      // 1. Get SERP data
      const serpResults = await this.serper.search(nicheTopic, 100);
      
      // 2. Get related searches for keyword variations
      const relatedSearches = await this.serper.getRelatedSearches(nicheTopic);
      
      // 3. Analyze competitor coverage
      const competitorTopics = await this.analyzeCompetitorCoverage(
        serpResults,
        competitorDomains
      );
      
      // 4. Generate topic variations
      const topicVariations = await this.generateTopicVariations(nicheTopic);
      
      // 5. Find gaps
      const gaps = await this.identifyGaps(
        topicVariations,
        competitorTopics,
        serpResults
      );
      
      // 6. Score opportunities
      const opportunities = await Promise.all(
        gaps.map(gap => this.scoreOpportunity(gap, serpResults))
      );
      
      return opportunities
        .sort((a, b) => b.opportunityScore - a.opportunityScore)
        .slice(0, 10);
    } catch (error) {
      console.error('Blue Ocean Analysis Error:', error);
      throw error;
    }
  }

  private async analyzeCompetitorCoverage(
    serpResults: any[],
    competitorDomains: string[]
  ): Promise<Set<string>> {
    const topics = new Set<string>();
    
    serpResults.forEach(result => {
      const domain = new URL(result.link).hostname;
      if (competitorDomains.length === 0 || competitorDomains.some(c => domain.includes(c))) {
        // Extract topics from titles
        const words = result.title.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 4) topics.add(word);
        });
      }
    });
    
    return topics;
  }

  private async generateTopicVariations(nicheTopic: string): Promise<string[]> {
    const variations = [
      `best ${nicheTopic}`,
      `${nicheTopic} for beginners`,
      `how to choose ${nicheTopic}`,
      `${nicheTopic} guide`,
      `${nicheTopic} vs alternatives`,
      `top ${nicheTopic}`,
      `${nicheTopic} comparison`,
      `${nicheTopic} reviews`,
      `${nicheTopic} tips`,
      `${nicheTopic} mistakes to avoid`,
      `${nicheTopic} benefits`,
      `what is ${nicheTopic}`,
      `${nicheTopic} explained`,
      `${nicheTopic} for professionals`,
      `advanced ${nicheTopic}`
    ];

    return variations;
  }

  private async identifyGaps(
    variations: string[],
    competitorTopics: Set<string>,
    serpResults: any[]
  ): Promise<Array<{ keyword: string; coverage: number }>> {
    const gaps: Array<{ keyword: string; coverage: number }> = [];

    for (const variation of variations) {
      // Check how many competitors cover this topic
      const words = variation.toLowerCase().split(/\s+/);
      let coverageCount = 0;
      
      words.forEach(word => {
        if (competitorTopics.has(word)) coverageCount++;
      });
      
      const coveragePercent = (coverageCount / words.length) * 100;
      
      // Low coverage = high opportunity
      if (coveragePercent < 60) {
        gaps.push({ keyword: variation, coverage: coveragePercent });
      }
    }

    return gaps;
  }

  private async scoreOpportunity(
    gap: { keyword: string; coverage: number },
    serpResults: any[]
  ): Promise<BlueOceanTopic> {
    // Get intent
    const intent = await this.serper.analyzeKeywordIntent(gap.keyword);
    
    // Estimate search volume
    const searchVolume = this.serper.estimateSearchVolume(gap.keyword);
    
    // Calculate difficulty
    const difficulty = this.serper.calculateDifficulty(serpResults);
    
    // Calculate opportunity score
    const gapScore = (100 - gap.coverage); // Higher gap = more opportunity
    const volumeScore = Math.min(100, searchVolume / 100); // Normalize volume
    const difficultyScore = (100 - difficulty); // Lower difficulty = better
    
    const opportunityScore = Math.round(
      (gapScore * 0.4) + (volumeScore * 0.3) + (difficultyScore * 0.3)
    );

    // Determine suggested article type
    const suggestedType = this.determinArticleType(gap.keyword, intent);

    return {
      topic: gap.keyword,
      intent: intent as any,
      difficulty,
      opportunityScore,
      suggestedType,
      searchVolume,
      gap: `${Math.round(100 - gap.coverage)}% untapped`,
      competitorCoverage: Math.round(gap.coverage)
    };
  }

  private determinArticleType(keyword: string, intent: string): string {
    const lower = keyword.toLowerCase();
    
    if (lower.includes('best') || lower.includes('top')) return 'Listicle / Roundup';
    if (lower.includes('vs') || lower.includes('comparison')) return 'Comparison Article';
    if (lower.includes('how to') || lower.includes('guide')) return 'Step-by-Step Guide';
    if (lower.includes('what is') || lower.includes('explained')) return 'Definitive Guide';
    if (lower.includes('review')) return 'Review Article';
    if (lower.includes('tips') || lower.includes('mistakes')) return 'Tips & Tricks';
    if (intent === 'commercial') return 'Buyer\'s Guide';
    if (intent === 'transactional') return 'Product Page';
    
    return 'Ultimate Guide';
  }
}
