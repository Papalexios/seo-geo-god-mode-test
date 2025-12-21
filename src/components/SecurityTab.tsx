import React from 'react';
import { Shield } from 'lucide-react';

const SecurityTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">4. Security & Compliance</h2>
        <p className="text-gray-400">Manage security settings and API access</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Security Settings</h3>
        </div>
        <p className="text-gray-400">Security features coming soon...</p>
      </div>
    </div>
  );
};

export default SecurityTab;
