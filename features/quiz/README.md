# Shared quiz package

The `quiz` workspace package contains the D&D class quiz domain and the service functions used by both clients. See the [root README](../../README.md) for installation, running the apps, and current limitations.

## Modlets

- `play`: shared questions, prompts, submissions, reply types, guards, formatting, scoring, and the `Session` class.
- `quizzes`: validated quiz-file loading and the ten-question `classes` quiz.
- `outline`: question previews and counts by question kind.
- `saved`: validated settings and saved-submission file readers for the CLI.
- `services`: typed HTTP calls with runtime response validation for quiz, session, progress, answers, and results.

Public imports use `quiz/play`, `quiz/quizzes`, `quiz/outline`, `quiz/saved`, and `quiz/services`. Each modlet exposes its public API through `index.ts`. Browser clients use the services and presentation types; file readers and scoring remain on the Node side.

Run this package's checks from the repository root:

```sh
pnpm --filter quiz lint
```
