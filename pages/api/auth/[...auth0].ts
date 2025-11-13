import { handleAuth, handleLogin, handleCallback, Session } from '@auth0/nextjs-auth0';
import { getOrCreateUser, updateUserById } from '@/lib/user-service';
import { UserRow } from '@/types/database';
import type { NextApiRequest, NextApiResponse } from 'next';

export default handleAuth({
  async login(req: NextApiRequest, res: NextApiResponse) {
    await handleLogin(req, res, {
      returnTo: '/dashboard/free'
    });
  },
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res, {
        afterCallback: async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
          const email = session.user?.email;
          if (email) {
            try {
              // Extract names from Auth0 profile
              const fullName = session.user?.name || '';
              const firstName = session.user?.given_name || fullName.split(' ')[0] || '';
              const lastName = session.user?.family_name || fullName.split(' ').slice(1).join(' ') || '';
              
              const user = await getOrCreateUser(email, {
                name: fullName,
                firstName,
                lastName,
              });

              await updateUserById(user.id, {
                name: fullName || email.split('@')[0],
                first_name: firstName || null,
                last_name: lastName || null,
              } as Partial<UserRow>);
              console.log('User created/updated successfully');
            } catch (dbError) {
              console.error('Database error during user creation:', dbError instanceof Error ? dbError.message : 'Unknown database error');
            }
          }
          return session;
        }
      });
    } catch (error) {
      console.error('Auth callback error:', error);
      res.redirect('/?error=auth_failed');
    }
  }
});