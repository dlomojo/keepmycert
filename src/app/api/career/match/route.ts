import { NextRequest, NextResponse } from 'next/server';
import { CareerDB, JobMatch } from '@/lib/career-db';

export async function POST(req: NextRequest) {
  try {
    const { skills } = await req.json();
    
    if (!skills || !Array.isArray(skills)) {
      return NextResponse.json({ error: 'Skills array required' }, { status: 400 });
    }

    const normalizedSkills = CareerDB.normalizeSkills(skills);
    const allSkills = await CareerDB.getSkills();
    const allJobs = await CareerDB.getJobs();
    
    const matches: JobMatch[] = [];

    for (const job of allJobs) {
      const jobSkills = await CareerDB.getJobSkills(job.id);
      const score = CareerDB.calculateJobMatch(normalizedSkills, jobSkills, allSkills);
      
      if (score >= 0.6) { // Only include jobs with 60%+ match
        const skillMap = new Map(allSkills.map(s => [s.id, s.name]));
        
        const matchedSkills: string[] = [];
        const missingSkills: string[] = [];
        
        for (const jobSkill of jobSkills) {
          const skillName = skillMap.get(jobSkill.skillId);
          if (!skillName) continue;
          
          const hasSkill = normalizedSkills.some(us => 
            us.toLowerCase() === skillName.toLowerCase() ||
            allSkills.find(s => s.id === jobSkill.skillId)?.synonyms.some(syn => 
              syn.toLowerCase() === us.toLowerCase()
            )
          );
          
          if (hasSkill) {
            matchedSkills.push(skillName);
          } else if (jobSkill.importance === 'required') {
            missingSkills.push(skillName);
          }
        }
        
        matches.push({
          job,
          score,
          matchedSkills,
          missingSkills,
          category: score >= 0.85 ? 'now' : 'next'
        });
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json({ error: 'Failed to find matches' }, { status: 500 });
  }
}