import { Response } from 'express';

export const responseOptimizer = {
  sendOptimized(res: Response, data: unknown, fieldsToRemove: string[] = []): void {
    let optimized = data;

    if (Array.isArray(data)) {
      optimized = data.map(item => this.removeFields(item, fieldsToRemove));
    } else if (typeof data === 'object' && data !== null) {
      optimized = this.removeFields(data as Record<string, unknown>, fieldsToRemove);
    }

    res.json(optimized);
  },

  removeFields(obj: Record<string, unknown>, fields: string[]): Record<string, unknown> {
    const cleaned = { ...obj };
    fields.forEach(field => delete cleaned[field]);
    return cleaned;
  },

  paginateResults<T>(
    data: T[],
    page: number,
    limit: number
  ): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit),
      },
    };
  },
};