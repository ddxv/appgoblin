<script lang="ts">
	import { enhance } from '$app/forms';
	import { Check, Crown, X, ChevronDown, ChevronUp } from 'lucide-svelte';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let titlePadding = 'p-2 md:p-4';
	let contentPadding = 'p-2 md:p-4';

	let loading = $state(false);
	let activePriceKey: string | null = $state(null);
	let showFullComparison = $state(false);

	const plans = [
		{
			key: 'free',
			name: 'Deeper App Insights',
			price: '$0',
			description: 'Indie devs, researchers, casual users',
			included: true,
			highlights: [
				'Core SDK app data & ASO tools',
				'App comparisons & ad intelligence',
				'Request SDK/API scans',
				'Limited API access'
			]
		},
		{
			key: 'b2b_sdk',
			name: 'B2B SDK Intelligence',
			price: '$299',
			period: '/mo',
			description: 'Sales teams, ad networks, agencies',
			b2b: true,
			highlights: [
				'Everything in Free, plus...',
				'Full company/churn API endpoints',
				'Higher API rate limits',
				'App Explorer with SDK filters',
				'Export Company & SDK app datasets'
			]
		},
		{
			key: 'b2b_appads',
			name: 'App-Ads.txt',
			price: '$299',
			period: '/mo',
			description: 'Ad networks, DSPs, SSPs',
			b2b: true,
			highlights: [
				'Everything in Free, plus...',
				'Full company/churn API endpoints',
				'Higher API rate limits',
				'App Explorer with SDK filters',
				'Bulk app-ads.txt datasets'
			]
		},
		{
			key: 'b2b_premium',
			name: 'Premium B2B',
			price: '$499',
			period: '/mo',
			description: 'Larger companies, security teams, ad networks, hedge funds',
			b2b: true,
			featured: true,
			highlights: [
				'Everything in paid plans, plus...',
				'Compliance & security requests',
				'Custom reports & integration',
				'Priority support'
			]
		}
	];

	/** Features that are identical across every tier */
	const commonFeatures = [
		'Advanced SDK app data',
		'Request free SDK/API scans',
		'App Comparisons',
		'ASO keyword dashboard',
		'Ad intelligence',
		'Limited API access'
	];

	/** Features that differentiate the plans */
	const comparisonFeatures = [
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

	/** @param {{ result: import('@sveltejs/kit').ActionResult }} param0 */
	const handleSubscribeResult = async ({
		result
	}: {
		result: import('@sveltejs/kit').ActionResult;
	}) => {
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
			For alternative payment options (Invoice, PayPal, etc.), please reach out to us at <a
				href="mailto:contact@appgoblin.info">contact@appgoblin.info</a
			>.
		</p>

		<p class="text-sm opacity-80 mt-3 max-w-3xl">
			Paid plans are billed monthly. You can cancel anytime, and your access will remain active
			through the end of your current billing period. Payments already made are non-refundable.
		</p>

		<br />

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
				<div
					class="card flex flex-col {plan.featured
						? 'ring-2 ring-primary-500 scale-[1.02] relative'
						: 'preset-outlined-surface-100-900'}"
				>
					{#if plan.featured}
						<div
							class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-primary-50 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap"
						>
							Most Popular
						</div>
					{/if}

					<div class="p-5 flex flex-col gap-3 flex-1">
						<!-- Plan header -->
						<div>
							<p class="text-xs uppercase tracking-wide opacity-60 flex items-center gap-1">
								{#if plan.b2b}
									<Crown class="w-3 h-3 text-primary-900-100" aria-hidden="true" />
								{/if}
								{plan.name}
							</p>
							<p class="text-2xl font-bold leading-tight mt-1">
								{plan.price}<span class="text-sm font-normal opacity-60 ml-1"
									>{plan.period || ''}</span
								>
							</p>
							<p class="text-xs opacity-70 mt-1">{plan.description}</p>
						</div>

						<!-- Highlights -->
						<ul class="space-y-1.5 flex-1">
							{#each plan.highlights as highlight}
								<li class="text-xs flex items-start gap-1.5">
									<Check class="w-3 h-3 mt-0.5 text-success-700-300 shrink-0" aria-hidden="true" />
									<span>{highlight}</span>
								</li>
							{/each}
						</ul>

						<!-- CTA -->
						<div class="mt-auto pt-3">
							{#if plan.included}
								{#if !data?.user}
									<a
										href="/auth/signup?redirectTo=/pricing"
										class="btn preset-outlined-primary w-full"
									>
										Create Free Account
									</a>
								{:else}
									<p class="text-center text-xs opacity-60">Included with your account</p>
								{/if}
							{:else}
								<form
									method="POST"
									action="?/subscribe"
									use:enhance={subscribeEnhance}
									data-price-key={plan.key}
								>
									<input type="hidden" name="priceKey" value={plan.key} />
									<button type="submit" disabled={loading} class="btn preset-tonal-primary w-full">
										{loading && activePriceKey === plan.key ? 'Redirecting...' : 'Get ' + plan.name}
									</button>
								</form>
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
								{plan.price}<span class="text-xs opacity-60 ml-1">{plan.period || ''}</span>
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
							{#if plan.included}
								{#if !data?.user}
									<a href="/auth/signup?redirectTo=/pricing" class="btn preset-tonal-primary w-full"
										>Create Account</a
									>
								{:else}
									<p class="text-center text-xs opacity-60">Included with your account</p>
								{/if}
							{:else}
								<form
									method="POST"
									action="?/subscribe"
									use:enhance={subscribeEnhance}
									data-price-key={plan.key}
								>
									<input type="hidden" name="priceKey" value={plan.key} />
									<button type="submit" disabled={loading} class="btn preset-tonal-primary w-full">
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
					ecosystems, you're welcome to reach out for collaboration.
				</p>
			</div>
		</div>
	</div>
</div>
