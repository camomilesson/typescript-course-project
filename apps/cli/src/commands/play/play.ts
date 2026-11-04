import { type Answer, recap, Session } from "quiz/play"
import { loadQuiz } from "quiz/quizzes"
import { readSettings } from "quiz/saved"
import outline, { countKinds as kinds } from "quiz/outline"

import { locateSettings } from "../../lib/saved.ts"
import { ask } from "./ask.ts"

interface Options {
  name?: string
}

export default async function play(
  quizName: string,
  options: Options,
): Promise<void> {
  const quiz = await loadQuiz(quizName)
  const settings = await readSettings(locateSettings())

  console.log(`Hello, ${options.name ?? settings.name}!`)
  const session = new Session(quiz.outcomes)
  const answers: Answer[] = []

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
  console.log("## Questions")
  console.log()

  session.start()

  for (const question of quiz.questions) {
    const answer = await ask(settings, question)
    const { outcome, points } = session.record(question, answer)

    answers.push(answer)

    console.log(`Your answer is worth ${points} points for ${outcome}`)
    console.log()
  }

  console.log("## Recap")
  console.log()

  for (const [index, question] of quiz.questions.entries()) {
    console.log(recap(question, answers[index]))
  }

  console.log()
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
}
