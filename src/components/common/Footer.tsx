import React from 'react';
import { Cpu, Globe, Instagram, Mail } from 'lucide-react';
import { sound } from '../../utils/sound';
import collegeLogoImg from '../../assets/college_logo.png';
import iicLogoImg from '../../assets/iic_logo.png';

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
      window.open('https://forms.gle/aajnQAHhmVVrNKBW7', '_blank');
      return;
    }
    const target = document.querySelector(link.href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050608] border-t border-slate-800/80 pt-16 pb-12 px-4 relative z-10 font-mono text-xs text-slate-400">
      
      {/* College Branding Row */}
      <div className="max-w-7xl mx-auto border-b border-slate-850 pb-10 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* College Logo & Name */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img 
            src={collegeLogoImg} 
            alt="Vidyavardhini College Logo" 
            className="w-18 h-18 sm:w-22 sm:h-22 object-contain filter brightness-110 transition-transform duration-300 hover:scale-105" 
          />
          <div>
            <h4 className="font-display font-black text-sm sm:text-base md:text-lg text-white tracking-wider uppercase">
              Vidyavardhini's College of Engineering & Technology
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-400 font-sans tracking-wide mt-1.5">
              K.T. Marg, Vasai Road (West), Dist. Palghar — 401202, Maharashtra.
            </p>
          </div>
        </div>

        {/* IIC Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={iicLogoImg} 
            alt="Institution's Innovation Council Logo" 
            className="h-14 sm:h-18 w-auto object-contain filter brightness-110 transition-transform duration-300 hover:scale-105" 
          />
        </div>
      </div>

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
          <div className="space-y-3 text-[11px] sm:text-xs">
            <a href="https://www.instagram.com/iicvcet?igsh=ejJsMnJiOGxuOTV3" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors break-all">
              <Instagram className="w-4 h-4 text-[#ff6b00]" /> @iicvcet
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <Globe className="w-4 h-4 text-[#00f0ff]" /> Circuit Arena Official
            </a>
            <a href="mailto:institutionsinnovationcell.vcet@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors break-all">
              <Mail className="w-4 h-4 text-[#ffb700]" /> institutionsinnovationcell.vcet@gmail.com
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
