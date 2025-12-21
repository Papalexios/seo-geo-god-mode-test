// ULTRA-SOTA Sitemap Crawler - Parallel Processing, Unlimited URLs

export interface SitemapPost {
  url: string;
  title: string;
  lastmod?: string;
  priority?: string;
  changefreq?: string;
}

export interface CrawlProgress {
  phase: 'fetching' | 'parsing' | 'processing' | 'complete';
  progress: number;
  totalUrls: number;
  processedUrls: number;
  speed: number; // URLs per second
  estimatedTimeRemaining: number; // seconds
}

export class UltraSOTASitemapCrawler {
  private corsProxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ];

  private startTime: number = 0;
  private processedCount: number = 0;

  /**
   * Crawl sitemap with PARALLEL processing - handles UNLIMITED URLs
   */
  async crawlSitemap(
    sitemapUrl: string,
    onProgress?: (progress: CrawlProgress) => void
  ): Promise<SitemapPost[]> {
    this.startTime = Date.now();
    this.processedCount = 0;

    try {
      // Phase 1: Fetch sitemap
      onProgress?.({
        phase: 'fetching',
        progress: 10,
        totalUrls: 0,
        processedUrls: 0,
        speed: 0,
        estimatedTimeRemaining: 0
      });

      const xmlText = await this.fetchWithFallback(sitemapUrl);

      // Phase 2: Parse XML
      onProgress?.({
        phase: 'parsing',
        progress: 30,
        totalUrls: 0,
        processedUrls: 0,
        speed: 0,
        estimatedTimeRemaining: 0
      });

      const urls = await this.parseXMLFast(xmlText);

      if (urls.length === 0) {
        throw new Error('No URLs found in sitemap. Please verify the sitemap format.');
      }

      // Phase 3: Process URLs in parallel batches
      onProgress?.({
        phase: 'processing',
        progress: 40,
        totalUrls: urls.length,
        processedUrls: 0,
        speed: 0,
        estimatedTimeRemaining: 0
      });

      const posts = await this.processUrlsInParallel(urls, (processed) => {
        this.processedCount = processed;
        const elapsed = (Date.now() - this.startTime) / 1000;
        const speed = processed / elapsed;
        const remaining = urls.length - processed;
        const eta = remaining / Math.max(speed, 1);

        onProgress?.({
          phase: 'processing',
          progress: 40 + Math.floor((processed / urls.length) * 59),
          totalUrls: urls.length,
          processedUrls: processed,
          speed: Math.round(speed),
          estimatedTimeRemaining: Math.round(eta)
        });
      });

      // Phase 4: Complete
      onProgress?.({
        phase: 'complete',
        progress: 100,
        totalUrls: urls.length,
        processedUrls: urls.length,
        speed: Math.round(urls.length / ((Date.now() - this.startTime) / 1000)),
        estimatedTimeRemaining: 0
      });

      return posts;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to crawl sitemap');
    }
  }

  /**
   * Fetch with automatic fallback through multiple proxies
   */
  private async fetchWithFallback(sitemapUrl: string): Promise<string> {
    // Try direct fetch first
    try {
      const response = await fetch(sitemapUrl, {
        mode: 'cors',
        headers: { 'Accept': 'application/xml, text/xml, */*' }
      });

      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.log('Direct fetch failed, trying proxies...');
    }

    // Try each proxy
    for (const proxy of this.corsProxies) {
      try {
        const proxyUrl = proxy + encodeURIComponent(sitemapUrl);
        const response = await fetch(proxyUrl, {
          headers: { 'Accept': 'application/xml, text/xml, */*' }
        });

        if (response.ok) {
          const text = await response.text();
          // Validate it's XML
          if (text.includes('<?xml') || text.includes('<urlset') || text.includes('<sitemapindex')) {
            return text;
          }
        }
      } catch (e) {
        console.log(`Proxy ${proxy} failed:`, e);
        continue;
      }
    }

    throw new Error('All fetch methods failed. The sitemap may be inaccessible or have CORS restrictions.');
  }

  /**
   * ULTRA-FAST XML parsing using DOMParser
   */
  private async parseXMLFast(xmlText: string): Promise<Array<{
    url: string;
    lastmod?: string;
    priority?: string;
    changefreq?: string;
  }>> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format in sitemap');
    }

    const urls: Array<any> = [];

    // Check for sitemap index (contains other sitemaps)
    const sitemapElements = xmlDoc.querySelectorAll('sitemapindex > sitemap > loc');
    if (sitemapElements.length > 0) {
      // This is a sitemap index - we'll fetch all child sitemaps
      console.log(`Found sitemap index with ${sitemapElements.length} child sitemaps`);
      
      for (const sitemapLoc of Array.from(sitemapElements)) {
        const childSitemapUrl = sitemapLoc.textContent;
        if (childSitemapUrl) {
          try {
            const childXml = await this.fetchWithFallback(childSitemapUrl);
            const childUrls = await this.parseXMLFast(childXml);
            urls.push(...childUrls);
          } catch (e) {
            console.error(`Failed to fetch child sitemap: ${childSitemapUrl}`, e);
          }
        }
      }
      return urls;
    }

    // Parse regular sitemap
    const urlElements = xmlDoc.querySelectorAll('urlset > url');

    for (const urlElement of Array.from(urlElements)) {
      const loc = urlElement.querySelector('loc')?.textContent;
      if (!loc) continue;

      const lastmod = urlElement.querySelector('lastmod')?.textContent || undefined;
      const priority = urlElement.querySelector('priority')?.textContent || undefined;
      const changefreq = urlElement.querySelector('changefreq')?.textContent || undefined;

      urls.push({ url: loc, lastmod, priority, changefreq });
    }

    return urls;
  }

  /**
   * Process URLs in PARALLEL batches for maximum speed
   */
  private async processUrlsInParallel(
    urls: Array<any>,
    onProgress?: (processed: number) => void
  ): Promise<SitemapPost[]> {
    const BATCH_SIZE = 50; // Process 50 URLs at a time
    const posts: SitemapPost[] = [];
    let processed = 0;

    // Process in batches
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE);
      
      // Process batch in parallel
      const batchResults = await Promise.all(
        batch.map(urlData => this.processUrl(urlData))
      );

      posts.push(...batchResults);
      processed += batch.length;
      onProgress?.(processed);

      // Small delay to avoid overwhelming the browser
      if (i + BATCH_SIZE < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    return posts;
  }

  /**
   * Process a single URL - extract metadata
   */
  private async processUrl(urlData: any): Promise<SitemapPost> {
    const { url, lastmod, priority, changefreq } = urlData;

    // Extract title from URL
    const urlPath = url.split('/').filter(Boolean).pop() || '';
    const title = this.extractTitle(urlPath);

    return {
      url,
      title,
      lastmod,
      priority,
      changefreq
    };
  }

  /**
   * Extract and format title from URL path
   */
  private extractTitle(urlPath: string): string {
    if (!urlPath) return 'Homepage';

    return urlPath
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ') // Replace hyphens/underscores with spaces
      .replace(/\b\w/g, c => c.toUpperCase()) // Capitalize words
      .trim() || 'Untitled Post';
  }
}

/**
 * Analyze post content with mock data
 */
export async function analyzePost(url: string): Promise<{
  wordCount: number;
  seoScore: number;
  issues: string[];
  suggestions: string[];
}> {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const wordCount = Math.floor(Math.random() * 2500) + 500;
  const seoScore = Math.floor(Math.random() * 35) + 65;

  const allIssues = [
    'Meta description too short (< 120 characters)',
    'Missing or duplicate H1 heading',
    'Low keyword density (< 0.5%)',
    'Insufficient internal links (< 3 found)',
    'Images missing alt text (15% of images)',
    'Content readability below grade 8',
    'URL structure not SEO-friendly',
    'No schema markup detected',
    'Missing Open Graph tags',
    'Page speed score below 70'
  ];

  const allSuggestions = [
    'Add 3-5 contextual internal links to related content',
    'Optimize all images with descriptive alt text',
    'Include FAQ section with schema markup',
    'Add schema markup for articles/blog posts',
    'Expand meta description to 150-160 characters',
    'Break up paragraphs longer than 4 lines',
    'Add LSI keywords: [related terms]',
    'Create table of contents for long-form content',
    'Add video or interactive elements',
    'Optimize for featured snippets'
  ];

  const numIssues = seoScore < 75 ? 4 : seoScore < 85 ? 3 : 2;
  const numSuggestions = Math.min(5, Math.ceil(numIssues * 1.5));

  // Shuffle and pick random items
  const shuffled = (arr: string[]) => arr.sort(() => Math.random() - 0.5);
  const issues = shuffled([...allIssues]).slice(0, numIssues);
  const suggestions = shuffled([...allSuggestions]).slice(0, numSuggestions);

  return { wordCount, seoScore, issues, suggestions };
}
