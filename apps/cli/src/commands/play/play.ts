import { recap, type Submission } from "quiz/play"
import { readSettings } from "quiz/saved"
import outline, { countKinds as kinds } from "quiz/outline"

import { getQuiz, getResult, sendAnswer, startSession } from "quiz/services"
import { locateSettings } from "../../lib/saved.ts"
import { ask } from "./ask.ts"

interface Options {
  name?: string
}

export default async function play(
  quizName: string,
  options: Options,
): Promise<void> {
  const quiz = await getQuiz(quizName)
  const settings = await readSettings(locateSettings())

  console.log(`Hello, ${options.name ?? settings.name}!`)
  const id = await startSession(quizName)
  const answers: Submission[] = []

  console.log()
  console.log("## Outline")
  console.log(outline(quiz))

  const counts = kinds(quiz)
  console.log(
    `Kinds: choice ${counts.choice}, scale ${counts.scale}, yesno ${counts.yesno}`,
  )
  console.log()

  console.log("## Questions")
  console.log()

  for (const question of quiz.questions) {
    const answer = await ask(settings, question)
    await sendAnswer(id, answer)

    answers.push(answer)

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
