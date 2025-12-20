import React, { useEffect, useRef } from 'react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 2, 3, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();

        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="landing-page">
      <canvas ref={canvasRef} className="landing-canvas" />
      
      {/* Animated Gradient Orbs */}
      <div className="landing-orb landing-orb-1"></div>
      <div className="landing-orb landing-orb-2"></div>
      <div className="landing-orb landing-orb-3"></div>

      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="landing-nav-logo">
            <div className="nav-logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8L24 18L34 19L27 26L29 36L20 31L11 36L13 26L6 19L16 18L20 8Z" fill="url(#navGradient)" />
                <defs>
                  <linearGradient id="navGradient" x1="6" y1="8" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" />
                    <stop offset="0.5" stopColor="#6366F1" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>WP Optimizer <strong>PRO</strong></span>
          </div>
          <div className="landing-nav-links">
            <a href="https://affiliatemarketingforsuccess.com" target="_blank" rel="noopener noreferrer">About</a>
            <a href="https://seo-hub.affiliatemarketingforsuccess.com/" target="_blank" rel="noopener noreferrer">SEO Hub</a>
            <button className="btn-nav-cta" onClick={onEnterApp}>Launch App</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1L10 6L15 7L11.5 10.5L12.5 15.5L8 13L3.5 15.5L4.5 10.5L1 7L6 6L8 1Z" fill="#10B981" />
            </svg>
            <span>v12.0 SOTA Engine • God Mode 2.0 • Live</span>
          </div>

          <h1 className="hero-title">
            The Ultimate
            <br />
            <span className="hero-title-gradient">AI-Powered SEO</span>
            <br />
            Content System
          </h1>

          <p className="hero-subtitle">
            Generate 10,000+ SEO-optimized articles with autonomous AI agents.
            <br />
            Real-time SERP analysis • Schema automation • WordPress integration.
          </p>

          <div className="hero-cta">
            <button className="btn-hero-primary" onClick={onEnterApp}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" fill="currentColor" />
              </svg>
              Launch Optimizer
              <span className="btn-shimmer"></span>
            </button>
            <a href="https://seo-hub.affiliatemarketingforsuccess.com/" target="_blank" rel="noopener noreferrer" className="btn-hero-secondary">
              <span>View SEO Hub</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3L13 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">10,000+</div>
              <div className="stat-label">Articles Generated</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Autonomous Optimization</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">5 AI</div>
              <div className="stat-label">Model Integration</div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="visual-container">
            <div className="visual-card visual-card-1">
              <div className="visual-card-header">
                <span className="visual-dot"></span>
                <span className="visual-dot"></span>
                <span className="visual-dot"></span>
              </div>
              <div className="visual-card-content">
                <div className="visual-line visual-line-long"></div>
                <div className="visual-line visual-line-medium"></div>
                <div className="visual-line visual-line-short"></div>
              </div>
            </div>
            <div className="visual-card visual-card-2">
              <div className="visual-chart">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
                <div className="chart-bar" style={{height: '45%'}}></div>
                <div className="chart-bar" style={{height: '95%'}}></div>
              </div>
            </div>
            <div className="visual-card visual-card-3">
              <div className="visual-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features">
        <div className="features-header">
          <span className="features-subtitle">CORE CAPABILITIES</span>
          <h2 className="features-title">Everything You Need to Dominate SERPs</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card feature-card-large">
            <div className="feature-icon-container">
              <div className="feature-icon-glow"></div>
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>God Mode 2.0 Autonomous Engine</h3>
            <p>Set it and forget it. AI agents continuously monitor, optimize, and update your content 24/7. Automatic SERP tracking, competitor analysis, and content refreshing while you sleep.</p>
            <div className="feature-tag">Fully Automated</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Bulk Content Generation</h3>
            <p>Generate 100+ articles simultaneously. Full cluster planning, pillar pages, and internal linking automation.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m6 6v-6m-6 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>NeuronWriter SOTA Analysis</h3>
            <p>Real-time NLP scoring, entity optimization, and semantic keyword integration using state-of-the-art technology.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v20m0-20a9 9 0 019 9h-9V2zm0 20a9 9 0 01-9-9h9v9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Content Health Monitoring</h3>
            <p>Track content freshness, identify stale pages, and get AI-powered recommendations for updates automatically.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Advanced Schema Generator</h3>
            <p>Automatic Article, FAQ, HowTo, Product, and Organization schema with Google-compliant structured data.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>5 AI Model Integration</h3>
            <p>Choose from Gemini 2.0, GPT-4, Claude 3.5 Sonnet, Groq Llama, and 100+ OpenRouter models for optimal results.</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="landing-tech">
        <div className="tech-content">
          <span className="tech-subtitle">POWERED BY</span>
          <h2 className="tech-title">Cutting-Edge AI Technology</h2>
          <div className="tech-logos">
            <div className="tech-logo">Google Gemini 2.0</div>
            <div className="tech-logo">GPT-4 Turbo</div>
            <div className="tech-logo">Claude 3.5 Sonnet</div>
            <div className="tech-logo">NeuronWriter</div>
            <div className="tech-logo">OpenRouter</div>
            <div className="tech-logo">Groq LLaMA</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="cta-container">
          <div className="cta-icon-large">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 10L36 26L52 28L41 39L44 55L30 48L16 55L19 39L8 28L24 26L30 10Z" stroke="url(#ctaGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="ctaGradient" x1="8" y1="10" x2="52" y2="55" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="0.5" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="cta-title">Ready to Transform Your Content Strategy?</h2>
          <p className="cta-description">Join thousands of content creators using AI to dominate search results</p>
          <button className="btn-cta-large" onClick={onEnterApp}>
            <span>Launch WP Optimizer Pro</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <img
                src="https://affiliatemarketingforsuccess.com/wp-content/uploads/2023/03/cropped-Affiliate-Marketing-for-Success-Logo-Edited.png"
                alt="Affiliate Marketing for Success"
                className="footer-logo"
              />
              <p className="footer-tagline">Created by <strong>Alexios Papaioannou</strong></p>
              <p className="footer-site">Owner of <a href="https://affiliatemarketingforsuccess.com" target="_blank" rel="noopener noreferrer">AffiliateMarketingForSuccess.com</a></p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="https://affiliatemarketingforsuccess.com/affiliate-marketing" target="_blank" rel="noopener noreferrer">Affiliate Marketing</a>
                <a href="https://affiliatemarketingforsuccess.com/ai" target="_blank" rel="noopener noreferrer">AI</a>
                <a href="https://affiliatemarketingforsuccess.com/seo" target="_blank" rel="noopener noreferrer">SEO</a>
              </div>
              <div className="footer-column">
                <h4>Content</h4>
                <a href="https://affiliatemarketingforsuccess.com/blogging" target="_blank" rel="noopener noreferrer">Blogging</a>
                <a href="https://affiliatemarketingforsuccess.com/review" target="_blank" rel="noopener noreferrer">Reviews</a>
                <a href="https://seo-hub.affiliatemarketingforsuccess.com/" target="_blank" rel="noopener noreferrer">SEO Hub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Affiliate Marketing for Success. All rights reserved.</p>
            <p className="footer-version">WP Content Optimizer Pro v12.0 • SOTA Engine</p>
          </div>
        </div>
      </footer>
    </div>
  );
};