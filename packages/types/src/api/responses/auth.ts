export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: string;
    phone?: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface MeResponse {
  user: {
    id: string;
    email: string;
    role: string;
    phone?: string;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
  };
}