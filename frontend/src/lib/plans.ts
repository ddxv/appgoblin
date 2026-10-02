export type BillingCycle = 'monthly' | 'yearly';

/** Known tier slugs that can be subscribed to. */
export type StripePriceKey = 'b2b_sdk' | 'b2b_appads' | 'b2b_premium';

export const SUBSCRIBE_PLAN_KEYS: StripePriceKey[] = ['b2b_sdk', 'b2b_appads', 'b2b_premium'];

/** Human-readable label for a plan. */
export const STRIPE_PLAN_LABELS: Record<StripePriceKey, string> = {
	b2b_sdk: 'Business SDK',
	b2b_appads: 'App-Ads.txt',
	b2b_premium: 'Premium B2B'
};

export function parseSubscribeIntent(redirectTo: string | null | undefined) {
	if (!redirectTo?.startsWith('/pricing?subscribe=')) return null;

	const params = new URLSearchParams(redirectTo.slice('/pricing?'.length));
	const plan = params.get('subscribe');
	if (!plan || !SUBSCRIBE_PLAN_KEYS.includes(plan as StripePriceKey)) return null;

	return {
		plan: plan as StripePriceKey,
		cycle: params.get('cycle') === 'yearly' ? ('yearly' as const) : ('monthly' as const)
	};
}
