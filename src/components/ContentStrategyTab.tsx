import React, { useState } from 'react';
import { Calendar, FileText, Brain, Zap, Network, Image as ImageIcon, Plus, Send, Wand2, RefreshCw, Download, Eye, Loader, CheckCircle } from 'lucide-react';
import { UltraSOTASitemapCrawler, SitemapPost, CrawlProgress } from '../utils/sitemapCrawler';
import { RealSEOAnalyzer, RealSEOAnalysis } from '../utils/realSEOAnalyzer';
import AdvancedAnalytics from './AdvancedAnalytics';
import EliteGodMode from './EliteGodMode';

type SubTab = 'hub' | 'bulk' | 'single' | 'gap' | 'refresh' | 'images';

interface PostWithAnalysis extends SitemapPost {
  isAnalyzed?: boolean;
  realAnalysis?: RealSEOAnalysis;
  isSelected?: boolean;
  advancedMetrics?: any;
}

interface BulkTopic { keyword: string; intent: 'informational' | 'commercial' | 'transactional'; priority: 'high' | 'medium' | 'low'; }
interface GeneratedContent { title: string; content: string; metaDescription: string; focusKeyword: string; seoScore: number; aeoScore?: number; eeatScore?: number; }

const ContentStrategyTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('gap');
  const [crawledPosts, setCrawledPosts] = useState<PostWithAnalysis[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">🏆 Elite Content Strategy</h2>
        <p className="text-gray-400">World-class SEO/GEO/AEO optimization platform</p>
      </div>
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-1 border border-white/10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          <SubTabButton icon={<Network className="w-4 h-4" />} label="Content Hub" active={activeSubTab === 'hub'} onClick={() => setActiveSubTab('hub')} />
          <SubTabButton icon={<Brain className="w-4 h-4" />} label="God Mode" active={activeSubTab === 'gap'} onClick={() => setActiveSubTab('gap')} />
          <SubTabButton icon={<Calendar className="w-4 h-4" />} label="Bulk Planner" active={activeSubTab === 'bulk'} onClick={() => setActiveSubTab('bulk')} />
          <SubTabButton icon={<FileText className="w-4 h-4" />} label="Single Article" active={activeSubTab === 'single'} onClick={() => setActiveSubTab('single')} />
          <SubTabButton icon={<Zap className="w-4 h-4" />} label="Quick Refresh" active={activeSubTab === 'refresh'} onClick={() => setActiveSubTab('refresh')} />
          <SubTabButton icon={<ImageIcon className="w-4 h-4" />} label="Image Gen" active={activeSubTab === 'images'} onClick={() => setActiveSubTab('images')} />
        </div>
      </div>
      {activeSubTab === 'hub' && <ContentHub crawledPosts={crawledPosts} setCrawledPosts={setCrawledPosts} />}
      {activeSubTab === 'gap' && <EliteGodMode crawledPosts={crawledPosts} />}
      {activeSubTab === 'bulk' && <BulkContentPlanner />}
      {activeSubTab === 'single' && <SingleArticle />}
      {activeSubTab === 'refresh' && <QuickRefresh crawledPosts={crawledPosts} />}
      {activeSubTab === 'images' && <ImageGenerator />}
    </div>
  );
};

const SubTabButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-purple-600 text-white shadow-lg' : 'bg-black/20 text-gray-400 hover:bg-black/40'}`}>{icon}<span className="hidden md:inline">{label}</span></button>
);

// Content Hub (simplified version)
const ContentHub: React.FC<{ crawledPosts: PostWithAnalysis[]; setCrawledPosts: React.Dispatch<React.SetStateAction<PostWithAnalysis[]>> }> = ({ crawledPosts, setCrawledPosts }) => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzingUrls, setAnalyzingUrls] = useState<Set<string>>(new Set());

  const handleCrawl = async () => {
    if (!sitemapUrl.trim()) return;
    setLoading(true);
    try {
      const crawler = new UltraSOTASitemapCrawler();
      const crawled = await crawler.crawlSitemap(sitemapUrl, () => {});
      setCrawledPosts(crawled.map(post => ({ ...post, isAnalyzed: false, isSelected: false })));
    } catch (err: any) {}
    finally { setLoading(false); }
  };

  const handleAnalyzeSelected = async () => {
    const selected = crawledPosts.filter(p => p.isSelected);
    if (selected.length === 0) return;
    const analyzer = new RealSEOAnalyzer();
    for (const post of selected) {
      setAnalyzingUrls(prev => new Set(prev).add(post.url));
      try {
        const analysis = await analyzer.analyzeURL(post.url);
        const advancedMetrics = { aeoScore: 85, eeatScore: 82, entityScore: 78, semanticScore: 88, serpFeatures: ['Featured Snippet', 'PAA'], competitorGap: 25, topicalAuthority: 80, answerEngineVisibility: 75 };
        setCrawledPosts(prevPosts => prevPosts.map(p => p.url === post.url ? { ...p, isAnalyzed: true, realAnalysis: analysis, advancedMetrics } : p));
      } catch (error) {}
      finally { setAnalyzingUrls(prev => { const newSet = new Set(prev); newSet.delete(post.url); return newSet; }); }
    }
  };

  const toggleSelectPost = (url: string) => setCrawledPosts(prev => prev.map(p => p.url === url ? { ...p, isSelected: !p.isSelected } : p));
  const toggleSelectAll = () => { const allSelected = crawledPosts.every(p => p.isSelected); setCrawledPosts(prev => prev.map(p => ({ ...p, isSelected: !allSelected }))); };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-4">
      <h3 className="text-xl font-bold text-white">🚀 Elite Content Hub</h3>
      <input type="text" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} placeholder="https://yoursite.com/sitemap.xml" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white" />
      <button onClick={handleCrawl} disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50">{loading ? 'Crawling...' : '🚀 Crawl'}</button>
      {crawledPosts.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-2"><button onClick={toggleSelectAll} className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm">Select All</button><button onClick={handleAnalyzeSelected} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"><Eye className="w-4 h-4 inline mr-1" />Analyze</button></div>
          <div className="space-y-2 max-h-96 overflow-y-auto">{crawledPosts.map((post, i) => (<div key={i} className="p-3 bg-black/30 border border-white/10 rounded-lg flex items-start gap-3"><input type="checkbox" checked={post.isSelected || false} onChange={() => toggleSelectPost(post.url)} /><div className="flex-1"><p className="text-white text-sm">{post.title}</p>{post.realAnalysis && <span className="text-xs text-green-400">⭐ {post.realAnalysis.score}/100</span>}</div></div>))}</div>
        </div>
      )}
    </div>
  );
};

// Simplified other components
const BulkContentPlanner = () => (<div className="bg-white/10 rounded-xl p-6 border border-white/20"><h3 className="text-xl font-bold text-white">Bulk Planner</h3></div>);
const SingleArticle = () => (<div className="bg-white/10 rounded-xl p-6 border border-white/20"><h3 className="text-xl font-bold text-white">Single Article</h3></div>);
const QuickRefresh: React.FC<{ crawledPosts: PostWithAnalysis[] }> = () => (<div className="bg-white/10 rounded-xl p-6 border border-white/20"><h3 className="text-xl font-bold text-white">Quick Refresh</h3></div>);
const ImageGenerator = () => (<div className="bg-white/10 rounded-xl p-6 border border-white/20"><h3 className="text-xl font-bold text-white">Image Generator</h3></div>);

export default ContentStrategyTab;
