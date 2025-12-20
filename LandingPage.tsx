import React, { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number }> = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 0.8,
        opacity: Math.random() * 0.6 + 0.3,
        hue: Math.random() * 60 + 200
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 2, 3, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`;
        ctx.fill();

        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${0.2 * (1 - dist / 150)})`);
            gradient.addColorStop(1, `hsla(${p2.hue}, 80%, 60%, ${0.2 * (1 - dist / 150)})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
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
    <div className={`landing-page ${isVisible ? 'landing-visible' : ''}`}>
      <canvas ref={canvasRef} className="landing-canvas" />
      
      {/* Ultra Premium Gradient Orbs */}
      <div className="landing-orb landing-orb-1"></div>
      <div className="landing-orb landing-orb-2"></div>
      <div className="landing-orb landing-orb-3"></div>
      <div className="landing-orb landing-orb-4"></div>

      {/* Premium Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="landing-nav-logo">
            <div className="nav-logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="url(#navGradient)" strokeWidth="2"/>
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
            <button className="btn-nav-cta" onClick={onEnterApp}>
              <span>Launch App</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Ultra Premium */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#10B981" strokeWidth="2"/>
              <circle cx="8" cy="8" r="3" fill="#10B981"/>
            </svg>
            <span>v12.0 SOTA Engine • God Mode 2.0 • Live Production</span>
          </div>

          <h1 className="hero-title">
            Transform Your
            <br />
            <span className="hero-title-gradient">Content Strategy</span>
            <br />
            With AI Automation
          </h1>

          <p className="hero-subtitle">
            Generate 10,000+ SEO-optimized articles with autonomous AI agents.
            <br />
            <span className="hero-highlight">Real-time SERP analysis • Schema automation • WordPress integration</span>
          </p>

          <div className="hero-cta">
            <button className="btn-hero-primary" onClick={onEnterApp}>
              <span className="btn-glow"></span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" fill="currentColor" />
              </svg>
              <span>Launch Optimizer</span>
              <span className="btn-shimmer"></span>
            </button>
            <a href="https://seo-hub.affiliatemarketingforsuccess.com/" target="_blank" rel="noopener noreferrer" className="btn-hero-secondary">
              <span>View SEO Hub</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3L13 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Premium Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">
                <span className="stat-number">10,000</span>
                <span className="stat-plus">+</span>
              </div>
              <div className="stat-label">Articles Generated</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">
                <span className="stat-number">24/7</span>
              </div>
              <div className="stat-label">Autonomous Mode</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">
                <span className="stat-number">5</span>
                <span className="stat-text">AI</span>
              </div>
              <div className="stat-label">Model Integration</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">
                <span className="stat-number">100</span>
                <span className="stat-plus">+</span>
              </div>
              <div className="stat-label">Models Available</div>
            </div>
          </div>
        </div>

        {/* Premium 3D Visual */}
        <div className="hero-visual">
          <div className="visual-container">
            <div className="visual-card visual-card-1">
              <div className="visual-card-header">
                <span className="visual-dot visual-dot-red"></span>
                <span className="visual-dot visual-dot-yellow"></span>
                <span className="visual-dot visual-dot-green"></span>
              </div>
              <div className="visual-card-content">
                <div className="visual-line visual-line-long"></div>
                <div className="visual-line visual-line-medium"></div>
                <div className="visual-line visual-line-short"></div>
                <div className="visual-line visual-line-medium"></div>
              </div>
            </div>
            <div className="visual-card visual-card-2">
              <div className="visual-chart">
                <div className="chart-bar" style={{height: '45%', animationDelay: '0s'}}></div>
                <div className="chart-bar" style={{height: '70%', animationDelay: '0.1s'}}></div>
                <div className="chart-bar" style={{height: '55%', animationDelay: '0.2s'}}></div>
                <div className="chart-bar" style={{height: '90%', animationDelay: '0.3s'}}></div>
                <div className="chart-bar" style={{height: '65%', animationDelay: '0.4s'}}></div>
              </div>
            </div>
            <div className="visual-card visual-card-3">
              <div className="visual-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                  <path d="M8 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="visual-status">God Mode Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Ultra Premium Grid */}
      <section className="landing-features">
        <div className="features-header">
          <span className="features-subtitle">CORE CAPABILITIES</span>
          <h2 className="features-title">Everything You Need to Dominate SERPs</h2>
          <p className="features-description">Powered by cutting-edge AI technology and autonomous optimization</p>
        </div>

        <div className="features-grid">
          <div className="feature-card feature-card-hero">
            <div className="feature-card-glow"></div>
            <div className="feature-icon-container feature-icon-hero">
              <div className="feature-icon-glow"></div>
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#featureGrad1)"/>
                <defs>
                  <linearGradient id="featureGrad1" x1="3" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#8B5CF6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3>God Mode 2.0 Autonomous Engine</h3>
            <p>Set it and forget it. AI agents continuously monitor, optimize, and update your content 24/7 with zero human intervention. Automatic SERP tracking, competitor analysis, and intelligent content refreshing.</p>
            <div className="feature-tags">
              <span className="feature-tag feature-tag-primary">Fully Automated</span>
              <span className="feature-tag">24/7 Active</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Bulk Content Generation</h3>
            <p>Generate 100+ articles simultaneously with intelligent cluster planning, pillar pages, and automatic internal linking.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>NeuronWriter SOTA Analysis</h3>
            <p>Real-time NLP scoring, entity optimization, and semantic keyword integration using state-of-the-art NLP technology.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Content Health Monitoring</h3>
            <p>Track content freshness, identify stale pages, and receive AI-powered recommendations for strategic updates.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Advanced Schema Generator</h3>
            <p>Automatic Article, FAQ, HowTo, Product, and Organization schema with Google-compliant structured data markup.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M10.4 13.7L6.5 17.5m7.1-11.1L16.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>5+ AI Model Integration</h3>
            <p>Choose from Gemini 2.0 Flash, GPT-4 Turbo, Claude 3.5 Sonnet, Groq LLaMA, and 100+ OpenRouter models.</p>
          </div>
        </div>
      </section>

      {/* Technology Stack - Premium */}
      <section className="landing-tech">
        <div className="tech-content">
          <span className="tech-subtitle">POWERED BY</span>
          <h2 className="tech-title">Next-Generation AI Infrastructure</h2>
          <div className="tech-logos">
            <div className="tech-logo">
              <div className="tech-logo-icon">G</div>
              <span>Google Gemini 2.0</span>
            </div>
            <div className="tech-logo">
              <div className="tech-logo-icon">O</div>
              <span>GPT-4 Turbo</span>
            </div>
            <div className="tech-logo">
              <div className="tech-logo-icon">C</div>
              <span>Claude 3.5 Sonnet</span>
            </div>
            <div className="tech-logo">
              <div className="tech-logo-icon">N</div>
              <span>NeuronWriter SOTA</span>
            </div>
            <div className="tech-logo">
              <div className="tech-logo-icon">R</div>
              <span>OpenRouter 100+</span>
            </div>
            <div className="tech-logo">
              <div className="tech-logo-icon">L</div>
              <span>Groq LLaMA 70B</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Ultra Premium */}
      <section className="landing-cta">
        <div className="cta-container">
          <div className="cta-glow"></div>
          <div className="cta-icon-large">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" stroke="url(#ctaGradient)" strokeWidth="2"/>
              <path d="M40 15L47 33L65 35L52.5 47.5L55.5 65.5L40 57L24.5 65.5L27.5 47.5L15 35L33 33L40 15Z" stroke="url(#ctaGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="url(#ctaGradientFill)"/>
              <defs>
                <linearGradient id="ctaGradient" x1="15" y1="15" x2="65" y2="65" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="0.5" stopColor="#6366F1" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="ctaGradientFill" x1="15" y1="15" x2="65" y2="65" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" stopOpacity="0.3"/>
                  <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="cta-title">Ready to Transform Your Content Strategy?</h2>
          <p className="cta-description">Join thousands of content creators using AI to dominate search results and scale effortlessly</p>
          <button className="btn-cta-large" onClick={onEnterApp}>
            <span className="btn-cta-glow"></span>
            <span className="btn-cta-text">Launch WP Optimizer Pro</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="cta-note">No credit card required • Free setup • Instant access</p>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo-container">
                <img
                  src="https://affiliatemarketingforsuccess.com/wp-content/uploads/2023/03/cropped-Affiliate-Marketing-for-Success-Logo-Edited.png"
                  alt="Affiliate Marketing for Success"
                  className="footer-logo"
                />
              </div>
              <p className="footer-tagline">Created by <strong>Alexios Papaioannou</strong></p>
              <p className="footer-site">Owner of <a href="https://affiliatemarketingforsuccess.com" target="_blank" rel="noopener noreferrer">AffiliateMarketingForSuccess.com</a></p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="https://affiliatemarketingforsuccess.com/affiliate-marketing" target="_blank" rel="noopener noreferrer">Affiliate Marketing</a>
                <a href="https://affiliatemarketingforsuccess.com/ai" target="_blank" rel="noopener noreferrer">AI Tools</a>
                <a href="https://affiliatemarketingforsuccess.com/seo" target="_blank" rel="noopener noreferrer">SEO Strategies</a>
              </div>
              <div className="footer-column">
                <h4>Content</h4>
                <a href="https://affiliatemarketingforsuccess.com/blogging" target="_blank" rel="noopener noreferrer">Blogging</a>
                <a href="https://affiliatemarketingforsuccess.com/review" target="_blank" rel="noopener noreferrer">Reviews</a>
                <a href="https://seo-hub.affiliatemarketingforsuccess.com/" target="_blank" rel="noopener noreferrer">SEO Hub</a>
              </div>
              <div className="footer-column">
                <h4>Tools</h4>
                <a href="#" onClick={(e) => { e.preventDefault(); onEnterApp(); }}>WP Optimizer Pro</a>
                <a href="https://seo-hub.affiliatemarketingforsuccess.com/" target="_blank" rel="noopener noreferrer">Content Hub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Affiliate Marketing for Success. All rights reserved.</p>
            <div className="footer-badges">
              <span className="footer-badge">WP Optimizer Pro v12.0</span>
              <span className="footer-badge">SOTA Engine</span>
              <span className="footer-badge footer-badge-live">God Mode Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};