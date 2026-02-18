import { describe, it, expect, vi, afterEach } from "vitest";
import { getModelContext, isWebMcpAvailable } from "./model-context.js";

describe("getModelContext", () => {
  afterEach(() => {
    // Clean up any mock we set
    delete (navigator as any).modelContext;
  });

  it("returns null when modelContext is not present", () => {
    expect(getModelContext()).toBeNull();
  });

  it("returns modelContext when present", () => {
    const mockContext = {
      registerTool: vi.fn(),
      unregisterTool: vi.fn(),
    };
    (navigator as any).modelContext = mockContext;
    expect(getModelContext()).toBe(mockContext);
  });
});

describe("isWebMcpAvailable", () => {
  afterEach(() => {
    delete (navigator as any).modelContext;
  });

  it("returns false when modelContext is not present", () => {
    expect(isWebMcpAvailable()).toBe(false);
  });

  it("returns true when modelContext is present", () => {
    (navigator as any).modelContext = {
      registerTool: vi.fn(),
      unregisterTool: vi.fn(),
    };
    expect(isWebMcpAvailable()).toBe(true);
  });
});
