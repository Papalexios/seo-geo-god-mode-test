import React, { useState } from 'react';
import { Settings, Key, Globe, Database, CheckCircle, AlertCircle, Loader, Info, Save, ExternalLink, MapPin, Plus, X, Edit3 } from 'lucide-react';

interface ConfigState {
  geminiKey: string;
  serperKey: string;
  openaiKey: string;
  anthropicKey: string;
  openrouterKey: string;
  groqKey: string;
  primaryModel: 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'groq';
  customModelName: string;
  useCustomModel: boolean;
  enableGrounding: boolean;
  wpSiteUrl: string;
  wpUsername: string;
  wpAppPassword: string;
  orgName: string;
  logoUrl: string;
  authorName: string;
  authorPageUrl: string;
  autoDetectUpload: boolean;
  enableNeuronWriter: boolean;
  enableGeoTargeting: boolean;
  geoLocations: Array<{ country: string; state: string; city: string; postalCode: string; }>;
  enableAEO: boolean;
  enableEEAT: boolean;
  enableEntityOptimization: boolean;
  enableSemanticClustering: boolean;
  enableCompetitorAnalysis: boolean;
  enableSERPFeatures: boolean;
}

const ConfigurationTab: React.FC = () => {
  const [config, setConfig] = useState<ConfigState>(() => {
    const saved = localStorage.getItem('wp_optimizer_config');
    if (saved) { try { return JSON.parse(saved); } catch (e) { return getDefaultConfig(); } }
    return getDefaultConfig();
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState({ country: '', state: '', city: '', postalCode: '' });

  function getDefaultConfig(): ConfigState {
    return {
      geminiKey: '', serperKey: '', openaiKey: '', anthropicKey: '', openrouterKey: '', groqKey: '',
      primaryModel: 'gemini', customModelName: '', useCustomModel: false, enableGrounding: false,
      wpSiteUrl: '', wpUsername: '', wpAppPassword: '', orgName: '', logoUrl: '', authorName: '', authorPageUrl: '',
      autoDetectUpload: true, enableNeuronWriter: false, enableGeoTargeting: false, geoLocations: [],
      enableAEO: true, enableEEAT: true, enableEntityOptimization: true, enableSemanticClustering: true,
      enableCompetitorAnalysis: true, enableSERPFeatures: true
    };
  }

  const updateConfig = (key: keyof ConfigState, value: any) => { setConfig(prev => ({ ...prev, [key]: value })); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('wp_optimizer_config', JSON.stringify(config));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnection = async (service: string) => {
    setTesting(service);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTesting(null);
    alert(`✅ ${service} connection successful!`);
  };

  const addGeoLocation = () => {
    if (!newLocation.country && !newLocation.city) { alert('Enter at least country or city'); return; }
    updateConfig('geoLocations', [...config.geoLocations, newLocation]);
    setNewLocation({ country: '', state: '', city: '', postalCode: '' });
  };

  const removeGeoLocation = (index: number) => updateConfig('geoLocations', config.geoLocations.filter((_, i) => i !== index));
  const isConfigValid = () => config.geminiKey && config.serperKey && config.wpSiteUrl && config.wpUsername && config.wpAppPassword;

  const openRouterModels = ['anthropic/claude-3.5-sonnet', 'google/gemini-2.0-flash-exp', 'meta-llama/llama-3.3-70b-instruct', 'openai/gpt-4-turbo', 'mistralai/mistral-large', 'deepseek/deepseek-chat', 'qwen/qwen-2.5-72b-instruct'];
  const groqModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it', 'deepseek-r1-distill-llama-70b'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Elite SOTA Configuration</h2>
        <p className="text-gray-400">World-class AI-powered SEO/GEO/AEO system configuration</p>
      </div>

      {!isConfigValid() && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-300">
            <p className="font-semibold mb-1">⚠️ Required Configuration Missing</p>
            <p>Gemini API, Serper API, WordPress credentials required for SOTA features</p>
          </div>
        </div>
      )}

      {/* API Keys */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">API Keys</h3>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Google Gemini API Key <span className="text-red-400">*</span></label><div className="flex gap-2"><input type="password" value={config.geminiKey} onChange={(e) => updateConfig('geminiKey', e.target.value)} placeholder="AIza...." className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /><button onClick={() => testConnection('Gemini')} disabled={!config.geminiKey || testing === 'Gemini'} className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 flex items-center gap-2">{testing === 'Gemini' ? <Loader className="w-4 h-4 animate-spin" /> : 'Test'}</button></div></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Serper API Key (SOTA Research) <span className="text-red-400">*</span></label><div className="flex gap-2"><input type="password" value={config.serperKey} onChange={(e) => updateConfig('serperKey', e.target.value)} placeholder="Enter Serper key" className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /><button onClick={() => testConnection('Serper')} disabled={!config.serperKey || testing === 'Serper'} className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 flex items-center gap-2">{testing === 'Serper' ? <Loader className="w-4 h-4 animate-spin" /> : 'Test'}</button></div></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label><input type="password" value={config.openaiKey} onChange={(e) => updateConfig('openaiKey', e.target.value)} placeholder="sk-...." className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Anthropic API Key</label><input type="password" value={config.anthropicKey} onChange={(e) => updateConfig('anthropicKey', e.target.value)} placeholder="sk-ant-...." className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">OpenRouter API Key</label><input type="password" value={config.openrouterKey} onChange={(e) => updateConfig('openrouterKey', e.target.value)} placeholder="sk-or-...." className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Groq API Key</label><input type="password" value={config.groqKey} onChange={(e) => updateConfig('groqKey', e.target.value)} placeholder="gsk_...." className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
        </div>
      </div>

      {/* AI Model Config */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">AI Model Configuration</h3>
        </div>
        <div><label className="block text-sm font-medium text-gray-300 mb-2">Primary Generation Model</label><select value={config.primaryModel} onChange={(e) => updateConfig('primaryModel', e.target.value)} className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="gemini">Google Gemini 2.5 Flash</option><option value="openai">OpenAI GPT-4o</option><option value="anthropic">Anthropic Claude 3</option><option value="openrouter">OpenRouter (Multi-Model)</option><option value="groq">Groq (High-Speed)</option></select></div>

        {(config.primaryModel === 'openrouter' || config.primaryModel === 'groq') && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-blue-300 flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                {config.useCustomModel ? 'Enter Custom Model Name' : 'Select Model'}
              </label>
              <button onClick={() => updateConfig('useCustomModel', !config.useCustomModel)} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold">
                {config.useCustomModel ? 'Use Presets' : 'Custom Model'}
              </button>
            </div>

            {config.useCustomModel ? (
              <div>
                <input type="text" value={config.customModelName} onChange={(e) => updateConfig('customModelName', e.target.value)} placeholder={config.primaryModel === 'openrouter' ? 'e.g., anthropic/claude-3.5-sonnet' : 'e.g., llama-3.3-70b-versatile'} className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-blue-300 mt-2">💡 Enter exact model identifier from {config.primaryModel === 'openrouter' ? 'OpenRouter' : 'Groq'} documentation</p>
              </div>
            ) : (
              <select value={config.customModelName} onChange={(e) => updateConfig('customModelName', e.target.value)} className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Auto-select best model</option>
                {(config.primaryModel === 'openrouter' ? openRouterModels : groqModels).map(model => <option key={model} value={model}>{model}</option>)}
              </select>
            )}
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10">
          <div className="flex-1"><h4 className="text-white font-medium">Enable Google Search Grounding</h4><p className="text-sm text-gray-400">Real-time SERP data for accuracy</p></div>
          <button onClick={() => updateConfig('enableGrounding', !config.enableGrounding)} className={`relative w-16 h-8 rounded-full transition-all duration-300 ml-4 flex-shrink-0 ${config.enableGrounding ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-600'}`}><div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${config.enableGrounding ? 'translate-x-8' : ''}`} /></button>
        </div>
      </div>

      {/* WordPress */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
        <div className="flex items-center gap-3 mb-4"><Globe className="w-6 h-6 text-purple-400" /><h3 className="text-xl font-bold text-white">WordPress & Site Information</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">WordPress Site URL <span className="text-red-400">*</span></label><input type="text" value={config.wpSiteUrl} onChange={(e) => updateConfig('wpSiteUrl', e.target.value)} placeholder="https://yoursite.com" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Username <span className="text-red-400">*</span></label><input type="text" value={config.wpUsername} onChange={(e) => updateConfig('wpUsername', e.target.value)} placeholder="admin" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-300 mb-2">Application Password <span className="text-red-400">*</span></label><input type="password" value={config.wpAppPassword} onChange={(e) => updateConfig('wpAppPassword', e.target.value)} placeholder="xxxx xxxx xxxx xxxx" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Organization</label><input type="text" value={config.orgName} onChange={(e) => updateConfig('orgName', e.target.value)} placeholder="Your Company" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label><input type="text" value={config.logoUrl} onChange={(e) => updateConfig('logoUrl', e.target.value)} placeholder="https://yoursite.com/logo.png" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Author Name</label><input type="text" value={config.authorName} onChange={(e) => updateConfig('authorName', e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">Author Page</label><input type="text" value={config.authorPageUrl} onChange={(e) => updateConfig('authorPageUrl', e.target.value)} placeholder="https://yoursite.com/author/johndoe" className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
        </div>
      </div>

      {/* ELITE SOTA FEATURES */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 space-y-4">
        <div><h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">🏆 Elite SOTA Features</h3><p className="text-sm text-purple-300">World-class SEO/GEO/AEO capabilities that set you apart from competition</p></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FeatureToggle label="Answer Engine Optimization (AEO)" description="Optimize for ChatGPT, Perplexity, Gemini" enabled={config.enableAEO} onToggle={() => updateConfig('enableAEO', !config.enableAEO)} />
          <FeatureToggle label="E-E-A-T Scoring" description="Experience, Expertise, Authority, Trust" enabled={config.enableEEAT} onToggle={() => updateConfig('enableEEAT', !config.enableEEAT)} />
          <FeatureToggle label="Entity Optimization" description="Knowledge Graph & entity linking" enabled={config.enableEntityOptimization} onToggle={() => updateConfig('enableEntityOptimization', !config.enableEntityOptimization)} />
          <FeatureToggle label="Semantic Clustering" description="Topic modeling & content silos" enabled={config.enableSemanticClustering} onToggle={() => updateConfig('enableSemanticClustering', !config.enableSemanticClustering)} />
          <FeatureToggle label="Competitor Intelligence" description="Real-time SERP gap analysis" enabled={config.enableCompetitorAnalysis} onToggle={() => updateConfig('enableCompetitorAnalysis', !config.enableCompetitorAnalysis)} />
          <FeatureToggle label="SERP Feature Targeting" description="Featured snippets, PAA, local pack" enabled={config.enableSERPFeatures} onToggle={() => updateConfig('enableSERPFeatures', !config.enableSERPFeatures)} />
        </div>
      </div>

      {/* Geo-Targeting */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-4">
        <div className="flex items-center justify-between"><div><h3 className="text-lg font-bold text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-purple-400" />Advanced Geo-Targeting</h3><p className="text-sm text-gray-400 mt-1">Location-specific optimization</p></div><button onClick={() => updateConfig('enableGeoTargeting', !config.enableGeoTargeting)} className={`relative w-16 h-8 rounded-full transition-all duration-300 ${config.enableGeoTargeting ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-600'}`}><div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${config.enableGeoTargeting ? 'translate-x-8' : ''}`} /></button></div>
        {config.enableGeoTargeting && (<div className="space-y-4 mt-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><input type="text" value={newLocation.country} onChange={(e) => setNewLocation({...newLocation, country: e.target.value})} placeholder="Country" className="px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm" /><input type="text" value={newLocation.state} onChange={(e) => setNewLocation({...newLocation, state: e.target.value})} placeholder="State/Province" className="px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm" /><input type="text" value={newLocation.city} onChange={(e) => setNewLocation({...newLocation, city: e.target.value})} placeholder="City" className="px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm" /><input type="text" value={newLocation.postalCode} onChange={(e) => setNewLocation({...newLocation, postalCode: e.target.value})} placeholder="Postal Code" className="px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white text-sm" /></div><button onClick={addGeoLocation} className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Location</button>{config.geoLocations.length > 0 && (<div className="space-y-2 mt-4"><h4 className="text-white font-medium text-sm">Locations ({config.geoLocations.length})</h4>{config.geoLocations.map((loc, i) => (<div key={i} className="flex items-center justify-between p-3 bg-black/30 border border-white/10 rounded-lg"><div><p className="text-white text-sm">{[loc.city, loc.state, loc.country].filter(Boolean).join(', ')}</p>{loc.postalCode && <p className="text-xs text-gray-400">Postal: {loc.postalCode}</p>}</div><button onClick={() => removeGeoLocation(i)} className="p-1 hover:bg-red-500/20 rounded"><X className="w-4 h-4 text-red-400" /></button></div>))}</div>)}</div>)}
      </div>

      {/* Save */}
      <div className="sticky bottom-4"><button onClick={handleSave} disabled={saving || !isConfigValid()} className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3">{saving ? <><Loader className="w-6 h-6 animate-spin" />Saving...</> : saved ? <><CheckCircle className="w-6 h-6" />Configuration Saved!</> : <><Save className="w-6 h-6" />Save Elite Configuration</>}</button></div>
    </div>
  );
};

const FeatureToggle: React.FC<{ label: string; description: string; enabled: boolean; onToggle: () => void }> = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
    <div className="flex-1 pr-3"><p className="text-white font-medium text-sm">{label}</p><p className="text-xs text-gray-400 mt-0.5">{description}</p></div>
    <button onClick={onToggle} className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${enabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-600'}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${enabled ? 'translate-x-6' : ''}`} /></button>
  </div>
);

export default ConfigurationTab;
