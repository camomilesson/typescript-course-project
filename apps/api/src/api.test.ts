import assert from "node:assert/strict"
import { test } from "node:test"

import Fastify from "fastify"

import quizzes from "./routes/quizzes/index.ts"
import session from "./routes/session/index.ts"

void test("quiz API validates submissions and completes isolated sessions", async () => {
  const app = Fastify()
  app.register(quizzes)
  app.register(session)

  try {
    const prompts = await app.inject("/quizzes/classes")
    assert.equal(prompts.statusCode, 200)
    assert.equal(/"(?:outcome|outcomes|points)":/.test(prompts.body), false)
    assert.equal((await app.inject("/quizzes/missing")).statusCode, 404)
    assert.equal((await app.inject("/quizzes/classes.json")).statusCode, 404)

    for (const payload of [undefined, {}, { quiz: 4 }]) {
      assert.equal(
        (await app.inject({ method: "POST", url: "/session", payload }))
          .statusCode,
        400,
      )
    }
    assert.equal(
      (
        await app.inject({
          method: "POST",
          url: "/session",
          payload: { quiz: "missing" },
        })
      ).statusCode,
      404,
    )

    for (const headers of [{}, { "x-session-id": "unknown" }]) {
      assert.equal(
        (await app.inject({ url: "/session/result", headers })).statusCode,
        401,
      )
      assert.equal(
        (await app.inject({ method: "POST", url: "/session/answer", headers }))
          .statusCode,
        401,
      )
    }

    const start = await app.inject({
      method: "POST",
      url: "/session",
      payload: { quiz: "classes" },
    })
    assert.equal(start.statusCode, 201)
    const { session_id: id } = start.json<{ session_id: string }>()
    const headers = { "x-session-id": id }
    assert.equal(
      (await app.inject({ url: "/session/result", headers })).statusCode,
      409,
    )

    const submit = (payload: object | undefined) =>
      app.inject({ method: "POST", url: "/session/answer", headers, payload })
    for (const payload of [
      undefined,
      {},
      { kind: "scale", value: 3 },
      { kind: "choice" },
      { kind: "choice", picked: { label: "missing" } },
    ]) {
      assert.equal((await submit(payload)).statusCode, 400)
    }
    assert.equal(
      (
        await submit({
          kind: "choice",
          picked: { label: "Option 1", outcome: "wizard", points: 1000 },
        })
      ).statusCode,
      204,
    )
    for (const value of [0, 6, "4", null]) {
      assert.equal((await submit({ kind: "scale", value })).statusCode, 400)
    }
    assert.equal(
      (await submit({ kind: "scale", value: 4, outcome: "wizard" })).statusCode,
      204,
    )
    assert.equal(
      (await submit({ kind: "yesno", value: "true" })).statusCode,
      400,
    )
    assert.equal(
      (await submit({ kind: "yesno", value: true, outcome: "wizard" }))
        .statusCode,
      204,
    )
    assert.equal((await submit({ kind: "yesno", value: true })).statusCode, 409)

    const result = await app.inject({ url: "/session/result", headers })
    assert.equal(result.statusCode, 200)
    assert.deepEqual(result.json(), {
      title: "Fighter",
      description: "Description for the fighter-type outcome",
      reasons: [
        "Choice question? You chose: Option 1.",
        "Yes or no question? You said yes.",
      ],
    })
    assert.equal(
      (await app.inject({ url: "/session/result", headers })).body,
      result.body,
    )

    const other = await app.inject({
      method: "POST",
      url: "/session",
      payload: { quiz: "classes" },
    })
    const otherId = other.json<{ session_id: string }>().session_id
    assert.notEqual(otherId, id)
    assert.equal(
      (
        await app.inject({
          url: "/session/result",
          headers: { "x-session-id": otherId },
        })
      ).statusCode,
      409,
    )
  } finally {
    await app.close()
  }
})
