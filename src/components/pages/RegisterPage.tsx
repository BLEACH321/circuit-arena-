import React, { useState } from 'react';
import { ShieldCheck, Cpu, ArrowLeft, Users, CheckCircle2, AlertCircle, RefreshCw, Download, Sparkles } from 'lucide-react';
import { useArena } from '../../context/ArenaContext';
import type { Participant, Team } from '../../types/arena';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';

export const RegisterPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { registerTeam, teams } = useArena();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdTeam, setCreatedTeam] = useState<Team | null>(null);

  const [formData, setFormData] = useState({
    teamName: '',
    college: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    teamSize: 4
  });

  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', email: '', phone: '', collegeId: '', isLeader: true },
    { name: '', email: '', phone: '', collegeId: '' },
    { name: '', email: '', phone: '', collegeId: '' },
    { name: '', email: '', phone: '', collegeId: '' }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState<boolean>(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChangeForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (field === 'leaderName') {
      setParticipants(prev => prev.map((p, idx) => idx === 0 ? { ...p, name: value } : p));
    }
    if (field === 'leaderEmail') {
      setParticipants(prev => prev.map((p, idx) => idx === 0 ? { ...p, email: value } : p));
    }
    if (field === 'leaderPhone') {
      setParticipants(prev => prev.map((p, idx) => idx === 0 ? { ...p, phone: value } : p));
    }
  };

  const handleChangeParticipant = (index: number, field: keyof Participant, value: string) => {
    setParticipants(prev => prev.map((p, idx) => idx === index ? { ...p, [field]: value } : p));

    const errKey = `p_${index}_${field}`;
    if (errors[errKey]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[errKey];
        return next;
      });
    }

    if (index === 0) {
      if (field === 'name') setFormData(prev => ({ ...prev, leaderName: value }));
      if (field === 'email') setFormData(prev => ({ ...prev, leaderEmail: value }));
      if (field === 'phone') setFormData(prev => ({ ...prev, leaderPhone: value }));
    }
  };

  const handleNextStep1 = () => {
    sound.playClick();
    const errs: Record<string, string> = {};
    if (!formData.teamName.trim()) errs.teamName = 'Team name is required.';
    if (!formData.college.trim()) errs.college = 'College/Institute is required.';
    if (!formData.leaderName.trim()) errs.leaderName = 'Leader name is required.';
    if (!formData.leaderEmail.trim()) errs.leaderEmail = 'Leader email is required.';
    else if (!validateEmail(formData.leaderEmail)) errs.leaderEmail = 'Invalid email address.';
    if (!formData.leaderPhone.trim()) errs.leaderPhone = 'Leader phone number is required.';

    const exists = teams.some(t => t.teamName.toLowerCase().trim() === formData.teamName.toLowerCase().trim());
    if (exists) errs.teamName = 'Team name already registered!';

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep2 = () => {
    sound.playClick();
    const errs: Record<string, string> = {};

    for (let i = 0; i < formData.teamSize; i++) {
      const p = participants[i];
      if (i === 0) {
        if (!p.name.trim()) errs[`p_${i}_name`] = 'Leader name is required.';
        if (!p.email.trim()) errs[`p_${i}_email`] = 'Leader email is required.';
        else if (!validateEmail(p.email)) errs[`p_${i}_email`] = 'Invalid email.';
        if (!p.phone.trim()) errs[`p_${i}_phone`] = 'Leader phone is required.';
        if (!p.collegeId.trim()) errs[`p_${i}_collegeId`] = 'College ID is required.';
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmRegistration = () => {
    if (!agreed) {
      setErrors({ agreement: 'You must accept the official arena directives to proceed.' });
      return;
    }

    sound.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      const filteredParticipants = participants.slice(0, formData.teamSize).map((p, i) => ({
        ...p,
        isLeader: i === 0
      }));

      const newTeam = registerTeam({
        teamName: formData.teamName.toUpperCase().trim(),
        college: formData.college.trim(),
        leaderName: formData.leaderName.trim(),
        leaderEmail: formData.leaderEmail.trim(),
        leaderPhone: formData.leaderPhone.trim(),
        teamSize: formData.teamSize,
        participants: filteredParticipants
      });

      setIsSubmitting(false);
      setCreatedTeam(newTeam);
      setStep(4);
      sound.playSuccess();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      } catch {
        // Ignore
      }
    }, 1200);
  };

  const handleDownloadTicket = (team: Team) => {
    sound.playClick();
    const content = `
=====================================================
            CIRCUIT ARENA 2026 - OFFICIAL TICKET
=====================================================
TEAM ID:       ${team.teamId}
TEAM NAME:     ${team.teamName}
COLLEGE:       ${team.college}
TEAM LEADER:   ${team.leaderName} (${team.leaderEmail})
TEAM SIZE:     ${team.teamSize} PARTICIPANT(S)
START BUDGET:  2000 VIRTUAL PTS
STATUS:        CONFIRMED & APPROVED
DATE ISSUED:   ${new Date().toLocaleString()}
=====================================================
INSTRUCTIONS: Present this official Team Ticket at Stage 0 check-in.
=====================================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TICKET_${team.teamId}_${team.teamName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 pt-28 pb-20 px-4 sm:px-6 relative z-10 scanline-overlay text-left">
      
      {/* Background Glow Nodes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#ff6b00]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => {
              sound.playClick();
              onBackToHome();
            }}
            className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] hover:text-white px-3 py-1.5 bg-[#0e111a] border border-[#00f0ff]/40 rounded transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" /> [ &lt; BACK TO ARENA HOMEPAGE ]
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Cpu className="w-4 h-4 text-[#ff6b00] animate-pulse" />
            <span>OFFICIAL ARENA SQUAD REGISTRATION PORTAL</span>
          </div>
        </div>

        {/* Page Header Banner */}
        <div className="glass-panel p-8 rounded-2xl border-2 border-[#ff6b00] hud-box bg-gradient-to-b from-[#121624] to-[#07080c] shadow-[0_0_40px_rgba(255,107,0,0.25)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#07080c] border border-[#ff6b00]/50 text-[#ff6b00] font-mono text-xs tracking-widest uppercase rounded mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" /> SQUAD ENROLLMENT V2.6
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-wide">
                REGISTER YOUR <span className="text-[#ff6b00] text-glow-orange">SQUAD</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-sans mt-2">
                Complete your team registration to receive your official Team ID (`CA-2026-XXX`) and unlock your starting 2000 PTS virtual component budget.
              </p>
            </div>

            {/* Step Indicator Nodes */}
            <div className="flex items-center gap-2 font-mono text-xs bg-[#07080c] p-3 rounded-lg border border-slate-800">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-display ${
                      step === s
                        ? 'bg-[#ff6b00] text-black shadow-[0_0_15px_rgba(255,107,0,0.6)]'
                        : step > s
                        ? 'bg-[#00ff66] text-black'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > s ? '✓' : `0${s}`}
                  </div>
                  {s < 3 && <div className="w-4 h-0.5 bg-slate-800" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 1: TEAM & LEADER INFO */}
        {step === 1 && (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hud-box bg-[#0e111a] space-y-6">
            <h3 className="text-lg font-bold font-display text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-5 h-5 text-[#00f0ff]" /> STEP 1: SQUAD DETAILS &amp; LEADER INFO
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
              <div>
                <label className="block text-slate-300 uppercase font-bold mb-1">TEAM NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. CYBER VOLT"
                  value={formData.teamName}
                  onChange={(e) => handleChangeForm('teamName', e.target.value)}
                  className={`w-full p-3.5 bg-[#07080c] border ${errors.teamName ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none font-sans text-sm`}
                />
                {errors.teamName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.teamName}</p>}
              </div>

              <div>
                <label className="block text-slate-300 uppercase font-bold mb-1">COLLEGE / INSTITUTE *</label>
                <input
                  type="text"
                  placeholder="e.g. Stanford Tech Institute"
                  value={formData.college}
                  onChange={(e) => handleChangeForm('college', e.target.value)}
                  className={`w-full p-3.5 bg-[#07080c] border ${errors.college ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none font-sans text-sm`}
                />
                {errors.college && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.college}</p>}
              </div>

              <div>
                <label className="block text-slate-300 uppercase font-bold mb-1">TEAM LEADER NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={formData.leaderName}
                  onChange={(e) => handleChangeForm('leaderName', e.target.value)}
                  className={`w-full p-3.5 bg-[#07080c] border ${errors.leaderName ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none font-sans text-sm`}
                />
                {errors.leaderName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.leaderName}</p>}
              </div>

              <div>
                <label className="block text-slate-300 uppercase font-bold mb-1">LEADER EMAIL ADDRESS *</label>
                <input
                  type="email"
                  placeholder="e.g. alex@college.edu"
                  value={formData.leaderEmail}
                  onChange={(e) => handleChangeForm('leaderEmail', e.target.value)}
                  className={`w-full p-3.5 bg-[#07080c] border ${errors.leaderEmail ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none font-sans text-sm`}
                />
                {errors.leaderEmail && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.leaderEmail}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-300 uppercase font-bold mb-1">LEADER PHONE NUMBER *</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 555-0192"
                  value={formData.leaderPhone}
                  onChange={(e) => handleChangeForm('leaderPhone', e.target.value)}
                  className={`w-full p-3.5 bg-[#07080c] border ${errors.leaderPhone ? 'border-red-500' : 'border-slate-800 focus:border-[#ff6b00]'} rounded text-white outline-none font-sans text-sm`}
                />
                {errors.leaderPhone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.leaderPhone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-mono text-xs uppercase font-bold mb-2">SELECT SQUAD SIZE:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      handleChangeForm('teamSize', size);
                    }}
                    className={`p-4 rounded border font-mono text-xs font-bold transition-all ${
                      formData.teamSize === size
                        ? 'bg-[#ff6b00] text-black border-[#ff6b00] shadow-[0_0_15px_rgba(255,107,0,0.4)]'
                        : 'bg-[#07080c] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {size} {size === 1 ? 'MEMBER' : 'MEMBERS'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleNextStep1}
                className="px-8 py-4 bg-[#ff6b00] hover:bg-[#ff851b] text-black font-display font-black text-xs uppercase tracking-wider rounded shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-all hover:scale-105"
              >
                [ PROCEED TO ROSTER CREDENTIALS &gt; ]
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PARTICIPANTS ROSTER */}
        {step === 2 && (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hud-box bg-[#0e111a] space-y-6">
            <h3 className="text-lg font-bold font-display text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#00f0ff]" /> STEP 2: PARTICIPANTS ROSTER CREDENTIALS ({formData.teamSize} MEMBERS)
            </h3>

            <div className="space-y-4 font-mono text-xs">
              {Array.from({ length: formData.teamSize }).map((_, idx) => {
                const isLeader = idx === 0;
                const p = participants[idx] || { name: '', email: '', phone: '', collegeId: '' };
                return (
                  <div key={idx} className={`p-5 rounded-xl border ${isLeader ? 'bg-[#00f0ff]/5 border-[#00f0ff]/40' : 'bg-[#07080c] border-slate-800'}`}>
                    <span className="font-bold text-white uppercase block mb-3 text-xs">
                      {isLeader ? 'PARTICIPANT 1 (TEAM LEADER) *' : `PARTICIPANT ${idx + 1}`}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1 text-[10px]">FULL NAME</label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={p.name}
                          onChange={(e) => handleChangeParticipant(idx, 'name', e.target.value)}
                          className="w-full p-3 bg-[#07080c] border border-slate-800 rounded text-white font-sans text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 text-[10px]">COLLEGE ID / ROLL NO</label>
                        <input
                          type="text"
                          placeholder="College ID / Roll No"
                          value={p.collegeId}
                          onChange={(e) => handleChangeParticipant(idx, 'collegeId', e.target.value)}
                          className="w-full p-3 bg-[#07080c] border border-slate-800 rounded text-white font-sans text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 text-[10px]">EMAIL ADDRESS</label>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={p.email}
                          onChange={(e) => handleChangeParticipant(idx, 'email', e.target.value)}
                          className="w-full p-3 bg-[#07080c] border border-slate-800 rounded text-white font-sans text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 text-[10px]">PHONE NUMBER</label>
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={p.phone}
                          onChange={(e) => handleChangeParticipant(idx, 'phone', e.target.value)}
                          className="w-full p-3 bg-[#07080c] border border-slate-800 rounded text-white font-sans text-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-[#07080c] border border-slate-700 text-slate-300 font-mono text-xs rounded hover:bg-slate-800"
              >
                &lt; BACK TO STEP 1
              </button>

              <button
                onClick={handleNextStep2}
                className="px-8 py-3.5 bg-[#00f0ff] hover:bg-[#5ce1e6] text-black font-display font-extrabold text-xs uppercase rounded shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                [ PROCEED TO CONFIRMATION &gt; ]
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION */}
        {step === 3 && (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 hud-box bg-[#0e111a] space-y-6">
            <h3 className="text-lg font-bold font-display text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#00ff66]" /> STEP 3: FINAL REVIEW &amp; REGISTRATION CONFIRMATION
            </h3>

            <div className="bg-[#07080c] p-6 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">TEAM NAME:</span>
                <span className="font-display font-bold text-white text-base text-[#00ff66]">{formData.teamName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">COLLEGE / INSTITUTE:</span>
                <span className="text-white font-bold">{formData.college}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">TEAM LEADER:</span>
                <span className="text-white font-bold">{formData.leaderName} ({formData.leaderEmail})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">SQUAD ALLOCATION:</span>
                <span className="text-[#00f0ff] font-bold">{formData.teamSize} MEMBERS | 2000 PTS BUDGET</span>
              </div>
            </div>

            <div className="p-5 bg-[#07080c] border border-slate-800 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    sound.playClick();
                    setAgreed(e.target.checked);
                    if (e.target.checked) setErrors({});
                  }}
                  className="mt-1 w-4 h-4 accent-[#00ff66]"
                />
                <span className="text-slate-200 text-xs font-mono leading-relaxed">
                  I agree to the official competition rules, component budget rules, safety guidelines, and jury decision matrix of CIRCUIT ARENA 2026.
                </span>
              </label>
              {errors.agreement && <p className="text-red-400 text-xs mt-2 flex items-center gap-1 font-mono"><AlertCircle className="w-3.5 h-3.5" /> {errors.agreement}</p>}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#07080c] border border-slate-700 text-slate-300 font-mono text-xs rounded"
              >
                &lt; BACK TO ROSTER
              </button>

              <button
                onClick={handleConfirmRegistration}
                disabled={isSubmitting}
                className="px-10 py-4 bg-gradient-to-r from-[#00ff66] to-[#00f0ff] text-black font-display font-black text-xs uppercase rounded shadow-[0_0_30px_rgba(0,255,102,0.5)] transition-all hover:scale-105"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> ENCRYPTING REGISTRATION...</span>
                ) : (
                  '## SUBMIT SQUAD REGISTRATION'
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS TICKET */}
        {step === 4 && createdTeam && (
          <div className="glass-panel p-10 rounded-2xl border-2 border-[#00ff66] hud-box bg-[#0e111a] text-center space-y-6 font-mono">
            <div className="w-16 h-16 bg-[#00ff66]/20 border-2 border-[#00ff66] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,102,0.5)]">
              <CheckCircle2 className="w-10 h-10 text-[#00ff66]" />
            </div>

            <h2 className="text-3xl font-black font-display text-white uppercase">
              SQUAD REGISTRATION <span className="text-[#00ff66] text-glow-green">CONFIRMED</span>
            </h2>

            <div className="p-6 bg-[#07080c] border border-[#ff6b00] rounded-xl text-left text-xs space-y-3 max-w-xl mx-auto">
              <p className="flex justify-between items-center border-b border-slate-800 pb-2">
                <strong className="text-slate-400">ASSIGNED TEAM ID:</strong>
                <span className="text-2xl font-bold font-display text-[#00f0ff]">{createdTeam.teamId}</span>
              </p>
              <p className="flex justify-between items-center border-b border-slate-800 pb-2">
                <strong className="text-slate-400">TEAM NAME:</strong>
                <span className="text-white font-bold">{createdTeam.teamName}</span>
              </p>
              <p className="flex justify-between items-center border-b border-slate-800 pb-2">
                <strong className="text-slate-400">COLLEGE / INSTITUTE:</strong>
                <span className="text-white">{createdTeam.college}</span>
              </p>
              <p className="flex justify-between items-center border-b border-slate-800 pb-2">
                <strong className="text-slate-400">TEAM LEADER:</strong>
                <span className="text-white">{createdTeam.leaderName}</span>
              </p>
              <p className="flex justify-between items-center">
                <strong className="text-slate-400">INITIAL BUDGET:</strong>
                <span className="text-[#00ff66] font-bold">2000 VIRTUAL PTS</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => handleDownloadTicket(createdTeam)}
                className="px-8 py-4 bg-[#0e111a] border-2 border-[#00f0ff] text-[#00f0ff] font-display font-bold text-xs uppercase rounded flex items-center justify-center gap-2 hover:bg-[#00f0ff]/10"
              >
                <Download className="w-4 h-4" /> [ DOWNLOAD OFFICIAL SQUAD TICKET ]
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onBackToHome();
                }}
                className="px-8 py-4 bg-[#ff6b00] text-black font-display font-black text-xs uppercase rounded shadow-[0_0_20px_rgba(255,107,0,0.5)]"
              >
                [ RETURN TO ARENA HOMEPAGE ]
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
