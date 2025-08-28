import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { hasFeature } from '@/lib/features';
import { icsFromCerts } from '@/lib/ics';

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

    const certs = await prisma.certification.findMany({
      where: { ownerUserId: user.id },
      select: { id: true, title: true, expiresOn: true },
      orderBy: { expiresOn: 'asc' }
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