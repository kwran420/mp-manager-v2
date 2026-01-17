import { create } from 'zustand';
import { mockMPs, MaintenancePeriod } from '@/lib/mockData';

interface MPStore {
  mps: MaintenancePeriod[];
  getMp: (id: string) => MaintenancePeriod | undefined;
  getMpsByShip: (shipId: string) => MaintenancePeriod[];
  addMp: (mp: MaintenancePeriod) => void;
  updateMp: (id: string, updates: Partial<MaintenancePeriod>) => void;
  deleteMp: (id: string) => void;
}

export const useMpStore = create<MPStore>((set, get) => ({
  mps: mockMPs,

  getMp: (id: string) => {
    return get().mps.find((mp) => mp.id === id);
  },

  getMpsByShip: (shipId: string) => {
    return get().mps.filter((mp) => mp.ship_id === shipId);
  },

  addMp: (mp: MaintenancePeriod) => {
    set((state) => ({
      mps: [...state.mps, mp],
    }));
  },

  updateMp: (id: string, updates: Partial<MaintenancePeriod>) => {
    set((state) => ({
      mps: state.mps.map((mp) => (mp.id === id ? { ...mp, ...updates } : mp)),
    }));
  },

  deleteMp: (id: string) => {
    set((state) => ({
      mps: state.mps.filter((mp) => mp.id !== id),
    }));
  },
}));
