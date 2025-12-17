// Citation Service - SOTA Enhancement
import { ReferenceData, PAAData } from './types';

export interface Citation {
  id: number;
  url: string;
  title: string;
  domain: string;
  authority: number; // 0-100
  snippet: string;
}

const highAuthDomains = new Set([
  'nytimes.com', 'wsj.com', 'techcrunch.com', 'wired.com',
  'consumerreports.org', 'cnet.com', 'theverge.com', 'wirecutter.com',
  'bbc.com', 'theguardian.com', 'forbes.com', 'medium.com'
]);

export const extractAuthoritySources = async (
  serperResults: ReferenceData[],
  paaQuestions: PAAData[]
): Promise<Citation[]> => {
  const citations: Citation[] = [];
  const seen = new Set<string>();
  let idCounter = 1;
  
  [...serperResults, ...paaQuestions].forEach((ref) => {
    try {
      const domain = new URL(ref.link || ref.url || '').hostname?.replace('www.', '') || '';
      if (!domain || seen.has(domain)) return;
      seen.add(domain);
      
      const authority = highAuthDomains.has(domain) ? 85 : 60;
      citations.push({
        id: idCounter++,
        url: ref.link || ref.url || '',
        title: ref.title || ref.question || 'Source',
        domain,
        authority,
        snippet: ref.snippet || ''
      });
    } catch (e) {
      console.warn('Error parsing citation:', e);
    }
  });
  
  return citations.slice(0, 8); // Max 8 sources
};

export const calculateInformationGain = (newContent: string, competitorContent: string): number => {
  const newTokens = new Set(newContent.toLowerCase().split(/\s+/).filter(t => t.length > 3));
  const competitorTokens = new Set(competitorContent.toLowerCase().split(/\s+/).filter(t => t.length > 3));
  
  const uniqueTokens = Array.from(newTokens).filter(t => !competitorTokens.has(t));
  const informationGain = (uniqueTokens.length / newTokens.size) * 100;
  
  return Math.min(100, informationGain);
};

export const injectInlineCitations = (content: string, citations: Citation[]): string => {
  if (citations.length === 0) return content;
  
  const sentences = content.split(/(?<=[.!?])\s+/);
  let citedContent = sentences.map((sentence, idx) => {
    const hasData = /\d+%|\d+\s?(mm|inch|gb|hz|hours?|minutes?|watts?|kg|lb)/i.test(sentence);
    const shouldCite = (idx % 3 === 0 || hasData) && citations.length > 0;
    
    if (shouldCite) {
      const citation = citations[idx % citations.length];
      return `${sentence}<sup><a href="${citation.url}" class="citation" target="_blank" rel="noopener">[${citation.id}]</a></sup>`;
    }
    return sentence;
  }).join(' ');
  
  const refsHtml = `
    <section class="sota-references">
      <h3>References & Sources</h3>
      <ol class="reference-list">
        ${citations.map(c => `
          <li>
            <a href="${c.url}" target="_blank" rel="noopener nofollow">
              ${c.title}
            </a>
            <span class="domain"> - ${c.domain}</span>
            <span class="authority" data-authority="${c.authority}">Authority: ${c.authority}/100</span>
          </li>
        `).join('')}
      </ol>
    </section>
  `;
  
  return citedContent + refsHtml;
};

export const generateCitationCSS = (): string => `
  .sota-references {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px solid #e0e0e0;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
  }
  
  .reference-list {
    list-style: decimal;
    margin-left: 20px;
  }
  
  .reference-list li {
    margin-bottom: 10px;
    line-height: 1.6;
  }
  
  .reference-list a {
    color: #0066cc;
    text-decoration: none;
    font-weight: 500;
  }
  
  .reference-list a:hover {
    text-decoration: underline;
  }
  
  .domain {
    color: #666;
    font-size: 0.9em;
    margin-left: 8px;
  }
  
  .authority {
    color: #27ae60;
    font-size: 0.85em;
    margin-left: 12px;
    font-weight: 600;
  }
  
  sup a.citation {
    color: #0066cc;
    text-decoration: none;
    font-weight: bold;
  }
  
  sup a.citation:hover {
    text-decoration: underline;
  }
`;
