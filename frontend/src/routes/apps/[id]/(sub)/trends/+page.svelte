<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import type { AppFullDetails } from '../../../../../types';
	import AppPlot from '$lib/AppPlot.svelte';
	interface Props {
		data: AppFullDetails;
	}
	let { data }: Props = $props();
</script>

{#await data.myhistory}
	Loading historical data...
{:then histdata}
	{#if histdata.plot_data && histdata.plot_data.installs && histdata.plot_data.installs.length > 1}
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<h3 class="h4 md:h3 p-2">Average Daily Installs</h3>
			<AppPlot plotdata={histdata.plot_data.installs} plotType="installs" />
		</div>
	{/if}
	{#if histdata.plot_data && histdata.plot_data.ratings && histdata.plot_data.ratings.length > 1}
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<h3 class="h4 md:h3 p-2">Average Daily Reviews & Ratings</h3>
			<AppPlot plotdata={histdata.plot_data.ratings} plotType="ratings" />
		</div>
	{/if}
	{#if histdata.plot_data && histdata.plot_data.changes && histdata.plot_data.changes.length > 1}
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<h3 class="h4 md:h3 p-2">Rate of Change Week on Week</h3>
			<AppPlot plotdata={histdata.plot_data.changes} plotType="change" />
		</div>
	{/if}
	<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
		<h3 class="h4 md:h3 p-2">App Ratings</h3>
		<Tabs defaultValue="average">
			<Tabs.List>
				<Tabs.Trigger value="average" class="p-0 md:p-8">Total Ratings</Tabs.Trigger>
				<Tabs.Trigger value="new" class="p-0 md:p-8">New Ratings</Tabs.Trigger>
			</Tabs.List>
			{#if histdata.plot_data && histdata.plot_data.ratings_stars && histdata.plot_data.ratings_stars.length > 1}
				<Tabs.Content value="average">
					<AppPlot plotdata={histdata.plot_data.ratings_stars} plotType="ratings_stars" />
					<AppPlot plotdata={histdata.plot_data.ratings_stars} plotType="ratings_stars" />
				</Tabs.Content>
				<Tabs.Content value="new">
					<AppPlot plotdata={histdata.plot_data.ratings_stars_new} plotType="ratings_stars_new" />
				</Tabs.Content>
			{/if}
		</Tabs>
	</div>
{/await}
