import { type ColumnDef } from '@tanstack/table-core';

import { renderComponent } from '$lib/components/data-table/index.js';

import ColumnSortButton from '$lib/components/data-table/ColumnSortButton.svelte';

type GenericColumnProps = {
	title: string;
	accessorKey: string;
	isSortable: boolean;
	isFilterable?: boolean;
};

// Define a generic type for the data
type TData = Record<string, any>;

export function genericColumns(columnOptions: GenericColumnProps[]): ColumnDef<TData>[] {
	// Takes a list of values like [{title: 'Keyword', accessorKey: 'keyword_text', isSortable: true}]
	return columnOptions.map((column) => {
		return {
			accessorKey: column.accessorKey,
			header: column.isSortable
				? ({ column: tableColumn }) =>
						renderComponent(ColumnSortButton, {
							columnTitle: column.title,
							sortDirection: tableColumn.getIsSorted(),
							onclick: () => {
								const currentSort = tableColumn.getIsSorted();
								if (currentSort === false) {
									tableColumn.toggleSorting(false); // Set to ascending
								} else if (currentSort === 'asc') {
									tableColumn.toggleSorting(true); // Set to descending
								} else {
									tableColumn.clearSorting(); // Clear sorting (back to unsorted)
								}
							}
						})
				: column.title
		};
	});
}
