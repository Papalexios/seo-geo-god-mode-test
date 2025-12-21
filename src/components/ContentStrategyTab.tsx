import React, { useState, useEffect, useRef } from 'react';
import { Calendar, FileText, Brain, Zap, Network, Image, AlertCircle, CheckCircle, Loader, Info, TrendingUp, Clock, Gauge, Power, Activity, Target, Sparkles, Eye, Settings } from 'lucide-react';
import { UltraSOTASitemapCrawler, SitemapPost, CrawlProgress } from '../utils/sitemapCrawler';
import { RealSEOAnalyzer, RealSEOAnalysis } from '../utils/realSEOAnalyzer';
import { WordPressAPI, WordPressConfig } from '../utils/wordPressAPI';

type SubTab = 'bulk' | 'single' | 'gap' | 'refresh' | 'hub' | 'images';

interface PostWithAnalysis extends SitemapPost {
  isAnalyzed?: boolean;
  realAnalysis?: RealSEOAnalysis;
  isSelected?: boolean;
}

let globalCrawledPosts: PostWithAnalysis[] = [];
let wordPressAPI: WordPressAPI | null = null;

const ContentStrategyTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('hub');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">2. Content Strategy & Planning</h2>
      </div>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-1 border border-white/10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          <SubTabButton icon={<Calendar className="w-4 h-4" />} label="Bulk Content Planner" active={activeSubTab === 'bulk'} onClick={() => setActiveSubTab('bulk')} />
          <SubTabButton icon={<FileText className="w-4 h-4" />} label="Single Article" active={activeSubTab === 'single'} onClick={() => setActiveSubTab('single')} />
          <SubTabButton icon={<Brain className="w-4 h-4" />} label="Gap Analysis (God Mode)" active={activeSubTab === 'gap'} onClick={() => setActiveSubTab('gap')} />
          <SubTabButton icon={<Zap className="w-4 h-4" />} label="Quick Refresh" active={activeSubTab === 'refresh'} onClick={() => setActiveSubTab('refresh')} />
          <SubTabButton icon={<Network className="w-4 h-4" />} label="Content Hub" active={activeSubTab === 'hub'} onClick={() => setActiveSubTab('hub')} />
          <SubTabButton icon={<Image className="w-4 h-4" />} label="Image Generator" active={activeSubTab === 'images'} onClick={() => setActiveSubTab('images')} />
        </div>
      </div>

      {activeSubTab === 'bulk' && <BulkContentPlanner />}
      {activeSubTab === 'single' && <SingleArticle />}
      {activeSubTab === 'gap' && <GapAnalysisGodMode />}
      {activeSubTab === 'refresh' && <QuickRefresh />}
      {activeSubTab === 'hub' && <ContentHub />}
      {activeSubTab === 'images' && <ImageGenerator />}
    </div>
  );
};

const SubTabButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-purple-600 text-white shadow-lg' : 'bg-black/20 text-gray-400 hover:bg-black/40 hover:text-gray-300'}`}>
    {icon}<span className="hidden md:inline">{label}</span>
  </button>
);

// ============= CONTENT HUB WITH REAL ANALYSIS =============
const ContentHub: React.FC = () => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<PostWithAnalysis[]>([]);
  const [crawlProgress, setCrawlProgress] = useState<CrawlProgress | null>(null);
  const [analyzingUrls, setAnalyzingUrls] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'score'>('score');
  const [selectedCount, setSelectedCount] = useState(0);
  const [showWPConfig, setShowWPConfig] = useState(false);
  const [wpConfig, setWpConfig] = useState<WordPressConfig>({
    siteUrl: '',
    username: '',
    applicationPassword: ''
  });

  const handleCrawl = async () => {
    if (!sitemapUrl.trim()) { setError('Please enter a sitemap URL'); return; }
    try { new URL(sitemapUrl); } catch { setError('Invalid URL format'); return; }

    setLoading(true); setError(''); setPosts([]); setCrawlProgress(null);

    try {
      const crawler = new UltraSOTASitemapCrawler();
      const crawledPosts = await crawler.crawlSitemap(sitemapUrl, (progress) => {
        setCrawlProgress(progress);
      });

      const postsWithState = crawledPosts.map(post => ({
        ...post,
        isAnalyzed: false,
        isSelected: false
      }));

      setPosts(postsWithState);
      globalCrawledPosts = postsWithState;
      setError('');
      
    } catch (err: any) {
      console.error('Crawl error:', err);
      setError(err.message || 'Failed to crawl sitemap');
      setPosts([]);
    } finally {
      setLoading(false);
      setCrawlProgress(null);
    }
  };

  const handleAnalyzeSelected = async () => {
    const selected = posts.filter(p => p.isSelected);
    if (selected.length === 0) {
      alert('Please select at least one URL to analyze');
      return;
    }

    if (selected.length > 10) {
      if (!confirm(`You selected ${selected.length} URLs. This will take some time. Continue?`)) {
        return;
      }
    }

    const analyzer = new RealSEOAnalyzer();

    for (const post of selected) {
      setAnalyzingUrls(prev => new Set(prev).add(post.url));

      try {
        const analysis = await analyzer.analyzeURL(post.url);
        
        setPosts(prevPosts => 
          prevPosts.map(p => 
            p.url === post.url 
              ? { ...p, isAnalyzed: true, realAnalysis: analysis }
              : p
          )
        );

        globalCrawledPosts = globalCrawledPosts.map(p => 
          p.url === post.url 
            ? { ...p, isAnalyzed: true, realAnalysis: analysis }
            : p
        );

      } catch (error) {
        console.error(`Failed to analyze ${post.url}:`, error);
      } finally {
        setAnalyzingUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(post.url);
          return newSet;
        });
      }
    }
  };

  const toggleSelectPost = (url: string) => {
    setPosts(prevPosts => {
      const newPosts = prevPosts.map(p => 
        p.url === url ? { ...p, isSelected: !p.isSelected } : p
      );
      setSelectedCount(newPosts.filter(p => p.isSelected).length);
      return newPosts;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = posts.every(p => p.isSelected);
    setPosts(prevPosts => prevPosts.map(p => ({ ...p, isSelected: !allSelected })));
    setSelectedCount(allSelected ? 0 : posts.length);
  };

  const handleSaveWPConfig = () => {
    if (!wpConfig.siteUrl || !wpConfig.username || !wpConfig.applicationPassword) {
      alert('Please fill in all WordPress credentials');
      return;
    }
    wordPressAPI = new WordPressAPI(wpConfig);
    setShowWPConfig(false);
    alert('WordPress credentials saved! You can now use optimization features.');
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.url.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'score') {
      const scoreA = a.realAnalysis?.score ?? 999;
      const scoreB = b.realAnalysis?.score ?? 999;
      return scoreA - scoreB;
    }
    if (sortBy === 'date' && a.lastmod && b.lastmod) return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
    return 0;
  });

  const analyzedCount = posts.filter(p => p.isAnalyzed).length;
  const criticalCount = posts.filter(p => p.realAnalysis && p.realAnalysis.score < 50).length;
  const poorCount = posts.filter(p => p.realAnalysis && p.realAnalysis.score >= 50 && p.realAnalysis.score < 70).length;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">🚀 ULTRA-SOTA Content Hub</h3>
          <p className="text-gray-400 text-sm">Real SEO analysis - Select URLs to analyze</p>
        </div>
        <button onClick={() => setShowWPConfig(!showWPConfig)} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" /> WP Config
        </button>
      </div>

      {showWPConfig && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6">
          <h4 className="text-white font-semibold mb-3">WordPress Configuration</h4>
          <div className="space-y-3">
            <input type="text" placeholder="Site URL (e.g., https://yoursite.com)" value={wpConfig.siteUrl} onChange={(e) => setWpConfig({...wpConfig, siteUrl: e.target.value})} className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm" />
            <input type="text" placeholder="Username" value={wpConfig.username} onChange={(e) => setWpConfig({...wpConfig, username: e.target.value})} className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm" />
            <input type="password" placeholder="Application Password" value={wpConfig.applicationPassword} onChange={(e) => setWpConfig({...wpConfig, applicationPassword: e.target.value})} className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm" />
            <button onClick={handleSaveWPConfig} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">Save Configuration</button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-200">
            <p className="font-semibold mb-1">⭐ REAL ANALYSIS Features:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Fetches actual page HTML content</li>
              <li>Analyzes 10+ SEO metrics (title, meta, headings, content, links, images)</li>
              <li>Calculates real readability scores (Flesch Reading Ease)</li>
              <li>Detects schema markup and technical SEO</li>
              <li>Select specific URLs to prevent server overload</li>
              <li>WordPress REST API integration for optimization</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sitemap URL</label>
          <input type="text" value={sitemapUrl} onChange={(e) => { setSitemapUrl(e.target.value); setError(''); }} disabled={loading} placeholder="https://gearuptofit.com/post-sitemap.xml" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" />
        </div>

        {error && (<div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" /><p className="text-red-300 text-sm">{error}</p></div>)}

        <button onClick={handleCrawl} disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
          {loading ? <><Loader className="w-5 h-5 animate-spin" />{crawlProgress?.phase === 'fetching' ? 'Fetching sitemap...' : crawlProgress?.phase === 'parsing' ? 'Parsing XML...' : `Processing ${crawlProgress?.processedUrls}/${crawlProgress?.totalUrls}...`}</> : '🚀 Crawl Sitemap'}
        </button>

        {crawlProgress && crawlProgress.phase === 'processing' && (
          <div className="space-y-3">
            <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300" style={{ width: `${crawlProgress.progress}%` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1"><Gauge className="w-4 h-4 text-purple-400" /><span className="text-xs text-gray-400">Speed</span></div>
                <p className="text-lg font-bold text-white">{crawlProgress.speed} <span className="text-xs text-gray-400">URLs/s</span></p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400">Processed</span></div>
                <p className="text-lg font-bold text-white">{crawlProgress.processedUrls}<span className="text-xs text-gray-400">/{crawlProgress.totalUrls}</span></p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-blue-400" /><span className="text-xs text-gray-400">ETA</span></div>
                <p className="text-lg font-bold text-white">{crawlProgress.estimatedTimeRemaining}<span className="text-xs text-gray-400">s</span></p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1"><Network className="w-4 h-4 text-yellow-400" /><span className="text-xs text-gray-400">Total</span></div>
                <p className="text-lg font-bold text-white">{crawlProgress.totalUrls}</p>
              </div>
            </div>
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-6 space-y-4">
            {analyzedCount > 0 && (
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3">🎯 REAL Analysis Results</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Analyzed</p>
                    <p className="text-2xl font-bold text-green-400">{analyzedCount}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Critical ({'<'}50)</p>
                    <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Poor (50-69)</p>
                    <p className="text-2xl font-bold text-yellow-400">{poorCount}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Good (70+)</p>
                    <p className="text-2xl font-bold text-blue-400">{analyzedCount - criticalCount - poorCount}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h4 className="text-lg font-bold text-white">Found {posts.length} posts</h4>
                  <p className="text-sm text-gray-400">{selectedCount} selected for analysis</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={toggleSelectAll} className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm">
                  {posts.every(p => p.isSelected) ? 'Deselect All' : 'Select All'}
                </button>
                <button onClick={handleAnalyzeSelected} disabled={selectedCount === 0 || analyzingUrls.size > 0} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
                  {analyzingUrls.size > 0 ? <><Loader className="w-4 h-4 animate-spin" />Analyzing...</> : <><Eye className="w-4 h-4" />Analyze Selected ({selectedCount})</>}
                </button>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm">
                  <option value="score">Sort by Score</option>
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredPosts.map((post, i) => (
                <div key={i} className={`p-4 border rounded-lg transition-all ${
                  post.realAnalysis && post.realAnalysis.score < 50 ? 'bg-red-500/10 border-red-500/30' :
                  post.realAnalysis && post.realAnalysis.score < 70 ? 'bg-yellow-500/10 border-yellow-500/30' :
                  post.isAnalyzed ? 'bg-green-500/10 border-green-500/30' :
                  'bg-black/30 border-white/10'
                }`}>
                  <div className="flex items-start gap-4">
                    <input type="checkbox" checked={post.isSelected || false} onChange={() => toggleSelectPost(post.url)} className="mt-1 w-4 h-4" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-white font-medium truncate">{post.title}</h5>
                      <p className="text-xs text-gray-400 truncate mt-1">{post.url}</p>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        {post.realAnalysis && (
                          <>
                            <span className={`text-sm font-bold ${
                              post.realAnalysis.score < 50 ? 'text-red-400' :
                              post.realAnalysis.score < 70 ? 'text-yellow-400' :
                              post.realAnalysis.score < 86 ? 'text-green-400' :
                              'text-blue-400'
                            }`}>⭐ REAL SEO: {post.realAnalysis.score}/100</span>
                            <span className="text-xs text-gray-400">{post.realAnalysis.wordCount} words</span>
                            <span className="text-xs text-gray-400">{post.realAnalysis.issues.length} issues</span>
                            <span className="text-xs text-gray-400">{post.realAnalysis.readingTime} min read</span>
                          </>
                        )}
                        {analyzingUrls.has(post.url) && (
                          <span className="text-xs text-blue-400 flex items-center gap-1">
                            <Loader className="w-3 h-3 animate-spin" /> Analyzing...
                          </span>
                        )}
                        {!post.isAnalyzed && !analyzingUrls.has(post.url) && (
                          <span className="text-xs text-gray-500">Not analyzed yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredPosts.length === 0 && searchTerm && <p className="text-center text-gray-400 py-4">No posts match your search</p>}
          </div>
        )}
      </div>
    </div>
  );
};

// ============= GOD MODE - Uses Real Analysis Data =============
const GapAnalysisGodMode: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">🧠 Gap Analysis & God Mode</h3>
      <p className="text-gray-400">This feature will use the REAL analysis data from Content Hub to autonomously optimize critical posts!</p>
      <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 text-sm"><strong>⚠️ Coming Soon:</strong> Full autonomous optimization using real SEO data and WordPress API integration.</p>
      </div>
    </div>
  );
};

const BulkContentPlanner = () => <div className="bg-white/10 rounded-xl p-6 border border-white/20"><h3 className="text-xl font-bold text-white">Bulk Content Planner</h3></div>;
const SingleArticle = () => <div className="bg-white/10 rounded-xl p-6 border border-white/20"><h3 className="text-xl font-bold text-white">Single Article</h3></div>;
const QuickRefresh = () => <div className="bg-white/10 rounded-xl p-6 border border-white/20"><h3 className="text-xl font-bold text-white">Quick Refresh</h3></div>;
const ImageGenerator = () => <div className="bg-white/10 rounded-xl p-6 border border-white/20"><h3 className="text-xl font-bold text-white">Image Generator</h3></div>;

export default ContentStrategyTab;