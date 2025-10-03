import { NextRequest } from 'next/server';

// CSRF protection for state-changing operations
export async function validateCSRF(req: NextRequest): Promise<boolean> {
  // Skip CSRF for GET requests
  if (req.method === 'GET') return true;
  
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  
  // Validate origin/referer for same-origin policy
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.AUTH0_BASE_URL,
    'http://localhost:3000',
    'https://keepmycert.vercel.app'
  ].filter(Boolean);
  
  const isValidOrigin = origin && allowedOrigins.some(allowed => origin === allowed);
  const isValidReferer = referer && allowedOrigins.some(allowed => referer.startsWith(allowed));
  
  return Boolean(isValidOrigin || isValidReferer);
}

// Generate CSRF token for authenticated users
export async function generateCSRFToken(): Promise<string> {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64');
}