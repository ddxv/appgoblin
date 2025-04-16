<script lang="ts">
	import type { AppFullDetails } from '../../../../../types';
	import AppKeywordsTable from '$lib/AppKeywordsTable.svelte';
	interface Props {
		data: AppFullDetails;
	}
	let { data }: Props = $props();
</script>

<div class="card preset-filled-surface-100-900 p-2 md:p-8">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<h4 class="h4 md:h3 p-2">App Keywords</h4>
			{#await data.myKeywords}
				Loading keywords...
			{:then keywords}
				{#if keywords && keywords.keyword_scores && keywords.keyword_scores.length > 0}
					<AppKeywordsTable data={keywords.keyword_scores} />
				{:else}
					<p>No keywords found for this app.</p>
				{/if}
			{/await}
		</div>
		{#await data.myapp then myapp}
			<section class="">
				<h4 class="h4 md:h3 p-2">App Description</h4>
				<div>
					<p class="text-strong">{myapp.description_short}</p>
				</div>
				<div>
					<p>{@html myapp.description?.replace(/\r?\n/g, '<br>')}</p>
				</div>
			</section>
		{/await}
	</div>
</div>
