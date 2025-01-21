import Stripe from 'stripe';
import { serverSupabaseClient } from '#supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
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
      const customerId = session.customer as string;

      console.log('Webhook: checkout.session.completed', {
        userId,
        customerId,
        session: session.id
      });

      if (userId && customerId) {
        // Update profiles table
        await client
          .from('profiles')
          .update({ 
            subscription_status: 'active', 
            stripe_customer_id: customerId // This should be the customer ID (cus_...)
          })
          .eq('id', userId);

        // Create subscription record
        const subscription = await stripe.subscriptions.list({
          customer: customerId,
          limit: 1,
        });

        if (subscription.data.length > 0) {
          const sub = subscription.data[0];
          console.log('Creating subscription record', {
            userId,
            customerId,
            subscriptionId: sub.id
          });

          await client
            .from('subscriptions')
            .insert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: sub.id,
              plan_id: sub.items.data[0].price.id,
              status: 'active',
              current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            });
        }
      }
    }

    if (stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      
      // If subscription is set to cancel at period end
      if (subscription.cancel_at_period_end) {
        // Update profiles table
        const { data: profiles } = await client
          .from('profiles')
          .select()
          .eq('stripe_customer_id', subscription.customer);

        if (profiles && profiles[0]) {
          await client
            .from('profiles')
            .update({ subscription_status: 'canceling' })
            .eq('id', profiles[0].id);
        }

        // Update subscriptions table
        await client
          .from('subscriptions')
          .update({ status: 'canceling' })
          .eq('stripe_subscription_id', subscription.id);
      }
    }

    if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      
      // Update profiles table
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

      // Update subscriptions table
      await client
        .from('subscriptions')
        .update({ status: 'inactive' })
        .eq('stripe_subscription_id', subscription.id);
    }

    return { received: true };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
}); 