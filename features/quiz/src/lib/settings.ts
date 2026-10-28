export interface Settings {
  name: string
  hints?: boolean
}

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

function isSettings(value: unknown): value is Settings {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("name" in value) || typeof value.name !== "string") {
    return false
  }

  if ("hints" in value && typeof value.hints !== "boolean") {
    return false
  }

  return true
}
