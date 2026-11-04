import path from "node:path"

export function locateSettings(): string {
  return path.join(import.meta.dirname, "..", "..", "saved", "settings.json")
}
