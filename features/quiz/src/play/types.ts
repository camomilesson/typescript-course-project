export interface Outcome {
  id: string
  title: string
  description: string
}

export interface Choice {
  label: string
  outcome: string
  points: number
}

interface BaseQuestion {
  text: string
  hint?: string
}

interface ChoiceQuestion extends BaseQuestion {
  kind: "choice"
  choices: Choice[]
}

interface ScaleQuestion extends BaseQuestion {
  kind: "scale"
  low: string
  high: string
  outcome: string
}

interface YesNoQuestion extends BaseQuestion {
  kind: "yesno"
  outcome: string
}

export type Question = ChoiceQuestion | ScaleQuestion | YesNoQuestion

interface ChoiceAnswer {
  kind: "choice"
  picked: Choice
}

interface ScaleAnswer {
  kind: "scale"
  value: number
  outcome: string
}

interface YesNoAnswer {
  kind: "yesno"
  value: boolean
  outcome: string
}

export type Answer = ChoiceAnswer | ScaleAnswer | YesNoAnswer

export interface Quiz {
  outcomes: Outcome[]
  questions: Question[]
}

export interface Settings {
  name: string
  hints?: boolean
}

type ChoicePrompt = Omit<ChoiceQuestion, "choices"> & {
  choices: PromptChoice[]
}

type ScalePrompt = Omit<ScaleQuestion, "outcome">

type YesNoPrompt = Omit<YesNoQuestion, "outcome">

export type Prompt = ChoicePrompt | ScalePrompt | YesNoPrompt

type ChoiceSubmission = Omit<ChoiceAnswer, "picked"> & {
  picked: PromptChoice
}

type ScaleSubmission = Omit<ScaleAnswer, "outcome">

type YesNoSubmission = Omit<YesNoAnswer, "outcome">

export type Submission = ChoiceSubmission | ScaleSubmission | YesNoSubmission

export type PromptChoice = Pick<Choice, "label">

export interface QuizResponse {
  questions: Prompt[]
}

export interface StartedResponse {
  session_id: string
}

export interface ResultResponse {
  title: string
  description: string
  reasons: string[]
}

export interface ProgressResponse {
  answered: number
  total: number
}

export interface ErrorResponse {
  error: string
}
