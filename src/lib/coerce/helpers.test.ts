import { describe, it, expect } from "vitest";
import { coerceNumber, coerceBoolean, withDefaults, pipe } from "./helpers.js";

describe("coerceNumber", () => {
  const transform = coerceNumber(["age", "count"]);

  it("converts string numbers", () => {
    expect(transform({ age: "25", count: "3" })).toEqual({ age: 25, count: 3 });
  });

  it("leaves missing keys untouched", () => {
    expect(transform({ name: "alice" })).toEqual({ name: "alice" });
  });

  it("converts non-numeric strings to NaN", () => {
    const result = transform({ age: "abc" });
    expect(result.age).toBeNaN();
  });

  it("handles empty string as 0", () => {
    const result = transform({ age: "" });
    expect(result.age).toBe(0);
  });
});

describe("coerceBoolean", () => {
  const transform = coerceBoolean(["accepted", "enabled"]);

  it("converts truthy string values to true", () => {
    expect(transform({ accepted: "on" })).toEqual({ accepted: true });
    expect(transform({ accepted: "true" })).toEqual({ accepted: true });
    expect(transform({ accepted: "TRUE" })).toEqual({ accepted: true });
    expect(transform({ accepted: "1" })).toEqual({ accepted: true });
  });

  it("converts falsy string values to false", () => {
    expect(transform({ accepted: "off" })).toEqual({ accepted: false });
    expect(transform({ accepted: "false" })).toEqual({ accepted: false });
    expect(transform({ accepted: "0" })).toEqual({ accepted: false });
    expect(transform({ accepted: "" })).toEqual({ accepted: false });
  });

  it("leaves missing keys untouched", () => {
    expect(transform({ name: "alice" })).toEqual({ name: "alice" });
  });
});

describe("withDefaults", () => {
  const transform = withDefaults({ priority: "normal", count: 1 });

  it("fills in missing keys", () => {
    expect(transform({ name: "test" })).toEqual({ priority: "normal", count: 1, name: "test" });
  });

  it("does not override present keys", () => {
    expect(transform({ priority: "high" })).toEqual({ priority: "high", count: 1 });
  });

  it("does not override with undefined", () => {
    expect(transform({ priority: undefined })).toEqual({ priority: "normal", count: 1 });
  });
});

describe("pipe", () => {
  it("composes transforms left-to-right", () => {
    const transform = pipe(coerceNumber(["age"]), withDefaults({ role: "user" }));
    expect(transform({ age: "30" })).toEqual({ age: 30, role: "user" });
  });

  it("handles empty pipe", () => {
    const transform = pipe();
    expect(transform({ a: 1 })).toEqual({ a: 1 });
  });
});
