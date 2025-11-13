import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@auth0/nextjs-auth0';
import { getCertificationLimit } from '@/lib/feature-gates';
import { applyRateLimit } from '@/lib/rate-limit';
import { getUserProperty } from '@/lib/env';
import { validateCSRF } from '@/lib/csrf';
import { countUserCertifications, createUserCertification, getUserCertifications, mapCertificationRow } from '@/lib/certifications';
import { getOrCreateUser } from '@/lib/user-service';

export const runtime = 'nodejs';

const CreateCert = z.object({
  title: z.string().min(2).max(200).trim(),
  issuer: z.string().min(1).max(200).trim().optional(),
  certificateNumber: z.string().max(100).trim().optional(),
  acquiredOn: z.string().datetime().optional(),
  expiresOn: z.string().datetime().optional(),
});

export async function POST(req: Request) {
  try {
    // CSRF protection
    const isValidCSRF = await validateCSRF(req as NextRequest);
    if (!isValidCSRF) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 403 });
    }
    
    const rateLimitResult = applyRateLimit(req as NextRequest, 'CERT_CREATE');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
        { 
          status: 429, 
          headers: { 
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          } 
        }
      );
    }
    
    const session = await getSession();
    const email = getUserProperty(session?.user, 'email') as string | undefined;
    
    if (!email || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fullName = getUserProperty(session.user, 'name') as string | undefined;
    const firstName = getUserProperty(session.user, 'given_name') as string | undefined;
    const lastName = getUserProperty(session.user, 'family_name') as string | undefined;

    const user = await getOrCreateUser(email, {
      name: fullName,
      firstName,
      lastName,
    });
    
    const body = await req.json();
    const data = CreateCert.parse(body);

    const count = await countUserCertifications(user.id);
    const limit = getCertificationLimit(user.plan as 'FREE' | 'PRO' | 'TEAM');
    if (count >= limit) {
      return NextResponse.json(
        {
          error: 'UPGRADE_REQUIRED',
          message: `${user.plan} plan allows up to ${limit} certifications.`
        },
        { status: 403 }
      );
    }

    const expiresOn = data.expiresOn ? new Date(data.expiresOn) : null;
    const acquiredOn = data.acquiredOn ? new Date(data.acquiredOn) : null;

    const created = await createUserCertification(user.id, {
      certificateName: data.title,
      vendor: data.issuer,
      certificateNumber: data.certificateNumber,
      acquiredOn,
      expiresOn,
    });

    return NextResponse.json({ cert: mapCertificationRow(created) }, { status: 201 });
  } catch (error) {
    console.error('Create cert error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to create certification' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    const email = getUserProperty(session?.user, 'email') as string | undefined;
    
    if (!email || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fullName = getUserProperty(session.user, 'name') as string | undefined;
    const firstName = getUserProperty(session.user, 'given_name') as string | undefined;
    const lastName = getUserProperty(session.user, 'family_name') as string | undefined;

    const user = await getOrCreateUser(email, {
      name: fullName,
      firstName,
      lastName,
    });

    const certs = await getUserCertifications(user.id);

    return NextResponse.json({ certifications: certs.map(mapCertificationRow) });
  } catch (error) {
    console.error('Get certs error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}