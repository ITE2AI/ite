import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NewUser } from '../types';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  addUser: (newUser: NewUser) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  {
    id: '1',
    email: 'preside@scuola.it',
    name: 'Dirigente Scolastico',
    role: 'admin',
    password: 'Preside2024!'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Credenziali non valide');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addUser = (newUser: NewUser) => {
    const userExists = users.some(u => u.email === newUser.email);
    if (userExists) {
      throw new Error('Un utente con questa email esiste già');
    }

    const user: User = {
      ...newUser,
      id: Date.now().toString()
    };

    setUsers([...users, user]);
  };

  const deleteUser = (userId: string) => {
    if (userId === '1') {
      throw new Error('Non è possibile eliminare l\'account amministratore');
    }
    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout, 
      isAuthenticated: !!user,
      addUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}