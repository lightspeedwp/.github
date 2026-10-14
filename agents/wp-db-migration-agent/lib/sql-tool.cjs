#!/usr/bin/env node
/**
 * sql-tool: byte-safe helpers for moving WordPress databases between MySQL
 * hosts and WordPress Studio (SQLite Database Integration).
 *
 *   sanitise  <input.sql>  Apply the known MySQL-to-Studio fixes, scan for risks.
 *   preflight <input.sql>  Check a Studio export before importing it into MySQL.
 *   site-urls <input.sql>  Report siteurl/home from every *_options table.
 *   tables    <input.sql>  List tables with rows, size and group, to choose exclusions.
 *
 * Contract: .github/specs/020-wp-db-migration-agent/contracts/sql-tool-cli.md
 *
 * Dumps are read as bytes and decoded as latin1, which maps every byte to one
 * character and back, so non-UTF-8 content survives unchanged. The input is
 * never written; its SHA-256 is checked before and after a run.
 *
 * @module agents/wp-db-migration-agent/lib/sql-tool
 */

'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const CHUNK_SIZE = 1024 * 1024;

const EXIT_OK = 0;
const EXIT_FINDINGS = 1;
const EXIT_ERROR = 2;

/** Statements mysqldump adds on servers with GTID replication or binary logging. */
const REMOVAL_RULES = [
  {
    rule: 'gtid-purged',
    test: /^SET\s+@@GLOBAL\.GTID_PURGED\s*=/i,
    reason: 'Replication setting that only exists on a MySQL server; SQLite cannot run it.',
  },
  {
    rule: 'gtid-comment',
    test: /^-- GTID state at the beginning of the backup/,
    reason: 'Comment for the removed GTID statement.',
  },
  {
    rule: 'sql-log-bin',
    test: /^SET\s+@MYSQLDUMP_TEMP_LOG_BIN\s*=/i,
    reason: 'Saves the binary-log setting; SQLite has no binary log.',
  },
  {
    rule: 'sql-log-bin',
    test: /^SET\s+@@SESSION\.SQL_LOG_BIN\s*=/i,
    reason: 'Turns binary logging off or restores it; SQLite has no binary log.',
  },
];

const BINARY_REASON =
  "The SQLite driver cannot parse _binary '...' literals; rewritten as hex literals holding the same bytes.";

/**
 * MariaDB 11+ (seen on 13.0) dumps a binary column's default as
 * DEFAULT x AS `<hex>`, which is not valid SQL on any server.
 */
const BINARY_DEFAULT = /DEFAULT\s+x\s+AS\s+`([0-9a-f]*)`/gi;
const BINARY_DEFAULT_REASON =
  "MariaDB wrote the binary default as x AS `<hex>`, which no parser accepts; rewritten as the hex literal X'<hex>'.";

/**
 * Native SQLite syntax. The Studio importer (and Studio's phpMyAdmin) parse
 * MySQL and translate it, so a file converted to SQLite's own dialect fails on
 * its first statement, typically "Could not execute statement: PRAGMA ...".
 */
const SQLITE_DIALECT = [
  /^PRAGMA\s/i,
  /^BEGIN\s+(DEFERRED\s+|IMMEDIATE\s+|EXCLUSIVE\s+)?TRANSACTION\b/i,
  /^INSERT\s+OR\s+(IGNORE|REPLACE|ABORT|FAIL|ROLLBACK)\s+INTO\b/i,
  /^INSERT\s+INTO\s+["`]?sqlite_/i,
  /^CREATE\s+TABLE\b[^;]*\bAUTOINCREMENT\b/i,
  /^CREATE\s+TABLE\b[^;]*\)\s*(?:STRICT\s*,\s*)?WITHOUT\s+ROWID\b/i,
];

const DROP_TABLE_REASON =
  'The export had no DROP TABLE for this table, so CREATE TABLE fails on a Studio site that already has it (for example wp_options); added DROP TABLE IF EXISTS, as mysqldump does.';

/**
 * Wordfence's tables (wfconfig, wfhits, wfls_settings, ...): "wf" plus letters
 * and digits, or "wfls_" for its login-security module. Other plugins' "wf..."
 * tables with an underscore (such as wfu_log) do not match.
 */
const WORDFENCE_TABLE = /^wf(?:ls_[a-z0-9_]+|[a-z0-9]+)$/i;
const WORDFENCE_REASON =
  "Wordfence's security tables (logs, scan results, blocks) are left out by default: the plugin is not run on local sites.";

/** CREATE, INSERT, ALTER, DROP, LOCK and TRUNCATE statements name their table first. */
const STATEMENT_TABLE =
  /^(?:\/\*!\d+\s*)?(?:CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?|(?:INSERT|REPLACE)\s+(?:IGNORE\s+)?INTO|ALTER\s+TABLE|DROP\s+TABLE(?:\s+IF\s+EXISTS)?|LOCK\s+TABLES|TRUNCATE(?:\s+TABLE)?)\s+(`(?:[^`]|``)+`|[^\s(;,]+)/i;

const USERS_REASON =
  "Kept the Studio site's own accounts: the export's users and usermeta tables were left out.";

const EXCLUDE_REASON = "Left out at the user's request (--exclude).";

/** WordPress core tables (without prefix); excluding one usually breaks the site. */
const CORE_TABLES = new Set([
  'commentmeta',
  'comments',
  'links',
  'options',
  'postmeta',
  'posts',
  'term_relationships',
  'term_taxonomy',
  'termmeta',
  'terms',
  'usermeta',
  'users',
]);

const PREFIX_TABLES_REASON =
  'Renamed to the requested table prefix (CREATE, INSERT, ALTER, DROP and LOCK statements).';
const PREFIX_DATA_REASON =
  'WordPress looks these up by prefix: <prefix>user_roles in options and <prefix>* keys in usermeta.';

/** Statements that commonly fail on import; reported, never changed automatically. */
const RISK_RULES = [
  { check: 'global-variable', test: /^SET\s+@@GLOBAL\./i, detail: 'Sets a server-wide variable.' },
  {
    check: 'create-database',
    test: /^(\/\*!\d+\s*)?CREATE\s+DATABASE\b/i,
    detail: 'Creates a database.',
  },
  { check: 'use-database', test: /^USE\s+/i, detail: 'Switches database.' },
  {
    check: 'delimiter',
    test: /^DELIMITER\s+/i,
    detail: 'Changes the statement delimiter (stored routines or triggers follow).',
  },
  { check: 'definer', test: /DEFINER\s*=/i, detail: 'Names a MySQL user account as definer.' },
  { check: 'trigger', test: /\bCREATE\b[^;]*\bTRIGGER\b/i, detail: 'Creates a trigger.' },
  {
    check: 'routine',
    test: /\bCREATE\b[^;]*\b(PROCEDURE|FUNCTION)\b/i,
    detail: 'Creates a stored routine.',
  },
  { check: 'view', test: /\bCREATE\b[^;]*\bVIEW\b/i, detail: 'Creates a view.' },
  { check: 'event', test: /\bCREATE\b[^;]*\bEVENT\b/i, detail: 'Creates a scheduled event.' },
];

const TABLE_RISK_RULES = [
  { check: 'fulltext-index', test: /^\s*FULLTEXT\s+(KEY|INDEX)\b/im, detail: 'Full-text index.' },
  { check: 'spatial-index', test: /^\s*SPATIAL\s+(KEY|INDEX)\b/im, detail: 'Spatial index.' },
  { check: 'generated-column', test: /\bGENERATED\s+ALWAYS\s+AS\b/i, detail: 'Generated column.' },
];

const RISK_FIX = 'Review before import; ask the user before removing or rewriting it.';

/** Tables the SQLite Database Integration creates for itself (spec 020, research R4). */
const INTERNAL_TABLE = /^(_wp_sqlite_|_mysql_data_types_cache$|sqlite_)/;

/**
 * Local Studio URLs, including the JSON-escaped form block markup stores
 * (`https:\/\/site.local`, written to a dump as `https:\\/\\/site.local`).
 */
const LOCAL_URL =
  /https?:(?:\\{0,2}\/){2}(?:(?:[a-z0-9-]+\.)*[a-z0-9-]+\.local|localhost|127\.0\.0\.1)(?::\d+)?\b/gi;

const TARGETS = ['mysql-5.7', 'mysql-8', 'mariadb-10', 'mariadb-11'];

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------

/**
 * Yield the file's lines as latin1 strings, each including its "\n" terminator
 * (the last line may have none). Reads in fixed chunks so memory stays bounded.
 *
 * @param {string} file Path to read.
 * @param {import('node:crypto').Hash} [hash] Updated with every byte read.
 */
function* readLines(file, hash) {
  const fd = fs.openSync(file, 'r');
  try {
    const buffer = Buffer.alloc(CHUNK_SIZE);
    let carry = '';
    let bytesRead;
    while ((bytesRead = fs.readSync(fd, buffer, 0, CHUNK_SIZE, null)) > 0) {
      const chunk = buffer.subarray(0, bytesRead);
      if (hash) hash.update(chunk);
      const text = carry + chunk.toString('latin1');
      let start = 0;
      let newline;
      while ((newline = text.indexOf('\n', start)) !== -1) {
        yield text.slice(start, newline + 1);
        start = newline + 1;
      }
      carry = text.slice(start);
    }
    if (carry) yield carry;
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * Advance a lexer state across one line: tracks whether we are inside a quoted
 * string, a backtick identifier or a block comment, so statements can be split
 * on ";" safely. Line comments end with the line and need no state.
 *
 * @param {{quote: string|null, block: boolean}} state Mutated in place.
 * @param {string} line One line of SQL.
 */
function advanceLexState(state, line) {
  let i = 0;
  const n = line.length;
  while (i < n) {
    const c = line[i];
    if (state.block) {
      const end = line.indexOf('*/', i);
      if (end === -1) return;
      state.block = false;
      i = end + 2;
      continue;
    }
    if (state.quote) {
      if (c === '\\' && state.quote !== '`') {
        i += 2;
        continue;
      }
      if (c === state.quote) {
        if (line[i + 1] === state.quote) {
          i += 2;
          continue;
        }
        state.quote = null;
      }
      i += 1;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      state.quote = c;
      i += 1;
      continue;
    }
    if (c === '-' && line[i + 1] === '-' && /[\s]/.test(line[i + 2] || '\n')) return;
    if (c === '#') return;
    if (c === '/' && line[i + 1] === '*') {
      state.block = true;
      i += 2;
      continue;
    }
    i += 1;
  }
}

/**
 * Group lines into statements. Each statement keeps its original text exactly,
 * so concatenating every yielded `text` reproduces the input byte for byte.
 *
 * @param {Iterable<string>} lines Lines from readLines().
 * @returns {Generator<{text: string, line: number}>}
 */
function* readStatements(lines) {
  const state = { quote: null, block: false };
  let buffer = [];
  let startLine = 1;
  let lineNo = 0;
  for (const line of lines) {
    lineNo += 1;
    if (buffer.length === 0) startLine = lineNo;
    buffer.push(line);
    advanceLexState(state, line);
    if (state.quote || state.block) continue;
    const trimmed = line.trimEnd();
    const standalone = buffer.length === 1 && (trimmed === '' || /^(--|#)/.test(trimmed));
    if (standalone || trimmed.endsWith(';')) {
      yield { text: buffer.join(''), line: startLine };
      buffer = [];
    }
  }
  if (buffer.length) yield { text: buffer.join(''), line: startLine };
}

/** Strip leading whitespace and line comments to find a statement's first keyword. */
function head(text) {
  return text.replace(/^(\s|--[^\n]*\n)*/, '');
}

function kindOf(text) {
  const h = head(text);
  if (/^INSERT\s+(IGNORE\s+)?INTO\b/i.test(h)) return 'insert';
  if (/^CREATE\s+TABLE\b/i.test(h)) return 'create-table';
  if (/^(--|#)/.test(h) || h.trim() === '') return 'comment';
  return 'other';
}

function unquoteIdentifier(name) {
  return name.replace(/^`|`$/g, '').replace(/``/g, '`');
}

/** Parse a CREATE TABLE statement into its name, columns and table options. */
function parseCreateTable(text) {
  const nameMatch = head(text).match(
    /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(`(?:[^`]|``)+`|[^\s(]+)/i
  );
  if (!nameMatch) return null;
  const table = unquoteIdentifier(nameMatch[1]);
  const columns = [];
  for (const line of text.split('\n').slice(1)) {
    const col = line.match(/^\s*`((?:[^`]|``)+)`\s+([a-z]+)(?:\((\d+)\))?/i);
    if (col) {
      columns.push({
        name: col[1].replace(/``/g, '`'),
        type: col[2].toLowerCase(),
        length: col[3] ? Number(col[3]) : null,
      });
    }
  }
  const collations = [...text.matchAll(/COLLATE[\s=]+([a-z0-9_]+)/gi)].map((m) =>
    m[1].toLowerCase()
  );
  const charsets = [...text.matchAll(/(?:CHARSET|CHARACTER\s+SET)[\s=]+([a-z0-9_]+)/gi)].map((m) =>
    m[1].toLowerCase()
  );
  return { table, columns, collations, charsets };
}

const INSERT_HEAD =
  /^INSERT\s+(?:IGNORE\s+)?INTO\s+(`(?:[^`]|``)+`|[^\s(]+)\s*(?:\(([^)]*)\))?\s*VALUES\s*/i;

/** Decode a MySQL single-quoted literal body starting just after the opening quote. */
function readQuoted(text, start) {
  const bytes = [];
  let i = start;
  for (;;) {
    if (i >= text.length) throw new Error('unterminated string literal');
    const c = text[i];
    if (c === '\\') {
      const next = text[i + 1];
      const escaped = { 0: '\0', b: '\b', n: '\n', r: '\r', t: '\t', Z: '\x1a' }[next];
      bytes.push(escaped !== undefined ? escaped : next);
      i += 2;
    } else if (c === "'") {
      if (text[i + 1] === "'") {
        bytes.push("'");
        i += 2;
      } else {
        return { value: bytes.join(''), end: i + 1 };
      }
    } else {
      bytes.push(c);
      i += 1;
    }
  }
}

/**
 * Walk the VALUES of an INSERT, calling `onValue` for every value with its tuple
 * and field index. Strings are decoded; other tokens are passed raw. Returning a
 * string from `onValue` replaces that value's source text.
 *
 * @returns {{text: string, replaced: number}}
 */
function walkInsertValues(text, onValue) {
  const lead = text.length - head(text).length;
  const match = text.slice(lead).match(INSERT_HEAD);
  if (!match) return { text, replaced: 0, table: null, columns: null };
  const table = unquoteIdentifier(match[1]);
  const columns = match[2] ? match[2].split(',').map((c) => unquoteIdentifier(c.trim())) : null;
  const out = [];
  let copied = 0;
  let replaced = 0;
  let i = lead + match[0].length;
  let depth = 0;
  let tuple = -1;
  let field = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === '(' && depth === 0) {
      depth = 1;
      tuple += 1;
      field = 0;
      i += 1;
    } else if (c === ')' && depth === 1) {
      depth = 0;
      i += 1;
    } else if (c === ',' && depth === 1) {
      field += 1;
      i += 1;
    } else if (depth === 1 && !/\s/.test(c)) {
      const start = i;
      let binary = false;
      let raw = null;
      let value;
      const binaryMatch = text.slice(i, i + 12).match(/^_binary\s*(?=')/i);
      if (binaryMatch) {
        binary = true;
        i += binaryMatch[0].length;
      }
      if (text[i] === "'") {
        const read = readQuoted(text, i + 1);
        value = read.value;
        i = read.end;
      } else {
        while (i < text.length && !/[,)\s]/.test(text[i])) i += 1;
        raw = text.slice(start, i);
      }
      const replacement = onValue({
        tuple,
        field,
        column: columns ? columns[field] : null,
        value,
        raw,
        binary,
        start,
        table,
      });
      if (typeof replacement === 'string') {
        out.push(text.slice(copied, start), replacement);
        copied = i;
        replaced += 1;
      }
    } else {
      i += 1;
    }
  }
  out.push(text.slice(copied));
  return { text: out.join(''), replaced, table, columns };
}

function lineOffset(text, index) {
  let count = 0;
  for (let i = text.indexOf('\n'); i !== -1 && i < index; i = text.indexOf('\n', i + 1)) count += 1;
  return count;
}

function hashFile(file) {
  const hash = crypto.createHash('sha256');
  // Drain the generator; the hash is updated as a side effect.
  for (const line of readLines(file, hash)) void line;
  return hash.digest('hex');
}

/** True when a statement is native SQLite syntax rather than MySQL. */
function isSqliteDialect(text) {
  const h = head(text);
  return SQLITE_DIALECT.some((pattern) => pattern.test(h));
}

/** Quote a latin1 string as a MySQL single-quoted literal, escaping as mysqldump does. */
function mysqlQuote(value) {
  const map = { '\0': '\\0', '\n': '\\n', '\r': '\\r', '\x1a': '\\Z', '\\': '\\\\', "'": "\\'" };
  return `'${[...value].map((c) => map[c] ?? c).join('')}'`;
}

/**
 * Rewrite MariaDB's DEFAULT x AS `<hex>` binary defaults in a CREATE TABLE as
 * X'<hex>', checking the byte count against binary(N) columns.
 *
 * @returns {{text: string, edits: object[]}}
 */
function fixBinaryDefaults(text, startLine, table) {
  if (!/DEFAULT\s+x\s+AS\s+`/i.test(text)) return { text, edits: [] };
  const edits = [];
  const lines = text.split('\n').map((line, index) =>
    line.replace(BINARY_DEFAULT, (_, hex) => {
      const column = line.match(/^\s*`((?:[^`]|``)+)`\s+([a-z]+)(?:\((\d+)\))?/i);
      const where = `${table}.${column ? column[1] : '?'} (line ${startLine + index})`;
      if (hex.length % 2) {
        throw new Error(
          `binary default in ${where} has an odd number of hex digits; no output written`
        );
      }
      if (column && column[2].toLowerCase() === 'binary' && column[3]) {
        if (hex.length / 2 !== Number(column[3])) {
          throw new Error(
            `binary default in ${where} is ${hex.length / 2} bytes but the column is binary(${column[3]}); no output written`
          );
        }
      }
      edits.push({
        rule: 'binary-default',
        line: startLine + index,
        table,
        count: 1,
        reason: BINARY_DEFAULT_REASON,
      });
      return `DEFAULT X'${hex.toLowerCase()}'`;
    })
  );
  return { text: lines.join('\n'), edits };
}

/** Every table name from the export's CREATE TABLE statements, in order. */
function scanTables(input) {
  const tables = [];
  for (const statement of readStatements(readLines(input))) {
    if (kindOf(statement.text) !== 'create-table') continue;
    const parsed = parseCreateTable(statement.text);
    if (parsed) tables.push(parsed.table);
  }
  return tables;
}

/**
 * WordPress table prefixes in a list of tables. Prefers prefixes that have both
 * <prefix>options and <prefix>posts, so plugin tables such as
 * <prefix>wpb2d_options do not count as a second prefix.
 */
function detectPrefixes(tables) {
  const names = new Set(tables);
  const candidates = [
    ...new Set(tables.filter((t) => /options$/.test(t)).map((t) => t.replace(/options$/, ''))),
  ];
  const withPosts = candidates.filter((p) => names.has(`${p}posts`));
  return withPosts.length ? withPosts : candidates;
}

/** The table a statement creates, fills, alters, drops or locks, if any. */
function statementTable(text) {
  const match = head(text).match(STATEMENT_TABLE);
  return match ? unquoteIdentifier(match[1]) : null;
}

/**
 * Decide which tables `sanitise` leaves out, each with the edit rule and reason
 * to report. Wordfence tables are left out unless `keepWordfence` is set.
 *
 * @returns {{excluded: Map<string, {rule: string, reason: string, core?: boolean}>, unmatched: string[]}}
 */
function planExclusions(tables, options = {}) {
  const prefixes = detectPrefixes(tables);
  const local = (name) => {
    const prefix = prefixes.find((p) => name.startsWith(p));
    return prefix ? name.slice(prefix.length) : name;
  };
  const excluded = new Map();
  if (!options.keepWordfence) {
    for (const name of tables) {
      if (WORDFENCE_TABLE.test(local(name))) {
        excluded.set(name, { rule: 'exclude-wordfence', reason: WORDFENCE_REASON });
      }
    }
  }
  const patterns = (options.exclude || []).map((pattern) => {
    if (!/^[A-Za-z0-9_$*?-]+$/.test(pattern)) {
      throw usageError(
        `--exclude pattern "${pattern}" may contain only letters, digits, _ $ - and the wildcards * and ?`
      );
    }
    const source = pattern.replace(/[$-]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
    return { pattern, regex: new RegExp(`^${source}$`, 'i'), matched: false };
  });
  for (const name of tables) {
    if (excluded.has(name)) continue;
    const hit = patterns.find((p) => p.regex.test(name) || p.regex.test(local(name)));
    if (hit) {
      hit.matched = true;
      excluded.set(name, {
        rule: 'exclude-table',
        reason: EXCLUDE_REASON,
        core: CORE_TABLES.has(local(name)),
      });
    }
  }

  if (options.keepUsers) {
    for (const prefix of prefixes) {
      for (const name of [`${prefix}users`, `${prefix}usermeta`]) {
        if (tables.includes(name))
          excluded.set(name, { rule: 'exclude-users', reason: USERS_REASON });
      }
    }
  }
  return { excluded, unmatched: patterns.filter((p) => !p.matched).map((p) => p.pattern) };
}

/**
 * Work out a table-prefix rename for `sanitise --prefix`. The export must use
 * exactly one WordPress prefix (one *_options table), and no renamed table may
 * collide with a table that keeps its name.
 *
 * @returns {{from: string, to: string, renames: Map<string, string>}}
 */
function planPrefix(input, to) {
  if (!/^[A-Za-z0-9_]+$/.test(to)) {
    throw usageError('--prefix may contain only letters, digits and underscores');
  }
  const tables = scanTables(input);
  const prefixes = detectPrefixes(tables);
  if (prefixes.length !== 1) {
    throw usageError(
      `--prefix needs an export with exactly one WordPress table prefix; found ${
        prefixes.length ? prefixes.join(', ') : 'none'
      }`
    );
  }
  const from = prefixes[0];
  const renames = new Map();
  if (from !== to) {
    for (const name of tables) {
      if (name.startsWith(from)) renames.set(name, to + name.slice(from.length));
    }
  }
  const kept = new Set(tables.filter((name) => !renames.has(name)));
  const clash = [...renames.values()].find((name) => kept.has(name));
  if (clash) throw usageError(`renaming to ${to} would collide with the existing table ${clash}`);
  return { from, to, renames };
}

/** Keywords that a table name follows: CREATE/ALTER/DROP TABLE, IF [NOT] EXISTS, INTO, ... */
const TABLE_KEYWORDS = new Set([
  'TABLE',
  'TABLES',
  'EXISTS',
  'INTO',
  'UPDATE',
  'FROM',
  'JOIN',
  'REFERENCES',
]);

/** Statements whose comma-separated lists name tables, not columns. */
const TABLE_LIST = /^(?:\/\*!\d+\s*)?(?:LOCK\s+TABLES|DROP\s+TABLES?)\b/i;

/**
 * Rename every table being renamed where it is used as a table: after TABLE,
 * INTO, REFERENCES and the like, quoted or not. String literals and column
 * identifiers stay unchanged; comments carry no data, so backtick-quoted names
 * in them (such as "Table structure for table `x`") are renamed too.
 */
function renameTableIdentifiers(text, renames) {
  const quote = (name) => `\`${name.replace(/`/g, '``')}\``;
  const renameInComment = (comment) =>
    comment.replace(/`((?:[^`]|``)+)`/g, (whole, name) => {
      const to = renames.get(name.replace(/``/g, '`'));
      return to ? quote(to) : whole;
    });
  const list = TABLE_LIST.test(head(text));
  let out = '';
  let prev = null;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    const rest = text.slice(i, i + 3);
    if (/\s/.test(c)) {
      out += c;
      i += 1;
    } else if (/^\/\*M?!/.test(rest)) {
      const end = text.slice(i).match(/^\/\*M?!\d*/)[0].length;
      out += text.slice(i, i + end);
      i += end;
    } else if (rest.startsWith('/*') || c === '#' || /^--\s/.test(rest) || rest === '--') {
      const blockEnd = text.indexOf('*/', i + 2);
      const lineEnd = text.indexOf('\n', i);
      let end;
      if (c === '/') end = blockEnd === -1 ? text.length : blockEnd + 2;
      else end = lineEnd === -1 ? text.length : lineEnd;
      out += renameInComment(text.slice(i, end));
      i = end;
    } else if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < text.length) {
        if (text[j] === '\\') j += 2;
        else if (text[j] === c && text[j + 1] === c) j += 2;
        else if (text[j] === c) break;
        else j += 1;
      }
      out += text.slice(i, j + 1);
      i = j + 1;
      prev = { type: 'string' };
    } else if (c === '`' || /[A-Za-z0-9_$]/.test(c)) {
      const token =
        c === '`'
          ? (text.slice(i).match(/^`(?:[^`]|``)*`/) || [text.slice(i)])[0]
          : text.slice(i).match(/^[\w$]+/)[0];
      const name = c === '`' ? unquoteIdentifier(token) : token;
      const atTable =
        (prev && prev.type === 'word' && TABLE_KEYWORDS.has(prev.value.toUpperCase())) ||
        (list && prev && prev.type === 'punct' && prev.value === ',');
      const to = atTable ? renames.get(name) : undefined;
      out += to ? (c === '`' ? quote(to) : to) : token;
      i += token.length;
      prev = { type: c === '`' ? 'ident' : 'word', value: name };
    } else {
      out += c;
      i += 1;
      prev = { type: 'punct', value: c };
    }
  }
  return out;
}

/**
 * Apply a prefix rename to one INSERT: the table name in its head, plus the
 * prefixed keys WordPress looks up (options.<prefix>user_roles and
 * usermeta.<prefix>*). Other values are data and stay unchanged.
 */
function renameInsertPrefix(text, prefix, tables, counts) {
  const lead = text.length - head(text).length;
  const match = text.slice(lead).match(INSERT_HEAD);
  if (!match) return text;
  const table = unquoteIdentifier(match[1]);
  const to = prefix.renames.get(table);
  if (!to) return text;
  const definition = tables.get(table);
  const names = match[2]
    ? match[2].split(',').map((c) => unquoteIdentifier(c.trim()))
    : definition
      ? definition.columns.map((c) => c.name)
      : [];
  let field = -1;
  let renamesValue = () => false;
  if (table === `${prefix.from}options`) {
    field = names.indexOf('option_name');
    renamesValue = (value) => value === `${prefix.from}user_roles`;
  } else if (table === `${prefix.from}usermeta`) {
    field = names.indexOf('meta_key');
    renamesValue = (value) => value.startsWith(prefix.from);
  }
  let out = text;
  if (field !== -1) {
    const result = walkInsertValues(text, (v) => {
      if (v.field !== field || v.value === undefined || !renamesValue(v.value)) return undefined;
      return mysqlQuote(prefix.to + v.value.slice(prefix.from.length));
    });
    out = result.text;
    counts.data += result.replaced;
  }
  const nameStart = lead + match[0].indexOf(match[1]);
  const body = out.slice(nameStart + match[1].length);
  counts.leftover += body.split(prefix.from).length - 1;
  return `${out.slice(0, nameStart)}\`${to.replace(/`/g, '``')}\`${body}`;
}

// ---------------------------------------------------------------------------
// Analysis shared by every command
// ---------------------------------------------------------------------------

function newSummary(file) {
  return {
    path: path.resolve(file),
    bytes: fs.statSync(file).size,
    lines: 0,
    createTables: 0,
    inserts: 0,
    tables: [],
    prefixes: [],
  };
}

function countLines(text) {
  let count = 0;
  for (let i = text.indexOf('\n'); i !== -1; i = text.indexOf('\n', i + 1)) count += 1;
  return count;
}

function riskFindings(statement, kind, severity) {
  const findings = [];
  if (kind === 'insert' || kind === 'comment') return findings;
  const h = head(statement.text);
  for (const rule of kind === 'other' ? RISK_RULES : []) {
    if (rule.check === 'global-variable' && /GTID_PURGED/i.test(h)) continue;
    if (rule.test.test(h)) {
      findings.push({
        check: rule.check,
        severity,
        line: statement.line,
        table: null,
        detail: rule.detail,
        fix: RISK_FIX,
        autoFixable: false,
      });
      break;
    }
  }
  if (kind === 'create-table') {
    const parsed = parseCreateTable(statement.text);
    for (const rule of TABLE_RISK_RULES) {
      if (rule.test.test(statement.text)) {
        findings.push({
          check: rule.check,
          severity,
          line: statement.line,
          table: parsed && parsed.table,
          detail: rule.detail,
          fix: RISK_FIX,
          autoFixable: false,
        });
      }
    }
  }
  return findings;
}

/** Collect siteurl/home from an INSERT into an *_options table. */
function collectSiteUrls(statement, tables, siteUrls) {
  const lead = statement.text.length - head(statement.text).length;
  const match = statement.text.slice(lead).match(INSERT_HEAD);
  if (!match || !/_options$/.test(unquoteIdentifier(match[1]))) return;
  const table = unquoteIdentifier(match[1]);
  const definition = tables.get(table);
  const names = match[2]
    ? match[2].split(',').map((c) => unquoteIdentifier(c.trim()))
    : definition
      ? definition.columns.map((c) => c.name)
      : ['option_id', 'option_name', 'option_value', 'autoload'];
  const nameField = names.indexOf('option_name');
  const valueField = names.indexOf('option_value');
  if (nameField === -1 || valueField === -1) return;
  const rows = new Map();
  walkInsertValues(statement.text, (v) => {
    if (!rows.has(v.tuple)) rows.set(v.tuple, {});
    rows.get(v.tuple)[v.field] = v.value !== undefined ? v.value : v.raw;
  });
  for (const row of rows.values()) {
    const option = row[nameField];
    if (option === 'siteurl' || option === 'home') {
      siteUrls.push({
        table,
        option,
        value: Buffer.from(row[valueField] ?? '', 'latin1').toString('utf8'),
      });
    }
  }
}

function finalisePrefixes(summary) {
  summary.prefixes = detectPrefixes(summary.tables);
}

/** Studio's site list, with each site's path, port and custom domain. */
const STUDIO_CONFIG = path.join(os.homedir(), '.studio', 'cli.json');

/**
 * The Studio site's own URL from Studio's site list: its custom domain
 * (https unless HTTPS is turned off) or http://localhost:<port>. Returns null
 * when Studio's config is missing or does not list the site.
 */
function readStudioUrl(site, configPath = process.env.STUDIO_CLI_CONFIG || STUDIO_CONFIG) {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    return null;
  }
  const target = path.resolve(site);
  const sites = [];
  const walk = (node) => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      if (typeof node.path === 'string' && (node.customDomain || node.port)) sites.push(node);
      Object.values(node).forEach(walk);
    }
  };
  walk(config);
  const entry = sites.find((s) => path.resolve(s.path) === target);
  if (!entry) return null;
  if (entry.customDomain) {
    return `${entry.enableHttps === false ? 'http' : 'https'}://${entry.customDomain}`;
  }
  return `http://localhost:${entry.port}`;
}

/** Escape a host name for a PCRE pattern. */
function escapeHost(host) {
  return host.replace(/[.\\^$|?*+()[\]{}-]/g, '\\$&');
}

/**
 * Plan the URL replacement from the export's siteurl/home to the Studio site's
 * URL: one PCRE pattern for WP-CLI search-replace --regex that matches http and
 * https, with or without www, and the JSON-escaped form (https:\/\/), plus the
 * number of matches in the export. The dump itself is never changed: only a
 * serialisation-aware tool may replace URLs.
 */
function planUrlReplacement(input, siteUrls, studioUrl, site) {
  if (!studioUrl) return null;
  const destination = new URL(studioUrl);
  const hosts = [
    ...new Set(
      siteUrls
        .map((u) => {
          try {
            return new URL(u.value).host.toLowerCase().replace(/^www\./, '');
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    ),
  ].filter((host) => host !== destination.host.replace(/^www\./, ''));
  if (!hosts.length) return null;
  const alternatives = hosts.map(escapeHost).join('|');
  const group = hosts.length > 1 ? `(?:${alternatives})` : alternatives;
  // (\\?/) keeps a JSON-escaped slash; the lookahead stops at the host's end.
  const regex = `https?:(\\\\?/)(\\\\?/)(?:www\\.)?${group}(?!\\.?[\\w-])`;
  const replacement = `${destination.protocol.slice(0, -1)}:\${1}\${2}${destination.host}`;
  // In the dump a JSON-escaped slash is written as \\/ (MySQL escapes the backslash).
  const counter = new RegExp(
    `https?:(?:\\\\{0,2}/){2}(?:www\\.)?(?:${alternatives})(?!\\.?[\\w-])`,
    'gi'
  );
  let occurrences = 0;
  for (const statement of readStatements(readLines(input))) {
    if (kindOf(statement.text) !== 'insert') continue;
    occurrences += (statement.text.match(counter) || []).length;
  }
  const command = `studio wp --path ${site} search-replace '${regex}' '${replacement}' --regex --all-tables-with-prefix --dry-run --report-changed-only`;
  return {
    sources: hosts,
    destination: `${destination.protocol}//${destination.host}`,
    regex,
    replacement,
    occurrences,
    command,
  };
}

/** Finding asking the agent to confirm the URL replacement with the user. */
function urlFindings(plan) {
  if (!plan) return [];
  return [
    {
      check: 'url-replacement',
      severity: 'info',
      line: null,
      table: null,
      detail: `${plan.occurrences} link(s) in the export point at ${plan.sources.join(', ')} (http or https, with or without www); the Studio site's URL is ${plan.destination}.`,
      fix: 'Ask the user to confirm the replacement, then after import preview and apply it with the wp-url-replacement skill.',
      autoFixable: false,
    },
  ];
}

/** Read $table_prefix from a Studio site's wp-config.php. */
function readStudioPrefix(site) {
  const config = path.join(site, 'wp-config.php');
  if (!fs.existsSync(config)) throw usageError(`no wp-config.php in ${site}`);
  const match = fs
    .readFileSync(config, 'utf8')
    .match(/^\s*\$table_prefix\s*=\s*(['"])([A-Za-z0-9_]+)\1\s*;/m);
  if (!match) throw usageError(`could not read $table_prefix from ${config}`);
  return match[2];
}

/**
 * Compare the export's prefix (after any --prefix rename) with the Studio
 * site's, so the agent can ask the user which to change.
 */
function prefixFindings(summary, studioPrefix, renamedTo) {
  if (!studioPrefix || summary.prefixes.length !== 1) return [];
  const exportPrefix = renamedTo || summary.prefixes[0];
  if (exportPrefix === studioPrefix) return [];
  return [
    {
      check: 'prefix-differs',
      severity: 'warn',
      line: null,
      table: null,
      detail: `The export's tables use ${exportPrefix}, but the Studio site's wp-config.php has $table_prefix = '${studioPrefix}'. WordPress would not see the imported data.`,
      fix: `Ask the user: rename the tables with --prefix ${studioPrefix}, or set $table_prefix to '${exportPrefix}' in the site's wp-config.php.`,
      autoFixable: false,
    },
  ];
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

/**
 * Apply the known MySQL-to-Studio fixes (spec 020 FR-010 to FR-015).
 *
 * @param {string} input Path to the MySQL export.
 * @param {{out?: string, force?: boolean}} [options]
 */
function sanitise(input, options = {}) {
  const out = path.resolve(options.out || input.replace(/(\.sql)?$/i, '-sqlite.sql'));
  if (out === path.resolve(input))
    throw usageError('the output path must differ from the input path');
  if (fs.existsSync(out) && !options.force)
    throw usageError(`${out} already exists; pass --force to overwrite it`);
  const prefix = options.prefix ? planPrefix(input, options.prefix) : null;
  const studioPrefix = options.studioSite ? readStudioPrefix(options.studioSite) : null;
  if (options.keepUsers && studioPrefix) {
    const outputPrefix = prefix ? prefix.to : detectPrefixes(scanTables(input))[0];
    if (outputPrefix !== studioPrefix) {
      throw usageError(
        `--keep-users needs the imported tables to use the Studio site's prefix (${studioPrefix}), because its accounts' roles are stored under that prefix; add --prefix ${studioPrefix}`
      );
    }
  }
  const { excluded, unmatched } = planExclusions(scanTables(input), options);
  const excludedCounts = new Map();
  const left = { createTables: 0, inserts: 0 };
  const prefixCounts = { data: 0, leftover: 0 };
  const dropped = new Set();

  const beforeHash = crypto.createHash('sha256');
  const summary = newSummary(input);
  const outSummary = { path: out, bytes: 0, lines: 0, createTables: 0, inserts: 0 };
  const tables = new Map();
  const edits = [];
  const findings = [];
  const siteUrls = [];
  // A unique name opened exclusively, so an existing file is never truncated.
  const partial = `${out}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.partial`;
  const fd = fs.openSync(partial, 'wx');

  const write = (text) => {
    const buffer = Buffer.from(text, 'latin1');
    fs.writeSync(fd, buffer);
    outSummary.bytes += buffer.length;
    outSummary.lines += countLines(text);
  };

  try {
    for (const statement of readStatements(readLines(input, beforeHash))) {
      summary.lines += countLines(statement.text);
      const kind = kindOf(statement.text);
      const h = head(statement.text);

      if (kind !== 'comment' && isSqliteDialect(statement.text)) {
        throw new Error(
          `line ${statement.line} is SQLite syntax (${h.split(/\s+/, 1)[0]} ...), not MySQL. Studio's importer only accepts MySQL dumps and translates them itself; sanitise the original MySQL export instead. No output written`
        );
      }

      const subject = kind === 'comment' ? statement.text : h;
      const removal = REMOVAL_RULES.find((r) => r.test.test(subject));
      if (removal) {
        const line =
          statement.line + lineOffset(statement.text, statement.text.length - subject.length);
        edits.push({ rule: removal.rule, line, table: null, count: 1, reason: removal.reason });
        continue;
      }

      const target = statementTable(statement.text);
      if (target && excluded.has(target)) {
        if (!excludedCounts.has(target))
          excludedCounts.set(target, { line: statement.line, statements: 0 });
        excludedCounts.get(target).statements += 1;
        if (kind === 'create-table') {
          summary.createTables += 1;
          summary.tables.push(target);
          left.createTables += 1;
        } else if (kind === 'insert') {
          summary.inserts += 1;
          left.inserts += 1;
        }
        continue;
      }

      findings.push(...riskFindings(statement, kind, 'warn'));
      let text = statement.text;

      const drop = h.match(/^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([^;]+)/i);
      if (drop) {
        for (const name of drop[1].split(',')) dropped.add(unquoteIdentifier(name.trim()));
      }

      if (kind === 'create-table') {
        const parsed = parseCreateTable(text);
        summary.createTables += 1;
        outSummary.createTables += 1;
        if (parsed) {
          tables.set(parsed.table, parsed);
          summary.tables.push(parsed.table);
          const fixed = fixBinaryDefaults(text, statement.line, parsed.table);
          text = fixed.text;
          edits.push(...fixed.edits);
          if (!dropped.has(parsed.table)) {
            text = `DROP TABLE IF EXISTS \`${parsed.table.replace(/`/g, '``')}\`;\n${text}`;
            edits.push({
              rule: 'drop-table',
              line: statement.line,
              table: parsed.table,
              count: 1,
              reason: DROP_TABLE_REASON,
            });
          }
        }
      } else if (kind === 'insert') {
        summary.inserts += 1;
        outSummary.inserts += 1;
        collectSiteUrls(statement, tables, siteUrls);
        if (/_binary\s*'/i.test(text)) {
          const lines = new Map();
          const result = walkInsertValues(text, (v) => {
            if (!v.binary) return undefined;
            const definition = tables.get(v.table);
            const column = definition
              ? v.column
                ? definition.columns.find((c) => c.name === v.column)
                : definition.columns[v.field]
              : null;
            if (
              column &&
              column.type === 'binary' &&
              column.length !== null &&
              v.value.length !== column.length
            ) {
              throw new Error(
                `binary literal in ${v.table}.${column.name} (line ${statement.line + lineOffset(text, v.start)}, row ${v.tuple + 1}) decodes to ${v.value.length} bytes but the column is binary(${column.length}); no output written`
              );
            }
            const line = statement.line + lineOffset(text, v.start);
            lines.set(line, (lines.get(line) || 0) + 1);
            return `X'${Buffer.from(v.value, 'latin1').toString('hex')}'`;
          });
          text = result.text;
          for (const [line, count] of lines) {
            edits.push({
              rule: 'binary-literal',
              line,
              table: result.table,
              count,
              reason: BINARY_REASON,
            });
          }
        }
      }
      if (prefix && prefix.renames.size) {
        text =
          kind === 'insert'
            ? renameInsertPrefix(text, prefix, tables, prefixCounts)
            : renameTableIdentifiers(text, prefix.renames);
      }
      write(text);
    }
    fs.closeSync(fd);
  } catch (error) {
    try {
      fs.closeSync(fd);
    } catch {
      // Already closed.
    }
    fs.rmSync(partial, { force: true });
    throw error;
  }

  finalisePrefixes(summary);
  const beforeDigest = beforeHash.digest('hex');
  const verificationErrors = [];
  if (outSummary.createTables !== summary.createTables - left.createTables)
    verificationErrors.push('CREATE TABLE counts differ');
  if (outSummary.inserts !== summary.inserts - left.inserts)
    verificationErrors.push('INSERT counts differ');
  if (hashFile(input) !== beforeDigest)
    verificationErrors.push('the input file changed during the run');
  if (verificationErrors.length) {
    fs.rmSync(partial, { force: true });
    throw new Error(`verification failed: ${verificationErrors.join('; ')}`);
  }
  fs.renameSync(partial, out);

  for (const [table, counts] of excludedCounts) {
    const { rule, reason } = excluded.get(table);
    edits.push({ rule, line: counts.line, table, count: counts.statements, reason });
  }
  if ([...excludedCounts.keys()].some((t) => excluded.get(t).rule === 'exclude-wordfence')) {
    findings.push({
      check: 'wordfence-excluded',
      severity: 'info',
      line: null,
      table: null,
      detail: "Wordfence's tables were left out. Its settings in the options table were kept.",
      fix: 'Keep the Wordfence plugin deactivated on the local site (studio wp plugin deactivate wordfence). Pass --keep-wordfence to import its tables.',
      autoFixable: false,
    });
  }

  if (prefix && prefix.renames.size) {
    edits.push({
      rule: 'prefix-tables',
      line: null,
      table: `${prefix.from}* → ${prefix.to}*`,
      count: [...prefix.renames.keys()].filter((t) => !excluded.has(t)).length,
      reason: PREFIX_TABLES_REASON,
    });
    if (prefixCounts.data) {
      edits.push({
        rule: 'prefix-data',
        line: null,
        table: `${prefix.to}options, ${prefix.to}usermeta`,
        count: prefixCounts.data,
        reason: PREFIX_DATA_REASON,
      });
    }
    if (prefixCounts.leftover) {
      findings.push({
        check: 'prefix-in-data',
        severity: 'info',
        line: null,
        table: null,
        detail: `${prefixCounts.leftover} other occurrence(s) of ${prefix.from} remain inside row data (for example cached or serialised values); they were left unchanged.`,
        fix: 'Usually harmless: WordPress and plugins rebuild these caches. Search the imported site if something still refers to the old prefix.',
        autoFixable: false,
      });
    }
    for (const url of siteUrls) url.table = prefix.renames.get(url.table) || url.table;
  }

  if (studioPrefix) summary.studioPrefix = studioPrefix;
  findings.push(...prefixFindings(summary, studioPrefix, prefix && prefix.to));
  const studioUrl = options.studioSite ? readStudioUrl(options.studioSite) : null;
  if (studioUrl) summary.studioUrl = studioUrl;
  const urlReplacement = planUrlReplacement(input, siteUrls, studioUrl, options.studioSite);
  findings.push(...urlFindings(urlReplacement));
  const hasUsers = summary.tables.some((t) => /_users$/.test(t) && !excluded.has(t));
  findings.push(...postImportNotes(siteUrls, hasUsers));
  for (const pattern of unmatched) {
    findings.push({
      check: 'exclude-unmatched',
      severity: 'warn',
      line: null,
      table: null,
      detail: `--exclude ${pattern} matched no table.`,
      fix: 'Check the name with sql-tool tables; patterns match the full name or the name without the prefix.',
      autoFixable: false,
    });
  }
  const core = [...excluded].filter(([, e]) => e.core).map(([t]) => t);
  if (core.length) {
    findings.push({
      check: 'exclude-core',
      severity: 'warn',
      line: null,
      table: core.join(', '),
      detail: 'WordPress core tables were left out; the Studio site keeps its own copies of them.',
      fix: 'Confirm with the user that this is intended; content may not match the rest of the import.',
      autoFixable: false,
    });
  }
  if ([...excludedCounts.keys()].some((t) => excluded.get(t).rule === 'exclude-users')) {
    findings.push(...keepUsersNotes(studioPrefix));
  }

  return {
    ...envelope('sanitise', summary, outSummary, edits, findings, siteUrls),
    urlReplacement,
  };
}

/** What the user should know after importing without the export's accounts. */
function keepUsersNotes(studioPrefix) {
  const notes = [
    {
      check: 'users-kept',
      severity: 'info',
      line: null,
      table: null,
      detail:
        "The Studio site keeps its own accounts. Posts and comments keep the source site's author IDs, which may belong to a different local user or to none.",
      fix: 'Log in with your local account. Reassign authors after import if it matters (studio wp post list --field=post_author).',
      autoFixable: false,
    },
  ];
  if (!studioPrefix) {
    notes.push({
      check: 'users-kept-prefix',
      severity: 'warn',
      line: null,
      table: null,
      detail:
        "Local accounts' roles are stored under the Studio site's table prefix, which was not checked.",
      fix: 'Re-run with --studio-site ~/Studio/<site> so the tool confirms the prefixes match.',
      autoFixable: false,
    });
  }
  return notes;
}

function postImportNotes(siteUrls, hasUsers) {
  const notes = [];
  const http = siteUrls.filter((u) => u.value.startsWith('http://'));
  if (http.length) {
    notes.push({
      check: 'site-url-scheme',
      severity: 'info',
      line: null,
      table: http[0].table,
      detail: `siteurl/home use http:// (${[...new Set(http.map((u) => u.value))].join(', ')}); Studio serves https.`,
      fix: 'After import, run the wp-url-replacement skill to replace the URL in content as well.',
      autoFixable: false,
    });
  }
  if (hasUsers) {
    notes.push({
      check: 'users-replaced',
      severity: 'info',
      line: null,
      table: null,
      detail: "The export contains a users table; importing replaces the local site's accounts.",
      fix: 'Log in with an account from the source site after import.',
      autoFixable: false,
    });
  }
  return notes;
}

/**
 * Check a Studio export before it is imported into MySQL or MariaDB
 * (spec 020 FR-020 to FR-024). Read-only.
 *
 * @param {string} input Path to the export.
 * @param {{target?: string, prefix?: string}} [options]
 */
function preflight(input, options = {}) {
  if (options.target && !TARGETS.includes(options.target)) {
    throw usageError(`--target must be one of ${TARGETS.join(', ')}`);
  }
  const summary = newSummary(input);
  const tables = new Map();
  const findings = [];
  const siteUrls = [];
  const localUrls = new Map();
  let dropTables = 0;
  let sqliteDialect = null;

  for (const statement of readStatements(readLines(input))) {
    summary.lines += countLines(statement.text);
    const kind = kindOf(statement.text);
    const h = head(statement.text);
    if (kind !== 'comment' && isSqliteDialect(statement.text)) {
      sqliteDialect = sqliteDialect || { line: statement.line, count: 0 };
      sqliteDialect.count += 1;
    }
    findings.push(...riskFindings(statement, kind, 'fail').map(promoteSeverity));
    if (/^DROP\s+TABLE\b/i.test(h)) dropTables += 1;

    if (kind === 'create-table') {
      summary.createTables += 1;
      const parsed = parseCreateTable(statement.text);
      if (!parsed) continue;
      tables.set(parsed.table, parsed);
      summary.tables.push(parsed.table);
      if (INTERNAL_TABLE.test(parsed.table)) {
        findings.push({
          check: 'internal-table',
          severity: 'fail',
          line: statement.line,
          table: parsed.table,
          detail:
            'Internal table created by the SQLite Database Integration; it does not belong in a MySQL database.',
          fix: "Remove this table's CREATE, DROP and INSERT statements before import.",
          autoFixable: false,
        });
        continue;
      }
      const c0900 = parsed.collations.find((c) => c.includes('_0900_'));
      if (c0900 && options.target !== 'mysql-8') {
        const fails = options.target && options.target !== 'mysql-8';
        findings.push({
          check: 'collation-0900',
          severity: fails ? 'fail' : 'warn',
          line: statement.line,
          table: parsed.table,
          detail: `Uses ${c0900}, which only MySQL 8 supports.`,
          fix: 'Replace with utf8mb4_unicode_520_ci for MySQL 5.7 or MariaDB targets.',
          autoFixable: false,
        });
      }
      const legacy = parsed.charsets.find((c) => c === 'utf8mb3' || c === 'utf8' || c === 'latin1');
      if (legacy) {
        findings.push({
          check: 'legacy-charset',
          severity: 'info',
          line: statement.line,
          table: parsed.table,
          detail: `Uses the ${legacy} character set.`,
          fix: 'Usually harmless; convert to utf8mb4 if the target site expects emoji or full Unicode.',
          autoFixable: false,
        });
      }
      if (options.prefix && !parsed.table.startsWith(options.prefix)) {
        findings.push({
          check: 'prefix-mismatch',
          severity: 'warn',
          line: statement.line,
          table: parsed.table,
          detail: `Table prefix differs from the target prefix ${options.prefix}.`,
          fix: 'Rename the tables or change $table_prefix in the target wp-config.php to match.',
          autoFixable: false,
        });
      }
    } else if (kind === 'insert') {
      summary.inserts += 1;
      collectSiteUrls(statement, tables, siteUrls);
      const lead = statement.text.length - h.length;
      const match = statement.text.slice(lead).match(INSERT_HEAD);
      const table = match ? unquoteIdentifier(match[1]) : null;
      if (table && INTERNAL_TABLE.test(table)) continue;
      for (const match of statement.text.match(LOCAL_URL) || []) {
        const url = match.replace(/\\/g, '').toLowerCase();
        const key = `${table}\u0000${url}`;
        localUrls.set(key, (localUrls.get(key) || 0) + 1);
      }
    }
  }

  if (sqliteDialect) {
    findings.push({
      check: 'sqlite-dialect',
      severity: 'fail',
      line: sqliteDialect.line,
      table: null,
      detail: `${sqliteDialect.count} statement(s) use SQLite's own syntax (PRAGMA, AUTOINCREMENT, INSERT OR ..., sqlite_ tables); MySQL cannot run them.`,
      fix: 'Export from Studio in MySQL format (studio export --mode db, or Studio phpMyAdmin) instead of a sqlite3 dump.',
      autoFixable: false,
    });
  }
  if (dropTables) {
    findings.push({
      check: 'drop-table',
      severity: 'warn',
      line: null,
      table: null,
      detail: `${dropTables} DROP TABLE statement(s) will replace existing tables on the target.`,
      fix: 'Back up the target database before import.',
      autoFixable: false,
    });
  }
  const byHost = new Map();
  for (const [key, count] of localUrls) {
    const [table, url] = key.split('\u0000');
    const entry = byHost.get(url) || { count: 0, tables: new Set() };
    entry.count += count;
    entry.tables.add(table);
    byHost.set(url, entry);
  }
  for (const [url, entry] of byHost) {
    findings.push({
      check: 'local-url',
      severity: 'warn',
      line: null,
      table: [...entry.tables].join(', '),
      detail: `${entry.count} occurrence(s) of ${url}.`,
      fix: 'Replace with the target URL using the wp-url-replacement skill.',
      autoFixable: false,
    });
  }
  if (summary.createTables === 0) {
    findings.push({
      check: 'no-tables',
      severity: 'fail',
      line: null,
      table: null,
      detail: 'No CREATE TABLE statements found; the file may be partial or not a database export.',
      fix: 'Re-export with structure and data.',
      autoFixable: false,
    });
  }
  finalisePrefixes(summary);
  return envelope('preflight', summary, null, [], findings, siteUrls);
}

/** Risky statements are a hard stop for a staging or live import, except definers and indexes. */
function promoteSeverity(finding) {
  const warnOnly = [
    'fulltext-index',
    'spatial-index',
    'generated-column',
    'definer',
    'view',
    'trigger',
    'routine',
    'event',
  ];
  return warnOnly.includes(finding.check) ? { ...finding, severity: 'warn' } : finding;
}

/**
 * Report siteurl and home from every *_options table (spec 020 FR-030). Read-only.
 *
 * @param {string} input Path to the export.
 */
function siteUrlsCommand(input, options = {}) {
  const studioPrefix = options.studioSite ? readStudioPrefix(options.studioSite) : null;
  const summary = newSummary(input);
  const tables = new Map();
  const siteUrls = [];
  const findings = [];
  for (const statement of readStatements(readLines(input))) {
    summary.lines += countLines(statement.text);
    const kind = kindOf(statement.text);
    if (kind === 'create-table') {
      summary.createTables += 1;
      const parsed = parseCreateTable(statement.text);
      if (parsed) {
        tables.set(parsed.table, parsed);
        summary.tables.push(parsed.table);
      }
    } else if (kind === 'insert') {
      summary.inserts += 1;
      collectSiteUrls(statement, tables, siteUrls);
    }
  }
  finalisePrefixes(summary);
  if (studioPrefix) summary.studioPrefix = studioPrefix;
  findings.push(...prefixFindings(summary, studioPrefix));
  const studioUrl = options.studioSite ? readStudioUrl(options.studioSite) : null;
  if (studioUrl) summary.studioUrl = studioUrl;
  const urlReplacement = planUrlReplacement(input, siteUrls, studioUrl, options.studioSite);
  findings.push(...urlFindings(urlReplacement));
  if (siteUrls.length === 0) {
    findings.push({
      check: 'no-site-url',
      severity: 'warn',
      line: null,
      table: null,
      detail:
        'No siteurl or home option found; the file may be partial or not a WordPress database.',
      fix: 'Ask the user to confirm the source URL; do not guess.',
      autoFixable: false,
    });
  }
  for (const table of new Set(siteUrls.map((u) => u.table))) {
    const values = siteUrls.filter((u) => u.table === table);
    const siteurl = values.find((u) => u.option === 'siteurl');
    const home = values.find((u) => u.option === 'home');
    if (siteurl && home && siteurl.value !== home.value) {
      findings.push({
        check: 'siteurl-home-differ',
        severity: 'info',
        line: null,
        table,
        detail: `siteurl (${siteurl.value}) and home (${home.value}) differ.`,
        fix: 'Ask the user for a destination for each.',
        autoFixable: false,
      });
    }
  }
  return { ...envelope('site-urls', summary, null, [], findings, siteUrls), urlReplacement };
}

/**
 * List every table with its rows and size, and what it belongs to, so the
 * user can choose tables to leave out (spec 020). Read-only.
 *
 * @param {string} input Path to the export.
 */
function tablesCommand(input) {
  const summary = newSummary(input);
  const rows = new Map();
  for (const statement of readStatements(readLines(input))) {
    summary.lines += countLines(statement.text);
    const kind = kindOf(statement.text);
    if (kind === 'create-table') {
      summary.createTables += 1;
      const parsed = parseCreateTable(statement.text);
      if (parsed) {
        summary.tables.push(parsed.table);
        rows.set(parsed.table, { rows: 0, bytes: 0 });
      }
    } else if (kind === 'insert') {
      summary.inserts += 1;
      const target = statementTable(statement.text);
      if (!rows.has(target)) rows.set(target, { rows: 0, bytes: 0 });
      const entry = rows.get(target);
      let tuples = 0;
      walkInsertValues(statement.text, (v) => {
        tuples = Math.max(tuples, v.tuple + 1);
      });
      entry.rows += tuples;
      entry.bytes += statement.text.length;
    }
  }
  finalisePrefixes(summary);
  const prefixes = summary.prefixes;
  const local = (name) => {
    const prefix = prefixes.find((p) => name.startsWith(p));
    return prefix ? name.slice(prefix.length) : name;
  };
  const tableList = [...rows].map(([name, counts]) => {
    const short = local(name);
    const group = WORDFENCE_TABLE.test(short)
      ? 'wordfence'
      : short === 'users' || short === 'usermeta'
        ? 'users'
        : CORE_TABLES.has(short)
          ? 'core'
          : 'plugin';
    return { table: name, group, rows: counts.rows, bytes: counts.bytes };
  });
  const result = envelope('tables', summary, null, [], [], []);
  result.tableList = tableList;
  return result;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function envelope(command, input, output, edits, findings, siteUrls) {
  const flagged = findings.some((f) => f.severity !== 'info');
  return {
    command,
    status: flagged ? 'findings' : 'ok',
    input,
    output,
    edits,
    findings,
    siteUrls,
    error: null,
  };
}

function usageError(message) {
  const error = new Error(message);
  error.usage = true;
  return error;
}

function cell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');
}

function table(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`),
  ].join('\n');
}

function toMarkdown(result) {
  const parts = [`## sql-tool ${result.command}: ${result.status}`, ''];
  const { input, output } = result;
  const countRows = [
    ['Lines', input.lines],
    ['CREATE TABLE', input.createTables],
    ['INSERT INTO', input.inserts],
  ];
  if (output) {
    parts.push(`Input: \`${input.path}\` (unchanged)`, `Output: \`${output.path}\``, '');
    parts.push(
      table(
        ['Count', 'Input', 'Output'],
        countRows.map(([k, v]) => [
          k,
          v,
          {
            Lines: output.lines,
            'CREATE TABLE': output.createTables,
            'INSERT INTO': output.inserts,
          }[k],
        ])
      ),
      ''
    );
  } else {
    parts.push(`Input: \`${input.path}\``, '', table(['Count', 'Input'], countRows), '');
  }
  if (input.prefixes && input.prefixes.length) {
    const studio = input.studioPrefix ? `; Studio site: \`${input.studioPrefix}\`` : '';
    parts.push(
      `WordPress table prefix: ${input.prefixes.map((p) => `\`${p}\``).join(', ')}${studio}`,
      ''
    );
  }
  if (result.urlReplacement) {
    const plan = result.urlReplacement;
    parts.push('### URL replacement (after import, once the user confirms)', '');
    parts.push(
      table(
        ['From', 'To', 'Links in export'],
        [
          [
            plan.sources.map((h) => `http(s)://(www.)${h}`).join(', '),
            plan.destination,
            plan.occurrences,
          ],
        ]
      ),
      '',
      'Preview on the Studio site, then run again without `--dry-run`:',
      '',
      '```bash',
      plan.command,
      '```',
      ''
    );
  }
  if (result.command === 'tables') {
    const note = {
      core: 'WordPress core',
      users: 'accounts (--keep-users)',
      wordfence: 'Wordfence: left out by default',
      plugin: 'plugin or other',
    };
    parts.push('### Tables', '');
    parts.push(
      table(
        ['Table', 'Group', 'Rows', 'Size (KB)'],
        result.tableList.map((t) => [t.table, note[t.group], t.rows, Math.ceil(t.bytes / 1024)])
      ),
      ''
    );
  }
  if (result.command === 'sanitise') {
    parts.push('### Edits', '');
    parts.push(
      result.edits.length
        ? table(
            ['#', 'Rule', 'Line', 'Table', 'Count', 'Why'],
            result.edits.map((e, i) => [
              i + 1,
              e.rule,
              e.line ?? '',
              e.table || '',
              /^(binary|prefix)-/.test(e.rule) ? e.count : '',
              e.reason,
            ])
          )
        : 'None. The file had none of the known problems.',
      ''
    );
  }
  parts.push('### Findings', '');
  parts.push(
    result.findings.length
      ? table(
          ['Severity', 'Check', 'Line', 'Table', 'Detail', 'Suggested fix'],
          result.findings.map((f) => [
            f.severity,
            f.check,
            f.line ?? '',
            f.table ?? '',
            f.detail,
            f.fix,
          ])
        )
      : 'None.',
    ''
  );
  if (result.siteUrls.length || result.command === 'site-urls') {
    parts.push('### Site URLs', '');
    parts.push(
      result.siteUrls.length
        ? table(
            ['Table', 'Option', 'Value'],
            result.siteUrls.map((u) => [u.table, u.option, u.value])
          )
        : 'None found.',
      ''
    );
  }
  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const USAGE = `Usage: sql-tool <sanitise|preflight|site-urls|tables> <input.sql> [options]

  --out <path>      sanitise: output path (default <input>-sqlite.sql)
  --force           sanitise: overwrite an existing output file (never the input)
  --target <name>   preflight: ${TARGETS.join(' | ')}
  --prefix <prefix> preflight: the target site's table prefix
                    sanitise: rename the export's tables to this prefix
  --keep-wordfence  sanitise: import Wordfence's tables (left out by default)
  --keep-users      sanitise: leave out the export's users and usermeta tables,
                    so the Studio site keeps its own accounts
  --exclude <pattern>
                    sanitise: leave out matching tables (repeatable or
                    comma-separated; * and ? wildcards; with or without prefix)
  --studio-site <path>
                    sanitise, site-urls: the Studio site folder; compares its
                    $table_prefix with the export's
  --json            print the result as JSON
`;

function parseArgs(argv) {
  const args = { command: argv[0], input: null, json: false, force: false };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') args.json = true;
    else if (arg === '--force') args.force = true;
    else if (arg === '--keep-wordfence') args.keepWordfence = true;
    else if (arg === '--keep-users') args.keepUsers = true;
    else if (arg === '--exclude') {
      if (argv[i + 1] === undefined) throw usageError('--exclude needs a value');
      args.exclude = [...(args.exclude || []), ...argv[++i].split(',').filter(Boolean)];
    } else if (['--out', '--target', '--prefix', '--studio-site'].includes(arg)) {
      if (argv[i + 1] === undefined) throw usageError(`${arg} needs a value`);
      args[arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = argv[++i];
    } else if (arg.startsWith('--')) throw usageError(`unknown option ${arg}`);
    else if (!args.input) args.input = arg;
    else throw usageError(`unexpected argument ${arg}`);
  }
  if (!['sanitise', 'preflight', 'site-urls', 'tables'].includes(args.command))
    throw usageError('unknown command');
  if (!args.input) throw usageError('missing input file');
  if (!fs.existsSync(args.input) || !fs.statSync(args.input).isFile())
    throw usageError(`input not found: ${args.input}`);
  if (/\.(gz|zip|bz2|xz)$/i.test(args.input))
    throw usageError('decompress the export to a new .sql file first (for example gunzip -k)');
  return args;
}

function run(argv) {
  let args;
  try {
    args = parseArgs(argv);
    const result =
      args.command === 'sanitise'
        ? sanitise(args.input, {
            out: args.out,
            force: args.force,
            prefix: args.prefix,
            keepWordfence: args.keepWordfence,
            keepUsers: args.keepUsers,
            exclude: args.exclude,
            studioSite: args.studioSite,
          })
        : args.command === 'preflight'
          ? preflight(args.input, { target: args.target, prefix: args.prefix })
          : args.command === 'tables'
            ? tablesCommand(args.input)
            : siteUrlsCommand(args.input, { studioSite: args.studioSite });
    return {
      code: result.status === 'ok' ? EXIT_OK : EXIT_FINDINGS,
      stdout: args.json ? JSON.stringify(result, null, 2) : toMarkdown(result),
    };
  } catch (error) {
    const message = `sql-tool: ${error.message}`;
    if (args && args.json) {
      return {
        code: EXIT_ERROR,
        stdout: JSON.stringify(
          { command: args.command, status: 'error', error: error.message },
          null,
          2
        ),
      };
    }
    return { code: EXIT_ERROR, stderr: error.usage ? `${message}\n\n${USAGE}` : message };
  }
}

if (require.main === module) {
  const { code, stdout, stderr } = run(process.argv.slice(2));
  if (stdout) process.stdout.write(`${stdout}\n`);
  if (stderr) process.stderr.write(`${stderr}\n`);
  process.exitCode = code;
}

module.exports = {
  sanitise,
  preflight,
  siteUrls: siteUrlsCommand,
  tables: tablesCommand,
  run,
  readStatements,
  readLines,
  walkInsertValues,
  toMarkdown,
};
