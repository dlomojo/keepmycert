import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { hasFeature } from '@/lib/features';
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
        title: row.certificate_name,
        issuer: row.vendor,
        certificateNumber: row.certificate_number,
        acquiredOn: row.acquired_on ? new Date(row.acquired_on) : null,
        expiresOn: row.expires_on ? new Date(row.expires_on) : null,
      }))
      .sort((a, b) => {
        if (!a.expiresOn) return 1;
        if (!b.expiresOn) return -1;
        return a.expiresOn.getTime() - b.expiresOn.getTime();
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