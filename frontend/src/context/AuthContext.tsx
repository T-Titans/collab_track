import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, storeAuthData, clearAuthData, getStoredUser, getStoredToken, User } from '../lib/auth';

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

  useEffect(() => {
    // On mount, try to restore auth from localStorage and validate token
    (async () => {
      const storedUser = getStoredUser();
      const token = getStoredToken();

      if (storedUser && token) {
        // restore axios header and validate token by fetching profile
        storeAuthData(storedUser, token);
        try {
          const res = await authAPI.getProfile();
          setUser(res.user || storedUser);
        } catch (err) {
          // invalid/expired token
          clearAuthData();
          setUser(null);
        }
      }

      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login(email, password);
      storeAuthData(res.user, res.accessToken);
      setUser(res.user);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
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