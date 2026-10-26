import { closeInput, readInput } from "./cli.ts"
import { questions } from "./data.ts"
import { formatQuestion } from "./quiz.ts"

try {
  for (const question of questions) {
    console.log(formatQuestion(question))
    const answer = await readInput("> ")
    console.log(`You answered: ${answer}`)
  }
} finally {
  closeInput()
}
