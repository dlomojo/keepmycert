import { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';
import { isValidStripeSessionId, sanitizeForLog } from '@/lib/security';
import { getOrCreateUser, updateUserById } from '@/lib/user-service';
import { UserRow } from '@/types/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId || !isValidStripeSessionId(sessionId)) {
    return Response.redirect(new URL('/dashboard?error=no_session', req.url));
  }

  try {
    const session = await getSession();
    const email = session?.user?.email;
    
    if (!email) {
      return Response.redirect(new URL('/api/auth/login', req.url));
    }

    // Verify Stripe session
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (stripeSession.payment_status === 'paid') {
      const fullName = session.user?.name as string | undefined;
      const firstName = session.user?.given_name as string | undefined;
      const lastName = session.user?.family_name as string | undefined;

      const user = await getOrCreateUser(email, {
        name: fullName,
        firstName,
        lastName,
      });

      await updateUserById(user.id, { plan: 'PRO' } as Partial<UserRow>);
    }

    return Response.redirect(new URL('/dashboard/pro?success=true', req.url));
  } catch (error) {
    console.error('Checkout success error:', sanitizeForLog(error instanceof Error ? error.message : 'Unknown error'));
    return Response.redirect(new URL('/dashboard?error=upgrade_failed', req.url));
  }
}