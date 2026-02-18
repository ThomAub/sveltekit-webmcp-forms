import type { ValidateFn } from "../types.js";

export const defaultValidate: ValidateFn = async (schema, input) => {
  const s = schema as Record<string, any>;

  // Standard Schema v1 protocol
  if (s?.["~standard"]?.validate) {
    const out = await s["~standard"].validate(input);
    if (out.issues) {
      return {
        ok: false,
        issues: out.issues.map((i: any) => ({
          path: i.path?.map((p: any) => (typeof p === "object" ? p.key : p)),
          message: i.message,
        })),
      };
    }
    return { ok: true, value: out.value };
  }

  // Zod-compatible fallback
  if (s?.safeParse) {
    const out = s.safeParse(input);
    if (out.success) {
      return { ok: true, value: out.data };
    }
    return {
      ok: false,
      issues: (out.error?.issues ?? []).map((i: any) => ({
        path: i.path,
        message: i.message,
      })),
    };
  }

  throw new Error(
    "No validator found. Pass a Standard Schema object or a Zod-compatible schema, or provide a custom validate function.",
  );
};
