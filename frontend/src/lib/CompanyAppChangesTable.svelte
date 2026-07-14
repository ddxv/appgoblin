<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import type { CompanyOverviewApps } from '../types';
	import { formatNumber } from '$lib/utils/formatNumber';

	type Props = {
		android: CompanyOverviewApps[];
		ios: CompanyOverviewApps[];
		companyName?: string;
		previewMode?: boolean;
		statusLabel: string;
	};

	let { android, ios, companyName = '', previewMode = false, statusLabel }: Props = $props();

	const checkIconClass = 'w-4 h-4 text-success-700-300';
	const xIconClass = 'w-4 h-4 text-error-200';

	function tableHasAdsTxt(table: CompanyOverviewApps[]) {
		return !table.every((row) => row.app_ads_direct == false);
	}

	function tableHasPublisher(table: CompanyOverviewApps[]) {
		return !table.every((row) => row.publisher == false);
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	<!-- Android -->
	<div class="rounded-md border border-surface-200-800 bg-surface-50-950/40">
		<div class="border-b border-surface-200-800 px-4 py-3 text-lg font-semibold">
			Recently {statusLabel} Android Apps
		</div>
		{#if android.length > 0}
			<div class="overflow-x-auto">
				<table class="table table-auto w-full text-xs md:text-sm">
					<thead>
						<tr>
							<th class="table-cell-fit"></th>
							<th class="table-cell-fit">App</th>
							<th class="table-cell-fit">Quarter</th>
							<th class="table-cell-fit">Monthly Installs</th>
							<th class="table-cell-fit">SDK</th>
							{#if tableHasPublisher(android)}
								<th class="table-cell-fit">Publisher</th>
							{/if}
							<th class="table-cell-fit">API Calls</th>
							{#if tableHasAdsTxt(android)}
								<th class="table-cell-fit">App-Ads.txt</th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each android as app, i (app.store_id + (app.year ?? '') + (app.quarter ?? ''))}
							<tr class="px-0">
								<td class="table-cell-fit text-gray-500 text-xs md:text-sm">{i + 1}</td>
								<td class="table-cell-fit">
									<a href="/apps/{app.store_id}" style="cursor: pointer;">
										<div class="flex items-center gap-2">
											<img
												src={`https://media.appgoblin.info/app-icons/${app.store_id}/${app.icon_64}`}
												alt={app.name}
												class="w-8 h-8"
											/>
											<div class="flex flex-col">
												{app.name}
												<p class="text-xs text-surface-900-100">{app.developer_name}</p>
											</div>
										</div>
									</a>
								</td>
								<td class="table-cell-fit">Q{app.quarter} {app.year}</td>
								<td class="table-cell-fit">{formatNumber(app.installs_d30)}</td>
								<td class="table-cell-fit">
									{#if app.sdk == true}
										<Check class={checkIconClass} />
									{:else if app.sdk == false}
										<X class={xIconClass} />
									{:else}
										-
									{/if}
								</td>
								{#if tableHasPublisher(android)}
									<td class="table-cell-fit">
										{#if app.publisher == true}
											<Check class={checkIconClass} />
										{:else if app.publisher == false}
											<X class={xIconClass} />
										{:else}
											-
										{/if}
									</td>
								{/if}
								<td class="table-cell-fit">
									{#if app.api_call == true}
										<Check class={checkIconClass} />
									{:else if app.api_call == false}
										<X class={xIconClass} />
									{:else}
										-
									{/if}
								</td>
								{#if tableHasAdsTxt(android)}
									<td class="table-cell-fit">
										{#if app.app_ads_direct == true}
											<Check class={checkIconClass} />
										{:else if app.app_ads_direct == false}
											<X class={xIconClass} />
										{:else}
											-
										{/if}
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if previewMode}
			<p class="p-4 text-sm text-surface-500">Preview data shown only to paid subscribers.</p>
		{:else}
			<p class="p-4 text-sm text-surface-500">
				No Android apps found in this quarterly change list.
			</p>
		{/if}
	</div>

	<!-- iOS -->
	<div class="rounded-md border border-surface-200-800 bg-surface-50-950/40">
		<div class="border-b border-surface-200-800 px-4 py-3 text-lg font-semibold">
			Recently {statusLabel} iOS Apps
		</div>
		{#if ios.length > 0}
			<div class="overflow-x-auto">
				<table class="table table-auto w-full text-xs md:text-sm">
					<thead>
						<tr>
							<th class="table-cell-fit"></th>
							<th class="table-cell-fit">App</th>
							<th class="table-cell-fit">Quarter</th>
							<th class="table-cell-fit">Monthly Installs</th>
							<th class="table-cell-fit">SDK</th>
							{#if tableHasPublisher(ios)}
								<th class="table-cell-fit">Publisher</th>
							{/if}
							{#if tableHasAdsTxt(ios)}
								<th class="table-cell-fit">App-Ads.txt</th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each ios as app, i (app.store_id + (app.year ?? '') + (app.quarter ?? ''))}
							<tr class="px-0">
								<td class="table-cell-fit text-gray-500 text-xs md:text-sm">{i + 1}</td>
								<td class="table-cell-fit">
									<a href="/apps/{app.store_id}" style="cursor: pointer;">
										<div class="flex items-center gap-2">
											<img
												src={`https://media.appgoblin.info/app-icons/${app.store_id}/${app.icon_64}`}
												alt={app.name}
												class="w-8 h-8"
											/>
											<div class="flex flex-col">
												{app.name}
												<p class="text-xs text-surface-900-100">{app.developer_name}</p>
											</div>
										</div>
									</a>
								</td>
								<td class="table-cell-fit">Q{app.quarter} {app.year}</td>
								<td class="table-cell-fit">{formatNumber(app.installs_d30)}</td>
								<td class="table-cell-fit">
									{#if app.sdk == true}
										<Check class={checkIconClass} />
									{:else if app.sdk == false}
										<X class={xIconClass} />
									{:else}
										-
									{/if}
								</td>
								{#if tableHasPublisher(ios)}
									<td class="table-cell-fit">
										{#if app.publisher == true}
											<Check class={checkIconClass} />
										{:else if app.publisher == false}
											<X class={xIconClass} />
										{:else}
											-
										{/if}
									</td>
								{/if}
								{#if tableHasAdsTxt(ios)}
									<td class="table-cell-fit">
										{#if app.app_ads_direct == true}
											<Check class={checkIconClass} />
										{:else if app.app_ads_direct == false}
											<X class={xIconClass} />
										{:else}
											-
										{/if}
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if previewMode}
			<p class="p-4 text-sm text-surface-500">Preview data shown only to paid subscribers.</p>
		{:else}
			<p class="p-4 text-sm text-surface-500">No iOS apps found in this quarterly change list.</p>
		{/if}
	</div>
</div>
