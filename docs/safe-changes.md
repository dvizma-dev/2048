# Safe changes

Use this checklist when making small changes to the game.

## Before editing

1. Identify whether the change touches gameplay, rendering, input, storage, or
   styles.
2. Read the matching files listed in `docs/architecture.md`.
3. Check `git status --short` so you can avoid overwriting unrelated work.

## Gameplay changes

Gameplay changes usually involve `js/game_manager.js`, `js/grid.js`, or
`js/tile.js`. Be careful with:

- traversal order in `GameManager.buildTraversals`
- merge detection in `GameManager.move`
- `mergedFrom`, because rendering depends on it
- score updates, especially when several merges happen in one move
- win target, win state, and game-over state, because saved state behavior
  depends on them

Add or update tests in `test/run-tests.js` for gameplay changes.

## Rendering and input changes

Rendering changes usually involve `js/html_actuator.js` and `style/`. Input
changes usually involve `js/keyboard_input_manager.js`.

After making these changes, verify the app in a browser. Check at least:

- arrow key movement
- restart button
- score and best score display
- win or game-over message if the change can affect it
- touch or pointer behavior when changing swipe handling

## Style changes

Edit Sass sources in `style/` first. Regenerate `style/main.css` after changing
Sass so the browser sees the update.

Do not hand-edit `style/main.css` as the only source of a style change.

For the reusable AU Bank-inspired theme direction, use
`docs/au-bank-theme-template.md` as the design reference before editing styles.

## Final verification

Run:

```sh
node test/run-tests.js
```

For UI changes, also run the app locally with:

```sh
python3 -m http.server 8000
```
