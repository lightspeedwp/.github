'use strict';

/**
 * Records which repository files the Jest suite touches.
 *
 * Preload it with `NODE_OPTIONS=--require=<this file>`. It does nothing unless
 * JEST_READ_TRACE_FILE and JEST_READ_TRACE_ROOT are set, so it is safe to leave
 * on the command line.
 *
 * Each line of the trace is `<kind>\t<value>`:
 *   F  a file that was read or opened
 *   S  a file that was only checked for existence or metadata
 *   D  a directory that was listed
 *   X  a program other than Node that a test started
 *   T  a test file that read, or checked for, a Markdown or text file
 *   P  a test file and a program other than Node that it started
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
const { promisify } = require('node:util');

const traceFile = process.env.JEST_READ_TRACE_FILE;
const root = process.env.JEST_READ_TRACE_ROOT;

if (traceFile && root && !globalThis.__jestReadTracerInstalled) {
  globalThis.__jestReadTracerInstalled = true;

  const append = fs.appendFileSync.bind(fs);
  const seen = new Set();

  /** The test file that is running, as reported by tests/jest.setup.read-trace.cjs. */
  const currentTest = () => fs.__jestCurrentTest || process.env.JEST_READ_TRACE_TEST || '(outside a test)';

  /**
   * Make a wrapper indistinguishable from the function it replaces: copy every
   * own property, including hidden ones such as `util.promisify.custom`, and
   * wrap that promisified form too so its calls are recorded as well.
   * @param {Function} wrapper
   * @param {Function} original
   * @param {(args: unknown[]) => void} record
   * @param {(args: unknown[]) => unknown[]} [transform] Rewrites the arguments of the promisified form.
   */
  const mirror = (wrapper, original, record, transform = (args) => args) => {
    for (const key of Reflect.ownKeys(original)) {
      if (key === 'length' || key === 'name' || key === 'prototype' || key === promisify.custom) continue;
      Object.defineProperty(wrapper, key, Object.getOwnPropertyDescriptor(original, key));
    }
    const custom = original[promisify.custom];
    if (typeof custom === 'function') {
      Object.defineProperty(wrapper, promisify.custom, {
        configurable: true,
        value: function tracedPromisified(...args) {
          record(args);
          return custom.apply(this, transform(args));
        },
      });
    }
  };

  /** Jest lists every directory while it builds its module map; that is not a test reading it. */
  const fromModuleMap = () => /jest-haste-map|jest-resolve|jest-config/.test(new Error().stack || '');

  /**
   * Jest's crawl stats every file in the repository. Only the crawl is ignored for
   * existence checks: a test that resolves a path ending in .md or .txt goes through
   * jest-resolve, and that check is a real dependency.
   */
  const fromJestCrawl = () => /jest-haste-map/.test(new Error().stack || '');

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
      // Jest's own crawl lists and stats every file; that is not a test depending on it.
      if (kind === 'D' && fromModuleMap()) return;
      if (kind === 'S' && fromJestCrawl()) return;
      write(kind, relative === '' ? '.' : relative);
      // A test that only checks whether a prose file exists still depends on it:
      // deleting or adding the file changes its result.
      if ((kind === 'F' || kind === 'S') && /\.(md|mdx|txt)$/.test(relative)) write('T', currentTest());
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
    mirror(owner[name], original, (args) => recordPath(kind, args[0]));
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

  /**
   * Hand the running test's name to a child process.
   *
   * Jest gives each test file its own copy of `process.env`, so a name set there
   * never reaches the host process, and a child started without `options.env`
   * inherits the host's. This runs in the host, so it can add the name to the
   * environment the child receives, which lets a Node child's reads be attributed.
   *
   * @param {string} name Which child_process function is being called.
   * @param {unknown[]} rest The call's arguments after the command.
   * @returns {unknown[]} The arguments, with the test name in the environment.
   */
  const withTestEnv = (name, rest) => {
    try {
      const test = currentTest();
      if (test === '(outside a test)') return rest;
      const isOptions = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
      const args = rest.slice();
      const callback = typeof args[args.length - 1] === 'function' ? args.pop() : undefined;
      const hasArgsList = ['spawn', 'spawnSync', 'execFile', 'execFileSync', 'fork'].includes(name);
      // Where the options object sits. With an argument list the options follow
      // it, whether the list is an array, null or undefined; without one (exec,
      // execSync) they come first. A call shaped any other way is left alone.
      let index = 0;
      if (hasArgsList && args.length > 0 && !isOptions(args[0])) index = 1;
      if (index === 1 && args[0] != null && !Array.isArray(args[0])) return rest;
      if (index === 0 && args.length > 0 && args[0] != null && !isOptions(args[0])) return rest;
      if (index === 1 && args[1] != null && !isOptions(args[1])) return rest;
      const options = { __proto__: null, ...(isOptions(args[index]) ? args[index] : {}) };
      // Copy inherited enumerable keys too: Node builds a child's environment that
      // way, so `Object.create(process.env)` is a complete environment.
      const source = options.env || process.env;
      const env = {};
      for (const key in source) env[key] = source[key];
      // Keep a name the caller set on purpose, meaning one that differs from the
      // name this process inherited. A copy of the inherited environment carries
      // the inherited name, which the current test replaces.
      const explicit = env.JEST_READ_TRACE_TEST !== undefined && env.JEST_READ_TRACE_TEST !== process.env.JEST_READ_TRACE_TEST;
      if (!explicit) env.JEST_READ_TRACE_TEST = test;
      options.env = env;
      args[index] = options;
      return callback ? [...args, callback] : args;
    } catch {
      return rest;
    }
  };

  const nodeNames = new Set(['node', path.basename(process.execPath)]);
  for (const name of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) {
    const original = childProcess[name];
    if (typeof original !== 'function') continue;
    const recordProgram = (command) => {
      try {
        // fork always starts Node, and its first argument is a module, not a program.
        if (name === 'fork') return;
        const program = path.basename(String(command).trim().split(/\s+/)[0] || '');
        if (program && !nodeNames.has(program)) {
          write('X', program);
          write('P', `${currentTest()}\t${program}`);
        }
      } catch {
        // Never let tracing change behaviour.
      }
    };
    /** Record the program, then add the running test's name to the call's environment. */
    const prepare = (args) => {
      recordProgram(args[0]);
      return [args[0], ...withTestEnv(name, args.slice(1))];
    };
    childProcess[name] = function tracedChildProcess(...args) {
      return original.apply(this, prepare(args));
    };
    // Node's promisified exec and execFile call the original functions, not
    // these wrappers, so the promisified form gets the same preparation.
    mirror(childProcess[name], original, () => {}, prepare);
  }

  syncBuiltinESMExports();
}
