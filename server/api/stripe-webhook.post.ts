import Stripe from 'stripe';
import { serverSupabaseClient } from '#supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default defineEventHandler(async (event) => {
  try {
    const signature = getHeader(event, 'stripe-signature');
    if (!signature) {
      throw createError({
        statusCode: 400,
        message: 'Missing stripe-signature header',
      });
    }

    const body = await readRawBody(event);
    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'Missing body',
      });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw createError({
        statusCode: 500,
        message: 'Missing STRIPE_WEBHOOK_SECRET',
      });
    }

    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    const client = await serverSupabaseClient(event);

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (userId) {
        await client
          .from('profiles')
          .update({ subscription_status: 'active', stripe_customer_id: session.customer as string })
          .eq('id', userId);
      }
    }

    if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      const { data: profiles } = await client
        .from('profiles')
        .select()
        .eq('stripe_customer_id', subscription.customer);

      if (profiles && profiles[0]) {
        await client
          .from('profiles')
          .update({ subscription_status: 'inactive' })
          .eq('id', profiles[0].id);
      }
    }

    return { received: true };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
}); 