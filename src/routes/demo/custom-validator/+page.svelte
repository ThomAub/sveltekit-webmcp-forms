<script lang="ts">
	import { McpTools, defineKitMcpActionTool } from '$lib/index.js';
	import type { ValidateFn } from '$lib/index.js';

	let { form } = $props();

	const customValidate: ValidateFn = async (_schema, input) => {
		const data = input as Record<string, unknown>;
		const username = String(data.username ?? '');
		if (!username) {
			return { ok: false, issues: [{ path: ['username'], message: 'Username is required' }] };
		}
		if (username.length < 3) {
			return {
				ok: false,
				issues: [{ path: ['username'], message: 'Must be at least 3 characters' }]
			};
		}
		return { ok: true, value: { username } };
	};

	const tool = defineKitMcpActionTool({
		name: 'register_user',
		description:
			'Register a username. Uses a custom validate function instead of a schema library.',
		action: '?/default',
		schema: true, // truthy value to trigger validation
		validate: customValidate,
		inputSchema: {
			type: 'object',
			required: ['username'],
			properties: {
				username: { type: 'string', minLength: 3, description: 'Username (min 3 chars)' }
			}
		}
	});
</script>

<McpTools tools={[tool]}>
	<h1>Custom Validator Demo</h1>
	<p>Uses a custom <code>validate</code> function instead of a schema library.</p>

	<form method="POST">
		<label>
			Username
			<input name="username" required minlength="3" />
		</label>

		<button type="submit">Register</button>
	</form>

	{#if form?.ok}
		<p>Registered: {form.username}</p>
	{/if}
	{#if form?.fieldErrors}
		<ul style="color: red;">
			{#each Object.entries(form.fieldErrors) as [field, error]}
				<li>{field}: {error}</li>
			{/each}
		</ul>
	{/if}
</McpTools>
