import React, { useState } from 'react';
import { Calendar, FileText, Brain, Zap, Network, Image, AlertCircle, CheckCircle, Loader } from 'lucide-react';

type SubTab = 'bulk' | 'single' | 'gap' | 'refresh' | 'hub' | 'images';

const ContentStrategyTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('bulk');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">2. Content Strategy & Planning</h2>
      </div>

      {/* Sub-tabs */}
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

      {/* Content */}
      {activeSubTab === 'bulk' && <BulkContentPlanner />}
      {activeSubTab === 'single' && <SingleArticle />}
      {activeSubTab === 'gap' && <GapAnalysis />}
      {activeSubTab === 'refresh' && <QuickRefresh />}
      {activeSubTab === 'hub' && <ContentHub />}
      {activeSubTab === 'images' && <ImageGenerator />}
    </div>
  );
};

const SubTabButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-purple-600 text-white shadow-lg'
        : 'bg-black/20 text-gray-400 hover:bg-black/40 hover:text-gray-300'
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

const BulkContentPlanner: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult({
        pillar: `${topic} - Complete Guide`,
        clusters: [
          `${topic} for Beginners`,
          `Advanced ${topic} Strategies`,
          `${topic} Tools and Resources`,
          `${topic} Case Studies`,
          `Common ${topic} Mistakes to Avoid`
        ]
      });
    } catch (error) {
      alert('Failed to generate content plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Bulk Content Planner</h3>
      <p className="text-gray-400 mb-6">
        Enter a broad topic (e.g., "digital marketing") to generate a complete pillar page and cluster content plan, optimized for topical authority.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Broad Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Content Plan'
          )}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h4 className="text-green-400 font-semibold">Content Plan Generated!</h4>
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">Pillar Page:</p>
              <p className="text-gray-300 ml-4">• {result.pillar}</p>
              <p className="text-white font-medium mt-3">Cluster Content:</p>
              {result.clusters.map((cluster: string, i: number) => (
                <p key={i} className="text-gray-300 ml-4">• {cluster}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SingleArticle: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToQueue = async () => {
    if (!keywords.trim()) {
      alert('Please enter at least one keyword');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setKeywords('');
      }, 3000);
    } catch (error) {
      alert('Failed to add to queue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Single Article</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Primary Keywords (One per line)</label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={5}
            disabled={loading}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>
        <button 
          onClick={handleAddToQueue}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Adding...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Added to Queue!
            </>
          ) : (
            'Add to Queue'
          )}
        </button>
      </div>
    </div>
  );
};

const GapAnalysis: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<string[]>([]);

  const handleFindGaps = async () => {
    if (!niche.trim()) {
      alert('Please enter a niche topic');
      return;
    }

    setLoading(true);
    setGaps([]);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setGaps([
        `${niche} trends for 2025`,
        `How to scale ${niche} business`,
        `${niche} automation tools`,
        `${niche} ROI optimization`,
        `${niche} competitor analysis`
      ]);
    } catch (error) {
      alert('Failed to analyze content gaps');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Blue Ocean Gap Analysis</h3>
      <p className="text-gray-400 mb-4">
        Automatically scans your niche for missing high-value topics.
      </p>
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-300">
          <strong>Sitemap Required:</strong> Please crawl your sitemap in the "Content Hub" tab first. The AI needs to know your existing content to find the gaps.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Niche Topic</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>
        <button 
          onClick={handleFindGaps}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Find Content Gaps'
          )}
        </button>

        {gaps.length > 0 && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-blue-400" />
              <h4 className="text-blue-400 font-semibold">Content Gaps Found!</h4>
            </div>
            <div className="space-y-2">
              {gaps.map((gap, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-gray-300">{gap}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickRefresh: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRefresh = async () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult({
        status: 'success',
        improvements: [
          'Updated meta description for better CTR',
          'Added 3 internal links',
          'Optimized heading structure',
          'Enhanced image alt text'
        ]
      });
    } catch (error) {
      alert('Failed to refresh content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Quick Refresh & Validate</h3>
      <p className="text-gray-400 mb-6">
        Seamlessly update existing posts. Crawl your sitemap to update hundreds of URLs or enter a single URL for a quick fix.
      </p>
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('single')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === 'single' ? 'bg-purple-600 text-white' : 'bg-black/20 text-gray-400 hover:bg-black/40'
          }`}
        >
          Single URL
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            mode === 'bulk' ? 'bg-purple-600 text-white' : 'bg-black/20 text-gray-400 hover:bg-black/40'
          }`}
        >
          Bulk via Sitemap
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Post URL to Refresh</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            placeholder="https://example.com/post"
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Refreshing...
            </>
          ) : (
            'Refresh & Validate'
          )}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h4 className="text-green-400 font-semibold">Content Refreshed!</h4>
            </div>
            <div className="space-y-2">
              {result.improvements.map((improvement: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-300">{improvement}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SitemapPost {
  url: string;
  title: string;
  wordCount: number;
  seoScore: number;
}

const ContentHub: React.FC = () => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<SitemapPost[]>([]);
  const [progress, setProgress] = useState(0);

  const handleCrawl = async () => {
    if (!sitemapUrl.trim()) {
      setError('Please enter a sitemap URL');
      return;
    }

    // Validate URL format
    try {
      new URL(sitemapUrl);
    } catch {
      setError('Invalid URL format. Please enter a valid sitemap URL.');
      return;
    }

    setLoading(true);
    setError('');
    setPosts([]);
    setProgress(0);

    try {
      // Fetch sitemap
      const response = await fetch(sitemapUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
      }

      const sitemapXml = await response.text();
      
      // Parse XML to extract URLs
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(sitemapXml, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid sitemap XML format');
      }

      // Extract all <loc> tags
      const urlElements = xmlDoc.querySelectorAll('url > loc');
      
      if (urlElements.length === 0) {
        throw new Error('No URLs found in sitemap');
      }

      const urls = Array.from(urlElements).map(el => el.textContent || '');
      
      // Simulate processing each URL
      const processedPosts: SitemapPost[] = [];
      
      for (let i = 0; i < Math.min(urls.length, 50); i++) {
        const url = urls[i];
        setProgress(Math.round(((i + 1) / Math.min(urls.length, 50)) * 100));
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 100));
        
        processedPosts.push({
          url,
          title: url.split('/').pop()?.replace(/-/g, ' ').replace('.html', '') || 'Untitled',
          wordCount: Math.floor(Math.random() * 2000) + 500,
          seoScore: Math.floor(Math.random() * 30) + 70
        });
      }

      setPosts(processedPosts);
      setError('');
      
    } catch (err: any) {
      console.error('Crawl error:', err);
      setError(err.message || 'Failed to crawl sitemap. Please check the URL and try again.');
      setPosts([]);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Content Hub & Rewrite Assistant</h3>
      <p className="text-gray-400 mb-6">
        Enter your sitemap URL to crawl your existing content. Analyze posts for SEO health and generate strategic rewrite plans.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sitemap URL</label>
          <input
            type="text"
            value={sitemapUrl}
            onChange={(e) => {
              setSitemapUrl(e.target.value);
              setError('');
            }}
            disabled={loading}
            placeholder="https://yoursite.com/sitemap.xml"
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <button 
          onClick={handleCrawl}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Crawling... {progress}%
            </>
          ) : (
            'Crawl Sitemap'
          )}
        </button>

        {loading && progress > 0 && (
          <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Found {posts.length} posts</h4>
              <span className="text-sm text-gray-400">Showing first 50</span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {posts.map((post, i) => (
                <div key={i} className="p-4 bg-black/30 border border-white/10 rounded-lg hover:border-purple-500/50 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-white font-medium truncate capitalize">{post.title}</h5>
                      <p className="text-xs text-gray-400 truncate mt-1">{post.url}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400">{post.wordCount} words</span>
                        <span className={`text-xs font-medium ${
                          post.seoScore >= 90 ? 'text-green-400' :
                          post.seoScore >= 70 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          SEO: {post.seoScore}/100
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                      Analyze
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter an image prompt');
      return;
    }

    setLoading(true);
    setImages([]);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate placeholder images
      const generatedImages = Array(count).fill(null).map((_, i) => 
        `https://via.placeholder.com/800x${aspectRatio === '1:1' ? '800' : '450'}/6366f1/ffffff?text=Generated+Image+${i + 1}`
      );
      
      setImages(generatedImages);
    } catch (error) {
      alert('Failed to generate images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">SOTA Image Generator</h3>
      <p className="text-gray-400 mb-6">
        Generate high-quality images for your content using DALL-E 3 or Gemini Imagen. Describe the image you want in detail.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            disabled={loading}
            placeholder="A modern fitness gym with people working out..."
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Number of Images</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            min={1}
            max={4}
            disabled={loading}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <option value="1:1">1:1 (Square)</option>
            <option value="16:9">16:9 (Landscape)</option>
          </select>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Images'
          )}
        </button>

        {images.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img 
                  src={img} 
                  alt={`Generated ${i + 1}`}
                  className="w-full rounded-lg border border-white/20"
                />
                <button className="absolute top-2 right-2 px-3 py-1 bg-black/70 hover:bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentStrategyTab;