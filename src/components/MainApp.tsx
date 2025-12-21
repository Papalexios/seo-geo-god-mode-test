import React, { useState } from 'react';
import ConfigurationTab from './ConfigurationTab';
import ContentStrategyTab from './ContentStrategyTab';
import ReviewExportTab from './ReviewExportTab';

type TabType = 'configuration' | 'content-strategy' | 'review-export';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('configuration');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">WP Content Optimizer Pro</h1>
              <p className="text-sm text-purple-300">v12.0 (SOTA Agent)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <TabButton
              active={activeTab === 'configuration'}
              onClick={() => setActiveTab('configuration')}
            >
              Configuration
            </TabButton>
            <TabButton
              active={activeTab === 'content-strategy'}
              onClick={() => setActiveTab('content-strategy')}
            >
              Content Strategy
            </TabButton>
            <TabButton
              active={activeTab === 'review-export'}
              onClick={() => setActiveTab('review-export')}
            >
              Review & Export
            </TabButton>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'configuration' && <ConfigurationTab />}
        {activeTab === 'content-strategy' && <ContentStrategyTab />}
        {activeTab === 'review-export' && <ReviewExportTab />}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-400">SOTA Content Orchestration Suite v12.1</p>
            <div className="flex space-x-6">
              <a href="#" className="text-purple-400 hover:text-purple-300">Docs</a>
              <a href="#" className="text-purple-400 hover:text-purple-300">API</a>
              <a href="#" className="text-purple-400 hover:text-purple-300">Support</a>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2">© 2025 WP Content Optimizer Pro. Engineered by Alexios Papaioannou.</p>
        </div>
      </footer>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
      active
        ? 'border-purple-500 text-white'
        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
    }`}
  >
    {children}
  </button>
);

export default MainApp;