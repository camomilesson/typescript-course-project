import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"

const readline = createInterface({
  input: stdin,
  output: stdout,
})

export function readInput(prompt: string): Promise<string> {
  return readline.question(prompt)
}

export function closeInput(): void {
  readline.close()
}
