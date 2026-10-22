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
