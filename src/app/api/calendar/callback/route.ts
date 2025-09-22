import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!code || !state) {
      return NextResponse.redirect('/dashboard?error=calendar_auth_failed');
    }
    
    // Decode secure state token
    let email: string;
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      email = stateData.email;
      
      // Validate timestamp (token should be used within 10 minutes)
      if (Date.now() - stateData.timestamp > 10 * 60 * 1000) {
        return NextResponse.redirect('/dashboard?error=calendar_auth_expired');
      }
    } catch {
      return NextResponse.redirect('/dashboard?error=calendar_auth_invalid');
    }

    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in database
    await prisma.user.update({
      where: { email },
      data: {
        googleCalendarTokens: JSON.stringify(tokens),
        calendarSyncEnabled: true
      }
    });

    return NextResponse.redirect('/dashboard?success=calendar_connected');
  } catch (error) {
    console.error('Calendar callback error:', error);
    return NextResponse.redirect('/dashboard?error=calendar_auth_failed');
  }
}