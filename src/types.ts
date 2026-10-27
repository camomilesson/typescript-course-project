export type OutcomeId = "fighter" | "ranger" | "rogue" | "wizard"

export interface Outcome {
  id: OutcomeId
  title: string
  description: string
}

interface Choice {
  label: string
  outcome: OutcomeId
  points: number
}

interface BaseQuestion {
  text: string
}

interface ChoiceQuestion extends BaseQuestion {
  kind: "choice"
  choices: Choice[]
}

interface ScaleQuestion extends BaseQuestion {
  kind: "scale"
  low: string
  high: string
  outcome: OutcomeId
}

interface YesNoQuestion extends BaseQuestion {
  kind: "yesno"
  outcome: OutcomeId
}

export type Question = ChoiceQuestion | ScaleQuestion | YesNoQuestion

interface ChoiceAnswer {
  kind: "choice"
  picked: Choice
  outcome: OutcomeId
}

interface ScaleAnswer {
  kind: "scale"
  value: number
  outcome: OutcomeId
}

interface YesNoAnswer {
  kind: "yesno"
  value: boolean
  outcome: OutcomeId
}

export type Answer = ChoiceAnswer | ScaleAnswer | YesNoAnswer
