import {
  type Answer,
  type Outcome,
  type OutcomeId,
  type Question,
} from "./types.ts"
import { recap } from "./quiz.ts"

export type Status = "waiting" | "asking" | "done"

export interface Award {
  outcome: OutcomeId
  points: number
}

export class Session {
  private totalPoints = 0

  private tally: Record<OutcomeId, number> = {
    fighter: 0,
    ranger: 0,
    rogue: 0,
    wizard: 0,
  }

  private reasons: Record<OutcomeId, string[]> = {
    fighter: [],
    ranger: [],
    rogue: [],
    wizard: [],
  }

  private outcomes: Outcome[]
  private status: Status = "waiting"

  constructor(outcomes: Outcome[]) {
    this.outcomes = outcomes
  }

  public start(): void {
    if (this.status !== "waiting") {
      throw new Error("The quiz has already started")
    }

    this.status = "asking"
  }

  public record(question: Question, answer: Answer): Award {
    if (this.status !== "asking") {
      throw new Error("The quiz has not started yet")
    }

    const result = award(question, answer)

    this.totalPoints += result.points
    this.tally[result.outcome] += result.points

    if (result.points > 0) {
      this.reasons[result.outcome].push(recap(question, answer))
    }

    return result
  }

  public finish(): void {
    if (this.status !== "asking") {
      throw new Error("The quiz is not active to finish it")
    }

    if (!this.outcomes.some((outcome) => this.tally[outcome.id] > 0)) {
      throw new Error("No points have been scored")
    }

    this.status = "done"
  }

  public result(): Outcome {
    if (this.status !== "done") {
      throw new Error("The quiz is not finished yet")
    }

    let best = this.outcomes[0]

    for (const outcome of this.outcomes) {
      if (this.tally[outcome.id] > this.tally[best.id]) {
        best = outcome
      }
    }

    return best
  }

  public explain(): string[] {
    if (this.status !== "done") {
      throw new Error("The quiz is still in progress")
    }

    const title = this.result()

    return [...this.reasons[title.id]]
  }

  public total(): number {
    if (this.status !== "done") {
      throw new Error("The game is still in progress")
    }

    return this.totalPoints
  }
}

function award(question: Question, answer: Answer): Award {
  if (question.kind !== answer.kind) {
    throw new Error("The answer does not fit the question")
  }

  switch (answer.kind) {
    case "choice":
      return {
        outcome: answer.picked.outcome,
        points: answer.picked.points,
      }

    case "scale":
      return {
        outcome: answer.outcome,
        points: answer.value,
      }

    case "yesno":
      return {
        outcome: answer.outcome,
        points: answer.value ? 1 : 0,
      }
  }
}
