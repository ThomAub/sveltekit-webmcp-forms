<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { WebMcpTool } from '../types.js';
	import { getModelContext } from '../client/model-context.js';

	let { tools, children }: { tools: WebMcpTool[]; children?: Snippet } = $props();

	$effect(() => {
		const mc = getModelContext();
		if (!mc) return;

		for (const t of tools) {
			mc.registerTool(t);
		}

		return () => {
			for (const t of tools) {
				mc.unregisterTool(t.name);
			}
		};
	});
</script>

{#if children}
	{@render children()}
{/if}
