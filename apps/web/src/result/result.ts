import {
  recap,
  type Prompt,
  type ResultResponse,
  type Submission,
} from "quiz/play"

export default function showResult(
  app: HTMLElement,
  questions: Prompt[],
  submissions: Submission[],
  result: ResultResponse,
): Promise<void> {
  const heading = document.createElement("h1")
  heading.textContent = `Your class is: ${result.title}`
  heading.tabIndex = -1

  const description = document.createElement("p")
  description.textContent = result.description

  const reasonsHeading = document.createElement("h2")
  reasonsHeading.textContent = `Answers contributing to ${result.title}`
  const reasons = document.createElement("ul")
  for (const reason of result.reasons) {
    const item = document.createElement("li")
    item.textContent = reason
    reasons.append(item)
  }

  const recapHeading = document.createElement("h2")
  recapHeading.textContent = "Your answers"
  const answers = document.createElement("ol")
  for (const [index, question] of questions.entries()) {
    const item = document.createElement("li")
    item.textContent = recap(question, submissions[index])
    answers.append(item)
  }

  const restart = document.createElement("button")
  restart.type = "button"
  restart.textContent = "Play again"

  app.replaceChildren(
    heading,
    description,
    reasonsHeading,
    reasons,
    recapHeading,
    answers,
    restart,
  )
  heading.focus()

  return new Promise((resolve) => {
    restart.addEventListener(
      "click",
      () => {
        restart.disabled = true
        resolve()
      },
      { once: true },
    )
  })
}
