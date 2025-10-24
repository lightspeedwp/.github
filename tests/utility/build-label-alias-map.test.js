// Minimal Jest test for build-label-alias-map.js

describe('build-label-alias-map', () => {
    it('should load without error', () => {
        expect(() =>
            require('../../scripts/utility/build-label-alias-map')
        ).not.toThrow();
    });
});
