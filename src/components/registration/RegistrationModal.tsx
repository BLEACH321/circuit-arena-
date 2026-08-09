import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useArena } from '../../context/ArenaContext';
import type { Participant, Team } from '../../types/arena';
import { Step1TeamInfo } from './Step1TeamInfo';
import { Step2Participants } from './Step2Participants';
import { Step3Confirmation } from './Step3Confirmation';
import { SuccessScreen } from './SuccessScreen';
import { sound } from '../../utils/sound';

export const RegistrationModal: React.FC = () => {
  const { registrationModalOpen, closeRegistrationModal, registerTeam, teams } = useArena();

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

  if (!registrationModalOpen) return null;

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

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.teamName.trim()) errs.teamName = 'Team name is required.';
    if (!formData.college.trim()) errs.college = 'College/Institute is required.';
    if (!formData.leaderName.trim()) errs.leaderName = 'Team leader name is required.';
    if (!formData.leaderEmail.trim()) errs.leaderEmail = 'Leader email is required.';
    else if (!validateEmail(formData.leaderEmail)) errs.leaderEmail = 'Invalid email syntax.';
    if (!formData.leaderPhone.trim()) errs.leaderPhone = 'Leader phone number is required.';

    const exists = teams.some(t => t.teamName.toLowerCase().trim() === formData.teamName.toLowerCase().trim());
    if (exists) errs.teamName = 'Team name already registered in Circuit Arena!';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};

    for (let i = 0; i < formData.teamSize; i++) {
      const p = participants[i];
      if (i === 0) {
        if (!p.name.trim()) errs[`p_${i}_name`] = 'Leader name is required.';
        if (!p.email.trim()) errs[`p_${i}_email`] = 'Leader email is required.';
        else if (!validateEmail(p.email)) errs[`p_${i}_email`] = 'Invalid email syntax.';
        if (!p.phone.trim()) errs[`p_${i}_phone`] = 'Leader phone is required.';
        if (!p.collegeId.trim()) errs[`p_${i}_collegeId`] = 'College ID is required.';
      } else {
        if (p.email && !validateEmail(p.email)) {
          errs[`p_${i}_email`] = 'Invalid email syntax.';
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextFrom1 = () => {
    sound.playClick();
    if (validateStep1()) setStep(2);
  };

  const handleNextFrom2 = () => {
    sound.playClick();
    if (validateStep2()) setStep(3);
  };

  const handleConfirmSubmit = () => {
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
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 scanline-overlay">
      <div className="w-full max-w-2xl bg-[#0e111a] border-2 border-[#ff6b00] rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto hud-box shadow-[0_0_50px_rgba(255,107,0,0.3)]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b00] animate-ping" />
            <h2 className="font-display font-extrabold text-xl text-white tracking-wider">
              CIRCUIT ARENA REGISTRATION
            </h2>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              closeRegistrationModal();
            }}
            className="p-1.5 bg-[#07080c] border border-slate-700 hover:border-[#ff6b00] rounded text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Wizard Steps */}
        {step === 1 && (
          <Step1TeamInfo
            formData={formData}
            errors={errors}
            onChange={handleChangeForm}
            onNext={handleNextFrom1}
          />
        )}

        {step === 2 && (
          <Step2Participants
            teamSize={formData.teamSize}
            participants={participants}
            errors={errors}
            onChangeParticipant={handleChangeParticipant}
            onPrev={() => setStep(1)}
            onNext={handleNextFrom2}
          />
        )}

        {step === 3 && (
          <Step3Confirmation
            formData={formData}
            isSubmitting={isSubmitting}
            onPrev={() => setStep(2)}
            onConfirm={handleConfirmSubmit}
          />
        )}

        {step === 4 && createdTeam && (
          <SuccessScreen
            team={createdTeam}
            onClose={closeRegistrationModal}
          />
        )}

      </div>
    </div>
  );
};
