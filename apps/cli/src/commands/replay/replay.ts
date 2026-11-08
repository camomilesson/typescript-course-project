import { formatQuestion, recap } from "quiz/play"
import { readSavedGame, readSettings } from "quiz/saved"
import outline, { countKinds as kinds } from "quiz/outline"

import { getQuiz, getResult, sendAnswer, startSession } from "quiz/services"
import { locateSavedGame, locateSettings } from "../../saved/index.ts"

export default async function replay(quizName: string): Promise<void> {
  const quiz = await getQuiz(quizName)
  const settings = await readSettings(locateSettings())
  const { answers } = await readSavedGame(locateSavedGame())

  console.log(`Hello, ${settings.name}!`)

  if (answers.length !== quiz.questions.length) {
    throw new Error("The saved game must have one answer for each question")
  }

  console.log()
  console.log("## Outline")
  console.log(outline(quiz))

  const counts = kinds(quiz)
  console.log(
    `Kinds: choice ${counts.choice}, scale ${counts.scale}, yesno ${counts.yesno}`,
  )
  console.log()

  console.log("## Quiz")
  const id = await startSession(quizName)

  for (const [index, question] of quiz.questions.entries()) {
    const answer = answers[index]
    await sendAnswer(id, answer)

    console.log(`Question ${index + 1}:`)
    console.log(formatQuestion(question, settings.hints))
    console.log()
  }

  console.log("## Recap")
  console.log()

  for (const [index, question] of quiz.questions.entries()) {
    console.log(recap(question, answers[index]))
  }

  console.log()
  const result = await getResult(id)

  console.log("## Result")

  console.log(`Your class is: ${result.title}`)
  console.log(result.description)
  console.log()
  console.log("You got this because:")

  for (const reason of result.reasons) {
    console.log(`- ${reason}`)
  }
}
