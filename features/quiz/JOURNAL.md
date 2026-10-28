# Cycle 1 Journal

## Discovery

The first issue is quite simple: in one of the dictionaries in the list, the word `ingredients` is misspelled.

The second, I think, could be an issue with applying a `.join()` method to a `const` variable. I don't know the specifics of how `const` works in JS/TS, but it seems sus.

Another suspect — using `const`-style iteration over items that don't internally match: the last dictionary has an integer in the `name` field, while the others have strings. Considering your brief comment on TypeScript's approach to typing, this could potentially be an issue.

If this were a list of 5,000 entries managed by a bunch of people, it would require type checks to ensure all the names are strings, all the keys are spelled correctly, etc. In Python or Kotlin, I would probably do something with a class — it would allow even complex checks to be made automagically, on write.

## Journal

No sticking points so far, smooth sailing.

Most of the lecture was factual information about the course and the teacher's approach to education. Feeling rock solid, nothing to report. Actually, the way the class was prepared made me decide to drop another course I was considering for this module to focus on this one.

Since it's the first lecture, it didn't really lean on any previous course content.

## After Homework

No resolutions so far, due to the lack of struggles.

# Cycle 2 Journal

## Discovery

Covered in class, nothing to add, really.

## Before homework

Tbh, I forgot that you're supposed to fill this out before doing the actual HW and I don't wanna pretend.

Since I had no sticking points the day before, there was nothing to resolve.

Unfortunately, I missed the first half of the class, so I was a bit uncertain of how to start the setup — but using class materials I easily looked everything up.

## After homework

It was fun, actually. I felt that adding a couple of arrays is too easy — so I built a working CLI quiz, with input reading and all.

Had to look some things up online, but nothing was too complicated. Also, using **await** for input reading felt strange after Python's simple input().

# Cycle 3 Journal (belated?)

Since Google Classroom updated the deadline for this one only retroactively, I completely forgot to sumbit it last week. I hope it won't be a problem.

## Discovery

Discussed in class, nothing to add, really. Btw, I had some fun implementing input checks in my version of Cycle 2 HW since I'm doing actual CLI input instead of hardcoded answers.

## Before homework

Hmmm, now that I'm thinking about it, I'm pretty sure the Friday, Oct 22nd deadline for Cycle 3 Journal can't be correct. Because it requires us to fill out both Before and After for a Cycle 3 HW, the deadline for which is still set for Tuesday, Oct 27th.

Anyways, might as well write this now. I'm feeling pretty solid, no complaints here. Interesting to go in depth on a bunch of topics during class, I feel like it makes you both a better developer and a better LLM-output-validator. Talked to a couple of classmates, some of them are reasonably-seasoned JS/TS devs — and even they have not heard before about some of the stuff that's covered.

Idk, really, what 'today' is in 'What previous content did today's material lean on?', considering the kerfuffle with the date of this journal assignment. Today, on Monday, we were largely discussing guards and validation. I'd say we mostly leaned on the type checks that were covered previously.

## After homework

Actually, I had to redo part of the previous code. My initial implementation was more of a classical quiz, with right and wrong answers. Here, the task required to add outcomes to everything — which implies that all answers are kinda correct and that the purpose of the quiz is smth we talked about in the first few classes: a classification system a-la Buzzfeed quizzes. It wasn't too difficult, just a tiny bit annoying — as it always is with redoing your own work.

# Cycle 4 Journal

## Discovery

We covered it in class extensively, so there's not much use reiterating it. But yeah, most items are broken: some fail on JSON.parse(), some on the abcense of a numeric quantity.

Overall, I kinda like input parsing. It's most often a very self-contained logical problem. You have to cover all the bases, otherwise it will break at some point.

## Before homework

Yeah, this one did annoy me a bit. As you may have noticed, I started the first Course Project task with implementing an actual input reader in cli.ts — it's always my first instinct, to build a mininmal working solution and iterate from there. Emulating input in the first cycles — and now emulating the whole completed game — feels kinda wrong. There's nothing actually wrong with it, it's just not the way I personally prefer.

## After homework

Persistence in game-adjacent projects is always fun. If I was developing this course, I might have made us have an actual JSON file to store settings and pull from there. But, again, not important.

# Cycle Journal

## Discovery

First of all, feels weird that different closely related modlets in the same project are using different versions of Prettier. If it were something more fundamental, at least a linter, it would be more realistic. Here — just make everyone use the same formatter, it doesn't really change anything. Just makes things prettier.

The key problem is a menu — it definitely should not be copied and stored in two places. At least without versioning. Someone is bound to change one and forget to mirror it in the other.

## Before homework

First of all, I do not understand the enumerating convention for the Cycles. Why does Cycle go after Cycle 1-4, and why am I now seeing new Cycle 1 tasks in Google Classroom? It's probably Week 1 Cycle 1-4, then Week 1 Cycle Wrap-up, then Week 2 Cycle 1-4 and another wrap-up. At least that's how I'm interpreting it. Anyways, just sharing my perception.

Otherwise, feeling solid, trudging along.

## After homework
