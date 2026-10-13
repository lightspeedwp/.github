#!/usr/bin/env node
/**
 * sql-tool: byte-safe helpers for moving WordPress databases between MySQL
 * hosts and WordPress Studio (SQLite Database Integration).
 *
 *   sanitise  <input.sql>  Apply the known MySQL-to-Studio fixes, scan for risks.
 *   preflight <input.sql>  Check a Studio export before importing it into MySQL.
 *   site-urls <input.sql>  Report siteurl/home from every *_options table.
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
  summary.prefixes = [
    ...new Set(
      summary.tables.filter((t) => /_options$/.test(t)).map((t) => t.replace(/options$/, ''))
    ),
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

  const beforeHash = crypto.createHash('sha256');
  const summary = newSummary(input);
  const outSummary = { path: out, bytes: 0, lines: 0, createTables: 0, inserts: 0 };
  const tables = new Map();
  const edits = [];
  const findings = [];
  const siteUrls = [];
  const partial = `${out}.partial`;
  const fd = fs.openSync(partial, 'w');

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

      const subject = kind === 'comment' ? statement.text : h;
      const removal = REMOVAL_RULES.find((r) => r.test.test(subject));
      if (removal) {
        const line =
          statement.line + lineOffset(statement.text, statement.text.length - subject.length);
        edits.push({ rule: removal.rule, line, table: null, count: 1, reason: removal.reason });
        continue;
      }

      findings.push(...riskFindings(statement, kind, 'warn'));
      let text = statement.text;

      if (kind === 'create-table') {
        const parsed = parseCreateTable(text);
        summary.createTables += 1;
        outSummary.createTables += 1;
        if (parsed) {
          tables.set(parsed.table, parsed);
          summary.tables.push(parsed.table);
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
  if (outSummary.createTables !== summary.createTables)
    verificationErrors.push('CREATE TABLE counts differ');
  if (outSummary.inserts !== summary.inserts) verificationErrors.push('INSERT counts differ');
  if (hashFile(input) !== beforeDigest)
    verificationErrors.push('the input file changed during the run');
  if (verificationErrors.length) {
    fs.rmSync(partial, { force: true });
    throw new Error(`verification failed: ${verificationErrors.join('; ')}`);
  }
  fs.renameSync(partial, out);

  const hasUsers = summary.tables.some((t) => /_users$/.test(t));
  findings.push(...postImportNotes(siteUrls, hasUsers));

  return envelope('sanitise', summary, outSummary, edits, findings, siteUrls);
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

  for (const statement of readStatements(readLines(input))) {
    summary.lines += countLines(statement.text);
    const kind = kindOf(statement.text);
    const h = head(statement.text);
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
function siteUrlsCommand(input) {
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
  return envelope('site-urls', summary, null, [], findings, siteUrls);
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
  if (result.command === 'sanitise') {
    parts.push('### Edits', '');
    parts.push(
      result.edits.length
        ? table(
            ['#', 'Rule', 'Line', 'Table', 'Literals', 'Why'],
            result.edits.map((e, i) => [
              i + 1,
              e.rule,
              e.line,
              e.table || '',
              e.rule === 'binary-literal' ? e.count : '',
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

const USAGE = `Usage: sql-tool <sanitise|preflight|site-urls> <input.sql> [options]

  --out <path>      sanitise: output path (default <input>-sqlite.sql)
  --force           sanitise: overwrite an existing output file (never the input)
  --target <name>   preflight: ${TARGETS.join(' | ')}
  --prefix <prefix> preflight: the target site's table prefix
  --json            print the result as JSON
`;

function parseArgs(argv) {
  const args = { command: argv[0], input: null, json: false, force: false };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') args.json = true;
    else if (arg === '--force') args.force = true;
    else if (['--out', '--target', '--prefix'].includes(arg)) {
      if (argv[i + 1] === undefined) throw usageError(`${arg} needs a value`);
      args[arg.slice(2)] = argv[++i];
    } else if (arg.startsWith('--')) throw usageError(`unknown option ${arg}`);
    else if (!args.input) args.input = arg;
    else throw usageError(`unexpected argument ${arg}`);
  }
  if (!['sanitise', 'preflight', 'site-urls'].includes(args.command))
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
        ? sanitise(args.input, { out: args.out, force: args.force })
        : args.command === 'preflight'
          ? preflight(args.input, { target: args.target, prefix: args.prefix })
          : siteUrlsCommand(args.input);
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
  run,
  readStatements,
  readLines,
  walkInsertValues,
  toMarkdown,
};
