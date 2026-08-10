import React from 'react';
import { Users, FileText, CheckSquare, Ticket, ChevronRight, Shield } from 'lucide-react';
import { sound } from '../../utils/sound';

export const RegistrationProcess: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Squad Assembly',
      desc: 'Form your team of 3 to 4 members, choose a unique squad name, and nominate a team captain.',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Team Structure Overview Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff1a40]/10 border border-[#ff1a40]/30 rounded-full text-xs font-mono text-[#ff1a40] tracking-wider uppercase shadow-[0_0_10px_rgba(255,26,64,0.1)]">
              TEAM STRUCTURE
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-wider">
              ENGINEERING <span className="text-[#ff1a40] text-glow-orange">SQUAD RATING</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              Each team in the Circuit Arena operates as an independent, professional **Engineering Squad**. 
            </p>

            <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#00f0ff]" />
                <span className="text-white font-mono font-bold text-xs uppercase tracking-wider">SQUAD SPECIFICATIONS:</span>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full shrink-0" />
                  SQUAD SIZE: <strong className="text-white">3–4 Competitors</strong> per team (strictly enforced).
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full shrink-0" />
                  SQUAD TYPE: Independent engineering group executing combined strategy.
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-slate-800 bg-[#0e111a]/80 text-left space-y-6">
            <div className="w-12 h-12 bg-[#07080c] border border-slate-800 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#ff1a40]" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-widest block font-bold">IDENTITY PROTOCOL</span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white uppercase">
                SQUAD CUSTOMIZATION
              </h3>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
              To align with the esports and championship styling of The Finals, teams are granted authorization to select and customize their official identifiers:
            </p>
            <div className="grid grid-cols-3 gap-3 text-center font-mono text-[10px] uppercase">
              <div className="p-3 bg-[#07080c] border border-slate-900 rounded">
                <span className="text-slate-500 block">01</span>
                <strong className="text-[#ff1a40]">Team Name</strong>
              </div>
              <div className="p-3 bg-[#07080c] border border-slate-900 rounded">
                <span className="text-slate-500 block">02</span>
                <strong className="text-[#00f0ff]">Team Number</strong>
              </div>
              <div className="p-3 bg-[#07080c] border border-slate-900 rounded">
                <span className="text-slate-500 block">03</span>
                <strong className="text-[#00ff66]">Logo / Badge</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="space-y-8 pt-12 border-t border-slate-900">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider mb-3">
              REGISTRATION PATHWAY
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xl mx-auto font-sans">
              Follow these four simple steps to enroll your squad profile and secure your telemetry access ticket.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="relative group p-6 bg-[#0a0b12]/80 border border-slate-900 hover:border-[#ff1a40]/40 rounded-2xl transition-all duration-300 text-left flex flex-col justify-between min-h-[250px] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff1a40]/40 group-hover:border-[#ff1a40] transition-colors" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff1a40]/40 group-hover:border-[#ff1a40] transition-colors" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff1a40]/40 group-hover:border-[#ff1a40] transition-colors" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff1a40]/40 group-hover:border-[#ff1a40] transition-colors" />

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-slate-800 group-hover:text-[#ff1a40]/20 transition-colors">
                      {item.step}
                    </span>
                    <div className="p-3 bg-slate-900 border border-slate-800 text-[#ff1a40] group-hover:bg-[#ff1a40]/10 group-hover:border-[#ff1a40]/30 rounded-xl transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

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
        </div>

        {/* CTA Register Button */}
        <div className="text-center pt-4">
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
