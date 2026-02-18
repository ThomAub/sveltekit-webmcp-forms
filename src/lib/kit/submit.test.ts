import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockApplyAction } = vi.hoisted(() => ({
  mockApplyAction: vi.fn(),
}));

vi.mock("$app/forms", () => ({
  deserialize: (text: string) => JSON.parse(text),
  applyAction: mockApplyAction,
}));

import { submitToKitAction } from "./submit.js";

describe("submitToKitAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockApplyAction.mockClear();
  });

  it("builds FormData and POSTs to action", async () => {
    const mockResponse = new Response(JSON.stringify({ type: "success", data: { id: "1" } }), {
      status: 200,
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const result = await submitToKitAction("?/createTicket", {
      title: "Bug report",
      priority: "high",
    });

    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("?/createTicket");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({ "x-sveltekit-action": "true" });

    const body = init?.body as FormData;
    expect(body.get("title")).toBe("Bug report");
    expect(body.get("priority")).toBe("high");

    expect(result.response).toEqual({ status: 200, ok: true });
    expect(result.actionResult).toEqual({ type: "success", data: { id: "1" } });
  });

  it("skips null and undefined values", async () => {
    const mockResponse = new Response(JSON.stringify({ type: "success" }), { status: 200 });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await submitToKitAction("?/test", { a: "yes", b: null, c: undefined });

    const body = vi.mocked(fetch).mock.calls[0][1]?.body as FormData;
    expect(body.get("a")).toBe("yes");
    expect(body.has("b")).toBe(false);
    expect(body.has("c")).toBe(false);
  });

  it("stringifies non-string values", async () => {
    const mockResponse = new Response(JSON.stringify({ type: "success" }), { status: 200 });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await submitToKitAction("?/test", { count: 42, active: true });

    const body = vi.mocked(fetch).mock.calls[0][1]?.body as FormData;
    expect(body.get("count")).toBe("42");
    expect(body.get("active")).toBe("true");
  });

  it("calls applyAction when applyToPage is true", async () => {
    const actionData = { type: "success", data: {} };
    const mockResponse = new Response(JSON.stringify(actionData), { status: 200 });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await submitToKitAction("?/test", {}, { applyToPage: true });

    expect(mockApplyAction).toHaveBeenCalledWith(actionData);
  });

  it("does not call applyAction when applyToPage is false", async () => {
    const mockResponse = new Response(JSON.stringify({ type: "success" }), { status: 200 });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await submitToKitAction("?/test", {});

    expect(mockApplyAction).not.toHaveBeenCalled();
  });
});
