import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "vitest-browser-svelte";
import McpTools from "./McpTools.svelte";

describe("McpTools", () => {
  afterEach(() => {
    delete (navigator as any).modelContext;
  });

  it("registers tools when modelContext is available", async () => {
    const mockContext = {
      registerTool: vi.fn(),
      unregisterTool: vi.fn(),
    };
    (navigator as any).modelContext = mockContext;

    const tool = {
      name: "test_tool",
      description: "A test tool",
      async execute() {
        return {
          type: "success" as const,
          content: [{ type: "text" as const, text: "ok" }],
          response: { status: 200, ok: true },
          actionResult: {},
        };
      },
    };

    render(McpTools, { props: { tools: [tool] } });

    await expect.poll(() => mockContext.registerTool.mock.calls.length).toBe(1);
    expect(mockContext.registerTool).toHaveBeenCalledWith(tool);
  });

  it("does not throw when modelContext is not available", async () => {
    const tool = {
      name: "test_tool",
      description: "A test tool",
      async execute() {
        return {
          type: "success" as const,
          content: [{ type: "text" as const, text: "ok" }],
          response: { status: 200, ok: true },
          actionResult: {},
        };
      },
    };

    // Should not throw
    expect(() => render(McpTools, { props: { tools: [tool] } })).not.toThrow();
  });
});
