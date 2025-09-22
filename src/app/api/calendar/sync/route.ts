import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { google } from 'googleapis';
import { prisma } from '@/lib/db';
import { env, getUserProperty } from '@/lib/env';

export async function POST() {
  try {
    const session = await getSession();
    const email = getUserProperty(session?.user, 'email') as string | undefined;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { certifications: true }
    });
    
    if (!user?.googleCalendarTokens) {
      return NextResponse.json({ error: 'Calendar not connected' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials(JSON.parse(user.googleCalendarTokens));
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    let eventsCreated = 0;

    for (const cert of user.certifications) {
      if (!cert.expiresOn) continue;

      const expirationDate = new Date(cert.expiresOn);
      const reminderDate = new Date(expirationDate);
      reminderDate.setDate(reminderDate.getDate() - 30); // 30 days before

      try {
        await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: `${cert.title} - Renewal Reminder`,
            description: `Your ${cert.title} certification expires on ${expirationDate.toDateString()}. Start renewal process now.`,
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