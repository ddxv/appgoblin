<script lang="ts">
	interface Props {
		companyName: string;
		companyDomain: string;
	}

	let { companyName, companyDomain }: Props = $props();
	const baseUrl = '/companies';
</script>

<a href={`${baseUrl}/${companyDomain}`}>
	<div class="btn preset-tonal hover:preset-tonal-primary text-sm md:text-base">
		{companyName}
	</div>
</a>
