<script lang="ts">
	import IconiOS from './svg/IconiOS.svelte';
	import IconGoogle from './svg/IconGoogle.svelte';
	import type { SideBarCategoryItem } from '../types';

	const buttonSelectedColor = 'p-1 preset-filled-secondary-100-900';
	const buttonDeselectedColor = 'p-1';

	interface Props {
		values: SideBarCategoryItem;
		selectedCategory: string;
	}

	let { values, selectedCategory: selectedCategory = $bindable() }: Props = $props();

	let isSelected = $derived(checkSelected());

	function checkSelected() {
		return selectedCategory == values.id;
	}

	function setSelectedClass(isSelected: boolean) {
		return isSelected ? buttonSelectedColor : buttonDeselectedColor;
	}

	function getCount(value: boolean | number): string | null {
		return typeof value === 'number' ? value.toLocaleString() : null;
	}

	let androidCount = $derived(getCount(values.android));
	let iosCount = $derived(getCount(values.ios));
</script>

<div class="flex w-full justify-between p-1 {setSelectedClass(isSelected)}">
	<div class="grow">
		{values.name}
	</div>

	{#if values.android || values.name == 'Games'}
		<div class="flex items-center justify-end mr-2 md:mr-5 gap-1">
			<IconGoogle size="16" />
			{#if androidCount}
				<span class="text-xs tabular-nums">{androidCount}</span>
			{/if}
		</div>
	{:else}
		<div class="opacity-20 flex items-center justify-end mr-2 md:mr-5 gap-1">
			<IconGoogle size="16" />
			{#if androidCount}
				<span class="text-xs tabular-nums">{androidCount}</span>
			{/if}
		</div>
	{/if}
	{#if values.ios}
		<div class="flex items-center justify-end mr-2 md:mr-5 gap-1">
			<IconiOS size="16" />
			{#if iosCount}
				<span class="text-xs tabular-nums">{iosCount}</span>
			{/if}
		</div>
	{:else}
		<div class="opacity-20 flex items-center justify-end mr-2 md:mr-5 gap-1">
			<IconiOS size="16" />
			{#if iosCount}
				<span class="text-xs tabular-nums">{iosCount}</span>
			{/if}
		</div>
	{/if}
</div>
