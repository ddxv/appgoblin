<script lang="ts">
	import { mkConfig, generateCsv, download } from 'export-to-csv';
	import type { Row } from '@tanstack/table-core';
	let { table, filename } = $props();

	const csvConfig = mkConfig({
		fieldSeparator: ',',
		filename: filename, // export file name (without .csv)
		decimalSeparator: '.',
		useKeysAsHeaders: true
	});

	const exportDataCSV = (rows: Row<_>[]) => {
		const rowData = rows.map((row) => row.original);
		const csv = generateCsv(csvConfig)(rowData);
		download(csvConfig)(csv);
	};
</script>

<button
	type="button"
	class="btn btn-sm preset-outlined-primary-100-900 p-0"
	onclick={() => exportDataCSV(table.getFilteredRowModel().rows)}
>
	Download CSV
</button>
