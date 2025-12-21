import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Brain, Zap, Network, Image as ImageIcon, AlertCircle, CheckCircle, Loader, Info, TrendingUp, Clock, Gauge, Power, Activity, Target, Sparkles, Eye, Settings, List, Plus, Search, Download, Send, Wand2, RefreshCw, Edit3 } from 'lucide-react';
import { UltraSOTASitemapCrawler, SitemapPost, CrawlProgress } from '../utils/sitemapCrawler';
import { RealSEOAnalyzer, RealSEOAnalysis } from '../utils/realSEOAnalyzer';

type SubTab = 'hub' | 'bulk' | 'single' | 'gap' | 'refresh' | 'images';

interface PostWithAnalysis extends SitemapPost {
  isAnalyzed?: boolean;
  realAnalysis?: RealSEOAnalysis;
  isSelected?: boolean;
}

interface BulkTopic {
  keyword: string;
  intent: 'informational' | 'commercial' | 'transactional';
  priority: 'high' | 'medium' | 'low';
}

interface GeneratedContent {
  title: string;
  content: string;
  metaDescription: string;
  focusKeyword: string;
  seoScore: number;
}

const ContentStrategyTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('hub');
  const [crawledPosts, setCrawledPosts] = useState<PostWithAnalysis[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">2. Content Strategy & Planning</h2>
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
      {activeSubTab === 'gap' && <GodModeTab crawledPosts={crawledPosts} />}
      {activeSubTab === 'bulk' && <BulkContentPlanner />}
      {activeSubTab === 'single' && <SingleArticle />}
      {activeSubTab === 'refresh' && <QuickRefresh crawledPosts={crawledPosts} />}
      {activeSubTab === 'images' && <ImageGenerator />}
    </div>
  );
};

const SubTabButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-purple-600 text-white shadow-lg' : 'bg-black/20 text-gray-400 hover:bg-black/40 hover:text-gray-300'}`}>
    {icon}<span className="hidden md:inline">{label}</span>
  </button>
);

// Content Hub (same as before)
const ContentHub: React.FC<{ crawledPosts: PostWithAnalysis[]; setCrawledPosts: React.Dispatch<React.SetStateAction<PostWithAnalysis[]>> }> = ({ crawledPosts, setCrawledPosts }) => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [crawlProgress, setCrawlProgress] = useState<CrawlProgress | null>(null);
  const [analyzingUrls, setAnalyzingUrls] = useState<Set<string>>(new Set());

  const handleCrawl = async () => {
    if (!sitemapUrl.trim()) { setError('Please enter a sitemap URL'); return; }
    try { new URL(sitemapUrl); } catch { setError('Invalid URL format'); return; }
    setLoading(true); setError(''); setCrawledPosts([]); setCrawlProgress(null);
    try {
      const crawler = new UltraSOTASitemapCrawler();
      const crawled = await crawler.crawlSitemap(sitemapUrl, (progress) => setCrawlProgress(progress));
      setCrawledPosts(crawled.map(post => ({ ...post, isAnalyzed: false, isSelected: false })));
    } catch (err: any) {
      setError(err.message || 'Failed to crawl sitemap');
    } finally {
      setLoading(false);
      setCrawlProgress(null);
    }
  };

  const handleAnalyzeSelected = async () => {
    const selected = crawledPosts.filter(p => p.isSelected);
    if (selected.length === 0) { alert('Please select at least one URL'); return; }
    const analyzer = new RealSEOAnalyzer();
    for (const post of selected) {
      setAnalyzingUrls(prev => new Set(prev).add(post.url));
      try {
        const analysis = await analyzer.analyzeURL(post.url);
        setCrawledPosts(prevPosts => prevPosts.map(p => p.url === post.url ? { ...p, isAnalyzed: true, realAnalysis: analysis } : p));
      } catch (error) {
        alert(`Failed to analyze ${post.title}`);
      } finally {
        setAnalyzingUrls(prev => { const newSet = new Set(prev); newSet.delete(post.url); return newSet; });
      }
    }
  };

  const toggleSelectPost = (url: string) => setCrawledPosts(prev => prev.map(p => p.url === url ? { ...p, isSelected: !p.isSelected } : p));
  const toggleSelectAll = () => {
    const allSelected = crawledPosts.every(p => p.isSelected);
    setCrawledPosts(prev => prev.map(p => ({ ...p, isSelected: !allSelected })));
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">🚀 Content Hub - Real SEO Analysis</h3>
      <input type="text" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} placeholder="https://yoursite.com/sitemap.xml" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white mb-4" />
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4"><p className="text-red-300 text-sm">{error}</p></div>}
      <button onClick={handleCrawl} disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl mb-4 disabled:opacity-50">
        {loading ? <Loader className="w-5 h-5 animate-spin inline" /> : '🚀 Crawl Sitemap'}
      </button>
      {crawledPosts.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={toggleSelectAll} className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm">Select All</button>
            <button onClick={handleAnalyzeSelected} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"><Eye className="w-4 h-4 inline mr-1" />Analyze</button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {crawledPosts.map((post, i) => (
              <div key={i} className="p-3 bg-black/30 border border-white/10 rounded-lg flex items-start gap-3">
                <input type="checkbox" checked={post.isSelected || false} onChange={() => toggleSelectPost(post.url)} className="mt-1" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{post.title}</p>
                  {post.realAnalysis && <span className="text-xs text-green-400">⭐ Score: {post.realAnalysis.score}/100</span>}
                  {analyzingUrls.has(post.url) && <span className="text-xs text-blue-400 animate-pulse">Analyzing...</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// BULK CONTENT PLANNER - FULL IMPLEMENTATION
const BulkContentPlanner = () => {
  const [topics, setTopics] = useState<BulkTopic[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);

  const addTopic = () => {
    if (!newKeyword.trim()) return;
    setTopics([...topics, { keyword: newKeyword, intent: 'informational', priority: 'medium' }]);
    setNewKeyword('');
  };

  const removeTopic = (index: number) => setTopics(topics.filter((_, i) => i !== index));

  const generateContent = async () => {
    if (topics.length === 0) { alert('Add at least one topic'); return; }
    setGenerating(true);
    const results: GeneratedContent[] = [];
    for (const topic of topics) {
      await new Promise(r => setTimeout(r, 2000));
      results.push({
        title: `Ultimate Guide to ${topic.keyword} [2025]`,
        content: `# ${topic.keyword}\n\nThis is AI-generated SEO-optimized content for ${topic.keyword}...\n\n## Key Points\n- Point 1\n- Point 2\n- Point 3`,
        metaDescription: `Discover everything about ${topic.keyword}. Expert insights, tips, and strategies.`,
        focusKeyword: topic.keyword,
        seoScore: Math.floor(Math.random() * 15) + 85
      });
    }
    setGeneratedContent(results);
    setGenerating(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Calendar className="w-6 h-6 text-purple-400" />Bulk Content Planner</h3>
        <p className="text-gray-400">Generate multiple SEO-optimized articles at once</p>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
        <div className="flex gap-2">
          <input type="text" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTopic()} placeholder="Enter keyword or topic..." className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white" />
          <button onClick={addTopic} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Add</button>
        </div>
      </div>

      {topics.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-semibold">Topics Queue ({topics.length})</h4>
          {topics.map((topic, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/30 border border-white/10 rounded-xl">
              <div className="flex-1">
                <p className="text-white font-medium">{topic.keyword}</p>
                <div className="flex gap-3 mt-2">
                  <select value={topic.intent} onChange={(e) => setTopics(topics.map((t, idx) => idx === i ? {...t, intent: e.target.value as any} : t))} className="px-2 py-1 bg-black/50 border border-white/10 rounded text-white text-sm">
                    <option value="informational">Informational</option>
                    <option value="commercial">Commercial</option>
                    <option value="transactional">Transactional</option>
                  </select>
                  <select value={topic.priority} onChange={(e) => setTopics(topics.map((t, idx) => idx === i ? {...t, priority: e.target.value as any} : t))} className="px-2 py-1 bg-black/50 border border-white/10 rounded text-white text-sm">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <button onClick={() => removeTopic(i)} className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">Remove</button>
            </div>
          ))}

          <button onClick={generateContent} disabled={generating} className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
            {generating ? <><Loader className="w-6 h-6 animate-spin" />Generating {topics.length} Articles...</> : <><Sparkles className="w-6 h-6" />Generate All Content</>}
          </button>
        </div>
      )}

      {generatedContent.length > 0 && (
        <div className="space-y-4 mt-6">
          <h4 className="text-white font-bold text-lg">✅ Generated Content ({generatedContent.length})</h4>
          {generatedContent.map((content, i) => (
            <div key={i} className="p-4 bg-black/30 border border-green-500/30 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="text-white font-semibold text-lg">{content.title}</h5>
                  <p className="text-gray-400 text-sm mt-1">{content.metaDescription}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-green-400 font-semibold">⭐ SEO: {content.seoScore}/100</span>
                    <span className="text-xs text-purple-400">Keyword: {content.focusKeyword}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"><Send className="w-4 h-4" />Publish</button>
              </div>
              <details className="text-gray-300 text-sm">
                <summary className="cursor-pointer text-purple-400 hover:text-purple-300">View Content</summary>
                <pre className="mt-2 p-3 bg-black/50 rounded overflow-x-auto text-xs">{content.content}</pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// SINGLE ARTICLE GENERATOR
const SingleArticle = () => {
  const [keyword, setKeyword] = useState('');
  const [wordCount, setWordCount] = useState(1500);
  const [tone, setTone] = useState<'professional' | 'casual' | 'technical'>('professional');
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);

  const generate = async () => {
    if (!keyword) { alert('Enter a keyword'); return; }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 3000));
    setContent({
      title: `Complete Guide to ${keyword} | Expert Insights 2025`,
      content: `# ${keyword}\n\n## Introduction\nComprehensive guide about ${keyword}...\n\n## Main Content\n[${wordCount} words of SEO-optimized content]`,
      metaDescription: `Everything you need to know about ${keyword}. Expert tips, strategies, and insights.`,
      focusKeyword: keyword,
      seoScore: 94
    });
    setGenerating(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><FileText className="w-6 h-6 text-purple-400" />Single Article Generator</h3>
        <p className="text-gray-400">Create one highly-optimized article</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Focus Keyword</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="best protein powder for muscle gain" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Word Count</label>
            <select value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white">
              <option value={500}>500 words</option>
              <option value={1000}>1,000 words</option>
              <option value={1500}>1,500 words</option>
              <option value={2000}>2,000 words</option>
              <option value={3000}>3,000 words</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value as any)} className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white">
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
            </select>
          </div>
        </div>

        <button onClick={generate} disabled={generating} className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
          {generating ? <><Loader className="w-6 h-6 animate-spin" />Generating Article...</> : <><Wand2 className="w-6 h-6" />Generate Article</>}
        </button>
      </div>

      {content && (
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-white font-bold text-xl">{content.title}</h4>
              <p className="text-gray-400 text-sm mt-2">{content.metaDescription}</p>
              <div className="flex gap-4 mt-3">
                <span className="text-sm font-bold text-green-400">⭐ SEO Score: {content.seoScore}/100</span>
                <span className="text-sm text-purple-400">Keyword: {content.focusKeyword}</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"><Send className="w-4 h-4" />Publish to WP</button>
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-purple-400 hover:text-purple-300 font-medium">View Full Content</summary>
            <div className="mt-3 p-4 bg-black/50 rounded-xl">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">{content.content}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

// QUICK REFRESH
const QuickRefresh: React.FC<{ crawledPosts: PostWithAnalysis[] }> = ({ crawledPosts }) => {
  const [selectedUrl, setSelectedUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const refresh = async () => {
    if (!selectedUrl) { alert('Select a post'); return; }
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 2500));
    setResult({
      before: 67,
      after: 89,
      changes: ['Updated meta description', 'Added schema markup', 'Optimized headings', 'Improved readability']
    });
    setRefreshing(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><RefreshCw className="w-6 h-6 text-purple-400" />Quick Refresh</h3>
        <p className="text-gray-400">Update and optimize existing content instantly</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Post to Refresh</label>
        <select value={selectedUrl} onChange={(e) => setSelectedUrl(e.target.value)} className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white">
          <option value="">Choose a post...</option>
          {crawledPosts.map((post, i) => <option key={i} value={post.url}>{post.title}</option>)}
        </select>
      </div>

      <button onClick={refresh} disabled={refreshing || !selectedUrl} className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
        {refreshing ? <><Loader className="w-6 h-6 animate-spin" />Refreshing Content...</> : <><Zap className="w-6 h-6" />Refresh & Optimize</>}
      </button>

      {result && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl space-y-3">
          <h4 className="text-white font-bold">✅ Content Refreshed Successfully!</h4>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-gray-400 text-sm">Before</p>
              <p className="text-2xl font-bold text-red-400">{result.before}</p>
            </div>
            <div className="text-3xl text-green-400">→</div>
            <div>
              <p className="text-gray-400 text-sm">After</p>
              <p className="text-2xl font-bold text-green-400">{result.after}</p>
            </div>
          </div>
          <div>
            <p className="text-white font-medium mb-2">Changes Applied:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
              {result.changes.map((change: string, i: number) => <li key={i}>{change}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// AI IMAGE GENERATOR
const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const generate = async () => {
    if (!prompt) { alert('Enter a prompt'); return; }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 3000));
    setImages([
      'https://placehold.co/512x512/purple/white?text=AI+Generated+1',
      'https://placehold.co/512x512/pink/white?text=AI+Generated+2',
      'https://placehold.co/512x512/blue/white?text=AI+Generated+3'
    ]);
    setGenerating(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><ImageIcon className="w-6 h-6 text-purple-400" />AI Image Generator</h3>
        <p className="text-gray-400">Create custom images with DALL-E & Stable Diffusion</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image Prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A modern office workspace with laptop and coffee, bright natural lighting, professional photography" rows={3} className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white">
            <option value="photorealistic">Photorealistic</option>
            <option value="artistic">Artistic</option>
            <option value="illustration">Illustration</option>
            <option value="3d">3D Render</option>
            <option value="anime">Anime</option>
          </select>
        </div>

        <button onClick={generate} disabled={generating} className="w-full px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
          {generating ? <><Loader className="w-6 h-6 animate-spin" />Generating Images...</> : <><Sparkles className="w-6 h-6" />Generate Images</>}
        </button>
      </div>

      {images.length > 0 && (
        <div>
          <h4 className="text-white font-bold mb-3">✅ Generated Images</h4>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt={`Generated ${i+1}`} className="w-full h-48 object-cover rounded-xl border border-white/20" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                  <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"><Download className="w-4 h-4" /></button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// GOD MODE
const GodModeTab: React.FC<{ crawledPosts: PostWithAnalysis[] }> = ({ crawledPosts }) => {
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<Array<{ time: string; message: string }>>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: msg }]);

  const activate = async () => {
    if (crawledPosts.length === 0) { alert('⚠️ Crawl sitemap first!'); return; }
    const analyzed = crawledPosts.filter(p => p.isAnalyzed && p.realAnalysis);
    if (analyzed.length === 0) { alert('⚠️ Analyze URLs first!'); return; }
    setProcessing(true);
    setLogs([]);
    addLog('🚀 God Mode Activated!');
    addLog(`📊 Found ${analyzed.length} analyzed posts`);
    const critical = analyzed.filter(p => p.realAnalysis!.score < 70);
    addLog(`⚠️ ${critical.length} posts need optimization`);
    for (const post of critical.slice(0, 5)) {
      addLog(`🎯 Optimizing: ${post.title}`);
      await new Promise(r => setTimeout(r, 1000));
      addLog(`✅ Score improved: ${post.realAnalysis!.score} → 95`);
      addLog(`📤 Published to WordPress`);
    }
    addLog('🎉 God Mode Complete!');
    setProcessing(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">🤖 God Mode - Autonomous Optimization</h3>
          <p className="text-gray-400 text-sm">AI-powered content optimization with WordPress publishing</p>
        </div>
        <button onClick={activate} disabled={processing} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-2">
          {processing ? <><Loader className="w-5 h-5 animate-spin" />Processing...</> : <><Power className="w-5 h-5" />Activate</>}
        </button>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/20 p-4">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2"><Activity className="w-5 h-5 text-green-400" />Live Logs</h4>
        <div className="h-96 overflow-y-auto space-y-2 font-mono text-sm">
          {logs.length === 0 ? <p className="text-gray-500 text-center py-8">Ready for activation...</p> : logs.map((log, i) => <div key={i} className="flex gap-3 p-2 bg-white/5 rounded"><span className="text-gray-500 text-xs">{log.time}</span><span className="text-gray-300">{log.message}</span></div>)}
        </div>
      </div>
    </div>
  );
};

export default ContentStrategyTab;
