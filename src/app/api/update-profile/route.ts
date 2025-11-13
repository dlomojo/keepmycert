import { getSession } from '@auth0/nextjs-auth0';
import { getOrCreateUser, updateUserById } from '@/lib/user-service';
import { UserRow } from '@/types/database';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const email = session?.user?.email;
    
    if (!email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName } = await req.json();
    
    if (!firstName || !lastName) {
      return Response.json({ error: 'First and last name required' }, { status: 400 });
    }

    const user = await getOrCreateUser(email);

    await updateUserById(user.id, {
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`,
    } as Partial<UserRow>);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
}