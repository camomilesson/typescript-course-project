import { createInterface } from "node:readline/promises"

interface Choice {
  label: string
  points: number
}

interface Question {
  text: string
  choices: Choice[]
}

const questions: Question[] = [
  {
    text: "Which ability modifier do you normally add to initiative?",
    choices: [
      { label: "Strength", points: 0 },
      { label: "Dexterity", points: 1 },
      { label: "Wisdom", points: 0 },
      { label: "Constitution", points: 0 },
    ],
  },
  {
    text: "Your attack roll totals 16 against an enemy with AC 16. What happens?",
    choices: [
      { label: "You miss", points: 0 },
      { label: "You hit", points: 1 },
      { label: "You deal half damage", points: 0 },
      { label: "You roll again", points: 0 },
    ],
  },
  {
    text: "A wizard casts Misty Step using a bonus action. An enemy casts Counterspell against it.\nThe wizard also knows Counterspell and has their reaction available.\nCan they Counterspell the enemy's Counterspell?",
    choices: [
      {
        label:
          "Yes, because reaction spells never count toward spellcasting restrictions.",
        points: 0,
      },
      {
        label: "Yes, but only if they use a higher-level spell slot.",
        points: 0,
      },
      {
        label:
          "No, because casting a bonus-action spell restricts other spells on that turn to cantrips with a casting time of one action.",
        points: 1,
      },
      {
        label: "No, because you cannot cast reaction spells on your own turn.",
        points: 0,
      },
    ],
  },
]

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

let score = 0

for (const q of questions) {
  console.log(`\n${q.text}\n`)

  for (const [i, c] of q.choices.entries()) {
    console.log(`${i + 1}. ${c.label}`)
  }

  const answer = Number(await rl.question("\nYour answer: "))
  const choice = q.choices[answer - 1]

  if (choice) {
    score += choice.points
    console.log(choice.points > 0 ? "Correct!" : "Wrong!")
  } else {
    console.log("Invalid answer!")
  }
}

console.log(`\nFinal score: ${score}/${questions.length}`)

rl.close()
