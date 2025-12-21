import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const ReviewExportTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">3. Review & Export</h2>
        <p className="text-gray-400">
          Review generated content and publish to WordPress or export for later use.
        </p>
      </div>

      {/* Queue Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          icon={<Clock className="w-8 h-8" />}
          label="Pending"
          count={0}
          color="yellow"
        />
        <StatusCard
          icon={<CheckCircle className="w-8 h-8" />}
          label="Published"
          count={0}
          color="green"
        />
        <StatusCard
          icon={<XCircle className="w-8 h-8" />}
          label="Failed"
          count={0}
          color="red"
        />
      </div>

      {/* Content Queue */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Content Queue</h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-400 text-lg">No content in queue</p>
          <p className="text-gray-500 text-sm mt-2">Generate content to see it here</p>
        </div>
      </div>
    </div>
  );
};

const StatusCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  color: 'yellow' | 'green' | 'red';
}> = ({ icon, label, count, color }) => {
  const colorClasses = {
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    green: 'text-green-400 bg-green-500/10 border-green-500/30',
    red: 'text-red-400 bg-red-500/10 border-red-500/30'
  };

  return (
    <div className={`rounded-xl p-6 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{count}</p>
        </div>
        <div className={colorClasses[color].split(' ')[0]}>{icon}</div>
      </div>
    </div>
  );
};

export default ReviewExportTab;