/**
 * Tests for sync-version utility (shim remains in scripts/utility).
 * Moved from `tests/utility/sync-version.test.js`.
 * TODO: Expand with assertions validating semantic version sync behavior.
 */

// NOTE: do NOT mock fs.readFileSync around the require below. Jest's
// coverage instrumentation reads the source file through fs itself, so a
// global readFileSync mock breaks module loading with an obscure
// `transformSync is not a function` error. This module is side-effect
// free on load (execution is guarded by `require.main === module`), so a
// plain top-level require is safe.
const syncVersion = require("../sync-version.js");

describe("sync-version (canonical includes)", () => {
  it("loads without error", () => {
    expect(typeof syncVersion).toBe("function");
  });
});
