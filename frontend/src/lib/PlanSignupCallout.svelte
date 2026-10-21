<script lang="ts">
	import Crown from '@lucide/svelte/icons/crown';
	import { STRIPE_PLAN_LABELS, type StripePriceKey } from '$lib/plans';

	interface Props {
		planKey: StripePriceKey | null;
		mode: 'signin' | 'signup';
	}

	let { planKey, mode }: Props = $props();
	let planName = $derived(planKey ? STRIPE_PLAN_LABELS[planKey] : 'paid');
</script>

<div class="card border border-surface-100-900 p-6 md:p-8 flex flex-col justify-center space-y-4">
	<h3 class="text-xl md:text-2xl font-bold">
		<Crown class="inline w-5 h-5 mr-1 -mt-0.5 text-primary-900-100" aria-hidden="true" />{mode ===
		'signin'
			? 'Sign in to complete your purchase'
			: 'Create an account to complete your purchase'}
	</h3>
	<p class="text-sm md:text-base leading-relaxed">
		You've selected the <strong>{planName}</strong> plan. Sign in or create an account to continue to
		the secure checkout page.
	</p>
	<div class="pt-4 mt-4 border-t border-surface-100-900 bg-primary-500/5 p-4 rounded-lg">
		<p class="text-sm">
			<span class="font-semibold">What happens next?</span>
			After signing in and verifying your email, you'll be taken directly to our secure payment page to
			complete your <strong>{planName}</strong> subscription.
		</p>
	</div>
</div>
