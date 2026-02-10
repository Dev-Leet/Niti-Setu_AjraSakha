export type UserRole = 'farmer' | 'admin' | 'auditor';

export interface UserDocument {
  _id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}