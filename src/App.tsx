import React, { Suspense, lazy, useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load heavy components for optimal performance
const MainApp = lazy(() => import('./components/MainApp'));
const LandingPage = lazy(() => import('./components/LandingPage'));

function App() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Suspense fallback={<LoadingSpinner />}>
        {showLanding ? (
          <LandingPage onGetStarted={() => setShowLanding(false)} />
        ) : (
          <MainApp />
        )}
      </Suspense>
    </div>
  );
}

export default App;