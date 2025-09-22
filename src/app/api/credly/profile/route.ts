import { NextRequest, NextResponse } from "next/server";
import { getSession } from '@auth0/nextjs-auth0';

interface CredlyBadge {
  id?: string;
  badge_template?: {
    id?: string;
    name?: string;
    image_url?: string;
    issuer?: { name?: string };
  };
  name?: string;
  issued_at?: string;
  issuedOn?: string;
  expired_at?: string;
  expires?: string;
  image_url?: string;
  issuer?: { name?: string };
  badge_url?: string;
  evidence?: string;
  url?: string;
}

function extractUserId(url: string) {
  const m = url.match(/users\/([^\/?#]+)/i);
  return m?.[1];
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { profileUrl } = await req.json();
  if (!profileUrl) return NextResponse.json({ error: "missing_profile_url" }, { status: 400 });

  const userId = extractUserId(profileUrl);
  if (!userId) return NextResponse.json({ error: "unable_to_parse_user" }, { status: 422 });

  try {
    const apiUrl = `https://www.credly.com/api/v1/users/${userId}/badges?page=1&page_size=100`;
    const r = await fetch(apiUrl, { 
      headers: { "User-Agent": "KeepMyCertBot/1.0" },
      next: { revalidate: 3600 }
    });
    
    if (!r.ok) return NextResponse.json({ error: "credly_fetch_failed" }, { status: 502 });

    const json = await r.json();
    const badges = (json?.data || json?.badges || json).map((b: CredlyBadge) => ({
      id: b.id || b.badge_template?.id,
      name: b.badge_template?.name || b.name,
      issuedOn: b.issued_at || b.issuedOn,
      expires: b.expired_at || b.expires,
      image: b.image_url || b.badge_template?.image_url,
      issuer: b.issuer?.name || b.badge_template?.issuer?.name,
      assertionUrl: b.badge_url || b.evidence || b.url
    }));

    return NextResponse.json({ source: "credly_profile", count: badges.length, badges });
  } catch {
    return NextResponse.json({ error: "credly_fetch_failed" }, { status: 502 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const profileUrl = searchParams.get('profileUrl');
  
  if (!profileUrl) return NextResponse.json({ error: "missing_profile_url" }, { status: 400 });

  const userId = extractUserId(profileUrl);
  if (!userId) return NextResponse.json({ error: "unable_to_parse_user" }, { status: 422 });

  try {
    const apiUrl = `https://www.credly.com/api/v1/users/${userId}/badges?page=1&page_size=100`;
    const r = await fetch(apiUrl, { 
      headers: { "User-Agent": "KeepMyCertBot/1.0" },
      next: { revalidate: 3600 }
    });
    
    if (!r.ok) return NextResponse.json({ error: "credly_fetch_failed" }, { status: 502 });

    const json = await r.json();
    const badges = (json?.data || json?.badges || json).map((b: CredlyBadge) => ({
      id: b.id || b.badge_template?.id,
      name: b.badge_template?.name || b.name,
      issuedOn: b.issued_at || b.issuedOn,
      expires: b.expired_at || b.expires,
      image: b.image_url || b.badge_template?.image_url,
      issuer: b.issuer?.name || b.badge_template?.issuer?.name,
      assertionUrl: b.badge_url || b.evidence || b.url
    }));

    return NextResponse.json({ source: "credly_profile", count: badges.length, badges });
  } catch {
    return NextResponse.json({ error: "credly_fetch_failed" }, { status: 502 });
  }
}