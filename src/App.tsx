import React, { useState } from 'react';
import { Target, FileEdit, Sparkles, Shield } from 'lucide-react';
import GeoTargetingTab from './components/GeoTargetingTab';
import ContentStrategyTab from './components/ContentStrategyTab';
import IntegrationTab from './components/IntegrationTab';
import SecurityTab from './components/SecurityTab';

type Tab = 'geo' | 'content' | 'integration' | 'security';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('content');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SEO/GEO God Mode
                </h1>
                <p className="text-sm text-gray-400">Enterprise AI-Powered Content Optimization</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            <TabButton
              icon={<Target />}
              label="Geo-Targeting"
              active={activeTab === 'geo'}
              onClick={() => setActiveTab('geo')}
            />
            <TabButton
              icon={<FileEdit />}
              label="Content Strategy"
              active={activeTab === 'content'}
              onClick={() => setActiveTab('content')}
            />
            <TabButton
              icon={<Sparkles />}
              label="Integration"
              active={activeTab === 'integration'}
              onClick={() => setActiveTab('integration')}
            />
            <TabButton
              icon={<Shield />}
              label="Security"
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'geo' && <GeoTargetingTab />}
        {activeTab === 'content' && <ContentStrategyTab />}
        {activeTab === 'integration' && <IntegrationTab />}
        {activeTab === 'security' && <SecurityTab />}
      </main>
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
    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
      active
        ? 'text-purple-400 border-purple-400'
        : 'text-gray-400 border-transparent hover:text-gray-300'
    }`}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{label}</span>
  </button>
);

export default App;
