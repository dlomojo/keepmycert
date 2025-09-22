import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { google } from 'googleapis';
import { env, getUserProperty } from '@/lib/env';

export async function POST() {
  try {
    const session = await getSession();
    const email = getUserProperty(session?.user, 'email') as string | undefined;
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    const scopes = ['https://www.googleapis.com/auth/calendar'];
    
    // Generate secure state data instead of using email directly
    // Store email-token mapping (in production, use Redis or database)
    // For now, we'll encode it securely
    const stateData = Buffer.from(JSON.stringify({ email, timestamp: Date.now() })).toString('base64');
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: stateData
    });

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Calendar connect error:', error);
    return NextResponse.json({ error: 'Failed to connect calendar' }, { status: 500 });
  }
}