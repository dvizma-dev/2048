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
- The intricate Jaipur-inspired theme is applied through `style/main.scss` and
  `style/main.css`.
- The theme uses CSS-only jharokha side panels, arch friezes, scalloped board
  details, jaali and block-print texture, and blue-pottery accents.
- Board decoration is isolated below gameplay layers so tiles remain visible.
- The `2` tile uses deep blue-pottery blue, `#0f5f83`, with warm cream text,
  `#fffaf0`.

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

## Browser checks performed

The final browser and static-serving checks confirmed:

- `/` responds with `HTTP/1.0 200 OK`.
- `/style/main.css` responds with `HTTP/1.0 200 OK`.
- The rendered game was visually checked after the Jaipur theme update.
- The blue-pottery `2` tile was visually checked in the finished game.
- The `2` tile contrast was checked as `6.76:1` for `#0f5f83` on `#fffaf0`.
- The stacking regression where decorative board layers covered tiles was fixed
  in Sass and regenerated CSS.
- Generated CSS was checked for the expected stacking order: board
  pseudo-elements at `z-index: 0`, grid at `10`, tiles at `100`, `.tile-inner`
  at `101`, and messages at `1000`.
- Generated CSS was checked to preserve the blue `2` tile and narrow-screen
  values: `#0f5f83`, `280px` board, and `58px` tile line-height.

Headless Chrome automation was attempted during review but exited with code
`134` in this local environment. A temporary `npx playwright --version` attempt
did not complete and was stopped. Those attempts were not counted as passing
browser automation checks.

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
- The Jaipur theme template still described the old cream `2` tile. It now
  matches the applied blue-pottery `2` tile.

## Theme stacking fix

Later browser validation found that the new decorative board layer could
visually cover tiles even though tile text still existed in the DOM. The fix
keeps the intricate Jaipur decoration but makes the board an isolated stacking
context:

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
