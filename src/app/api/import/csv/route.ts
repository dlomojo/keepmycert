import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getCertificationLimit } from '@/lib/feature-gates';
import { validateCSRF } from '@/lib/csrf';
import { sanitizeForLog } from '@/lib/security';
import { applyRateLimit } from '@/lib/rate-limit';
import { getOrCreateUser } from '@/lib/user-service';
import { countUserCertifications, createUserCertification } from '@/lib/certifications';

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

    const fullName = session.user?.name as string | undefined;
    const firstName = session.user?.given_name as string | undefined;
    const lastName = session.user?.family_name as string | undefined;

    const user = await getOrCreateUser(email, {
      name: fullName,
      firstName,
      lastName,
    });

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

    const currentCount = await countUserCertifications(user.id);
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

    const parseDate = (value: string | undefined) => {
      if (!value) return undefined;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? undefined : date;
    };

    for (const cert of certsToImport) {
      try {
        const name = cert.name || cert.title || cert.certificationname;
        if (!name) {
          continue;
        }

        const acquiredOn = parseDate(cert.issuedate);
        const expiresOn = parseDate(cert.expirationdate);

        const created = await createUserCertification(user.id, {
          certificateName: name,
          vendor: cert.vendor || cert.provider || null,
          certificateNumber: cert.certificationid || cert.id || null,
          acquiredOn,
          expiresOn,
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