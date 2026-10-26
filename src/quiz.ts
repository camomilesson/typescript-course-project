import type { Question, Answer } from "./types.ts"

export function formatQuestion(question: Question): string {
  switch (question.kind) {
    case "choice": {
      const choices = question.choices.map(
        (choice, index) => `${index + 1}. ${choice.label}`,
      )

      return [question.text, ...choices, "Type a number:"].join("\n")
    }
    case "scale": {
      return [
        question.text,
        `Type a number from 1 (${question.low}) to 5 (${question.high}):`,
      ].join("\n")
    }
    case "yesno": {
      return `${question.text} (Y or N)`
    }
  }
}

export function parseAnswer(
  question: Question,
  input: string,
): Answer | undefined {
  const value = input.trim().toLowerCase()

  switch (question.kind) {
    case "choice": {
      const choiceNumber = Number(value)
      const picked = question.choices[choiceNumber - 1]

      if (!Number.isInteger(choiceNumber) || picked === undefined) {
        return undefined
      }

      return { kind: "choice", picked }
    }
    case "scale": {
      const scaleValue = Number(value)
      if (!Number.isInteger(scaleValue) || scaleValue < 1 || scaleValue > 5) {
        return undefined
      }

      return { kind: "scale", value: scaleValue }
    }
    case "yesno": {
      if (value === "y") {
        return { kind: "yesno", value: true }
      }

      if (value === "n") {
        return { kind: "yesno", value: false }
      }

      return undefined
    }
  }
}

export function award(answer: Answer): number {
  switch (answer.kind) {
    case "choice":
      return answer.picked.points
    case "scale":
      return answer.value
    case "yesno":
      return answer.value ? 1 : 0
  }
}
