export interface IUser {
  _id: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'farmer' | 'admin' | 'auditor';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}