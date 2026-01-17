import { create } from 'zustand';
import { mockShips, Ship } from '@/lib/mockData';

interface ShipStore {
  ships: Ship[];
  getShip: (id: string) => Ship | undefined;
  addShip: (ship: Ship) => void;
  updateShip: (id: string, updates: Partial<Ship>) => void;
  deleteShip: (id: string) => void;
}

export const useShipStore = create<ShipStore>((set, get) => ({
  ships: mockShips,

  getShip: (id: string) => {
    return get().ships.find((s) => s.id === id);
  },

  addShip: (ship: Ship) => {
    set((state) => ({
      ships: [...state.ships, ship],
    }));
  },

  updateShip: (id: string, updates: Partial<Ship>) => {
    set((state) => ({
      ships: state.ships.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  deleteShip: (id: string) => {
    set((state) => ({
      ships: state.ships.filter((s) => s.id !== id),
    }));
  },
}));
