import Dexie, { Table } from 'dexie';

interface CachedScheme<T = unknown> {
  id: string;
  data: T;
  timestamp: number;
}

interface CachedProfile<T = unknown> {
  userId: string;
  data: T;
  timestamp: number;
}

class AppDatabase extends Dexie {
  schemes!: Table<CachedScheme, string>;
  profiles!: Table<CachedProfile, string>;

  constructor() {
    super('AgriSchemesDB');
    this.version(1).stores({
      schemes: 'id, timestamp',
      profiles: 'userId, timestamp',
    });
  }
}

const db = new AppDatabase();

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

export const storageService = {
  async cacheScheme<T>(id: string, data: T): Promise<void> {
    await db.schemes.put({
      id,
      data,
      timestamp: Date.now(),
    });
  },

  async getCachedScheme<T>(id: string): Promise<T | null> {
    const cached = await db.schemes.get(id);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      await db.schemes.delete(id);
      return null;
    }

    return cached.data as T;
  },

  async cacheProfile<T>(userId: string, data: T): Promise<void> {
    await db.profiles.put({
      userId,
      data,
      timestamp: Date.now(),
    });
  },

  async getCachedProfile<T>(userId: string): Promise<T | null> {
    const cached = await db.profiles.get(userId);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      await db.profiles.delete(userId);
      return null;
    }

    return cached.data as T;
  },

  async clearCache(): Promise<void> {
    await db.schemes.clear();
    await db.profiles.clear();
  },

  async clearExpiredCache(): Promise<void> {
    const now = Date.now();
    const expiredSchemes = await db.schemes
      .filter((scheme) => now - scheme.timestamp > CACHE_DURATION)
      .toArray();
    const expiredProfiles = await db.profiles
      .filter((profile) => now - profile.timestamp > CACHE_DURATION)
      .toArray();

    await Promise.all([
      ...expiredSchemes.map((s) => db.schemes.delete(s.id)),
      ...expiredProfiles.map((p) => db.profiles.delete(p.userId)),
    ]);
  },
};