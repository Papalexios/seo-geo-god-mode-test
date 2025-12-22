import React, { useState, useEffect, useCallback } from 'react';
import { SitemapCrawler, SitemapURL } from './lib/sitemap-crawler';
import { SEOAnalyzer } from './lib/seo-analyzer';
import { AIOrchestrator } from './lib/ai-orchestrator';
import './ultra-sota-styles.css';

interface ToastMessage { id: number; type: 'success' | 'error' | 'warning' | 'info'; message: string; }

const AppEliteComplete = () => {
  // Config helpers
  const loadConfig = (key: string, defaultValue: any = '') => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  };
  const saveConfig = (key: string, value: any) => { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value)); };
  
  // State
  const [activeTab, setActiveTab] = useState('config');
  const [strategyMode, setStrategyMode] = useState('hub');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(false);
  
  // API Keys with persistence
  const [geminiKey, setGeminiKey] = useState(() => loadConfig('geminiKey'));
  const [openaiKey, setOpenaiKey] = useState(() => loadConfig('openaiKey'));
  const [anthropicKey, setAnthropicKey] = useState(() => loadConfig('anthropicKey'));
  const [openrouterKey, setOpenrouterKey] = useState(() => loadConfig('openrouterKey'));
  const [openrouterModel, setOpenrouterModel] = useState(() => loadConfig('openrouterModel'));
  const [groqKey, setGroqKey] = useState(() => loadConfig('groqKey'));
  const [groqModel, setGroqModel] = useState(() => loadConfig('groqModel'));
  const [serperKey, setSerperKey] = useState(() => loadConfig('serperKey'));
  const [useCustomModel, setUseCustomModel] = useState(() => loadConfig('useCustomModel', false));
  const [selectedModel, setSelectedModel] = useState(() => loadConfig('selectedModel', 'gemini'));
  
  // WordPress
  const [wpURL, setWPURL] = useState(() => loadConfig('wpURL'));
  const [wpUser, setWPUser] = useState(() => loadConfig('wpUser'));
  const [wpPass, setWPPass] = useState(() => loadConfig('wpPass'));
  
  // Content Hub
  const [sitemapURL, setSitemapURL] = useState('');
  const [urls, setUrls] = useState<SitemapURL[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [crawling, setCrawling] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  
  const crawler = new SitemapCrawler();
  const analyzer = new SEOAnalyzer();
  const orchestrator = new AIOrchestrator();
  
  // Auto-save
  useEffect(() => { saveConfig('geminiKey', geminiKey); }, [geminiKey]);
  useEffect(() => { saveConfig('openaiKey', openaiKey); }, [openaiKey]);
  useEffect(() => { saveConfig('selectedModel', selectedModel); }, [selectedModel]);
  
  const showToast = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);
  
  // Crawl sitemap
  const crawlSitemap = async () => {
    if (!sitemapURL) { showToast('error', 'Enter sitemap URL'); return; }
    setCrawling(true);
    try {
      const fetchedUrls = await crawler.fetchSitemap(sitemapURL, (urls, total) => {
        setUrls(urls);
        setCrawlProgress((urls.length / total) * 100);
      });
      showToast('success', `Found ${fetchedUrls.length} URLs!`);
    } catch (error) {
      showToast('error', 'Crawl failed');
    } finally {
      setCrawling(false);
      setCrawlProgress(0);
    }
  };
  
  // Analyze selected URLs
  const analyzeSelected = async () => {
    if (selectedUrls.size === 0) { showToast('warning', 'Select URLs first'); return; }
    setAnalyzing(true);
    let count = 0;
    for (const url of Array.from(selectedUrls)) {
      try {
        const analysis = await analyzer.analyzeURL(url);
        setUrls(prev => prev.map(u => u.url === url ? { ...u, seoScore: analysis.overall, wordCount: analysis.wordCount, analyzed: true } : u));
        count++;
      } catch (error) {
        console.error('Analysis error:', error);
      }
    }
    setAnalyzing(false);
    showToast('success', `Analyzed ${count} URLs`);
  };
  
  // Validate API key
  const validateKey = async (provider: string, key: string) => {
    if (!key) { showToast('error', 'Enter API key'); return; }
    setLoading(true);
    const valid = await orchestrator.validateAPIKey({ provider: provider as any, apiKey: key });
    setLoading(false);
    if (valid) showToast('success', `${provider} key valid!`);
    else showToast('error', `${provider} key invalid`);
  };
  
  return (
    <div style={{ fontFamily: 'Inter, system-ui', background: '#0a0a0f', minHeight: '100vh', color: '#e2e8f0' }}>
      {/* TOASTS */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ padding: '1rem 1.5rem', borderRadius: '8px', background: toast.type === 'success' ? 'linear-gradient(135deg, #10B981, #059669)' : toast.type === 'error' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>{toast.message}</div>
        ))}
      </div>
      
      {/* Banner */}
      <div className="ultra-sota-banner">
        <div className="ultra-sota-banner-content">
          <span className="ultra-sota-icon">⚡</span>
          <div style={{ textAlign: 'center' }}>
            <div className="ultra-sota-title">Ultra SOTA Engine v15.0 • Elite Enterprise Edition</div>
            <div className="ultra-sota-subtitle">
              <span className="ultra-sota-feature-badge">🎯 Real SEO Analysis</span>
              <span className="ultra-sota-feature-badge">⚡ Smart Crawler</span>
              <span className="ultra-sota-feature-badge">🧠 Universal LLM</span>
              <span className="ultra-sota-feature-badge">🚀 Production Ready</span>
            </div>
          </div>
          <span className="ultra-sota-icon">🚀</span>
        </div>
      </div>
      
      <header style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '1.5rem 2rem', borderBottom: '2px solid #10B981' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, background: 'linear-gradient(90deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WP Content Optimizer Pro</h1>
      </header>
      
      {/* Navigation */}
      <div style={{ background: '#1e293b', borderBottom: '2px solid rgba(255,255,255,0.1)', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {[{ id: 'config', label: '⚙️ Configuration' }, { id: 'strategy', label: '📊 Content Strategy' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent', border: activeTab === tab.id ? '2px solid #10B981' : '2px solid transparent', padding: '0.75rem 2rem', borderRadius: '8px', color: activeTab === tab.id ? '#10B981' : '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>{tab.label}</button>
          ))}
        </div>
      </div>
      
      <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
        {activeTab === 'config' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', background: 'linear-gradient(90deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚙️ Configuration</h2>
            
            {/* Custom Model Toggle */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={useCustomModel} onChange={e => setUseCustomModel(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>🎯 Enable Custom Model Input</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>Manually enter ANY model name (e.g., anthropic/claude-3.5-sonnet, llama-3.3-70b-versatile)</div>
                </div>
              </label>
            </div>
            
            {/* API Keys */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {[{label: '💎 Gemini', key: geminiKey, setter: setGeminiKey, provider: 'gemini'}, {label: '🔍 Serper', key: serperKey, setter: setSerperKey}, {label: '🤖 OpenAI', key: openaiKey, setter: setOpenaiKey, provider: 'openai'}, {label: '🧠 Anthropic', key: anthropicKey, setter: setAnthropicKey, provider: 'anthropic'}].map((api, i) => (
                <div key={i} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>{api.label}</h4>
                  <input type="password" placeholder="API key" value={api.key} onChange={e => api.setter(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                  {api.provider && <button onClick={() => validateKey(api.provider!, api.key)} style={{ width: '100%', padding: '0.5rem', background: 'linear-gradient(90deg, #10B981, #059669)', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Validate</button>}
                </div>
              ))}
              
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ marginBottom: '1rem' }}>🔄 OpenRouter</h4>
                <input type="password" placeholder="API key" value={openrouterKey} onChange={e => setOpenrouterKey(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                {useCustomModel && <input type="text" placeholder="Model (e.g., anthropic/claude-3.5-sonnet)" value={openrouterModel} onChange={e => setOpenrouterModel(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />}
                <button onClick={() => validateKey('openrouter', openrouterKey)} style={{ width: '100%', padding: '0.5rem', background: 'linear-gradient(90deg, #10B981, #059669)', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Validate</button>
              </div>
              
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ marginBottom: '1rem' }}>⚡ Groq</h4>
                <input type="password" placeholder="API key" value={groqKey} onChange={e => setGroqKey(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                {useCustomModel && <input type="text" placeholder="Model (e.g., llama-3.3-70b-versatile)" value={groqModel} onChange={e => setGroqModel(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />}
                <button onClick={() => validateKey('groq', groqKey)} style={{ width: '100%', padding: '0.5rem', background: 'linear-gradient(90deg, #10B981, #059669)', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Validate</button>
              </div>
            </div>
            
            {/* Model Selection */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🤖 AI Model</h3>
              <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}>
                <option value="gemini">Google Gemini 2.5 Flash</option>
                <option value="openai">OpenAI GPT-4o</option>
                <option value="anthropic">Anthropic Claude 3.5</option>
                <option value="openrouter">OpenRouter</option>
                <option value="groq">Groq</option>
              </select>
            </div>
          </div>
        )}
        
        {activeTab === 'strategy' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', background: 'linear-gradient(90deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📊 Content Hub</h2>
            
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🕸️ Sitemap Crawler</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input type="url" placeholder="https://example.com/sitemap.xml" value={sitemapURL} onChange={e => setSitemapURL(e.target.value)} style={{ flex: 1, padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0' }} />
                <button onClick={crawlSitemap} disabled={crawling} style={{ padding: '1rem 2rem', background: crawling ? 'rgba(100, 116, 139, 0.5)' : 'linear-gradient(90deg, #10B981, #059669)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: crawling ? 'not-allowed' : 'pointer', minWidth: '150px' }}>{crawling ? '⏳ Crawling...' : '🚀 Crawl'}</button>
              </div>
              
              {urls.length > 0 && (
                <div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => setSelectedUrls(new Set(urls.map(u => u.url)))} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(90deg, #3B82F6, #2563EB)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Select All ({urls.length})</button>
                    <button onClick={() => setSelectedUrls(new Set())} style={{ padding: '0.75rem 1.5rem', background: 'rgba(100, 116, 139, 0.5)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Deselect All</button>
                    <button onClick={analyzeSelected} disabled={analyzing || selectedUrls.size === 0} style={{ padding: '0.75rem 1.5rem', background: analyzing ? 'rgba(100, 116, 139, 0.5)' : 'linear-gradient(90deg, #8B5CF6, #7C3AED)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: analyzing || selectedUrls.size === 0 ? 'not-allowed' : 'pointer' }}>{analyzing ? '🔄 Analyzing...' : `🔍 Analyze (${selectedUrls.size})`}</button>
                  </div>
                  
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {urls.map((url, i) => (
                      <div key={i} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', marginBottom: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', border: selectedUrls.has(url.url) ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.1)' }}>
                        <input type="checkbox" checked={selectedUrls.has(url.url)} onChange={e => {
                          const newSet = new Set(selectedUrls);
                          if (e.target.checked) newSet.add(url.url);
                          else newSet.delete(url.url);
                          setSelectedUrls(newSet);
                        }} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{url.title}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{url.url}</div>
                        </div>
                        {url.analyzed && (
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SEO</div>
                              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: (url.seoScore || 0) >= 80 ? '#10B981' : (url.seoScore || 0) >= 60 ? '#F59E0B' : '#EF4444' }}>{url.seoScore || 0}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Words</div>
                              <div style={{ fontWeight: 600 }}>{url.wordCount || 0}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <footer style={{ background: '#1e293b', padding: '2rem', textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ color: '#94a3b8' }}>© 2025 WP Content Optimizer Pro • Ultra SOTA Engine v15.0</p>
      </footer>
    </div>
  );
};

export default AppEliteComplete;