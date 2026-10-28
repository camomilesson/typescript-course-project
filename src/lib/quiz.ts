import type { Question, Answer } from "./types.ts"

export function formatQuestion(question: Question): string {
  const hint = question.hint ? `\nHint: ${question.hint}` : ""

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

      return { kind: "scale", value: scaleValue, outcome: question.outcome }
    }
    case "yesno": {
      if (value === "y") {
        return { kind: "yesno", value: true, outcome: question.outcome }
      }

      if (value === "n") {
        return { kind: "yesno", value: false, outcome: question.outcome }
      }

      return undefined
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
