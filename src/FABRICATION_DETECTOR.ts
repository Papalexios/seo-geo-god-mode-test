// FABRICATION_DETECTOR.ts - Detects phantom statistics, fabricated claims, AI fingerprints
// SOTA Quality Gate for eliminating low-quality, unreliable content

interface FabricationAnalysis {
  isFabricated: boolean;
  confidence: number;
  violations: string[];
  aiFingerprints: string[];
  phantomStatistics: string[];
  fabricatedCitations: string[];
  recommendations: string[];
}

interface StatisticPattern {
  pattern: RegExp;
  type: string;
  severity: 'high' | 'medium' | 'low';
}

export class FabricationDetector {
  private phantomStatisticPatterns: StatisticPattern[] = [
    {
      pattern: /(\d+)%?\s+of\s+(people|users|consumers|studies)\s+(say|report|claim|state)/gi,
      type: 'unverified_percentage',
      severity: 'high'
    },
    {
      pattern: /research\s+shows|studies\s+prove|scientists\s+found(?!\s+(?:in|by|at|published))/gi,
      type: 'phantom_research',
      severity: 'high'
    },
    {
      pattern: /according\s+to\s+(?!sources|experts|research|studies)([^,]+),/gi,
      type: 'unverified_source',
      severity: 'medium'
    },
    {
      pattern: /doctors?\s+recommend|health\s+experts?\s+agree|nutritionists?\s+suggest(?!\s+that|:\s*)/gi,
      type: 'phantom_endorsement',
      severity: 'high'
    }
  ];

  private aiFingerprints: RegExp[] = [
    /^(in\s+today's|in\s+this|in\s+our)\s+digital\s+age/i,
    /\b(moreover|furthermore|in\s+addition)\b/g,
    /leverage|utilize|optimize/gi,
    /^(the\s+importance\s+of|the\s+benefits\s+of)/i
  ];

  analyzeContent(content: string): FabricationAnalysis {
    const violations: string[] = [];
    const aiFingerprints: string[] = [];
    const phantomStatistics: string[] = [];
    const fabricatedCitations: string[] = [];
    const recommendations: string[] = [];

    // Detect phantom statistics
    for (const pattern of this.phantomStatisticPatterns) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        matches.forEach(match => {
          phantomStatistics.push(`[${pattern.type}] "${match.substring(0, 60)}..."`);
          violations.push(`Phantom statistic: ${pattern.type} (${pattern.severity})`);
        });
      }
    }

    // Detect AI fingerprints
    for (const fingerprint of this.aiFingerprints) {
      if (fingerprint.test(content)) {
        aiFingerprints.push(fingerprint.source);
        violations.push(`AI fingerprint detected: ${fingerprint.source}`);
      }
    }

    // Detect uncited health claims
    const healthClaimPattern = /(?:cures?|treats|prevents?|boosts?)\s+(?:disease|condition|illness|symptom|health)/gi;
    const healthMatches = content.match(healthClaimPattern) || [];
    if (healthMatches.length > 0) {
      const citationRequired = healthMatches.some(claim => {
        const claimIndex = content.indexOf(claim);
        const followingText = content.substring(claimIndex, claimIndex + 150);
        return !/\[.*?\]|citations?|sources?|research|studies?|proven|evidence/i.test(followingText);
      });
      if (citationRequired) {
        violations.push('Health claims detected without proper citations');
        recommendations.push('Add peer-reviewed sources for all health-related claims');
      }
    }

    const confidenceFactors = {
      hasPhantomStats: phantomStatistics.length > 0 ? 0.9 : 0,
      hasAIFingerprints: aiFingerprints.length > 2 ? 0.8 : aiFingerprints.length > 0 ? 0.4 : 0,
      uncitedHealthClaims: healthMatches.length > 0 && violations.some(v => v.includes('Health claims')) ? 0.9 : 0
    };

    const confidence = Math.min(1, Object.values(confidenceFactors).reduce((a, b) => Math.max(a, b), 0));
    const isFabricated = confidence > 0.5;

    if (isFabricated) {
      recommendations.push('Rewrite with verified statistics and citations');
      recommendations.push('Remove AI-generated patterns, use natural language');
      recommendations.push('Add proper source attribution for all claims');
    }

    return {
      isFabricated,
      confidence,
      violations,
      aiFingerprints,
      phantomStatistics,
      fabricatedCitations,
      recommendations
    };
  }

  passesQualityGate(content: string, threshold: number = 0.5): boolean {
    const analysis = this.analyzeContent(content);
    return analysis.confidence <= threshold;
  }

  generateReport(content: string): string {
    const analysis = this.analyzeContent(content);
    let report = '# CONTENT QUALITY ANALYSIS\n\n';
    report += `**Fabrication Risk:** ${(analysis.confidence * 100).toFixed(1)}%\n`;
    report += `**Status:** ${analysis.isFabricated ? '❌ REJECTED' : '✅ APPROVED'}\n\n`;
    
    if (analysis.violations.length > 0) {
      report += '## Violations\n';
      analysis.violations.forEach(v => report += `- ${v}\n`);
    }

    if (analysis.recommendations.length > 0) {
      report += '\n## Recommendations\n';
      analysis.recommendations.forEach(r => report += `- ${r}\n`);
    }

    return report;
  }
}

export default FabricationDetector;
