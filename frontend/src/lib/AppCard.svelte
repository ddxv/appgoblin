<script lang="ts">
	import type { AppFullDetail } from '../types';

	import RatingInstalls from './RatingInstalls.svelte';
	interface Props {
		app: AppFullDetail;
		showHeader: boolean;
	}

	let { app, showHeader = false }: Props = $props();

	function getHeaderImage(app: AppFullDetail) {
		if (app.featured_image_url && app.featured_image_url != 'null') {
			return app.featured_image_url;
		} else if (app.tablet_image_url_1 && app.tablet_image_url_1 != 'null') {
			return app.tablet_image_url_1;
		} else if (app.phone_image_url_1 && app.phone_image_url_1 != 'null') {
			return app.phone_image_url_1;
		}
	}
</script>

<a href={`/apps/${app.store_id}`} class={`card card-hover overflow-hidden col-span-2`}>
	<div>
		<header>
			<div>
				{#if showHeader && getHeaderImage(app)}
					<!-- Show Featured Image (spans 2 cols) -->
					<div class="justify-center">
						<img
							class="h-48 w-full object-top object-none rounded-lg"
							src={getHeaderImage(app)}
							alt={app.name}
							referrerpolicy="no-referrer"
							loading="lazy"
						/>
					</div>
				{:else if showHeader}
					<!-- Show Icon Only (smaller) -->
					<div class="mx-auto block text-center">
						<img
							class="h-48 w-48 rounded-lg mx-auto"
							src={app.icon_url_512}
							alt={app.name}
							referrerpolicy="no-referrer"
							loading="lazy"
						/>
					</div>
				{/if}

				<div class="flex text-left">
					<img
						class="h-24 w-24 p-2 rounded-lg"
						src={app.icon_url_100 || app.icon_url_512}
						alt={app.name}
						referrerpolicy="no-referrer"
						loading="lazy"
					/>
					<RatingInstalls {app} />
				</div>
			</div>
		</header>
	</div>
</a>
