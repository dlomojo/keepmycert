/**
 * Auth types for the application
 */

export type UserRole = 'free' | 'pro' | 'team' | 'admin';

export interface UserSubscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  plan: 'free' | 'pro' | 'team';
  trialEnd?: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role: UserRole;
  subscription?: UserSubscription;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role: UserRole;
  subscription?: {
    plan: 'free' | 'pro' | 'team';
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  };
}

export interface AuthResult {
  user: SessionUser | null;
  error?: string;
  loading: boolean;
}

export interface PlanFeatures {
  maxCertificates: number;
  aiFeatures: boolean;
  teamMembers: number;
  prioritySupport: boolean;
  customExports: boolean;
  advancedAnalytics: boolean;
}

export const PLAN_FEATURES: Record<'free' | 'pro' | 'team', PlanFeatures> = {
  free: {
    maxCertificates: 5,
    aiFeatures: false,
    teamMembers: 0,
    prioritySupport: false,
    customExports: false,
    advancedAnalytics: false
  },
  pro: {
    maxCertificates: -1, // unlimited
    aiFeatures: true,
    teamMembers: 1,
    prioritySupport: true,
    customExports: true,
    advancedAnalytics: true
  },
  team: {
    maxCertificates: -1, // unlimited
    aiFeatures: true,
    teamMembers: 10,
    prioritySupport: true,
    customExports: true,
    advancedAnalytics: true
  }
};