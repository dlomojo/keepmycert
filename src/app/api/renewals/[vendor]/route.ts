import { NextRequest, NextResponse } from "next/server";
import { VENDORS } from "@/lib/vendors";

export async function GET(_: NextRequest, context: { params: Promise<{ vendor: string }> }) {
  const params = await context.params;
  const v = VENDORS[params.vendor as keyof typeof VENDORS];
  if (!v) return NextResponse.json({ error: "unknown_vendor" }, { status: 404 });

  return NextResponse.json({
    vendor: v.name,
    verifiedAt: new Date().toISOString(),
    canonicalUrl: v.url,
    steps: v.steps
  });
}