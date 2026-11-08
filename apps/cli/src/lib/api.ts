const baseUrl = "http://localhost:3000"

export async function call(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let response: Response

  try {
    response = await fetch(`${baseUrl}${path}`, init)
  } catch {
    throw new Error(`Cannot reach the server at ${baseUrl}`)
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
