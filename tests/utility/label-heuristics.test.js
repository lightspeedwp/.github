// Minimal Jest test for label-heuristics.js

describe('label-heuristics', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/utility/label-heuristics')
        ).not.toThrow();
    });
});
