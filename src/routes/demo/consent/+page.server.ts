import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types.js";

export const actions = {
  deleteItem: async ({ request }) => {
    const fd = await request.formData();
    const id = String(fd.get("id") ?? "");

    if (!id) return fail(400, { fieldErrors: { id: "ID is required" } });

    // In a real app, this would delete from a database
    return { ok: true, deleted: id };
  },
} satisfies Actions;
