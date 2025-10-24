// Minimal Jest test for fetch-canonical-labels.js

describe('fetch-canonical-labels', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/utility/fetch-canonical-labels')
        ).not.toThrow();
    });
});
