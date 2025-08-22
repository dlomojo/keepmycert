/**
 * Auth middleware for protecting routes and checking subscription status
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getActiveSubscriptionById } from '../db/queries';
import { SubscriptionPlan } from './types';

// Secret key for JWT verification
function getJWTSecret(): Uint8Array {
  const secret = process.env.AUTH0_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

const JWT_SECRET = getJWTSecret();

// Auth middleware configuration
export interface AuthMiddlewareConfig {
  requireAuth?: boolean;
  requirePro?: boolean;
  requireTeam?: boolean;
  requireAdmin?: boolean;
}

/**
 * Auth middleware for route protection
 * @param req Next.js request
 * @param config Auth middleware configuration
 */
export async function authMiddleware(
  req: NextRequest,
  config: AuthMiddlewareConfig = { requireAuth: true }
) {
  // Get URL paths and origin
  const { pathname } = req.nextUrl;
  const origin = req.headers.get('origin') || req.nextUrl.origin;
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/callback',
    '/api/auth/callback',
    '/pricing',
    '/contact',
    '/about',
    '/blog',
    '/legal/privacy',
    '/legal/terms'
  ];
  
  // API paths that don't require authentication
  const publicApiPaths = [
    '/api/health',
    '/api/webhook/stripe',
    '/api/auth/callback'
  ];
  
  // Allow public paths without authentication
  if (
    publicPaths.includes(pathname) ||
    publicApiPaths.some(path => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Get session token from cookies
  const sessionToken = cookies().get('session')?.value;
  
  // No session token, redirect to login
  if (!sessionToken && config.requireAuth) {
    const loginUrl = new URL('/auth/login', origin);
    // Sanitize pathname to prevent XSS
    const sanitizedPathname = pathname.replace(/[<>"'&]/g, '');
    loginUrl.searchParams.set('returnTo', sanitizedPathname);
    return NextResponse.redirect(loginUrl);
  }
  
  try {
    // Verify JWT token
    const { payload } = await jwtVerify(sessionToken!, JWT_SECRET);
    const userId = payload.sub as string;
    
    // Check subscription if pro or team access required
    if (config.requirePro || config.requireTeam) {
      const subscription = await getActiveSubscriptionById(userId);
      
      // No active subscription
      if (!subscription) {
        return NextResponse.redirect(new URL('/pricing', origin));
      }
      
      // Check if subscription plan meets requirements
      const { plan } = subscription;
      
      if (
        (config.requirePro && plan !== 'pro' && plan !== 'team') ||
        (config.requireTeam && plan !== 'team')
      ) {
        return NextResponse.redirect(new URL('/pricing', origin));
      }
    }
    
    // Check admin role if required
    if (config.requireAdmin && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', origin));
    }
    
    // Authenticated and authorized, proceed
    return NextResponse.next();
  } catch (error) {
    // Invalid session token
    console.error('Auth middleware error:', error);
    
    if (config.requireAuth) {
      const loginUrl = new URL('/auth/login', origin);
      // Sanitize pathname to prevent XSS
      const sanitizedPathname = pathname.replace(/[<>"'&]/g, '');
      loginUrl.searchParams.set('returnTo', sanitizedPathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }
}

/**
 * Middleware for Next.js Edge Runtime
 * @param req Next.js request
 */
export function middleware(req: NextRequest) {
  // Default middleware configuration
  const config: AuthMiddlewareConfig = {
    requireAuth: true
  };
  
  // Pro features pages
  const proFeaturesPaths = [
    '/dashboard/analytics',
    '/dashboard/export',
    '/dashboard/ai'
  ];
  
  // Team features pages
  const teamFeaturesPaths = [
    '/dashboard/team',
    '/dashboard/organization'
  ];
  
  // Admin pages
  const adminPaths = [
    '/admin'
  ];
  
  // Check path and set appropriate config
  if (proFeaturesPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    config.requirePro = true;
  }
  
  if (teamFeaturesPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    config.requireTeam = true;
  }
  
  if (adminPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    config.requireAdmin = true;
  }
  
  return authMiddleware(req, config);
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/auth (Auth0 authentication routes)
     * 2. /api/webhook (Webhook routes that don't require authentication)
     * 3. /_next (Next.js internal paths)
     * 4. /favicon.ico (Browser favicon request)
     * 5. /static (Static files)
     */
    '/((?!api/auth|api/webhook|_next|favicon.ico|static).*)',
  ],
};