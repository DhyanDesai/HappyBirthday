# Sweetu's Birthday Quest — proposed screen flow

**Status:** Working draft. Dhyan asked to implement one flow at a time while supplying content. The introduction, interactive welcome, three-question Level 1 quiz, and first memory clue are implemented; later screens remain proposed.

## Journey map

Intro → Level 1 quiz → Memory reveal 1 → Level 2 memory challenges → Memory reveals → Memory Vault → Radio Sweetu → Secret hunt → Things I'll Never Forget → Final question → Final reveal.

Progress is gated by completion, but wrong answers never stop the journey. The vault and radio allow exploration once reached. Ten flowers are distributed across reachable screens; the secret ending is separate from the main ending.

## Screen by screen

| # | Screen | What Sweetu sees and does | Unlock / saved progress |
| --- | --- | --- | --- |
| 0 | Initialization | Animated system check: memories, inside jokes, embarrassing moments, Sweetu. Ends with identification of Gunjan / Sweetu and “Access granted.” Reduced-motion users see the same information without timed effects. | Start is available after the introduction. |
| 1 | Welcome | “Welcome, Sweetu.” Brief playful copy, then **Enter the Quest**. Returning visitors see “Welcome back, Sweetu” and a resume control. | Quest starts or resumes at saved stage. |
| 2 | Level 1: Know Dhyan | Three multiple-choice questions from facts Dhyan has supplied, one at a time. Each answer shows a custom reaction and the next button. Score is shown lightly; mistakes are allowed. More questions can be added when Dhyan supplies them. | Completion saves score and opens the clue for memory 1. |
| 3 | Memory reveal 1 | A sealed envelope or card opens after a tap. The real memory appears with its available date, photo, story, quote, or song. | Memory 1 saved as unlocked; continue to Level 2. |
| 4 | Level 2: Remember Us | A short set of real friendship prompts, potentially multiple choice, timeline, photo clue, or fill-in. Prompts are built only from supplied memories. | Each completed challenge can unlock a related memory. Mistakes show a playful hint and allow continuation. |
| 5 | Memory reveals | Each new memory receives a short “Memory verified / unlocked” transition and a deliberate open action. | Newly unlocked IDs saved immediately. |
| 6 | Memory Vault | Grid of nine numbered slots. Unlocked slots open their full story; locked slots reveal only that they are locked. Different supplied content may use photo, conversation, funny, song, letter, or mystery presentation. | Free exploration; reaching the vault unlocks Radio. |
| 7 | Radio Sweetu 98.8 FM | Retro station with track list, dedication, play/pause if permitted audio exists, and a memory link. External song links remain clearly labeled. No autoplay. | Radio visit saves progress; continue to flower hunt. |
| 8 | Find the secrets | Flower counter and gentle clue to revisit accessible screens. Flowers are keyboard and touch accessible. Each discovery opens a small personal note. | IDs persist. Finding all ten unlocks a distinct bonus message; the main story can continue before all ten are found. |
| 9 | Things I'll Never Forget | Calm cards with specific qualities and moments drawn from Dhyan's notes. Less motion and denser, sincere writing. | Continue to final question. |
| 10 | One last question | Free-text response to “What do you think is the most important memory in this entire website?” Submission accepts any nonempty answer. A short intentional pause leads to “Wrong.” then “There isn't one.” | Marks the main journey complete and unlocks final reveal. |
| 11 | Birthday reveal | Minimal background, quiet transition, “Happy Birthday, Sweetu ❤️”, then Dhyan's approved letter. | Final remains available on return. |
| Bonus | Secret ending | After all ten flowers, a separate note or surprise appears, whether found before or after the final reveal. | Secret ending stays unlocked. |

## Navigation and persistence

- A subtle progress indicator shows the current phase without exposing future personal content.
- Current stage, quiz answers/score, unlocked memory IDs, discovered flower IDs, and completion flags save to `localStorage` after each meaningful action.
- On reload, Sweetu resumes at the last reachable stage. Unlocked vault items remain available.
- A small reset control clears local progress for testing, with a confirmation step to avoid accidental loss.
- The final letter is inaccessible through ordinary navigation until the final question is submitted. The secret ending depends only on all ten flowers.

## Flower placement proposal

One each on welcome, Level 1, first reveal, Level 2, another reveal, vault, radio, secret hunt, reflection, and final screen. Each remains discoverable through revisiting accessible screens. A visible revisit control is needed so late discoveries are possible; none depends on a hidden gesture.

## Visual and interaction direction

- Playful opening: near-black navy, warm white, pink accent, crisp sans-serif and small handwritten notes; terminal details used briefly.
- Nostalgic middle: paper/photo styling, restrained card reveal, retro radio controls.
- Quiet ending: fewer controls, slower transitions, generous spacing, readable letter.
- Mobile first with visible focus, touch targets, text alternatives, and reduced-motion behavior.

## Content and launch gates

The flow can be implemented after Dhyan confirms the real memories, questions, secret notes, songs/assets, and final-letter notes. Before publication, verify all content and public hosting permissions, complete device/browser testing, and review the public GitHub Pages URL.
