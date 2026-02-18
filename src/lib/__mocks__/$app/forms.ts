import { vi } from "vitest";

export function deserialize(text: string) {
  return JSON.parse(text);
}

export const applyAction = vi.fn();
