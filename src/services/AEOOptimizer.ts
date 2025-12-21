// Answer Engine Optimization (AEO)
export interface AEOAnalysis {
  score: number;
  directAnswers: string[];
  qaPairs: Array<{ question: string; answer: string }>;
  citabilityScore: number;
  conversationalScore: number;
  factDensity: number;
  recommendations: string[];
}

export class AEOOptimizer {
  analyzeForAnswerEngines(content: string, title: string): AEOAnalysis {
    const directAnswers = this.extractDirectAnswers(content);
    const qaPairs = this.identifyQAPairs(content);
    const citabilityScore = this.calculateCitability(content);
    const conversationalScore = this.analyzeConversationalTone(content);
    const factDensity = this.analyzeFacts(content);
    
    const score = this.calculateAEOScore({
      directAnswers: directAnswers.length,
      qaPairs: qaPairs.length,
      citabilityScore,
      conversationalScore,
      factDensity
    });

    const recommendations = this.generateRecommendations({
      directAnswers,
      qaPairs,
      citabilityScore,
      conversationalScore
    });

    return {
      score,
      directAnswers,
      qaPairs,
      citabilityScore,
      conversationalScore,
      factDensity,
      recommendations
    };
  }

  private extractDirectAnswers(content: string): string[] {
    const answers: string[] = [];
    const sentences = content.split(/[.!]+/);
    
    // Look for definition patterns
    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase().trim();
      
      // "X is ..." pattern
      if (lower.match(/^[a-z\s]+is\s+/)) {
        if (sentence.length < 200 && sentence.length > 20) {
          answers.push(sentence.trim());
        }
      }
      
      // "X refers to ..." pattern
      if (lower.includes('refers to') || lower.includes('means')) {
        if (sentence.length < 200) {
          answers.push(sentence.trim());
        }
      }
    });

    return answers.slice(0, 5);
  }

  private identifyQAPairs(content: string): Array<{ question: string; answer: string }> {
    const pairs: Array<{ question: string; answer: string }> = [];
    const paragraphs = content.split(/\n\n+/);
    
    for (let i = 0; i < paragraphs.length - 1; i++) {
      const para = paragraphs[i].trim();
      const nextPara = paragraphs[i + 1].trim();
      
      // If paragraph ends with ?, next one is likely the answer
      if (para.endsWith('?') && nextPara.length > 20 && nextPara.length < 300) {
        pairs.push({
          question: para,
          answer: nextPara.split(/[.!]/)[0] + '.' // First sentence
        });
      }
    }

    return pairs.slice(0, 10);
  }

  private calculateCitability(content: string): number {
    let score = 0;

    // Has specific numbers/statistics
    const numbers = content.match(/\d+%|\d+\.\d+|\$\d+/g);
    if (numbers && numbers.length > 5) score += 25;

    // Has year references (recency)
    const years = content.match(/20\d{2}/g);
    if (years && years.some(y => parseInt(y) >= 2023)) score += 25;

    // Has attribution phrases
    const attributions = ['according to', 'research shows', 'study found', 'expert says'];
    if (attributions.some(attr => content.toLowerCase().includes(attr))) score += 25;

    // Has clear structure (headings implied)
    const hasHeadings = content.split('\n').some(line => 
      line.trim().length < 60 && line.trim().length > 0 && !line.endsWith('.')
    );
    if (hasHeadings) score += 25;

    return score;
  }

  private analyzeConversationalTone(content: string): number {
    let score = 100;

    // Check for conversational elements
    const text = content.toLowerCase();
    
    // Has questions
    const questionCount = (content.match(/\?/g) || []).length;
    if (questionCount === 0) score -= 20;

    // Uses "you" (direct address)
    if (!text.includes('you')) score -= 20;

    // Avoids passive voice (simplified check)
    const passiveIndicators = ['was', 'were', 'been', 'being'];
    const passiveCount = passiveIndicators.reduce((count, word) => 
      count + (text.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length
    , 0);
    if (passiveCount > 20) score -= 20;

    // Has contractions (informal/conversational)
    if (text.includes("n't") || text.includes("'ll") || text.includes("'re")) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  private analyzeFacts(content: string): number {
    const sentences = content.split(/[.!]+/).filter(s => s.trim().length > 20);
    let factCount = 0;

    sentences.forEach(sentence => {
      // Has numbers
      if (/\d+/.test(sentence)) factCount++;
      
      // Has definitive language
      if (/is|are|was|were|has|have/.test(sentence.toLowerCase())) factCount++;
    });

    const factDensity = (factCount / sentences.length) * 100;
    return Math.min(100, Math.round(factDensity));
  }

  private calculateAEOScore(metrics: {
    directAnswers: number;
    qaPairs: number;
    citabilityScore: number;
    conversationalScore: number;
    factDensity: number;
  }): number {
    let score = 0;

    // Direct answers (20 points)
    score += Math.min(20, metrics.directAnswers * 4);

    // Q&A pairs (20 points)
    score += Math.min(20, metrics.qaPairs * 2);

    // Citability (25 points)
    score += (metrics.citabilityScore / 100) * 25;

    // Conversational (20 points)
    score += (metrics.conversationalScore / 100) * 20;

    // Fact density (15 points)
    score += (metrics.factDensity / 100) * 15;

    return Math.round(score);
  }

  private generateRecommendations(data: {
    directAnswers: string[];
    qaPairs: Array<{ question: string; answer: string }>;
    citabilityScore: number;
    conversationalScore: number;
  }): string[] {
    const recommendations: string[] = [];

    if (data.directAnswers.length < 2) {
      recommendations.push('Add clear, concise definition sentences for direct answers');
    }

    if (data.qaPairs.length < 5) {
      recommendations.push('Include FAQ section with common questions and answers');
    }

    if (data.citabilityScore < 50) {
      recommendations.push('Add statistics, dates, and source attributions');
    }

    if (data.conversationalScore < 60) {
      recommendations.push('Use more conversational tone with direct address ("you")');
    }

    return recommendations;
  }
}
