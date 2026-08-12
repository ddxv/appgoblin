<!-- Lazy-loaded wrapper for CompaniesBarChart to avoid preloading layerchart CSS on the frontpage -->
<script lang="ts">
	import { onMount } from 'svelte';

	type TopCompanyPoint = {
		group: string;
		value: number;
		company_domain?: string | null;
		company_logo_url?: string | null;
	};

	interface Props {
		plotData: TopCompanyPoint[];
	}

	let { plotData }: Props = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let ChartComponent: any = $state(undefined);
</script>
