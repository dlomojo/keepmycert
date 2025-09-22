import { NextRequest, NextResponse } from 'next/server';
import { CareerDB } from '@/lib/career-db';

export async function GET() {
  try {
    const skills = await CareerDB.getSkills();
    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { jobTitle } = await req.json();
    
    if (!jobTitle) {
      return NextResponse.json({ error: 'Job title required' }, { status: 400 });
    }

    // Find skills associated with similar job titles
    const skillIds = await CareerDB.findSkillsByJob(jobTitle);
    const allSkills = await CareerDB.getSkills();
    
    const matchedSkills = allSkills
      .filter(skill => skillIds.includes(skill.id))
      .map(skill => skill.name);

    // If no direct matches, return common skills for manual entry
    if (matchedSkills.length === 0) {
      const commonSkills = allSkills
        .filter(s => ['communication', 'project-mgmt', 'excel', 'leadership'].includes(s.id))
        .map(s => s.name);
      
      return NextResponse.json({ skills: commonSkills });
    }

    return NextResponse.json({ skills: matchedSkills });
  } catch (error) {
    console.error('Skills lookup error:', error);
    return NextResponse.json({ error: 'Failed to analyze job title' }, { status: 500 });
  }
}