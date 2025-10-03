import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 60000; // 1 minute
let lastCleanup = Date.now();

// Rate limit tiers
export const RATE_LIMITS = {
  // Authentication endpoints
  AUTH: { limit: 5, window: 60000 }, // 5 per minute
  
  // Certificate operations
  CERT_CREATE: { limit: 10, window: 60000 }, // 10 per minute
  CERT_READ: { limit: 100, window: 60000 }, // 100 per minute
  CERT_UPDATE: { limit: 20, window: 60000 }, // 20 per minute
  CERT_DELETE: { limit: 10, window: 60000 }, // 10 per minute
  
  // Import operations (more restrictive)
  IMPORT_CSV: { limit: 5, window: 300000 }, // 5 per 5 minutes
  IMPORT_CREDLY: { limit: 10, window: 300000 }, // 10 per 5 minutes
  
  // Export operations
  EXPORT: { limit: 20, window: 60000 }, // 20 per minute
  
  // Career API
  CAREER: { limit: 50, window: 60000 }, // 50 per minute
  
  // General API
  GENERAL: { limit: 100, window: 60000 }, // 100 per minute
  
  // Strict for sensitive operations
  STRICT: { limit: 3, window: 60000 }, // 3 per minute
};

function getClientId(req: NextRequest): string {
  // Try multiple headers for IP detection
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnecting = req.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0].trim() || realIp || cfConnecting || 'unknown';
}

function cleanupOldEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
  lastCleanup = now;
}

export function rateLimit(
  req: NextRequest,
  limit: number = 10,
  windowMs: number = 60000,
  identifier?: string
) {
  cleanupOldEntries();
  
  const clientId = identifier || getClientId(req);
  const key = `${clientId}:${req.nextUrl.pathname}`;
  const now = Date.now();
  
  const current = rateLimitMap.get(key) || {
    count: 0,
    resetTime: now + windowMs,
    blocked: false
  };
  
  // Reset if window expired
  if (current.resetTime < now) {
    current.count = 1;
    current.resetTime = now + windowMs;
    current.blocked = false;
  } else {
    current.count++;
  }
  
  // Block if exceeded
  if (current.count > limit) {
    current.blocked = true;
  }
  
  rateLimitMap.set(key, current);
  
  const remaining = Math.max(0, limit - current.count);
  const retryAfter = Math.ceil((current.resetTime - now) / 1000);
  
  return {
    success: !current.blocked && current.count <= limit,
    remaining,
    resetTime: current.resetTime,
    retryAfter,
    limit,
    current: current.count
  };
}

// Helper for common rate limit patterns
export function applyRateLimit(
  req: NextRequest,
  type: keyof typeof RATE_LIMITS = 'GENERAL'
) {
  const config = RATE_LIMITS[type];
  return rateLimit(req, config.limit, config.window);
}