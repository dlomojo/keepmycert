import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        afterCallback: async (req, res, session) => {
          // Ensure local user exists & keep email synced
          const email = session.user.email!;
          const name = session.user.name || session.user.nickname || email.split('@')[0];
          
          await prisma.user.upsert({
            where: { email },
            update: { name },
            create: { 
              email, 
              name,
              plan: 'FREE' 
            },
          });
          
          return session;
        }
      });
    } catch (error) {
      console.error('Auth callback error:', error);
      res.status(500).end('Auth error');
    }
  }
});