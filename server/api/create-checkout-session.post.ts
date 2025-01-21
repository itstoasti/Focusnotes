import Stripe from 'stripe';
import { serverSupabaseClient } from '#supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const { data: { user }, error: userError } = await client.auth.getUser();

    if (userError || !user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    const body = await readBody(event);
    const { plan } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env[`STRIPE_${plan.toUpperCase()}_PRICE_ID`],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${getRequestURL(event).origin}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getRequestURL(event).origin}/settings`,
      metadata: {
        user_id: user.id,
      },
      customer_email: user.email,
    });

    console.log('Created checkout session:', {
      id: session.id,
      customer: session.customer,
      metadata: session.metadata,
    });

    return { url: session.url };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
}); 