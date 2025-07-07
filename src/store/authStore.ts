import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { authAPI } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login({ email, password });
      console.log('📡 Login API response:', response);
      
      // Handle both 'token' and 'access_token' from backend
      const token = response.token || response.access_token;
      
      console.log('🔑 Token received from backend:', token);
      
      if (!token) {
        throw new Error('No token received from backend');
      }
      
      // If backend doesn't return user object, create one from email
      const user = response.user || {
        id: 'temp_id',
        name: email.split('@')[0],
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('👤 User data:', user);
      
      localStorage.setItem('token', token);
      set({
        user,
        token,
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
      
      // Handle both 'token' and 'access_token' from backend
      const token = response.token || response.access_token;
      
      if (!token) {
        throw new Error('No token received from backend');
      }
      
      // Create user object from the data we have
      const user = response.user || {
        id: 'temp_id',
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('🔑 Token received:', token);
      console.log('👤 User created:', user);
      
      localStorage.setItem('token', token);
      set({
        user,
        token,
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
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authAPI.getMe();
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
