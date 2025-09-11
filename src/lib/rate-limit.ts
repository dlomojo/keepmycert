import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(req: NextRequest, limit: number = 10, windowMs: number = 60000) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }
  
  const current = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
  
  if (current.resetTime < now) {
    current.count = 1;
    current.resetTime = now + windowMs;
  } else {
    current.count++;
  }
  
  rateLimitMap.set(ip, current);
  
  return {
    success: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    resetTime: current.resetTime
  };
}