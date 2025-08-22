/**
 * Server-side authentication utilities
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { auth0Config, auth0Claims } from './config';
import { UserRole, SessionUser } from './types';

/**
 * Get server session
 */
export async function getSession(req?: NextApiRequest | NextRequest, res?: NextApiResponse) {
  try {
    if (res) {
      return await getServerSession(req, res, authOptions);
    }
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get user from session (server-side)
 */
export async function getSessionUser(req?: NextApiRequest | NextRequest, res?: NextApiResponse): Promise<SessionUser | null> {
  const session = await getSession(req, res);
  return session?.user as SessionUser || null;
}

/**
 * Server-side authentication middleware for API routes
 */
export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: SessionUser) => Promise<void>,
  requiredRole: UserRole = 'free'
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Role hierarchy (moved outside function for performance)
    const roleHierarchy: Record<UserRole, number> = {
      'free': 0,
      'pro': 1,
      'team': 2,
      'admin': 3
    };

    if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    return handler(req, res, user);
  };
}

/**
 * App router authentication middleware
 */
export function withAuthMiddleware(
  handler: (req: NextRequest, user: SessionUser) => Promise<Response>,
  requiredRole: UserRole = 'free'
) {
  return async (req: NextRequest) => {
    const session = await getSession(req);
    const user = session?.user as SessionUser | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Role hierarchy
    const roleHierarchy: Record<UserRole, number> = {
      'free': 0,
      'pro': 1,
      'team': 2,
      'admin': 3
    };

    if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return handler(req, user);
  };
}

/**
 * Get Auth0 management API token
 */
export async function getAuth0ManagementToken() {
  const response = await fetch(`${auth0Config.issuerBaseURL}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: auth0Config.clientID,
      client_secret: auth0Config.clientSecret,
      audience: auth0Config.managementAudience,
      grant_type: 'client_credentials'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to get Auth0 management token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Update user roles in Auth0
 */
export async function updateUserRoles(userId: string, roles: string[]) {
  try {
    const token = await getAuth0ManagementToken();
    
    // Get user
    const userResponse = await fetch(`${auth0Config.issuerBaseURL}/api/v2/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`Failed to get user: ${userResponse.status}`);
    }
    
    const user = await userResponse.json();
    
    // Update app_metadata with validation
    const metadata = user.app_metadata || {};
    if (metadata.hasOwnProperty(`${auth0Claims.namespace}roles`)) {
      metadata[`${auth0Claims.namespace}roles`] = roles;
    } else {
      metadata[`${auth0Claims.namespace}roles`] = roles;
    }
    
    // Update user
    await fetch(`${auth0Config.issuerBaseURL}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_metadata: metadata
      })
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user roles:', error);
    return false;
  }
}

/**
 * Update user subscription in Auth0
 */
export async function updateUserSubscription(userId: string, subscription: Record<string, unknown>) {
  try {
    const token = await getAuth0ManagementToken();
    
    // Get user
    const userResponse = await fetch(`${auth0Config.issuerBaseURL}/api/v2/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const user = await userResponse.json();
    
    // Update app_metadata
    const metadata = user.app_metadata || {};
    metadata[`${auth0Claims.namespace}subscription`] = subscription;
    
    // Update user
    await fetch(`${auth0Config.issuerBaseURL}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_metadata: metadata
      })
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
}