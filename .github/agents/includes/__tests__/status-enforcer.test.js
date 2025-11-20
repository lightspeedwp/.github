/**
 * Tests for status-enforcer canonical utility.
 * Moved from `tests/utility/status-enforcer.test.js` to consolidate under agents/includes.
 * TODO: Consider adding negative tests (duplicate status removal) & dry-run scenarios.
 */
const path = require('path');

describe('status-enforcer (canonical)', () => {
    it('loads without error', () => {
        expect(() => require('../status-enforcer')).not.toThrow();
    });

    it('exports expected functions', () => {
        const mod = require('../status-enforcer');
        expect(typeof mod.enforceOneHotStatus).toBe('function');
        expect(typeof mod.applyDefaultStatus).toBe('function');
        expect(typeof mod.applyDefaultPriority).toBe('function');
    });
});
