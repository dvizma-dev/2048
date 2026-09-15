const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

test("index references files that exist", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) => !reference.startsWith("http"));

  references.forEach((reference) => {
    assert.equal(
      fs.existsSync(path.join(root, reference)),
      true,
      `${reference} should exist`
    );
  });
});

test("page keeps 2048 as the default goal", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

  assert.match(html, /<option value="2048" selected>2048<\/option>/);
  assert.match(html, /winning-target-label">2048<\/span>/);
});

test("page offers all three winning targets", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

  assert.match(html, /<option value="512">512<\/option>/);
  assert.match(html, /<option value="1024">1024<\/option>/);
  assert.match(html, /<option value="2048" selected>2048<\/option>/);
});

test("Jaipur theme contains the approved palette", () => {
  const css = fs.readFileSync(path.join(root, "style/jaipur.css"), "utf8");

  assert.match(css, /#f7ead7/);
  assert.match(css, /\.tile\.tile-512 \.tile-inner/);
  assert.match(css, /\.tile\.tile-1024 \.tile-inner/);
  assert.match(css, /\.tile\.tile-2048 \.tile-inner/);
});
