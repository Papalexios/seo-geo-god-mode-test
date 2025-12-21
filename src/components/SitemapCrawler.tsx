import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CrawledURL {
  url: string;
  title: string;
  wordCount: number;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  seoScore?: number;
  aeoScore?: number;
  eeatScore?: number;
  entityScore?: number;
  semanticScore?: number;
  readabilityScore?: number;
  metaDescription?: string;
  keywords?: string[];
  headings?: { h1: string[]; h2: string[]; h3: string[] };
  internalLinks?: number;
  externalLinks?: number;
  images?: number;
  hasSchema?: boolean;
  contentType?: string;
  lastModified?: string;
  error?: string;
}

interface SitemapCrawlerProps {
  corsProxy?: string;
  onComplete?: (urls: CrawledURL[]) => void;
}

export const SitemapCrawler: React.FC<SitemapCrawlerProps> = ({ 
  corsProxy = 'https://corsproxy.io/?',
  onComplete 
}) => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [crawledUrls, setCrawledUrls] = useState<CrawledURL[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [isCrawling, setIsCrawling] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof CrawledURL>('url');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const abortControllerRef = useRef<AbortController | null>(null);

  // SOTA Sitemap Parser - Lightning Fast ⚡
  const parseSitemap = async (url: string): Promise<string[]> => {
    try {
      const response = await fetch(`${corsProxy}${encodeURIComponent(url)}`, {
        signal: abortControllerRef.current?.signal
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) throw new Error('Invalid XML format');
      
      const urls: string[] = [];
      
      // Handle sitemap index
      const sitemapTags = xmlDoc.querySelectorAll('sitemap > loc');
      if (sitemapTags.length > 0) {
        for (const tag of Array.from(sitemapTags)) {
          const nestedUrl = tag.textContent?.trim();
          if (nestedUrl) {
            const nestedUrls = await parseSitemap(nestedUrl);
            urls.push(...nestedUrls);
          }
        }
        return urls;
      }
      
      // Handle regular sitemap
      const urlTags = xmlDoc.querySelectorAll('url > loc');
      for (const tag of Array.from(urlTags)) {
        const urlText = tag.textContent?.trim();
        if (urlText) urls.push(urlText);
      }
      
      return urls;
    } catch (error: any) {
      if (error.name === 'AbortError') throw error;
      throw new Error(`Sitemap fetch failed: ${error.message}`);
    }
  };

  // Real SEO Analysis - Not Fake Numbers! 🎯
  const analyzeContent = async (html: string, url: string): Promise<Partial<CrawledURL>> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract text content
    const bodyText = doc.body?.innerText || '';
    const wordCount = bodyText.trim().split(/\s+/).length;
    
    // Title extraction
    const title = doc.querySelector('title')?.textContent || 'No Title';
    
    // Meta description
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Headings analysis
    const h1Tags = Array.from(doc.querySelectorAll('h1')).map(h => h.textContent || '');
    const h2Tags = Array.from(doc.querySelectorAll('h2')).map(h => h.textContent || '');
    const h3Tags = Array.from(doc.querySelectorAll('h3')).map(h => h.textContent || '');
    
    // Links analysis
    const internalLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('/') || href.includes(new URL(url).hostname);
    }).length;
    
    const externalLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('http') && !href.includes(new URL(url).hostname);
    }).length;
    
    // Images
    const images = doc.querySelectorAll('img').length;
    
    // Schema markup detection
    const hasSchema = doc.querySelector('script[type="application/ld+json"]') !== null;
    
    // Keyword extraction (simple TF-IDF approximation)
    const words = bodyText.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    const wordFreq = new Map<string, number>();
    words.forEach(w => wordFreq.set(w, (wordFreq.get(w) || 0) + 1));
    
    const keywords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    
    // Calculate SEO Score (0-100)
    let seoScore = 0;
    
    // Title (20 points)
    if (title.length >= 30 && title.length <= 60) seoScore += 20;
    else if (title.length > 0) seoScore += 10;
    
    // Meta description (15 points)
    if (metaDescription.length >= 120 && metaDescription.length <= 160) seoScore += 15;
    else if (metaDescription.length > 0) seoScore += 7;
    
    // H1 tags (15 points)
    if (h1Tags.length === 1) seoScore += 15;
    else if (h1Tags.length > 0) seoScore += 7;
    
    // Word count (15 points)
    if (wordCount >= 1000) seoScore += 15;
    else if (wordCount >= 500) seoScore += 10;
    else if (wordCount >= 300) seoScore += 5;
    
    // Internal links (10 points)
    if (internalLinks >= 3) seoScore += 10;
    else if (internalLinks > 0) seoScore += 5;
    
    // Images with alt (10 points)
    const imagesWithAlt = Array.from(doc.querySelectorAll('img[alt]')).filter(img => 
      img.getAttribute('alt')?.trim().length > 0
    ).length;
    if (images > 0 && imagesWithAlt === images) seoScore += 10;
    else if (imagesWithAlt > 0) seoScore += 5;
    
    // Schema markup (10 points)
    if (hasSchema) seoScore += 10;
    
    // H2 structure (5 points)
    if (h2Tags.length >= 2) seoScore += 5;
    
    // Calculate AEO Score (Answer Engine Optimization)
    let aeoScore = 0;
    
    // Featured snippet potential (25 points)
    const hasList = doc.querySelector('ul, ol') !== null;
    const hasTable = doc.querySelector('table') !== null;
    if (hasList) aeoScore += 12;
    if (hasTable) aeoScore += 13;
    
    // Question answering (25 points)
    const hasQuestions = /\b(what|how|why|when|where|who)\b/gi.test(bodyText);
    if (hasQuestions) aeoScore += 25;
    
    // Structured data (20 points)
    if (hasSchema) aeoScore += 20;
    
    // Clear hierarchy (15 points)
    if (h1Tags.length === 1 && h2Tags.length >= 2) aeoScore += 15;
    
    // Concise answers (15 points)
    const avgSentenceLength = bodyText.split(/[.!?]+/).length / wordCount * 100;
    if (avgSentenceLength < 20) aeoScore += 15;
    
    // Calculate E-E-A-T Score
    let eeatScore = 0;
    
    // Author attribution (25 points)
    const hasAuthor = doc.querySelector('[rel="author"], .author, meta[name="author"]') !== null;
    if (hasAuthor) eeatScore += 25;
    
    // Publication date (15 points)
    const hasDate = doc.querySelector('time, .published, meta[property="article:published_time"]') !== null;
    if (hasDate) eeatScore += 15;
    
    // External authoritative links (20 points)
    const authoritativeDomains = ['wikipedia.org', 'gov', 'edu', 'nih.gov', 'who.int'];
    const hasAuthLinks = Array.from(doc.querySelectorAll('a[href]')).some(a => {
      const href = a.getAttribute('href') || '';
      return authoritativeDomains.some(d => href.includes(d));
    });
    if (hasAuthLinks) eeatScore += 20;
    
    // Expertise indicators (20 points)
    const expertKeywords = ['research', 'study', 'expert', 'professor', 'phd', 'md', 'certified'];
    const hasExpertise = expertKeywords.some(kw => bodyText.toLowerCase().includes(kw));
    if (hasExpertise) eeatScore += 20;
    
    // Contact/About page (10 points)
    const hasContactInfo = doc.querySelector('a[href*="contact"], a[href*="about"]') !== null;
    if (hasContactInfo) eeatScore += 10;
    
    // Privacy policy (10 points)
    const hasPrivacy = doc.querySelector('a[href*="privacy"]') !== null;
    if (hasPrivacy) eeatScore += 10;
    
    // Calculate Entity Score (Knowledge Graph Optimization)
    let entityScore = 0;
    
    // Wikipedia-style entity detection
    const entities = bodyText.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g) || [];
    const uniqueEntities = new Set(entities);
    
    if (uniqueEntities.size >= 10) entityScore += 30;
    else if (uniqueEntities.size >= 5) entityScore += 20;
    else if (uniqueEntities.size > 0) entityScore += 10;
    
    // Internal entity linking
    const entityLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
      const text = a.textContent || '';
      return /^[A-Z]/.test(text) && text.split(' ').length <= 3;
    }).length;
    
    if (entityLinks >= 5) entityScore += 30;
    else if (entityLinks > 0) entityScore += 15;
    
    // Schema markup for entities
    if (hasSchema) {
      const schemaScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
      const hasEntitySchema = schemaScripts.some(script => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          return data['@type'] === 'Person' || data['@type'] === 'Organization' || data['@type'] === 'Place';
        } catch { return false; }
      });
      if (hasEntitySchema) entityScore += 40;
    }
    
    // Calculate Semantic Score (Topic Clustering)
    let semanticScore = 50; // Base score
    
    // Topic coherence (keyword consistency)
    if (keywords.length >= 5) {
      const topKeyword = keywords[0];
      const topKeywordCount = wordFreq.get(topKeyword) || 0;
      const keywordDensity = topKeywordCount / wordCount * 100;
      
      if (keywordDensity >= 1 && keywordDensity <= 3) semanticScore += 30;
      else if (keywordDensity > 0) semanticScore += 15;
    }
    
    // LSI keywords (related terms)
    const lsiPresent = keywords.length >= 8;
    if (lsiPresent) semanticScore += 20;
    
    // Calculate Readability Score (Flesch-Kincaid)
    const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    
    let readabilityScore = 0;
    if (sentences > 0 && words.length > 0) {
      const fleschScore = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length);
      readabilityScore = Math.max(0, Math.min(100, fleschScore));
    }
    
    return {
      title,
      wordCount,
      seoScore: Math.round(seoScore),
      aeoScore: Math.round(aeoScore),
      eeatScore: Math.round(eeatScore),
      entityScore: Math.round(entityScore),
      semanticScore: Math.round(semanticScore),
      readabilityScore: Math.round(readabilityScore),
      metaDescription,
      keywords,
      headings: { h1: h1Tags, h2: h2Tags, h3: h3Tags },
      internalLinks,
      externalLinks,
      images,
      hasSchema
    };
  };

  // Syllable counter for readability
  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  // Fetch and analyze single URL
  const fetchAndAnalyze = async (url: string): Promise<CrawledURL> => {
    try {
      const response = await fetch(`${corsProxy}${encodeURIComponent(url)}`, {
        signal: abortControllerRef.current?.signal
      });
      
      if (!response.ok) {
        return {
          url,
          title: 'Error',
          wordCount: 0,
          status: 'error',
          error: `HTTP ${response.status}`
        };
      }
      
      const html = await response.text();
      const analysis = await analyzeContent(html, url);
      
      return {
        url,
        ...analysis,
        status: 'complete'
      } as CrawledURL;
    } catch (error: any) {
      if (error.name === 'AbortError') throw error;
      return {
        url,
        title: 'Error',
        wordCount: 0,
        status: 'error',
        error: error.message
      };
    }
  };

  // Crawl sitemap
  const handleCrawlSitemap = async () => {
    if (!sitemapUrl.trim()) return;
    
    abortControllerRef.current = new AbortController();
    setIsCrawling(true);
    setCrawledUrls([]);
    setSelectedUrls(new Set());
    setProgress({ current: 0, total: 0 });
    
    try {
      // Step 1: Parse sitemap
      const urls = await parseSitemap(sitemapUrl);
      
      if (urls.length === 0) {
        alert('No URLs found in sitemap');
        return;
      }
      
      // Step 2: Create initial URL list (pending state)
      const initialUrls: CrawledURL[] = urls.map(url => ({
        url,
        title: 'Pending...',
        wordCount: 0,
        status: 'pending'
      }));
      
      setCrawledUrls(initialUrls);
      setProgress({ current: 0, total: urls.length });
      
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        alert(`Sitemap crawl failed: ${error.message}`);
      }
    } finally {
      setIsCrawling(false);
    }
  };

  // Analyze selected URLs
  const handleAnalyzeSelected = async () => {
    if (selectedUrls.size === 0) {
      alert('Please select URLs to analyze');
      return;
    }
    
    abortControllerRef.current = new AbortController();
    setIsAnalyzing(true);
    
    const urlsToAnalyze = crawledUrls.filter(u => selectedUrls.has(u.url));
    let completed = 0;
    
    try {
      // Process in batches of 3 for better performance
      const batchSize = 3;
      for (let i = 0; i < urlsToAnalyze.length; i += batchSize) {
        const batch = urlsToAnalyze.slice(i, i + batchSize);
        
        // Update status to analyzing
        setCrawledUrls(prev => prev.map(u => 
          batch.some(b => b.url === u.url) ? { ...u, status: 'analyzing' as const } : u
        ));
        
        // Analyze batch in parallel
        const results = await Promise.all(
          batch.map(item => fetchAndAnalyze(item.url))
        );
        
        // Update with results
        setCrawledUrls(prev => prev.map(u => {
          const result = results.find(r => r.url === u.url);
          return result || u;
        }));
        
        completed += batch.length;
        setProgress(prev => ({ ...prev, current: completed }));
      }
      
      if (onComplete) {
        const completedUrls = crawledUrls.filter(u => u.status === 'complete');
        onComplete(completedUrls);
      }
      
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        alert(`Analysis failed: ${error.message}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Stop crawling/analyzing
  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsCrawling(false);
    setIsAnalyzing(false);
  };

  // Toggle URL selection
  const toggleUrlSelection = (url: string) => {
    setSelectedUrls(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  // Select all URLs
  const selectAll = () => {
    setSelectedUrls(new Set(crawledUrls.map(u => u.url)));
  };

  // Deselect all URLs
  const deselectAll = () => {
    setSelectedUrls(new Set());
  };

  // Filter and sort URLs
  const filteredAndSortedUrls = crawledUrls
    .filter(u => 
      !searchTerm || 
      u.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal || '');
      const bStr = String(bVal || '');
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🕸️ SOTA Sitemap Crawler</h2>
        <p style={styles.subtitle}>Lightning-fast URL discovery with real-time SEO analysis</p>
      </div>

      {/* Crawl Controls */}
      <div style={styles.controls}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            style={styles.input}
            disabled={isCrawling || isAnalyzing}
          />
          <button
            onClick={handleCrawlSitemap}
            disabled={isCrawling || isAnalyzing || !sitemapUrl.trim()}
            style={styles.primaryButton}
          >
            {isCrawling ? '⏳ Crawling...' : '🚀 Crawl Sitemap'}
          </button>
        </div>

        {crawledUrls.length > 0 && (
          <div style={styles.actionBar}>
            <div style={styles.selectionInfo}>
              <span style={styles.badge}>{selectedUrls.size} selected</span>
              <button onClick={selectAll} style={styles.linkButton}>Select All</button>
              <button onClick={deselectAll} style={styles.linkButton}>Deselect All</button>
            </div>
            
            <div style={styles.buttonGroup}>
              <button
                onClick={handleAnalyzeSelected}
                disabled={isAnalyzing || selectedUrls.size === 0}
                style={styles.successButton}
              >
                {isAnalyzing ? '⚡ Analyzing...' : '🎯 Analyze Selected'}
              </button>
              
              {(isCrawling || isAnalyzing) && (
                <button onClick={handleStop} style={styles.dangerButton}>
                  ⏹️ Stop
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      {(isCrawling || isAnalyzing) && progress.total > 0 && (
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${(progress.current / progress.total) * 100}%`
              }}
            />
          </div>
          <span style={styles.progressText}>
            {progress.current} / {progress.total} URLs
          </span>
        </div>
      )}

      {/* Search & Sort */}
      {crawledUrls.length > 0 && (
        <div style={styles.filters}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search URLs or titles..."
            style={styles.searchInput}
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as keyof CrawledURL)}
            style={styles.select}
          >
            <option value="url">Sort by URL</option>
            <option value="title">Sort by Title</option>
            <option value="seoScore">Sort by SEO Score</option>
            <option value="aeoScore">Sort by AEO Score</option>
            <option value="eeatScore">Sort by E-E-A-T Score</option>
            <option value="wordCount">Sort by Word Count</option>
          </select>
          
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            style={styles.sortButton}
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      )}

      {/* URL List */}
      {filteredAndSortedUrls.length > 0 && (
        <div style={styles.urlList}>
          {filteredAndSortedUrls.map((urlData) => (
            <div
              key={urlData.url}
              style={{
                ...styles.urlCard,
                ...(selectedUrls.has(urlData.url) ? styles.urlCardSelected : {})
              }}
              onClick={() => toggleUrlSelection(urlData.url)}
            >
              <div style={styles.urlHeader}>
                <input
                  type="checkbox"
                  checked={selectedUrls.has(urlData.url)}
                  onChange={() => toggleUrlSelection(urlData.url)}
                  style={styles.checkbox}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div style={styles.urlInfo}>
                  <div style={styles.urlTitle}>{urlData.title}</div>
                  <div style={styles.urlPath}>{urlData.url}</div>
                </div>
                
                <div style={styles.statusBadge}>
                  {urlData.status === 'pending' && '⏳ Pending'}
                  {urlData.status === 'analyzing' && '⚡ Analyzing'}
                  {urlData.status === 'complete' && '✅ Complete'}
                  {urlData.status === 'error' && '❌ Error'}
                </div>
              </div>

              {urlData.status === 'complete' && urlData.seoScore !== undefined && (
                <div style={styles.metrics}>
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>SEO</span>
                    <span style={getScoreStyle(urlData.seoScore)}>
                      {urlData.seoScore}/100
                    </span>
                  </div>
                  
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>AEO</span>
                    <span style={getScoreStyle(urlData.aeoScore || 0)}>
                      {urlData.aeoScore}/100
                    </span>
                  </div>
                  
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>E-E-A-T</span>
                    <span style={getScoreStyle(urlData.eeatScore || 0)}>
                      {urlData.eeatScore}/100
                    </span>
                  </div>
                  
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>Entity</span>
                    <span style={getScoreStyle(urlData.entityScore || 0)}>
                      {urlData.entityScore}/100
                    </span>
                  </div>
                  
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>Semantic</span>
                    <span style={getScoreStyle(urlData.semanticScore || 0)}>
                      {urlData.semanticScore}/100
                    </span>
                  </div>
                  
                  <div style={styles.metricItem}>
                    <span style={styles.metricLabel}>Words</span>
                    <span style={styles.metricValue}>{urlData.wordCount}</span>
                  </div>
                </div>
              )}

              {urlData.status === 'error' && (
                <div style={styles.errorMessage}>
                  {urlData.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {crawledUrls.length === 0 && !isCrawling && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🕸️</div>
          <p style={styles.emptyText}>Enter your sitemap URL to begin</p>
          <p style={styles.emptySubtext}>URLs will be fetched instantly, then you can select which ones to analyze</p>
        </div>
      )}
    </div>
  );
};

// Score color helper
const getScoreStyle = (score: number) => ({
  ...styles.metricValue,
  color: score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : score >= 40 ? '#EF4444' : '#6B7280',
  fontWeight: 700
});

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: '0.95rem'
  },
  controls: {
    background: 'rgba(12, 12, 16, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E2E8F0',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s'
  },
  primaryButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  selectionInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  badge: {
    padding: '0.25rem 0.75rem',
    background: 'rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    fontSize: '0.85rem',
    color: '#3B82F6',
    fontWeight: 600
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#3B82F6',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '0.25rem 0.5rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem'
  },
  successButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  dangerButton: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    color: '#EF4444',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  progress: {
    background: 'rgba(12, 12, 16, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
    transition: 'width 0.3s ease'
  },
  progressText: {
    color: '#94A3B8',
    fontSize: '0.9rem'
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E2E8F0',
    fontSize: '0.95rem',
    outline: 'none'
  },
  select: {
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E2E8F0',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer'
  },
  sortButton: {
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#E2E8F0',
    fontSize: '0.95rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  urlList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  urlCard: {
    background: 'rgba(12, 12, 16, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  urlCardSelected: {
    border: '1px solid rgba(59, 130, 246, 0.5)',
    background: 'rgba(59, 130, 246, 0.05)'
  },
  urlHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  urlInfo: {
    flex: 1,
    minWidth: 0
  },
  urlTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#E2E8F0',
    marginBottom: '0.25rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  urlPath: {
    fontSize: '0.85rem',
    color: '#94A3B8',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  statusBadge: {
    padding: '0.35rem 0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  metricValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#E2E8F0'
  },
  errorMessage: {
    padding: '0.75rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    color: '#EF4444',
    fontSize: '0.85rem',
    marginTop: '1rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#94A3B8'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  emptyText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#E2E8F0'
  },
  emptySubtext: {
    fontSize: '0.9rem'
  }
};

export default SitemapCrawler;