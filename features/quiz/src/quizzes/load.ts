import { readFile } from "node:fs/promises"
import path from "node:path"

import { type Quiz, isQuiz } from "../play/index.ts"

export async function loadQuiz(name: string): Promise<Quiz> {
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(
      "Quiz names may only contain lowercase letters, numbers, and hyphens",
    )
  }

  const file = path.join(import.meta.dirname, `${name}.json`)

  let text: string

  try {
    text = await readFile(file, "utf8")
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`There is no quiz called "${name}"`, { cause: error })
    }

    throw error
  }

  let value: unknown

  try {
    value = JSON.parse(text)
  } catch {
    throw new Error(`The quiz "${name}" is not valid JSON`)
  }

  if (!isQuiz(value)) {
    throw new Error(
      `The quiz "${name}" contains invalid questions, choices, or outcomes`,
    )
  }

  return value
}
