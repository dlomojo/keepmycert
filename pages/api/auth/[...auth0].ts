import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res, {
        afterCallback: async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
          const email = session.user?.email;
          if (email) {
            try {
              await prisma.user.upsert({
                where: { email },
                update: { name: session.user?.name || email.split('@')[0] },
                create: { 
                  email, 
                  name: session.user?.name || email.split('@')[0],
                  plan: 'FREE'
                }
              });
            } catch (dbError) {
              console.error('Database error during user creation:', dbError);
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