import { type QuizResponse } from "../play/index.ts"
import { request } from "./request.ts"

export async function getQuiz(name: string): Promise<QuizResponse> {
  return request<QuizResponse>(`/quizzes/${encodeURIComponent(name)}`)
}
