import { type Submission } from "quiz/play"
import {
  getProgress,
  getQuiz,
  getResult,
  sendAnswer,
  startSession,
} from "quiz/services"

import ask from "./ask/index.ts"
import showResult from "./result/index.ts"

const app = document.querySelector<HTMLElement>("#app")
if (!app) {
  throw new Error('No element with id "app"')
}

void run(app).catch((error: unknown) => {
  app.textContent =
    error instanceof Error ? error.message : "Could not play the quiz"
})

async function run(app: HTMLElement): Promise<void> {
  while (true) {
    await play(app, "classes")
  }
}

async function play(app: HTMLElement, quizName: string): Promise<void> {
  app.textContent = "Loading quiz…"
  const quiz = await getQuiz(quizName)
  const id = await startSession(quizName)
  const submissions: Submission[] = []

  for (const prompt of quiz.questions) {
    const { answered, total } = await getProgress(id)
    const submission = await ask(
      app,
      prompt,
      `Question ${answered + 1} of ${total}`,
    )
    await sendAnswer(id, submission)
    submissions.push(submission)
  }

  const result = await getResult(id)
  await showResult(app, quiz.questions, submissions, result)
}
