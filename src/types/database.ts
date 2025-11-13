export type UserPlan = 'FREE' | 'PRO' | 'TEAM';

export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  career_field: string | null;
  plan: UserPlan;
  timezone: string | null;
  stripe_customer_id: string | null;
  google_calendar_tokens: string | null;
  calendar_sync_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type CertificationStatus = 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON';

export interface UserCertificationRow {
  id: string;
  user_id: string;
  vendor: string | null;
  certificate_name: string;
  certificate_number: string | null;
  acquired_on: string | null;
  expires_on: string | null;
  status: CertificationStatus;
  storage_path: string | null;
  created_at: string;
  updated_at: string;
  parsed_vendor?: string | null;
  parsed_certificate_name?: string | null;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface TeamRow {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberRow {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface TeamInviteRow {
  id: string;
  team_id: string;
  email: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  invited_by_id: string | null;
}

export interface CareerSkillRow {
  id: string;
  name: string;
  category: string;
  description: string | null;
  synonyms: string[] | null;
}

export interface CareerJobRow {
  id: string;
  title: string;
  description: string | null;
  seniority: string | null;
  median_salary_usd: number | null;
  growth_outlook: string | null;
  source_ref: string | null;
}

export interface CareerJobSkillRow {
  job_id: string;
  skill_id: string;
  importance: string;
  proficiency: string;
}

export interface CareerCredentialRow {
  id: string;
  name: string;
  provider: string | null;
  type: string | null;
  level: string | null;
  url: string | null;
  description: string | null;
}

export interface CareerCredentialSkillRow {
  credential_id: string;
  skill_id: string;
}
