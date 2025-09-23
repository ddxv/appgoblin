<script lang="ts">
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronsLeft from 'lucide-svelte/icons/chevrons-left';
	import ChevronsRight from 'lucide-svelte/icons/chevrons-right';

	let { tableModel } = $props();
	const buttonSize = 16;
	const buttonPreset = 'btn btn-sm preset-outlined-primary-100-900 p-0';
</script>

<div class="flex items-center justify-between px-2">
	<div class="flex items-center space-x-6 lg:space-x-8">
		<div class="flex items-center space-x-2">
			<button
				type="button"
				class={buttonPreset}
				onclick={() => tableModel.firstPage()}
				disabled={!tableModel.getCanPreviousPage()}
			>
				<span class="sr-only">Go to first page</span>
				<ChevronsLeft size={buttonSize} />
			</button>
			<button
				type="button"
				class={buttonPreset}
				onclick={() => tableModel.previousPage()}
				disabled={!tableModel.getCanPreviousPage()}
			>
				<span class="sr-only">Go to previous page</span>
				<ChevronLeft size={buttonSize} />
			</button>
			<div class="items-center justify-center text-sm font-medium">
				{tableModel.getState().pagination.pageIndex + 1} of {tableModel.getPageCount()}
			</div>
			<button
				type="button"
				class={buttonPreset}
				disabled={!tableModel.getCanNextPage()}
				onclick={() => tableModel.nextPage()}
			>
				<span class="sr-only">Go to next page</span>
				<ChevronRight size={buttonSize} />
			</button>
			<button
				type="button"
				class={buttonPreset}
				disabled={!tableModel.getCanNextPage()}
				onclick={() => tableModel.lastPage()}
			>
				<span class="sr-only">Go to last page</span>
				<ChevronsRight size={buttonSize} />
			</button>
		</div>

		<div class="flex items-center space-x-2">
			<!-- <p class="text-sm font-medium">Rows</p> -->
			<select
				class="select select-sm preset-outlined-primary-100-900 p-1"
				value={String(tableModel.getState().pagination.pageSize)}
				onchange={(e) => tableModel.setPageSize(e.currentTarget.value)}
			>
				<option value="10">10 Rows</option>
				<option value="25">25 Rows</option>
				<option value="50">50 Rows</option>
				<option value="100">100 Rows</option>
			</select>
		</div>
	</div>
</div>
