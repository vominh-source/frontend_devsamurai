import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { authAPI } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login({ email, password });
      console.log('📡 Login API response:', response);
      
      // Handle both old format (token) and new format (access_token + refresh_token)
      const accessToken = response.access_token || response.token;
      const refreshToken = response.refresh_token;
      
      console.log('🔑 Access token received:', accessToken);
      console.log('🔄 Refresh token received:', refreshToken);
      
      if (!accessToken) {
        throw new Error('No access token received from backend');
      }
      
      // Store tokens
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      // Keep backward compatibility
      localStorage.setItem('token', accessToken);
      
      // Since backend doesn't return user, we need to fetch it separately
      let user;
      try {
        user = await authAPI.getMe();
        console.log('👤 User data fetched:', user);
      } catch (userError) {
        // If we can't get user data, create a minimal user object
        console.warn('Could not fetch user data, creating minimal user object');
        user = {
          id: 'unknown',
          name: email.split('@')[0],
          email: email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      set({
        user,
        token: accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log('✅ Auth state updated successfully');
    } catch (error) {
      console.error('❌ Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.signup({ name, email, password });
      console.log('📡 Signup API response:', response);
      
      // Handle both old format (token) and new format (access_token + refresh_token)
      const accessToken = response.access_token || response.token;
      const refreshToken = response.refresh_token;
      
      if (!accessToken) {
        throw new Error('No access token received from backend');
      }
      
      // Store tokens
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      // Keep backward compatibility
      localStorage.setItem('token', accessToken);
      
      // Since backend doesn't return user, we need to fetch it separately
      let user;
      try {
        user = await authAPI.getMe();
        console.log('👤 User data fetched:', user);
      } catch (userError) {
        // If we can't get user data, create a minimal user object
        console.warn('Could not fetch user data, creating minimal user object');
        user = {
          id: 'unknown',
          name: name,
          email: email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      console.log('🔑 Access token received:', accessToken);
      console.log('🔄 Refresh token received:', refreshToken);
      
      set({
        user,
        token: accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('❌ Signup error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authAPI.getMe();
      const refreshToken = localStorage.getItem('refresh_token');
      set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  refreshAccessToken: async () => {
    try {
      const response = await authAPI.refreshToken();
      const { access_token, refresh_token } = response;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token', access_token); // Keep backward compatibility
      
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      
      set({
        token: access_token,
        refreshToken: refresh_token || get().refreshToken,
      });
      
      console.log('✅ Token refreshed successfully');
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // Clear all tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },
}));
