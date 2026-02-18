import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types.js";

export const actions = {
  createTicket: async ({ request }) => {
    const fd = await request.formData();
    const title = String(fd.get("title") ?? "");
    const priority = String(fd.get("priority") ?? "normal");

    if (!title) return fail(400, { fieldErrors: { title: "Required" } });

    return { ok: true, id: crypto.randomUUID(), title, priority };
  },
} satisfies Actions;
