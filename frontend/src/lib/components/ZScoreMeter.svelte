<script lang="ts">
	import { formatNumber } from '$lib/utils/formatNumber';

	type ZScoreMeterProps = {
		value: number;
		min?: number;
		max?: number;
		showValue?: boolean;
		size?: 'sm' | 'md' | 'lg';
	};

	let { value, min = 100, max = 5000, showValue = true, size = 'md' }: ZScoreMeterProps = $props();

	// Calculate percentage for the meter (0-100%)
	const percentage = $derived(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)));

	// Determine performance level and color
	const performanceLevel = $derived(
		(() => {
			if (percentage >= 90)
				return {
					level: 'High Growth!',
					color: 'bg-success-900-100',
					textColor: 'text-success-900-100'
				};
			if (percentage >= 75)
				return {
					level: 'Excellent',
					color: 'bg-success-700-300',
					textColor: 'text-success-300-300'
				};
			if (percentage >= 60)
				return {
					level: 'Very Good',
					color: 'bg-success-500',
					textColor: 'text-success-500'
				};
			if (percentage >= 40)
				return { level: 'Good', color: 'bg-success-400-600', textColor: 'text-success-400-600' };
			if (percentage >= 25)
				return { level: 'Average', color: 'bg-success-100-900', textColor: 'text-success-100-900' };
			return { level: 'OK', color: 'bg-success-100-900', textColor: 'text-success-100-900' };
		})()
	);

	// Size classes
	const sizeClasses = $derived({
		sm: 'h-2 text-xs',
		md: 'h-3 text-sm',
		lg: 'h-4 text-base'
	});
</script>

<div class="flex flex-col space-y-1">
	{#if showValue}
		<div class="flex justify-between items-center">
			<span class="text-xs font-medium {performanceLevel.textColor}">
				{performanceLevel.level}
			</span>
			<span class="text-xs text-surface-600-300 font-mono">
				{formatNumber(value)}
			</span>
		</div>
	{/if}

	<div class="relative">
		<!-- Background bar -->
		<div class="w-full bg-surface-200-700 rounded-full {sizeClasses[size]}">
			<!-- Progress bar -->
			<div
				class="h-full rounded-full transition-all duration-300 ease-out {performanceLevel.color}"
				style="width: {percentage}%"
			></div>
		</div>

		<!-- Performance indicators -->
		<div class="flex justify-between mt-1">
			<!-- <span class="text-xs text-surface-500-400">Low</span> -->
			<!-- <span class="text-xs text-surface-500-400">High</span> -->
		</div>
	</div>
</div>
