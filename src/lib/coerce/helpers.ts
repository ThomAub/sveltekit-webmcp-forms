type Transform = (input: Record<string, unknown>) => Record<string, unknown>;

export function coerceNumber(keys: string[]): Transform {
  return (input) => {
    const out = { ...input };
    for (const key of keys) {
      if (key in out) {
        out[key] = Number(out[key]);
      }
    }
    return out;
  };
}

export function coerceBoolean(keys: string[]): Transform {
  return (input) => {
    const out = { ...input };
    for (const key of keys) {
      if (key in out) {
        const v = String(out[key]).toLowerCase();
        if (v === "on" || v === "true" || v === "1") {
          out[key] = true;
        } else if (v === "off" || v === "false" || v === "0" || v === "") {
          out[key] = false;
        }
      }
    }
    return out;
  };
}

export function withDefaults(defaults: Record<string, unknown>): Transform {
  return (input) => {
    const out = { ...defaults };
    for (const [k, v] of Object.entries(input)) {
      if (v !== undefined) {
        out[k] = v;
      }
    }
    return out;
  };
}

export function pipe(...fns: Transform[]): Transform {
  return (input) => fns.reduce((acc, fn) => fn(acc), input);
}
