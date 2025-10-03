import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';
import { getCertificationLimit } from '@/lib/feature-gates';
import { validateCSRF } from '@/lib/csrf';
import { sanitizeForLog } from '@/lib/security';
import { applyRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const rateLimitResult = applyRateLimit(req as NextRequest, 'IMPORT_CSV');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
        { 
          status: 429, 
          headers: { 
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
          } 
        }
      );
    }
    
    // CSRF protection
    const isValidCSRF = await validateCSRF(req as NextRequest);
    if (!isValidCSRF) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 403 });
    }
    
    const session = await getSession();
    const email = session?.user?.email;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const fullName = session.user?.name || '';
      user = await prisma.user.create({
        data: {
          email,
          name: fullName || email.split('@')[0],
          plan: 'FREE'
        }
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const required = ['name', 'vendor', 'issuedate', 'expirationdate'];
    const missing = required.filter(col => !headers.includes(col));
    if (missing.length > 0) {
      return NextResponse.json({ 
        error: `Missing required columns: ${missing.join(', ')}` 
      }, { status: 400 });
    }

    const certData = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const cert: Record<string, string> = {};
      headers.forEach((header, index) => {
        cert[header] = values[index] || '';
      });
      return cert;
    });

    const currentCount = await prisma.certification.count({ 
      where: { ownerUserId: user.id } 
    });
    const limit = getCertificationLimit(user.plan as 'FREE' | 'PRO' | 'TEAM');
    const availableSlots = limit - currentCount;
    
    if (availableSlots <= 0) {
      return NextResponse.json({
        error: 'UPGRADE_REQUIRED',
        message: `${user.plan} plan limit reached.`
      }, { status: 403 });
    }

    const certsToImport = certData.slice(0, availableSlots);
    const imported = [];

    for (const cert of certsToImport) {
      try {
        const created = await prisma.certification.create({
          data: {
            title: cert.name,
            issuer: cert.vendor,
            certificateNumber: cert.certificationid || null,
            acquiredOn: cert.issuedate ? new Date(cert.issuedate) : null,
            expiresOn: cert.expirationdate ? new Date(cert.expirationdate) : null,
            status: cert.expirationdate ? 
              (new Date(cert.expirationdate) < new Date() ? 'EXPIRED' : 
               (new Date(cert.expirationdate).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 90 ? 'EXPIRING_SOON' : 'ACTIVE') 
              : 'ACTIVE',
            ownerUserId: user.id,
          }
        });
        imported.push(created);
      } catch (error) {
        console.error('Failed to import cert:', sanitizeForLog(cert.name), error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return NextResponse.json({ 
      imported: imported.length,
      total: certData.length,
      skipped: certData.length - certsToImport.length
    });

  } catch (error) {
    console.error('CSV import error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}