// Real AI Content Generation with SEO/AEO optimization

import { GeminiClient } from './RealAPIClient';
import { SerperClient } from './RealAPIClient';

export interface GeneratedContent {
  title: string;
  content: string;
  metaDescription: string;
  focusKeyword: string;
  seoScore: number;
  aeoScore: number;
  eeatScore: number;
  schema: any;
  headings: string[];
  internalLinks: string[];
  faq: Array<{ question: string; answer: string }>;
}

export class RealContentGenerator {
  private geminiClient: GeminiClient;
  private serperClient: SerperClient;

  constructor(geminiApiKey: string, serperApiKey: string) {
    this.geminiClient = new GeminiClient(geminiApiKey);
    this.serperClient = new SerperClient(serperApiKey);
  }

  // Main content generation
  async generate(
    keyword: string,
    wordCount = 1500,
    tone: 'professional' | 'casual' | 'technical' = 'professional'
  ): Promise<GeneratedContent> {
    try {
      // 1. Research phase - gather SERP data
      console.log('Researching keyword...');
      const research = await this.researchKeyword(keyword);
      
      // 2. Build SOTA prompt
      const prompt = this.buildSOTAPrompt(keyword, wordCount, tone, research);
      
      // 3. Generate content with AI
      console.log('Generating content with AI...');
      const rawContent = await this.geminiClient.generateContent(prompt);
      
      // 4. Structure and optimize content
      console.log('Optimizing content...');
      const optimized = this.optimizeContent(rawContent, keyword, research);
      
      // 5. Generate metadata
      const metadata = await this.generateMetadata(keyword, optimized.content);
      
      // 6. Generate schema markup
      const schema = this.generateSchema(keyword, optimized.content, metadata);
      
      // 7. Extract FAQ for AEO
      const faq = this.extractFAQ(optimized.content);
      
      // 8. Calculate scores
      const scores = this.calculateScores(optimized.content, keyword, faq, schema);
      
      return {
        title: metadata.title,
        content: optimized.content,
        metaDescription: metadata.metaDescription,
        focusKeyword: keyword,
        seoScore: scores.seo,
        aeoScore: scores.aeo,
        eeatScore: scores.eeat,
        schema,
        headings: optimized.headings,
        internalLinks: [],
        faq
      };
      
    } catch (error) {
      console.error('Content generation failed:', error);
      throw error;
    }
  }

  // Research keyword using SERP data
  private async researchKeyword(keyword: string): Promise<any> {
    try {
      const serpData = await this.serperClient.search(keyword, 10);
      
      return {
        topResults: serpData.organic?.slice(0, 3) || [],
        peopleAlsoAsk: serpData.peopleAlsoAsk || [],
        relatedSearches: serpData.relatedSearches || [],
        answerBox: serpData.answerBox || null,
        knowledgeGraph: serpData.knowledgeGraph || null
      };
    } catch (error) {
      console.error('Research failed:', error);
      return { topResults: [], peopleAlsoAsk: [], relatedSearches: [] };
    }
  }

  // Build SOTA prompt for AI
  private buildSOTAPrompt(
    keyword: string,
    wordCount: number,
    tone: string,
    research: any
  ): string {
    const paaQuestions = research.peopleAlsoAsk
      .map((q: any) => q.question)
      .join('\n- ');
    
    const relatedTopics = research.relatedSearches
      .map((s: any) => s.query)
      .join(', ');

    return `You are an elite SEO/AEO content writer. Create comprehensive, engaging content optimized for both search engines AND answer engines (ChatGPT, Perplexity, Gemini).

TARGET KEYWORD: "${keyword}"
WORD COUNT: ${wordCount} words
TONE: ${tone}

CONTENT REQUIREMENTS:

1. STRUCTURE:
   - Compelling H1 title with keyword
   - Clear H2 sections with descriptive headings
   - H3 subsections for depth
   - Short paragraphs (3-4 sentences max)
   - Bullet points for lists
   - Include definition in first paragraph

2. SEO OPTIMIZATION:
   - Natural keyword placement (1-2% density)
   - LSI keywords: ${relatedTopics}
   - Internal linking opportunities
   - Meta description worthy excerpt in first 160 chars

3. AEO OPTIMIZATION (Answer Engine):
   - Direct, quotable answers
   - Question-answer format sections
   - Conversational but authoritative tone
   - Include these PAA questions:
${paaQuestions}

4. E-E-A-T SIGNALS:
   - Expert perspective with "In our experience..."
   - Data/statistics where relevant
   - Authoritative statements
   - Clear, factual information

5. CONTENT DEPTH:
   - Comprehensive coverage
   - Unique insights
   - Practical examples
   - Actionable takeaways

OUTPUT FORMAT:
# [H1 Title]

[Opening paragraph with definition and keyword]

## [H2 Section]

[Content...]

### [H3 Subsection]

[Content...]

## Frequently Asked Questions

### [Question]?

[Answer]

## Conclusion

[Summary with call to action]

Generate the content now:`;
  }

  // Optimize generated content
  private optimizeContent(rawContent: string, keyword: string, research: any): {
    content: string;
    headings: string[];
  } {
    let content = rawContent;
    
    // Extract headings
    const headings: string[] = [];
    const headingMatches = content.match(/^#{1,3}\s+.+$/gm) || [];
    headingMatches.forEach(h => headings.push(h.replace(/^#+\s+/, '')));
    
    // Ensure keyword in first paragraph
    if (!content.substring(0, 500).toLowerCase().includes(keyword.toLowerCase())) {
      const firstPara = content.match(/^[^#\n]+/) || [''];
      content = content.replace(firstPara[0], `${keyword} - ${firstPara[0]}`);
    }
    
    // Add schema-friendly FAQ section if not present
    if (!content.includes('## Frequently Asked Questions') && research.peopleAlsoAsk?.length > 0) {
      const faqSection = '\n\n## Frequently Asked Questions\n\n' +
        research.peopleAlsoAsk.slice(0, 3).map((paa: any) => 
          `### ${paa.question}\n\n${paa.snippet || 'Answer based on content above.'}`
        ).join('\n\n');
      
      // Insert before conclusion
      if (content.includes('## Conclusion')) {
        content = content.replace('## Conclusion', faqSection + '\n\n## Conclusion');
      } else {
        content += faqSection;
      }
    }
    
    return { content, headings };
  }

  // Generate metadata
  private async generateMetadata(keyword: string, content: string): Promise<{
    title: string;
    metaDescription: string;
  }> {
    const prompt = `Create SEO-optimized metadata for this content:

KEYWORD: "${keyword}"
CONTENT EXCERPT: ${content.substring(0, 500)}...

Generate:
1. TITLE (50-60 chars, include keyword, compelling)
2. META DESCRIPTION (150-160 chars, include keyword, action-oriented)

Format:
TITLE: [title here]
DESCRIPTION: [description here]`;

    try {
      const response = await this.geminiClient.generateContent(prompt);
      const titleMatch = response.match(/TITLE:\s*(.+)/i);
      const descMatch = response.match(/DESCRIPTION:\s*(.+)/i);
      
      return {
        title: titleMatch ? titleMatch[1].trim() : `${keyword} - Complete Guide 2025`,
        metaDescription: descMatch ? descMatch[1].trim() : `Discover everything about ${keyword}. Expert insights, tips, and strategies.`
      };
    } catch (error) {
      return {
        title: `${keyword} - Complete Guide 2025`,
        metaDescription: `Comprehensive guide to ${keyword}. Learn from experts.`
      };
    }
  }

  // Generate schema markup
  private generateSchema(keyword: string, content: string, metadata: any): any {
    const faq = this.extractFAQ(content);
    
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: metadata.title,
          description: metadata.metaDescription,
          keywords: keyword,
          articleBody: content.substring(0, 1000),
          author: {
            '@type': 'Person',
            name: 'Expert Team'
          },
          datePublished: new Date().toISOString(),
          dateModified: new Date().toISOString()
        }
      ]
    };
    
    // Add FAQ schema if questions exist
    if (faq.length > 0) {
      schema['@graph'].push({
        '@type': 'FAQPage',
        mainEntity: faq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      });
    }
    
    return schema;
  }

  // Extract FAQ from content
  private extractFAQ(content: string): Array<{ question: string; answer: string }> {
    const faq: Array<{ question: string; answer: string }> = [];
    
    // Match FAQ section
    const faqMatch = content.match(/## Frequently Asked Questions([\s\S]*?)(?=##|$)/);
    if (!faqMatch) return faq;
    
    const faqSection = faqMatch[1];
    const questions = faqSection.match(/###\s+(.+?)\?[\s\S]*?(?=###|$)/g) || [];
    
    questions.forEach(block => {
      const questionMatch = block.match(/###\s+(.+?)\?/);
      const answerMatch = block.match(/\?\s+([\s\S]+?)(?=###|$)/);
      
      if (questionMatch && answerMatch) {
        faq.push({
          question: questionMatch[1].trim() + '?',
          answer: answerMatch[1].trim()
        });
      }
    });
    
    return faq;
  }

  // Calculate content scores
  private calculateScores(
    content: string,
    keyword: string,
    faq: any[],
    schema: any
  ): { seo: number; aeo: number; eeat: number } {
    const wordCount = content.split(/\s+/).length;
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const keywordDensity = (keywordCount / wordCount) * 100;
    
    // SEO Score
    let seo = 0;
    if (wordCount > 1500) seo += 30;
    if (keywordDensity > 0.5 && keywordDensity < 2.5) seo += 20;
    if (content.match(/^#{1,3}\s+/gm)?.length || 0 > 5) seo += 20;
    if (schema) seo += 15;
    if (faq.length > 0) seo += 15;
    
    // AEO Score
    let aeo = 0;
    if (faq.length > 0) aeo += 30;
    if (/in our experience|we found|according to|research shows/i.test(content)) aeo += 25;
    if (content.split(/[.!?]+/).length / wordCount < 0.08) aeo += 20; // Short sentences
    if (/\?/.test(content)) aeo += 15;
    if (schema['@graph'].some((s: any) => s['@type'] === 'FAQPage')) aeo += 10;
    
    // E-E-A-T Score
    let eeat = 0;
    if (/expert|professional|certified|experience|years/i.test(content)) eeat += 25;
    if (/\d+%|\d+ (percent|million|billion)/.test(content)) eeat += 20;
    if (/according to|research|study|source/i.test(content)) eeat += 20;
    if (faq.length > 0) eeat += 15;
    if (schema) eeat += 20;
    
    return {
      seo: Math.min(seo, 100),
      aeo: Math.min(aeo, 100),
      eeat: Math.min(eeat, 100)
    };
  }
}
