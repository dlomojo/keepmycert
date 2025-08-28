import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { getCertLimit } from '@/lib/features';

export const runtime = 'nodejs';

const CreateCert = z.object({
  title: z.string().min(2),
  issuer: z.string().optional(),
  certificateNumber: z.string().optional(),
  acquiredOn: z.string().optional(), // ISO date
  expiresOn: z.string().optional(),  // ISO date
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = CreateCert.parse(body);

    // Enforce Free plan limit
    if (user.plan === 'FREE') {
      const count = await prisma.certification.count({ 
        where: { ownerUserId: user.id } 
      });
      if (count >= getCertLimit(user.plan)) {
        return NextResponse.json(
          { 
            error: 'UPGRADE_REQUIRED', 
            message: 'Free plan allows up to 3 certifications.' 
          },
          { status: 403 }
        );
      }
    }

    const cert = await prisma.certification.create({
      data: {
        title: data.title,
        issuer: data.issuer,
        certificateNumber: data.certificateNumber,
        acquiredOn: data.acquiredOn ? new Date(data.acquiredOn) : undefined,
        expiresOn: data.expiresOn ? new Date(data.expiresOn) : undefined,
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
    const user = await requireUser();
    
    const certs = await prisma.certification.findMany({
      where: { ownerUserId: user.id },
      orderBy: [{ expiresOn: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ certs });
  } catch (error) {
    console.error('Get certs error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}