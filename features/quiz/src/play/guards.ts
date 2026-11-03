import type { Answer, Choice, Outcome, Quiz, Settings } from "./types.ts"

export function isAnswer(value: unknown): value is Answer {
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    return false
  }

  if (value.kind === "choice") {
    return "picked" in value && isChoice(value.picked)
  }

  if (value.kind === "scale") {
    return (
      "value" in value &&
      typeof value.value === "number" &&
      value.value >= 1 &&
      value.value <= 5 &&
      "outcome" in value &&
      typeof value.outcome === "string"
    )
  }

  if (value.kind === "yesno") {
    return (
      "value" in value &&
      typeof value.value === "boolean" &&
      "outcome" in value &&
      typeof value.outcome === "string"
    )
  }

  return false
}

export function isChoice(value: unknown): value is Choice {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("label" in value) || typeof value.label !== "string") {
    return false
  }

  if (!("outcome" in value) || typeof value.outcome !== "string") {
    return false
  }

  if (!("points" in value) || typeof value.points !== "number") {
    return false
  }

  return true
}

export function isSettings(value: unknown): value is Settings {
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

export function isQuiz(value: unknown): value is Quiz {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return true
}

export function isOutcome(value: unknown): value is Outcome {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return true
}
