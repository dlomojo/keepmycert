import { supabaseAdmin } from './supabase';
import { UserRow } from '@/types/database';

export interface UserProfileInput {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  timezone?: string | null;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  return await supabaseAdmin.selectSingle<UserRow>('users', '*', {
    eq: { email },
    limit: 1,
  });
}

export async function getOrCreateUser(email: string, profile: UserProfileInput = {}): Promise<UserRow> {
  const existing = await getUserByEmail(email);
  if (existing) {
    return existing;
  }

  const nameFallback = email.includes('@') ? email.split('@')[0] : email;
  const [created] = await supabaseAdmin.insert<UserRow>('users', [
    {
      email,
      name: profile.name ?? nameFallback,
      first_name: profile.firstName ?? null,
      last_name: profile.lastName ?? null,
      plan: 'FREE',
      timezone: profile.timezone ?? 'UTC',
    } as Partial<UserRow>,
  ]);

  return created;
}

export async function updateUserById(id: string, updates: Partial<UserRow>): Promise<UserRow | null> {
  const [updated] = await supabaseAdmin.update<UserRow>('users', updates, { eq: { id } });
  return updated ?? null;
}
