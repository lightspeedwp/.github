// Minimal Jest test for label-sync.js

describe('label-sync', () => {
    it('should load without error', () => {
        expect(() => require('../../scripts/utility/label-sync')).not.toThrow();
    });
});
