import { closeInput, readInput } from "./cli.ts"
import { questions } from "./data.ts"
import { award, formatQuestion, parseAnswer } from "./quiz.ts"
import type { Answer } from "./types.ts"

let total: number = 0

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

  console.log(`Your answer is worth ${points} points`)
  console.log()
}

console.log("Your total is:", total)

closeInput()
