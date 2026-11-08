import { type QuizResponse } from "../play/index.ts"
import { isQuizResponse } from "./guards.ts"
import { request } from "./request.ts"

export async function getQuiz(name: string): Promise<QuizResponse> {
  return request<QuizResponse>(
    `/quizzes/${encodeURIComponent(name)}`,
    isQuizResponse,
  )
}
