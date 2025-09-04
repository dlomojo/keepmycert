export const runtime = 'nodejs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build');

export async function POST(req: Request) {
  const { priceId, customerId, militaryDiscount } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    ...(customerId ? { customer: customerId } : {}),
    ...(militaryDiscount ? { discounts: [{ coupon: 'military_discount' }] } : {}),
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/pro?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    allow_promotion_codes: true
  });

  return Response.json({ url: session.url });
}