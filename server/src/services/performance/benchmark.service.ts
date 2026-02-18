import { logger } from '@utils/logger.js';
import { redisClient } from '@config/redis.js';
 
interface BenchmarkEntry {
  operation: string;
  durationMs: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export const benchmarkService = {
  async record(entry: BenchmarkEntry): Promise<void> {
    try {
      const key = `benchmark:${entry.operation}`;
      //const _existing = await Benchmark.findOne({ operation });
      await redisClient.lPush(key, JSON.stringify(entry));
      await redisClient.lTrim(key, 0, 99);
      await redisClient.expire(key, 86400);
    } catch {
      // non-critical
    }
  },

  async getStats(operation: string): Promise<{
    avgMs: number;
    minMs: number;
    maxMs: number;
    p95Ms: number;
    count: number;
  }> {
    try {
      const key = `benchmark:${operation}`;
      const entries = await redisClient.lRange(key, 0, -1);
      const durations = entries
        .map(e => (JSON.parse(e) as BenchmarkEntry).durationMs)
        .sort((a, b) => a - b);

      if (durations.length === 0) return { avgMs: 0, minMs: 0, maxMs: 0, p95Ms: 0, count: 0 };

      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const p95Idx = Math.floor(durations.length * 0.95);

      return {
        avgMs: Math.round(avg),
        minMs: durations[0],
        maxMs: durations[durations.length - 1],
        p95Ms: durations[p95Idx] || durations[durations.length - 1],
        count: durations.length,
      };
    } catch {
      return { avgMs: 0, minMs: 0, maxMs: 0, p95Ms: 0, count: 0 };
    }
  },

  async getAllStats(): Promise<Record<string, ReturnType<typeof this.getStats> extends Promise<infer T> ? T : never>> {
    const operations = ['eligibility_check', 'pdf_ingest', 'embedding', 'llama_inference'];
    const result: Record<string, Awaited<ReturnType<typeof this.getStats>>> = {};

    for (const op of operations) {
      result[op] = await this.getStats(op);
    }

    return result;
  },

  timer(operation: string, metadata?: Record<string, unknown>) {
    const start = Date.now();
    return {
      end: async () => {
        const durationMs = Date.now() - start;
        await benchmarkService.record({ operation, durationMs, timestamp: start, metadata });

        if (durationMs > 10000) {
          logger.warn(`SLOW: ${operation} took ${durationMs}ms`);
        }

        return durationMs;
      },
    };
  },
};