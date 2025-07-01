'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient, { AdminProfile, AdminLoginRequest } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  admin: AdminProfile | null;
  loading: boolean;
  login: (credentials: AdminLoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if we have tokens
      if (!apiClient.isAuthenticated()) {
        setLoading(false);
        return;
      }

      // Try to get cached profile first
      const cachedProfile = apiClient.getCachedProfile();
      if (cachedProfile) {
        setAdmin(cachedProfile);
        setIsAuthenticated(true);
      }

      // Refresh profile from server
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setAdmin(response.data);
        setIsAuthenticated(true);
      } else {
        // Token might be expired, clear auth
        await logout();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: AdminLoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const response = await apiClient.login(credentials);
      
      if (response.success) {
        // Get profile after successful login
        const profileResponse = await apiClient.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setAdmin(profileResponse.data);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, error: 'Failed to get user profile' };
        }
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setAdmin(response.data);
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.is_super_admin) return true;
    return admin.permissions?.[permission] === true;
  };

  const isSuperAdmin = (): boolean => {
    return admin?.is_super_admin === true;
  };

  const value: AuthContextType = {
    isAuthenticated,
    admin,
    loading,
    login,
    logout,
    refreshProfile,
    hasPermission,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;