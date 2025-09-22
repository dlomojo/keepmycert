import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    // Create tables
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS career_skills (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        synonyms TEXT[]
      )
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS career_jobs (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        seniority VARCHAR(100),
        median_salary_usd INTEGER,
        growth_outlook VARCHAR(100),
        source_ref VARCHAR(255)
      )
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS career_job_skills (
        job_id VARCHAR(255),
        skill_id VARCHAR(255),
        importance VARCHAR(50),
        proficiency VARCHAR(50),
        PRIMARY KEY (job_id, skill_id)
      )
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS career_credentials (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        provider VARCHAR(255),
        type VARCHAR(50),
        level VARCHAR(50),
        url TEXT,
        description TEXT
      )
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS career_credential_skills (
        credential_id VARCHAR(255),
        skill_id VARCHAR(255),
        PRIMARY KEY (credential_id, skill_id)
      )
    `;

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

    for (const skill of skills) {
      await prisma.$executeRaw`
        INSERT INTO career_skills (id, name, category, description, synonyms)
        VALUES (${skill.id}, ${skill.name}, ${skill.category}, ${skill.description}, ${skill.synonyms})
        ON CONFLICT (id) DO NOTHING
      `;
    }

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

    for (const job of jobs) {
      await prisma.$executeRaw`
        INSERT INTO career_jobs (id, title, description, seniority, median_salary_usd, growth_outlook, source_ref)
        VALUES (${job.id}, ${job.title}, ${job.description}, ${job.seniority}, ${job.salary}, ${job.growth}, ${job.ref})
        ON CONFLICT (id) DO NOTHING
      `;
    }

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

    for (const js of jobSkills) {
      await prisma.$executeRaw`
        INSERT INTO career_job_skills (job_id, skill_id, importance, proficiency)
        VALUES (${js.jobId}, ${js.skillId}, ${js.importance}, ${js.proficiency})
        ON CONFLICT (job_id, skill_id) DO NOTHING
      `;
    }

    // Seed credentials
    const credentials = [
      { id: 'csm', name: 'Certified ScrumMaster', provider: 'Scrum Alliance', type: 'certification', level: 'associate', url: 'https://scrumalliance.org', description: 'Agile project management certification' },
      { id: 'google-da', name: 'Google Data Analytics Certificate', provider: 'Google', type: 'certificate', level: 'foundation', url: 'https://coursera.org', description: 'Data analysis fundamentals' },
      { id: 'capm', name: 'CAPM', provider: 'PMI', type: 'certification', level: 'associate', url: 'https://pmi.org', description: 'Project management fundamentals' },
      { id: 'tableau-spec', name: 'Tableau Desktop Specialist', provider: 'Tableau', type: 'certification', level: 'foundation', url: 'https://tableau.com', description: 'Data visualization basics' },
      { id: 'ux-google', name: 'Google UX Design Certificate', provider: 'Google', type: 'certificate', level: 'foundation', url: 'https://coursera.org', description: 'User experience design fundamentals' }
    ];

    for (const cred of credentials) {
      await prisma.$executeRaw`
        INSERT INTO career_credentials (id, name, provider, type, level, url, description)
        VALUES (${cred.id}, ${cred.name}, ${cred.provider}, ${cred.type}, ${cred.level}, ${cred.url}, ${cred.description})
        ON CONFLICT (id) DO NOTHING
      `;
    }

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

    for (const cs of credSkills) {
      await prisma.$executeRaw`
        INSERT INTO career_credential_skills (credential_id, skill_id)
        VALUES (${cs.credentialId}, ${cs.skillId})
        ON CONFLICT (credential_id, skill_id) DO NOTHING
      `;
    }

    return NextResponse.json({ success: true, message: 'Career data seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}