import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserPlus, Trash2, Shield } from 'lucide-react';
import type { NewUser } from '../types';

export function UserManager() {
  const { users, addUser, deleteUser } = useAuth();
  const { theme } = useTheme();
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    name: '',
    role: 'teacher',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      addUser(newUser);
      setNewUser({ email: '', name: '', role: 'teacher', password: '' });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = (userId: string) => {
    try {
      deleteUser(userId);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5" style={{ color: theme.primaryColor }} />
            <h2 className="text-lg font-semibold">Gestione Utenti</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
                required
              />
              
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Nome e Cognome"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
                required
              />
              
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'teacher' | 'staff' })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
              >
                <option value="teacher">Docente</option>
                <option value="staff">Collaboratore Scolastico</option>
              </select>
              
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Password"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': theme.primaryColor } as React.CSSProperties}
                required
              />
            </div>
            
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Aggiungi Utente
            </button>
          </form>
        </div>

        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruolo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}>
                      {user.role === 'admin' ? 'Amministratore' : 
                       user.role === 'teacher' ? 'Docente' : 'Staff'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}