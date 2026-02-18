import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types.js";

export const actions = {
  default: async ({ request }) => {
    const fd = await request.formData();
    const username = String(fd.get("username") ?? "");

    if (!username) return fail(400, { fieldErrors: { username: "Required" } });
    if (username.length < 3)
      return fail(400, { fieldErrors: { username: "Must be at least 3 characters" } });

    return { ok: true, username };
  },
} satisfies Actions;
