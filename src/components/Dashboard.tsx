import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BathroomBreakManager } from './BathroomBreakManager';
import { ClassManager } from './ClassManager';
import { ThemeCustomizer } from './ThemeCustomizer';
import { UserManager } from './UserManager';
import { LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showThemeCustomizer, setShowThemeCustomizer] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor }}>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Gestione Uscite Bagno
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
                className="p-2 rounded-full hover:bg-gray-100"
                style={{ color: theme.primaryColor }}
              >
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
                  {user?.role === 'admin' ? 'Amministratore' : 
                   user?.role === 'teacher' ? 'Docente' : 'Staff'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Esci
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {user?.role === 'admin' && (
            <>
              <UserManager />
              <ClassManager />
            </>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <BathroomBreakManager />
            </div>
            {showThemeCustomizer && (
              <div className="lg:col-span-1">
                <ThemeCustomizer />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}