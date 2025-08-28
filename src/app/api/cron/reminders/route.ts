import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendReminderEmail, generateReminderHTML } from '@/lib/email';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  
  if (token !== process.env.CRON_TOKEN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, plan: true },
    });

    let emailsSent = 0;

    for (const user of users) {
      const certs = await prisma.certification.findMany({
        where: { 
          ownerUserId: user.id, 
          expiresOn: { not: null } 
        },
        select: { title: true, expiresOn: true }
      });

      const expiringCerts = certs
        .map(cert => {
          const daysUntil = Math.ceil(
            ((cert.expiresOn as Date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          return { ...cert, daysUntil };
        })
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
            expiresOn: cert.expiresOn as Date,
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