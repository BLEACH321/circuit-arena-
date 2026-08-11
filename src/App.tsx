import React, { useState, useEffect } from 'react';
import { ArenaProvider } from './context/ArenaContext';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ParticleBackground } from './components/common/ParticleBackground';
import { Navbar } from './components/common/Navbar';
import { ArenaAudioPlayer } from './components/common/ArenaAudioPlayer';
import { Hero } from './components/sections/Hero';
import { AboutArena } from './components/sections/AboutArena';
import { Stage1BidWars } from './components/sections/InteractiveRounds/Stage1BidWars';
import { RulesBook } from './components/sections/RulesBook';
import { LeaderboardSection } from './components/sections/LeaderboardSection';
import { EventCountdown } from './components/sections/EventCountdown';
import { AnnouncementsFeed } from './components/sections/AnnouncementsFeed';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/common/Footer';
import { AdminPage } from './components/pages/AdminPage';
import { ProjectorView } from './components/auction/ProjectorView';
import { io } from 'socket.io-client';
import { useArena } from './context/ArenaContext';
import { Lock } from 'lucide-react';

const socketUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://circuit-arena-bids.onrender.com';

const socket = io(socketUrl, {
  transports: ['websocket', 'polling'],
  autoConnect: false // Connect only when needed to save resources on static landing page
});

const MainContent: React.FC = () => {
  const { arenaOpen } = useArena();
  const [loading, setLoading] = useState<boolean>(true);
  const [targetView, setTargetView] = useState<'home' | 'admin' | 'live-auction'>('home');
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'live-auction'>('home');
  const [hasLoadedInit, setHasLoadedInit] = useState<boolean>(false);

  // Synced auction states
  const [auctionTeams, setAuctionTeams] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    if (currentView === 'live-auction' || window.location.hash === '#live-auction' || window.location.hash === '#projector') {
      if (!socket.connected) {
        socket.connect();
      }
    }
  }, [currentView]);

  useEffect(() => {
    const handleStateUpdate = (data: any) => {
      if (data.teams) setAuctionTeams(data.teams);
      setActiveItem(data.activeItem);
    };

    socket.on('state_update', handleStateUpdate);
    return () => {
      socket.off('state_update', handleStateUpdate);
    };
  }, []);

  const triggerLoadingSequence = (newView: 'home' | 'admin' | 'live-auction') => {
    setTargetView(newView);
    setLoading(true);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const isAdminHash = hash === '#admin-page' || hash === '#admin' || hash === '#organizer';
      const isProjectorHash = hash === '#live-auction' || hash === '#projector';
      const desired = isProjectorHash ? 'live-auction' : isAdminHash ? 'admin' : 'home';
      if (desired !== currentView) {
        if (hasLoadedInit) {
          setCurrentView(desired);
          setTargetView(desired);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          triggerLoadingSequence(desired);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView, hasLoadedInit]);

  const handleLoadingComplete = () => {
    setCurrentView(targetView);
    setLoading(false);
    setHasLoadedInit(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {currentView === 'live-auction' ? (
        <ProjectorView
          socket={socket}
          teams={auctionTeams}
          activeItem={activeItem}
          onLogout={() => {
            window.location.hash = '#home';
          }}
        />
      ) : loading ? (
        <LoadingScreen onComplete={handleLoadingComplete} isTransition={hasLoadedInit} />
      ) : (
        <div className="relative min-h-screen bg-[#07080c] text-slate-100 selection:bg-[#ff6b00] selection:text-black">
          {/* Futuristic Particle & Canvas Overlay */}
          <ParticleBackground />

          {/* Navigation Bar */}
          {currentView !== 'admin' && <Navbar />}

          {/* Arena Audio Player */}
          {!['admin', 'live-auction'].includes(currentView) && <ArenaAudioPlayer />}

          {/* PAGE SWITCHER */}
          {currentView === 'admin' ? (
            <AdminPage />
          ) : (
            <main className="relative z-10">
              <Hero />
              <AboutArena />
              <section id="rounds" className="py-24 px-4 relative z-10 bg-[#06070a]/90">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide uppercase">
                      LIVE <span className="text-[#00f0ff] text-glow-cyan">TELEMETRY BIDDING</span>
                    </h2>
                    <p className="mt-4 text-slate-350 text-sm sm:text-base font-sans leading-relaxed">
                      Connect your telemetry bridge to participate in the live components battle and manage your virtual budget.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-[#ff6b00]/30 hud-box bg-gradient-to-b from-[#0d1019] to-[#07080c] min-h-[300px]">
                    {!arenaOpen ? (
                      <div className="flex flex-col items-center justify-center min-h-[250px] space-y-6 text-center font-mono animate-fade-in py-12">
                        <div className="w-16 h-16 bg-[#ff1a40]/10 border-2 border-[#ff1a40] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,26,64,0.4)] animate-pulse">
                          <Lock className="w-8 h-8 text-[#ff1a40]" />
                        </div>
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#07080c] border border-red-500/30 text-red-500 text-xs font-bold uppercase rounded">
                            ACCESS STATUS: RESTRICTED
                          </div>
                          <h4 className="text-2xl font-black text-white uppercase tracking-wider">
                            BID WARS ARENA IS LOCKED
                          </h4>
                          <p className="text-slate-400 text-xs font-mono max-w-md mx-auto leading-relaxed">
                            This bidding arena will be unlocked and officially open on the day of the event (August 18, 2026). Check back during the live broadcast.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Stage1BidWars />
                    )}
                  </div>
                </div>
              </section>
              <RulesBook />
              <LeaderboardSection />
              <EventCountdown />
              <AnnouncementsFeed />
              <FinalCTA />
            </main>
          )}

          {/* Footer */}
          {currentView !== 'admin' && <Footer />}
        </div>
      )}
    </>
  );
};

export function App() {
  return (
    <ArenaProvider>
      <MainContent />
    </ArenaProvider>
  );
}

export default App;
