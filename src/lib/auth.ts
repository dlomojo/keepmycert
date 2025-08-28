import 'server-only';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from './db';

export type CurrentUser = {
  id: string;
  email: string;
  plan: 'FREE' | 'PRO' | 'TEAM';
  timezone: string;
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
      plan: user.plan as 'FREE' | 'PRO' | 'TEAM',
      timezone: user.timezone,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}