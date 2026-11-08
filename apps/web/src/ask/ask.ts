import { type Prompt, type Submission } from "quiz/play"

import { optionsFor } from "./options.ts"

export default function ask(
  app: HTMLElement,
  prompt: Prompt,
): Promise<Submission> {
  const options = optionsFor(prompt)
  const heading = document.createElement("h2")
  const list = document.createElement("ul")

  heading.textContent = prompt.text

  for (const [index, option] of options.entries()) {
    const item = document.createElement("li")
    const button = document.createElement("button")

    button.type = "button"
    button.textContent = option.label
    button.dataset.index = String(index)
    item.append(button)
    list.append(item)
  }

  app.replaceChildren(heading, list)

  if (prompt.hint) {
    const hint = document.createElement("p")
    hint.textContent = prompt.hint
    heading.after(hint)
  }

  return new Promise((resolve) => {
    function handleClick(event: MouseEvent): void {
      if (!(event.target instanceof HTMLElement)) {
        return
      }

      const button = event.target.closest("button")
      if (!button || !list.contains(button)) {
        return
      }

      const option = options[Number(button.dataset.index)]
      if (!option) {
        return
      }

      list.removeEventListener("click", handleClick)
      for (const item of list.querySelectorAll("button")) {
        item.disabled = true
      }
      resolve(option.submission)
    }

    list.addEventListener("click", handleClick)
  })
}
