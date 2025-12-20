import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import './index.css';

// ULTRA-SOTA: Advanced Browser Polyfills for Maximum Compatibility
(window as any).Buffer = Buffer;
(window as any).global = globalThis;
(window as any).process = { env: {} };

// Lazy load the App component for optimal performance
const App = React.lazy(() => import('./App'));

// Advanced Loading Component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '4px solid rgba(255,255,255,0.3)',
      borderTop: '4px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <h2 style={{ marginTop: '20px', fontSize: '24px', fontWeight: '600' }}>Loading Ultra-SOTA Content Generator...</h2>
    <p style={{ marginTop: '8px', opacity: 0.9 }}>Initializing AI-powered WordPress optimization</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Ultra-Advanced Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SOTA Error Boundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️ Oops!</h1>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '600' }}>Something went wrong</h2>
          <p style={{ fontSize: '16px', maxWidth: '600px', marginBottom: '24px', opacity: 0.9 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: 'rgba(0,0,0,0.2)',
              border: '2px solid white',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🔄 Reload Application
          </button>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ marginTop: '32px', textAlign: 'left', maxWidth: '800px' }}>
              <summary style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '8px' }}>Error Details (Dev Mode)</summary>
              <pre style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {this.state.error?.stack}
                {JSON.stringify(this.state.errorInfo, null, 2)}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize Application with Ultra-SOTA Architecture
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('CRITICAL: Root element not found!');
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5576c; color: white; font-family: sans-serif;">
      <div style="text-align: center;">
        <h1>⚠️ Critical Error</h1>
        <p>Root element not found. Please check your HTML structure.</p>
      </div>
    </div>
  `;
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingFallback />}>
          <App />
        </React.Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

// Performance monitoring (production)
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`🚀 SOTA Load Time: ${pageLoadTime}ms`);
  });
}
