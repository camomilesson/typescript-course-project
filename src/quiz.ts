import type { Question } from "./types.ts"

export function formatQuestion(question: Question): string {
  switch (question.kind) {
    case "choice": {
      const choices = question.choices.map(
        (choice, index) => `${index + 1}. ${choice.label}`,
      )

      return [question.text, ...choices, "Type a number:"].join("\n")
    }
    case "scale": {
      return `${question.text} (1 = ${question.low}, 5 = ${question.high})`
    }
    case "yesno": {
      return `${question.text} (Y or N)`
    }
  }
}
