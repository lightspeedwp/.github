'use strict';

/**
 * Tells scripts/workflows/jest-read-tracer.cjs which test file is running.
 *
 * Does nothing unless a trace is being recorded. The built-in `fs` module is
 * the same object inside and outside Jest's sandbox, so it carries the name
 * to the tracer. `process.env` is not shared (Jest copies it per test file),
 * so the tracer itself adds the name to the environment of the child processes
 * a test starts.
 */
if (process.env.JEST_READ_TRACE_FILE && process.env.JEST_READ_TRACE_ROOT) {
  const path = require('node:path');
  const testPath = expect.getState().testPath || '';
  const relative = path.relative(process.env.JEST_READ_TRACE_ROOT, testPath).split(path.sep).join('/');
  require('node:fs').__jestCurrentTest = relative;
}
