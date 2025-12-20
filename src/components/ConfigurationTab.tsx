import React, { useState } from 'react';
import { Settings, Key, Globe, Image, Brain, MapPin } from 'lucide-react';

const ConfigurationTab: React.FC = () => {
  const [config, setConfig] = useState({
    geminiKey: '',
    serperKey: '',
    openaiKey: '',
    anthropicKey: '',
    openrouterKey: '',
    groqKey: '',
    primaryModel: 'gemini',
    enableGrounding: true,
    wpUrl: '',
    wpUsername: '',
    wpPassword: '',
    orgName: '',
    logoUrl: '',
    authorName: '',
    authorPageUrl: '',
    autoDetectUpload: true,
    enableNeuronWriter: false,
    enableGeoTargeting: false
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">1. Setup & Configuration</h2>
        <p className="text-gray-400">
          Connect your AI services. SOTA Agent requires Gemini for embeddings and Serper for adversarial research.
        </p>
      </div>

      {/* API Keys Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">API Keys</h3>
        </div>
        
        <div className="space-y-4">
          <InputField
            label="Google Gemini API Key"
            value={config.geminiKey}
            onChange={(v) => setConfig({...config, geminiKey: v})}
            type="password"
          />
          <InputField
            label="Serper API Key (Required for SOTA Research)"
            value={config.serperKey}
            onChange={(v) => setConfig({...config, serperKey: v})}
            type="password"
          />
          <InputField
            label="OpenAI API Key"
            value={config.openaiKey}
            onChange={(v) => setConfig({...config, openaiKey: v})}
            type="password"
          />
          <InputField
            label="Anthropic API Key"
            value={config.anthropicKey}
            onChange={(v) => setConfig({...config, anthropicKey: v})}
            type="password"
          />
          <InputField
            label="OpenRouter API Key"
            value={config.openrouterKey}
            onChange={(v) => setConfig({...config, openrouterKey: v})}
            type="password"
          />
          <InputField
            label="Groq API Key"
            value={config.groqKey}
            onChange={(v) => setConfig({...config, groqKey: v})}
            type="password"
          />
        </div>
      </div>

      {/* AI Model Configuration */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">AI Model Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Primary Generation Model
            </label>
            <select
              value={config.primaryModel}
              onChange={(e) => setConfig({...config, primaryModel: e.target.value})}
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="gemini">Google Gemini 2.5 Flash</option>
              <option value="openai">OpenAI GPT-4o</option>
              <option value="anthropic">Anthropic Claude 3</option>
              <option value="openrouter">OpenRouter (Auto-Fallback)</option>
              <option value="groq">Groq (High-Speed)</option>
            </select>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={config.enableGrounding}
              onChange={(e) => setConfig({...config, enableGrounding: e.target.checked})}
              className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
            />
            <div>
              <label className="text-sm font-medium text-white">Enable Google Search Grounding</label>
              <p className="text-xs text-gray-400 mt-1">
                Grounding provides the AI with real-time search results for more accurate, up-to-date content. Recommended for time-sensitive topics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WordPress & Site Information */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">WordPress & Site Information</h3>
        </div>
        
        <div className="space-y-4">
          <InputField
            label="WordPress Site URL"
            value={config.wpUrl}
            onChange={(v) => setConfig({...config, wpUrl: v})}
            placeholder="https://yoursite.com"
          />
          <InputField
            label="WordPress Username"
            value={config.wpUsername}
            onChange={(v) => setConfig({...config, wpUsername: v})}
          />
          <InputField
            label="WordPress Application Password"
            value={config.wpPassword}
            onChange={(v) => setConfig({...config, wpPassword: v})}
            type="password"
          />
          <InputField
            label="Organization Name"
            value={config.orgName}
            onChange={(v) => setConfig({...config, orgName: v})}
          />
          <InputField
            label="Logo URL"
            value={config.logoUrl}
            onChange={(v) => setConfig({...config, logoUrl: v})}
          />
          <InputField
            label="Author Name"
            value={config.authorName}
            onChange={(v) => setConfig({...config, authorName: v})}
          />
          <InputField
            label="Author Page URL"
            value={config.authorPageUrl}
            onChange={(v) => setConfig({...config, authorPageUrl: v})}
          />
        </div>
      </div>

      {/* SOTA Image Publishing */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">SOTA Image Publishing (Required for WordPress)</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          This app uses a multi-layer fallback system for image uploads, ensuring they always succeed without requiring any manual PHP configuration on your server.
        </p>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={config.autoDetectUpload}
            onChange={(e) => setConfig({...config, autoDetectUpload: e.target.checked})}
            className="w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
          />
          <label className="text-sm font-medium text-white">✅ Auto-Detect Upload Method</label>
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm mt-2">Learn More</button>
      </div>

      {/* Advanced Integrations */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Advanced SEO Integrations (Neuro-Semantic)</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config.enableNeuronWriter}
              onChange={(e) => setConfig({...config, enableNeuronWriter: e.target.checked})}
              className="w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
            />
            <label className="text-sm font-medium text-white">Enable NeuronWriter Integration</label>
          </div>
        </div>
      </div>

      {/* Geo-Targeting */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Advanced Geo-Targeting</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={config.enableGeoTargeting}
            onChange={(e) => setConfig({...config, enableGeoTargeting: e.target.checked})}
            className="w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
          />
          <label className="text-sm font-medium text-white">Enable Geo-Targeting for Content</label>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

export default ConfigurationTab;