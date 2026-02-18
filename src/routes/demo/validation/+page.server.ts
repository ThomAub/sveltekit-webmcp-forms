import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types.js";

export const actions = {
  default: async ({ request }) => {
    const fd = await request.formData();
    const email = String(fd.get("email") ?? "");
    const message = String(fd.get("message") ?? "");

    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email is required";
    else if (!email.includes("@")) errors.email = "Invalid email address";
    if (!message) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
      return fail(400, { fieldErrors: errors, email, message });
    }

    return { ok: true, email, message };
  },
} satisfies Actions;
