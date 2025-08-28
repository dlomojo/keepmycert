import { UserPlan, TeamRole } from './types';

export interface PlanLimits {
  maxCertifications: number;
  hasAIInsights: boolean;
  hasAdvancedReminders: boolean;
  hasDataExport: boolean;
  hasFileAttachments: boolean;
  hasPrioritySupport: boolean;
  hasTeamManagement: boolean;
  hasComplianceDashboard: boolean;
  hasSSO: boolean;
  hasBulkOperations: boolean;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  FREE: {
    maxCertifications: 3,
    hasAIInsights: false,
    hasAdvancedReminders: false,
    hasDataExport: false,
    hasFileAttachments: false,
    hasPrioritySupport: false,
    hasTeamManagement: false,
    hasComplianceDashboard: false,
    hasSSO: false,
    hasBulkOperations: false,
  },
  PRO: {
    maxCertifications: Infinity,
    hasAIInsights: true,
    hasAdvancedReminders: true,
    hasDataExport: true,
    hasFileAttachments: true,
    hasPrioritySupport: true,
    hasTeamManagement: false,
    hasComplianceDashboard: false,
    hasSSO: false,
    hasBulkOperations: false,
  },
  TEAM: {
    maxCertifications: Infinity,
    hasAIInsights: true,
    hasAdvancedReminders: true,
    hasDataExport: true,
    hasFileAttachments: true,
    hasPrioritySupport: true,
    hasTeamManagement: true,
    hasComplianceDashboard: true,
    hasSSO: true,
    hasBulkOperations: true,
  },
};

export function canAccessFeature(userPlan: UserPlan, feature: keyof PlanLimits): boolean {
  return PLAN_LIMITS[userPlan][feature] as boolean;
}

export function getCertificationLimit(userPlan: UserPlan): number {
  return PLAN_LIMITS[userPlan].maxCertifications;
}

export function canManageTeam(userPlan: UserPlan, teamRole?: TeamRole): boolean {
  return userPlan === 'TEAM' && teamRole === 'MANAGER';
}

export function getUpgradeMessage(currentPlan: UserPlan, feature: string): string {
  if (currentPlan === 'FREE') {
    return `Upgrade to Pro to unlock ${feature}`;
  }
  if (currentPlan === 'PRO') {
    return `Upgrade to Team to unlock ${feature}`;
  }
  return '';
}