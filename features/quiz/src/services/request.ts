const BASE_URL = "http://localhost:3000"

export async function request<Reply extends object = object>(
  path: string,
  init?: RequestInit,
): Promise<Reply> {
  const response = await call(path, init)
  return response.json() as Promise<Reply>
}

export async function call(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, init)
  } catch {
    throw new Error(`Cannot reach the server at ${BASE_URL}`)
  }

  if (!response.ok) {
    let message = `The server answered ${response.status}`

    try {
      const body: unknown = await response.json()
      if (
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error
      }
    } catch {
      throw new Error(message)
    }

    throw new Error(message)
  }

  return response
}
