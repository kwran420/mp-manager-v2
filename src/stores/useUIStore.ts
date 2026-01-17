import { create } from 'zustand';

interface UIStore {
  darkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// Restore preferences from localStorage on init
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('darkMode');
  if (stored !== null) {
    const isDark = stored === 'true';
    // Sync DOM class on init
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return isDark;
  }
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
  }
  return prefersDark;
};

const getInitialSidebarOpen = (): boolean => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('sidebarOpen');
  return stored !== null ? stored === 'true' : true;
};

export const useUIStore = create<UIStore>((set) => ({
  darkMode: getInitialDarkMode(),
  sidebarOpen: getInitialSidebarOpen(),

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
