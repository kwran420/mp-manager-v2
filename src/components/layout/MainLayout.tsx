import { ReactNode, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/stores/useUIStore';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { darkMode } = useUIStore();

  // Initialize dark mode from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedSidebarOpen = localStorage.getItem('sidebarOpen') !== 'false';

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Initialize sidebar state (default: open on desktop, closed on mobile)
    if (window.innerWidth < 768) {
      useUIStore.setState({ sidebarOpen: false });
    }
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
