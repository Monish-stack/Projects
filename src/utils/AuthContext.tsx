import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email?: string;
  phone?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  login: (method: 'google' | 'phone', identifier: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (method: 'google' | 'phone', identifier: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      name: method === 'google' ? identifier.split('@')[0] : 'User ' + identifier.slice(-4),
      email: method === 'google' ? identifier : undefined,
      phone: method === 'phone' ? identifier : undefined,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${identifier}`
    };

    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
