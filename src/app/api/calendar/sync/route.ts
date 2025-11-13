import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { google } from 'googleapis';
import { env, getUserProperty } from '@/lib/env';
import { supabaseAdmin } from '@/lib/supabase';
import { UserRow } from '@/types/database';
import { getUserCertifications } from '@/lib/certifications';

export async function POST() {
  try {
    const session = await getSession();
    const email = getUserProperty(session?.user, 'email') as string | undefined;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await supabaseAdmin.selectSingle<UserRow>('users', '*', {
      eq: { email },
      limit: 1,
    });

    if (!user?.google_calendar_tokens) {
      return NextResponse.json({ error: 'Calendar not connected' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials(JSON.parse(user.google_calendar_tokens));
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    let eventsCreated = 0;

    const certifications = await getUserCertifications(user.id);

    for (const cert of certifications) {
      if (!cert.expires_on) continue;

      const expirationDate = new Date(cert.expires_on);
      const reminderDate = new Date(expirationDate);
      reminderDate.setDate(reminderDate.getDate() - 30); // 30 days before

      try {
        await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: `${cert.certificate_name} - Renewal Reminder`,
            description: `Your ${cert.certificate_name} certification expires on ${expirationDate.toDateString()}. Start renewal process now.`,
            start: {
              date: reminderDate.toISOString().split('T')[0]
            },
            end: {
              date: reminderDate.toISOString().split('T')[0]
            },
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 24 * 60 }, // 1 day before
                { method: 'popup', minutes: 60 } // 1 hour before
              ]
            }
          }
        });
        eventsCreated++;
      } catch (error) {
        console.error(`Failed to create event for ${cert.title}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      eventsCreated,
      message: `Created ${eventsCreated} calendar reminders`
    });

  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json({ error: 'Failed to sync calendar' }, { status: 500 });
  }
}