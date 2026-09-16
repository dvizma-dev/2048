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
- Added `docs/jaipur-theme-template.md` as a reusable design reference only;
  no game code or styles were changed for the theme.
- Applied the Jaipur-inspired theme in `style/main.scss` and mirrored the
  generated CSS changes in `style/main.css` while keeping board/layout
  dimensions unchanged.
- Adjusted the applied tile palette for contrast: `16` uses dark text, `32`
  uses deeper pink, and `1024` uses deep blue-pottery.
- Changed only the `2` tile treatment to deep blue-pottery blue with warm cream
  numerals.
