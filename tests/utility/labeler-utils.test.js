// Minimal Jest test for labeler-utils.js

describe('labeler-utils', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/utility/labeler-utils')
        ).not.toThrow();
    });
});
