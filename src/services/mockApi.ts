// Mock API for testing without backend
import type { AuthResponse, LoginRequest, SignUpRequest, User } from '@/types/auth';

// Mock user database
const mockUsers: User[] = [
  // Sample user for testing
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-20T14:45:00.000Z',
  }
];
let currentUserId = 2;

export const mockAuthAPI = {
  signup: async (data: SignUpRequest): Promise<AuthResponse> => {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: currentUserId.toString(),
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    currentUserId++;

    // Return mock response
    return {
      user: newUser,
      token: `mock_token_${newUser.id}`,
    };
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Simple mock validation
    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
      throw new Error('User not found');
    }

    // Mock password check (in real app, this would be hashed)
    if (data.password.length < 6) {
      throw new Error('Invalid password');
    }

    return {
      user,
      token: `mock_token_${user.id}`,
    };
  },

  getMe: async (): Promise<User> => {
    // Extract user ID from token (mock)
    const token = localStorage.getItem('token');
    if (!token || !token.startsWith('mock_token_')) {
      throw new Error('Invalid token');
    }

    const userId = token.replace('mock_token_', '');
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
};
