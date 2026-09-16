Original prompt: Implement the approved plan.

## Progress

- Started implementation for configurable winning targets: 512, 1024, and 2048.
- Kept 2048 as the default and planned storage fallback.
- Added selector markup, game-manager target handling, local-storage target
  helpers, Sass styles, and automated target tests.
- Fixed Sass keyframe interpolation for modern Sass output while preserving the
  existing mixin intent.
- Restored mobile generated CSS dimensions after the one-time Sass compiler
  output used desktop dimensions inside the mobile media block.
- Updated architecture, visual guide, testing, safe-change, and Codex guide
  docs for the new target selector and storage behavior.
- Added a selector event-binding test so the target dropdown path is covered
  without browser dependencies.
- Earlier regional theme work was superseded by the AU Bank theme request; the
  old theme guide was removed from active docs.
- Fixed the decorative board stacking regression by isolating the board
  stacking context and keeping grid, tiles, tile text, and game messages above
  pseudo-element decoration.
- Replaced the theme with an AU Bank-inspired visual system in
  `style/main.scss`: orange and purple palette, rising-sun accents, progress
  bands, banking-style score panels, and a strong orange `2` tile with white
  numerals.
- Replaced the old regional theme document with
  `docs/au-bank-theme-template.md` and updated active project docs so the AU
  Bank visual system is the documented final theme.
