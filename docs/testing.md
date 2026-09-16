# Testing

This repository now has a small dependency-free baseline test suite for core
game behavior.

## Run tests

From the repository root:

```sh
node test/run-tests.js
```

For final branch verification, also run:

```sh
git diff --check
npx sass --no-source-map style/main.scss /tmp/2048-main.css
python3 -m http.server 8000
curl -I http://127.0.0.1:8000/
curl -I http://127.0.0.1:8000/style/main.css
```

The test runner uses only Node.js built-in modules. It loads the browser scripts
with `vm`, creates minimal input, storage, and actuator fakes, and verifies the
model and game-manager behavior without a browser.

For a diagram of what the test runner covers and what remains manual, see
`docs/visual-guide.md`.

## What is covered

- `Tile` position updates and serialization.
- `Grid` bounds checks, insertion, removal, available cells, and restoration
  from serialized state.
- `GameManager` start-tile creation, deterministic merges, score updates, and
  no-op moves that should not add random tiles.
- Winning-target behavior for `512`, `1024`, and the default `2048`.
- `LocalStorageManager` validation and storage for target options.
- Restoring saved games with valid and invalid winning targets.
- The selector event binding that emits `targetChange`.

## What is not covered

The baseline tests do not exercise DOM rendering, CSS animations, keyboard
events, button events, touch gestures, or browser local storage integration.
For changes in those areas, run the Node tests and manually verify the behavior
in a browser.

The latest verified browser checks are recorded in `docs/final-review.md`.

## Add tests safely

- Prefer tests around `Tile`, `Grid`, and `GameManager` when the behavior can be
  checked without the DOM.
- Keep the test runner dependency-free unless the project intentionally adopts a
  broader test toolchain.
- Make randomness deterministic by replacing `Math.random` inside a test and
  restoring it afterward.
- Use small board fixtures that make the expected movement or merge obvious.
