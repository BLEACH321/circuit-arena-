import React from 'react';
import { Users, FileText, CheckSquare, Ticket, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/sound';

export const RegistrationProcess: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Squad Assembly',
      desc: 'Form your team of 1 to 4 members, choose a unique squad name, and nominate a team captain.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Roster Enrollment',
      desc: 'Input contact details, email addresses, and official college/institute ID card numbers for all participants.',
      icon: FileText,
    },
    {
      step: '03',
      title: 'Directives Review',
      desc: 'Go through the official tournament directives, verify entered rosters, and check the agreement boxes.',
      icon: CheckSquare,
    },
    {
      step: '04',
      title: 'Ticket Activation',
      desc: 'Generate your team reference ID, pre-populate your starting leaderboard score, and download your entry ticket PDF.',
      icon: Ticket,
    },
  ];

  const handleRegisterClick = () => {
    sound.playClick();
    window.location.hash = '#register-page';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="registration-process" className="py-24 border-t border-slate-900 bg-[#050508] relative overflow-hidden">
      
      {/* Background neon flares */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#ff1a40]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff0055]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff1a40]/10 border border-[#ff1a40]/30 rounded-full text-xs font-mono text-[#ff1a40] tracking-wider uppercase mb-4 shadow-[0_0_10px_rgba(255,26,64,0.1)]">
            HOW TO ENTER
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider">
            REGISTRATION <span className="text-[#ff1a40] text-glow-orange">PROCESS</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Follow these four simple steps to activate your squad profile and lock in your position on the leaderboard.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="relative group p-6 bg-[#0a0b12]/80 border border-slate-900 hover:border-[#ff1a40]/40 rounded-2xl transition-all duration-300 text-left flex flex-col justify-between min-h-[250px] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                {/* Cyber corner marks */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff1a40]/40 group-hover:border-[#ff1a40] transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff1a40]/40 group-hover:border-[#ff1a40] transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff1a40]/40 group-hover:border-[#ff1a40] transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff1a40]/40 group-hover:border-[#ff1a40] transition-colors" />

                {/* Step Number and Icon */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-slate-800 group-hover:text-[#ff1a40]/20 transition-colors">
                    {item.step}
                  </span>
                  <div className="p-3 bg-slate-900 border border-slate-800 text-[#ff1a40] group-hover:bg-[#ff1a40]/10 group-hover:border-[#ff1a40]/30 rounded-xl transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Description details */}
                <div className="mt-8">
                  <h3 className="font-display font-bold text-base text-white tracking-wider uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Register Button */}
        <div className="text-center">
          <button
            onClick={handleRegisterClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border-2 border-[#ff1a40] text-[#ff1a40] hover:text-white font-display font-black text-xs tracking-widest uppercase rounded shadow-[0_0_15px_rgba(255,26,64,0.15)] hover:shadow-[0_0_25px_rgba(255,26,64,0.5)] hover:bg-[#ff1a40]/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            REGISTER YOUR SQUAD NOW
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default RegistrationProcess;
