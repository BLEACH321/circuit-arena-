import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { sound } from '../../utils/sound';
import logoImg from '../../assets/logo.png';
import collegeLogoImg from '../../assets/college_logo.png';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'arena', 'rounds', 'rules', 'leaderboard'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    sound.enabled = !soundOn;
    setSoundOn(!soundOn);
    if (!soundOn) sound.playClick();
  };

  const navLinks = [
    { name: 'HOME', href: '#home', id: 'home' },
    { name: 'ABOUT', href: '#about', id: 'about' },
    { name: 'ARENA', href: '#arena', id: 'arena' },
    { name: 'ROUNDS', href: '#rounds', id: 'rounds' },
    { name: 'RULES', href: '#rules', id: 'rules' },
    { name: 'LEADERBOARD', href: '#leaderboard', id: 'leaderboard' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    sound.playClick();
    setMobileMenuOpen(false);

    if (window.location.hash === '#register-page' || window.location.hash === '#register') {
      window.location.hash = '#home';
    }

    const target = document.querySelector(link.href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterButtonClick = () => {
    sound.playClick();
    setMobileMenuOpen(false);
    window.open('https://forms.gle/JLGN8Z29SHA6bnM16', '_blank');
  };

  return (
    <header
      className={`left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'fixed top-0 bg-[#050508]/90 backdrop-blur-md border-b border-[#ff1a40]/30 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'absolute top-0 bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Group */}
          <div className="flex items-center gap-3">
            {/* Vidyavardhini Logo */}
            <img 
              src={collegeLogoImg}
              alt="Vidyavardhini College Logo"
              className="w-9 h-9 object-contain transition-transform hover:scale-105 cursor-pointer filter brightness-110"
              title="Vidyavardhini's College of Engineering & Technology"
              onClick={() => {
                sound.playClick();
                window.location.hash = '#home';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Divider */}
            <div className="h-6 w-px bg-slate-700/50" />

            {/* Circuit Arena Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                sound.playClick();
                window.location.hash = '#home';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative w-10 h-10 bg-[#0e111a] border border-[#ff1a40] rounded overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(255,26,64,0.3)] group-hover:scale-105 transition-transform p-1.5">
                <img src={logoImg} alt="Circuit Arena Logo" className="w-full h-full object-contain filter brightness-110" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff1a40] rounded-full animate-ping" />
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-wider text-white flex items-center gap-1.5">
                  CIRCUIT <span className="text-[#ff1a40] text-glow-orange">ARENA</span>
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-[#ff758f] uppercase opacity-80">
                  TECHNICAL COMPETITION
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-all relative rounded ${
                    isActive
                      ? 'text-[#ff758f] font-bold bg-[#ff1a40]/10 border border-[#ff1a40]/40 shadow-[0_0_10px_rgba(255,26,64,0.2)]'
                      : 'text-slate-300 hover:text-[#ff1a40] hover:bg-[#ff1a40]/10'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#ff1a40] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'Audio FX Enabled' : 'Audio FX Muted'}
              className="p-2 bg-[#0e111a] border border-slate-700 hover:border-[#ff1a40] rounded text-slate-300 hover:text-[#ff1a40] transition-colors cursor-pointer"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#ff1a40]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>



            {/* PROMINENT JOIN ARENA CTA BUTTON */}
            <button
              onClick={handleRegisterButtonClick}
              className="relative group overflow-hidden px-5 py-2.5 bg-transparent border border-[#ff1a40] text-[#ff1a40] hover:text-white font-display font-extrabold text-xs tracking-wider rounded shadow-[0_0_15px_rgba(255,26,64,0.25)] hover:shadow-[0_0_25px_rgba(255,26,64,0.5)] hover:bg-[#ff1a40]/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1.5 uppercase tracking-widest font-black">
                JOIN ARENA
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 bg-[#0e111a] border border-slate-700 rounded text-slate-300"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#ff1a40]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 bg-[#0e111a] border border-[#ff1a40]/50 rounded text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#ff1a40]" /> : <Menu className="w-6 h-6 text-[#ff1a40]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0c13]/98 border-b border-[#ff1a40]/40 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3 font-mono">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className="px-3 py-2 text-xs text-slate-300 hover:text-[#ff758f] hover:bg-[#ff1a40]/10 rounded border border-transparent hover:border-[#ff1a40]/30 transition-all text-left"
              >
                &gt; {link.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleRegisterButtonClick}
              className="w-full py-3 bg-[#ff1a40] text-white font-display font-black text-xs tracking-widest uppercase rounded flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,26,64,0.5)]"
            >
              JOIN ARENA
            </button>


          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
