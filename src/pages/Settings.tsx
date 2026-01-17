import { useUIStore } from '@/stores/useUIStore';
import { Moon, Sun } from 'lucide-react';

export function Settings() {
  const { darkMode, toggleDarkMode } = useUIStore();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage application preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 max-w-2xl">
        {/* Appearance */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Toggle dark theme for the entire application
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 transform rounded-full bg-white shadow transition-transform ${
                    darkMode ? 'translate-x-7' : 'translate-x-0'
                  }`}
                >
                  {darkMode ? (
                    <Moon className="h-4 w-4 m-auto text-blue-600" />
                  ) : (
                    <Sun className="h-4 w-4 m-auto text-gray-400" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Data & Backup (Coming Soon) */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 opacity-50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Data & Backup
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Export and import data (coming in Phase 2)
          </p>
        </div>

        {/* About */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            About
          </h2>
          <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium text-gray-900 dark:text-white">
                MP Manager V2
              </span>
              <br />
              Naval maintenance period scheduling tool
            </p>
            <p>
              <span className="font-medium text-gray-900 dark:text-white">
                Version:
              </span>{' '}
              0.1.0
            </p>
            <p>
              <span className="font-medium text-gray-900 dark:text-white">
                Status:
              </span>{' '}
              Phase 1b - Core UI Shell
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
