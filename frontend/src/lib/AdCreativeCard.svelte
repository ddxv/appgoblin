<script lang="ts">
	interface CreativeCluster {
		vhash: string;
		file_extension: string;
		representative_md5: string;
		unique_publisher_apps: number;
		unique_advertisers: number;
		unique_adv_names: number;
		unique_pub_names: number;
		unique_ad_networks: number;
		unique_ad_domains: number;
		unique_mmps: number;
		
		top_adv_name: string | null;
		top_advertiser_store_id: string | null;
		top_pub_name: string | null;
		top_host_domain: string | null;
		top_host_domain_company: string | null;
		top_ad_domain: string | null;
		top_ad_domain_company: string | null;
		top_mmp_name: string | null;
		top_mmp_domain: string | null;
		
		adv_icon_url: string | null;
		pub_icon_url: string | null;
		
		first_seen_at: string;
		last_seen_at: string;
		creative_thumb_url: string;
	}

	import { createCreativeModal } from '$lib/stores/creativeModal.svelte';
	import CreativeModal from '$lib/CreativeModal.svelte';
	import CompanyButton from '$lib/CompanyButton.svelte';

	let { data }: { data: CreativeCluster } = $props();

	// If the file is video, construct proper video URL, otherwise use image
	let isVideo = $derived(['mp4', 'webm'].includes(data.file_extension.toLowerCase()));
	let mediaUrl = $derived(`https://media.appgoblin.info/creatives/${data.representative_md5}.${data.file_extension}`);

	let isHovered = $state(false);

	const creativeModal = createCreativeModal();
</script>

<!-- Creative Modal -->
<CreativeModal
	bind:isOpen={creativeModal.isOpen}
	creativeUrl={creativeModal.creativeUrl}
	title={creativeModal.title}
/>

<div 
	class="card card-hover overflow-hidden rounded-xl border border-surface-200-700-token bg-surface-50-900-token shadow-sm transition-all flex h-full flex-col"
	role="group"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<!-- Media Display area -->
	<button 
		class="relative bg-black w-full overflow-hidden flex items-center justify-center cursor-pointer group"
		onclick={() => creativeModal.open(data.representative_md5, data.file_extension, data.top_adv_name || data.top_advertiser_store_id || 'Creative')}
		aria-label="View Media"
	>
		{#if isVideo}
			{#if isHovered}
				<video
					src={mediaUrl}
					class="w-full h-auto object-contain"
					autoplay
					muted
					loop
					playsinline
				></video>
			{:else}
				<img 
					src={data.creative_thumb_url} 
					alt={data.vhash}
					class="w-full h-auto object-contain opacity-90 transition-opacity"
					onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
				/>
				<!-- Play icon overlay -->
				<div class="absolute inset-0 flex flex-col items-center justify-center opacity-70 group-hover:bg-black/30 transition-all duration-300">
					<div class="bg-primary-500 rounded-full p-2 md:p-3">
						<svg class="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z" />
						</svg>
					</div>
				</div>
			{/if}
		{:else}
			<img 
				src={mediaUrl} 
				alt={data.vhash}
				class="w-full h-auto object-contain"
				onerror={(e) => ((e.currentTarget as HTMLImageElement).src = data.creative_thumb_url)}
			/>
			<div class="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/30 transition-all duration-300">
				<div class="bg-primary-500 rounded-full p-2 md:p-3 opacity-90">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
				</div>
			</div>
		{/if}
		
		<div class="absolute top-2 right-2 z-10">
			<span class="badge variant-filled-surface text-xs font-semibold shadow-sm uppercase opacity-90">
				{data.file_extension}
			</span>
		</div>
	</button>

	<!-- Info Area -->
	<div class="p-4 flex-grow flex flex-col justify-between">
		<div>
			<!-- Advertiser Details -->
			<div class="flex items-center gap-3 mb-3">
				{#if data.adv_icon_url}
					<img src={data.adv_icon_url} class="w-10 h-10 rounded shadow-sm flex-shrink-0" alt="adv icon" />
				{:else}
					<div class="w-10 h-10 rounded bg-surface-300-600-token flex-shrink-0 flex items-center justify-center text-xs opacity-50">App</div>
				{/if}
				<div class="overflow-hidden">
					<a
						href={data.top_advertiser_store_id ? `/apps/${data.top_advertiser_store_id}` : '#'}
						class="font-bold text-sm hover:text-primary-500 truncate block"
						title={data.top_adv_name || data.top_advertiser_store_id || 'Unknown Advertiser'}
					>
						{data.top_adv_name || data.top_advertiser_store_id || 'Unknown Advertiser'}
					</a>
					<div class="text-xs opacity-70 mt-1 flex flex-col gap-1 items-start">
						{#if data.top_ad_domain_company || data.top_ad_domain}
							<CompanyButton companyName={data.top_ad_domain_company || 'Ad'} companyDomain={data.top_ad_domain || ''} size="sm" />
						{:else if data.top_host_domain_company || data.top_host_domain}
							<CompanyButton companyName={data.top_host_domain_company || 'Network'} companyDomain={data.top_host_domain || ''} size="sm" />
						{/if}
					</div>
				</div>
			</div>
			
			<!-- Publisher / Reach context -->
			<div class="text-xs bg-surface-100-800-token p-2 rounded flex flex-col gap-1">
				<div class="flex justify-between items-center text-surface-600-300-token">
					<span>Unique Publishers:</span>
					<span class="font-bold">{data.unique_publisher_apps}</span>
				</div>
				<div class="flex justify-between items-center text-surface-600-300-token">
					<span>Seen recently:</span>
					<span>{data.last_seen_at?.split('T')[0]}</span>
				</div>
			</div>
		</div>
	</div>
</div>
