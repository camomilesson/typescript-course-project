import { readFile } from "node:fs/promises"

import { isSettings, type Settings } from "../play/index.ts"

function loadSettings(saved: string): Settings {
  let value: unknown

  try {
    value = JSON.parse(saved)
  } catch {
    throw new Error("The saved settings are not proper text")
  }

  if (!isSettings(value)) {
    throw new Error(
      "The saved settings need a name and, possibly, a true or false hints",
    )
  }

  return value
}

export async function readSettings(file: string): Promise<Settings> {
  const text = await readFile(file, "utf8")
  return loadSettings(text)
}
