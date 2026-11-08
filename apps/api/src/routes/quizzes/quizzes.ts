import { type FastifyPluginCallback } from "fastify"

import { findQuiz } from "#shared/quizzes"
import { toPrompt } from "./prompt.ts"

interface Params {
  name: string
}

const quizzes: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.get<{ Params: Params }>("/quizzes/:name", async (request, reply) => {
    const quiz = await findQuiz(request.params.name)
    if (!quiz) {
      return reply.code(404).send({ error: "There is no such quiz" })
    }

    return { questions: quiz.questions.map(toPrompt) }
  })
  done()
}

export default quizzes
