'use strict';

/**
 * Records which repository files the Jest suite touches.
 *
 * Preload it with `NODE_OPTIONS=--require=<this file>`. It does nothing unless
 * JEST_READ_TRACE_FILE and JEST_READ_TRACE_ROOT are set, so it is safe to leave
 * on the command line.
 *
 * Each line of the trace is `<kind>\t<value>`:
 *   F  a file that was read, opened or checked for existence
 *   D  a directory that was listed
 *   X  a program other than Node that a test started
 *
 * Node child processes inherit NODE_OPTIONS and are traced too. Other child
 * processes are not, which is why they are recorded as X: what they read is
 * unknown to this tracer.
 *
 * @module scripts/workflows/jest-read-tracer
 */

const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');
const { fileURLToPath } = require('node:url');
const { syncBuiltinESMExports } = require('node:module');

const traceFile = process.env.JEST_READ_TRACE_FILE;
const root = process.env.JEST_READ_TRACE_ROOT;

if (traceFile && root && !globalThis.__jestReadTracerInstalled) {
  globalThis.__jestReadTracerInstalled = true;

  const append = fs.appendFileSync.bind(fs);
  const seen = new Set();

  /** The test file that is running, as reported by tests/jest.setup.read-trace.cjs. */
  const currentTest = () => fs.__jestCurrentTest || process.env.JEST_READ_TRACE_TEST || '(outside a test)';

  /** Jest lists every directory while it builds its module map; that is not a test reading it. */
  const fromModuleMap = () => /jest-haste-map|jest-resolve|jest-config/.test(new Error().stack || '');

  /**
   * @param {'F'|'D'|'X'} kind
   * @param {string} value
   */
  const write = (kind, value) => {
    const key = `${kind}\t${value}`;
    if (seen.has(key)) return;
    seen.add(key);
    try {
      append(traceFile, `${key}\n`);
    } catch {
      // A trace that cannot be written must not break the tests.
    }
  };

  /**
   * @param {'F'|'D'} kind
   * @param {unknown} target
   */
  const recordPath = (kind, target) => {
    try {
      let value;
      if (typeof target === 'string') value = target;
      else if (Buffer.isBuffer(target)) value = target.toString();
      else if (target instanceof URL) value = fileURLToPath(target);
      else return;
      const absolute = path.resolve(value);
      if (absolute !== root && !absolute.startsWith(root + path.sep)) return;
      const relative = absolute.slice(root.length + 1).split(path.sep).join('/');
      if (relative === '' && kind === 'F') return;
      if (/^(node_modules|\.git|coverage)(\/|$)/.test(relative)) return;
      if (kind === 'D' && fromModuleMap()) return;
      write(kind, relative === '' ? '.' : relative);
      if (kind === 'F' && /\.(md|mdx|txt)$/.test(relative)) write('T', currentTest());
    } catch {
      // Never let tracing change behaviour.
    }
  };

  /**
   * @param {object} owner
   * @param {string} name
   * @param {'F'|'D'} kind
   */
  const wrapPath = (owner, name, kind) => {
    const original = owner[name];
    if (typeof original !== 'function') return;
    owner[name] = function tracedPathCall(target, ...rest) {
      recordPath(kind, target);
      return original.call(this, target, ...rest);
    };
    Object.assign(owner[name], original);
  };

  const readCalls = ['readFile', 'open'];
  const statCalls = ['stat', 'lstat', 'access', 'realpath'];
  const listCalls = ['readdir', 'opendir'];
  for (const name of readCalls) {
    wrapPath(fs, name, 'F');
    wrapPath(fs, `${name}Sync`, 'F');
    wrapPath(fs.promises, name, 'F');
  }
  for (const name of statCalls) {
    wrapPath(fs, name, 'S');
    wrapPath(fs, `${name}Sync`, 'S');
    wrapPath(fs.promises, name, 'S');
  }
  for (const name of listCalls) {
    wrapPath(fs, name, 'D');
    wrapPath(fs, `${name}Sync`, 'D');
    wrapPath(fs.promises, name, 'D');
  }
  wrapPath(fs, 'existsSync', 'S');
  wrapPath(fs, 'createReadStream', 'F');

  const nodeNames = new Set(['node', path.basename(process.execPath)]);
  for (const name of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync']) {
    const original = childProcess[name];
    if (typeof original !== 'function') continue;
    childProcess[name] = function tracedChildProcess(command, ...rest) {
      try {
        const program = path.basename(String(command).trim().split(/\s+/)[0] || '');
        if (program && !nodeNames.has(program)) {
          write('X', program);
          write('P', `${currentTest()}\t${program}`);
        }
      } catch {
        // Never let tracing change behaviour.
      }
      return original.call(this, command, ...rest);
    };
    Object.assign(childProcess[name], original);
  }

  syncBuiltinESMExports();
}
