/**
 * ============================================================================
 * Tests for label-lookup utility functions.
 * Location: tests/utility/label-lookup.test.js
 * Description:
 *   - Validates canonical label alias mapping and lookup.
 *   - Uses shared helpers: setTestEnv, resetTestEnv.
 *   - Coverage: findStandardLabel returns canonical labels or null, alias mapping.
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock with coverage or helper usage changes.
 * ============================================================================
 */

const { setTestEnv, resetTestEnv } = require('./test-helpers');
const {
    buildLabelAliasMap,
    findStandardLabel,
} = require('../../scripts/utility/label-lookup');

describe('label-lookup.js', () => {
    beforeAll(() => setTestEnv({ GITHUB_TOKEN: 'test' }));
    afterAll(() => resetTestEnv(['GITHUB_TOKEN']));

    /**
     * Tests canonical label alias mapping.
     */
    test('finds canonical label for direct and alias match', () => {
        const labels = [{ name: 'lang:php' }, { name: 'type:bug' }];
        const aliasMap = buildLabelAliasMap(labels);
        expect(findStandardLabel('lang:php', aliasMap)).toBe('lang:php');
        expect(findStandardLabel('php', aliasMap)).toBe('lang:php');
        expect(findStandardLabel('bug', aliasMap)).toBe('type:bug');
        expect(findStandardLabel('foobar', aliasMap)).toBeNull();
    });
});
