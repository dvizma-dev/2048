#!/usr/bin/env node

"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.resolve(__dirname, "..");
var context = {
  console: console,
  Math: Object.create(Math),
  window: {}
};

context.global = context;
vm.createContext(context);

function loadScript(relativePath) {
  var absolutePath = path.join(root, relativePath);
  var source = fs.readFileSync(absolutePath, "utf8");
  vm.runInContext(source, context, { filename: relativePath });
}

loadScript("js/tile.js");
loadScript("js/grid.js");
loadScript("js/local_storage_manager.js");
loadScript("js/keyboard_input_manager.js");
loadScript("js/game_manager.js");

function test(name, fn) {
  try {
    fn();
    console.log("ok - " + name);
  } catch (error) {
    console.error("not ok - " + name);
    throw error;
  }
}

function FakeInputManager() {
  this.events = {};
  this.winningTarget = null;
}

FakeInputManager.prototype.on = function (event, callback) {
  this.events[event] = callback;
};

FakeInputManager.prototype.setWinningTarget = function (target) {
  this.winningTarget = target;
};

function FakeActuator() {
  this.calls = [];
}

FakeActuator.prototype.actuate = function (grid, metadata) {
  this.calls.push({
    grid: grid.serialize(),
    metadata: metadata
  });
};

FakeActuator.prototype.continueGame = function () {};

function FakeStorageManager() {
  this.bestScore = 0;
  this.gameState = null;
  this.winningTarget = 2048;
}

FakeStorageManager.prototype.getBestScore = function () {
  return this.bestScore;
};

FakeStorageManager.prototype.setBestScore = function (score) {
  this.bestScore = score;
};

FakeStorageManager.prototype.getGameState = function () {
  return this.gameState;
};

FakeStorageManager.prototype.setGameState = function (state) {
  this.gameState = state;
};

FakeStorageManager.prototype.clearGameState = function () {
  this.gameState = null;
};

FakeStorageManager.prototype.getWinningTarget = function () {
  return this.winningTarget;
};

FakeStorageManager.prototype.setWinningTarget = function (target) {
  target = parseInt(target, 10);
  this.winningTarget = [512, 1024, 2048].indexOf(target) !== -1 ?
                       target : 2048;
  return this.winningTarget;
};

function withRandom(values, fn) {
  var index = 0;
  var originalRandom = context.Math.random;

  context.Math.random = function () {
    if (index >= values.length) {
      return 0;
    }
    return values[index++];
  };

  try {
    fn();
  } finally {
    context.Math.random = originalRandom;
  }
}

function makeManagerWithoutStartTiles() {
  var originalAddStartTiles = context.GameManager.prototype.addStartTiles;
  context.GameManager.prototype.addStartTiles = function () {};

  try {
    return new context.GameManager(
      4,
      FakeInputManager,
      FakeActuator,
      FakeStorageManager
    );
  } finally {
    context.GameManager.prototype.addStartTiles = originalAddStartTiles;
  }
}

function valuesByCell(grid) {
  return grid.cells.map(function (column) {
    return column.map(function (tile) {
      return tile ? tile.value : null;
    });
  });
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test("Tile updates position and serializes value", function () {
  var tile = new context.Tile({ x: 1, y: 2 }, 4);

  tile.savePosition();
  tile.updatePosition({ x: 3, y: 0 });

  assert.deepStrictEqual(plain(tile.previousPosition), { x: 1, y: 2 });
  assert.deepStrictEqual(plain(tile.serialize()), {
    position: { x: 3, y: 0 },
    value: 4
  });
});

test("Grid tracks cells, bounds, and available spaces", function () {
  var grid = new context.Grid(2);
  var tile = new context.Tile({ x: 0, y: 1 }, 2);

  assert.strictEqual(grid.cellsAvailable(), true);
  assert.strictEqual(grid.withinBounds({ x: 1, y: 1 }), true);
  assert.strictEqual(grid.withinBounds({ x: 2, y: 1 }), false);

  grid.insertTile(tile);

  assert.strictEqual(grid.cellContent({ x: 0, y: 1 }), tile);
  assert.strictEqual(grid.cellAvailable({ x: 0, y: 1 }), false);
  assert.deepStrictEqual(plain(grid.availableCells()), [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 }
  ]);

  grid.removeTile(tile);

  assert.strictEqual(grid.cellContent({ x: 0, y: 1 }), null);
});

test("Grid restores serialized tile state", function () {
  var restored = new context.Grid(2, [
    [null, { position: { x: 0, y: 1 }, value: 8 }],
    [{ position: { x: 1, y: 0 }, value: 4 }, null]
  ]);

  assert.strictEqual(restored.cellContent({ x: 0, y: 1 }).value, 8);
  assert.strictEqual(restored.cellContent({ x: 1, y: 0 }).value, 4);
  assert.strictEqual(restored.cellContent({ x: 0, y: 0 }), null);
});

test("GameManager adds two start tiles", function () {
  withRandom([0, 0, 0, 0.1], function () {
    var manager = new context.GameManager(
      4,
      FakeInputManager,
      FakeActuator,
      FakeStorageManager
    );

    var tiles = manager.grid.availableCells().length;
    assert.strictEqual(tiles, 14);
  });
});

test("GameManager defaults to the 2048 winning target", function () {
  var manager = makeManagerWithoutStartTiles();

  assert.strictEqual(manager.winningTarget, 2048);
});

test("LocalStorageManager stores valid targets and defaults invalid targets", function () {
  context.window.fakeStorage.clear();

  var storage = new context.LocalStorageManager();

  assert.strictEqual(storage.getWinningTarget(), 2048);
  assert.strictEqual(storage.setWinningTarget(512), 512);
  assert.strictEqual(storage.getWinningTarget(), 512);
  assert.strictEqual(storage.setWinningTarget(999), 2048);
  assert.strictEqual(storage.getWinningTarget(), 2048);
});

test("KeyboardInputManager emits targetChange from the selector", function () {
  var listener;
  var emitted;

  context.document = {
    querySelector: function (selector) {
      assert.strictEqual(selector, ".target-selector");
      return {
        addEventListener: function (event, callback) {
          assert.strictEqual(event, "change");
          listener = callback;
        }
      };
    }
  };

  context.KeyboardInputManager.prototype.bindTargetSelector.call({
    emit: function (event, data) {
      emitted = { event: event, data: data };
    }
  }, ".target-selector");

  listener({ target: { value: "1024" } });

  assert.deepStrictEqual(emitted, {
    event: "targetChange",
    data: 1024
  });
});

test("GameManager merges matching tiles and updates score", function () {
  var manager = makeManagerWithoutStartTiles();

  manager.grid.insertTile(new context.Tile({ x: 0, y: 0 }, 2));
  manager.grid.insertTile(new context.Tile({ x: 1, y: 0 }, 2));

  withRandom([0, 0], function () {
    manager.move(3);
  });

  assert.strictEqual(manager.score, 4);
  assert.deepStrictEqual(plain(valuesByCell(manager.grid)), [
    [4, 2, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
  ]);
});

test("GameManager wins at the configured 512 target", function () {
  var manager = makeManagerWithoutStartTiles();

  manager.winningTarget = 512;
  manager.grid.insertTile(new context.Tile({ x: 0, y: 0 }, 256));
  manager.grid.insertTile(new context.Tile({ x: 1, y: 0 }, 256));

  withRandom([0, 0], function () {
    manager.move(3);
  });

  assert.strictEqual(manager.score, 512);
  assert.strictEqual(manager.won, true);
});

test("GameManager wins at the configured 1024 target", function () {
  var manager = makeManagerWithoutStartTiles();

  manager.winningTarget = 1024;
  manager.grid.insertTile(new context.Tile({ x: 0, y: 0 }, 512));
  manager.grid.insertTile(new context.Tile({ x: 1, y: 0 }, 512));

  withRandom([0, 0], function () {
    manager.move(3);
  });

  assert.strictEqual(manager.score, 1024);
  assert.strictEqual(manager.won, true);
});

test("GameManager does not win at 512 when target is 2048", function () {
  var manager = makeManagerWithoutStartTiles();

  manager.grid.insertTile(new context.Tile({ x: 0, y: 0 }, 256));
  manager.grid.insertTile(new context.Tile({ x: 1, y: 0 }, 256));

  withRandom([0, 0], function () {
    manager.move(3);
  });

  assert.strictEqual(manager.score, 512);
  assert.strictEqual(manager.won, false);
});

test("GameManager serializes and restores the winning target", function () {
  var previousState = {
    grid: new context.Grid(4).serialize(),
    score: 64,
    over: false,
    won: false,
    keepPlaying: false,
    winningTarget: 1024
  };

  function RestoringStorageManager() {
    FakeStorageManager.call(this);
    this.gameState = previousState;
  }

  RestoringStorageManager.prototype = Object.create(
    FakeStorageManager.prototype
  );
  RestoringStorageManager.prototype.constructor = RestoringStorageManager;

  var manager = new context.GameManager(
    4,
    FakeInputManager,
    FakeActuator,
    RestoringStorageManager
  );

  assert.strictEqual(manager.winningTarget, 1024);
  assert.strictEqual(manager.serialize().winningTarget, 1024);
  assert.strictEqual(manager.inputManager.winningTarget, 1024);
});

test("GameManager defaults invalid restored winning targets", function () {
  var previousState = {
    grid: new context.Grid(4).serialize(),
    score: 0,
    over: false,
    won: false,
    keepPlaying: false,
    winningTarget: 999
  };

  function RestoringStorageManager() {
    FakeStorageManager.call(this);
    this.gameState = previousState;
  }

  RestoringStorageManager.prototype = Object.create(
    FakeStorageManager.prototype
  );
  RestoringStorageManager.prototype.constructor = RestoringStorageManager;

  var manager = new context.GameManager(
    4,
    FakeInputManager,
    FakeActuator,
    RestoringStorageManager
  );

  assert.strictEqual(manager.winningTarget, 2048);
  assert.strictEqual(manager.serialize().winningTarget, 2048);
  assert.strictEqual(manager.inputManager.winningTarget, 2048);
});

test("GameManager does not add a tile when a move changes nothing", function () {
  var manager = makeManagerWithoutStartTiles();

  manager.grid.insertTile(new context.Tile({ x: 0, y: 0 }, 2));
  manager.move(3);

  assert.deepStrictEqual(plain(valuesByCell(manager.grid)), [
    [2, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
  ]);
});
