#!/usr/bin/env node
/**
 * Run Jest with Node's VM modules enabled, on any OS (#3552).
 *
 * `NODE_OPTIONS=--experimental-vm-modules jest` is POSIX shell syntax and
 * fails under npm's default cmd.exe script shell on Windows. This launcher
 * passes the flag to Node directly and resolves Jest wherever it is
 * installed (this package or the repository root). Arguments are passed
 * through unchanged; the exit code is Jest's.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jest = require.resolve('jest/bin/jest');
const result = spawnSync(
  process.execPath,
  ['--experimental-vm-modules', jest, ...process.argv.slice(2)],
  { stdio: 'inherit' }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
