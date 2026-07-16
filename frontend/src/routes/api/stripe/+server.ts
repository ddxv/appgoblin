import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/auth/db';
import type { RequestHandler } from './$types';

import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	console.log('Stripe webhook request received');
	const body = await request.text();
	const sig = request.headers.get('stripe-signature');

	let event;

	if (STRIPE_WEBHOOK_SECRET && sig) {
		try {
			event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
		} catch (err: any) {
			console.error(`Webhook signature verification failed.`, err);
			return new Response(`Webhook Error: ${err.message}`, { status: 400 });
		}
	} else {
		return new Response('Webhook signature missing or invalid', { status: 400 });
	}

	try {
		console.log('Stripe webhook event verified', event.id, event.type);
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object;
				await handleCheckoutSessionCompleted(session);
				break;
			}
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted': {
				const subscription = event.data.object;
				await handleSubscriptionUpdated(subscription, event.created);
				break;
			}
			default:
				console.log(`Unhandled event type ${event.type}`);
		}
	} catch (err) {
		console.error('Error handling webhook event:', err);
		return new Response('Error handling event', { status: 500 });
	}

	return new Response(JSON.stringify({ received: true }), { status: 200 });
};

async function handleCheckoutSessionCompleted(session: any) {
	console.log('Handling checkout session completed', session.id);
	const customerId = session.customer;
	const subscriptionId = session.subscription;

	if (session.mode === 'subscription' && typeof subscriptionId === 'string') {
		console.log('Retrieving subscription', subscriptionId);
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);
		await handleSubscriptionUpdated(subscription);
	} else {
		console.log(
			'Session mode is not subscription or subscriptionId missing',
			session.mode,
			subscriptionId
		);
	}
}

async function handleSubscriptionUpdated(subscription: any, eventCreatedAt?: number) {
	console.log('Handling subscription updated', subscription.id);

	const customerId = subscription.customer as string;
	const status = subscription.status;
	const cancelAtPeriodEnd = Boolean(subscription.cancel_at_period_end);
	const lineItem = subscription.items?.data?.[0];
	const priceId = lineItem?.price?.id;
	if (!priceId) {
		console.error('Subscription missing price ID');
		return;
	}

	const currentPeriodStartVal =
		subscription.current_period_start ?? subscription.items.data[0]?.current_period_start;
	const currentPeriodEndVal =
		subscription.current_period_end ?? subscription.items.data[0]?.current_period_end;

	if (!currentPeriodStartVal || !currentPeriodEndVal) {
		console.error('Subscription missing period dates', {
			currentPeriodStartVal,
			currentPeriodEndVal
		});
	}

	const currentPeriodStart = currentPeriodStartVal
		? new Date(currentPeriodStartVal * 1000)
		: new Date();
	const currentPeriodEnd = currentPeriodEndVal ? new Date(currentPeriodEndVal * 1000) : new Date();

	const cancelAtUnix = cancelAtPeriodEnd
		? (currentPeriodEndVal ?? null)
		: (subscription.cancel_at ??
			subscription.ended_at ??
			subscription.canceled_at ??
			(status === 'canceled' ? currentPeriodEndVal : null));
	const cancelRequestedAtUnix = cancelAtPeriodEnd
		? (subscription.canceled_at ?? eventCreatedAt ?? null)
		: status === 'canceled'
			? (subscription.canceled_at ?? eventCreatedAt ?? null)
			: null;
	const cancelAt = cancelAtUnix ? new Date(cancelAtUnix * 1000) : null;
	const cancelRequestedAt = cancelRequestedAtUnix ? new Date(cancelRequestedAtUnix * 1000) : null;

	console.log('Looking up user for customer', customerId);
	// Find user by provider_customer_id
	let user = await db.queryOne<{ id: number }>(
		'SELECT id FROM users WHERE provider_customer_id = $1',
		[customerId]
	);

	// Fallback: Check metadata or email
	if (!user) {
		console.log('User not found by provider_customer_id, checking metadata/email');

		// Retrieve customer to get email if not in subscription (it usually is in subscription.customer_email but safer to check customer)
		const customer = (await stripe.customers.retrieve(customerId)) as any;
		const email = customer.email;
		const userIdFromMeta = customer.metadata?.userId;

		console.log('Customer details:', { email, userIdFromMeta });

		if (userIdFromMeta) {
			user = await db.queryOne<{ id: number }>('SELECT id FROM users WHERE id = $1', [
				userIdFromMeta
			]);
		}

		if (!user && email) {
			user = await db.queryOne<{ id: number }>('SELECT id FROM users WHERE email = $1', [email]);
		}

		if (user) {
			console.log('User found via fallback, linking provider_customer_id', user.id);
			// Link them now
			await db.execute('UPDATE users SET provider_customer_id = $1 WHERE id = $2', [
				customerId,
				user.id
			]);
		}
	}

	if (!user) {
		console.error('User not found for stripe customer:', customerId);
		return;
	}

	// Resolve the tier_price_id from the Stripe price ID
	const tierPriceRow = await db.queryOne<{ id: number }>(
		`SELECT id FROM public.tier_prices WHERE provider_price_id = $1`,
		[priceId]
	);
	if (!tierPriceRow) {
		console.error('Unknown Stripe price ID — add to tier_prices table:', priceId);
	}
	const tierPriceId = tierPriceRow?.id ?? null;

	console.log('Upserting subscription for user', user.id);
	// Upsert subscription (provider_price_id/product_id live on tier_prices now)
	await db.execute(
		`
        INSERT INTO subscriptions (
            user_id, provider_subscription_id, provider_customer_id,
            status, current_period_start, current_period_end, cancel_at, cancel_requested_at,
            seats_total, updated_at, tier_price_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, NOW(), $9)
        ON CONFLICT (provider_subscription_id) DO UPDATE SET
            status = EXCLUDED.status,
            current_period_start = EXCLUDED.current_period_start,
            current_period_end = EXCLUDED.current_period_end,
            cancel_at = EXCLUDED.cancel_at,
            cancel_requested_at = EXCLUDED.cancel_requested_at,
            tier_price_id = COALESCE(EXCLUDED.tier_price_id, subscriptions.tier_price_id),
            updated_at = NOW();
    `,
		[
			user.id,
			subscription.id,
			customerId,
			status,
			currentPeriodStart,
			currentPeriodEnd,
			cancelAt,
			cancelRequestedAt,
			tierPriceId
		]
	);
	console.log('Subscription upserted');
}
