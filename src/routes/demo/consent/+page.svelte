<script lang="ts">
	import { McpTools, defineKitMcpActionTool } from '$lib/index.js';

	let { form } = $props();

	const tool = defineKitMcpActionTool({
		name: 'delete_item',
		description: 'Delete an item by ID. Requires user confirmation before proceeding.',
		action: '?/deleteItem',
		confirm: 'always',
		inputSchema: {
			type: 'object',
			required: ['id'],
			properties: {
				id: { type: 'string', description: 'Item ID to delete' }
			}
		}
	});
</script>

<McpTools tools={[tool]}>
	<h1>Consent Demo</h1>
	<p>The tool uses <code>confirm: 'always'</code> to require user approval before submitting.</p>

	<form method="POST" action="?/deleteItem">
		<label>
			Item ID
			<input name="id" required />
		</label>

		<button type="submit">Delete Item</button>
	</form>

	{#if form?.ok}
		<p>Deleted item: {form.deleted}</p>
	{/if}
	{#if form?.fieldErrors}
		<p style="color: red;">{JSON.stringify(form.fieldErrors)}</p>
	{/if}
</McpTools>
