import React, { useState, useEffect } from 'react';
import { GodModeEngine } from './godmode-engine';
import { QuantumPlanner } from './quantum-planner';
import { ImageOrchestrator } from './image-orchestrator';
import { ConsensusEngine } from './consensus-engine';
import '../ultra-sota-styles.css';

interface GodModeProps {
  config: any;
  onComplete: (results: any) => void;
}

export const GodMode: React.FC<GodModeProps> = ({ config, onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'scoring' | 'crawling' | 'research' | 'writing' | 'audit' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [scoredUrls, setScoredUrls] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>({});
  const [quantum, setQuantum] = useState(false);
  
  const engine = new GodModeEngine(config);
  const planner = new QuantumPlanner();
  const imageOrch = new ImageOrchestrator(config.geminiKey);
  const consensus = new ConsensusEngine(config);
  
  const startGodMode = async () => {
    try {
      // PHASE 1: Strategic Intelligence
      setPhase('scoring');
      const urls = await engine.fetchSitemap(config.sitemapURL);
      const scored = urls.map(url => ({
        ...url,
        score: engine.calculateOpportunityScore(url),
        commercialIntent: engine.detectCommercialIntent(url.title),
        temporalDecay: engine.calculateTemporalDecay(url.lastmod),
        strikingDistance: engine.estimateStrikingDistance(url)
      })).sort((a, b) => b.score - a.score);
      setScoredUrls(scored);
      
      // PHASE 2: SmartCrawl Top URLs
      setPhase('crawling');
      const topUrls = scored.slice(0, 10);
      for (let i = 0; i < topUrls.length; i++) {
        setCurrentUrl(topUrls[i].url);
        setProgress((i / topUrls.length) * 100);
        const content = await engine.smartCrawl(topUrls[i].url);
        topUrls[i].content = content;
      }
      
      // PHASE 3: Adversarial Research
      setPhase('research');
      for (let i = 0; i < topUrls.length; i++) {
        const research = await engine.adversarialResearch(topUrls[i].keywords);
        topUrls[i].research = research;
        setProgress((i / topUrls.length) * 100);
      }
      
      // PHASE 4: Neural Writing (Multi-Model Consensus)
      setPhase('writing');
      for (let i = 0; i < topUrls.length; i++) {
        const draft = await consensus.generateConsensus({
          oldContent: topUrls[i].content,
          research: topUrls[i].research,
          keywords: topUrls[i].keywords
        });
        topUrls[i].newContent = draft;
        
        // Image Orchestration
        if (config.imageGeneration) {
          const images = await imageOrch.generateForH2s(draft);
          topUrls[i].images = images;
        }
        
        setProgress((i / topUrls.length) * 100);
      }
      
      // PHASE 5: Critic & Safety Loop
      setPhase('audit');
      for (let i = 0; i < topUrls.length; i++) {
        const audit = await engine.criticAndSafety(topUrls[i].newContent);
        if (!audit.passed) {
          topUrls[i].newContent = audit.repairedContent;
        }
        topUrls[i].audit = audit;
        setProgress((i / topUrls.length) * 100);
      }
      
      setPhase('complete');
      onComplete({ processedUrls: topUrls, totalScore: scored.reduce((sum, u) => sum + u.score, 0) });
      
    } catch (error) {
      console.error('God Mode Error:', error);
    }
  };
  
  const activateQuantumMode = async () => {
    setQuantum(true);
    const strategy = await planner.generateStrategy(config.niche);
    setInsights({ quantumStrategy: strategy });
  };
  
  return (
    <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #0a0a0f, #1a0a1f)', borderRadius: '16px', border: '2px solid #8B5CF6' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡🧠⚡</div>
        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, marginBottom: '0.5rem' }}>GOD MODE v300.0</h1>
        <p style={{ color: '#a78bfa', fontSize: '1.1rem', fontWeight: 600 }}>Distributed Autonomous SEO Agent • Quantum Sovereign Edition</p>
      </div>
      
      {/* Phase Indicator */}
      <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {['scoring', 'crawling', 'research', 'writing', 'audit'].map((p, i) => (
            <div key={p} style={{ textAlign: 'center', padding: '1rem', borderRadius: '8px', background: phase === p ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(30, 41, 59, 0.5)', border: phase === p ? '2px solid #8B5CF6' : '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {i === 0 ? '📊' : i === 1 ? '🕷️' : i === 2 ? '🔬' : i === 3 ? '✍️' : '🛡️'}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {p === 'scoring' ? 'Phase 1: Intelligence' : p === 'crawling' ? 'Phase 2: Crawl' : p === 'research' ? 'Phase 3: Research' : p === 'writing' ? 'Phase 4: Neural Write' : 'Phase 5: Audit'}
              </div>
            </div>
          ))}
        </div>
        
        {phase !== 'idle' && phase !== 'complete' && (
          <div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', transition: 'width 0.3s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8' }}>
              <span>Current: {currentUrl || 'Processing...'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Opportunity Scoring Dashboard */}
      {scoredUrls.length > 0 && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#10B981' }}>📊 Weighted Opportunity Scores</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {scoredUrls.slice(0, 10).map((url, i) => (
              <div key={i} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', marginBottom: '0.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{url.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Commercial: {url.commercialIntent ? '✅ +40' : '❌'} | 
                    Temporal: {url.temporalDecay >= 365 ? '✅ +30' : '⚠️'} | 
                    Striking Distance: {url.strikingDistance ? '🎯 +20' : '📍'}
                  </div>
                </div>
                <div style={{ background: url.score >= 80 ? 'linear-gradient(135deg, #10B981, #059669)' : url.score >= 60 ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #EF4444, #DC2626)', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 900, fontSize: '1.5rem', color: 'white' }}>
                  {url.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={startGodMode}
          disabled={phase !== 'idle' && phase !== 'complete'}
          style={{ padding: '1.5rem 3rem', background: phase === 'idle' || phase === 'complete' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(100, 116, 139, 0.5)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '1.3rem', fontWeight: 900, cursor: phase === 'idle' || phase === 'complete' ? 'pointer' : 'not-allowed', boxShadow: '0 10px 40px rgba(139, 92, 246, 0.4)', transition: 'all 0.3s', textTransform: 'uppercase' }}
        >
          {phase === 'idle' ? '⚡ ACTIVATE GOD MODE ⚡' : phase === 'complete' ? '🔄 RUN AGAIN' : '⏳ PROCESSING...'}
        </button>
        
        <button
          onClick={activateQuantumMode}
          disabled={quantum}
          style={{ padding: '1.5rem 3rem', background: quantum ? 'rgba(100, 116, 139, 0.5)' : 'linear-gradient(135deg, #3B82F6, #1E40AF)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '1.3rem', fontWeight: 900, cursor: quantum ? 'not-allowed' : 'pointer', boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s', textTransform: 'uppercase' }}
        >
          {quantum ? '✅ QUANTUM ACTIVE' : '🌌 QUANTUM PLANNER'}
        </button>
      </div>
      
      {/* Quantum Insights */}
      {insights.quantumStrategy && (
        <div style={{ marginTop: '2rem', background: 'rgba(59, 130, 246, 0.1)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#3B82F6' }}>🌌 Quantum Strategy</h3>
          <pre style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '8px', color: '#e2e8f0', fontSize: '0.9rem', overflow: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(insights.quantumStrategy, null, 2)}
          </pre>
        </div>
      )}
      
      {/* Feature Badges */}
      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {[
          { icon: '🎯', title: 'Commercial Intent', desc: 'Auto-detects buying keywords (+40)' },
          { icon: '⏰', title: 'Temporal Decay', desc: 'Prioritizes old content (+30)' },
          { icon: '🎯', title: 'Striking Distance', desc: 'Targets positions 4-10 (+20)' },
          { icon: '🕷️', title: 'SmartCrawl', desc: 'Event Horizon Purifier + Proxy Racing' },
          { icon: '🔬', title: 'Adversarial Research', desc: 'PAA + Competitor Gap + Temporal' },
          { icon: '✍️', title: 'Hormozi Remaster', desc: 'Grade 4 + AEO Traps + Entities' },
          { icon: '🛡️', title: 'Safety Loop', desc: 'Hallucination Check + Auto-Repair' },
          { icon: '🎨', title: 'DALL-E 3', desc: 'Cinematic images per H2' },
          { icon: '🔗', title: 'Blue Ocean Linker', desc: 'Global graph cross-linking' },
          { icon: '🤖', title: 'Multi-Model Voting', desc: 'Gemini + GPT-4o + Claude consensus' }
        ].map((feature, i) => (
          <div key={i} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#e2e8f0' }}>{feature.title}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{feature.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};