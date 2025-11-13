import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getCertificationLimit } from '@/lib/feature-gates';
import { CredlyImportRequest, CredlyBadge, CredlyProfileResponse, CredlyFileData, ProcessedBadge } from '@/lib/types/credly';
import { sanitizeForLog } from '@/lib/security';
import { validateCSRF } from '@/lib/csrf';
import { applyRateLimit } from '@/lib/rate-limit';
import { getOrCreateUser } from '@/lib/user-service';
import { countUserCertifications, createUserCertification } from '@/lib/certifications';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const rateLimitResult = applyRateLimit(req as NextRequest, 'IMPORT_CREDLY');
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

    const { method, data }: CredlyImportRequest = await req.json();
    
    const currentCount = await countUserCertifications(user.id);
    const limit = getCertificationLimit(user.plan as 'FREE' | 'PRO' | 'TEAM');
    const availableSlots = limit - currentCount;
    
    if (availableSlots <= 0) {
      return NextResponse.json({
        error: 'UPGRADE_REQUIRED',
        message: `${user.plan} plan limit reached.`
      }, { status: 403 });
    }

    let badges: ProcessedBadge[] = [];
    
    if (method === 'badge_links' && data.links) {
      badges = await processBadgeLinks(data.links);
    } else if (method === 'badge_files' && data.files) {
      badges = await processBadgeFiles(data.files);
    } else if (method === 'profile_url' && data.profileUrl) {
      badges = await processProfileUrl(data.profileUrl);
    }

    const badgesToImport = badges.slice(0, availableSlots);
    const imported = [];

    const parseDate = (value: string | null) => {
      if (!value) return undefined;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? undefined : date;
    };

    for (const badge of badgesToImport) {
      try {
        const created = await createUserCertification(user.id, {
          certificateName: badge.name,
          vendor: badge.issuer,
          acquiredOn: parseDate(badge.issuedAt),
          expiresOn: parseDate(badge.expiresAt),
        });
        imported.push(created);
      } catch (error) {
        console.error('Failed to import badge:', sanitizeForLog(badge.name), error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return NextResponse.json({ 
      imported: imported.length,
      total: badges.length,
      skipped: badges.length - badgesToImport.length
    });

  } catch (error) {
    console.error('Credly import error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}

async function processBadgeLinks(links: string[]): Promise<ProcessedBadge[]> {
  const badges: ProcessedBadge[] = [];
  
  for (const link of links) {
    try {
      const badgeId = link.match(/badges\/([^/?]+)/)?.[1];
      if (!badgeId) continue;
      
      const response = await fetch(`https://www.credly.com/badges/${badgeId}.json`);
      if (response.ok) {
        const badgeData: CredlyBadge = await response.json();
        badges.push({
          name: badgeData.badge_template?.name || badgeData.name || 'Unknown Badge',
          issuer: badgeData.badge_template?.issuer?.name || badgeData.issuer?.name || 'Unknown Issuer',
          issuedAt: badgeData.issued_at || null,
          expiresAt: badgeData.expires_at || null
        });
      }
    } catch (error) {
      console.error('Failed to fetch badge:', sanitizeForLog(link), error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  return badges;
}

async function processBadgeFiles(fileData: CredlyFileData[]): Promise<ProcessedBadge[]> {
  const badges: ProcessedBadge[] = [];
  
  for (const data of fileData) {
    try {
      badges.push({
        name: data.badge?.name || data.name || 'Unknown Badge',
        issuer: data.badge?.issuer?.name || data.issuer?.name || 'Unknown Issuer',
        issuedAt: data.issuedOn || data.issued_at || null,
        expiresAt: data.expires || data.expires_at || null
      });
    } catch (error) {
      console.error('Failed to parse badge data:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  return badges;
}

async function processProfileUrl(profileUrl: string): Promise<ProcessedBadge[]> {
  try {
    const username = profileUrl.match(/users\/([^/?]+)/)?.[1];
    if (!username) return [];
    
    const response = await fetch(`https://www.credly.com/users/${username}/badges.json`);
    if (!response.ok) return [];
    
    const data: CredlyProfileResponse = await response.json();
    const badges = data.data || data.badges || [];
    
    return badges.map((badge: CredlyBadge): ProcessedBadge => ({
      name: badge.badge_template?.name || badge.name || 'Unknown Badge',
      issuer: badge.badge_template?.issuer?.name || badge.issuer?.name || 'Unknown Issuer',
      issuedAt: badge.issued_at || null,
      expiresAt: badge.expires_at || null
    }));
  } catch (error) {
    console.error('Failed to fetch profile:', sanitizeForLog(profileUrl), error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}