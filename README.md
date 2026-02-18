# sveltekit-webmcp-forms

Expose SvelteKit form actions as [WebMCP](https://docs.google.com/document/d/1rtU1fRPS0bMqd9abMG_hc6K9OAI6soUy3Kh00toAgyk/) tools with zero boilerplate.

[WebMCP](https://docs.google.com/document/d/1rtU1fRPS0bMqd9abMG_hc6K9OAI6soUy3Kh00toAgyk/) is a living web standard that lets AI agents interact with websites through structured tools instead of screen-scraping. Pages register tools via `navigator.modelContext`, and agents discover and invoke them with typed inputs and outputs. The spec is available in Chrome 146+ behind the "WebMCP for testing" flag.

This library bridges WebMCP's imperative API with SvelteKit's form actions: define a tool, point it at an action, and the library handles validation, user confirmation, submission, and registration.

## Install

```sh
npm install sveltekit-webmcp-forms
```

## Quick start

Define a SvelteKit form action as usual:

```ts
// src/routes/demo/+page.server.ts
export const actions = {
  subscribe: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    // ... handle subscription
    return { success: true };
  },
};
```

Wire it up as a WebMCP tool and register it with `<McpTools>`:

```svelte
<!-- src/routes/demo/+page.svelte -->
<script lang="ts">
  import { McpTools, defineKitMcpActionTool } from "sveltekit-webmcp-forms";

  const subscribeTool = defineKitMcpActionTool({
    name: "subscribe",
    description: "Subscribe an email address to the newsletter",
    action: "/demo?/subscribe",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Email address" },
      },
      required: ["email"],
    },
  });
</script>

<McpTools tools={[subscribeTool]} />
```

An AI agent visiting this page will discover the `subscribe` tool via `navigator.modelContext` and can invoke it directly - no DOM scraping needed.

## Features

- **`defineKitMcpActionTool`** - factory that creates a WebMCP tool backed by a SvelteKit form action, with optional validation, input normalization, and user confirmation
- **`<McpTools>`** - Svelte component that registers/unregisters tools on the page's model context
- **Validation** - plug in any schema validator (a default one is included) to validate agent inputs before submission
- **Confirmation** - built-in `"always"` / `"never"` policies or a custom function to gate tool execution behind user consent
- **Coercion helpers** - `coerceNumber`, `coerceBoolean`, `withDefaults`, `pipe` for transforming raw agent inputs into the types your action expects

## API

| Export                     | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `defineKitMcpActionTool()` | Create a WebMCP tool that submits to a SvelteKit action  |
| `<McpTools>`               | Register tools on `navigator.modelContext`               |
| `submitToKitAction()`      | Low-level: POST FormData to a SvelteKit action endpoint  |
| `getModelContext()`        | Access `navigator.modelContext` (returns `null` if unavailable) |
| `isWebMcpAvailable()`      | Check if the browser supports WebMCP                     |
| `defaultValidate()`        | Built-in schema validation function                      |
| `coerceNumber()`           | Coerce string input to number                            |
| `coerceBoolean()`          | Coerce string input to boolean                           |
| `withDefaults()`           | Apply default values to missing fields                   |
| `pipe()`                   | Compose multiple normalization functions                 |

## License

[MIT](LICENSE)
