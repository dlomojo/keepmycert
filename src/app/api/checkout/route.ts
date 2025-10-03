export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { applyRateLimit } from '@/lib/rate-limit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build');

export async function POST(req: Request) {
  try {
    // Rate limiting for checkout
    const rateLimitResult = applyRateLimit(req as NextRequest, 'STRICT');
    if (!rateLimitResult.success) {
      return Response.json(
        { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
        { 
          status: 429, 
          headers: { 
            'Retry-After': rateLimitResult.retryAfter.toString()
          } 
        }
      );
    }
    
    const { priceId, customerId, militaryDiscount } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      ...(customerId ? { customer: customerId } : {}),
      ...(militaryDiscount ? { discounts: [{ coupon: 'military_discount' }] } : {}),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      allow_promotion_codes: true
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: 'Checkout failed' }, { status: 500 });
  }
}