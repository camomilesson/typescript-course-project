import { isAnswer, type Answer } from "../play/index.ts"

export interface SavedGame {
  answers: Answer[]
  startedAt?: string
}

export function loadSavedGame(saved: string): SavedGame {
  let value: unknown

  try {
    value = JSON.parse(saved)
  } catch {
    throw new Error("The saved game is not parseable")
  }

  if (!isSavedGame(value)) {
    throw new Error("The saved game is missing parts")
  }

  return value
}

function isSavedGame(value: unknown): value is SavedGame {
  if (
    typeof value !== "object" ||
    value === null ||
    !("answers" in value) ||
    !Array.isArray(value.answers) ||
    !value.answers.every(isAnswer)
  ) {
    return false
  }

  if ("startedAt" in value && typeof value.startedAt !== "string") {
    return false
  }

  return true
}
