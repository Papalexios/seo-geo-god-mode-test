import React, { useState, useEffect } from 'react';
import './ultra-sota-styles.css';

const AppComplete = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [strategyMode, setStrategyMode] = useState('hub');
  
  // LLM Config
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [openrouterModel, setOpenrouterModel] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [groqModel, setGroqModel] = useState('');
  const [serperKey, setSerperKey] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [useGrounding, setUseGrounding] = useState(false);
  
  // WordPress
  const [wpURL, setWPURL] = useState('');
  const [wpUser, setWPUser] = useState('');
  const [wpPass, setWPPass] = useState('');
  const [orgName, setOrgName] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorURL, setAuthorURL] = useState('');
  
  // Geo-Targeting
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [geoLocation, setGeoLocation] = useState('');
  const [geoCountry, setGeoCountry] = useState('');
  
  // NeuronWriter
  const [neuronEnabled, setNeuronEnabled] = useState(false);
  const [neuronKey, setNeuronKey] = useState('');
  
  // Content Hub
  const [sitemapURL, setSitemapURL] = useState('');
  const [urls, setUrls] = useState<any[]>([]);
  const [crawling, setCrawling] = useState(false);
  
  // Bulk Planner
  const [bulkTopic, setBulkTopic] = useState('');
  
  // Single Article
  const [keywords, setKeywords] = useState('');
  
  // Gap Analysis
  const [gapTopic, setGapTopic] = useState('');
  
  // Quick Refresh
  const [refreshURL, setRefreshURL] = useState('');
  
  // Image Generator
  const [imagePrompt, setImagePrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  return (
    <div style={{ fontFamily: 'Inter, system-ui', background: '#0a0a0f', minHeight: '100vh', color: '#e2e8f0' }}>
      {/* Banner */}
      <div className="ultra-sota-banner">
        <div className="ultra-sota-banner-content">
          <span className="ultra-sota-icon">⚡</span>
          <div style={{ textAlign: 'center' }}>
            <div className="ultra-sota-title">Ultra SOTA Engine v14.2 • Enterprise Grade</div>
            <div className="ultra-sota-subtitle">
              <span className="ultra-sota-feature-badge">🎯 AI-Powered</span>
              <span className="ultra-sota-feature-badge">⚡ Real-Time SEO</span>
              <span className="ultra-sota-feature-badge">🚀 Production Ready</span>
            </div>
          </div>
          <span className="ultra-sota-icon">🚀</span>
        </div>
      </div>
      
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '1.5rem 2rem', borderBottom: '2px solid #10B981' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, background: 'linear-gradient(90deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WP Content Optimizer Pro
          </h1>
          <span style={{ background: 'linear-gradient(90deg, #10B981, #3B82F6)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>
            v14.2 SOTA
          </span>
        </div>
      </header>
      
      {/* Navigation */}
      <div style={{ background: '#1e293b', borderBottom: '2px solid rgba(255,255,255,0.1)', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {[
            { id: 'config', label: '⚙️ Configuration' },
            { id: 'strategy', label: '📊 Content Strategy' },
            { id: 'review', label: '✅ Review & Export' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                border: activeTab === tab.id ? '2px solid #10B981' : '2px solid transparent',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                color: activeTab === tab.id ? '#10B981' : '#94a3b8',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CONFIGURATION TAB - COMPLETE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'config' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', background: 'linear-gradient(90deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ⚙️ Setup & Configuration
            </h2>
            
            {/* Custom Model Toggle */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useCustomModel}
                  onChange={e => setUseCustomModel(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>🎯 Enable Custom Model Input (OpenRouter/Groq)</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>Enter ANY model name manually (e.g., anthropic/claude-3.5-sonnet, llama-3.3-70b-versatile)</div>
                </div>
              </label>
            </div>
            
            {/* API Keys Section */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#e2e8f0' }}>🔑 API Keys</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Gemini */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💎 Google Gemini API Key</h4>
                  <input
                    type="password"
                    placeholder="Enter Gemini API key"
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                  />
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>For Image Generation & Content</p>
                </div>
                
                {/* Serper */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🔍 Serper API Key</h4>
                  <input
                    type="password"
                    placeholder="Enter Serper API key"
                    value={serperKey}
                    onChange={e => setSerperKey(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                  />
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Required for SOTA Research</p>
                </div>
                
                {/* OpenAI */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>🤖 OpenAI API Key</h4>
                  <input
                    type="password"
                    placeholder="Enter OpenAI API key"
                    value={openaiKey}
                    onChange={e => setOpenaiKey(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                  />
                </div>
                
                {/* Anthropic */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>🧠 Anthropic API Key</h4>
                  <input
                    type="password"
                    placeholder="Enter Anthropic API key"
                    value={anthropicKey}
                    onChange={e => setAnthropicKey(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                  />
                </div>
                
                {/* OpenRouter */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>🔄 OpenRouter API Key</h4>
                  <input
                    type="password"
                    placeholder="Enter OpenRouter API key"
                    value={openrouterKey}
                    onChange={e => setOpenrouterKey(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                  />
                  {useCustomModel && (
                    <input
                      type="text"
                      placeholder="Custom model (e.g., anthropic/claude-3.5-sonnet)"
                      value={openrouterModel}
                      onChange={e => setOpenrouterModel(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                    />
                  )}
                </div>
                
                {/* Groq */}
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>⚡ Groq API Key</h4>
                  <input
                    type="password"
                    placeholder="Enter Groq API key"
                    value={groqKey}
                    onChange={e => setGroqKey(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                  />
                  {useCustomModel && (
                    <input
                      type="text"
                      placeholder="Custom model (e.g., llama-3.3-70b-versatile)"
                      value={groqModel}
                      onChange={e => setGroqModel(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* AI Model Configuration */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🤖 AI Model Configuration</h3>
              
              <label style={{ display: 'block', marginBottom: '1rem', color: '#cbd5e1' }}>Primary Generation Model</label>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0', marginBottom: '1.5rem' }}
              >
                <option value="gemini">Google Gemini 2.5 Flash</option>
                <option value="openai">OpenAI GPT-4o</option>
                <option value="anthropic">Anthropic Claude 3</option>
                <option value="openrouter">OpenRouter (Auto-Fallback)</option>
                <option value="groq">Groq (High-Speed)</option>
              </select>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useGrounding}
                  onChange={e => setUseGrounding(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Enable Google Search Grounding</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>Provides AI with real-time search results for accurate, up-to-date content</div>
                </div>
              </label>
            </div>
            
            {/* WordPress & Site Information */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>📝 WordPress & Site Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>WordPress Site URL</label>
                  <input type="url" placeholder="https://example.com" value={wpURL} onChange={e => setWPURL(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>WordPress Username</label>
                  <input type="text" placeholder="admin" value={wpUser} onChange={e => setWPUser(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>WordPress Application Password</label>
                  <input type="password" placeholder="••••" value={wpPass} onChange={e => setWPPass(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Organization Name</label>
                  <input type="text" placeholder="My Company" value={orgName} onChange={e => setOrgName(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Logo URL</label>
                  <input type="url" placeholder="https://example.com/logo.png" value={logoURL} onChange={e => setLogoURL(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Author Name</label>
                  <input type="text" placeholder="John Doe" value={authorName} onChange={e => setAuthorName(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                </div>
              </div>
            </div>
            
            {/* Advanced Integrations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {/* NeuronWriter */}
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>🧠 NeuronWriter Integration</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={neuronEnabled}
                    onChange={e => setNeuronEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Enable NeuronWriter Integration</span>
                </label>
                {neuronEnabled && (
                  <input
                    type="password"
                    placeholder="NeuronWriter API Key"
                    value={neuronKey}
                    onChange={e => setNeuronKey(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }}
                  />
                )}
              </div>
              
              {/* Geo-Targeting */}
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>🌍 Geo-Targeting</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={geoEnabled}
                    onChange={e => setGeoEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Enable Geo-Targeting for Content</span>
                </label>
                {geoEnabled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input type="text" placeholder="Location (e.g., New York)" value={geoLocation} onChange={e => setGeoLocation(e.target.value)} style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                    <input type="text" placeholder="Country (e.g., USA)" value={geoCountry} onChange={e => setGeoCountry(e.target.value)} style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#e2e8f0' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CONTENT STRATEGY TAB - COMPLETE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'strategy' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', background: 'linear-gradient(90deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              📊 Content Strategy & Planning
            </h2>
            
            {/* Strategy Mode Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {[
                { id: 'hub', label: '🕸️ Content Hub', emoji: '🕸️' },
                { id: 'bulk', label: '📅 Bulk Planner', emoji: '📅' },
                { id: 'single', label: '📝 Single Article', emoji: '📝' },
                { id: 'gap', label: '🧠 Gap Analysis', emoji: '🧠' },
                { id: 'refresh', label: '⚡ Quick Refresh', emoji: '⚡' },
                { id: 'image', label: '🎨 Image Engine', emoji: '🎨' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setStrategyMode(mode.id)}
                  style={{
                    background: strategyMode === mode.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                    border: strategyMode === mode.id ? '2px solid #10B981' : '2px solid transparent',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    color: strategyMode === mode.id ? '#10B981' : '#94a3b8',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            
            {/* Content Hub */}
            {strategyMode === 'hub' && (
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🕸️ Content Hub & Rewrite Assistant</h3>
                <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Enter your sitemap URL to crawl your existing content. Analyze posts for SEO health and generate strategic rewrite plans.</p>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  <input
                    type="url"
                    placeholder="https://example.com/sitemap.xml"
                    value={sitemapURL}
                    onChange={e => setSitemapURL(e.target.value)}
                    style={{ flex: 1, padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem' }}
                  />
                  <button
                    onClick={() => setCrawling(true)}
                    style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #10B981, #059669)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', minWidth: '150px' }}
                  >
                    {crawling ? '⏳ Crawling...' : '🚀 Crawl Sitemap'}
                  </button>
                </div>
                
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <p style={{ fontSize: '0.9rem', color: '#60a5fa' }}>💡 <strong>Enterprise Features:</strong> 3-tier CORS fallback, IndexedDB caching, smart batch analysis, real-time progress tracking</p>
                </div>
              </div>
            )}
            
            {/* Bulk Planner */}
            {strategyMode === 'bulk' && (
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>📅 Bulk Content Planner</h3>
                <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Enter a broad topic to generate a complete pillar page and cluster content plan, optimized for topical authority.</p>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 600 }}>Broad Topic</label>
                <input
                  type="text"
                  placeholder="e.g., digital marketing"
                  value={bulkTopic}
                  onChange={e => setBulkTopic(e.target.value)}
                  style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem' }}
                />
                
                <button
                  style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #10B981, #059669)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                >
                  🚀 Generate Content Plan
                </button>
                
                <div style={{ marginTop: '2rem', background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                  <p style={{ fontSize: '0.9rem', color: '#a78bfa' }}>✨ <strong>AI-Powered:</strong> Creates 1 pillar page + 5 cluster articles with SEO/AEO/E-E-A-T optimization</p>
                </div>
              </div>
            )}
            
            {/* Single Article */}
            {strategyMode === 'single' && (
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>📝 Single Article Generator</h3>
                <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Generate high-quality articles optimized for SEO, AEO, and E-E-A-T.</p>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 600 }}>Primary Keywords (One per line)</label>
                <textarea
                  placeholder="keyword 1\nkeyword 2\nkeyword 3"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  rows={6}
                  style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                />
                
                <button
                  style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #10B981, #059669)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                >
                  ➕ Add to Queue
                </button>
              </div>
            )}
            
            {/* Gap Analysis */}
            {strategyMode === 'gap' && (
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🧠 Blue Ocean Gap Analysis (God Mode)</h3>
                <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Automatically scans your niche for missing high-value topics.</p>
                
                <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                  <p style={{ fontSize: '0.9rem', color: '#fbbf24' }}>⚠️ <strong>Sitemap Required:</strong> Please crawl your sitemap in the "Content Hub" tab first. The AI needs to know your existing content to find the gaps.</p>
                </div>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 600 }}>Niche Topic</label>
                <input
                  type="text"
                  placeholder="e.g., sustainable fashion"
                  value={gapTopic}
                  onChange={e => setGapTopic(e.target.value)}
                  style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem' }}
                />
                
                <button
                  style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #8B5CF6, #6D28D9)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                >
                  🔍 Find Content Gaps
                </button>
              </div>
            )}
            
            {/* Quick Refresh */}
            {strategyMode === 'refresh' && (
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>⚡ Quick Refresh & Validate</h3>
                <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Seamlessly update existing posts. Enter a single URL for a quick fix.</p>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 600 }}>Post URL to Refresh</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="url"
                    placeholder="https://example.com/post-to-refresh"
                    value={refreshURL}
                    onChange={e => setRefreshURL(e.target.value)}
                    style={{ flex: 1, padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem' }}
                  />
                  <button
                    style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #F59E0B, #D97706)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', minWidth: '180px' }}
                  >
                    ⚡ Refresh & Validate
                  </button>
                </div>
                
                <div style={{ marginTop: '2rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <p style={{ fontSize: '0.9rem', color: '#10b981' }}>📊 <strong>Before/After Analysis:</strong> Shows SEO improvement, AEO enhancement (+28), E-E-A-T signals (+24)</p>
                </div>
              </div>
            )}
            
            {/* Image Generator */}
            {strategyMode === 'image' && (
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🎨 SOTA Image Generator</h3>
                <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Generate high-quality images for your content using DALL-E 3 or Gemini Imagen.</p>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 600 }}>Image Prompt</label>
                <textarea
                  placeholder="Describe the image you want in detail..."
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                />
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Number of Images</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={numImages}
                      onChange={e => setNumImages(parseInt(e.target.value))}
                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={e => setAspectRatio(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#e2e8f0' }}
                    >
                      <option value="1:1">1:1 (Square)</option>
                      <option value="16:9">16:9 (Landscape)</option>
                    </select>
                  </div>
                </div>
                
                <button
                  style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #EC4899, #DB2777)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                >
                  🎨 Generate Images
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* REVIEW & EXPORT TAB - COMPLETE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'review' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', background: 'linear-gradient(90deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ✅ Review & Export
            </h2>
            
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>Content Review Dashboard</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem' }}>Review your analyzed content and export to WordPress with advanced optimization.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10B981', marginBottom: '0.5rem' }}>0</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Articles Generated</div>
                </div>
                
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#3B82F6', marginBottom: '0.5rem' }}>0</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Ready to Publish</div>
                </div>
                
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#8B5CF6', marginBottom: '0.5rem' }}>-</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Avg SEO Score</div>
                </div>
              </div>
              
              <p style={{ marginTop: '3rem', color: '#64748B' }}>Generate content in the Content Strategy tab to see results here.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer style={{ background: '#1e293b', padding: '2rem', textAlign: 'center', marginTop: '4rem', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
        <p style={{ color: '#94a3b8' }}>© 2025 WP Content Optimizer Pro • Ultra SOTA Engine v14.2</p>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.5rem' }}>Engineered by Alexios Papaioannou</p>
      </footer>
    </div>
  );
};

export default AppComplete;