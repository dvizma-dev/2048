# Final review notes

This note records the latest verified state of the local branch. It is a short
review log, not a replacement for the setup, architecture, testing, or theme
docs.

## Implementation summary

- The winning target selector offers `512`, `1024`, and `2048`.
- `2048` remains the default winning target.
- Changing the target stores the selected value and starts a fresh game.
- Saved games include `winningTarget`; invalid restored targets fall back to
  `2048`.
- The AU Bank-inspired theme is applied through `style/main.scss` and
  `style/main.css`.
- The theme uses CSS-only sun-ring side panels, orange and purple progress
  bands, a deep purple board surface, orange action rails, and rising-sun board
  accents.
- Board decoration is isolated below gameplay layers so tiles remain visible.
- The `2` tile uses strong AU Bank orange, `#b93812`, with high-contrast white
  text, `#ffffff`.

## Exact verification commands

Run these from the repository root:

```sh
node test/run-tests.js
git diff --check
npx sass --no-source-map style/main.scss /tmp/2048-main.css
python3 -m http.server 8000
curl -I http://127.0.0.1:8000/
curl -I http://127.0.0.1:8000/style/main.css
```

Stop the local server with `Ctrl-C` when the HTTP checks are done.

## Browser, static, and CSS checks performed

The final demo Chrome profile validation confirmed:

- The `1024` and `2048` targets selected correctly.
- Moves updated the score.
- Orange `2` tiles were visible.
- The `2048` target persisted after reload.

The final static-serving and generated-CSS checks confirmed:

- `/` responds with `HTTP/1.0 200 OK`.
- `/style/main.css` responds with `HTTP/1.0 200 OK`.
- The `2` tile contrast was checked as `5.77:1` for `#b93812` on `#ffffff`.
- The stacking regression where decorative board layers covered tiles was fixed
  in Sass and regenerated CSS.
- Generated CSS was checked for the expected stacking order: board
  pseudo-elements at `z-index: 0`, grid at `10`, tiles at `100`, `.tile-inner`
  at `101`, and messages at `1000`.
- Generated CSS was checked to preserve the orange `2` tile and narrow-screen
  values: `#b93812`, `280px` board, and `58px` tile line-height.

The repository-local Playwright screenshot client was attempted after the AU
Bank theme update, but it could not run because the `playwright` package is not
installed in this environment. That attempt is not counted as passing browser
automation; the Chrome-profile validation above was manual demo validation.

## Codex Security result

Codex Security reviewed the complete local diff with scan
`1f410b5f-18fa-4ee0-81d0-63c5dbcccbc8`.

Result: no confirmed concrete, exploitable security risks introduced by the
branch.

Evidence from that review:

- Target options are fixed literals in `index.html`.
- Selector input is parsed as an integer in `js/keyboard_input_manager.js`.
- Target values are allow-listed in `js/local_storage_manager.js`.
- The winning target is used for numeric comparison in `js/game_manager.js`.
- Rendering uses `textContent` for tile values, scores, and messages.
- New docs and tests do not add remote execution or dependency install paths.

## PR-style review fixes

The PR-style review found and fixed three in-scope issues:

- Invalid restored winning targets could make a resumed game unwinnable. The
  restore path now normalizes saved targets through the existing allow-list, and
  `test/run-tests.js` covers invalid restored targets.
- The Sass game-field mixin could regenerate desktop board dimensions inside
  the mobile media block. The mixin now accepts explicit field parameters, and
  the mobile include passes the `280px` board, `10px` spacing, and `58px` tile
  values.
- The theme template is now `docs/au-bank-theme-template.md` and matches the
  applied AU Bank orange `2` tile.

## Theme stacking fix

Later browser validation found that a decorative board layer could visually
cover tiles even though tile text still existed in the DOM. The fix is retained
in the AU Bank theme by making the board an isolated stacking context:

- `.game-container` uses `isolation: isolate` and local `z-index: 0`.
- `.game-container:before` and `.game-container:after` remain decorative at
  `z-index: 0`.
- `.grid-container` is above decoration at `z-index: 10`.
- `.tile-container` and `.tile` are above the grid at `z-index: 100`.
- `.tile-inner` is positioned at `z-index: 101` so tile numbers stay above tile
  and board decoration.
- `.game-message` remains the top layer at `z-index: 1000`.

## Known Sass warnings

Dart Sass currently compiles the stylesheet but reports deprecation warnings for:

- legacy `@import`
- slash division
- global built-in functions such as `ceil` and `floor`
- `lighten()`

These warnings are known. They do not currently block `style/main.scss` from
compiling.
