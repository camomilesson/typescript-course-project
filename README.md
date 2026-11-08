# D&D Class Quiz

A Dungeons & Dragons-themed personality quiz built for the Advanced JavaScript and TypeScript course at Harbour.Space. Answer ten adventure questions to discover whether your approach fits a Fighter, Ranger, Rogue, or Wizard. The project combines a terminal client, a Fastify API, and a browser client in a pnpm/Nx monorepo.

## Requirements and setup

Install Node.js 24.22 or newer and pnpm 12.15 or newer within major version 12. Node runs the TypeScript source directly; the browser app uses Vite. No database, API keys, or environment file is required.

```sh
git clone https://github.com/camomilesson/typescript-course-project.git
cd typescript-course-project
pnpm install --frozen-lockfile
```

Run all commands below from the repository root.

## Run the project

Start the API in one terminal:

```sh
pnpm --filter api dev
```

Nodemon restarts it when API or shared quiz TypeScript changes. The API listens at `http://localhost:3000`. To run without automatic restarts, use `pnpm --filter api start`. Run one API instance at a time; `EADDRINUSE` means port 3000 is already occupied.

Start the web app in a second terminal:

```sh
pnpm --filter web dev
```

Open the address Vite prints, normally `http://localhost:5173`. Choose an answer to advance. The page shows server-reported progress from Question 1 of 10 through Question 10 of 10, then displays “Thank you.” Refreshing starts a new session.

With the API running, use another terminal for the CLI:

```sh
pnpm --filter cli start play classes --name Ada
pnpm --filter cli start replay classes
```

`play` asks questions interactively and prints a recap, the winning class, and its contributing answers. `--name` (or `-n`) overrides the greeting. `replay` submits the bundled saved answers without prompting; the bundled example produces Rogue. The quiz argument defaults to `classes` for both commands.

Settings are in `apps/cli/saved/settings.json`; `hints: false` hides terminal question hints. Replay answers are in `apps/cli/saved/game.json`. Their order and choice labels must match the quiz. Playing does not overwrite this file.

Stop each running server with `Ctrl+C` in its terminal.

## Checks and production build

```sh
pnpm lint
pnpm lint-typecheck
pnpm --filter web build
```

`pnpm lint` runs TypeScript, ESLint, Prettier, and Knip checks for all packages. Nx may reuse successful checks from its cache. The web build writes generated assets to `apps/web/dist`, which is ignored by Git and lint tools. GitHub Actions runs workspace lint on pushes and pull requests affecting source, tooling, dependencies, or workflows. Journal-only and root README-only changes do not trigger it.

To verify error handling, run `pnpm --filter cli start replay nope`: it should print “There is no such quiz” and exit with code 1. Stop the API and retry a CLI command: it should report that it cannot reach the server. The browser also displays connection errors in the page.

## Repository layout

| Path               | Responsibility                                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/api`         | Fastify entry point, quiz and session route plugins, in-memory session storage, and conversion between public prompts and scored answers. |
| `apps/cli`         | Commander commands, Inquirer prompts, and a saved-file locator modlet.                                                                    |
| `apps/web`         | Vite page and DOM-based question rendering with delegated button clicks.                                                                  |
| `features/quiz`    | Shared domain types, guards, scoring, session class, quiz loading, formatting, saved-file readers, and API services.                      |
| `internal/tooling` | Shared TypeScript, ESLint, and Prettier configuration.                                                                                    |
| `.github`          | Dependency setup action and workspace checks.                                                                                             |
| `JOURNAL.md`       | Course development notes.                                                                                                                 |

Application code lives in `src`. Related files form modlets with `index.ts` public entry points, such as `play`, `services`, `ask`, and each CLI command. App entry points compose those modlets. Quiz data lives in `features/quiz/src/quizzes/classes.json`; editable CLI settings and saved answers live outside source under `apps/cli/saved`.

## How the parts fit together

Both clients use `quiz/services` to fetch questions, start a session, and send submissions. The CLI also requests the result; the web requests progress before each question. The API loads and validates the scored quiz, strips scoring information from public prompts, and resolves submitted choice labels against the original choices. Clients never choose their own points or outcome IDs.

The shared code demonstrates discriminated unions, type guards and narrowing, interfaces, generics, `Pick` and `Omit`, classes with private state, array transformations, asynchronous file I/O, promises, HTTP requests, and DOM events. Successful JSON replies are checked at runtime before reaching the clients. Quiz validation checks shapes, nonempty questions/outcomes, unique outcome IDs and choice labels, finite nonnegative points, and valid outcome references.

### API routes

| Method and path        | Purpose                                                | Success                                  |
| ---------------------- | ------------------------------------------------------ | ---------------------------------------- |
| `GET /quizzes/:name`   | Public questions without scoring data                  | `200`, `{ questions }`                   |
| `POST /session`        | Start with a JSON body such as `{ "quiz": "classes" }` | `201`, `{ session_id }`                  |
| `GET /session`         | Progress                                               | `200`, `{ answered, total }`             |
| `POST /session/answer` | Submit the next answer                                 | `204`, no body                           |
| `GET /session/result`  | Finish and read the class and explanation              | `200`, `{ title, description, reasons }` |

Progress, answer, and result routes require an `x-session-id` header. JSON request bodies require `content-type: application/json`. Missing/unknown session IDs return `401`; invalid submissions return `400`; an unknown quiz returns `404`; unfinished results and extra answers return `409`. Errors have an `error` message. Choice submissions contain a picked label, scales contain a whole number from 1 to 5, and yes/no submissions contain a boolean.

Each choice awards three points to its associated class. A scale awards its value to one class, and a yes/no question awards one point for yes and zero for no. The highest total wins; ties follow the outcome order in the quiz file. Reasons list positive-scoring answers for the winning class. This is a playful preference quiz rather than a D&D rules assessment.

## Current status and next steps

Working: all three clients/server parts, ten questions across three kinds, server-side scoring, saved replay, progress, typed route contracts, runtime validation, and readable connection/validation errors.

Limitations: the web currently ends with a thank-you message instead of showing the class result. Only the `classes` quiz is bundled. Sessions live in process memory, disappear when the API restarts, and have no expiry or authentication. The API URL is fixed to localhost:3000; CORS is enabled for local development. Saved replay answers are edited manually. The page has minimal styling and offers no retry or resume control.

Next steps: show the result and explanations in the browser, improve accessibility and presentation, add quiz selection, configure API origins per environment, and introduce persistent sessions with expiry before public deployment.
