/**
 * Tests for sync-version utility (shim remains in scripts/utility).
 * Moved from `tests/utility/sync-version.test.js`.
 * TODO: Expand with assertions validating semantic version sync behavior.
 */
describe('sync-version (canonical includes)', () => {
    it('loads without error', () => {
        expect(() => require('../sync-version.js')).not.toThrow();
    });
});
