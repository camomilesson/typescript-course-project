import {
  isSubmission,
  type ErrorResponse,
  type ProgressResponse,
  type ResultResponse,
  type StartedResponse,
} from "quiz/play"
import { type FastifyPluginCallback } from "fastify"

import { findQuiz } from "#shared/quizzes"
import { toAnswer } from "./answer.ts"
import { create, find } from "./storage.ts"

interface SessionHeader {
  "x-session-id"?: string
}

interface StartBody {
  quiz?: unknown
}

const session: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.get<{
    Headers: SessionHeader
    Reply: { 200: ProgressResponse; 401: ErrorResponse }
  }>("/session", (request, reply) => {
    const entry = find(request.headers["x-session-id"])
    if (!entry) {
      reply.code(401).send({ error: "Unknown session" })
      return
    }

    reply
      .code(200)
      .send({ answered: entry.answered, total: entry.quiz.questions.length })
  })

  fastify.post<{
    Body: StartBody | undefined
    Reply: { 201: StartedResponse; 400: ErrorResponse; 404: ErrorResponse }
  }>("/session", async (request, reply) => {
    const name = request.body?.quiz
    if (typeof name !== "string") {
      return reply.code(400).send({ error: 'The body needs a "quiz" name' })
    }

    const quiz = await findQuiz(name)
    if (!quiz) {
      return reply.code(404).send({ error: "There is no such quiz" })
    }

    return reply.code(201).send({ session_id: create(quiz) })
  })

  fastify.post<{
    Body: unknown
    Headers: SessionHeader
    Reply: {
      204: undefined
      400: ErrorResponse
      401: ErrorResponse
      409: ErrorResponse
    }
  }>("/session/answer", async (request, reply) => {
    const entry = find(request.headers["x-session-id"])
    if (!entry) {
      return reply.code(401).send({ error: "Unknown session" })
    }

    const question = entry.quiz.questions[entry.answered]
    if (!question) {
      return reply.code(409).send({ error: "Every question has an answer" })
    }

    const submission = request.body
    if (!isSubmission(submission) || submission.kind !== question.kind) {
      return reply.code(400).send({ error: "That does not fit the question" })
    }

    const answer = toAnswer(question, submission)
    if (!answer) {
      return reply.code(400).send({ error: "That does not fit the question" })
    }

    entry.session.record(question, answer)
    entry.answered += 1

    return reply.code(204).send()
  })

  fastify.get<{
    Headers: SessionHeader
    Reply: { 200: ResultResponse; 401: ErrorResponse; 409: ErrorResponse }
  }>("/session/result", async (request, reply) => {
    const entry = find(request.headers["x-session-id"])
    if (!entry) {
      return reply.code(401).send({ error: "Unknown session" })
    }

    if (entry.answered < entry.quiz.questions.length) {
      return reply.code(409).send({ error: "Some questions have no answer" })
    }

    if (!entry.finished) {
      try {
        entry.session.finish()
      } catch {
        return reply.code(409).send({ error: "No points have been scored" })
      }
      entry.finished = true
    }

    const { title, description } = entry.session.result()
    return { title, description, reasons: entry.session.explain() }
  })
  done()
}

export default session
