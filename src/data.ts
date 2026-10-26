import { type Question } from "./types.ts"

// Question data kept as placeholders for now.
// To be filled with real questions as the project approaches completion.

export const questions: Question[] = [
  {
    kind: "choice",
    text: "Choice question?",
    choices: [
      { label: "Option 1", points: 3 },
      { label: "Option 2", points: 1 },
      { label: "Option 3", points: 2 },
    ],
  },
  {
    kind: "scale",
    text: "Scale question?",
    low: "low answer",
    high: "high answer",
  },
  { kind: "yesno", text: "Yes or no question?" },
]
