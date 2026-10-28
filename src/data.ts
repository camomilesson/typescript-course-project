import { type Outcome, type Question, type Quiz } from "./lib/types.ts"

// Question data kept as placeholders for now.
// To be filled with real questions as the project approaches completion.

export const outcomes: Outcome[] = [
  {
    id: "fighter",
    title: "Fighter",
    description: "Description for the fighter-type outcome",
  },
  {
    id: "ranger",
    title: "Ranger",
    description: "Description for the ranger-type outcome",
  },
  {
    id: "rogue",
    title: "Rogue",
    description: "Description for the rogue-type outcome",
  },
  {
    id: "wizard",
    title: "Wizard",
    description: "Description for the wizard-type outcome",
  },
]

const questions: Question[] = [
  {
    kind: "choice",
    text: "Choice question?",
    hint: "Here's a choice question hint",
    choices: [
      {
        label: "Option 1",
        points: 3,
        outcome: "fighter",
      },
      {
        label: "Option 2",
        points: 1,
        outcome: "wizard",
      },
      {
        label: "Option 3",
        points: 2,
        outcome: "rogue",
      },
    ],
  },
  {
    kind: "scale",
    text: "Scale question?",
    low: "low answer",
    high: "high answer",
    outcome: "ranger",
  },
  { kind: "yesno", text: "Yes or no question?", outcome: "fighter" },
]

export const quiz: Readonly<Quiz> = { outcomes, questions }
