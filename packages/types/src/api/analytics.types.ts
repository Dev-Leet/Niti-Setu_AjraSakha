import { EventType, UserStats, SystemStats } from '../domain/analytics.types.js';

export interface TrackEventRequest {
  eventType: EventType;
  metadata?: Record<string, any>;
}

export interface UserStatsResponse {
  stats: UserStats;
}

export interface SystemStatsResponse {
  stats: SystemStats;
} 