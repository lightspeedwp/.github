// Minimal Jest test for label-reporting.js

describe('label-reporting', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/utility/label-reporting')
        ).not.toThrow();
    });
});
