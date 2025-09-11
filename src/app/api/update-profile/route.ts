import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';

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

    await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
}