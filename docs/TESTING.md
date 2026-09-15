# Testing

## Automated

Run:

```sh
npm test
```

The test suite uses Node's built-in test runner. It does not install third-party packages.

Baseline recorded on September 15, 2026 before production-code changes: 5 tests passed, 0 failed.

Final automated result after the winning-target and Jaipur-theme changes: 12 tests passed, 0 failed. All JavaScript files also passed `node --check`.

## Manual Browser Check

Run:

```sh
npm run serve
```

Open `http://127.0.0.1:4173` and confirm:

1. The board loads with two tiles.
2. Arrow keys move tiles and update the score after a merge.
3. New Game resets the board.
4. The game remains usable at a narrow browser width.
5. The 512, 1024, and 2048 selections update the visible goal and reset the board.

Final browser result: all three selections updated the goal text correctly, arrow-key moves worked, and the 390-pixel layout had no horizontal overflow.
