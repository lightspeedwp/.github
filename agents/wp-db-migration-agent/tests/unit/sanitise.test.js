/**
 * Unit tests for `sql-tool sanitise` (spec 020, User Story 1, FR-010 to FR-015).
 *
 * The dump is built in code so it can hold exact bytes, including the escape
 * sequences mysqldump writes and a byte that is not valid UTF-8.
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const { sanitise, run } = require('../../lib/sql-tool.cjs');
const { writeTemp, mysqlEscape } = require('./helpers.cjs');

/** 16 bytes covering every escape mysqldump emits, plus high bytes. */
const HASH_A = Buffer.from([
  0x00, 0x0a, 0x0d, 0x1a, 0x5c, 0x27, 0x22, 0xff, 0x80, 0x41, 0x2c, 0x29, 0x28, 0x3b, 0x20, 0x09,
]);
/** 16 bytes written with the \b and \t escapes mysqldump does not emit but MySQL accepts. */
const HASH_B_LITERAL = '\\b\\tABCDEFGHIJKLMN';
const HASH_B = Buffer.from([0x08, 0x09, ...Buffer.from('ABCDEFGHIJKLMN')]);

function buildDump({ shortHash = false } = {}) {
  const hashA = shortHash ? HASH_A.subarray(0, 15) : HASH_A;
  return [
    '-- MySQL dump 10.13',
    '/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;',
    'SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;',
    'SET @@SESSION.SQL_LOG_BIN= 0;',
    '',
    '--',
    '-- GTID state at the beginning of the backup ',
    '--',
    '',
    "SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '5c7579fe-c151-11f1-b66d-d92c500b4746:1-6370';",
    '',
    'CREATE TABLE `wp_pmxi_hash` (',
    '  `hash` binary(16) NOT NULL,',
    '  `post_id` bigint unsigned NOT NULL,',
    '  PRIMARY KEY (`hash`)',
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
    'LOCK TABLES `wp_pmxi_hash` WRITE;',
    `INSERT INTO \`wp_pmxi_hash\` VALUES (_binary '${mysqlEscape(hashA)}',273),(_binary '${HASH_B_LITERAL}',237);`,
    'UNLOCK TABLES;',
    'CREATE TABLE `wp_posts` (',
    '  `ID` bigint unsigned NOT NULL,',
    '  `post_content` longtext',
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
    `INSERT INTO \`wp_posts\` VALUES (1,'caf\xe9 and _binary \\'not a literal\\' (text)');`,
    'SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;',
    '/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;',
    '',
  ].join('\n');
}

const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

describe('sanitise', () => {
  let input;
  let before;
  let result;
  let output;

  beforeAll(() => {
    input = writeTemp(buildDump());
    before = sha(input);
    result = sanitise(input);
    output = fs.readFileSync(result.output.path).toString('latin1');
  });

  it('writes <name>-sqlite.sql beside the input and leaves the input byte-identical', () => {
    expect(result.output.path).toBe(path.join(path.dirname(input), 'dump-sqlite.sql'));
    expect(sha(input)).toBe(before);
  });

  it('removes the GTID statement and its comment', () => {
    expect(output).not.toMatch(/GTID/);
    expect(result.edits.filter((e) => e.rule === 'gtid-purged')).toEqual([
      expect.objectContaining({ line: 10 }),
    ]);
    expect(result.edits.filter((e) => e.rule === 'gtid-comment')).toEqual([
      expect.objectContaining({ line: 7 }),
    ]);
  });

  it('removes all three SQL_LOG_BIN statements', () => {
    expect(output).not.toMatch(/SQL_LOG_BIN/);
    expect(result.edits.filter((e) => e.rule === 'sql-log-bin').map((e) => e.line)).toEqual([
      3, 4, 25,
    ]);
  });

  it('rewrites _binary literals as hex literals holding the same bytes', () => {
    expect(output).toContain(
      `(X'${HASH_A.toString('hex')}',273),(X'${HASH_B.toString('hex')}',237);`
    );
    expect(result.edits.filter((e) => e.rule === 'binary-literal')).toEqual([
      expect.objectContaining({ line: 18, table: 'wp_pmxi_hash', count: 2 }),
    ]);
  });

  it('does not touch _binary text inside an ordinary string, and keeps non-UTF-8 bytes', () => {
    expect(output).toContain("(1,'caf\xe9 and _binary \\'not a literal\\' (text)');");
  });

  it('changes nothing except the edited lines', () => {
    const removed = new Set(
      result.edits
        .filter((e) => !['binary-literal', 'drop-table'].includes(e.rule))
        .map((e) => e.line)
    );
    const expected = buildDump()
      .split('\n')
      .filter((_, i) => !removed.has(i + 1))
      .join('\n')
      .replace(/^CREATE TABLE (`[^`]+`)/gm, 'DROP TABLE IF EXISTS $1;\nCREATE TABLE $1')
      .replace(
        /_binary '.*',273\),\(_binary '[^']*'/,
        `X'${HASH_A.toString('hex')}',273),(X'${HASH_B.toString('hex')}'`
      );
    expect(output).toBe(expected);
  });

  it('keeps CREATE TABLE and INSERT counts equal', () => {
    expect(result.output.createTables).toBe(result.input.createTables);
    expect(result.output.inserts).toBe(result.input.inserts);
    expect(result.input).toMatchObject({ createTables: 2, inserts: 2 });
  });

  it('refuses a binary literal whose length disagrees with its binary(N) column, writing nothing', () => {
    const bad = writeTemp(buildDump({ shortHash: true }));
    expect(() => sanitise(bad)).toThrow(/decodes to 15 bytes but the column is binary\(16\)/);
    expect(fs.readdirSync(path.dirname(bad))).toEqual(['dump.sql']);
  });

  it('refuses to overwrite the input or an existing output without --force', () => {
    expect(() => sanitise(input, { out: input })).toThrow(/must differ/);
    expect(() => sanitise(input)).toThrow(/already exists/);
    expect(() => sanitise(input, { force: true })).not.toThrow();
  });

  it('never truncates an existing file that shares the temporary name', () => {
    const file = writeTemp(buildDump());
    const bystander = path.join(path.dirname(file), 'dump-sqlite.sql.partial');
    fs.writeFileSync(bystander, 'keep me');
    sanitise(file);
    expect(fs.readFileSync(bystander, 'utf8')).toBe('keep me');
    expect(fs.readdirSync(path.dirname(file)).sort()).toEqual([
      'dump-sqlite.sql',
      'dump-sqlite.sql.partial',
      'dump.sql',
    ]);
  });

  it('exits 0 with JSON output from the CLI when nothing needs review', () => {
    const file = writeTemp(buildDump());
    const { code, stdout } = run(['sanitise', file, '--json']);
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toMatchObject({ command: 'sanitise', status: 'ok' });
  });

  it('exits 2 for bad arguments and compressed input', () => {
    expect(run(['sanitise']).code).toBe(2);
    expect(run(['sanitise', writeTemp('x', 'dump.sql.gz')]).stderr).toMatch(/decompress/);
  });
});
