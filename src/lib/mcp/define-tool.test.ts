import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineKitMcpActionTool } from "./define-tool.js";
import type { WebMcpClient } from "../types.js";

// Mock submitToKitAction
vi.mock("../kit/submit.js", () => ({
  submitToKitAction: vi.fn(),
}));

import { submitToKitAction } from "../kit/submit.js";

function mockClient(_confirmResult = true): WebMcpClient {
  return {
    requestUserInteraction: vi.fn(async (cb) => cb()),
  };
}

describe("defineKitMcpActionTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(submitToKitAction).mockResolvedValue({
      actionResult: { type: "success", status: 200, data: { id: "1" } } as any,
      response: { status: 200, ok: true },
    });
  });

  it("creates a tool with name, description, and inputSchema", () => {
    const tool = defineKitMcpActionTool({
      name: "test_tool",
      description: "A test tool",
      action: "?/test",
      inputSchema: { type: "object", properties: { name: { type: "string" } } },
    });

    expect(tool.name).toBe("test_tool");
    expect(tool.description).toBe("A test tool");
    expect(tool.inputSchema).toEqual({ type: "object", properties: { name: { type: "string" } } });
  });

  it("submits to action on success", async () => {
    const tool = defineKitMcpActionTool({
      name: "create",
      description: "Create item",
      action: "?/create",
    });

    const result = await tool.execute({ title: "test" }, mockClient());

    expect(result.type).toBe("success");
    expect(submitToKitAction).toHaveBeenCalledWith(
      "?/create",
      { title: "test" },
      {
        applyToPage: false,
      },
    );
  });

  it("applies normalize before validation", async () => {
    const normalize = vi.fn((input: Record<string, unknown>) => ({
      ...input,
      count: Number(input.count),
    }));

    const tool = defineKitMcpActionTool({
      name: "test",
      description: "Test",
      action: "?/test",
      normalize,
    });

    await tool.execute({ count: "5" }, mockClient());

    expect(normalize).toHaveBeenCalledWith({ count: "5" });
    expect(submitToKitAction).toHaveBeenCalledWith("?/test", { count: 5 }, { applyToPage: false });
  });

  it("returns validation-fail when schema validation fails", async () => {
    const schema = {
      safeParse: () => ({
        success: false,
        error: { issues: [{ path: ["email"], message: "Required" }] },
      }),
    };

    const tool = defineKitMcpActionTool({
      name: "test",
      description: "Test",
      action: "?/test",
      schema,
    });

    const result = await tool.execute({}, mockClient());

    expect(result.type).toBe("validation-fail");
    if (result.type === "validation-fail") {
      expect(result.issues).toEqual([{ path: ["email"], message: "Required" }]);
    }
    expect(submitToKitAction).not.toHaveBeenCalled();
  });

  it("returns cancelled when confirm policy rejects", async () => {
    // Mock window.confirm to return false
    vi.stubGlobal("confirm", () => false);

    const tool = defineKitMcpActionTool({
      name: "delete",
      description: "Delete item",
      action: "?/delete",
      confirm: "always",
    });

    const result = await tool.execute({ id: "1" }, mockClient());

    expect(result.type).toBe("cancelled");
    expect(submitToKitAction).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("proceeds when confirm policy accepts", async () => {
    vi.stubGlobal("confirm", () => true);

    const tool = defineKitMcpActionTool({
      name: "delete",
      description: "Delete item",
      action: "?/delete",
      confirm: "always",
    });

    const result = await tool.execute({ id: "1" }, mockClient());

    expect(result.type).toBe("success");
    vi.unstubAllGlobals();
  });

  it("supports custom confirm function", async () => {
    const confirmFn = vi.fn(async () => false);

    const tool = defineKitMcpActionTool({
      name: "test",
      description: "Test",
      action: "?/test",
      confirm: confirmFn,
    });

    const result = await tool.execute({ x: 1 }, mockClient());

    expect(result.type).toBe("cancelled");
    expect(confirmFn).toHaveBeenCalled();
  });

  it("skips confirm when policy is never", async () => {
    const tool = defineKitMcpActionTool({
      name: "test",
      description: "Test",
      action: "?/test",
      confirm: "never",
    });

    const result = await tool.execute({}, mockClient());

    expect(result.type).toBe("success");
  });

  it("returns error on unexpected exception", async () => {
    vi.mocked(submitToKitAction).mockRejectedValue(new Error("Network failure"));

    const tool = defineKitMcpActionTool({
      name: "test",
      description: "Test",
      action: "?/test",
    });

    const result = await tool.execute({}, mockClient());

    expect(result.type).toBe("error");
    if (result.type === "error") {
      expect(result.error).toBe("Network failure");
    }
  });

  it("passes applyToPage option", async () => {
    const tool = defineKitMcpActionTool({
      name: "test",
      description: "Test",
      action: "?/test",
      applyAction: true,
    });

    await tool.execute({}, mockClient());

    expect(submitToKitAction).toHaveBeenCalledWith("?/test", {}, { applyToPage: true });
  });

  it("supports custom validate function", async () => {
    const customValidate = vi.fn(async () => ({
      ok: false as const,
      issues: [{ message: "Custom error" }],
    }));

    const tool = defineKitMcpActionTool({
      name: "test",
      description: "Test",
      action: "?/test",
      schema: {},
      validate: customValidate,
    });

    const result = await tool.execute({ x: 1 }, mockClient());

    expect(result.type).toBe("validation-fail");
    expect(customValidate).toHaveBeenCalledWith({}, { x: 1 });
  });
});
