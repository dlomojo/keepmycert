import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { hasFeature } from '@/lib/features';
import { icsFromCerts } from '@/lib/ics';
import { getUserCertifications } from '@/lib/certifications';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireUser();
    
    if (!hasFeature(user.plan, 'EXPORT')) {
      return NextResponse.json(
        { error: 'UPGRADE_REQUIRED', message: 'Export feature requires Pro or Team plan' },
        { status: 403 }
      );
    }

    const certRows = await getUserCertifications(user.id);
    const certs = certRows
      .map(row => ({
        id: row.id,
        title: row.certificate_name,
        expiresOn: row.expires_on ? new Date(row.expires_on) : null,
      }))
      .sort((a, b) => {
        if (!a.expiresOn) return 1;
        if (!b.expiresOn) return -1;
        return a.expiresOn.getTime() - b.expiresOn.getTime();
      });

    const icsContent = icsFromCerts({ 
      certs, 
      timezone: user.timezone || 'UTC' 
    });

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="certifications.ics"',
      },
    });
  } catch (error) {
    console.error('ICS export error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to export calendar' },
      { status: 500 }
    );
  }
}