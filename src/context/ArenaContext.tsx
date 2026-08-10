import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Team, TeamScore, Announcement } from '../types/arena';
import {
  getStoredTeams,
  saveStoredTeams,
  getStoredScores,
  saveStoredScores,
  getStoredAnnouncements,
  saveStoredAnnouncements,
  generateUniqueTeamId
} from '../utils/storage';

interface ArenaContextType {
  teams: Team[];
  scores: TeamScore[];
  announcements: Announcement[];
  isAdmin: boolean;
  adminModalOpen: boolean;
  registrationModalOpen: boolean;
  countdownTarget: string; // ISO date string
  registeredTeam: Team | null; // Currently submitted team in session
  arenaOpen: boolean;
  maxUnlockedStage: number;

  // Actions
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  openRegistrationModal: () => void;
  closeRegistrationModal: () => void;
  registerTeam: (teamData: Omit<Team, 'teamId' | 'status' | 'createdAt'>) => Team;
  updateTeamStatus: (teamId: string, status: Team['status']) => void;
  deleteTeam: (teamId: string) => void;
  updateScore: (score: TeamScore) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;
  setCountdownTarget: (dateStr: string) => void;
  setRegisteredTeam: (team: Team | null) => void;
  setArenaOpen: (open: boolean) => void;
  setMaxUnlockedStage: (stage: number) => void;
  resetArenaData: () => void;
}

const ArenaContext = createContext<ArenaContextType | undefined>(undefined);

export const ArenaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<TeamScore[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [registrationModalOpen, setRegistrationModalOpen] = useState<boolean>(false);
  const [countdownTarget, setTargetDate] = useState<string>('2026-09-15T10:00:00');
  const [registeredTeam, setRegisteredTeam] = useState<Team | null>(null);
  const [arenaOpen, setArenaOpenState] = useState<boolean>(() => {
    return localStorage.getItem('circuit_arena_open') === 'true';
  });
  const [maxUnlockedStage, setMaxUnlockedStageState] = useState<number>(() => {
    const val = localStorage.getItem('circuit_arena_max_stage');
    return val !== null ? parseInt(val, 10) : 0; // Default to Stage 0 unlocked when opened
  });

  useEffect(() => {
    setTeams(getStoredTeams());
    setScores(getStoredScores());
    setAnnouncements(getStoredAnnouncements());
  }, []);

  const loginAdmin = (pass: string): boolean => {
    if (pass === 'admin123' || pass === 'arena2026') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const openAdminModal = () => setAdminModalOpen(true);
  const closeAdminModal = () => setAdminModalOpen(false);

  const openRegistrationModal = () => setRegistrationModalOpen(true);
  const closeRegistrationModal = () => setRegistrationModalOpen(false);

  const registerTeam = (teamData: Omit<Team, 'teamId' | 'status' | 'createdAt'>): Team => {
    const newId = generateUniqueTeamId();
    const newTeam: Team = {
      ...teamData,
      teamId: newId,
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };

    const updatedTeams = [newTeam, ...teams];
    setTeams(updatedTeams);
    saveStoredTeams(updatedTeams);

    // Initialize score entry for the leaderboard
    const newScore: TeamScore = {
      teamId: newId,
      teamName: newTeam.teamName,
      budgetScore: 12,
      designScore: 20,
      technicalScore: 12,
      implementationScore: 24,
      troubleshootingScore: 12,
      totalScore: 80
    };
    const updatedScores = [...scores, newScore];
    setScores(updatedScores);
    saveStoredScores(updatedScores);

    setRegisteredTeam(newTeam);
    return newTeam;
  };

  const updateTeamStatus = (teamId: string, status: Team['status']) => {
    const updated = teams.map(t => t.teamId === teamId ? { ...t, status } : t);
    setTeams(updated);
    saveStoredTeams(updated);
  };

  const deleteTeam = (teamId: string) => {
    const updatedTeams = teams.filter(t => t.teamId !== teamId);
    setTeams(updatedTeams);
    saveStoredTeams(updatedTeams);

    const updatedScores = scores.filter(s => s.teamId !== teamId);
    setScores(updatedScores);
    saveStoredScores(updatedScores);
  };

  const updateScore = (score: TeamScore) => {
    const totalScore = Number((
      score.budgetScore +
      score.designScore +
      score.technicalScore +
      score.implementationScore +
      score.troubleshootingScore
    ).toFixed(1));

    const updatedScore = { ...score, totalScore };
    const exists = scores.some(s => s.teamId === score.teamId);
    
    let nextScores: TeamScore[];
    if (exists) {
      nextScores = scores.map(s => s.teamId === score.teamId ? updatedScore : s);
    } else {
      nextScores = [...scores, updatedScore];
    }
    
    setScores(nextScores);
    saveStoredScores(nextScores);
  };

  const addAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveStoredAnnouncements(updated);
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveStoredAnnouncements(updated);
  };

  const setCountdownTarget = (dateStr: string) => {
    setTargetDate(dateStr);
  };

  const setArenaOpen = (open: boolean) => {
    setArenaOpenState(open);
    localStorage.setItem('circuit_arena_open', open ? 'true' : 'false');
  };

  const setMaxUnlockedStage = (stage: number) => {
    setMaxUnlockedStageState(stage);
    localStorage.setItem('circuit_arena_max_stage', stage.toString());
  };

  const resetArenaData = () => {
    setTeams([]);
    setScores([]);
    setAnnouncements([]);
    setRegisteredTeam(null);
    localStorage.removeItem('circuit_arena_teams');
    localStorage.removeItem('circuit_arena_scores');
    localStorage.removeItem('circuit_arena_announcements');
  };

  return (
    <ArenaContext.Provider
      value={{
        teams,
        scores,
        announcements,
        isAdmin,
        adminModalOpen,
        registrationModalOpen,
        countdownTarget,
        registeredTeam,
        arenaOpen,
        maxUnlockedStage,
        loginAdmin,
        logoutAdmin,
        openAdminModal,
        closeAdminModal,
        openRegistrationModal,
        closeRegistrationModal,
        registerTeam,
        updateTeamStatus,
        deleteTeam,
        updateScore,
        addAnnouncement,
        deleteAnnouncement,
        setCountdownTarget,
        setRegisteredTeam,
        setArenaOpen,
        setMaxUnlockedStage,
        resetArenaData
      }}
    >
      {children}
    </ArenaContext.Provider>
  );
};

export const useArena = () => {
  const context = useContext(ArenaContext);
  if (!context) {
    throw new Error('useArena must be used within an ArenaProvider');
  }
  return context;
};
