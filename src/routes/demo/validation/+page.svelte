<script lang="ts">
	import { McpTools, defineKitMcpActionTool, defaultValidate } from '$lib/index.js';

	let { form } = $props();

	// Duck-typed schema (Zod-compatible shape) - no runtime dependency
	const schema = {
		safeParse(input: Record<string, unknown>) {
			const issues: Array<{ path: string[]; message: string }> = [];
			const email = String(input.email ?? '');
			const message = String(input.message ?? '');

			if (!email) issues.push({ path: ['email'], message: 'Email is required' });
			else if (!email.includes('@'))
				issues.push({ path: ['email'], message: 'Invalid email address' });
			if (!message) issues.push({ path: ['message'], message: 'Message is required' });

			if (issues.length > 0) return { success: false, error: { issues } };
			return { success: true, data: { email, message } };
		}
	};

	const tool = defineKitMcpActionTool({
		name: 'submit_contact',
		description: 'Submit a contact form with email and message. Validates input before submitting.',
		action: '?/default',
		schema,
		inputSchema: {
			type: 'object',
			required: ['email', 'message'],
			properties: {
				email: { type: 'string', description: 'Email address' },
				message: { type: 'string', description: 'Contact message' }
			}
		}
	});
</script>

<McpTools tools={[tool]}>
	<h1>Validation Demo</h1>
	<p>Schema validation runs before form submission. Invalid input returns issues to the agent.</p>

	<form method="POST">
		<label>
			Email
			<input name="email" type="email" value={form?.email ?? ''} />
		</label>

		<label>
			Message
			<textarea name="message">{form?.message ?? ''}</textarea>
		</label>

		<button type="submit">Submit</button>
	</form>

	{#if form?.ok}
		<p>Submitted: {form.email}</p>
	{/if}
	{#if form?.fieldErrors}
		<ul style="color: red;">
			{#each Object.entries(form.fieldErrors) as [field, error]}
				<li>{field}: {error}</li>
			{/each}
		</ul>
	{/if}
</McpTools>
