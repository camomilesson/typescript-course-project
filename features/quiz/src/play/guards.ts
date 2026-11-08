import type {
  Answer,
  Choice,
  Outcome,
  PromptChoice,
  Submission,
  Question,
  Quiz,
  Settings,
} from "./types.ts"

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
      Number.isInteger(value.value) &&
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

  if (
    !("label" in value) ||
    typeof value.label !== "string" ||
    !value.label.trim()
  ) {
    return false
  }

  if (!("outcome" in value) || typeof value.outcome !== "string") {
    return false
  }

  if (
    !("points" in value) ||
    typeof value.points !== "number" ||
    !Number.isFinite(value.points) ||
    value.points < 0
  ) {
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

  if (
    !("outcomes" in value) ||
    !Array.isArray(value.outcomes) ||
    !value.outcomes.every(isOutcome)
  ) {
    return false
  }

  if (
    !("questions" in value) ||
    !Array.isArray(value.questions) ||
    !value.questions.every(isQuestion)
  ) {
    return false
  }

  if (value.outcomes.length === 0 || value.questions.length === 0) {
    return false
  }
  const ids = new Set(value.outcomes.map((outcome) => outcome.id))
  if (ids.size !== value.outcomes.length) {
    return false
  }
  return value.questions.every((question) => {
    if (question.kind === "choice") {
      const labels = new Set(question.choices.map((choice) => choice.label))
      return (
        labels.size === question.choices.length &&
        question.choices.every((choice) => ids.has(choice.outcome))
      )
    }
    return ids.has(question.outcome)
  })
}

export function isOutcome(value: unknown): value is Outcome {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("id" in value) || typeof value.id !== "string" || !value.id.trim()) {
    return false
  }

  if (
    !("title" in value) ||
    typeof value.title !== "string" ||
    !value.title.trim()
  ) {
    return false
  }

  if (
    !("description" in value) ||
    typeof value.description !== "string" ||
    !value.description.trim()
  ) {
    return false
  }

  return true
}

export function isQuestion(value: unknown): value is Question {
  if (typeof value !== "object" || value === null) {
    return false
  }

  if (!("kind" in value) || typeof value.kind !== "string") {
    return false
  }

  if (
    !("text" in value) ||
    typeof value.text !== "string" ||
    !value.text.trim()
  ) {
    return false
  }

  if ("hint" in value && typeof value.hint !== "string") {
    return false
  }

  switch (value.kind) {
    case "choice":
      if (
        !("choices" in value) ||
        !Array.isArray(value.choices) ||
        value.choices.length === 0
      ) {
        return false
      }
      return value.choices.every(isChoice)

    case "scale":
      if (!("low" in value) || typeof value.low !== "string") {
        return false
      }
      if (!("high" in value) || typeof value.high !== "string") {
        return false
      }
      if (!("outcome" in value) || typeof value.outcome !== "string") {
        return false
      }
      return true

    case "yesno":
      if (!("outcome" in value) || typeof value.outcome !== "string") {
        return false
      }
      return true

    default:
      return false
  }
}

export function isSubmission(value: unknown): value is Submission {
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    return false
  }

  if (value.kind === "choice") {
    return "picked" in value && isPromptChoice(value.picked)
  }

  if (value.kind === "scale") {
    return (
      "value" in value &&
      typeof value.value === "number" &&
      Number.isInteger(value.value) &&
      value.value >= 1 &&
      value.value <= 5
    )
  }

  if (value.kind === "yesno") {
    return "value" in value && typeof value.value === "boolean"
  }

  return false
}

export function isPromptChoice(value: unknown): value is PromptChoice {
  return (
    typeof value === "object" &&
    value !== null &&
    "label" in value &&
    typeof value.label === "string"
  )
}
