import React, { useState, useEffect } from 'react';
import { ArenaProvider } from './context/ArenaContext';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ParticleBackground } from './components/common/ParticleBackground';
import { Navbar } from './components/common/Navbar';
import { ArenaAudioPlayer } from './components/common/ArenaAudioPlayer';
import { Hero } from './components/sections/Hero';
import { AboutArena } from './components/sections/AboutArena';
import { EventFlow } from './components/sections/EventFlow';
import { RulesBook } from './components/sections/RulesBook';
import { LeaderboardSection } from './components/sections/LeaderboardSection';
import { EventCountdown } from './components/sections/EventCountdown';
import { AnnouncementsFeed } from './components/sections/AnnouncementsFeed';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/common/Footer';
import { AdminPage } from './components/pages/AdminPage';
import { ProjectorView } from './components/auction/ProjectorView';
import { io } from 'socket.io-client';

const socketUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://circuit-arena-bids.onrender.com';

const socket = io(socketUrl, {
  transports: ['websocket', 'polling'],
  autoConnect: false // Connect only when needed to save resources on static landing page
});

const MainContent: React.FC = () => {
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
              <EventFlow />
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
