export type Plan = 'FREE' | 'PRO' | 'TEAM';
export type Feature =
  | 'CERT_LIMIT_3' | 'UNLIMITED_CERTS'
  | 'AI_INSIGHTS' | 'ADVANCED_REMINDERS'
  | 'EXPORT' | 'ATTACHMENTS' | 'PRIORITY_SUPPORT'
  | 'TEAM_MGMT' | 'COMPLIANCE_DASH' | 'RBAC' | 'TEAM_ANALYTICS' | 'BULK_OPS' | 'SSO';

const FEATURE_MAP: Record<Plan, Feature[]> = {
  FREE: ['CERT_LIMIT_3'],
  PRO: ['UNLIMITED_CERTS', 'AI_INSIGHTS', 'ADVANCED_REMINDERS', 'EXPORT', 'ATTACHMENTS', 'PRIORITY_SUPPORT'],
  TEAM: ['UNLIMITED_CERTS', 'AI_INSIGHTS', 'ADVANCED_REMINDERS', 'EXPORT', 'ATTACHMENTS', 'PRIORITY_SUPPORT', 'TEAM_MGMT', 'COMPLIANCE_DASH', 'RBAC', 'TEAM_ANALYTICS', 'BULK_OPS', 'SSO'],
};

export const hasFeature = (plan: Plan, feature: Feature): boolean => {
  return FEATURE_MAP[plan].includes(feature);
};

export const getCertLimit = (plan: Plan): number => {
  return plan === 'FREE' ? 3 : Infinity;
};