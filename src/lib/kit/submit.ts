import { deserialize, applyAction } from "$app/forms";

export async function submitToKitAction(
  action: string,
  values: Record<string, unknown>,
  opts?: { applyToPage?: boolean; credentials?: RequestCredentials },
) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) {
    if (v === undefined || v === null) continue;
    fd.set(k, typeof v === "string" ? v : String(v));
  }

  const res = await fetch(action, {
    method: "POST",
    body: fd,
    credentials: opts?.credentials ?? "same-origin",
    headers: {
      "x-sveltekit-action": "true",
    },
  });

  const text = await res.text();
  const actionResult = deserialize(text);

  if (opts?.applyToPage) {
    await applyAction(actionResult);
  }

  return { actionResult, response: { status: res.status, ok: res.ok } };
}
