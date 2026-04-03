import Redis from 'ioredis';

export default function initRedis() {
  // Check if Redis environment variables are configured
  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    // console.warn('⚠️  Redis environment variables not configured. Redis features will be disabled.');
    // Return a mock Redis client that doesn't crash the app
    return {
      get: async () => null,
      set: async () => 'OK',
      del: async () => 1,
      on: () => { },
      quit: async () => { },
    };
  }

  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    lazyConnect: true, // Don't connect immediately
  });

  redis.on('connect', () => {
    // console.log('✅ Redis connected globally');
  });

  redis.on('error', (err) => {
    // console.error('❌ Redis connection error:', err.message);
    // Don't crash the app on Redis errors
  });

  // Try to connect, but don't block if it fails
  redis.connect().catch(err => {
    // console.error('❌ Redis initial connection failed:', err.message);
  });

  return redis;
}
