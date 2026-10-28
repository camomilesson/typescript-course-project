import { type Answer } from "./lib/types.ts"

const initialAnswers: Answer[] = [
  {
    kind: "choice",
    picked: {
      label: "Option 2",
      points: 1,
      outcome: "wizard",
    },
  },
  { kind: "scale", value: 3, outcome: "wizard" },
  { kind: "yesno", value: true, outcome: "fighter" },
]

export const savedGame = JSON.stringify({
  answers: initialAnswers,
  startedAt: new Date(),
})

export const savedSettings = JSON.stringify({
  name: "Andrei",
  hints: false,
})
