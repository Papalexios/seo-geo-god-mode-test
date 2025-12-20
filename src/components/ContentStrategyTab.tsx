import React, { useState } from 'react';
import { Calendar, FileText, Brain, Zap, Network, Image } from 'lucide-react';

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
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all">
          Generate Content Plan
        </button>
      </div>
    </div>
  );
};

const SingleArticle: React.FC = () => {
  const [keywords, setKeywords] = useState('');

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
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all">
          Add to Queue
        </button>
      </div>
    </div>
  );
};

const GapAnalysis: React.FC = () => {
  const [niche, setNiche] = useState('');

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
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all">
          Find Content Gaps
        </button>
      </div>
    </div>
  );
};

const QuickRefresh: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [url, setUrl] = useState('');

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
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all">
          Refresh & Validate
        </button>
      </div>
    </div>
  );
};

const ContentHub: React.FC = () => {
  const [sitemapUrl, setSitemapUrl] = useState('');

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
            onChange={(e) => setSitemapUrl(e.target.value)}
            placeholder="https://yoursite.com/sitemap.xml"
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all">
          Crawl Sitemap
        </button>
      </div>
    </div>
  );
};

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('1:1');

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
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="1:1">1:1 (Square)</option>
            <option value="16:9">16:9 (Landscape)</option>
          </select>
        </div>
        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all">
          Generate Images
        </button>
      </div>
    </div>
  );
};

export default ContentStrategyTab;