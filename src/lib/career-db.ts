import { supabaseAdmin } from './supabase';
import {
  CareerCredentialRow,
  CareerCredentialSkillRow,
  CareerJobRow,
  CareerJobSkillRow,
  CareerSkillRow,
} from '@/types/database';

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
    const skills = await supabaseAdmin.select<CareerSkillRow>('career_skills', '*', {
      order: { column: 'name', ascending: true },
    });
    return skills.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category as SkillCategory,
      description: s.description || '',
      synonyms: s.synonyms || [],
    }));
  }

  static async getJobs(): Promise<Job[]> {
    const jobs = await supabaseAdmin.select<CareerJobRow>('career_jobs', '*', {
      order: { column: 'title', ascending: true },
    });
    return jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description || '',
      seniority: job.seniority || '',
      medianSalaryUsd: job.median_salary_usd || 0,
      growthOutlook: job.growth_outlook || '',
      sourceRef: job.source_ref || '',
    }));
  }

  static async getJobSkills(jobId: string): Promise<JobSkill[]> {
    const jobSkills = await supabaseAdmin.select<CareerJobSkillRow>('career_job_skills', '*', {
      eq: { job_id: jobId },
    });
    return jobSkills.map(js => ({
      jobId: js.job_id,
      skillId: js.skill_id,
      importance: js.importance as Importance,
      proficiency: js.proficiency as Proficiency,
    }));
  }

  static async getCredentials(): Promise<Credential[]> {
    const credentials = await supabaseAdmin.select<CareerCredentialRow>('career_credentials', '*', {
      order: { column: 'name', ascending: true },
    });
    return credentials.map(cred => ({
      id: cred.id,
      name: cred.name,
      provider: cred.provider || '',
      type: (cred.type || 'certification') as CredentialType,
      level: (cred.level || 'associate') as CredentialLevel,
      url: cred.url || '',
      description: cred.description || '',
    }));
  }

  static async getCredentialSkills(credentialId: string): Promise<CredentialSkill[]> {
    const rows = await supabaseAdmin.select<CareerCredentialSkillRow>('career_credential_skills', '*', {
      eq: { credential_id: credentialId },
    });
    return rows.map(row => ({
      credentialId: row.credential_id,
      skillId: row.skill_id,
    }));
  }

  static async findSkillsByJob(jobTitle: string): Promise<string[]> {
    const matchingJobs = await supabaseAdmin.select<CareerJobRow>('career_jobs', 'id', {
      ilike: { title: `%${jobTitle}%` },
    });

    if (!matchingJobs.length) {
      return [];
    }

    const jobIds = matchingJobs.map(job => job.id);
    const jobSkills = await supabaseAdmin.select<CareerJobSkillRow>('career_job_skills', 'skill_id', {
      in: { job_id: jobIds },
    });

    return jobSkills.map(js => js.skill_id);
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