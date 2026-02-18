import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
  return {
    comments: [
      { id: "1", text: "First comment" },
      { id: "2", text: "Second comment" },
    ],
  };
};

export const actions = {
  addComment: async ({ request }) => {
    const fd = await request.formData();
    const text = String(fd.get("text") ?? "");

    if (!text) return fail(400, { fieldErrors: { text: "Comment text is required" } });

    return { ok: true, comment: { id: crypto.randomUUID(), text } };
  },
} satisfies Actions;
