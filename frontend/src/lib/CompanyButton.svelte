<script lang="ts">
	interface Props {
		companyDomain: string;
		companyName?: string;
		companyLogoUrl?: string;
		size?: 'sm' | 'md' | 'lg' | 'logo-only';
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
{:else if size === 'md'}
	<a href={`${baseUrl}/${companyDomain}`}>
		<div
			class="btn preset-tonal hover:preset-tonal-primary hover:underline text-sm md:text-base gap-2"
		>
			{#if companyLogoUrl}
				<img
					src={`https://media.appgoblin.info/${companyLogoUrl}`}
					alt={companyLogoUrl}
					class="w-10 h-10 rounded-sm"
					loading="lazy"
				/>
			{/if}
			{companyName ?? companyDomain}
		</div>
	</a>
{:else if size === 'lg'}
	<a href={`${baseUrl}/${companyDomain}`}>
		<div class="btn preset-tonal hover:preset-tonal-primary text-base md:text-lg gap-4">
			{#if companyLogoUrl}
				<img
					src={`https://media.appgoblin.info/${companyLogoUrl}`}
					alt={companyLogoUrl}
					class="w-20 h-20 rounded-sm"
					loading="lazy"
				/>
			{/if}
			{companyName ?? companyDomain}
		</div>
	</a>
{:else if size === 'logo-only'}
	<a href={`${baseUrl}/${companyDomain}`}>
		<div class="btn preset-tonal px-0 py-0 hover:preset-tonal-primary">
			{#if companyLogoUrl}
				<img
					src={`https://media.appgoblin.info/${companyLogoUrl}`}
					alt={companyLogoUrl}
					class="md:w-14 md:h-14 w-8 h-8 rounded-sm"
					loading="lazy"
				/>
			{/if}
		</div>
	</a>
{/if}
