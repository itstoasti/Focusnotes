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

    const { data: profiles } = await client
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single();

    if (!profiles?.stripe_customer_id) {
      throw createError({
        statusCode: 400,
        message: 'No active subscription found',
      });
    }

    const { data: subscriptions } = await stripe.subscriptions.list({
      customer: profiles.stripe_customer_id,
    });

    if (subscriptions.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No active subscription found',
      });
    }

    // Cancel the subscription at period end
    await stripe.subscriptions.update(subscriptions[0].id, {
      cancel_at_period_end: true,
    });

    return { message: 'Subscription will be canceled at the end of the billing period' };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
}); 