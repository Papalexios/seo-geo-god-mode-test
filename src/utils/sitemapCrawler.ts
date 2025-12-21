// SOTA Sitemap Crawler with multiple fallback strategies

export interface SitemapPost {
  url: string;
  title: string;
  lastmod?: string;
  priority?: string;
}

export class SitemapCrawler {
  private corsProxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ];

  async crawlSitemap(sitemapUrl: string, onProgress?: (progress: number) => void): Promise<SitemapPost[]> {
    // Try direct fetch first
    try {
      return await this.fetchDirect(sitemapUrl, onProgress);
    } catch (directError) {
      console.log('Direct fetch failed, trying CORS proxies...', directError);
      
      // Try each CORS proxy
      for (const proxy of this.corsProxies) {
        try {
          return await this.fetchWithProxy(sitemapUrl, proxy, onProgress);
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed:`, proxyError);
          continue;
        }
      }
      
      // If all methods fail, throw error
      throw new Error('Unable to fetch sitemap. Please check the URL or try a different sitemap.');
    }
  }

  private async fetchDirect(sitemapUrl: string, onProgress?: (progress: number) => void): Promise<SitemapPost[]> {
    onProgress?.(10);
    
    const response = await fetch(sitemapUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    onProgress?.(30);
    const xmlText = await response.text();
    onProgress?.(50);
    
    return this.parseXML(xmlText, onProgress);
  }

  private async fetchWithProxy(sitemapUrl: string, proxy: string, onProgress?: (progress: number) => void): Promise<SitemapPost[]> {
    onProgress?.(10);
    
    const proxyUrl = proxy + encodeURIComponent(sitemapUrl);
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status}`);
    }

    onProgress?.(30);
    const xmlText = await response.text();
    onProgress?.(50);
    
    return this.parseXML(xmlText, onProgress);
  }

  private parseXML(xmlText: string, onProgress?: (progress: number) => void): SitemapPost[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parser errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format in sitemap');
    }

    onProgress?.(70);

    // Try different sitemap formats
    let urlElements = xmlDoc.querySelectorAll('url > loc');
    
    // If no URLs found, try sitemap index format
    if (urlElements.length === 0) {
      urlElements = xmlDoc.querySelectorAll('sitemap > loc');
    }

    if (urlElements.length === 0) {
      throw new Error('No URLs found in sitemap. Make sure the sitemap format is correct.');
    }

    const posts: SitemapPost[] = [];
    const maxPosts = Math.min(urlElements.length, 100); // Limit to 100 posts

    for (let i = 0; i < maxPosts; i++) {
      const urlElement = urlElements[i];
      const url = urlElement.textContent || '';
      
      if (!url) continue;

      // Get parent <url> element to access other fields
      const parentElement = urlElement.parentElement;
      
      const lastmod = parentElement?.querySelector('lastmod')?.textContent || undefined;
      const priority = parentElement?.querySelector('priority')?.textContent || undefined;

      // Extract title from URL
      const urlPath = url.split('/').filter(Boolean).pop() || '';
      const title = urlPath
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ') // Replace hyphens/underscores with spaces
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize words

      posts.push({
        url,
        title: title || 'Untitled Post',
        lastmod,
        priority
      });

      // Update progress
      if (onProgress && i % 10 === 0) {
        const progress = 70 + Math.round((i / maxPosts) * 30);
        onProgress(progress);
      }
    }

    onProgress?.(100);
    return posts;
  }
}

// Analyze post content (mock implementation - would need actual content fetching)
export async function analyzePost(url: string): Promise<{
  wordCount: number;
  seoScore: number;
  issues: string[];
  suggestions: string[];
}> {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate realistic mock data
  const wordCount = Math.floor(Math.random() * 2000) + 500;
  const seoScore = Math.floor(Math.random() * 30) + 70;

  const allIssues = [
    'Meta description too short',
    'Missing H1 heading',
    'Low keyword density',
    'No internal links found',
    'Images missing alt text',
    'Content readability could be improved',
    'URL could be more descriptive'
  ];

  const allSuggestions = [
    'Add more internal links to related content',
    'Optimize images with descriptive alt text',
    'Include FAQ section for better SERP features',
    'Add schema markup for rich snippets',
    'Update meta description with target keywords',
    'Break up long paragraphs for better readability',
    'Add more LSI keywords naturally'
  ];

  // Pick random issues and suggestions based on SEO score
  const numIssues = seoScore < 80 ? 3 : seoScore < 90 ? 2 : 1;
  const issues = allIssues.slice(0, numIssues);
  const suggestions = allSuggestions.slice(0, 3);

  return {
    wordCount,
    seoScore,
    issues,
    suggestions
  };
}
