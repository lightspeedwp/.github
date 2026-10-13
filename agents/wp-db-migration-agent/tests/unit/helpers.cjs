/**
 * Shared helpers for the sql-tool tests: temporary files and a MySQL string
 * encoder that mirrors how mysqldump escapes binary values.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const FIXTURES = path.join(__dirname, '..', 'fixtures');

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sql-tool-'));
}

/** Write a Buffer or latin1 string to a new temp file and return its path. */
function writeTemp(contents, name = 'dump.sql') {
  const file = path.join(tempDir(), name);
  fs.writeFileSync(file, Buffer.isBuffer(contents) ? contents : Buffer.from(contents, 'latin1'));
  return file;
}

/** Escape bytes the way mysqldump does inside a single-quoted literal. */
function mysqlEscape(bytes) {
  const map = {
    0x00: '\\0',
    0x0a: '\\n',
    0x0d: '\\r',
    0x1a: '\\Z',
    0x5c: '\\\\',
    0x27: "\\'",
    0x22: '\\"',
  };
  return [...bytes].map((b) => map[b] ?? String.fromCharCode(b)).join('');
}

module.exports = { FIXTURES, tempDir, writeTemp, mysqlEscape };
