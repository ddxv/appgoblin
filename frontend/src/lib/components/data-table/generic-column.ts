import { type Column, type ColumnDef } from '@tanstack/table-core';

import { renderComponent } from '$lib/components/data-table/index.js';
import type { FullFeatures } from '$lib/components/data-table/features.js';

import ColumnSortButton from '$lib/components/data-table/ColumnSortButton.svelte';

type GenericColumnProps = {
	title: string;
	accessorKey: string;
	isSortable: boolean;
};

type TData = Record<string, any>;

type DefaultFeatures = FullFeatures;

export function genericColumns(
	columnOptions: GenericColumnProps[]
): Array<ColumnDef<DefaultFeatures, TData>> {
	return columnOptions.map((column) => {
		return {
			accessorKey: column.accessorKey,
			header: column.isSortable
				? ({ column: tableColumn }: { column: Column<DefaultFeatures, TData> }) =>
						renderComponent(ColumnSortButton, {
							columnTitle: column.title,
							sortDirection: tableColumn.getIsSorted(),
							onclick: () => {
								const currentSort = tableColumn.getIsSorted();
								if (currentSort === false) {
									tableColumn.toggleSorting(false);
								} else if (currentSort === 'asc') {
									tableColumn.toggleSorting(true);
								} else {
									tableColumn.clearSorting();
								}
							}
						})
				: column.title
		};
	});
}
