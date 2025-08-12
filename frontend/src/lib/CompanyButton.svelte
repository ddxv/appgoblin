<script lang="ts">
	interface Props {
		companyName: string;
		companyDomain: string;
		size?: 'sm' | 'md';
	}

	let { companyName, companyDomain, size = 'md' }: Props = $props();
	const baseUrl = '/companies';
</script>

{#if size === 'sm'}
	<a href={`${baseUrl}/${companyDomain}`}>
		<div class="btn preset-tonal hover:preset-tonal-primary text-xs md:text-sm">
			{companyName}
		</div>
	</a>
{/if}
{#if size === 'md'}
	<a href={`${baseUrl}/${companyDomain}`}>
		<div class="btn preset-tonal hover:preset-tonal-primary text-sm md:text-base">
			{companyName}
		</div>
	</a>
{/if}
