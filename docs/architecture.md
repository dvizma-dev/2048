# Architecture

This app is a small static browser game. `index.html` loads each script in order
and `js/application.js` constructs one `GameManager` for a 4x4 board.

For diagrams of the repository structure, runtime flow, user actions, state
storage, styling, and tests, see `docs/visual-guide.md`.

## Runtime flow

1. `index.html` loads polyfills, input, rendering, model, storage, game manager,
   and application scripts.
2. `js/application.js` waits for `requestAnimationFrame`, then creates
   `new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager)`.
3. `GameManager` registers input callbacks for `move`, `restart`,
   `keepPlaying`, and `targetChange`.
4. `GameManager.setup()` restores saved state from `LocalStorageManager` or
   creates a new grid with two random start tiles. Restored winning targets are
   normalized through the same allow-list used for selector changes.
5. Every valid move updates the grid, score, win/loss state, saved state, and
   rendered DOM.

The verified script order in `index.html` is:

```text
js/bind_polyfill.js
js/classlist_polyfill.js
js/animframe_polyfill.js
js/keyboard_input_manager.js
js/html_actuator.js
js/grid.js
js/tile.js
js/local_storage_manager.js
js/game_manager.js
js/application.js
```

## Core objects

`Tile` is the smallest model object. It stores `x`, `y`, `value`,
`previousPosition`, and `mergedFrom`. Rendering uses `previousPosition` and
`mergedFrom` for animations.

`Grid` owns the two-dimensional `cells` array. Coordinates are stored as
`cells[x][y]`, so code that reads rows visually should take care not to assume
`cells[y][x]`.

`GameManager` owns gameplay rules:

- direction mapping: `0` up, `1` right, `2` down, `3` left
- random tile values: `2` 90% of the time, `4` 10% of the time
- one merge per tile per move
- score increases by the value of each merged tile
- reaching the configured winning target marks the game as won
- valid winning targets are `512`, `1024`, and `2048`; `2048` is the default
- invalid saved targets fall back to `2048`
- a full board with no adjacent equal tiles marks the game as over

## Adapters

`KeyboardInputManager` converts browser events into game events. It supports
arrow keys, Vim keys, WASD, restart buttons, keep-playing buttons, and swipe or
MS pointer movement.

The input manager maps arrow keys, Vim keys, and WASD to the same direction
numbers used by `GameManager`: `0` up, `1` right, `2` down, and `3` left. The
`R` key, `.retry-button`, and `.restart-button` emit restart. The
`.keep-playing-button` emits keep-playing. The `.target-selector` emits
`targetChange` and starts a fresh game with the selected winning target.

`HTMLActuator` converts grid state into DOM elements and CSS classes. It also
updates score, best score, and win/loss messages.

`LocalStorageManager` stores `bestScore`, `gameState`, and `winningTarget` in
`window.localStorage` when available. If local storage is unavailable, it uses
the in-memory `window.fakeStorage` object. Winning targets are stored and
restored only when they match `512`, `1024`, or `2048`.

## Persistence

After each actuation, `GameManager` updates the best score and saves serialized
game state unless the game is over. Game-over state clears the resumable game
state, but winning does not clear it because the player may choose to keep
playing. Serialized game state includes `winningTarget` so a resumed game keeps
the same target. If a stored game contains a stale or invalid target,
`GameManager` resets it to the default `2048`.

## Styling

The visual system is defined in Sass under `style/`. The browser loads
`style/main.css`, which is generated from `style/main.scss`.

This branch applies the Jaipur-inspired theme documented in
`docs/jaipur-theme-template.md`. The tile palette is explicit in
`$jaipur-tile-colors`; the `2` tile uses `$jaipur-blue-pottery-deep` with
`$jaipur-white` text.

The intricate Jaipur treatment is CSS-only. It uses Sass pseudo-elements and
background layers for the desktop jharokha side panels, heading frieze, board
arches, jaali texture, and blue-pottery details. `GameManager`, `Grid`, `Tile`,
and the input/storage adapters do not depend on the theme.

The board establishes an isolated stacking context. Decorative
`.game-container:before` and `.game-container:after` layers sit at `z-index: 0`;
the grid sits at `z-index: 10`; tiles sit at `z-index: 100`; `.tile-inner`
content sits at `z-index: 101`; and game messages sit at `z-index: 1000`.
Those values keep decorative layers from covering tiles or message controls.
