import React from 'react';
import { Cpu, Globe, Share2, Mail } from 'lucide-react';
import { sound } from '../../utils/sound';

export const Footer: React.FC = () => {
  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Event', href: '#about' },
    { name: 'Rounds', href: '#rounds' },
    { name: 'Rules', href: '#rules' },
    { name: 'Leaderboard', href: '#leaderboard' },
    { name: 'Register', href: '#register-page', isRegister: true },
  ];

  const handleLinkClick = (link: typeof links[0]) => {
    sound.playClick();
    if (link.isRegister) {
      window.location.hash = '#register-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(link.href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050608] border-t border-slate-800/80 pt-16 pb-12 px-4 relative z-10 font-mono text-xs text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-2 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0e111a] border border-[#ff6b00] rounded flex items-center justify-center text-[#00f0ff]">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-display font-black text-xl text-white tracking-wider">
              CIRCUIT <span className="text-[#ff6b00] text-glow-orange">ARENA</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 font-sans max-w-md leading-relaxed">
            The world's next engineering arena. A high-pressure technical team competition combining strategic budgeting, component procurement, circuit design, breadboard implementation, and viva troubleshooting.
          </p>

          <div className="text-amber-400 font-bold text-[11px] tracking-widest uppercase">
            ENTER • BID • DESIGN • BUILD • DEFEND • WIN
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="text-left">
          <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-4 text-[#00f0ff]">
            NAVIGATION
          </h4>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.name}>
                <button
                  onClick={() => handleLinkClick(link)}
                  className="hover:text-[#ff6b00] transition-colors text-left"
                >
                  &gt; {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social Column */}
        <div className="text-left">
          <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-4 text-[#00ff66]">
            CONNECT WITH ARENA
          </h4>
          <div className="space-y-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <Share2 className="w-4 h-4 text-[#ff6b00]" /> @circuitarena2026
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <Globe className="w-4 h-4 text-[#00f0ff]" /> Circuit Arena Official
            </a>
            <a href="mailto:organizer@circuitarena.org" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-[#ffb700]" /> organizer@circuitarena.org
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <span>© 2026 CIRCUIT ARENA. ALL RIGHTS RESERVED.</span>
        <span className="text-slate-500">DEVELOPED BY SS.CREATIVE | ENGINEERING ARENA OS V2.6.4</span>
      </div>
    </footer>
  );
};
