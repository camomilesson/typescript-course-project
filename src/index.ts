import { closeInput, readInput } from "./cli.ts"
import { outcomes, questions } from "./data.ts"
import { formatQuestion, parseAnswer, recap } from "./quiz.ts"
import { Session } from "./session.ts"
import type { Question, Answer } from "./types.ts"

const session = new Session(outcomes)
const results: { question: Question; answer: Answer }[] = []

session.start()

try {
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

    const award = session.record(question, answer)
    results.push({ question, answer })

    console.log(`Your answer is worth ${award.points} points`)
    console.log()
  }

  session.finish()

  const outcome = session.result()

  console.log(`Your total is: ${session.total()}`)
  console.log(`Your class is: ${outcome.title}`)
  console.log(outcome.description)
  console.log()

  for (const result of results) {
    console.log(recap(result.question, result.answer))
  }
} finally {
  closeInput()
}
