/**
 * Client-side authentication utilities
 */
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SessionUser, UserRole, PLAN_FEATURES } from './types';

/**
 * Custom hook to get the current authenticated user
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user as SessionUser | undefined;

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPro: ['pro', 'team', 'admin'].includes(user?.role || ''),
    isTeam: ['team', 'admin'].includes(user?.role || ''),
    role: user?.role,
    subscription: user?.subscription,
    features: user ? PLAN_FEATURES[user.subscription?.plan || 'free'] : PLAN_FEATURES.free,
  };
}

/**
 * Check if user has access to pro features
 */
export function useProAccess() {
  const { user, loading } = useAuth();
  const hasAccess = !!user?.subscription?.status && 
    ['active', 'trialing'].includes(user.subscription.status) && 
    ['pro', 'team', 'admin'].includes(user?.role || '');
  
  return { hasAccess, loading };
}

/**
 * Protected route hook
 */
export function useProtectedRoute(requiredRole: UserRole = 'free') {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if route is protected and user is loaded
    if (!loading) {
      // Map of role hierarchy
      const roleHierarchy: Record<UserRole, number> = {
        'free': 0,
        'pro': 1,
        'team': 2,
        'admin': 3
      };

      // Check if user exists and has required role or higher
      const hasRequiredRole = user && 
        roleHierarchy[user.role] >= roleHierarchy[requiredRole];

      if (!user) {
        // Not logged in, redirect to login
        signIn('auth0', { callbackUrl: window.location.href });
        setAuthorized(false);
      } else if (!hasRequiredRole) {
        // Doesn't have required role, redirect to upgrade
        router.push('/pricing?required=' + requiredRole);
        setAuthorized(false);
      } else {
        // Authorized, allow access
        setAuthorized(true);
      }
    }
  }, [loading, user, router, requiredRole]);

  return { authorized, loading };
}

/**
 * Login with Auth0
 */
export async function login(returnUrl: string = window.location.href) {
  await signIn('auth0', { callbackUrl: returnUrl });
}

/**
 * Logout from Auth0
 */
export async function logout() {
  await signOut({ callbackUrl: '/' });
}

/**
 * Subscribe to pro plan
 */
export async function subscribeToPro() {
  try {
    const response = await fetch('/api/subscriptions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan: 'pro',
        returnUrl: window.location.href,
      }),
    });
    
    const data = await response.json();
    
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('Failed to create checkout session');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}