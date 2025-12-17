// Multi-Pass Content Refinement Service - SOTA Enhancement
import { AIConfig, AIStrategy, ReferenceData } from './types';
import { calculateInformationGain } from './citationService';

export interface ContentRefinement {
  informationGain: number;
  uniqueInsights: string[];
  competitorGaps: string[];
  depthScore: number;
}

export interface RefinedContent {
  html: string;
  gainScore: number;
  metadata: ContentMetadata;
}

export interface ContentMetadata {
  originalLength: number;
  refinedLength: number;
  uniqueSentences: number;
  depthLevel: string;
  readabilityScore: number;
}

// Stage 1: Extract competitor insights and identify gaps
export const analyzeCompetitorContent = async (
  draftContent: string,
  competitorContent: string[],
  aiCallFn: (prompt: string, config: AIConfig) => Promise<string>
): Promise<ContentRefinement> => {
  const competitorSnippets = competitorContent.slice(0, 5).join('\n---\n');
  
  const analysisPrompt = `
    ROLE: Competitive Content Analyst - SEO Expert
    TASK: Identify information gaps and unique angles between draft and competitors
    
    DRAFT CONTENT (First 3000 chars):
    ${draftContent.substring(0, 3000)}
    
    COMPETITOR CONTENT:
    ${competitorSnippets}
    
    OUTPUT STRICTLY AS JSON:
    {
      "missingTopics": ["topic1", "topic2", "topic3"],
      "overusedPhrases": ["phrase1", "phrase2"],
      "uniqueAngles": ["angle1", "angle2"],
      "depthScore": 0-100,
      "gapAnalysis": "Brief description of content gaps"
    }
    
    CRITICAL: Return ONLY valid JSON, no markdown formatting.
  `;
  
  try {
    const analysisJson = await aiCallFn(analysisPrompt, {} as AIConfig);
    const analysis = JSON.parse(analysisJson);
    
    return {
      informationGain: analysis.depthScore || 60,
      uniqueInsights: analysis.uniqueAngles || [],
      competitorGaps: analysis.missingTopics || [],
      depthScore: analysis.depthScore || 60
    };
  } catch (e) {
    console.warn('Analysis parsing error, using defaults:', e);
    return {
      informationGain: 60,
      uniqueInsights: [],
      competitorGaps: [],
      depthScore: 60
    };
  }
};

// Stage 2: Inject missing insights with specific data
export const enrichContentWithData = async (
  originalContent: string,
  gaps: ContentRefinement,
  aiCallFn: (prompt: string, config: AIConfig) => Promise<string>
): Promise<string> => {
  if (!gaps.competitorGaps || gaps.competitorGaps.length === 0) {
    return originalContent;
  }
  
  const enrichmentPrompt = `
    ROLE: Content Enrichment Expert
    TASK: Add missing insights with SPECIFIC data (numbers, dates, specs)
    
    ORIGINAL CONTENT:
    ${originalContent.substring(0, 2500)}
    
    ADD THESE TOPICS WITH SPECIFIC DATA:
    ${gaps.competitorGaps.slice(0, 3).join(', ')}
    
    REQUIREMENTS:
    - Add 2-3 sentences per topic with SPECIFIC data (numbers, dates, specs)
    - Use transition phrases: "Interestingly," "According to tests," "Data shows"
    - Insert naturally after relevant H3 sections
    - NO generic statements
    - Keep product names and specs EXACT
    - Maintain HTML formatting if present
    
    RETURN: Enriched content with data-driven additions.
  `;
  
  try {
    return await aiCallFn(enrichmentPrompt, {} as AIConfig);
  } catch (e) {
    console.warn('Enrichment failed, returning original:', e);
    return originalContent;
  }
};

// Stage 3: Humanization pass - varied sentence structure
export const humanizeContent = async (
  content: string,
  aiCallFn: (prompt: string, config: AIConfig) => Promise<string>
): Promise<string> => {
  const humanizePrompt = `
    ROLE: Content Humanization Specialist
    TASK: Vary sentence structure and tone while preserving ALL facts
    
    CONTENT TO HUMANIZE:
    ${content.substring(0, 2500)}
    
    HUMANIZATION REQUIREMENTS:
    - Vary sentence length (mix 8-25 word sentences)
    - Start 30% of sentences with transitions/questions
    - Add 2-3 parenthetical asides naturally
    - Use contractions where natural ("you're", "it's", "don't")
    - Break up repetitive paragraph patterns
    - Add occasional rhetorical questions
    
    CRITICAL REQUIREMENTS:
    - Keep ALL product names EXACT
    - Keep ALL specs/numbers EXACT
    - Keep ALL prices EXACT
    - Maintain HTML structure
    - No hallucinated facts
    
    RETURN: Humanized content maintaining all original facts.
  `;
  
  try {
    return await aiCallFn(humanizePrompt, {} as AIConfig);
  } catch (e) {
    console.warn('Humanization failed, returning original:', e);
    return content;
  }
};

// Calculate readability score
export const calculateReadabilityScore = (content: string): number => {
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanContent.split(/\s+/).filter(w => w.length > 0);
  const avgWordsPerSentence = words.length / sentences.length;
  const syllables = estimateSyllables(cleanContent);
  const avgSyllablesPerWord = syllables / words.length;
  
  // Flesch-Kincaid Grade Level calculation
  const grade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  const readabilityScore = Math.max(0, Math.min(100, (16 - grade) * 6.25));
  
  return Math.round(readabilityScore);
};

// Helper: Estimate syllables
const estimateSyllables = (text: string): number => {
  const syllableRegex = /[aeiouy]{1,2}/gi;
  const syllables = text.match(syllableRegex) || [];
  return Math.max(1, syllables.length);
};

// Main refinement orchestrator
export const refineContentWithMultiPass = async (
  draftContent: string,
  competitorContent: ReferenceData[],
  aiCallFn: (prompt: string, config: AIConfig) => Promise<string>,
  config: AIConfig
): Promise<RefinedContent> => {
  console.log('Starting 3-stage content refinement...');
  
  // Stage 1: Analyze
  const competitorSnippets = competitorContent.map(c => c.snippet).filter(s => s);
  const analysis = await analyzeCompetitorContent(draftContent, competitorSnippets, aiCallFn);
  console.log(`Stage 1 complete - Depth Score: ${analysis.depthScore}`);
  
  // Stage 2: Enrich
  let enrichedContent = await enrichContentWithData(draftContent, analysis, aiCallFn);
  console.log('Stage 2 complete - Content enriched with data');
  
  // Stage 3: Humanize
  let finalContent = await humanizeContent(enrichedContent, aiCallFn);
  console.log('Stage 3 complete - Content humanized');
  
  // Calculate metrics
  const gainScore = calculateInformationGain(finalContent, competitorSnippets.join(' '));
  const readabilityScore = calculateReadabilityScore(finalContent);
  const metadata: ContentMetadata = {
    originalLength: draftContent.length,
    refinedLength: finalContent.length,
    uniqueSentences: (finalContent.match(/[.!?]+/g) || []).length,
    depthLevel: analysis.depthScore > 75 ? 'Deep' : analysis.depthScore > 50 ? 'Medium' : 'Basic',
    readabilityScore
  };
  
  return {
    html: finalContent,
    gainScore,
    metadata
  };
};
