# Sweetu's Birthday Quest

An in-progress, static birthday experience for Gunjan. Content is added with Dhyan one chapter at a time. The current build includes the introduction, an interactive welcome, a three-question quiz, the first memory clue and reveal, and local progress storage.

The current visual direction is a warm, playful scrapbook with handwritten notes and gentle motion. Reduced-motion settings disable decorative animation.

## Run locally

Serve this folder with a static HTTP server (ES modules do not reliably load from `file://`). For example, run `python -m http.server 8000` here and open `http://localhost:8000`.

## Current flow

Initialization → Welcome choice → Level 1 quiz → Chapter 1 clue → Memory 1. Wrong answers never block progress. Quiz answers and the unlocked memory survive refresh. The reset control in the footer clears local progress after confirmation.

Personal content lives in `PROJECT_CONTENT.md`; the planned journey is in `PROJECT_FLOW.md`. Both are drafts and should be reviewed before publishing the finished site.
