# Codex guide

This repository is a static JavaScript implementation of 2048. It has no build
step for the game logic: `index.html` loads plain browser scripts from `js/` and
styles from `style/main.css`.

## Start here

- Read `README.md` and `CONTRIBUTING.md` for project history and contribution
rules.
- Read `docs/setup.md` to run the game locally.
- Read `docs/architecture.md` before changing gameplay, storage, input, or DOM
rendering.
- Read `docs/visual-guide.md` for diagrams of structure, user action flow,
state storage, styling, and test boundaries.
- Read `docs/testing.md` before adding or changing tests.
- Read `docs/safe-changes.md` for the safest way to make small edits.
- Read `docs/final-review.md` for the latest verified branch checks, review
  fixes, and known Sass warnings.

## Commands

- Run the dependency-free baseline tests with `node test/run-tests.js`.
- Check whitespace in the diff with `git diff --check`.
- Parse Sass without writing generated repo files with
  `npx sass --no-source-map style/main.scss /tmp/2048-main.css`.
- Serve the static app from the repo root with `python3 -m http.server 8000`,
  then open `http://localhost:8000`.
- If you edit Sass, compile `style/main.scss` to `style/main.css` with the Sass
  workflow described in `CONTRIBUTING.md`.

## Guardrails

- Do not change production code unless the user explicitly asks for it.
- Keep JavaScript in the existing prototype-based style and use 2-space
  indentation.
- Preserve the 4x4 board, tile values, movement directions, and scoring rules
  unless the requested change is specifically about gameplay.
- Keep winning-target options limited to `512`, `1024`, and `2048` unless the
  requested change explicitly expands that list.
- Edit `style/main.scss` and related Sass sources before regenerating
  `style/main.css`; do not hand-edit generated CSS for style changes.
- Avoid adding dependencies for small changes. This app is intentionally simple
  and should remain easy to run from a static file server.
- Treat `master` as the pure game branch. Existing guidance says `gh-pages`
  may contain analytics and sharing features that are not part of core gameplay.

## Verification

At minimum, run:

```sh
node test/run-tests.js
```

For UI or input changes, also open the game in a browser and verify keyboard,
button, and touch or pointer behavior where relevant.
