export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  // Note: Backend doesn't return user object, we fetch it separately
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
