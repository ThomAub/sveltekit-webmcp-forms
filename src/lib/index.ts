// Types
export type {
  WebMcpTool,
  WebMcpClient,
  WebMcpToolContent,
  JsonSchema,
  Issue,
  ValidationResult,
  ValidateFn,
  ConfirmPolicy,
  ToolResult,
  ToolResultSuccess,
  ToolResultValidationFail,
  ToolResultCancelled,
  ToolResultError,
  ModelContext,
} from "./types.js";

// Tool factory
export { defineKitMcpActionTool } from "./mcp/define-tool.js";
export type { DefineKitMcpActionToolOptions } from "./mcp/define-tool.js";

// Validation
export { defaultValidate } from "./validation/standard.js";

// Coercion helpers
export { coerceNumber, coerceBoolean, withDefaults, pipe } from "./coerce/helpers.js";

// WebMCP client
export { getModelContext, isWebMcpAvailable } from "./client/model-context.js";

// SvelteKit action bridge
export { submitToKitAction } from "./kit/submit.js";

// Svelte component
export { default as McpTools } from "./svelte/McpTools.svelte";
