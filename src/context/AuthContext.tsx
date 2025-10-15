import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'project_manager' | 'team_member';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Demo users with roles
  const demoUsers = [
    { 
      email: 'admin@collabtrack.com', 
      password: 'password123', 
      user: { 
        id: '1', 
        name: 'Admin User', 
        email: 'admin@collabtrack.com', 
        role: 'admin' as const
      } 
    },
    { 
      email: 'pm@collabtrack.com', 
      password: 'password123', 
      user: { 
        id: '2', 
        name: 'Project Manager', 
        email: 'pm@collabtrack.com', 
        role: 'project_manager' as const
      } 
    },
    { 
      email: 'member@collabtrack.com', 
      password: 'password123', 
      user: { 
        id: '3', 
        name: 'Team Member', 
        email: 'member@collabtrack.com', 
        role: 'team_member' as const
      } 
    }
  ];

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = demoUsers.find(u => u.email === email && u.password === password);
      
      if (userData) {
        setUser(userData.user);
        localStorage.setItem('user', JSON.stringify(userData.user));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};