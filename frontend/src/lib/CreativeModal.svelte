<script lang="ts">
	let { isOpen = $bindable(false), creativeUrl = '', title = '' } = $props();

	// Determine if the file is an image based on the URL extension
	let isImage = $derived(/\.(png|jpe?g|gif|webp|bmp)$/i.test(creativeUrl));
	let isVideo = $derived(/\.(mp4|webm|ogg|avi|mov)$/i.test(creativeUrl));

	function closeModal() {
		isOpen = false;
		document.body.style.overflow = 'auto';
	}

	function openModal() {
		document.body.style.overflow = 'hidden';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	// Watch for isOpen changes to handle body scroll
	$effect(() => {
		if (isOpen) {
			openModal();
		} else {
			closeModal();
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Enter' && closeModal()}
		aria-modal="true"
		role="dialog"
		aria-labelledby="media-title"
		tabindex="-1"
	>
		<div class="relative w-full max-w-6xl" onclick={(e) => e.stopPropagation()} role="presentation">
			<!-- Close button -->
			<button
				type="button"
				class="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
				onclick={closeModal}
				aria-label="Close media"
			>
				×
			</button>

			<!-- Media content -->
			{#if isImage}
				<img
					src={creativeUrl}
					alt={title || 'Creative image'}
					class="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
					id="media-title"
				/>
			{:else if isVideo}
				<video
					src={creativeUrl}
					controls
					autoplay
					muted
					class="w-full h-auto rounded-lg shadow-2xl"
					id="media-title"
				>
					Your browser does not support the video tag.
				</video>
			{:else}
				<!-- Fallback for unsupported file types -->
				<div class="bg-gray-800 rounded-lg p-8 text-center">
					<p class="text-white text-lg mb-4">Unsupported file type</p>
					<a
						href={creativeUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-400 hover:text-blue-300 underline"
					>
						Open file in new tab
					</a>
				</div>
			{/if}

			<!-- Title if provided -->
			{#if title}
				<div class="text-white text-center mt-4 text-lg font-medium">
					{title}
				</div>
			{/if}
		</div>
	</div>
{/if}
