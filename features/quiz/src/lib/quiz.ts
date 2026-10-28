import type { Question, Answer } from "./types.ts"

export function formatQuestion(question: Question, hints?: boolean): string {
  const hint =
    hints !== false && question.hint ? `\nHint: ${question.hint}` : ""

  switch (question.kind) {
    case "choice": {
      const choices = question.choices.map(
        (choice, index) => `${index + 1}. ${choice.label}`,
      )

      return [question.text, ...choices, "Type a number:"].join("\n") + hint
    }
    case "scale": {
      return (
        [
          question.text,
          `Type a number from 1 (${question.low}) to 5 (${question.high}):`,
        ].join("\n") + hint
      )
    }
    case "yesno": {
      return `${question.text} (Y or N)${hint}`
    }
  }
}

export function recap(question: Question, answer: Answer): string {
  if (question.kind !== answer.kind) {
    throw new Error("Question and answer kinds do not match")
  }

  switch (answer.kind) {
    case "choice": {
      return `${question.text} You chose: ${answer.picked.label}.`
    }
    case "scale": {
      return `${question.text} You rated it ${answer.value} out of 5.`
    }
    case "yesno": {
      const response = answer.value ? "yes" : "no"
      return `${question.text} You said ${response}.`
    }
    default:
      throw new Error("Unknown kind")
  }
}
