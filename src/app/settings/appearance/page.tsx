"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTheme } from '@/lib/theme/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function AppearanceSettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Appearance Settings</h1>
      <div className="rounded-lg border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
