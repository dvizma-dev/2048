# Setup

Use this guide to run the static 2048 app locally and understand which tools are
optional.

## Prerequisites

- A local HTTP server for browser testing. Python's built-in server is enough.
- Node.js if you want to run the baseline tests in `test/run-tests.js`.
- Sass only if you change files in `style/`. The historical project used the
  Ruby `sass` command; this branch has also been checked with Dart Sass through
  `npx`.

## Run the game

1. Start a static server from the repository root:

   ```sh
   python3 -m http.server 8000
   ```

2. Open `http://localhost:8000` in a browser.

The app can also be opened directly from `index.html` in many browsers, but a
local server is closer to how it is served publicly.

## Change styles

The source styles are in `style/main.scss`, `style/helpers.scss`, and
`style/fonts/clear-sans.css`. The browser loads `style/main.css`.

When changing styles, edit the Sass files first and regenerate `style/main.css`.
The existing contributing guide recommends:

```sh
sass --unix-newlines --watch style/main.scss
```

For a one-time parse check that does not overwrite checked-in CSS, run:

```sh
npx sass --no-source-map style/main.scss /tmp/2048-main.css
```

Dart Sass currently reports deprecation warnings for legacy `@import`, slash
division, global built-in functions such as `ceil` and `floor`, and
`lighten()`. Those warnings are known and do not currently fail compilation.

## Useful files

- `docs/visual-guide.md` shows the project structure and runtime flow with
  diagrams.
- `docs/jaipur-theme-template.md` defines a reusable visual theme template for
  the applied Jaipur-inspired theme.
- `docs/final-review.md` records the latest final verification, security
  review, and PR-style review results.
- `index.html` defines the board markup and script load order.
- `js/application.js` starts a 4x4 game.
- `js/game_manager.js` owns movement, scoring, win, loss, and persistence
  decisions.
- `js/grid.js` and `js/tile.js` model the board and tiles.
- `js/html_actuator.js` renders tiles, scores, and messages.
- `js/keyboard_input_manager.js` maps keyboard, button, and swipe input to game
  events.
- `js/local_storage_manager.js` stores best score and resumable game state.
