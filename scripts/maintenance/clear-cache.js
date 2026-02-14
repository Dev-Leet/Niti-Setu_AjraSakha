const Redis = require('ioredis');

async function clearCache() {
  const redis = new Redis(process.env.REDIS_URL);
  
  const keys = await redis.keys('*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
  
  console.log(`✓ Cleared ${keys.length} cache keys`);
  await redis.quit();
}

clearCache().catch(console.error);