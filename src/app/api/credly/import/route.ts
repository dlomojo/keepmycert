import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';
import { getCertificationLimit } from '@/lib/feature-gates';
import { CredlyImportRequest, CredlyBadge, CredlyProfileResponse, CredlyFileData, ProcessedBadge } from '@/lib/types/credly';

export async function POST(req: Request) {
  try {
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

    const { method, data }: CredlyImportRequest = await req.json();
    
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

    for (const badge of badgesToImport) {
      try {
        const created = await prisma.certification.create({
          data: {
            title: badge.name,
            issuer: badge.issuer,
            acquiredOn: badge.issuedAt ? new Date(badge.issuedAt) : null,
            expiresOn: badge.expiresAt ? new Date(badge.expiresAt) : null,
            status: badge.expiresAt ? 
              (new Date(badge.expiresAt) < new Date() ? 'EXPIRED' : 
               (new Date(badge.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 90 ? 'EXPIRING_SOON' : 'ACTIVE') 
              : 'ACTIVE',
            ownerUserId: user.id,
          }
        });
        imported.push(created);
      } catch (error) {
        console.error('Failed to import badge:', badge, error);
      }
    }

    return NextResponse.json({ 
      imported: imported.length,
      total: badges.length,
      skipped: badges.length - badgesToImport.length
    });

  } catch (error) {
    console.error('Credly import error:', error);
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
      console.error('Failed to fetch badge:', link, error);
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
      console.error('Failed to parse badge data:', error);
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
    console.error('Failed to fetch profile:', profileUrl, error);
    return [];
  }
}