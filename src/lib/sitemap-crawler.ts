// ═══════════════════════════════════════════════════════════════════
// ELITE SOTA SITEMAP CRAWLER v15.0
// Features: Streaming, IndexedDB Caching, 3-Tier CORS Fallback
// ═══════════════════════════════════════════════════════════════════

export interface SitemapURL {
  url: string;
  title: string;
  lastmod: string;
  wordCount?: number;
  seoScore?: number;
  aeoScore?: number;
  eeatScore?: number;
  analyzed?: boolean;
  content?: string;
}

export class SitemapCrawler {
  private cache: IDBDatabase | null = null;
  
  constructor() {
    this.initDB();
  }
  
  // ═══ INDEXEDDB CACHING ═══
  async initDB() {
    if (typeof indexedDB === 'undefined') return;
    
    const request = indexedDB.open('SitemapCache', 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('sitemaps')) {
        db.createObjectStore('sitemaps', { keyPath: 'url' });
      }
    };
    request.onsuccess = (e: any) => {
      this.cache = e.target.result;
    };
  }
  
  async getCached(sitemapUrl: string): Promise<SitemapURL[] | null> {
    if (!this.cache) return null;
    
    return new Promise((resolve) => {
      const tx = this.cache!.transaction('sitemaps', 'readonly');
      const store = tx.objectStore('sitemaps');
      const request = store.get(sitemapUrl);
      
      request.onsuccess = () => {
        const data = request.result;
        if (data && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          resolve(data.urls);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }
  
  async setCache(sitemapUrl: string, urls: SitemapURL[]) {
    if (!this.cache) return;
    
    const tx = this.cache.transaction('sitemaps', 'readwrite');
    const store = tx.objectStore('sitemaps');
    store.put({ url: sitemapUrl, urls, timestamp: Date.now() });
  }
  
  // ═══ 3-TIER CORS FALLBACK SYSTEM ═══
  async fetchWithFallback(url: string): Promise<string> {
    // Tier 1: Direct fetch
    try {
      const response = await fetch(url);
      if (response.ok) return await response.text();
    } catch (error) {
      console.log('Direct fetch failed, trying CORS proxy...');
    }
    
    // Tier 2: corsproxy.io
    try {
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      if (response.ok) return await response.text();
    } catch (error) {
      console.log('CORS proxy failed, trying allOrigins...');
    }
    
    // Tier 3: allOrigins
    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      if (response.ok) return await response.text();
    } catch (error) {
      throw new Error('All CORS proxies failed');
    }
    
    throw new Error('Failed to fetch');
  }
  
  // ═══ STREAMING SITEMAP FETCH ═══
  async fetchSitemap(
    sitemapUrl: string,
    onProgress?: (urls: SitemapURL[], total: number) => void
  ): Promise<SitemapURL[]> {
    // Check cache first
    const cached = await this.getCached(sitemapUrl);
    if (cached) {
      onProgress?.(cached, cached.length);
      return cached;
    }
    
    const xml = await this.fetchWithFallback(sitemapUrl);
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    const urlElements = doc.querySelectorAll('url');
    const urls: SitemapURL[] = [];
    
    urlElements.forEach((urlEl, index) => {
      const loc = urlEl.querySelector('loc')?.textContent || '';
      const lastmod = urlEl.querySelector('lastmod')?.textContent || '';
      const title = this.extractTitle(loc);
      
      urls.push({ url: loc, title, lastmod, analyzed: false });
      
      // Progressive streaming
      if ((index + 1) % 10 === 0 || index === urlElements.length - 1) {
        onProgress?.(urls, urlElements.length);
      }
    });
    
    // Cache results
    await this.setCache(sitemapUrl, urls);
    
    return urls;
  }
  
  extractTitle(url: string): string {
    const slug = url.split('/').filter(Boolean).pop() || '';
    return slug.replace(/-/g, ' ').replace(/\.(html|php)$/, '');
  }
}