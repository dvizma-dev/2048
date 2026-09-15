const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function loadStorage() {
  const context = vm.createContext({
    window: {
      localStorage: {
        data: {},
        getItem(key) { return this.data[key]; },
        setItem(key, value) { this.data[key] = String(value); },
        removeItem(key) { delete this.data[key]; }
      }
    }
  });
  const source = fs.readFileSync(path.join(root, "js/local_storage_manager.js"), "utf8");
  vm.runInContext(source, context, { filename: "js/local_storage_manager.js" });
  return context;
}

function loadGameManager() {
  const context = vm.createContext({});
  const source = fs.readFileSync(path.join(root, "js/game_manager.js"), "utf8");
  vm.runInContext(source, context, { filename: "js/game_manager.js" });
  return context.GameManager;
}

test("winning target defaults to 2048", () => {
  const context = loadStorage();
  const storage = new context.LocalStorageManager();

  assert.equal(storage.getWinningTarget(), 2048);
});

test("winning target accepts 512, 1024, and 2048", () => {
  const context = loadStorage();
  const storage = new context.LocalStorageManager();

  [512, 1024, 2048].forEach((target) => {
    assert.equal(storage.setWinningTarget(target), true);
    assert.equal(storage.getWinningTarget(), target);
  });
});

test("winning target rejects unsupported values", () => {
  const context = loadStorage();
  const storage = new context.LocalStorageManager();

  assert.equal(storage.setWinningTarget(4096), false);
  assert.equal(storage.getWinningTarget(), 2048);
});

test("changing the winning target stores it and restarts the game", () => {
  const GameManager = loadGameManager();
  let storedTarget;
  let restartCount = 0;
  const manager = Object.create(GameManager.prototype);
  manager.winningTarget = 2048;
  manager.storageManager = {
    setWinningTarget(target) {
      storedTarget = target;
      return true;
    }
  };
  manager.restart = function () { restartCount += 1; };

  assert.equal(manager.setWinningTarget(1024), true);
  assert.equal(manager.winningTarget, 1024);
  assert.equal(storedTarget, 1024);
  assert.equal(restartCount, 1);
});

test("the win check uses the selected target", () => {
  const source = fs.readFileSync(path.join(root, "js/game_manager.js"), "utf8");
  assert.match(source, /merged\.value === self\.winningTarget/);
});
