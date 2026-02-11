export type UserRole = 'farmer' | 'admin' | 'auditor';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  phone?: string;
  isActive?: boolean;
}