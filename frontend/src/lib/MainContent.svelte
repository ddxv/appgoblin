<script lang="ts">
	import { getContext, onDestroy, setContext } from 'svelte';

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
	}

	type RegisterNestedMain = () => () => void;

	const MAIN_CONTENT_KEY = Symbol('main-content');

	let { children, class: className = '' }: Props = $props();

	let nestedMainCount = $state(0);

	function registerNestedMain() {
		nestedMainCount += 1;
		return () => {
			nestedMainCount -= 1;
		};
	}

	const unregisterFromParent = getContext<RegisterNestedMain | undefined>(MAIN_CONTENT_KEY)?.();

	setContext<RegisterNestedMain>(MAIN_CONTENT_KEY, registerNestedMain);

	onDestroy(() => {
		unregisterFromParent?.();
	});
</script>

<svelte:element this={nestedMainCount === 0 ? 'main' : 'div'} class={className}>
	{@render children?.()}
</svelte:element>
