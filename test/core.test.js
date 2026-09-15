const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function loadScripts(files) {
  const context = vm.createContext({});
  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    vm.runInContext(source, context, { filename: file });
  });
  return context;
}

test("Grid starts empty and reports available cells", () => {
  const context = loadScripts(["js/tile.js", "js/grid.js"]);
  const grid = new context.Grid(4);

  assert.equal(grid.availableCells().length, 16);
  assert.equal(grid.cellsAvailable(), true);
});

test("Grid inserts and removes a tile", () => {
  const context = loadScripts(["js/tile.js", "js/grid.js"]);
  const grid = new context.Grid(4);
  const tile = new context.Tile({ x: 1, y: 2 }, 4);

  grid.insertTile(tile);
  assert.equal(grid.cellContent({ x: 1, y: 2 }).value, 4);

  grid.removeTile(tile);
  assert.equal(grid.cellContent({ x: 1, y: 2 }), null);
});

test("Tile serialization preserves position and value", () => {
  const context = loadScripts(["js/tile.js"]);
  const tile = new context.Tile({ x: 2, y: 3 }, 128);

  assert.deepEqual(
    JSON.parse(JSON.stringify(tile.serialize())),
    { position: { x: 2, y: 3 }, value: 128 }
  );
});

