import path from "node:path"

import { type Quiz, type Settings, formatQuestion, Session } from "quiz/play"
import { loadQuiz } from "quiz/quizzes"
import { readSavedGame, readSettings, type SavedGame } from "quiz/saved"
import outline, { countKinds as kinds } from "quiz/outline"

let quiz: Quiz
let settings: Settings
let answers: SavedGame["answers"]

try {
  quiz = await loadQuiz("classes")

  const gameFile = path.join(import.meta.dirname, "../saved/game.json")
  const settingsFile = path.join(import.meta.dirname, "../saved/settings.json")

  const game = await readSavedGame(gameFile)
  answers = game.answers

  settings = await readSettings(settingsFile)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}

// Setup
console.log(`Hello, ${settings.name}!`)

const session = new Session(quiz.outcomes)

if (answers.length !== quiz.questions.length) {
  throw new Error("The saved game must have one answer for each question")
}

// Quiz preview
console.log()
console.log("## Outline")
console.log(outline(quiz))

const counts = kinds(quiz)
console.log(
  `Kinds: choice ${counts.choice}, scale ${counts.scale}, yesno ${counts.yesno}`,
)
console.log()

// Quiz session
console.log("## Quiz")
session.start()

for (const [index, question] of quiz.questions.entries()) {
  const answer = answers[index]
  const { outcome, points } = session.record(question, answer)
  console.log(`Question ${index + 1}:`)
  console.log(formatQuestion(question, settings.hints))
  console.log(`Your answer is worth ${points} points for ${outcome}`)
  console.log()
}

session.finish()

// Quiz result
console.log("## Result")
const outcome = session.result()

console.log(`Your total is: ${session.total()}`)
console.log(`Your class is: ${outcome.title}`)
console.log(outcome.description)
console.log()
console.log("You got this because:")

for (const reason of session.explain()) {
  console.log(`- ${reason}`)
}
