import { formatQuestion, type Prompt, recap } from "quiz/play"
import { readSavedGame, readSettings } from "quiz/saved"
import outline, { countKinds as kinds } from "quiz/outline"

import { call } from "../../lib/api.ts"
import { locateSavedGame, locateSettings } from "../../lib/saved.ts"

export default async function replay(quizName: string): Promise<void> {
  const quizResponse = await call(`/quizzes/${encodeURIComponent(quizName)}`)
  const quiz = (await quizResponse.json()) as { questions: Prompt[] }
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
  const startResponse = await call("/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ quiz: quizName }),
  })
  const { session_id: id } = (await startResponse.json()) as {
    session_id: string
  }

  for (const [index, question] of quiz.questions.entries()) {
    const answer = answers[index]
    await call("/session/answer", {
      method: "POST",
      headers: { "content-type": "application/json", "x-session-id": id },
      body: JSON.stringify(answer),
    })

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
  const resultResponse = await call("/session/result", {
    headers: { "x-session-id": id },
  })
  const result = (await resultResponse.json()) as {
    title: string
    description: string
    reasons: string[]
  }

  console.log("## Result")

  console.log(`Your class is: ${result.title}`)
  console.log(result.description)
  console.log()
  console.log("You got this because:")

  for (const reason of result.reasons) {
    console.log(`- ${reason}`)
  }
}
