export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
} 
 
export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  data: T[];
  next: string | null;
  previous: string | null;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}