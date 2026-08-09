import React from 'react';
import { Trophy, Medal, Crown, Star, ShieldAlert } from 'lucide-react';
import { useArena } from '../../context/ArenaContext';
import { sound } from '../../utils/sound';

export const LeaderboardSection: React.FC = () => {
  const { scores } = useArena();

  // Sort teams by totalScore descending
  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <section id="leaderboard" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0e111a] border border-[#ffb700]/40 text-[#ffb700] font-mono text-xs tracking-widest uppercase rounded mb-4">
            <Trophy className="w-4 h-4 text-[#ffb700]" />
            LIVE COMPETITION RANKINGS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide uppercase">
            ARENA <span className="text-[#ffb700] text-glow-orange">LEADERBOARD</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base">
            Real-time standings updated continuously by the official Circuit Arena jury panel.
          </p>
        </div>

        {/* Empty State when no dummy scores exist */}
        {sortedScores.length === 0 ? (
          <div className="glass-panel p-12 rounded-xl border border-slate-800 text-center font-mono text-xs hud-box max-w-2xl mx-auto space-y-3">
            <ShieldAlert className="w-10 h-10 text-[#ffb700] mx-auto animate-pulse" />
            <h3 className="font-display font-bold text-white text-base">ARENA LEADERBOARD STANDBY</h3>
            <p className="text-slate-400">
              No team scores recorded yet. Squads registering for Circuit Arena will be evaluated across 5 official stages and displayed here live.
            </p>
          </div>
        ) : (
          <>
            {/* Podium Top 3 Highlight Cards */}
            {sortedScores.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                
                {/* Rank 2 (Silver / Cyan) */}
                <div
                  onMouseEnter={() => sound.playClick()}
                  className="glass-panel p-6 rounded-xl border-2 border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.25)] text-center order-2 md:order-1 relative hud-box"
                >
                  <div className="w-12 h-12 bg-[#00f0ff]/10 border border-[#00f0ff] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Medal className="w-6 h-6 text-[#00f0ff]" />
                  </div>
                  <span className="text-xs font-mono text-[#00f0ff] font-bold block mb-1">RANK 02</span>
                  <h3 className="font-display font-black text-xl text-white mb-1">{sortedScores[1].teamName}</h3>
                  <span className="text-[10px] font-mono text-slate-400 block mb-3">{sortedScores[1].teamId}</span>
                  <div className="text-3xl font-black font-display text-[#00f0ff] text-glow-cyan">
                    {sortedScores[1].totalScore * 10} <span className="text-xs font-mono text-white">PTS</span>
                  </div>
                </div>

                {/* Rank 1 (Gold) */}
                <div
                  onMouseEnter={() => sound.playClick()}
                  className="glass-panel p-8 rounded-xl border-2 border-[#ffb700] shadow-[0_0_40px_rgba(255,183,0,0.4)] text-center order-1 md:order-2 relative hud-box transform md:-translate-y-4 bg-gradient-to-b from-[#141824] to-[#07080c]"
                >
                  <div className="w-16 h-16 bg-[#ffb700]/20 border-2 border-[#ffb700] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(255,183,0,0.6)] animate-pulse">
                    <Crown className="w-8 h-8 text-[#ffb700]" />
                  </div>
                  <span className="text-xs font-mono text-[#ffb700] font-bold block mb-1">🏆 CHAMPION (RANK 01)</span>
                  <h3 className="font-display font-black text-2xl text-white mb-1">{sortedScores[0].teamName}</h3>
                  <span className="text-[10px] font-mono text-slate-400 block mb-4">{sortedScores[0].teamId}</span>
                  <div className="text-4xl font-black font-display text-[#ffb700] text-glow-orange">
                    {sortedScores[0].totalScore * 10} <span className="text-sm font-mono text-white">PTS</span>
                  </div>
                </div>

                {/* Rank 3 (Bronze / Orange) */}
                <div
                  onMouseEnter={() => sound.playClick()}
                  className="glass-panel p-6 rounded-xl border-2 border-[#ff6b00] shadow-[0_0_25px_rgba(255,107,0,0.25)] text-center order-3 relative hud-box"
                >
                  <div className="w-12 h-12 bg-[#ff6b00]/10 border border-[#ff6b00] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-[#ff6b00]" />
                  </div>
                  <span className="text-xs font-mono text-[#ff6b00] font-bold block mb-1">RANK 03</span>
                  <h3 className="font-display font-black text-xl text-white mb-1">{sortedScores[2].teamName}</h3>
                  <span className="text-[10px] font-mono text-slate-400 block mb-3">{sortedScores[2].teamId}</span>
                  <div className="text-3xl font-black font-display text-[#ff6b00] text-glow-orange">
                    {sortedScores[2].totalScore * 10} <span className="text-xs font-mono text-white">PTS</span>
                  </div>
                </div>

              </div>
            )}

            {/* Full Ranking Table */}
            <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden hud-box text-left">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#0e111a] text-slate-400 uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">RANK</th>
                      <th className="py-4 px-6">TEAM ID</th>
                      <th className="py-4 px-6">TEAM NAME</th>
                      <th className="py-4 px-6 text-center">BUDGET (15)</th>
                      <th className="py-4 px-6 text-center">DESIGN (25)</th>
                      <th className="py-4 px-6 text-center">BUILD (30)</th>
                      <th className="py-4 px-6 text-right">TOTAL SCORE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {sortedScores.map((score, idx) => {
                      const rankStr = (idx + 1).toString().padStart(2, '0');
                      const isTop3 = idx < 3;
                      return (
                        <tr
                          key={score.teamId}
                          className={`hover:bg-[#0e111a]/80 transition-colors ${
                            isTop3 ? 'bg-[#ff6b00]/5 font-bold' : ''
                          }`}
                        >
                          <td className="py-4 px-6 font-display font-extrabold text-sm">
                            <span className={idx === 0 ? 'text-[#ffb700]' : idx === 1 ? 'text-[#00f0ff]' : idx === 2 ? 'text-[#ff6b00]' : 'text-slate-400'}>
                              {rankStr}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-400">{score.teamId}</td>
                          <td className="py-4 px-6 text-white font-display">{score.teamName}</td>
                          <td className="py-4 px-6 text-center text-slate-300">{score.budgetScore}</td>
                          <td className="py-4 px-6 text-center text-slate-300">{score.designScore}</td>
                          <td className="py-4 px-6 text-center text-slate-300">{score.implementationScore}</td>
                          <td className="py-4 px-6 text-right font-display text-sm font-bold">
                            <span className="text-[#00ff66]">{score.totalScore * 10} PTS</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
};
