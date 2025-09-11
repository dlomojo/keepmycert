import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test basic connection
    await prisma.$connect();
    
    // Test user table access
    const userCount = await prisma.user.count();
    
    // Test certification table access  
    const certCount = await prisma.certification.count();
    
    return NextResponse.json({ 
      status: 'Connected',
      userCount,
      certCount,
      database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'Error',
      error: String(error),
      database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
    }, { status: 500 });
  }
}