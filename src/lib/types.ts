// ---- WebMCP protocol types ----

export interface WebMcpToolContent {
  type: "text";
  text: string;
}

export interface WebMcpClient {
  requestUserInteraction<T>(cb: () => Promise<T>): Promise<T>;
}

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema?: JsonSchema;
  execute(input: Record<string, unknown>, client: WebMcpClient): Promise<ToolResult>;
}

// ---- JSON Schema ----

export type JsonSchema = Record<string, unknown>;

// ---- Validation ----

export interface Issue {
  path?: (string | number)[];
  message: string;
}

export type ValidationResult<T = unknown> = { ok: true; value: T } | { ok: false; issues: Issue[] };

export type ValidateFn = (schema: unknown, input: unknown) => Promise<ValidationResult>;

// ---- Confirm policy ----

export type ConfirmPolicy =
  | "never"
  | "always"
  | ((values: Record<string, unknown>, client: WebMcpClient) => Promise<boolean>);

// ---- Tool results (discriminated union) ----

export interface ToolResultSuccess {
  type: "success";
  content: WebMcpToolContent[];
  response: { status: number; ok: boolean };
  actionResult: unknown;
}

export interface ToolResultValidationFail {
  type: "validation-fail";
  content: WebMcpToolContent[];
  issues: Issue[];
}

export interface ToolResultCancelled {
  type: "cancelled";
  content: WebMcpToolContent[];
}

export interface ToolResultError {
  type: "error";
  content: WebMcpToolContent[];
  error: string;
}

export type ToolResult =
  | ToolResultSuccess
  | ToolResultValidationFail
  | ToolResultCancelled
  | ToolResultError;

// ---- Model context ----

export interface ModelContext {
  registerTool(tool: WebMcpTool): void;
  unregisterTool(name: string): void;
}
