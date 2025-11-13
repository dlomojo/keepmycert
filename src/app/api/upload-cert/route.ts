import { NextResponse } from 'next/server';
import { Buffer } from 'node:buffer';
import { getCurrentUser } from '@/lib/auth';
import { getCertificationLimit } from '@/lib/feature-gates';
import { countUserCertifications, createUserCertification, mapCertificationRow } from '@/lib/certifications';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';
import { parseCertificationFile } from '@/lib/certification-parser';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check plan limits
    const certCount = await countUserCertifications(user.id);
    
    const limit = getCertificationLimit(user.plan);
    if (certCount >= limit) {
      return NextResponse.json(
        { error: 'UPGRADE_REQUIRED', message: `${user.plan} plan allows maximum ${limit} certificates` },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string | null)?.trim() || null;
    const issuer = (formData.get('vendor') as string | null)?.trim() || null;
    const issueDate = (formData.get('issueDate') as string | null)?.trim() || null;
    const expiryDate = (formData.get('expiryDate') as string | null)?.trim() || null;
    const certificateNumber = (formData.get('certificateNumber') as string | null)?.trim() || null;

    if (!file && !title) {
      return NextResponse.json(
        { error: 'A certificate file or title is required.' },
        { status: 400 }
      );
    }

    let parsedVendor: string | null = null;
    let parsedName: string | null = null;
    let parsedAcquired: Date | null = null;
    let parsedExpires: Date | null = null;
    let parsedCertificateNumber: string | null = null;
    let storagePath: string | null = null;

    if (file) {
      const parsed = await parseCertificationFile(file);
      parsedVendor = parsed.vendor;
      parsedName = parsed.certificateName;
      parsedAcquired = parsed.acquiredOn;
      parsedExpires = parsed.expiresOn;
      parsedCertificateNumber = parsed.certificateNumber;

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/\s+/g, '-');
      const path = `${user.id}/${Date.now()}-${safeName}`;
      await supabaseAdmin.uploadStorage(
        env.SUPABASE_STORAGE_BUCKET,
        path,
        buffer,
        file.type || 'application/octet-stream',
        true
      );
      storagePath = path;
    }

    const acquiredCandidate = issueDate ? new Date(issueDate) : parsedAcquired;
    const expiresCandidate = expiryDate ? new Date(expiryDate) : parsedExpires;
    const acquiredOn = acquiredCandidate && !Number.isNaN(acquiredCandidate.getTime()) ? acquiredCandidate : null;
    const expiresOn = expiresCandidate && !Number.isNaN(expiresCandidate.getTime()) ? expiresCandidate : null;
    const certificateName = title || parsedName;
    const vendor = issuer || parsedVendor;
    const certNumber = certificateNumber || parsedCertificateNumber;

    if (!certificateName) {
      return NextResponse.json(
        { error: 'Unable to determine certificate name from the upload.' },
        { status: 400 }
      );
    }

    const certification = await createUserCertification(user.id, {
      certificateName,
      vendor,
      certificateNumber: certNumber || undefined,
      acquiredOn: acquiredOn ?? undefined,
      expiresOn: expiresOn ?? undefined,
      storagePath: storagePath ?? undefined,
      parsedVendor,
      parsedCertificateName: parsedName,
    });

    return NextResponse.json({
      success: true,
      certification: mapCertificationRow(certification),
    });

  } catch (error) {
    console.error('Certificate upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}