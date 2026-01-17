import { create } from 'zustand';
import { mockTeams, Team } from '@/lib/mockData';

interface TeamStore {
  teams: Team[];
  getTeam: (id: string) => Team | undefined;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: mockTeams,

  getTeam: (id: string) => {
    return get().teams.find((t) => t.id === id);
  },

  addTeam: (team: Team) => {
    set((state) => ({
      teams: [...state.teams, team],
    }));
  },

  updateTeam: (id: string, updates: Partial<Team>) => {
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTeam: (id: string) => {
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
    }));
  },
}));
