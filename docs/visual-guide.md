# Visual guide

Use this guide to get oriented quickly. The diagrams show the static app
structure, how a user action moves through the code, where state is stored, and
where tests and styling live.

## Main structure

```text
2048 repo
├── index.html
│   ├── board markup
│   ├── score, target, and message containers
│   └── script load order
├── js/
│   ├── application.js              starts GameManager(4, ...)
│   ├── game_manager.js             gameplay rules, target, state transitions
│   ├── grid.js                     cells[x][y] board model
│   ├── tile.js                     tile model and serialization
│   ├── keyboard_input_manager.js   keyboard, button, target, swipe events
│   ├── html_actuator.js            DOM rendering
│   ├── local_storage_manager.js    best score, target, saved game state
│   └── *_polyfill.js               browser compatibility helpers
├── style/
│   ├── main.scss                   source styles
│   ├── helpers.scss                Sass mixins and helpers
│   ├── main.css                    generated CSS loaded by index.html
│   └── fonts/                      Clear Sans assets
├── test/
│   └── run-tests.js                dependency-free Node baseline tests
├── docs/
│   ├── setup.md
│   ├── architecture.md
│   ├── testing.md
│   ├── safe-changes.md
│   └── visual-guide.md
├── Rakefile                        appcache helper for gh-pages branch
├── README.md
└── CONTRIBUTING.md
```

## Runtime map

```mermaid
flowchart LR
  Browser["Browser opens index.html"]
  Css["style/main.css"]
  App["js/application.js"]
  Manager["GameManager"]
  Input["KeyboardInputManager"]
  Grid["Grid"]
  Tile["Tile"]
  Storage["LocalStorageManager"]
  Actuator["HTMLActuator"]
  Dom["DOM: tile, score, best, target, message containers"]

  Browser --> Css
  Browser --> App
  App --> Manager
  Manager --> Input
  Manager --> Grid
  Grid --> Tile
  Manager --> Storage
  Manager --> Actuator
  Actuator --> Dom
```

`index.html` loads plain scripts, so load order matters. The model classes and
adapters are globals by the time `js/application.js` constructs the manager.

## User action flow

This is the path for a move from a key press or swipe.

```mermaid
sequenceDiagram
  participant User
  participant Input as KeyboardInputManager
  participant Game as GameManager
  participant Grid
  participant Storage as LocalStorageManager
  participant View as HTMLActuator
  participant DOM

  User->>Input: arrow/Vim/WASD key or swipe
  Input->>Game: emit("move", direction)
  Game->>Game: getVector(direction)
  Game->>Game: buildTraversals(vector)
  Game->>Grid: read and move tiles
  Game->>Game: merge matching tiles once per move
  Game->>Game: add score for merged values
  Game->>Grid: add random 2 or 4 if anything moved
  Game->>Storage: save bestScore and gameState
  Game->>View: actuate(grid, metadata)
  View->>DOM: render tiles, score, best score, message
```

The direction values are verified in `js/game_manager.js` and
`js/keyboard_input_manager.js`: `0` is up, `1` is right, `2` is down, and `3` is
left.

Target changes follow the same input-manager pattern:

```mermaid
sequenceDiagram
  participant User
  participant Input as KeyboardInputManager
  participant Game as GameManager
  participant Storage as LocalStorageManager
  participant View as HTMLActuator

  User->>Input: choose 512, 1024, or 2048
  Input->>Game: emit("targetChange", target)
  Game->>Storage: setWinningTarget(target)
  Game->>Storage: clearGameState()
  Game->>Game: setup() fresh game
  Game->>View: actuate(grid, metadata)
```

## Restart and keep-playing flow

```mermaid
flowchart TD
  Restart["Restart button, retry button, or R key"]
  ClearState["LocalStorageManager.clearGameState()"]
  ClearMessage["HTMLActuator.continueGame()"]
  Setup["GameManager.setup()"]
  NewGrid["new Grid(4) with two start tiles"]

  KeepPlaying["Keep going button"]
  Flag["GameManager keepPlaying flag becomes true"]

  Restart --> ClearState --> ClearMessage --> Setup --> NewGrid
  KeepPlaying --> Flag --> ClearMessage
```

Restart clears saved game state and starts fresh. Keep-playing only clears the
win message and lets the current game continue beyond the selected target.

## State storage

```mermaid
flowchart TB
  Manager["GameManager.serialize()"]
  State["gameState JSON"]
  Best["bestScore"]
  Target["winningTarget"]
  LocalStorage["window.localStorage"]
  FakeStorage["window.fakeStorage fallback"]
  Restore["GameManager.setup() restores Grid, score, over, won, keepPlaying, winningTarget"]

  Manager --> State
  Manager --> Best
  Manager --> Target
  State --> LocalStorage
  Best --> LocalStorage
  Target --> LocalStorage
  State -. if localStorage unavailable .-> FakeStorage
  Best -. if localStorage unavailable .-> FakeStorage
  Target -. if localStorage unavailable .-> FakeStorage
  LocalStorage --> Restore
  FakeStorage --> Restore
```

`LocalStorageManager` uses three keys: `bestScore`, `gameState`, and
`winningTarget`. `gameState` is JSON from `GameManager.serialize()`, including
the serialized grid, score, `over`, `won`, `keepPlaying`, and `winningTarget`.

## Board model

```text
Grid cells are addressed as cells[x][y]

          y=0       y=1       y=2       y=3
       +---------+---------+---------+---------+
x=0    | cell    | cell    | cell    | cell    |
       +---------+---------+---------+---------+
x=1    | cell    | cell    | cell    | cell    |
       +---------+---------+---------+---------+
x=2    | cell    | cell    | cell    | cell    |
       +---------+---------+---------+---------+
x=3    | cell    | cell    | cell    | cell    |
       +---------+---------+---------+---------+
```

This is column-first storage, not row-first storage. A tile stores its own `x`
and `y`, and `Grid.insertTile(tile)` places it at `cells[tile.x][tile.y]`.

## Styling and assets

```mermaid
flowchart LR
  Scss["style/main.scss"]
  Helpers["style/helpers.scss"]
  Fonts["style/fonts/clear-sans.css and font files"]
  Css["style/main.css"]
  Html["index.html"]
  Browser["Browser rendering"]

  Helpers --> Scss
  Fonts --> Scss
  Scss --> Css
  Css --> Html
  Html --> Browser
```

`style/main.css` is the file the browser loads. Existing contribution guidance
says to edit Sass sources in `style/` and regenerate CSS instead of hand-editing
`style/main.css` alone.

## Test boundary

```mermaid
flowchart TB
  Tests["test/run-tests.js"]
  VM["Node vm context"]
  Model["Tile and Grid"]
  Game["GameManager"]
  Fakes["Fake input, actuator, storage"]
  NotCovered["Manual browser checks for DOM, CSS, input, touch, localStorage"]

  Tests --> VM
  VM --> Model
  VM --> Game
  Tests --> Fakes
  Fakes --> Game
  Tests -. does not cover .-> NotCovered
```

The baseline tests intentionally avoid dependencies. They verify existing core
behavior without a browser: tile serialization, grid operations, restored grid
state, start tiles, target storage, target-specific winning, merging and score
updates, and no-op moves.
