import { NextResponse } from 'next/server';
import { Buffer } from 'node:buffer';
import { google } from 'googleapis';
import { env } from '@/lib/env';
import { getOrCreateUser, updateUserById } from '@/lib/user-service';
import { UserRow } from '@/types/database';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://keepmycert.vercel.app';

export async function GET(req: Request) {
  try {
    // Check if Google Calendar is configured
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REDIRECT_URI) {
      console.error('Google Calendar not configured. Missing environment variables.');
      return NextResponse.redirect(`${BASE_URL}/dashboard?error=calendar_not_configured`);
    }
    
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!code || !state) {
      return NextResponse.redirect(`${BASE_URL}/dashboard?error=calendar_auth_failed`);
    }
    
    // Decode secure state token
    let email: string;
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      email = stateData.email;
      
      // Validate timestamp (token should be used within 10 minutes)
      if (Date.now() - stateData.timestamp > 10 * 60 * 1000) {
        return NextResponse.redirect(`${BASE_URL}/dashboard?error=calendar_auth_expired`);
      }
    } catch {
      return NextResponse.redirect(`${BASE_URL}/dashboard?error=calendar_auth_invalid`);
    }

    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in database
    const user = await getOrCreateUser(email);

    await updateUserById(user.id, {
      google_calendar_tokens: JSON.stringify(tokens),
      calendar_sync_enabled: true,
    } as Partial<UserRow>);

    return NextResponse.redirect(`${BASE_URL}/dashboard?success=calendar_connected`);
  } catch (error) {
    console.error('Calendar callback error:', error instanceof Error ? error.message : 'Unknown error');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(`${BASE_URL}/dashboard?error=calendar_auth_failed&details=${encodeURIComponent(errorMessage)}`);
  }
}