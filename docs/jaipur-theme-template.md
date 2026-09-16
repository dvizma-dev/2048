# Jaipur theme template

Use this template to understand or extend the Jaipur-inspired visual theme in
this branch. The theme is implemented in `style/main.scss` and mirrored in the
browser-loaded `style/main.css`.

## Theme goal

Create a warm Pink City version of the game that still feels quick to scan and
easy to play. The board should be unmistakably Jaipur through sandstone
surfaces, cream paper-like backgrounds, maroon and indigo accents,
jharokha-style side panels, cusped arch shapes, jaali-inspired texture,
block-print patterning, and small blue-pottery details.

Keep the original gameplay untouched: same board size, movement, scoring,
target selector behavior, persistence, and win/loss flow. The theme changes
visual treatment only.

## Palette

Use these as reusable Sass tokens when implementing the theme:

```scss
$jaipur-cream: #fbf3df;
$jaipur-cream-deep: #f3e3c6;
$jaipur-sandstone: #d9a36f;
$jaipur-sandstone-deep: #b97955;
$jaipur-pink: #d97882;
$jaipur-pink-deep: #b84e63;
$jaipur-maroon: #6f2435;
$jaipur-indigo: #263b73;
$jaipur-blue-pottery: #1f8fb5;
$jaipur-blue-pottery-deep: #0f5f83;
$jaipur-saffron: #e7a928;
$jaipur-henna: #8c4a2f;
$jaipur-ink: #3f2a28;
$jaipur-white: #fffaf0;
```

Recommended mapping to existing variables:

```scss
$text-color: $jaipur-ink;
$bright-text-color: $jaipur-white;
$tile-color: $jaipur-cream-deep;
$tile-gold-color: $jaipur-saffron;
$tile-gold-glow-color: lighten($jaipur-saffron, 15%);
$game-container-background: $jaipur-sandstone-deep;
```

## Typography

Keep the existing Clear Sans stack for gameplay readability:

```scss
font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
```

Use type styling, not font swaps, to carry the theme:

- Keep the title bold and large.
- Use uppercase labels for `Score`, `Best`, and `Target`.
- Keep tile numerals heavy and centered.
- Avoid decorative fonts inside tiles, buttons, score panels, and messages.

## Tile colours

Define explicit colours for every current tile value so the palette is stable
and easy to review. Keep text contrast high, especially from `128` upward.

```scss
$jaipur-tile-colors: (
  2:    ($jaipur-blue-pottery-deep, $jaipur-white),
  4:    (#f1d6b5, $jaipur-ink),
  8:    (#e9b27e, $jaipur-ink),
  16:   (#df8f72, $jaipur-ink),
  32:   (#ba4c61, $jaipur-white),
  64:   (#b84e63, $jaipur-white),
  128:  (#8c4a2f, $jaipur-white),
  256:  (#6f2435, $jaipur-white),
  512:  (#263b73, $jaipur-white),
  1024: (#0f5f83, $jaipur-white),
  2048: (#e7a928, $jaipur-ink)
);
```

Treatment notes:

- `2` should use deep blue pottery with warm cream text when this branch's
  applied theme needs the extra blue-pottery accent visible from the start.
- `4` should read like pale sandstone.
- `8` through `64` should move through warm sandstone, pink, and maroon.
- `128` and `256` can use henna and maroon to mark higher stakes.
- `512` and `1024` introduce indigo and blue pottery.
- `2048` should feel celebratory with saffron or gold, but keep the number
  readable.
- `.tile-super` can use deep indigo or maroon with cream text.

## Surfaces

Use a cream page background and a warm sandstone board:

```scss
html, body {
  background: $jaipur-cream;
  color: $jaipur-ink;
}

.game-container {
  background: $jaipur-sandstone-deep;
}

.grid-cell {
  background: rgba($jaipur-cream, .35);
}
```

Score panels should feel like small sandstone plaques:

```scss
.score-container,
.best-container {
  background: $jaipur-maroon;
  color: $jaipur-white;
}

.score-container:after,
.best-container:after {
  color: $jaipur-cream-deep;
}
```

## Controls

Buttons and selectors should share one control treatment:

```scss
@mixin jaipur-control {
  background: $jaipur-maroon;
  color: $jaipur-white;
  border: 1px solid rgba($jaipur-white, .28);
  border-radius: 3px;
}

.restart-button,
.game-message a,
.target-selector {
  @include jaipur-control;
}
```

Use indigo for focus and hover states:

```scss
.restart-button:hover,
.game-message a:hover,
.target-selector:focus {
  background: $jaipur-indigo;
}
```

Do not add hover-only information. The controls must remain clear on touch
screens.

## Jaipur arches

Use arches as shape language, not as heavy illustration. Good places:

- desktop `body:before` and `body:after` side panels, where they can suggest
  Hawa Mahal or jharokha windows without touching the playable board
- `.container:before`, as a narrow arch frieze above the game
- the top edge of `.game-container`
- the `.game-message` overlay
- a subtle frame around score panels

Implementation sketch for board-level arches:

```scss
.game-container:before {
  content: "";
  position: absolute;
  top: 8px;
  right: 8px;
  left: 8px;
  height: 44px;
  border: 2px solid rgba($jaipur-white, .38);
  border-bottom: 0;
  border-radius: 28px 28px 0 0;
  pointer-events: none;
  z-index: 0;
}
```

Keep arches behind or outside tile motion paths. They must not cover tiles,
score additions, buttons, or messages.

Disable the large desktop side panels inside the mobile media query so narrow
screens keep the original compact layout and do not introduce horizontal
overflow.

## Block-print patterns

Use block-print patterns as very low-contrast texture. Avoid busy backgrounds
behind tile numerals.

Recommended treatment:

```scss
body {
  background-color: $jaipur-cream;
  background-image:
    radial-gradient(circle at 1px 1px, rgba($jaipur-maroon, .08) 1px, transparent 0);
  background-size: 18px 18px;
}
```

For the board, use an even quieter pattern:

```scss
.game-container {
  background-color: $jaipur-sandstone-deep;
  background-image:
    linear-gradient(45deg, rgba($jaipur-cream, .06) 25%, transparent 25%),
    linear-gradient(-45deg, rgba($jaipur-cream, .06) 25%, transparent 25%);
  background-size: 20px 20px;
}
```

Do not place pattern layers on `.tile-inner` unless they are nearly invisible.
Tile values are the primary information.

The final intricate theme uses several quiet layers at once: page block-print
dots, board jaali texture, scalloped board arches, pale grid-cell arch marks,
and low-opacity tile highlights. Keep each layer subtle enough that the tile
number remains the visual foreground.

## Blue-pottery details

Use blue pottery as a small accent, not the dominant colour:

- focus rings
- thin borders
- score-addition text
- tiny decorative dots in the message overlay
- optional accent on the selected target control

Example:

```scss
.target-selector:focus {
  outline: 2px solid $jaipur-blue-pottery;
  outline-offset: 2px;
}

.score-addition {
  color: $jaipur-blue-pottery-deep;
}
```

## Game messages

Win and game-over overlays should keep the existing interaction model:
`.game-won` shows `Keep going`, and `.game-over` shows the retry path.

Recommended colours:

```scss
.game-message {
  background: rgba($jaipur-cream, .76);
  color: $jaipur-maroon;
}

.game-message.game-won {
  background: rgba($jaipur-saffron, .72);
  color: $jaipur-ink;
}

.game-message.game-over {
  background: rgba($jaipur-maroon, .72);
  color: $jaipur-white;
}
```

The message text should remain short. Do not add explanatory copy inside the
overlay.

## Decorative limits

Keep decoration subordinate to the board:

- No decoration may overlap a tile, tile number, score value, target selector,
  or restart control.
- Board decoration must stay in lower stacking layers than `.grid-container`,
  `.tile-container`, `.tile`, and `.tile-inner`.
- Use `isolation: isolate` on `.game-container` when board pseudo-elements and
  gameplay layers share the same stacking context.
- No pattern should reduce tile-number contrast.
- Avoid large illustrations, large ornamental borders, or animated decoration.
- Keep border radii close to the current `3px` to `6px` system unless using an
  arch shape intentionally.
- Use one or two decorative ideas at a time: arches plus subtle block print, or
  block print plus blue-pottery focus details.

Current stacking reference:

```scss
.game-container {
  isolation: isolate;
  z-index: 0;
}

.game-container:before,
.game-container:after {
  z-index: 0;
}

.grid-container {
  z-index: 10;
}

.tile,
.tile-container {
  z-index: 100;
}

.tile-inner {
  position: relative;
  z-index: 101;
}

.game-message {
  z-index: 1000;
}
```

## Contrast checks

Before accepting an implementation:

- Tile numerals must be readable at desktop tile size and mobile tile size.
- `Score`, `Best`, and `Target` labels must be readable on their panels.
- Button and selector text must pass visual contrast against maroon and indigo
  backgrounds.
- `2048` on saffron must use dark text, not cream text, unless the saffron is
  darkened enough for contrast.
- Pattern opacity should be reduced if it competes with text at any viewport.

## Narrow-screen checks

Verify the theme at widths at or below the existing `$mobile-threshold` of
`520px`:

- The title, score panels, intro text, target selector, and restart button do
  not overlap.
- The board remains `280px` wide in the generated CSS.
- Mobile tiles remain about `58px` square with `10px` spacing.
- Desktop-only side jharokha panels are hidden.
- Tile numbers `512`, `1024`, and `2048` fit without clipping.
- The target selector is large enough to tap and shows the selected value.
- Win and game-over overlays keep their text and buttons inside the board.

## Verification checklist

When changing this theme:

1. Edit `style/main.scss` first.
2. Regenerate `style/main.css`.
3. Keep gameplay files in `js/` unchanged unless the requested task is not just
   visual theming.
4. Run `node test/run-tests.js`.
5. Serve the game with `python3 -m http.server 8000`.
6. Manually check desktop and narrow-screen layouts in a browser.
7. Confirm the selector still defaults to `2048` and the `512`, `1024`, and
   `2048` target options remain visible.
