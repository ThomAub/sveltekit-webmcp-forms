<script lang="ts">
	import { McpTools, defineKitMcpActionTool } from '$lib/index.js';

	let { form } = $props();

	const tool = defineKitMcpActionTool({
		name: 'create_ticket',
		description: 'Create a support ticket with a title and priority level.',
		action: '?/createTicket',
		inputSchema: {
			type: 'object',
			required: ['title'],
			properties: {
				title: { type: 'string', description: 'Ticket title' },
				priority: { type: 'string', enum: ['low', 'normal', 'high'] }
			}
		}
	});
</script>

<McpTools tools={[tool]}>
	<h1>Basic Demo</h1>
	<p>A simple form action exposed as a WebMCP tool.</p>

	<form method="POST" action="?/createTicket">
		<label>
			Title
			<input name="title" required />
		</label>

		<label>
			Priority
			<select name="priority">
				<option value="low">Low</option>
				<option value="normal" selected>Normal</option>
				<option value="high">High</option>
			</select>
		</label>

		<button type="submit">Create Ticket</button>
	</form>

	{#if form?.ok}
		<p>Ticket created: {form.id} ({form.title}, {form.priority})</p>
	{/if}
	{#if form?.fieldErrors}
		<p style="color: red;">{JSON.stringify(form.fieldErrors)}</p>
	{/if}
</McpTools>
