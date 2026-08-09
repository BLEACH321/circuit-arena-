import React from 'react';
import { Bell, Calendar, Radio } from 'lucide-react';
import { useArena } from '../../context/ArenaContext';

export const AnnouncementsFeed: React.FC = () => {
  const { announcements } = useArena();

  return (
    <section className="py-16 px-4 relative z-10 bg-[#06070a]/90">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-widest mb-1">
              <Bell className="w-4 h-4 text-[#ff6b00]" />
              LIVE DISPATCH
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-display text-white tracking-wide uppercase">
              ARENA <span className="text-[#00f0ff] text-glow-cyan">UPDATES</span>
            </h3>
          </div>

          <span className="text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 px-3 py-1 rounded border border-[#00ff66]/30">
            STREAM ACTIVE
          </span>
        </div>

        {/* Announcement Cards */}
        {announcements.length === 0 ? (
          <div className="glass-panel p-8 rounded-xl border border-slate-800 text-center font-mono text-xs text-slate-400 max-w-lg mx-auto">
            <Radio className="w-8 h-8 text-[#00f0ff] mx-auto mb-2 animate-pulse" />
            <span>DISPATCH STREAM LISTENING FOR ORGANIZER ANNOUNCEMENTS...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-[#00f0ff]/40 transition-all hud-box flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-[#00f0ff] font-bold px-2 py-0.5 rounded bg-[#07080c] border border-[#00f0ff]/30">
                      {ann.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        ann.priority === 'URGENT'
                          ? 'bg-red-950 text-red-400 border border-red-600'
                          : ann.priority === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {ann.priority}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-white text-base mb-2">{ann.title}</h4>
                  <p className="text-slate-300 text-xs font-sans leading-relaxed">{ann.content}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#ff6b00]" /> {ann.date}
                  </span>
                  <span>DISPATCH OK</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
