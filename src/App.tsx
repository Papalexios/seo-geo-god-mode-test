import React, { useState, useEffect } from 'react';
import '../App.tsx';

// This file re-exports the main App from root directory
// This maintains backwards compatibility while using proper src structure

const AppWrapper: React.FC = () => {
  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import the actual App component
    import('../App')
      .then((module) => {
        setAppComponent(() => module.default);
      })
      .catch((err) => {
        console.error('Failed to load App component:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5576c',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h1>⚠️ Loading Error</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: 'white',
            color: '#f5576c',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>Reload</button>
        </div>
      </div>
    );
  }

  if (!AppComponent) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return <AppComponent />;
};

export default AppWrapper;
