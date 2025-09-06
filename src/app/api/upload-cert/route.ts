import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCertificationLimit } from '@/lib/feature-gates';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check plan limits
    const certCount = await prisma.certification.count({
      where: { ownerUserId: user.id }
    });
    
    const limit = getCertificationLimit(user.plan);
    if (certCount >= limit) {
      return NextResponse.json(
        { error: 'UPGRADE_REQUIRED', message: `${user.plan} plan allows maximum ${limit} certificates` },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const issuer = formData.get('vendor') as string;
    const issueDate = formData.get('issueDate') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const certificateNumber = formData.get('certificateNumber') as string;

    if (!title || !issuer || !issueDate || !expiryDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate status based on expiry date
    const expiryDateTime = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON' = 'ACTIVE';
    if (daysUntilExpiry < 0) {
      status = 'EXPIRED';
    } else if (daysUntilExpiry <= 90) {
      status = 'EXPIRING_SOON';
    }

    const certification = await prisma.certification.create({
      data: {
        title,
        issuer,
        acquiredOn: new Date(issueDate),
        expiresOn: expiryDateTime,
        certificateNumber: certificateNumber || null,
        status,
        ownerUserId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      certification: {
        id: certification.id,
        title: certification.title,
        issuer: certification.issuer,
        status: certification.status,
        expiresOn: certification.expiresOn
      }
    });

  } catch (error) {
    console.error('Certificate upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}