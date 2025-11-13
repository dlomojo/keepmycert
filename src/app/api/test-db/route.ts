import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';

export async function GET() {
  try {
    const userCount = await supabaseAdmin.count('users');
    const certCount = await supabaseAdmin.count('user_certifications');

    return NextResponse.json({
      status: 'Connected',
      userCount,
      certCount,
      project: env.SUPABASE_URL,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Error',
      error: String(error),
      project: env.SUPABASE_URL,
    }, { status: 500 });
  }
}