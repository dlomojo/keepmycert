import { NextRequest, NextResponse } from "next/server";
import { sanitizeString, sanitizeUrl } from '@/lib/security';

interface NewsArticle {
  title: string;
  source?: { name?: string } | string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  description: string;
}

const FIELD_QUERIES: Record<string, string> = {
  security: '(cybersecurity OR "security operations" OR soc) -sports',
  cloud: '(aws OR azure OR gcp OR kubernetes) -weather',
  networking: '(cisco OR juniper OR "sd-wan" OR bgp OR ospf)',
  devops: '(devops OR ci/cd OR terraform OR github actions)',
  data: '(data engineering OR spark OR databricks OR "power bi")'
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const field = (searchParams.get("field") || "security").toLowerCase();
  
  // Return empty array if no API key
  if (!process.env.NEWSAPI_KEY) {
    return NextResponse.json({ field, items: [] });
  }

  const q = FIELD_QUERIES[field] ?? FIELD_QUERIES.security;
  const pageSize = 12;
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&pageSize=${pageSize}&sortBy=publishedAt`;
  
  const headers = { "X-Api-Key": process.env.NEWSAPI_KEY };

  try {
    const r = await fetch(url, { headers, next: { revalidate: 1800 } }); // 30 min
    if (!r.ok) return NextResponse.json({ field, items: [] });

    const json = await r.json();
    const items = (json.articles || []).map((a: NewsArticle) => ({
      title: sanitizeString(a.title),
      source: typeof a.source === 'object' ? sanitizeString(a.source?.name) : sanitizeString(a.source),
      url: sanitizeUrl(a.url),
      image: sanitizeUrl(a.urlToImage),
      publishedAt: a.publishedAt,
      description: sanitizeString(a.description)
    }));

    return NextResponse.json({ field, items });
  } catch {
    return NextResponse.json({ field, items: [] });
  }
}