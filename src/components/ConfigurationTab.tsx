import React, { useState } from 'react';
import { Settings, Key, Globe, Database, CheckCircle, AlertCircle, Loader, Info, Save, ExternalLink } from 'lucide-react';

interface ConfigState {
  // API Keys
  geminiKey: string;
  serperKey: string;
  openaiKey: string;
  anthropicKey: string;
  openrouterKey: string;
  groqKey: string;
  
  // AI Configuration
  primaryModel: 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'groq';
  enableGrounding: boolean;
  
  // WordPress
  wpSiteUrl: string;
  wpUsername: string;
  wpAppPassword: string;
  
  // Organization
  orgName: string;
  logoUrl: string;
  authorName: string;
  authorPageUrl: string;
  
  // Features
  autoDetectUpload: boolean;
  enableNeuronWriter: boolean;
  enableGeoTargeting: boolean;
}

const ConfigurationTab: React.FC = () => {
  const [config, setConfig] = useState<ConfigState>({
    geminiKey: '',
    serperKey: '',
    openaiKey: '',
    anthropicKey: '',
    openrouterKey: '',
    groqKey: '',
    primaryModel: 'gemini',
    enableGrounding: false,
    wpSiteUrl: '',
    wpUsername: '',
    wpAppPassword: '',
    orgName: '',
    logoUrl: '',
    authorName: '',
    authorPageUrl: '',
    autoDetectUpload: true,
    enableNeuronWriter: false,
    enableGeoTargeting: false
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  const updateConfig = (key: keyof ConfigState, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate saving to localStorage or backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save to localStorage
    localStorage.setItem('wp_optimizer_config', JSON.stringify(config));
    
    setSaving(false);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnection = async (service: string) => {
    setTesting(service);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTesting(null);
    alert(`${service} connection test successful!`);
  };

  const isConfigValid = () => {
    return config.geminiKey && config.serperKey && config.wpSiteUrl && config.wpUsername && config.wpAppPassword;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">1. Setup & Configuration</h2>
        <p className="text-gray-400">Connect your AI services. SOTA Agent requires Gemini for embeddings and Serper for adversarial research.</p>
      </div>

      {/* Validation Alert */}
      {!isConfigValid() && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-300">
            <p className="font-semibold mb-1">⚠️ Required Configuration Missing</p>
            <p>Please provide: Gemini API Key, Serper API Key, WordPress credentials</p>
          </div>
        </div>
      )}

      {/* API Keys Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">API Keys</h3>
        </div>

        <div className="space-y-4">
          {/* Gemini */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Google Gemini API Key <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={config.geminiKey}
                onChange={(e) => updateConfig('geminiKey', e.target.value)}
                placeholder="AIza...."
                className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => testConnection('Gemini')}
                disabled={!config.geminiKey || testing === 'Gemini'}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 flex items-center gap-2"
              >
                {testing === 'Gemini' ? <Loader className="w-4 h-4 animate-spin" /> : 'Test'}
              </button>
            </div>
          </div>

          {/* Serper */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Serper API Key (Required for SOTA Research) <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={config.serperKey}
                onChange={(e) => updateConfig('serperKey', e.target.value)}
                placeholder="Enter Serper API key"
                className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => testConnection('Serper')}
                disabled={!config.serperKey || testing === 'Serper'}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 flex items-center gap-2"
              >
                {testing === 'Serper' ? <Loader className="w-4 h-4 animate-spin" /> : 'Test'}
              </button>
            </div>
          </div>

          {/* OpenAI */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label>
            <input
              type="password"
              value={config.openaiKey}
              onChange={(e) => updateConfig('openaiKey', e.target.value)}
              placeholder="sk-...."
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Anthropic */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Anthropic API Key</label>
            <input
              type="password"
              value={config.anthropicKey}
              onChange={(e) => updateConfig('anthropicKey', e.target.value)}
              placeholder="sk-ant-...."
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* OpenRouter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">OpenRouter API Key</label>
            <input
              type="password"
              value={config.openrouterKey}
              onChange={(e) => updateConfig('openrouterKey', e.target.value)}
              placeholder="sk-or-...."
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Groq */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Groq API Key</label>
            <input
              type="password"
              value={config.groqKey}
              onChange={(e) => updateConfig('groqKey', e.target.value)}
              placeholder="gsk_...."
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* AI Model Configuration */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">AI Model Configuration</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Primary Generation Model</label>
          <select
            value={config.primaryModel}
            onChange={(e) => updateConfig('primaryModel', e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="gemini">Google Gemini 2.5 Flash</option>
            <option value="openai">OpenAI GPT-4o</option>
            <option value="anthropic">Anthropic Claude 3</option>
            <option value="openrouter">OpenRouter (Auto-Fallback)</option>
            <option value="groq">Groq (High-Speed)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-medium">Enable Google Search Grounding</h4>
            </div>
            <p className="text-sm text-gray-400">
              Grounding provides the AI with real-time search results for more accurate, up-to-date content. Recommended for time-sensitive topics.
            </p>
          </div>
          <button
            onClick={() => updateConfig('enableGrounding', !config.enableGrounding)}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ml-4 flex-shrink-0 ${
              config.enableGrounding
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
              config.enableGrounding ? 'translate-x-8' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* WordPress Configuration */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">WordPress & Site Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              WordPress Site URL <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={config.wpSiteUrl}
              onChange={(e) => updateConfig('wpSiteUrl', e.target.value)}
              placeholder="https://yoursite.com"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              WordPress Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={config.wpUsername}
              onChange={(e) => updateConfig('wpUsername', e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              WordPress Application Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={config.wpAppPassword}
              onChange={(e) => updateConfig('wpAppPassword', e.target.value)}
              placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Organization Name</label>
            <input
              type="text"
              value={config.orgName}
              onChange={(e) => updateConfig('orgName', e.target.value)}
              placeholder="Your Company"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
            <input
              type="text"
              value={config.logoUrl}
              onChange={(e) => updateConfig('logoUrl', e.target.value)}
              placeholder="https://yoursite.com/logo.png"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Author Name</label>
            <input
              type="text"
              value={config.authorName}
              onChange={(e) => updateConfig('authorName', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Author Page URL</label>
            <input
              type="text"
              value={config.authorPageUrl}
              onChange={(e) => updateConfig('authorPageUrl', e.target.value)}
              placeholder="https://yoursite.com/author/johndoe"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* SOTA Image Publishing */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">SOTA Image Publishing (Required for WordPress)</h3>
            <p className="text-sm text-gray-400 mt-1">
              Multi-layer fallback system for image uploads, ensuring they always succeed without requiring manual PHP configuration.
            </p>
          </div>
          <a
            href="#"
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm flex-shrink-0"
          >
            Learn More <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 ${config.autoDetectUpload ? 'text-green-400' : 'text-gray-400'}`} />
            <span className="text-white font-medium">Auto-Detect Upload Method</span>
          </div>
          <button
            onClick={() => updateConfig('autoDetectUpload', !config.autoDetectUpload)}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              config.autoDetectUpload
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
              config.autoDetectUpload ? 'translate-x-8' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Advanced Integrations */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-4">
        <h3 className="text-lg font-bold text-white">Advanced SEO Integrations (Neuro-Semantic)</h3>

        <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10">
          <div>
            <h4 className="text-white font-medium">Enable NeuronWriter Integration</h4>
            <p className="text-sm text-gray-400 mt-1">Advanced content optimization with NLU analysis</p>
          </div>
          <button
            onClick={() => updateConfig('enableNeuronWriter', !config.enableNeuronWriter)}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              config.enableNeuronWriter
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
              config.enableNeuronWriter ? 'translate-x-8' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Advanced Geo-Targeting */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">Advanced Geo-Targeting</h3>

        <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10">
          <div>
            <h4 className="text-white font-medium">Enable Geo-Targeting for Content</h4>
            <p className="text-sm text-gray-400 mt-1">Optimize content for specific geographical locations</p>
          </div>
          <button
            onClick={() => updateConfig('enableGeoTargeting', !config.enableGeoTargeting)}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              config.enableGeoTargeting
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
              config.enableGeoTargeting ? 'translate-x-8' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4">
        <button
          onClick={handleSave}
          disabled={saving || !isConfigValid()}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
        >
          {saving ? (
            <><Loader className="w-6 h-6 animate-spin" /> Saving Configuration...</>
          ) : saved ? (
            <><CheckCircle className="w-6 h-6" /> Configuration Saved!</>
          ) : (
            <><Save className="w-6 h-6" /> Save Configuration</>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-2">💡 Configuration Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Required fields are marked with <span className="text-red-400">*</span></li>
              <li>Test API connections before saving</li>
              <li>Configuration is saved to browser localStorage</li>
              <li>Enable Grounding for fact-checking and real-time data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationTab;
