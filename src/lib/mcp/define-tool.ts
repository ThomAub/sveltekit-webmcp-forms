import { submitToKitAction } from "../kit/submit.js";
import { defaultValidate } from "../validation/standard.js";
import type {
  WebMcpTool,
  WebMcpClient,
  JsonSchema,
  ValidateFn,
  ConfirmPolicy,
  ToolResult,
} from "../types.js";

export interface DefineKitMcpActionToolOptions {
  name: string;
  description: string;
  action: string;
  schema?: unknown;
  validate?: ValidateFn;
  inputSchema?: JsonSchema;
  normalize?: (input: Record<string, unknown>) => Record<string, unknown>;
  confirm?: ConfirmPolicy;
  applyAction?: boolean;
}

async function runConfirm(
  policy: ConfirmPolicy | undefined,
  values: Record<string, unknown>,
  client: WebMcpClient,
): Promise<boolean> {
  if (!policy || policy === "never") return true;
  if (policy === "always") {
    return client.requestUserInteraction(async () =>
      confirm(`Allow this action?\n\n${JSON.stringify(values, null, 2)}`),
    );
  }
  return policy(values, client);
}

export function defineKitMcpActionTool(opts: DefineKitMcpActionToolOptions): WebMcpTool {
  const validate = opts.validate ?? defaultValidate;

  return {
    name: opts.name,
    description: opts.description,
    inputSchema: opts.inputSchema,

    async execute(rawInput: Record<string, unknown>, client: WebMcpClient): Promise<ToolResult> {
      try {
        // 1. Normalize
        const values = opts.normalize ? opts.normalize(rawInput) : rawInput;

        // 2. Validate
        if (opts.schema) {
          const v = await validate(opts.schema, values);
          if (!v.ok) {
            return {
              type: "validation-fail",
              content: [{ type: "text", text: "Validation failed." }],
              issues: v.issues,
            };
          }
        }

        // 3. Confirm
        const confirmed = await runConfirm(opts.confirm, values, client);
        if (!confirmed) {
          return {
            type: "cancelled",
            content: [{ type: "text", text: "Cancelled by user." }],
          };
        }

        // 4. Submit
        const { actionResult, response } = await submitToKitAction(opts.action, values, {
          applyToPage: !!opts.applyAction,
        });

        return {
          type: "success",
          content: [{ type: "text", text: `Submitted "${opts.name}" (${response.status}).` }],
          response,
          actionResult,
        };
      } catch (err) {
        return {
          type: "error",
          content: [{ type: "text", text: "Tool execution failed." }],
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
  };
}
