# Sweetu's Birthday Quest

An in-progress, static birthday experience for Gunjan. Content is added with Dhyan one chapter at a time. The current build includes the introduction, an interactive welcome, a three-question quiz, memory reveals, an understanding game, a birthday promise, a video surprise, five secret flowers, and local progress storage.

The current visual direction is a warm, playful scrapbook with handwritten notes and gentle motion. Reduced-motion settings disable decorative animation.

Each step uses a clear primary button and short instruction. Memory reveals include an explicit continue action, and interactive notes are labeled “tap me” for users who are less familiar with web interactions.

## Run locally

Serve this folder with a static HTTP server (ES modules do not reliably load from `file://`). For example, run `python -m http.server 8000` here and open `http://localhost:8000`.

## Current flow

Initialization → Welcome choice → Level 1 quiz → Chapter 1 clue → Memory 1. Wrong answers never block progress. Quiz answers and the unlocked memory survive refresh. The reset control in the footer clears local progress after confirmation.

Personal content lives in `PROJECT_CONTENT.md`; the planned journey is in `PROJECT_FLOW.md`. Both are drafts and should be reviewed before publishing the finished site.

## Deployment

The GitHub Pages workflow publishes only `index.html`, `css/`, `js/`, `data/`, and approved files in `assets/`. Planning documents are excluded from the Pages artifact. A push to `main` triggers a deployment after Pages is enabled with GitHub Actions as its source.

## Branch workflow

- `main` contains the tested version and is the only branch that deploys.
- `develop` collects completed work before release.
- New work uses a short-lived branch created from `develop`, such as `feature/memory-03`.
- Test the feature branch locally, merge it into `develop`, and test the combined journey.
- Merge `develop` into `main` only when that version is ready to publish.
