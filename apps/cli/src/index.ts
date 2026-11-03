import { quiz } from "quiz/data"
import { formatQuestion, Session } from "quiz/play"
import { loadSavedGame, loadSettings } from "quiz/saved"
import { savedGame, savedSettings } from "./saved.ts"
import outline, { countKinds as kinds } from "quiz/outline"

// Setup
const settings = loadSettings(savedSettings)
console.log(`Hello, ${settings.name}!`)

const session = new Session(quiz.outcomes)
const { answers } = loadSavedGame(savedGame)

if (answers.length !== quiz.questions.length) {
  throw new Error("The saved game must have one answer for each question")
}

// Quiz preview
console.log("## Outline")
console.log()
console.log(outline(quiz))
console.log()

const counts = kinds(quiz)

console.log(
  `Kinds: choice ${counts.choice}, scale ${counts.scale}, yesno ${counts.yesno}`,
)
console.log()

// Quiz session
session.start()

for (const [index, question] of quiz.questions.entries()) {
  const answer = answers[index]
  const { outcome, points } = session.record(question, answer)

  console.log(formatQuestion(question, settings.hints))
  console.log(`Your answer is worth ${points} points for ${outcome}`)
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
