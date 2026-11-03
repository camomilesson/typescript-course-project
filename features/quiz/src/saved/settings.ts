import { isSettings, type Settings } from "../play/index.ts"

export function loadSettings(saved: string): Settings {
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
