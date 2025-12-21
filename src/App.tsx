import React, { useState } from 'react';
import { Settings, FileEdit, Sparkles, Shield } from 'lucide-react';
import ConfigurationTab from './components/ConfigurationTab';
import ContentStrategyTab from './components/ContentStrategyTab';
import IntegrationTab from './components/IntegrationTab';
import SecurityTab from './components/SecurityTab';

type Tab = 'config' | 'content' | 'integration' | 'security';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('config');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  WP Content Optimizer Pro
                </h1>
                <p className="text-xs text-gray-400">v12.0 (SOTA Agent)</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <TabButton
              icon={<Settings />}
              label="Configuration"
              active={activeTab === 'config'}
              onClick={() => setActiveTab('config')}
            />
            <TabButton
              icon={<FileEdit />}
              label="Content Strategy"
              active={activeTab === 'content'}
              onClick={() => setActiveTab('content')}
            />
            <TabButton
              icon={<Sparkles />}
              label="Review & Export"
              active={activeTab === 'integration'}
              onClick={() => setActiveTab('integration')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 pb-24">
        {activeTab === 'config' && <ConfigurationTab />}
        {activeTab === 'content' && <ContentStrategyTab />}
        {activeTab === 'integration' && <IntegrationTab />}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-lg border-t border-white/10 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-white">SOTA Content Orchestration Suite v12.1</span>
            </p>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              © 2025 WP Content Optimizer Pro. Engineered by Alexios Papaioannou.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const TabButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
      active
        ? 'text-purple-400 border-purple-400 bg-purple-400/10'
        : 'text-gray-400 border-transparent hover:text-gray-300 hover:bg-white/5'
    }`}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{label}</span>
  </button>
);

export default App;
