import React, { useEffect, useState, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { LoadingScreen } from './components/LoadingScreen';
import { Twitter, Github, MousePointer2, ScrollText } from 'lucide-react';
import Scene from './components/Canvas/Scene';
import { AISphere } from './components/Home/AISphere';
import { DataStreams } from './components/Home/DataStreams';
import { ColorControls } from './components/Controls/ColorControls';

function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sphereColors, setSphereColors] = useState({
    sphere: '#00a2ff',
    ring1: '#00a2ff',
    ring2: '#0066ff',
    ring3: '#4338ca',
    particles: '#4338ca'
  });

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleScroll = () => {
      if (!isTerminalOpen) {
        const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        setScrollProgress(Math.min(1, progress));
      }
    };

    window.scrollTo(0, 0);

    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          setTimeout(() => setShowLoadingScreen(false), 800);
          return 100;
        }
        const increment = prev > 80 ? 8 : prev > 40 ? 4 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    document.body.style.height = isTerminalOpen ? '100vh' : '200vh';
    document.body.style.overflow = isTerminalOpen ? 'hidden' : 'auto';

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [isTerminalOpen]);

  useEffect(() => {
    if (isTerminalOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isTerminalOpen]);

  const handleExternalLink = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <main className="w-full h-screen fixed top-0 left-0 bg-[#050816]">
        <div 
          className={"custom-cursor " + (isClicking ? 'active' : '')}
          style={{ 
            left: cursorPosition.x + 'px', 
            top: cursorPosition.y + 'px'
          }}
        />

        <Scene>
          <Switch>
            <Route path="/">
              <AISphere 
                onTerminalOpen={() => setIsTerminalOpen(true)} 
                onTerminalClose={() => setIsTerminalOpen(false)}
                scrollProgress={scrollProgress}
                colors={sphereColors}
              />
              <DataStreams color={sphereColors.particles} />
            </Route>
          </Switch>
        </Scene>
        
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <nav className={`pointer-events-auto p-6 flex flex-col transition-all duration-300 ${
            isTerminalOpen || scrollProgress > 0.1 ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
          }`}>
            <div className="flex justify-between items-center w-full">
              <h1 className="text-white text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center gap-2">
                <img src="/nexus-logo.svg" alt="NexusAI Logo" className="w-8 h-8" />
                NexusAI
              </h1>
              <div className="flex gap-4">
                <a 
                  href="https://x.com/NexusNxai"
                  onClick={(e) => handleExternalLink(e, 'https://x.com/NexusNxai')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm group"
                >
                  <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">X</span>
                </a>
                <a 
                  href="https://github.com/NexusAINXAI/NexusAI"
                  onClick={(e) => handleExternalLink(e, 'https://github.com/NexusAINXAI/NexusAI')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm group"
                >
                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">GitHub</span>
                </a>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4 ml-auto">
              <div className="flex items-center gap-2 text-indigo-300/70">
                <MousePointer2 className="w-4 h-4 text-indigo-400/90" />
                <span className="text-sm">Click NexusAI core to interact</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-300/70">
                <ScrollText className="w-4 h-4 text-indigo-400/90" />
                <span className="text-sm">Scroll to customize colors</span>
              </div>
            </div>
          </nav>
          
          <div className={`absolute bottom-0 left-0 w-full p-6 transition-all duration-300 ${
            isTerminalOpen || scrollProgress > 0.1 ? 'opacity-0 translate-y-[20px]' : 'opacity-100 translate-y-0'
          }`}>
            <h2 className="text-white text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
              Welcome to The Future of Trading
            </h2>
            <p className="text-gray-300 max-w-xl">
              Experience the convergence of artificial intelligence, advanced trading algorithms, 
              and cutting-edge visualization technology. Navigate through our interactive 3D environment 
              to explore market insights and trading opportunities.
            </p>
          </div>

          <ColorControls 
            colors={sphereColors}
            onChange={setSphereColors}
            className={`pointer-events-auto fixed left-6 top-1/2 -translate-y-1/2 transition-all duration-300 ${
              isTerminalOpen || scrollProgress < 0.1 ? 'opacity-0 translate-x-[-20px] pointer-events-none' : 'opacity-100 translate-x-0'
            }`}
          />
        </div>
      </main>

      {showLoadingScreen && (
        <LoadingScreen progress={loadingProgress} isComplete={!isLoading} />
      )}
    </>
  );
}

export default App;