import type { Question, Quiz } from "../play/index.ts"

export default function outline(quiz: Readonly<Quiz>): string {
  return quiz.questions
    .map((question, index) => {
      const number = index + 1

      switch (question.kind) {
        case "choice":
          return `${number}. ${question.text} (choice, ${question.choices.length} options)`

        case "scale":
          return `${number}. ${question.text} (scale)`

        case "yesno":
          return `${number}. ${question.text} (yes or no)`

        default:
          throw new Error("Unknown question kind")
      }
    })
    .join("\n")
}

export function countKinds(
  quiz: Readonly<Quiz>,
): Record<Question["kind"], number> {
  const counts: Record<Question["kind"], number> = {
    choice: 0,
    scale: 0,
    yesno: 0,
  }

  for (const question of quiz.questions) {
    counts[question.kind] += 1
  }

  return counts
}
