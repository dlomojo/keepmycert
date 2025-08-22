/**
 * Authentication and user types for the application
 */

// User subscription plans
export type SubscriptionPlan = 'free' | 'pro' | 'team';

// User subscription status
export type SubscriptionStatus = 
  | 'active'      // Subscription is active and paid
  | 'trialing'    // User is in trial period
  | 'past_due'    // Payment is past due
  | 'canceled'    // Subscription has been canceled but still active
  | 'inactive';   // No active subscription

// User role types
export type UserRole = 'user' | 'admin';

// User subscription data
export interface UserSubscription {
  id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  trialEnd?: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Base user profile from Auth0
export interface Auth0UserProfile {
  sub: string;         // Auth0 user ID
  email: string;
  email_verified: boolean;
  name?: string;
  nickname?: string;
  picture?: string;
  updated_at: string;
}

// Extended user profile with subscription data
export interface UserProfile extends Auth0UserProfile {
  id: string;          // Our system's user ID (may be same as Auth0 sub)
  role: UserRole;
  subscription?: UserSubscription;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Session user with essential data
export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role: UserRole;
  subscription?: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
  };
}

// Auth context return type
export interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  error?: string;
  login: (redirectUri?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  isPro: boolean;
  isTeam: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

// Features available per subscription plan
export interface PlanFeatures {
  maxCertificates: number;
  aiFeatures: boolean;
  teamMembers: number;
  prioritySupport: boolean;
  customExports: boolean;
  advancedAnalytics: boolean;
}

// Plan features configuration
export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
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