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
import { RegistrationProcess } from './components/sections/RegistrationProcess';
import { LeaderboardSection } from './components/sections/LeaderboardSection';
import { EventCountdown } from './components/sections/EventCountdown';
import { AnnouncementsFeed } from './components/sections/AnnouncementsFeed';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/common/Footer';
import { RegisterPage } from './components/pages/RegisterPage';
import { AdminPage } from './components/pages/AdminPage';
import { RegistrationModal } from './components/registration/RegistrationModal';

const MainContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [targetView, setTargetView] = useState<'home' | 'register' | 'admin'>('home');
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'admin'>('home');
  const [hasLoadedInit, setHasLoadedInit] = useState<boolean>(false);

  const triggerLoadingSequence = (newView: 'home' | 'register' | 'admin') => {
    setTargetView(newView);
    setLoading(true);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const isRegisterHash = hash === '#register-page' || hash === '#register';
      const isAdminHash = hash === '#admin-page' || hash === '#admin' || hash === '#organizer';
      const desired = isAdminHash ? 'admin' : isRegisterHash ? 'register' : 'home';
      if (desired !== currentView) {
        triggerLoadingSequence(desired);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleLoadingComplete = () => {
    setCurrentView(targetView);
    setLoading(false);
    setHasLoadedInit(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {loading ? (
        <LoadingScreen onComplete={handleLoadingComplete} isTransition={hasLoadedInit} />
      ) : (
        <div className="relative min-h-screen bg-[#07080c] text-slate-100 selection:bg-[#ff6b00] selection:text-black">
          {/* Futuristic Particle & Canvas Overlay */}
          <ParticleBackground />

          {/* Navigation Bar */}
          {currentView !== 'admin' && <Navbar />}

          {/* Arena Audio Player */}
          <ArenaAudioPlayer />

          {/* PAGE SWITCHER */}
          {currentView === 'admin' ? (
            <AdminPage />
          ) : currentView === 'register' ? (
            <RegisterPage onBackToHome={() => {
              window.location.hash = '#home';
              triggerLoadingSequence('home');
            }} />
          ) : (
            <main className="relative z-10">
              <Hero />
              <AboutArena />
              <EventFlow />
              <RegistrationProcess />
              <RulesBook />
              <LeaderboardSection />
              <EventCountdown />
              <AnnouncementsFeed />
              <FinalCTA />
            </main>
          )}

          {/* Footer */}
          {currentView !== 'admin' && <Footer />}

          {/* Modals & Control Center */}
          <RegistrationModal />
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
