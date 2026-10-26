import { closeInput, readInput } from "./cli.ts"
import { questions } from "./data.ts"
import { award, formatQuestion, parseAnswer, recap } from "./quiz.ts"
import type { Question, Answer } from "./types.ts"

let total: number = 0
const results: { question: Question; answer: Answer }[] = []

for (const question of questions) {
  console.log(formatQuestion(question))

  let answer: Answer | undefined

  while (answer === undefined) {
    const input = await readInput("> ")
    answer = parseAnswer(question, input)

    if (answer === undefined) {
      console.log("Invalid answer. Try again.")
    }
  }

  const points = award(answer)
  total += points
  results.push({ question, answer })

  console.log(`Your answer is worth ${points} points`)
  console.log()
}

console.log("Your total is:", total)
for (const result of results) {
  console.log(recap(result.question, result.answer))
}

closeInput()
