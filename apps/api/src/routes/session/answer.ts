import { type Answer, type Question, type Submission } from "quiz/play"

export function toAnswer(
  question: Question,
  submission: Submission,
): Answer | undefined {
  if (question.kind === "choice" && submission.kind === "choice") {
    const picked = question.choices.find(
      ({ label }) => label === submission.picked?.label,
    )
    return picked ? { kind: "choice", picked } : undefined
  }

  if (question.kind === "scale" && submission.kind === "scale") {
    const { value } = submission
    if (typeof value === "number" && value >= 1 && value <= 5) {
      return { kind: "scale", value, outcome: question.outcome }
    }
  }

  if (question.kind === "yesno" && submission.kind === "yesno") {
    const { value } = submission
    if (typeof value === "boolean") {
      return { kind: "yesno", value, outcome: question.outcome }
    }
  }

  return undefined
}
