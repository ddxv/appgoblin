import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	createTableHook,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSortingFeature,
	tableFeatures
} from '@tanstack/svelte-table';

/**
 * Explicit feature registration — ships only code for features actually
 * imported by the app. Tree-shaking is per-app-bundle, not per-table.
 *
 * `getCoreRowModel` is automatic.
 */
const features = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel()
});

/** Type of the full feature set, for column-def types. */
export type FullFeatures = typeof features;

/** Shared column helper and table factory for the entire app. */
export const { createAppColumnHelper, createAppTable } = createTableHook({
	features
});
