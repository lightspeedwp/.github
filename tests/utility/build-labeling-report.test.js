// Minimal Jest test for build-labeling-report.js

describe('build-labeling-report', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/utility/build-labeling-report')
        ).not.toThrow();
    });
});
