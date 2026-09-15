# Jaipur Theme

The theme keeps the original 2048 layout and uses Jaipur-inspired colour and shape cues.
It is implemented as the standalone `style/jaipur.css` override, which can be replaced or removed without editing the original game stylesheet.

## Palette

- Page cream: `#f7ead7`
- Sandstone board: `#d58a72`
- Maroon controls: `#7b2d3e`
- Deep text: `#5b2333`
- Indigo accent: `#315b7d`
- Blue pottery accent: `#1f6f78`
- Gold winning tile: `#c28b2c`
- Light text: `#fff7ed`

## Treatment

- A small dot pattern references block-print texture without competing with the board.
- Arched top corners on cells and tiles reference Jaipur architecture.
- Maroon score panels and controls provide a strong, consistent action colour.
- Indigo and blue-pottery tones distinguish higher tiles.
- The title adds a small `JAIPUR` edition mark without changing the 2048 name.

## Readability Rules

- Use deep maroon text on the 2 and 4 tiles.
- Use cream text from the 8 tile onward.
- Keep the selector label and control visible at 390 pixels wide.
- Do not change tile size, board geometry, or game controls for decoration.
