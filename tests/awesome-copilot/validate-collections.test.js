// Minimal Jest test for validate-collections.js

describe('validate-collections', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/awesome-copilot/validate-collections')
        ).not.toThrow();
    });
});
