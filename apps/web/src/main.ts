import { getQuiz, sendAnswer, startSession } from "quiz/services"

import ask from "./ask/index.ts"

const app = document.querySelector<HTMLElement>("#app")
if (!app) {
  throw new Error('No element with id "app"')
}

void play(app, "classes").catch((error: unknown) => {
  app.textContent =
    error instanceof Error ? error.message : "Could not play the quiz"
})

async function play(app: HTMLElement, quizName: string): Promise<void> {
  const quiz = await getQuiz(quizName)
  const id = await startSession(quizName)

  for (const prompt of quiz.questions) {
    const submission = await ask(app, prompt)
    await sendAnswer(id, submission)
  }

  app.textContent = "Thank you"
}
