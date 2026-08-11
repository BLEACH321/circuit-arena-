import type { Team, TeamScore, Announcement } from '../types/arena';

const TEAMS_KEY = 'circuit_arena_teams';
const SCORES_KEY = 'circuit_arena_scores';
const ANNOUNCEMENTS_KEY = 'circuit_arena_announcements';

export const getStoredTeams = (): Team[] => {
  const data = localStorage.getItem(TEAMS_KEY);
  const defaultMock: Team[] = [
    {
      teamId: 'CA-2026-101',
      teamName: 'Demo Team',
      college: 'Demo University',
      leaderName: 'Demo User',
      leaderEmail: 'demo@demo.com',
      leaderPhone: '1234567890',
      teamSize: 1,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      participants: [
        { name: 'Demo User', email: 'demo@demo.com', phone: '1234567890', collegeId: 'ID-101', isLeader: true }
      ]
    }
  ];
  if (!data) {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(defaultMock));
    return defaultMock;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(defaultMock));
      return defaultMock;
    }
    return parsed;
  } catch {
    return defaultMock;
  }
};

export const saveStoredTeams = (teams: Team[]): void => {
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
};

export const getStoredScores = (): TeamScore[] => {
  const data = localStorage.getItem(SCORES_KEY);
  const defaultScores: TeamScore[] = [
    {
      teamId: 'CA-2026-101',
      teamName: 'Demo Team',
      auctionStrategy: 8,
      budgetManagement: 9,
      smartPurchasing: 7,
      circuitDesign: 16,
      innovation: 12,
      circuitImplementation: 15,
      technicalViva: 13,
      totalScore: 80
    }
  ];
  if (!data) {
    localStorage.setItem(SCORES_KEY, JSON.stringify(defaultScores));
    return defaultScores;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(SCORES_KEY, JSON.stringify(defaultScores));
      return defaultScores;
    }
    return parsed;
  } catch {
    return defaultScores;
  }
};

export const saveStoredScores = (scores: TeamScore[]): void => {
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
};

export const getStoredAnnouncements = (): Announcement[] => {
  const data = localStorage.getItem(ANNOUNCEMENTS_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.some(a => a.id === 'ann-1')) {
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify([]));
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
};

export const saveStoredAnnouncements = (announcements: Announcement[]): void => {
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
};

export const generateUniqueTeamId = (): string => {
  const teams = getStoredTeams();
  let maxIdNum = 0;
  teams.forEach(t => {
    const match = t.teamId.match(/CA-2026-(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxIdNum) maxIdNum = num;
    }
  });
  const nextNum = maxIdNum + 1;
  return `CA-2026-${nextNum.toString().padStart(3, '0')}`;
};

export const exportRegistrationsCSV = (teams: Team[]): void => {
  const headers = ['Team ID', 'Team Name', 'College', 'Status', 'Team Size', 'Leader Name', 'Leader Email', 'Leader Phone', 'Participants'];
  
  const rows = teams.map(t => [
    t.teamId,
    `"${t.teamName.replace(/"/g, '""')}"`,
    `"${t.college.replace(/"/g, '""')}"`,
    t.status,
    t.teamSize,
    `"${t.leaderName.replace(/"/g, '""')}"`,
    `"${t.leaderEmail.replace(/"/g, '""')}"`,
    `"${t.leaderPhone.replace(/"/g, '""')}"`,
    `"${t.participants.map(p => `${p.name} (${p.collegeId})`).join('; ')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `CIRCUIT_ARENA_REGISTRATIONS_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
