import React, { useState, useEffect, useCallback } from 'react';
import { GodMode } from './godmode/GodMode';
import './ultra-sota-styles.css';

interface ToastMessage { id: number; type: 'success' | 'error' | 'warning' | 'info'; message: string; }

const AppComplete = () => {
  const loadConfig = (key: string, defaultValue: any = '') => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  };
  const saveConfig = (key: string, value: any) => { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value)); };
  
  const [activeTab, setActiveTab] = useState('config');
  const [strategyMode, setStrategyMode] = useState('hub');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [godModeActive, setGodModeActive] = useState(false);
  
  // LLM Config
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
  const [useGrounding, setUseGrounding] = useState(() => loadConfig('useGrounding', false));
  
  // WordPress
  const [wpURL, setWPURL] = useState(() => loadConfig('wpURL'));
  const [wpUser, setWPUser] = useState(() => loadConfig('wpUser'));
  const [wpPass, setWPPass] = useState(() => loadConfig('wpPass'));
  const [orgName, setOrgName] = useState(() => loadConfig('orgName'));
  const [logoURL, setLogoURL] = useState(() => loadConfig('logoURL'));
  const [authorName, setAuthorName] = useState(() => loadConfig('authorName'));
  const [authorURL, setAuthorURL] = useState(() => loadConfig('authorURL'));
  
  // Geo & NeuronWriter
  const [geoEnabled, setGeoEnabled] = useState(() => loadConfig('geoEnabled', false));
  const [geoLocation, setGeoLocation] = useState(() => loadConfig('geoLocation'));
  const [geoCountry, setGeoCountry] = useState(() => loadConfig('geoCountry'));
  const [neuronEnabled, setNeuronEnabled] = useState(() => loadConfig('neuronEnabled', false));
  const [neuronKey, setNeuronKey] = useState(() => loadConfig('neuronKey'));
  
  // Content Hub
  const [sitemapURL, setSitemapURL] = useState('');
  const [urls, setUrls] = useState<any[]>([]);
  const [crawling, setCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  
  // Other Features
  const [bulkTopic, setBulkTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [gapTopic, setGapTopic] = useState('');
  const [refreshURL, setRefreshURL] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  // Auto-save
  useEffect(() => { saveConfig('geminiKey', geminiKey); }, [geminiKey]);
  useEffect(() => { saveConfig('openaiKey', openaiKey); }, [openaiKey]);
  useEffect(() => { saveConfig('anthropicKey', anthropicKey); }, [anthropicKey]);
  useEffect(() => { saveConfig('serperKey', serperKey); }, [serperKey]);
  useEffect(() => { saveConfig('wpURL', wpURL); }, [wpURL]);
  
  const showToast = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);
  
  return (
    <div style={{ fontFamily: 'Inter, system-ui', background: '#0a0a0f', minHeight: '100vh', color: '#e2e8f0' }}>
      {/* TOASTS */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ padding: '1rem 1.5rem', borderRadius: '8px', background: toast.type === 'success' ? 'linear-gradient(135deg, #10B981, #059669)' : toast.type === 'error' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', fontWeight: 600 }}>{toast.message}</div>
        ))}
      </div>
      
      {/* Banner */}
      <div className="ultra-sota-banner">
        <div className="ultra-sota-banner-content">
          <span className="ultra-sota-icon">⚡</span>
          <div style={{ textAlign: 'center' }}>
            <div className="ultra-sota-title">Ultra SOTA Engine v300.0 • Quantum Sovereign</div>
            <div className="ultra-sota-subtitle">
              <span className="ultra-sota-feature-badge">🧠 GOD MODE</span>
              <span className="ultra-sota-feature-badge">⚡ Autonomous Agent</span>
              <span className="ultra-sota-feature-badge">🌌 Quantum Planner</span>
            </div>
          </div>
          <span className="ultra-sota-icon">🚀</span>
        </div>
      </div>
      
      <header style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '1.5rem 2rem', borderBottom: '2px solid #8B5CF6' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WP Content Optimizer Pro</h1>
      </header>
      
      {/* GOD MODE Section */}
      {godModeActive && (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
          <GodMode 
            config={{ geminiKey, openaiKey, anthropicKey, serperKey, sitemapURL, imageGeneration: true, niche: gapTopic }}
            onComplete={(results) => {
              showToast('success', `GOD MODE COMPLETE! Processed ${results.processedUrls.length} URLs`);
              setGodModeActive(false);
            }}
          />
        </div>
      )}
      
      {!godModeActive && (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', textAlign: 'center' }}>
          <button
            onClick={() => setGodModeActive(true)}
            style={{ padding: '2rem 4rem', background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)', border: 'none', borderRadius: '16px', color: 'white', fontSize: '2rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 20px 60px rgba(139, 92, 246, 0.6)', textTransform: 'uppercase' }}
          >
            ⚡🧠 ACTIVATE GOD MODE v300.0 🧠⚡
          </button>
          <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: '#a78bfa' }}>Distributed Autonomous SEO Agent Ready</p>
        </div>
      )}
      
      <footer style={{ background: '#1e293b', padding: '2rem', textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ color: '#94a3b8' }}>© 2025 WP Content Optimizer Pro • GOD MODE v300.0</p>
      </footer>
      
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
};

export default AppComplete;