import { prisma } from './db';

export type SkillCategory = 'technical' | 'tool' | 'domain' | 'soft';
export type Importance = 'required' | 'preferred';
export type Proficiency = 'basic' | 'working' | 'advanced';
export type CredentialType = 'certification' | 'certificate' | 'course' | 'degree' | 'nano';
export type CredentialLevel = 'foundation' | 'associate' | 'professional' | 'expert';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  synonyms: string[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  seniority: string;
  medianSalaryUsd: number;
  growthOutlook: string;
  sourceRef: string;
}

export interface JobSkill {
  jobId: string;
  skillId: string;
  importance: Importance;
  proficiency: Proficiency;
}

export interface Credential {
  id: string;
  name: string;
  provider: string;
  type: CredentialType;
  level: CredentialLevel;
  url: string;
  description: string;
}

export interface CredentialSkill {
  credentialId: string;
  skillId: string;
}

export interface JobMatch {
  job: Job;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  category: 'now' | 'next';
}

export class CareerDB {
  static async getSkills(): Promise<Skill[]> {
    const skills = await prisma.$queryRaw<Skill[]>`
      SELECT * FROM career_skills ORDER BY name
    `;
    return skills.map(s => ({
      ...s,
      synonyms: s.synonyms || []
    }));
  }

  static async getJobs(): Promise<Job[]> {
    return await prisma.$queryRaw<Job[]>`
      SELECT * FROM career_jobs ORDER BY title
    `;
  }

  static async getJobSkills(jobId: string): Promise<JobSkill[]> {
    return await prisma.$queryRaw<JobSkill[]>`
      SELECT * FROM career_job_skills WHERE job_id = ${jobId}
    `;
  }

  static async getCredentials(): Promise<Credential[]> {
    return await prisma.$queryRaw<Credential[]>`
      SELECT * FROM career_credentials ORDER BY name
    `;
  }

  static async getCredentialSkills(credentialId: string): Promise<CredentialSkill[]> {
    return await prisma.$queryRaw<CredentialSkill[]>`
      SELECT * FROM career_credential_skills WHERE credential_id = ${credentialId}
    `;
  }

  static async findSkillsByJob(jobTitle: string): Promise<string[]> {
    const jobs = await prisma.$queryRaw<{ skill_id: string }[]>`
      SELECT js.skill_id 
      FROM career_jobs j
      JOIN career_job_skills js ON j.id = js.job_id
      WHERE LOWER(j.title) LIKE LOWER(${`%${jobTitle}%`})
    `;
    return jobs.map(j => j.skill_id);
  }

  static normalizeSkills(inputSkills: string[]): string[] {
    // Simple normalization - in production would use fuzzy matching
    return inputSkills.map(skill => skill.toLowerCase().trim());
  }

  static calculateJobMatch(userSkills: string[], jobSkills: JobSkill[], allSkills: Skill[]): number {
    const skillMap = new Map(allSkills.map(s => [s.id, s]));
    let totalScore = 0;
    let maxScore = 0;

    for (const jobSkill of jobSkills) {
      const skill = skillMap.get(jobSkill.skillId);
      if (!skill) continue;

      const weight = jobSkill.importance === 'required' ? 2.0 : 1.0;
      const isSoft = skill.category === 'soft';
      const skillWeight = isSoft ? Math.min(weight, 0.3) : weight;
      
      maxScore += skillWeight;
      
      const hasSkill = userSkills.some(us => 
        us.toLowerCase() === skill.name.toLowerCase() ||
        skill.synonyms.some(syn => syn.toLowerCase() === us.toLowerCase())
      );
      
      if (hasSkill) {
        totalScore += skillWeight;
      }
    }

    return maxScore > 0 ? totalScore / maxScore : 0;
  }
}