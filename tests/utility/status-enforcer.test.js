// Minimal Jest test for status-enforcer.js

describe('status-enforcer', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/utility/status-enforcer')
        ).not.toThrow();
    });
});
