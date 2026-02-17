export const networkDetection = {
  isSlowConnection(): boolean {
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    if (!connection) return false;
    return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  },

  getConnectionSpeed(): 'fast' | 'medium' | 'slow' {
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    if (!connection) return 'medium';

    switch (connection.effectiveType) {
      case '4g':
        return 'fast';
      case '3g':
        return 'medium';
      default:
        return 'slow';
    }
  },

  shouldLoadHighQuality(): boolean {
    return this.getConnectionSpeed() === 'fast';
  },
};