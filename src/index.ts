import { closeInput, readInput } from "./cli.ts"
import { outcomes, questions } from "./data.ts"
import { formatQuestion, parseAnswer } from "./quiz.ts"
import { Session } from "./session.ts"
import type { Answer } from "./types.ts"

const session = new Session(outcomes)

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

    console.log(`Your answer is worth ${award.points} points`)
    console.log()
  }

  session.finish()

  const outcome = session.result()

  console.log(`Your total is: ${session.total()}`)
  console.log(`Your class is: ${outcome.title}`)
  console.log(outcome.description)
  console.log()

  console.log("You got this because:")

  for (const reason of session.explain()) {
    console.log(`- ${reason}`)
  }
} finally {
  closeInput()
}
