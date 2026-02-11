export const helpers = {
  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
  },

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
};