export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  const result: string[] = [];

  for (const entry of classes) {
    if (!entry) continue;

    if (typeof entry === "string") {
      result.push(entry);
      continue;
    }

    for (const [key, value] of Object.entries(entry)) {
      if (value) {
        result.push(key);
      }
    }
  }

  return result.join(" ");
}

export default cx;
