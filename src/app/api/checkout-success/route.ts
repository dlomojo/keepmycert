import { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId) {
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
      // Update user plan to PRO
      await prisma.user.update({
        where: { email },
        data: { plan: 'PRO' }
      });
    }

    return Response.redirect(new URL('/dashboard/pro?success=true', req.url));
  } catch (error) {
    console.error('Checkout success error:', error);
    return Response.redirect(new URL('/dashboard?error=upgrade_failed', req.url));
  }
}