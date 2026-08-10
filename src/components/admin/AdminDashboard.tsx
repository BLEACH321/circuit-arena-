import React, { useState } from 'react';
import {
  ShieldCheck, Search, Filter, Download, Trash2, CheckCircle2,
  XCircle, Eye, LogOut, X
} from 'lucide-react';
import { useArena } from '../../context/ArenaContext';
import type { Team, TeamScore } from '../../types/arena';
import { exportRegistrationsCSV } from '../../utils/storage';
import { sound } from '../../utils/sound';

export const AdminDashboard: React.FC = () => {
  const {
    teams,
    scores,
    announcements,
    isAdmin,
    logoutAdmin,
    updateTeamStatus,
    deleteTeam,
    updateScore,
    addAnnouncement,
    deleteAnnouncement,
    countdownTarget,
    setCountdownTarget
  } = useArena();

  const [activeTab, setActiveTab] = useState<'teams' | 'scores' | 'announcements' | 'settings'>('teams');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  
  // Selected Team Details Modal State
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Score Editing Modal State
  const [editingScore, setEditingScore] = useState<TeamScore | null>(null);

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState<string>('');
  const [annCategory, setAnnCategory] = useState<string>('ARENA NOTICE');
  const [annContent, setAnnContent] = useState<string>('');
  const [annPriority, setAnnPriority] = useState<'HIGH' | 'NORMAL' | 'URGENT'>('NORMAL');

  // Countdown input state
  const [newCountdown, setNewCountdown] = useState<string>(countdownTarget.substring(0, 16));

  if (!isAdmin) return null;

  // KPI Calculations
  const totalTeamsCount = teams.length;
  const totalParticipantsCount = teams.reduce((acc, t) => acc + t.teamSize, 0);
  const approvedTeamsCount = teams.filter(t => t.status === 'APPROVED').length;
  const pendingTeamsCount = teams.filter(t => t.status === 'PENDING').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const registeredTodayCount = teams.filter(t => t.createdAt.startsWith(todayStr)).length;

  // Filtered Teams
  const filteredTeams = teams.filter(t => {
    const matchesSearch =
      t.teamId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.college.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleScoreSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;
    sound.playSuccess();
    updateScore(editingScore);
    setEditingScore(null);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    sound.playClick();
    addAnnouncement({
      title: annTitle.trim(),
      category: annCategory,
      content: annContent.trim(),
      priority: annPriority
    });
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="min-h-screen bg-[#050508] py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden scanline-overlay text-slate-100">
      
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff1a40]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff0055]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto bg-[#0e111a]/95 border border-slate-900 rounded-3xl p-6 relative z-10 shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-md text-left font-mono">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#00ff66]" />
              <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">
                ARENA CONTROL CENTER
              </h2>
            </div>
            <span className="text-xs text-[#00ff66] font-bold">ORGANIZER MANAGEMENT PANEL ACTIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                exportRegistrationsCSV(teams);
              }}
              className="px-4 py-2 bg-[#ff6b00] hover:bg-[#ff851b] text-black font-display font-bold text-xs uppercase rounded transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,107,0,0.4)]"
            >
              <Download className="w-4 h-4" /> [ EXPORT REGISTRATIONS ]
            </button>

            <button
              onClick={() => {
                sound.playClick();
                logoutAdmin();
                window.location.hash = '#home';
              }}
              className="p-2.5 bg-[#07080c] border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 rounded-xl cursor-pointer transition-all"
              title="Logout Session"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                window.location.hash = '#home';
              }}
              className="p-2.5 bg-[#07080c] border border-slate-800 hover:border-[#ff1a40]/50 text-slate-400 hover:text-[#ff1a40] rounded-xl cursor-pointer transition-all"
              title="Back to Home"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Dashboard Statistics KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          
          <div className="bg-[#07080c] p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">TOTAL TEAMS</span>
            <span className="text-2xl font-black font-display text-white">{totalTeamsCount}</span>
          </div>

          <div className="bg-[#07080c] p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">TOTAL PARTICIPANTS</span>
            <span className="text-2xl font-black font-display text-[#00f0ff]">{totalParticipantsCount}</span>
          </div>

          <div className="bg-[#07080c] p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">APPROVED TEAMS</span>
            <span className="text-2xl font-black font-display text-[#00ff66]">{approvedTeamsCount}</span>
          </div>

          <div className="bg-[#07080c] p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">PENDING TEAMS</span>
            <span className="text-2xl font-black font-display text-[#ffb700]">{pendingTeamsCount}</span>
          </div>

          <div className="bg-[#07080c] p-3 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block uppercase">REGISTERED TODAY</span>
            <span className="text-2xl font-black font-display text-[#ff6b00]">{registeredTodayCount}</span>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 font-display font-bold uppercase rounded-t border-t border-x transition-colors ${
              activeTab === 'teams'
                ? 'bg-[#121624] text-[#00ff66] border-[#00ff66]'
                : 'bg-transparent text-slate-400 border-transparent hover:text-white'
            }`}
          >
            SQUAD REGISTRATIONS ({teams.length})
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2 font-display font-bold uppercase rounded-t border-t border-x transition-colors ${
              activeTab === 'scores'
                ? 'bg-[#121624] text-[#00f0ff] border-[#00f0ff]'
                : 'bg-transparent text-slate-400 border-transparent hover:text-white'
            }`}
          >
            LEADERBOARD SCORES
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 font-display font-bold uppercase rounded-t border-t border-x transition-colors ${
              activeTab === 'announcements'
                ? 'bg-[#121624] text-[#ff6b00] border-[#ff6b00]'
                : 'bg-transparent text-slate-400 border-transparent hover:text-white'
            }`}
          >
            DISPATCH UPDATES ({announcements.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-display font-bold uppercase rounded-t border-t border-x transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#121624] text-[#ffb700] border-[#ffb700]'
                : 'bg-transparent text-slate-400 border-transparent hover:text-white'
            }`}
          >
            COUNTDOWN CONFIG
          </button>
        </div>

        {/* Tab 1: Teams Management */}
        {activeTab === 'teams' && (
          <div className="space-y-4">
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#07080c] p-3 rounded border border-slate-800">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search Team ID, Name, Leader, College..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 bg-[#0e111a] border border-slate-700 rounded text-xs text-white pl-9 outline-none focus:border-[#00ff66]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">FILTER STATUS:</span>
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-[10px] rounded border font-bold ${
                      statusFilter === st
                        ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]'
                        : 'bg-[#07080c] border-slate-800 text-slate-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-[#07080c] rounded border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0e111a] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">TEAM ID</th>
                    <th className="p-3">TEAM NAME</th>
                    <th className="p-3">COLLEGE</th>
                    <th className="p-3">LEADER</th>
                    <th className="p-3 text-center">SIZE</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredTeams.map((t) => (
                    <tr key={t.teamId} className="hover:bg-[#0e111a]/60">
                      <td className="p-3 font-bold text-[#00f0ff]">{t.teamId}</td>
                      <td className="p-3 font-bold text-white font-display">{t.teamName}</td>
                      <td className="p-3 text-slate-300">{t.college}</td>
                      <td className="p-3 text-slate-300">{t.leaderName}</td>
                      <td className="p-3 text-center">{t.teamSize}</td>
                      <td className="p-3">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            t.status === 'APPROVED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-600'
                              : t.status === 'REJECTED'
                              ? 'bg-red-950 text-red-400 border border-red-600'
                              : 'bg-amber-950 text-amber-300 border border-amber-600'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => setSelectedTeam(t)}
                          className="p-1 bg-slate-800 text-slate-300 hover:text-white rounded"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {t.status !== 'APPROVED' && (
                          <button
                            onClick={() => updateTeamStatus(t.teamId, 'APPROVED')}
                            className="p-1 bg-emerald-950 text-emerald-400 border border-emerald-700 hover:bg-emerald-800 rounded"
                            title="Approve Team"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {t.status !== 'REJECTED' && (
                          <button
                            onClick={() => updateTeamStatus(t.teamId, 'REJECTED')}
                            className="p-1 bg-red-950 text-red-400 border border-red-700 hover:bg-red-800 rounded"
                            title="Reject Team"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteTeam(t.teamId)}
                          className="p-1 bg-slate-900 text-slate-500 hover:text-red-400 rounded"
                          title="Delete Team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 2: Scores Management */}
        {activeTab === 'scores' && (
          <div className="space-y-4">
            <div className="bg-[#07080c] rounded border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0e111a] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">TEAM ID</th>
                    <th className="p-3">TEAM NAME</th>
                    <th className="p-3 text-center">BUDGET (15)</th>
                    <th className="p-3 text-center">DESIGN (25)</th>
                    <th className="p-3 text-center">TECH (15)</th>
                    <th className="p-3 text-center">BUILD (30)</th>
                    <th className="p-3 text-center">VIVA (15)</th>
                    <th className="p-3 text-right">TOTAL SCORE</th>
                    <th className="p-3 text-right">EDIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {scores.map((sc) => (
                    <tr key={sc.teamId} className="hover:bg-[#0e111a]/60">
                      <td className="p-3 font-bold text-[#00f0ff]">{sc.teamId}</td>
                      <td className="p-3 font-bold text-white font-display">{sc.teamName}</td>
                      <td className="p-3 text-center text-slate-300">{sc.budgetScore}</td>
                      <td className="p-3 text-center text-slate-300">{sc.designScore}</td>
                      <td className="p-3 text-center text-slate-300">{sc.technicalScore}</td>
                      <td className="p-3 text-center text-slate-300">{sc.implementationScore}</td>
                      <td className="p-3 text-center text-slate-300">{sc.troubleshootingScore}</td>
                      <td className="p-3 text-right font-bold text-[#00ff66]">{sc.totalScore * 10} PTS</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setEditingScore(sc)}
                          className="px-2 py-1 bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded hover:bg-[#00f0ff]/30 text-[10px]"
                        >
                          EDIT SCORES
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Announcements Dispatch */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Form */}
            <form onSubmit={handleAddAnnouncement} className="bg-[#07080c] p-4 rounded border border-slate-800 space-y-3">
              <h4 className="font-display font-bold text-white text-sm text-[#ff6b00]">PUBLISH DISPATCH ANNOUNCEMENT</h4>
              
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">TITLE</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. ROUND 1 AUCTION STARTED"
                  className="w-full p-2 bg-[#0e111a] border border-slate-700 rounded text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">CATEGORY</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value)}
                    className="w-full p-2 bg-[#0e111a] border border-slate-700 rounded text-xs text-white"
                  >
                    <option value="ARENA NOTICE">ARENA NOTICE</option>
                    <option value="BID WARS">BID WARS</option>
                    <option value="RULES UPDATE">RULES UPDATE</option>
                    <option value="COUNTDOWN">COUNTDOWN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">PRIORITY</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full p-2 bg-[#0e111a] border border-slate-700 rounded text-xs text-white"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">CONTENT</label>
                <textarea
                  rows={3}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Announcement body..."
                  className="w-full p-2 bg-[#0e111a] border border-slate-700 rounded text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#ff6b00] hover:bg-[#ff851b] text-black font-display font-bold text-xs uppercase rounded"
              >
                [ PUBLISH DISPATCH ]
              </button>
            </form>

            {/* List */}
            <div className="md:col-span-2 space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="bg-[#07080c] p-4 rounded border border-slate-800 flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-[#00f0ff] block mb-1">{a.category} • {a.date}</span>
                    <h5 className="font-display font-bold text-white text-sm">{a.title}</h5>
                    <p className="text-xs text-slate-300 mt-1">{a.content}</p>
                  </div>

                  <button
                    onClick={() => deleteAnnouncement(a.id)}
                    className="p-1 bg-[#0e111a] text-slate-500 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-[#07080c] p-6 rounded border border-slate-800 space-y-4 max-w-md">
            <h4 className="font-display font-bold text-white text-sm text-[#ffb700]">CONFIGURE EVENT COUNTDOWN TARGET</h4>
            
            <div>
              <label className="block text-xs text-slate-400 mb-1">EVENT LAUNCH TIMESTAMP (ISO / LOCAL)</label>
              <input
                type="datetime-local"
                value={newCountdown}
                onChange={(e) => setNewCountdown(e.target.value)}
                className="w-full p-2.5 bg-[#0e111a] border border-slate-700 rounded text-xs text-white"
              />
            </div>

            <button
              onClick={() => {
                sound.playSuccess();
                setCountdownTarget(newCountdown);
                alert('Countdown date updated successfully!');
              }}
              className="px-6 py-2 bg-[#ffb700] hover:bg-[#ffaa00] text-black font-display font-bold text-xs uppercase rounded"
            >
              [ SAVE COUNTDOWN DATE ]
            </button>
          </div>
        )}

      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e111a] border border-[#00f0ff] rounded-xl p-6 text-left font-mono space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-display font-bold text-white text-base">{selectedTeam.teamName}</h4>
              <button onClick={() => setSelectedTeam(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p><strong className="text-slate-400">TEAM ID:</strong> {selectedTeam.teamId}</p>
              <p><strong className="text-slate-400">COLLEGE:</strong> {selectedTeam.college}</p>
              <p><strong className="text-slate-400">LEADER:</strong> {selectedTeam.leaderName} ({selectedTeam.leaderEmail})</p>
              <p><strong className="text-slate-400">PHONE:</strong> {selectedTeam.leaderPhone}</p>
              <p><strong className="text-slate-400">STATUS:</strong> {selectedTeam.status}</p>
              {selectedTeam.transactionId && (
                <p><strong className="text-slate-400">UPI REF ID:</strong> <span className="text-[#00ff66] font-bold">{selectedTeam.transactionId}</span></p>
              )}

              <div className="pt-2 border-t border-slate-800">
                <strong className="text-[#00f0ff] block mb-2">PARTICIPANTS ROSTER ({selectedTeam.participants.length}):</strong>
                <div className="space-y-1">
                  {selectedTeam.participants.map((p, idx) => (
                    <div key={idx} className="p-2 bg-[#07080c] rounded border border-slate-800 text-[11px]">
                      {p.name} — ID: {p.collegeId || 'N/A'} {p.isLeader ? '(LEADER)' : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Score Editing Modal */}
      {editingScore && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleScoreSave} className="w-full max-w-md bg-[#0e111a] border border-[#00ff66] rounded-xl p-6 text-left font-mono space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-display font-bold text-white text-base">EDIT SCORES: {editingScore.teamName}</h4>
              <button onClick={() => setEditingScore(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">BUDGET STRATEGY (MAX 15)</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  value={editingScore.budgetScore}
                  onChange={(e) => setEditingScore({ ...editingScore, budgetScore: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-[#07080c] border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">CIRCUIT DESIGN (MAX 25)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  step="0.5"
                  value={editingScore.designScore}
                  onChange={(e) => setEditingScore({ ...editingScore, designScore: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-[#07080c] border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">TECHNICAL EXPLANATION (MAX 15)</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  value={editingScore.technicalScore}
                  onChange={(e) => setEditingScore({ ...editingScore, technicalScore: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-[#07080c] border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">BUILD IMPLEMENTATION (MAX 30)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={editingScore.implementationScore}
                  onChange={(e) => setEditingScore({ ...editingScore, implementationScore: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-[#07080c] border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">TROUBLESHOOTING &amp; VIVA (MAX 15)</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  value={editingScore.troubleshootingScore}
                  onChange={(e) => setEditingScore({ ...editingScore, troubleshootingScore: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-[#07080c] border border-slate-700 rounded text-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingScore(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#00ff66] text-black font-display font-bold rounded"
              >
                SAVE SCORE
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
