<script lang="ts">
	import { enhance } from '$app/forms';
	import Check from 'lucide-svelte/icons/check';
	import Crown from 'lucide-svelte/icons/crown';
	import X from 'lucide-svelte/icons/x';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import type { BillingCycle } from '$lib/server/stripe';
	import type { PageData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';

	let { data }: { data: PageData } = $props();

	let titlePadding = 'p-2 md:p-4';
	let contentPadding = 'p-2 md:p-4';

	let loading = $state(false);
	let activePriceKey: string | null = $state(null);
	let showFullComparison = $state(false);
	let billingCycle: BillingCycle = $state('monthly');

	const currentPlanIsCancelling = $derived(
		!!data.currentSubscription?.cancel_at &&
			new Date(data.currentSubscription.cancel_at).getTime() > Date.now()
	);

	const currentPlanIsActive = $derived(
		data.currentSubscription?.status === 'active' || data.currentSubscription?.status === 'trialing'
	);

	const formatDate = (date: Date | string | null | undefined) => {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	interface Plan {
		key: string;
		name: string;
		monthlyPrice: string;
		yearlyPrice: string;
		period?: string;
		description: string;
		freeTier?: boolean;
		b2b?: boolean;
		featured?: boolean;
		highlights: string[];
	}

	const plans: Plan[] = [
		{
			key: 'free',
			name: '',
			monthlyPrice: 'Free',
			yearlyPrice: 'Free',
			description: 'Indie devs, casual users',
			freeTier: true,
			highlights: [
				'MAU, Revenue & app metrics',
				'ASO app keyword dash',
				'Track keywords',
				'Creative & ad intelligence'
			]
		},
		{
			key: 'b2b_appads',
			name: 'App-Ads.txt',
			monthlyPrice: '$99',
			yearlyPrice: '$950',
			period: '/mo',
			description: 'Ad networks, DSPs, SSPs',
			b2b: true,
			highlights: ['Everything in Free, plus...', 'Bulk app-ads.txt datasets']
		},
		{
			key: 'b2b_sdk',
			name: 'B2B SDK Intelligence',
			monthlyPrice: '$399',
			yearlyPrice: '$3,850',
			period: '/mo',
			description: 'Sales teams, ad networks, agencies',
			b2b: true,
			featured: true,
			highlights: [
				'Everything in Free, plus...',
				'SDK client app data for all companies',
				'Company apps added/lost report',
				'All B2B company API endpoints',
				'Higher API rate limits',
				'App Explorer & B2B filters'
			]
		},

		{
			key: 'b2b_premium',
			name: 'Premium B2B',
			monthlyPrice: '$599',
			yearlyPrice: '$5,750',
			period: '/mo',
			description: 'Larger companies, security teams, ad networks, hedge funds',
			b2b: true,
			featured: false,
			highlights: [
				'Everything in paid plans, plus...',
				'Compliance & security requests',
				'Custom reports & features',
				'Deeper integration options'
			]
		}
	];

	const getPrice = (plan: (typeof plans)[number]) =>
		billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

	const getPeriod = (plan: (typeof plans)[number]) => {
		if (plan.freeTier) return '';
		return billingCycle === 'yearly' ? '/yr' : (plan.period ?? '/mo');
	};

	/** Features that are identical across every tier */
	const commonFeatures = ['Limited API access', 'Request free SDK/API scans'];

	interface ComparisonFeature {
		category: string;
		name: string;
		free: boolean;
		sdk: boolean;
		appads: boolean;
		b2b: boolean;
	}

	/** Features that differentiate the plans */
	const comparisonFeatures: ComparisonFeature[] = [
		{
			category: 'API Access',
			name: 'API /companies + churn endpoints',
			free: false,
			sdk: true,
			appads: true,
			b2b: true
		},
		{
			category: 'API Access',
			name: 'API higher rate limits',
			free: false,
			sdk: true,
			appads: true,
			b2b: true
		},
		{
			category: 'Premium Tools',
			name: 'App Explorer dash + SDK filters',
			free: false,
			sdk: true,
			appads: true,
			b2b: true
		},
		{
			category: 'Data Export',
			name: 'Export Company / SDK apps',
			free: false,
			sdk: true,
			appads: false,
			b2b: true
		},
		{
			category: 'Data Export',
			name: 'Bulk app-ads.txt datasets',
			free: false,
			sdk: false,
			appads: true,
			b2b: true
		},
		{
			category: 'Enterprise',
			name: 'Compliance & security requests',
			free: false,
			sdk: false,
			appads: false,
			b2b: true
		},
		{
			category: 'Enterprise',
			name: 'Custom reports & integration',
			free: false,
			sdk: false,
			appads: false,
			b2b: true
		}
	];

	const handleSubscribeResult = async ({ result }: { result: ActionResult }) => {
		console.log('Form result:', result);

		if (result.type === 'redirect') {
			console.log('Redirecting to:', result.location);
			window.location.href = result.location;
			return;
		}

		if (result.type === 'failure') {
			console.error('Form failed:', result.data);
		}

		loading = false;
		activePriceKey = null;
	};

	/** @param {{ formElement: HTMLFormElement }} param0 */
	const subscribeEnhance = ({ formElement }: { formElement: HTMLFormElement }) => {
		activePriceKey = formElement.dataset.priceKey ?? null;
		loading = true;

		return handleSubscribeResult;
	};

	const getFeatureValue = (feature: (typeof comparisonFeatures)[0], planKey: string): boolean => {
		if (planKey === 'free') return feature.free;
		if (planKey === 'b2b_sdk') return feature.sdk;
		if (planKey === 'b2b_appads') return feature.appads;
		if (planKey === 'b2b_premium') return feature.b2b;
		return false;
	};
</script>

<svelte:head>
	<title>Pricing - AppGoblin</title>
	<meta
		name="description"
		content="Choose the right AppGoblin plan — free ASO tools, lead generation & market research, ad ops & fraud prevention, or premium B2B analytics for teams."
	/>
	<meta
		name="keywords"
		content="pricing, appgoblin pricing, lead generation, market research, ad ops, fraud prevention, mobile analytics pricing, app market data, aso tools free"
	/>
	<meta property="og:title" content="Pricing - AppGoblin" />
	<meta
		property="og:description"
		content="Free and paid plans for mobile app intelligence — lead gen, market research, ad ops, fraud prevention, and premium B2B analytics."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/pricing" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Pricing - AppGoblin" />
	<meta
		name="twitter:description"
		content="Free and paid plans for mobile app intelligence — lead gen, market research, ad ops, fraud prevention, and premium B2B analytics."
	/>
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info/pricing" />
</svelte:head>

<div class="px-2 lg:px-4 xl:px-16 grid grid-cols-1 gap-4 md:gap-4 lg:gap-8">
	<h1 class="h1 {titlePadding}">Plans & Pricing</h1>
	<div class={contentPadding}>
		<p>
			For Invoices, PayPal or Crypto, please reach out to us at <a
				href="mailto:contact@appgoblin.info">contact@appgoblin.info</a
			>. Yearly invoices receive an additional +5% discount.
		</p>

		<p class="text-sm opacity-80 mt-3 max-w-3xl">
			Paid plans are billed monthly. You can cancel anytime, and your access will remain active
			through the end of your current billing period. Payments already made are non-refundable.
		</p>

		{#if data.user && data.currentPlanKey && data.currentPlanLabel}
			<div
				class="mt-6 card preset-outlined-primary-100-900 p-4 md:p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
			>
				<div class="flex items-start gap-3">
					<span
						class="badge preset-filled-primary-500 text-white rounded-full p-2 shrink-0"
						aria-hidden="true"
					>
						<Sparkles class="w-4 h-4" />
					</span>
					<div>
						<p class="text-sm font-semibold flex items-center gap-1.5">
							<Crown class="w-4 h-4 text-primary-900-100" aria-hidden="true" />
							Your current plan: {data.currentPlanLabel}
							{#if data.currentPlanCycle}
								<span class="text-xs opacity-70 font-normal">
									({data.currentPlanCycle === 'yearly' ? 'Yearly' : 'Monthly'})
								</span>
							{/if}
						</p>
						<p class="text-xs opacity-80 mt-1">
							{#if currentPlanIsCancelling && data.currentSubscription?.cancel_at}
								<span class="text-warning-700-300 font-medium"
									>Cancels on {formatDate(data.currentSubscription.cancel_at)}.</span
								>
								Access remains until then.
							{:else if currentPlanIsActive && data.currentSubscription?.current_period_end}
								Renews on {formatDate(data.currentSubscription.current_period_end)}.
							{:else}
								Status: {data.currentSubscription?.status ?? 'unknown'}.
							{/if}
						</p>
					</div>
				</div>
				<a
					href="/account/subscription"
					class="btn preset-tonal-primary w-full md:w-auto whitespace-nowrap"
				>
					Manage subscription
				</a>
			</div>
		{/if}

		<br />

		<!-- Billing cycle toggle -->
		<div class="flex items-center justify-center gap-3 my-4">
			<span
				class="text-sm font-semibold transition-opacity {billingCycle === 'monthly'
					? 'opacity-100'
					: 'opacity-50'}"
			>
				Monthly
			</span>
			<button
				type="button"
				role="switch"
				aria-checked={billingCycle === 'yearly'}
				aria-label="Toggle between monthly and yearly billing"
				onclick={() => (billingCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly')}
				class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {billingCycle ===
				'yearly'
					? 'bg-primary-500'
					: 'bg-surface-500/40'}"
			>
				<span
					class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {billingCycle ===
					'yearly'
						? 'translate-x-6'
						: 'translate-x-1'}"
				></span>
			</button>
			<span
				class="text-sm font-semibold transition-opacity flex items-center gap-1.5 {billingCycle ===
				'yearly'
					? 'opacity-100'
					: 'opacity-50'}"
			>
				Yearly
				<span class="badge preset-filled-success-500 text-[10px] px-1.5 py-0.5 rounded-full"
					>Save ~20%</span
				>
			</span>
		</div>

		<!-- Included in all plans -->
		<div class="p-5">
			<h3 class="text-sm font-semibold mb-2 flex items-center gap-2">
				<Check class="w-4 h-4 text-success-700-300" aria-hidden="true" />
				Included in all plans
			</h3>
			<div class="flex flex-wrap gap-x-6 gap-y-1.5 text-xs opacity-80">
				{#each commonFeatures as feature}
					<span class="inline-flex items-center gap-1">
						<Check class="w-2.5 h-2.5 text-success-700-300 shrink-0" aria-hidden="true" />
						{feature}
					</span>
				{/each}
			</div>
		</div>

		<!-- Pricing Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
			{#each plans as plan (plan.key)}
				{@const isCurrent = data.currentPlanKey === plan.key}
				<div
					class="card flex flex-col relative {isCurrent
						? 'border-2 border-success-500 rounded-md bg-success-500/5'
						: plan.featured
							? 'border-2 border-primary-100-900 rounded-md'
							: 'preset-outlined-surface-100-900'}"
				>
					{#if plan.featured && !isCurrent}
						<div
							class="badge preset-filled-primary-50-950 rounded-full px-3 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-sm"
						>
							Most Popular
						</div>
					{/if}
					{#if isCurrent}
						<div
							class="badge preset-filled-success-500 text-white rounded-full px-3 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-sm"
						>
							Your current plan
						</div>
					{/if}

					<div class="p-5 flex flex-col gap-3 flex-1">
						<!-- Plan header -->
						<div>
							<p class="uppercase tracking-wide opacity-60 flex items-center gap-1">
								{#if plan.b2b}
									<Crown class="w-3 h-3 text-primary-900-100" aria-hidden="true" />
								{/if}
								{plan.name}
							</p>
							<p class="text-2xl font-bold leading-tight mt-1">
								{getPrice(plan)}<span class="text-sm font-normal opacity-60 ml-1"
									>{getPeriod(plan)}</span
								>
							</p>
							<p class="text-sm opacity-90 mt-1">{plan.description}</p>
						</div>

						<!-- Highlights -->
						<ul class="space-y-1.5 flex-1">
							{#each plan.highlights as highlight}
								<li class="flex items-start gap-1.5">
									<Check class="w-3 h-3 mt-0.5 text-success-700-300 shrink-0" aria-hidden="true" />
									<span>{highlight}</span>
								</li>
							{/each}
						</ul>

						<!-- CTA -->
						<div class="mt-auto pt-3">
							{#if isCurrent}
								<a
									href="/account/subscription"
									class="btn preset-outlined-success-500 w-full"
									aria-label="Manage your {plan.name} subscription"
								>
									Manage subscription
								</a>
							{:else if !plan.freeTier}
								<form
									method="POST"
									action="?/subscribe"
									use:enhance={subscribeEnhance}
									data-price-key={plan.key}
								>
									<input type="hidden" name="priceKey" value={plan.key} />
									<input type="hidden" name="billingCycle" value={billingCycle} />
									<button
										type="submit"
										disabled={loading}
										class="btn preset-tonal-primary w-full"
										data-umami-event="pricing-plan-select"
										data-umami-event-tier={plan.key}
										data-umami-event-cycle={billingCycle}
									>
										{loading && activePriceKey === plan.key ? 'Redirecting...' : 'Get ' + plan.name}
									</button>
								</form>
							{:else}
								<p class="text-xs opacity-70 text-center px-2">
									If you'd like to support AppGoblin, please help to share. Links / socials /
									mentions are all appreciated.
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Collapsible Full Comparison Matrix -->
		<div class="overflow-x-auto">
			<button
				class="flex items-center gap-2 text-sm font-semibold mb-3 cursor-pointer hover:opacity-80 transition-opacity"
				onclick={() => (showFullComparison = !showFullComparison)}
			>
				{showFullComparison ? 'Hide detailed feature comparison' : 'Compare all features'}
				{#if showFullComparison}
					<ChevronUp class="w-4 h-4" aria-hidden="true" />
				{:else}
					<ChevronDown class="w-4 h-4" aria-hidden="true" />
				{/if}
			</button>

			{#if showFullComparison}
				<div
					class="grid gap-px border border-surface-500/20"
					style={`grid-template-columns: 300px repeat(${plans.length}, 1fr); min-width: 780px;`}
				>
					<!-- Plan header row -->
					<div class="p-2 bg-surface-50-950 font-semibold text-xs">Feature</div>
					{#each plans as plan (plan.key)}
						<div
							class="p-2 border-l border-surface-500/20 bg-surface-50-950 text-center {plan.featured
								? 'bg-primary-500/5'
								: ''}"
						>
							<p class="text-xs uppercase tracking-wide opacity-60">
								{plan.name}
							</p>
							<p class="text-base font-semibold leading-tight mt-1">
								{getPrice(plan)}<span class="text-xs opacity-60 ml-1">{getPeriod(plan)}</span>
							</p>
						</div>
					{/each}

					<!-- Common features header -->
					<div class="p-2 bg-surface-100-900 font-semibold text-xs col-span-full">
						Included in all plans
					</div>

					{#each commonFeatures as feature}
						<div class="p-2 bg-surface-50-950 text-xs md:text-sm">{feature}</div>
						{#each plans as plan (plan.key)}
							<div
								class="p-2 border-l border-surface-500/20 bg-surface-50-950 text-center {plan.featured
									? 'bg-primary-500/5'
									: ''}"
							>
								<Check
									class="w-4 h-4 md:w-6 md:h-6 mx-auto text-success-700-300"
									aria-hidden="true"
								/>
								<span class="sr-only">Included</span>
							</div>
						{/each}
					{/each}

					<!-- Differentiating features header -->
					<div class="p-2 bg-surface-100-900 font-semibold text-xs col-span-full">
						Additional features by plan
					</div>

					<!-- Feature rows -->
					{#each comparisonFeatures as feature}
						<!-- Feature name cell -->
						<div class="p-2 bg-surface-50-950 text-xs md:text-sm">{feature.name}</div>

						<!-- Feature checkmark cells -->
						{#each plans as plan (plan.key)}
							{@const hasFeature = getFeatureValue(feature, plan.key)}
							<div
								class="p-2 border-l border-surface-500/20 bg-surface-50-950 text-center {plan.featured
									? 'bg-primary-500/5'
									: ''}"
							>
								{#if hasFeature}
									<Check
										class="w-4 h-4 md:w-6 md:h-6 mx-auto text-success-700-300"
										aria-hidden="true"
									/>
									<span class="sr-only">Included</span>
								{:else}
									<X class="w-3 h-3 md:w-4 md:h-4 mx-auto opacity-20" aria-hidden="true" />
									<span class="sr-only">Not included</span>
								{/if}
							</div>
						{/each}
					{/each}

					<!-- CTA row -->
					<div class="p-2 bg-surface-50-950 font-semibold text-xs">Choose Plan</div>
					{#each plans as plan (plan.key)}
						<div
							class="p-2 border-l border-surface-500/20 bg-surface-50-950 {plan.featured
								? 'bg-primary-500/5'
								: ''}"
						>
							{#if !plan.freeTier}
								<form
									method="POST"
									action="?/subscribe"
									use:enhance={subscribeEnhance}
									data-price-key={plan.key}
								>
									<input type="hidden" name="priceKey" value={plan.key} />
									<input type="hidden" name="billingCycle" value={billingCycle} />
									<button
										type="submit"
										disabled={loading}
										class="btn preset-tonal-primary w-full"
										data-umami-event="pricing-plan-select"
										data-umami-event-tier={plan.key}
										data-umami-event-cycle={billingCycle}
									>
										{loading && activePriceKey === plan.key ? 'Redirecting...' : 'Get ' + plan.name}
									</button>
								</form>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="mt-8 max-w-3xl">
			<div class="card preset-outlined-surface-100-900 p-5 space-y-3">
				<h3 class="text-lg font-semibold">For Researchers, Journalists, and Academics</h3>
				<p class="text-sm">
					AppGoblin supports independent research and journalism. If you're a student, academic
					researcher, or investigative journalist working on mobile advertising, privacy, or app
					ecosystems, please reach out for collaboration.
				</p>
			</div>
		</div>
	</div>
</div>
