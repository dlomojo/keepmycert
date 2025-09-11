import 'server-only';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from './db';

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  plan: 'FREE' | 'PRO' | 'TEAM';
  timezone: string;
  teamRole?: string;
  teamId?: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await getSession();
    const email = session?.user?.email;
    if (!email) return null;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name || 'User',
      plan: ['FREE', 'PRO', 'TEAM'].includes(user.plan) ? user.plan as 'FREE' | 'PRO' | 'TEAM' : 'FREE',
      timezone: user.timezone || 'UTC',
      teamRole: undefined,
      teamId: undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error('Authentication required');
    error.name = 'AuthenticationError';
    throw error;
  }
  return user;
}