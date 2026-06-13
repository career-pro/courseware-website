import { RedeemCode, Course } from '@/types';

let mockCodes: Record<string, RedeemCode> = {};
let mockCourses: Course[] = [];

const isLocal = !process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL;

export const kv = {
  async get<T>(key: string): Promise<T | null> {
    if (isLocal) {
      if (key.startsWith('code:')) {
        return mockCodes[key] as T;
      }
      if (key === 'courses') {
        return mockCourses as T;
      }
      return null;
    }
    const { kv } = await import('@vercel/kv');
    return await kv.get<T>(key);
  },

  async set(key: string, value: any): Promise<void> {
    if (isLocal) {
      if (key.startsWith('code:')) {
        mockCodes[key] = value;
      }
      if (key === 'courses') {
        mockCourses = value;
      }
      return;
    }
    const { kv } = await import('@vercel/kv');
    await kv.set(key, value);
  },

  async del(key: string): Promise<void> {
    if (isLocal) {
      if (key.startsWith('code:')) {
        delete mockCodes[key];
      }
      return;
    }
    const { kv } = await import('@vercel/kv');
    await kv.del(key);
  },

  async keys(pattern: string): Promise<string[]> {
    if (isLocal) {
      return Object.keys(mockCodes);
    }
    const { kv } = await import('@vercel/kv');
    return await kv.keys(pattern);
  },
};