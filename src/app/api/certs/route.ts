import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession } from '@auth0/nextjs-auth0';
import { getCertificationLimit } from '@/lib/feature-gates';
import { rateLimit } from '@/lib/rate-limit';
import { getUserProperty } from '@/lib/env';

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
    const rateLimitResult = rateLimit(req as NextRequest, 5, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
    
    const session = await getSession();
    const email = getUserProperty(session?.user, 'email') as string | undefined;
    
    if (!email || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const fullName = getUserProperty(session.user, 'name') as string || '';
      const firstName = getUserProperty(session.user, 'given_name') as string || fullName.split(' ')[0] || '';
      const lastName = getUserProperty(session.user, 'family_name') as string || fullName.split(' ').slice(1).join(' ') || '';
      
      user = await prisma.user.create({
        data: {
          email,
          name: fullName || email.split('@')[0],
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          plan: 'FREE'
        }
      });
    }
    
    const body = await req.json();
    const data = CreateCert.parse(body);

    const count = await prisma.certification.count({ 
      where: { ownerUserId: user.id } 
    });
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

    const cert = await prisma.certification.create({
      data: {
        title: data.title,
        issuer: data.issuer || null,
        certificateNumber: data.certificateNumber || null,
        acquiredOn: data.acquiredOn ? new Date(data.acquiredOn) : null,
        expiresOn: data.expiresOn ? new Date(data.expiresOn) : null,
        status: data.expiresOn ? 
          (new Date(data.expiresOn) < new Date() ? 'EXPIRED' : 
           (new Date(data.expiresOn).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 90 ? 'EXPIRING_SOON' : 'ACTIVE') 
          : 'ACTIVE',
        ownerUserId: user.id,
      }
    });

    return NextResponse.json({ cert }, { status: 201 });
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

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const fullName = getUserProperty(session.user, 'name') as string || '';
      const firstName = getUserProperty(session.user, 'given_name') as string || fullName.split(' ')[0] || '';
      const lastName = getUserProperty(session.user, 'family_name') as string || fullName.split(' ').slice(1).join(' ') || '';
      
      user = await prisma.user.create({
        data: {
          email,
          name: fullName || email.split('@')[0],
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          plan: 'FREE'
        }
      });
    }
    
    const certs = await prisma.certification.findMany({
      where: { ownerUserId: user.id },
      orderBy: [{ expiresOn: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ certifications: certs });
  } catch (error) {
    console.error('Get certs error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}