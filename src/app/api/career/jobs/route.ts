import { NextRequest, NextResponse } from 'next/server';
import { CareerDB } from '@/lib/career-db';

export async function POST(req: NextRequest) {
  try {
    const { jobId, userSkills } = await req.json();
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const allJobs = await CareerDB.getJobs();
    const job = allJobs.find(j => j.id === jobId);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const allSkills = await CareerDB.getSkills();
    const jobSkills = await CareerDB.getJobSkills(jobId);
    const normalizedUserSkills = CareerDB.normalizeSkills(userSkills || []);
    
    // Calculate match score
    const matchScore = CareerDB.calculateJobMatch(normalizedUserSkills, jobSkills, allSkills);
    
    // Get matched and missing skills
    const skillMap = new Map(allSkills.map(s => [s.id, s]));
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    
    for (const jobSkill of jobSkills) {
      const skill = skillMap.get(jobSkill.skillId);
      if (!skill) continue;
      
      const hasSkill = normalizedUserSkills.some(us => 
        us.toLowerCase() === skill.name.toLowerCase() ||
        skill.synonyms.some(syn => syn.toLowerCase() === us.toLowerCase())
      );
      
      if (hasSkill) {
        matchedSkills.push(skill.name);
      } else if (jobSkill.importance === 'required') {
        missingSkills.push(skill.name);
      }
    }

    // Get credential recommendations for missing skills
    const credentials = await CareerDB.getCredentials();
    const recommendations = [];
    
    for (const cred of credentials) {
      const credSkills = await CareerDB.getCredentialSkills(cred.id);
      const credSkillNames = credSkills
        .map(cs => skillMap.get(cs.skillId)?.name)
        .filter(Boolean);
      
      // If credential covers any missing skills, recommend it
      const coversMissingSkills = credSkillNames.some(skillName => 
        missingSkills.includes(skillName!)
      );
      
      if (coversMissingSkills) {
        recommendations.push(cred);
      }
    }

    return NextResponse.json({
      job,
      matchScore,
      matchedSkills,
      missingSkills,
      recommendations: recommendations.slice(0, 4) // Limit to top 4
    });
  } catch (error) {
    console.error('Job details error:', error);
    return NextResponse.json({ error: 'Failed to fetch job details' }, { status: 500 });
  }
}