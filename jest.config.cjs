// Auto-discovered entry point for bare `jest` invocations.
//
// Jest discovers this file because of its name — "The file will be discovered
// automatically, if it is named jest.config.js|ts|mjs|mts|cjs|cts|json"
// (https://jestjs.io/docs/configuration, read 2026-10-01). Without it, a bare
// `npx jest` finds no configuration at all and falls back to Jest's built-in
// defaults, which run test files this repository deliberately excludes,
// including those under `.jest-skip/` and suites under `scripts/release`,
// `scripts/automation` and `scripts/workflows` that have their own runners.
//
// `.jest.config.cjs` holds the intended configuration and stays the single
// source of truth. This file only forwards to it, so the two cannot drift.
// The npm scripts pass `--config .jest.config.cjs` explicitly, and Jest skips
// auto-discovery when --config is given, so the two entry points never both
// apply.
//
// CommonJS is required: the root package.json is "type": "module", so a .js
// file here would be read as an ES module and `module.exports` would throw
// "module is not defined in ES module scope" — the failure that made the
// previous root jest.config.js unusable.
//
// rootDir is unaffected. Jest defaults it to "the root of the directory
// containing your Jest config file", which is this directory, so the
// `<rootDir>` tokens inside .jest.config.cjs resolve exactly as before.
module.exports = require('./.jest.config.cjs');
