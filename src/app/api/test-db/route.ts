import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    auth0Config: {
      baseUrl: process.env.AUTH0_BASE_URL,
      issuerUrl: process.env.AUTH0_ISSUER_BASE_URL,
      clientId: process.env.AUTH0_CLIENT_ID,
      hasSecret: !!process.env.AUTH0_SECRET,
      hasClientSecret: !!process.env.AUTH0_CLIENT_SECRET
    },
    database: {
      hasUrl: !!process.env.DATABASE_URL
    }
  });
}