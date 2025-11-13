import { NextResponse } from 'next/server';
import { sendReminderEmail, generateReminderHTML } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase';
import { UserRow, UserCertificationRow } from '@/types/database';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  
  if (token !== process.env.CRON_TOKEN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await supabaseAdmin.select<UserRow>('users', 'id,email,name,plan');

    let emailsSent = 0;

    for (const user of users) {
      const certRows = await supabaseAdmin.select<UserCertificationRow>('user_certifications', 'certificate_name,expires_on', {
        eq: { user_id: user.id },
        is: { expires_on: 'not.is.null' },
      });

      const expiringCerts = certRows
        .map(cert => {
          const expiresOn = cert.expires_on ? new Date(cert.expires_on) : null;
          if (!expiresOn) return null;
          const daysUntil = Math.ceil((expiresOn.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return { title: cert.certificate_name, expiresOn, daysUntil };
        })
        .filter((cert): cert is { title: string; expiresOn: Date; daysUntil: number } => cert !== null)
        .filter(cert => {
          // Free: remind at 30 & 7 days
          // Pro/Team: remind at 30, 14, 7, 1 days
          const reminderDays = user.plan === 'FREE' ? [30, 7] : [30, 14, 7, 1];
          return reminderDays.includes(cert.daysUntil);
        });

      if (expiringCerts.length > 0) {
        const html = generateReminderHTML(
          user.name || user.email.split('@')[0],
          expiringCerts.map(cert => ({
            title: cert.title,
            expiresOn: cert.expiresOn,
            daysUntil: cert.daysUntil
          }))
        );

        await sendReminderEmail(
          user.email,
          'Certification Expiration Reminder',
          html
        );
        
        emailsSent++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      emailsSent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron reminder error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}