import { describe, it, expect } from "vitest";
import { defaultValidate } from "./standard.js";

describe("defaultValidate", () => {
  describe("Standard Schema v1 protocol", () => {
    it("returns value on success", async () => {
      const schema = {
        "~standard": {
          validate: (input: unknown) => ({ value: input }),
        },
      };
      const result = await defaultValidate(schema, { name: "test" });
      expect(result).toEqual({ ok: true, value: { name: "test" } });
    });

    it("returns issues on failure", async () => {
      const schema = {
        "~standard": {
          validate: () => ({
            issues: [{ path: [{ key: "email" }], message: "Required" }],
          }),
        },
      };
      const result = await defaultValidate(schema, {});
      expect(result).toEqual({
        ok: false,
        issues: [{ path: ["email"], message: "Required" }],
      });
    });

    it("normalizes path entries that are plain strings", async () => {
      const schema = {
        "~standard": {
          validate: () => ({
            issues: [{ path: ["name"], message: "Too short" }],
          }),
        },
      };
      const result = await defaultValidate(schema, {});
      expect(result).toEqual({
        ok: false,
        issues: [{ path: ["name"], message: "Too short" }],
      });
    });

    it("handles async validate", async () => {
      const schema = {
        "~standard": {
          validate: async (input: unknown) => ({ value: input }),
        },
      };
      const result = await defaultValidate(schema, { x: 1 });
      expect(result).toEqual({ ok: true, value: { x: 1 } });
    });
  });

  describe("Zod-compatible fallback", () => {
    it("returns data on success", async () => {
      const schema = {
        safeParse: (input: unknown) => ({ success: true, data: input }),
      };
      const result = await defaultValidate(schema, { name: "test" });
      expect(result).toEqual({ ok: true, value: { name: "test" } });
    });

    it("returns issues on failure", async () => {
      const schema = {
        safeParse: () => ({
          success: false,
          error: {
            issues: [{ path: ["email"], message: "Invalid email" }],
          },
        }),
      };
      const result = await defaultValidate(schema, {});
      expect(result).toEqual({
        ok: false,
        issues: [{ path: ["email"], message: "Invalid email" }],
      });
    });
  });

  describe("unsupported schema", () => {
    it("throws descriptive error", async () => {
      await expect(defaultValidate({}, {})).rejects.toThrow("No validator found");
    });
  });
});
