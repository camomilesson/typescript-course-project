import type {
  ProgressResponse,
  Prompt,
  QuizResponse,
  ResultResponse,
  StartedResponse,
} from "../play/index.ts"
import { isPromptChoice } from "../play/index.ts"

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isPrompt(value: unknown): value is Prompt {
  if (
    !isObject(value) ||
    typeof value.text !== "string" ||
    !value.text.trim()
  ) {
    return false
  }
  if (value.hint !== undefined && typeof value.hint !== "string") {
    return false
  }
  switch (value.kind) {
    case "choice":
      return (
        Array.isArray(value.choices) &&
        value.choices.length > 0 &&
        value.choices.every(isPromptChoice)
      )
    case "scale":
      return typeof value.low === "string" && typeof value.high === "string"
    case "yesno":
      return true
    default:
      return false
  }
}

export function isQuizResponse(value: unknown): value is QuizResponse {
  return (
    isObject(value) &&
    Array.isArray(value.questions) &&
    value.questions.length > 0 &&
    value.questions.every(isPrompt)
  )
}

export function isStartedResponse(value: unknown): value is StartedResponse {
  return (
    isObject(value) &&
    typeof value.session_id === "string" &&
    value.session_id.trim().length > 0
  )
}

export function isResultResponse(value: unknown): value is ResultResponse {
  return (
    isObject(value) &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    Array.isArray(value.reasons) &&
    value.reasons.every((reason: unknown) => typeof reason === "string")
  )
}

export function isProgressResponse(value: unknown): value is ProgressResponse {
  return (
    isObject(value) &&
    typeof value.answered === "number" &&
    Number.isSafeInteger(value.answered) &&
    typeof value.total === "number" &&
    Number.isSafeInteger(value.total) &&
    value.answered >= 0 &&
    value.total > 0 &&
    value.answered <= value.total
  )
}
