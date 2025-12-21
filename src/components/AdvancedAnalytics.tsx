import React from 'react';
import { TrendingUp, Target, Award, Link, Users, MessageSquare, Globe, Star } from 'lucide-react';

interface AdvancedMetrics {
  aeoScore: number;
  eeatScore: number;
  entityScore: number;
  semanticScore: number;
  serpFeatures: string[];
  competitorGap: number;
  topicalAuthority: number;
  answerEngineVisibility: number;
}

const AdvancedAnalytics: React.FC<{ metrics: AdvancedMetrics }> = ({ metrics }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <h4 className="text-white font-bold flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400" />
        Elite SOTA Analysis
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard icon={<MessageSquare className="w-4 h-4 text-blue-400" />} label="AEO Score" value={metrics.aeoScore} max={100} color="blue" />
        <MetricCard icon={<Award className="w-4 h-4 text-green-400" />} label="E-E-A-T" value={metrics.eeatScore} max={100} color="green" />
        <MetricCard icon={<Link className="w-4 h-4 text-purple-400" />} label="Entity" value={metrics.entityScore} max={100} color="purple" />
        <MetricCard icon={<TrendingUp className="w-4 h-4 text-orange-400" />} label="Semantic" value={metrics.semanticScore} max={100} color="orange" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-black/30 rounded-lg border border-white/10">
          <p className="text-xs text-gray-400 mb-1">SERP Features Targeting</p>
          <div className="flex flex-wrap gap-1">
            {metrics.serpFeatures.map((feature, i) => (
              <span key={i} className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">{feature}</span>
            ))}
          </div>
        </div>
        <div className="p-3 bg-black/30 rounded-lg border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Answer Engine Visibility</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-black/50 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${metrics.answerEngineVisibility}%` }} />
            </div>
            <span className="text-sm font-bold text-green-400">{metrics.answerEngineVisibility}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
        <div>
          <p className="text-xs text-gray-400">Topical Authority</p>
          <p className="text-lg font-bold text-white">{metrics.topicalAuthority}/100</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Competitor Gap</p>
          <p className="text-lg font-bold text-yellow-400">+{metrics.competitorGap} pts</p>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: number; max: number; color: string }> = ({ icon, label, value, max, color }) => {
  const percentage = (value / max) * 100;
  const colorMap: any = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500'
  };

  return (
    <div className="p-3 bg-black/30 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <p className="text-xl font-bold text-white mb-1">{value}/{max}</p>
      <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${colorMap[color]}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
