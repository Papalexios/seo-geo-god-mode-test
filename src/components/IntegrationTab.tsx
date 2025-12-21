import React from 'react';
import { Sparkles } from 'lucide-react';

const IntegrationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">3. Integration & Automation</h2>
        <p className="text-gray-400">Connect with external services and automate workflows</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Available Integrations</h3>
        </div>
        <p className="text-gray-400">Integration features coming soon...</p>
      </div>
    </div>
  );
};

export default IntegrationTab;
