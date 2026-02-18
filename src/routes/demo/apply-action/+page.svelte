<script lang="ts">
	import { McpTools, defineKitMcpActionTool } from '$lib/index.js';

	let { data, form } = $props();

	const tool = defineKitMcpActionTool({
		name: 'add_comment',
		description: 'Add a comment. Uses applyAction to update the page UI after submission.',
		action: '?/addComment',
		applyAction: true,
		inputSchema: {
			type: 'object',
			required: ['text'],
			properties: {
				text: { type: 'string', description: 'Comment text' }
			}
		}
	});
</script>

<McpTools tools={[tool]}>
	<h1>Apply Action Demo</h1>
	<p>Uses <code>applyAction: true</code> so the page updates after the tool submits.</p>

	<h2>Comments</h2>
	<ul>
		{#each data.comments as comment}
			<li>{comment.text}</li>
		{/each}
	</ul>

	<form method="POST" action="?/addComment">
		<label>
			New comment
			<input name="text" required />
		</label>

		<button type="submit">Add Comment</button>
	</form>

	{#if form?.ok}
		<p>Added: {form.comment.text}</p>
	{/if}
	{#if form?.fieldErrors}
		<p style="color: red;">{JSON.stringify(form.fieldErrors)}</p>
	{/if}
</McpTools>
