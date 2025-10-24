// Minimal Jest test for sync-version.js

describe('sync-version', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/utility/sync-version')
        ).not.toThrow();
    });
});
