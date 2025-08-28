import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { hasFeature } from '@/lib/features';

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
      orderBy: { expiresOn: 'asc' },
      select: { 
        title: true, 
        issuer: true, 
        certificateNumber: true,
        acquiredOn: true, 
        expiresOn: true 
      }
    });

    const header = 'title,issuer,certificate_number,acquired_on,expires_on,days_until_expiry';
    const rows = certs.map(cert => {
      const daysUntilExpiry = cert.expiresOn 
        ? Math.ceil((cert.expiresOn.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : '';
      
      const formatDate = (date?: Date | null) => 
        date ? date.toISOString().slice(0, 10) : '';
      
      return [
        `"${cert.title}"`,
        `"${cert.issuer || ''}"`,
        `"${cert.certificateNumber || ''}"`,
        formatDate(cert.acquiredOn),
        formatDate(cert.expiresOn),
        daysUntilExpiry
      ].join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="certifications.csv"',
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to export CSV' },
      { status: 500 }
    );
  }
}