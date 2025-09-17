<script lang="ts">
	import type { AppGroup } from '../types';
	import type { AppFullDetail } from '../types';
	import AppCard from './AppCard.svelte';
	interface Props {
		apps: AppGroup;
	}

	let { apps }: Props = $props();

	function getClass(app: AppFullDetail) {
		return (app.featured_image_url && app.featured_image_url !== 'null') ||
			(app.tablet_image_url_1 && app.tablet_image_url_1 !== 'null')
			? 'col-span-2'
			: '';
	}
</script>

<div class="card p-2 md:p-8">
	<h2 class="h3 md:h2 p-2 md:p-4">Apps: {apps.title}</h2>
	<section class="grid grid-col grid-flow-row md:grid-cols-4 gap-4 md:gap-8">
		{#each apps.apps as app}
			<AppCard {app} showHeader={true} />
		{/each}
	</section>
</div>
