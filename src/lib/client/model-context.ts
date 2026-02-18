import type { ModelContext } from "../types.js";

export function getModelContext(): ModelContext | null {
  if (typeof globalThis.navigator === "undefined") return null;
  return (navigator as any).modelContext ?? null;
}

export function isWebMcpAvailable(): boolean {
  return getModelContext() !== null;
}
