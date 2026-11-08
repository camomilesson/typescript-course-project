import { type Prompt, recap, type Submission } from "quiz/play"
import { readSettings } from "quiz/saved"
import outline, { countKinds as kinds } from "quiz/outline"

import { locateSettings } from "../../lib/saved.ts"
import { ask } from "./ask.ts"

const baseUrl = "http://localhost:3000"

interface Options {
  name?: string
}

export default async function play(
  quizName: string,
  options: Options,
): Promise<void> {
  const quizResponse = await call(`/quizzes/${encodeURIComponent(quizName)}`)
  const quiz = (await quizResponse.json()) as { questions: Prompt[] }
  const settings = await readSettings(locateSettings())

  console.log(`Hello, ${options.name ?? settings.name}!`)
  const startResponse = await call("/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ quiz: quizName }),
  })
  const { session_id: id } = (await startResponse.json()) as {
    session_id: string
  }
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
    await call("/session/answer", {
      method: "POST",
      headers: { "content-type": "application/json", "x-session-id": id },
      body: JSON.stringify(answer),
    })

    answers.push(answer)

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

async function call(path: string, init?: RequestInit): Promise<Response> {
  let response: Response

  try {
    response = await fetch(`${baseUrl}${path}`, init)
  } catch {
    throw new Error(`Cannot reach the server at ${baseUrl}`)
  }

  if (!response.ok) {
    let message = `The server answered ${response.status}`

    try {
      const body: unknown = await response.json()
      if (
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error
      }
    } catch {
      throw new Error(message)
    }

    throw new Error(message)
  }

  return response
}
