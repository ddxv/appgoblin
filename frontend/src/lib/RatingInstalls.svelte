<script lang="ts">
	import Rating from '$lib/StarsRating.svelte';
	import IconDownload from '$lib/svg/IconDownload.svelte';
	import type { AppFullDetail } from '../types';
	import IconGoogle from './svg/IconGoogle.svelte';
	import IconiOs from './svg/IconiOS.svelte';
	import { formatNumber } from '$lib/utils/formatNumber';

	interface Props {
		app: AppFullDetail;
	}

	let { app }: Props = $props();
</script>

<div class="flex flex-1">
	<div>
		<h5 class="h5 p-2">{app.name}</h5>
		<!-- Ratings: STARS (123) -->
		{#if app.rating_count && app.rating_count != 0}
			<div class="inline-flex p-1 gap-2">
				<Rating total={5} size={20} rating={app.rating} />
				{formatNumber(app.rating_count)} ratings
			</div>
		{/if}
		<!-- Installs DownloadIcon -->
		{#if app.installs && app.installs != 0}
			<div class="block p-0">
				<div class="inline-flex items-center gap-1">
					<IconDownload />
					{formatNumber(app.installs)} installs
				</div>
			</div>
		{/if}
	</div>
	<div class="flex flex-1 items-center justify-center gap-2">
		{#if app.store_link.includes('google.com')}
			<IconGoogle size="20" /> Google Play
		{/if}
		{#if app.store_link.includes('apple.com')}
			<IconiOs size="20" /> Apple Store
		{/if}
	</div>
</div>
