import React from 'react';
import { Sparkles, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-full mb-8 animate-pulse">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">Ultra-SOTA Technology</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-6 animate-fade-in">
            WordPress Content
            <br />
            <span className="text-5xl md:text-7xl">God Mode Activated</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Generate SEO-optimized, geo-targeted WordPress content at unprecedented speed and quality using cutting-edge AI technology.
          </p>

          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
          >
            Launch Generator
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Zap className="w-12 h-12" />}
            title="Lightning Fast"
            description="Generate complete articles in 2-3 seconds with parallel processing"
            color="purple"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12" />}
            title="SEO Mastery"
            description="95+ SEO scores with advanced optimization and schema markup"
            color="pink"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12" />}
            title="Quality AAA+"
            description="Human-level content quality with perfect grammar and flow"
            color="purple"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <StatItem value="100x" label="Faster" />
          <StatItem value="1000x" label="More Efficient" />
          <StatItem value="95+" label="SEO Score" />
          <StatItem value="AAA+" label="Quality" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; color: string }> = ({ icon, title, description, color }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:scale-105 transform transition-all duration-300 hover:border-${color}-500/50">
    <div className={`text-${color}-400 mb-4`}>{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

export default LandingPage;