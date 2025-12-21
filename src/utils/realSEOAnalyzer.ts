// ENTERPRISE-GRADE REAL SEO ANALYZER
// Fetches actual content and performs professional SEO analysis

export interface RealSEOAnalysis {
  score: number; // 0-100
  metrics: {
    titleScore: number;
    metaDescriptionScore: number;
    headingScore: number;
    contentScore: number;
    keywordScore: number;
    linkScore: number;
    imageScore: number;
    readabilityScore: number;
    schemaScore: number;
    performanceScore: number;
  };
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: string;
    message: string;
  }>;
  suggestions: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
  }>;
  wordCount: number;
  readingTime: number;
  keywords: Array<{ term: string; frequency: number; density: number }>;
  internalLinks: number;
  externalLinks: number;
  images: { total: number; withAlt: number; withoutAlt: number };
}

export class RealSEOAnalyzer {
  private corsProxies = [
    'https://api.allorigins.win/get?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ];

  /**
   * Fetch real page content with CORS bypass
   */
  async fetchPageContent(url: string): Promise<string> {
    // Try direct fetch first
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.log('Direct fetch failed, trying proxies...');
    }

    // Try each proxy
    for (const proxy of this.corsProxies) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url);
        const response = await fetch(proxyUrl);
        
        if (response.ok) {
          const data = await response.json();
          // Handle different proxy response formats
          return data.contents || data.content || data;
        }
      } catch (e) {
        console.log(`Proxy ${proxy} failed:`, e);
        continue;
      }
    }

    throw new Error('Failed to fetch page content. All methods exhausted.');
  }

  /**
   * REAL SEO ANALYSIS - Professional Grade
   */
  async analyzeURL(url: string): Promise<RealSEOAnalysis> {
    try {
      // Fetch real HTML content
      const html = await this.fetchPageContent(url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract all metrics
      const titleAnalysis = this.analyzeTitle(doc);
      const metaAnalysis = this.analyzeMetaDescription(doc);
      const headingAnalysis = this.analyzeHeadings(doc);
      const contentAnalysis = this.analyzeContent(doc);
      const keywordAnalysis = this.analyzeKeywords(doc);
      const linkAnalysis = this.analyzeLinks(doc, url);
      const imageAnalysis = this.analyzeImages(doc);
      const readabilityAnalysis = this.analyzeReadability(doc);
      const schemaAnalysis = this.analyzeSchema(doc);

      // Calculate overall score
      const metrics = {
        titleScore: titleAnalysis.score,
        metaDescriptionScore: metaAnalysis.score,
        headingScore: headingAnalysis.score,
        contentScore: contentAnalysis.score,
        keywordScore: keywordAnalysis.score,
        linkScore: linkAnalysis.score,
        imageScore: imageAnalysis.score,
        readabilityScore: readabilityAnalysis.score,
        schemaScore: schemaAnalysis.score,
        performanceScore: 75 // Placeholder for now
      };

      const overallScore = Math.round(
        (metrics.titleScore * 0.15 +
        metrics.metaDescriptionScore * 0.10 +
        metrics.headingScore * 0.12 +
        metrics.contentScore * 0.15 +
        metrics.keywordScore * 0.13 +
        metrics.linkScore * 0.10 +
        metrics.imageScore * 0.08 +
        metrics.readabilityScore * 0.10 +
        metrics.schemaScore * 0.07)
      );

      // Collect all issues
      const issues = [
        ...titleAnalysis.issues,
        ...metaAnalysis.issues,
        ...headingAnalysis.issues,
        ...contentAnalysis.issues,
        ...keywordAnalysis.issues,
        ...linkAnalysis.issues,
        ...imageAnalysis.issues,
        ...readabilityAnalysis.issues,
        ...schemaAnalysis.issues
      ];

      // Generate suggestions
      const suggestions = this.generateSuggestions(issues, metrics);

      return {
        score: overallScore,
        metrics,
        issues,
        suggestions,
        wordCount: contentAnalysis.wordCount,
        readingTime: Math.ceil(contentAnalysis.wordCount / 200),
        keywords: keywordAnalysis.keywords,
        internalLinks: linkAnalysis.internal,
        externalLinks: linkAnalysis.external,
        images: imageAnalysis.images
      };

    } catch (error) {
      console.error('SEO Analysis Error:', error);
      throw error;
    }
  }

  // ========== ANALYSIS METHODS ==========

  private analyzeTitle(doc: Document) {
    const title = doc.querySelector('title')?.textContent || '';
    const length = title.length;
    const issues: any[] = [];

    let score = 100;

    if (!title) {
      issues.push({ severity: 'critical', category: 'Title', message: 'Missing title tag' });
      score = 0;
    } else {
      if (length < 30) {
        issues.push({ severity: 'warning', category: 'Title', message: `Title too short (${length} chars). Aim for 50-60 characters.` });
        score -= 30;
      } else if (length > 60) {
        issues.push({ severity: 'warning', category: 'Title', message: `Title too long (${length} chars). May be truncated in SERPs.` });
        score -= 20;
      }

      // Check for keywords in title
      if (!/\b(guide|how to|best|top|review|tips)\b/i.test(title)) {
        issues.push({ severity: 'info', category: 'Title', message: 'Consider adding power words (Guide, How to, Best, etc.)' });
        score -= 10;
      }
    }

    return { score: Math.max(0, score), issues };
  }

  private analyzeMetaDescription(doc: Document) {
    const meta = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const length = meta.length;
    const issues: any[] = [];

    let score = 100;

    if (!meta) {
      issues.push({ severity: 'critical', category: 'Meta Description', message: 'Missing meta description' });
      score = 0;
    } else {
      if (length < 120) {
        issues.push({ severity: 'warning', category: 'Meta Description', message: `Meta description too short (${length} chars). Aim for 150-160 characters.` });
        score -= 40;
      } else if (length > 160) {
        issues.push({ severity: 'warning', category: 'Meta Description', message: `Meta description too long (${length} chars). Will be truncated.` });
        score -= 20;
      }
    }

    return { score: Math.max(0, score), issues };
  }

  private analyzeHeadings(doc: Document) {
    const h1s = doc.querySelectorAll('h1');
    const h2s = doc.querySelectorAll('h2');
    const h3s = doc.querySelectorAll('h3');
    const issues: any[] = [];

    let score = 100;

    if (h1s.length === 0) {
      issues.push({ severity: 'critical', category: 'Headings', message: 'Missing H1 tag' });
      score -= 50;
    } else if (h1s.length > 1) {
      issues.push({ severity: 'warning', category: 'Headings', message: `Multiple H1 tags found (${h1s.length}). Use only one H1 per page.` });
      score -= 30;
    }

    if (h2s.length < 2) {
      issues.push({ severity: 'warning', category: 'Headings', message: 'Too few H2 headings. Add more subheadings for better structure.' });
      score -= 20;
    }

    return { score: Math.max(0, score), issues };
  }

  private analyzeContent(doc: Document) {
    const body = doc.body?.textContent || '';
    const wordCount = body.trim().split(/\s+/).length;
    const issues: any[] = [];

    let score = 100;

    if (wordCount < 300) {
      issues.push({ severity: 'critical', category: 'Content', message: `Thin content (${wordCount} words). Aim for at least 1000 words.` });
      score -= 60;
    } else if (wordCount < 1000) {
      issues.push({ severity: 'warning', category: 'Content', message: `Content could be longer (${wordCount} words). Aim for 1500+ words.` });
      score -= 30;
    }

    // Check for paragraphs
    const paragraphs = doc.querySelectorAll('p');
    if (paragraphs.length < 5) {
      issues.push({ severity: 'warning', category: 'Content', message: 'Too few paragraphs. Break up content for readability.' });
      score -= 15;
    }

    return { score: Math.max(0, score), issues, wordCount };
  }

  private analyzeKeywords(doc: Document) {
    const text = (doc.body?.textContent || '').toLowerCase();
    const words = text.split(/\s+/).filter(w => w.length > 3);
    const totalWords = words.length;

    // Count word frequency
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Get top keywords
    const keywords = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term, freq]) => ({
        term,
        frequency: freq,
        density: parseFloat(((freq / totalWords) * 100).toFixed(2))
      }));

    const issues: any[] = [];
    let score = 100;

    // Check keyword density
    const maxDensity = keywords[0]?.density || 0;
    if (maxDensity < 0.5) {
      issues.push({ severity: 'warning', category: 'Keywords', message: 'Low keyword density. Focus on target keywords.' });
      score -= 30;
    } else if (maxDensity > 3) {
      issues.push({ severity: 'warning', category: 'Keywords', message: 'Keyword density too high. May appear spammy.' });
      score -= 20;
    }

    return { score: Math.max(0, score), issues, keywords };
  }

  private analyzeLinks(doc: Document, pageUrl: string) {
    const links = doc.querySelectorAll('a[href]');
    const issues: any[] = [];

    let internal = 0;
    let external = 0;

    const domain = new URL(pageUrl).hostname;

    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      try {
        const linkUrl = new URL(href, pageUrl);
        if (linkUrl.hostname === domain) {
          internal++;
        } else {
          external++;
        }
      } catch (e) {
        // Invalid URL, skip
      }
    });

    let score = 100;

    if (internal < 3) {
      issues.push({ severity: 'warning', category: 'Links', message: `Too few internal links (${internal}). Add 3-5 contextual internal links.` });
      score -= 30;
    }

    if (external === 0) {
      issues.push({ severity: 'info', category: 'Links', message: 'No external links found. Consider citing authoritative sources.' });
      score -= 15;
    }

    return { score: Math.max(0, score), issues, internal, external };
  }

  private analyzeImages(doc: Document) {
    const images = doc.querySelectorAll('img');
    const total = images.length;
    let withAlt = 0;
    let withoutAlt = 0;

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      if (alt && alt.trim().length > 0) {
        withAlt++;
      } else {
        withoutAlt++;
      }
    });

    const issues: any[] = [];
    let score = 100;

    if (total === 0) {
      issues.push({ severity: 'info', category: 'Images', message: 'No images found. Consider adding relevant images.' });
      score -= 20;
    } else if (withoutAlt > 0) {
      issues.push({ severity: 'warning', category: 'Images', message: `${withoutAlt}/${total} images missing alt text.` });
      score -= Math.min(50, withoutAlt * 10);
    }

    return { score: Math.max(0, score), issues, images: { total, withAlt, withoutAlt } };
  }

  private analyzeReadability(doc: Document) {
    const text = doc.body?.textContent || '';
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/);
    const syllables = this.countSyllables(text);

    // Flesch Reading Ease
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    const issues: any[] = [];
    let score = 100;

    if (fleschScore < 50) {
      issues.push({ severity: 'warning', category: 'Readability', message: 'Content is difficult to read. Simplify sentences.' });
      score -= 30;
    } else if (fleschScore < 60) {
      issues.push({ severity: 'info', category: 'Readability', message: 'Content readability could be improved.' });
      score -= 15;
    }

    if (avgWordsPerSentence > 25) {
      issues.push({ severity: 'warning', category: 'Readability', message: 'Sentences are too long. Break them up.' });
      score -= 20;
    }

    return { score: Math.max(0, score), issues };
  }

  private analyzeSchema(doc: Document) {
    const jsonLd = doc.querySelector('script[type="application/ld+json"]');
    const issues: any[] = [];

    let score = 100;

    if (!jsonLd) {
      issues.push({ severity: 'warning', category: 'Schema', message: 'No schema markup found. Add structured data for rich snippets.' });
      score = 0;
    } else {
      try {
        const schema = JSON.parse(jsonLd.textContent || '{}');
        if (!schema['@type']) {
          issues.push({ severity: 'info', category: 'Schema', message: 'Schema markup present but incomplete.' });
          score -= 30;
        }
      } catch (e) {
        issues.push({ severity: 'warning', category: 'Schema', message: 'Invalid schema markup format.' });
        score -= 50;
      }
    }

    return { score: Math.max(0, score), issues };
  }

  private countSyllables(text: string): number {
    // Simple syllable counting algorithm
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;

    words.forEach(word => {
      word = word.replace(/[^a-z]/g, '');
      if (word.length <= 3) {
        count += 1;
      } else {
        const matches = word.match(/[aeiouy]+/g);
        count += matches ? matches.length : 1;
      }
    });

    return count;
  }

  private generateSuggestions(issues: any[], metrics: any) {
    const suggestions: any[] = [];

    // Prioritize by severity and score
    if (metrics.titleScore < 70) {
      suggestions.push({
        priority: 'high',
        action: 'Optimize title tag',
        impact: 'Improves click-through rate in search results'
      });
    }

    if (metrics.contentScore < 70) {
      suggestions.push({
        priority: 'high',
        action: 'Expand content length',
        impact: 'Increases topical authority and ranking potential'
      });
    }

    if (metrics.linkScore < 70) {
      suggestions.push({
        priority: 'medium',
        action: 'Add internal links',
        impact: 'Improves site architecture and distributes link equity'
      });
    }

    if (metrics.imageScore < 70) {
      suggestions.push({
        priority: 'medium',
        action: 'Add alt text to images',
        impact: 'Improves accessibility and image SEO'
      });
    }

    if (metrics.schemaScore < 50) {
      suggestions.push({
        priority: 'high',
        action: 'Implement schema markup',
        impact: 'Enables rich snippets in search results'
      });
    }

    return suggestions;
  }
}
