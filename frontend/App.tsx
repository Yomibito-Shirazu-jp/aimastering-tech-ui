import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Mastering } from './pages/Mastering';
import { Disc3 } from 'lucide-react';

const App: React.FC = () => {
  // Simple hash-based routing for SPA
  const [currentPath, setCurrentPath] = useState(window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.replace('#', '') || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <Disc3 className="h-8 w-8 text-primary group-hover:animate-spin-slow transition-transform" />
              <span className="ml-2 text-xl font-bold tracking-tight text-white">
                WhitePrint<span className="text-zinc-500 font-normal">Mastering</span>
              </span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/mastering')}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                アプリを開く
              </button>
              <div className="flex items-center space-x-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>API稼働中</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPath === '/' && <Home onNavigate={navigate} />}
        {currentPath === '/mastering' && <Mastering />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} WhitePrint Mastering. Powered by Concertmaster API.</p>
          <p className="mt-2 text-xs">This is a frontend demonstration SPA.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
