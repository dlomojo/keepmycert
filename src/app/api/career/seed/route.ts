import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  CareerCredentialRow,
  CareerCredentialSkillRow,
  CareerJobRow,
  CareerJobSkillRow,
  CareerSkillRow,
} from '@/types/database';

export async function POST() {
  try {
    // Seed skills
    const skills = [
      { id: 'sql', name: 'SQL', category: 'technical', description: 'Database querying', synonyms: ['MySQL', 'PostgreSQL'] },
      { id: 'excel', name: 'Excel', category: 'tool', description: 'Spreadsheet analysis', synonyms: ['Microsoft Excel', 'Spreadsheets'] },
      { id: 'python', name: 'Python', category: 'technical', description: 'Programming language', synonyms: ['Python Programming'] },
      { id: 'agile', name: 'Agile', category: 'domain', description: 'Project methodology', synonyms: ['Scrum', 'Agile Methodology'] },
      { id: 'jira', name: 'Jira', category: 'tool', description: 'Project tracking', synonyms: ['Atlassian Jira'] },
      { id: 'ux', name: 'UX Design', category: 'domain', description: 'User experience design', synonyms: ['User Experience', 'UX'] },
      { id: 'communication', name: 'Communication', category: 'soft', description: 'Verbal and written communication', synonyms: ['Written Communication'] },
      { id: 'project-mgmt', name: 'Project Management', category: 'domain', description: 'Managing projects', synonyms: ['PM', 'Project Coordination'] },
      { id: 'budgeting', name: 'Budgeting', category: 'domain', description: 'Financial planning', synonyms: ['Budget Management'] },
      { id: 'vendor-mgmt', name: 'Vendor Management', category: 'domain', description: 'Managing suppliers', synonyms: ['Supplier Management'] },
      { id: 'tableau', name: 'Tableau', category: 'tool', description: 'Data visualization', synonyms: ['Tableau Desktop'] },
      { id: 'powerbi', name: 'Power BI', category: 'tool', description: 'Business intelligence', synonyms: ['Microsoft Power BI'] },
      { id: 'javascript', name: 'JavaScript', category: 'technical', description: 'Web programming', synonyms: ['JS', 'ECMAScript'] },
      { id: 'html-css', name: 'HTML/CSS', category: 'technical', description: 'Web markup and styling', synonyms: ['HTML', 'CSS'] },
      { id: 'git', name: 'Git', category: 'tool', description: 'Version control', synonyms: ['GitHub', 'GitLab'] },
      { id: 'aws', name: 'AWS', category: 'technical', description: 'Cloud computing', synonyms: ['Amazon Web Services'] },
      { id: 'docker', name: 'Docker', category: 'tool', description: 'Containerization', synonyms: ['Containers'] },
      { id: 'leadership', name: 'Leadership', category: 'soft', description: 'Leading teams', synonyms: ['Team Leadership'] },
      { id: 'analytics', name: 'Data Analytics', category: 'domain', description: 'Data analysis', synonyms: ['Data Analysis'] },
      { id: 'marketing', name: 'Digital Marketing', category: 'domain', description: 'Online marketing', synonyms: ['Marketing'] }
    ];

    const skillRows: Partial<CareerSkillRow>[] = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      synonyms: skill.synonyms,
    }));

    await supabaseAdmin.insert<CareerSkillRow>('career_skills', skillRows, { upsert: true });

    // Seed jobs
    const jobs = [
      { id: 'project-coord', title: 'Project Coordinator', description: 'Coordinate project activities', seniority: 'Entry', salary: 55000, growth: 'Stable', ref: 'internal' },
      { id: 'data-analyst', title: 'Data Analyst', description: 'Analyze business data', seniority: 'Mid', salary: 70000, growth: 'High', ref: 'internal' },
      { id: 'junior-pm', title: 'Junior Product Manager', description: 'Assist in product development', seniority: 'Entry', salary: 85000, growth: 'High', ref: 'internal' },
      { id: 'exec-assistant', title: 'Executive Assistant', description: 'Support executive team', seniority: 'Entry', salary: 50000, growth: 'Stable', ref: 'internal' },
      { id: 'frontend-dev', title: 'Frontend Developer', description: 'Build user interfaces', seniority: 'Mid', salary: 80000, growth: 'High', ref: 'internal' },
      { id: 'marketing-coord', title: 'Marketing Coordinator', description: 'Support marketing campaigns', seniority: 'Entry', salary: 45000, growth: 'Stable', ref: 'internal' },
      { id: 'business-analyst', title: 'Business Analyst', description: 'Analyze business processes', seniority: 'Mid', salary: 75000, growth: 'High', ref: 'internal' },
      { id: 'scrum-master', title: 'Scrum Master', description: 'Facilitate agile processes', seniority: 'Mid', salary: 90000, growth: 'High', ref: 'internal' },
      { id: 'ux-designer', title: 'UX Designer', description: 'Design user experiences', seniority: 'Mid', salary: 85000, growth: 'High', ref: 'internal' },
      { id: 'devops-eng', title: 'DevOps Engineer', description: 'Manage deployment pipelines', seniority: 'Senior', salary: 110000, growth: 'Very High', ref: 'internal' },
      { id: 'product-owner', title: 'Product Owner', description: 'Define product requirements', seniority: 'Senior', salary: 120000, growth: 'High', ref: 'internal' },
      { id: 'data-scientist', title: 'Data Scientist', description: 'Build predictive models', seniority: 'Senior', salary: 130000, growth: 'Very High', ref: 'internal' }
    ];

    const jobRows: Partial<CareerJobRow>[] = jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      seniority: job.seniority,
      median_salary_usd: job.salary,
      growth_outlook: job.growth,
      source_ref: job.ref,
    }));

    await supabaseAdmin.insert<CareerJobRow>('career_jobs', jobRows, { upsert: true });

    // Seed job skills
    const jobSkills = [
      // Project Coordinator
      { jobId: 'project-coord', skillId: 'project-mgmt', importance: 'required', proficiency: 'working' },
      { jobId: 'project-coord', skillId: 'excel', importance: 'required', proficiency: 'working' },
      { jobId: 'project-coord', skillId: 'communication', importance: 'required', proficiency: 'advanced' },
      { jobId: 'project-coord', skillId: 'jira', importance: 'preferred', proficiency: 'basic' },
      { jobId: 'project-coord', skillId: 'agile', importance: 'preferred', proficiency: 'basic' },
      
      // Data Analyst
      { jobId: 'data-analyst', skillId: 'sql', importance: 'required', proficiency: 'advanced' },
      { jobId: 'data-analyst', skillId: 'excel', importance: 'required', proficiency: 'advanced' },
      { jobId: 'data-analyst', skillId: 'tableau', importance: 'required', proficiency: 'working' },
      { jobId: 'data-analyst', skillId: 'python', importance: 'preferred', proficiency: 'working' },
      { jobId: 'data-analyst', skillId: 'analytics', importance: 'required', proficiency: 'advanced' },
      
      // Junior PM
      { jobId: 'junior-pm', skillId: 'project-mgmt', importance: 'required', proficiency: 'working' },
      { jobId: 'junior-pm', skillId: 'agile', importance: 'required', proficiency: 'working' },
      { jobId: 'junior-pm', skillId: 'jira', importance: 'required', proficiency: 'working' },
      { jobId: 'junior-pm', skillId: 'ux', importance: 'preferred', proficiency: 'basic' },
      { jobId: 'junior-pm', skillId: 'communication', importance: 'required', proficiency: 'advanced' },
      { jobId: 'junior-pm', skillId: 'analytics', importance: 'preferred', proficiency: 'basic' }
    ];

    const jobSkillRows: Partial<CareerJobSkillRow>[] = jobSkills.map(js => ({
      job_id: js.jobId,
      skill_id: js.skillId,
      importance: js.importance,
      proficiency: js.proficiency,
    }));

    await supabaseAdmin.insert<CareerJobSkillRow>('career_job_skills', jobSkillRows, { upsert: true });

    // Seed credentials
    const credentials = [
      { id: 'csm', name: 'Certified ScrumMaster', provider: 'Scrum Alliance', type: 'certification', level: 'associate', url: 'https://scrumalliance.org', description: 'Agile project management certification' },
      { id: 'google-da', name: 'Google Data Analytics Certificate', provider: 'Google', type: 'certificate', level: 'foundation', url: 'https://coursera.org', description: 'Data analysis fundamentals' },
      { id: 'capm', name: 'CAPM', provider: 'PMI', type: 'certification', level: 'associate', url: 'https://pmi.org', description: 'Project management fundamentals' },
      { id: 'tableau-spec', name: 'Tableau Desktop Specialist', provider: 'Tableau', type: 'certification', level: 'foundation', url: 'https://tableau.com', description: 'Data visualization basics' },
      { id: 'ux-google', name: 'Google UX Design Certificate', provider: 'Google', type: 'certificate', level: 'foundation', url: 'https://coursera.org', description: 'User experience design fundamentals' }
    ];

    const credentialRows: Partial<CareerCredentialRow>[] = credentials.map(cred => ({
      id: cred.id,
      name: cred.name,
      provider: cred.provider,
      type: cred.type,
      level: cred.level,
      url: cred.url,
      description: cred.description,
    }));

    await supabaseAdmin.insert<CareerCredentialRow>('career_credentials', credentialRows, { upsert: true });

    // Seed credential skills
    const credSkills = [
      { credentialId: 'csm', skillId: 'agile' },
      { credentialId: 'csm', skillId: 'project-mgmt' },
      { credentialId: 'csm', skillId: 'leadership' },
      { credentialId: 'google-da', skillId: 'sql' },
      { credentialId: 'google-da', skillId: 'tableau' },
      { credentialId: 'google-da', skillId: 'analytics' },
      { credentialId: 'capm', skillId: 'project-mgmt' },
      { credentialId: 'tableau-spec', skillId: 'tableau' },
      { credentialId: 'ux-google', skillId: 'ux' }
    ];

    const credentialSkillRows: Partial<CareerCredentialSkillRow>[] = credSkills.map(cs => ({
      credential_id: cs.credentialId,
      skill_id: cs.skillId,
    }));

    await supabaseAdmin.insert<CareerCredentialSkillRow>('career_credential_skills', credentialSkillRows, { upsert: true });

    return NextResponse.json({ success: true, message: 'Career data seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}