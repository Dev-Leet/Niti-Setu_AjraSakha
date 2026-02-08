export interface DashboardStats {
  totalChecks: number;
  savedSchemes: number;
  profileComplete: boolean;
  lastCheckDate?: string;
}

export interface CheckHistoryItem {
  checkId: string;
  createdAt: string;
  totalEligible: number;
  totalSchemes: number;
}