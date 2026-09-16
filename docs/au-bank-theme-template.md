# AU Bank theme template

Use this reference when extending the AU Bank-inspired visual system in
`style/main.scss`. It is a style guide for this branch, not a gameplay design.

## Goal

Keep the original 2048 layout and mechanics, but make the surface feel like a
polished AU Bank-themed workshop build. The design uses a clean banking feel:
strong orange, deep purple, white space, rising-sun arcs, progress bands, and
crisp account-card-like panels.

## Source files

- Edit `style/main.scss` first.
- Regenerate `style/main.css` after Sass changes because `index.html` loads the
  generated CSS directly.
- Do not change `js/` files for theme-only work.

## Palette

The active Sass tokens are:

```scss
$au-white: #ffffff;
$au-warm-white: #fff8f2;
$au-soft-peach: #fff0e6;
$au-orange: #c84418;
$au-orange-strong: #b93812;
$au-orange-light: #f47b20;
$au-gold: #ffb347;
$au-purple: #42265e;
$au-purple-deep: #2b1743;
$au-purple-soft: #6e4a8f;
$au-ink: #281832;
```

Orange is the primary action and brand cue. Purple anchors the board, controls,
and high-value tiles. White and warm white keep the interface readable.

## Tile colours

Tile values keep the same game semantics. The colours only change visual
treatment:

```scss
$au-tile-colors: (
  2:    ($au-orange-strong, $au-white),
  4:    ($au-soft-peach, $au-ink),
  8:    (#ffd8bf, $au-ink),
  16:   (#f6ae7d, $au-ink),
  32:   ($au-orange-light, $au-ink),
  64:   ($au-orange, $au-white),
  128:  ($au-purple-soft, $au-white),
  256:  ($au-purple, $au-white),
  512:  ($au-purple-deep, $au-white),
  1024: (#5d2e7c, $au-white),
  2048: ($au-gold, $au-ink)
);
```

The `2` tile must remain strong AU Bank orange with a high-contrast white
number. Higher values move from orange into purple and gold so the board still
has a clear sense of progression.

## Decorative system

Use CSS-only decoration:

- page background: warm white with subtle orange dots, diagonal progress bands,
  and a soft rising-sun glow
- desktop side panels: abstract circular sun rings and progress bands
- heading and container accents: thin orange/purple brand stripes
- board: deep purple banking panel with orange left rail and rising-sun arcs
- grid cells: quiet translucent white surfaces
- controls and score panels: compact purple panels with orange action rails

Decorations must never cover tiles. The board is an isolated stacking context:

```text
game-container pseudo-elements   z-index: 0
grid-container                   z-index: 10
tile-container and .tile         z-index: 100
.tile-inner                      z-index: 101
.game-message                    z-index: 1000
```

## Narrow screens

At the mobile breakpoint:

- the decorative side panels are hidden
- the container remains `280px`
- grid spacing remains `10px`
- tile dimensions and line-height remain about `58px`
- target controls stack within the existing header layout

Keep hero-scale decoration out of mobile play space. The game should still read
as the same compact 2048 board.

## Verification

For theme changes, run:

```sh
npx sass --no-source-map style/main.scss /tmp/2048-main.css
node test/run-tests.js
git diff --check
```

Then regenerate committed CSS:

```sh
npx sass --no-source-map style/main.scss style/main.css
```

Browser-check the default `2048` target, target selector, orange `2` tile,
tile visibility above decoration, and the narrow layout.
