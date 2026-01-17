import { create } from 'zustand';

interface UIStore {
  darkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  darkMode: false,
  sidebarOpen: true,

  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.darkMode;
      // Sync with DOM
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Persist to localStorage
      localStorage.setItem('darkMode', String(newMode));
      return { darkMode: newMode };
    });
  },

  toggleSidebar: () => {
    set((state) => {
      const newState = !state.sidebarOpen;
      localStorage.setItem('sidebarOpen', String(newState));
      return { sidebarOpen: newState };
    });
  },

  setSidebarOpen: (open: boolean) => {
    set(() => {
      localStorage.setItem('sidebarOpen', String(open));
      return { sidebarOpen: open };
    });
  },
}));
