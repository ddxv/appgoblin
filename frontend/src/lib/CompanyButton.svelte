<script lang="ts">
	interface Props {
		companyDomain: string;
		companyName?: string;
		companyLogoUrl?: string | null;
		size?: 'sm' | 'md';
	}

	let { companyName, companyDomain, companyLogoUrl, size = 'md' }: Props = $props();
	const baseUrl = '/companies';
</script>

{#if size === 'sm'}
	<a href={`${baseUrl}/${companyDomain}`}>
		<div class="btn preset-tonal hover:preset-tonal-primary text-xs md:text-sm">
			{companyName ?? companyDomain}
		</div>
	</a>
{/if}
{#if size === 'md'}
	<a href={`${baseUrl}/${companyDomain}`}>
		<div class="btn preset-tonal hover:preset-tonal-primary text-sm md:text-base">
			{#if companyLogoUrl}
				<img
					src={`https://media.appgoblin.info/${companyLogoUrl}`}
					alt={companyLogoUrl}
					class="w-10 h-10 rounded-sm"
				/>
			{/if}
			{companyName ?? companyDomain}
		</div>
	</a>
{/if}
