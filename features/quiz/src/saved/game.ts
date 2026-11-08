import { readFile } from "node:fs/promises"

import { isSubmission, type Submission } from "../play/index.ts"

export interface SavedGame {
  answers: Submission[]
  startedAt?: string
}

function loadSavedGame(saved: string): SavedGame {
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
    !value.answers.every(isSubmission)
  ) {
    return false
  }

  if ("startedAt" in value && typeof value.startedAt !== "string") {
    return false
  }

  return true
}

export async function readSavedGame(file: string): Promise<SavedGame> {
  const text = await readFile(file, "utf8")
  return loadSavedGame(text)
}
