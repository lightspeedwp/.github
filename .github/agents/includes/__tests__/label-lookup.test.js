/**
 * ============================================================================
 * Tests for label-lookup utility functions.
 * Location: .github/agents/includes/__tests__/label-lookup.test.js
 * Description:
 *   - Validates canonical label alias mapping and lookup functionality
 *   - Tests fetchCanonicalLabels, buildLabelAliasMap, and findStandardLabel
 *   - Ensures proper handling of aliases and canonical label resolution
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update when modifying label-lookup functionality
 *   - Add tests for new alias mapping features
 * ============================================================================
 */

const {
    buildLabelAliasMap,
    findStandardLabel,
    fetchCanonicalLabels,
} = require('../label-lookup');
const fs = require('fs');
const path = require('path');

describe('label-lookup utilities', () => {
    describe('buildLabelAliasMap', () => {
        it('builds correct alias mapping from labels data', () => {
            const labelsData = [
                { name: 'lang:php', aliases: ['php', 'PHP'] },
                { name: 'type:bug', aliases: ['bug', 'defect'] },
                { name: 'priority:high' }, // No aliases
            ];

            const aliasMap = buildLabelAliasMap(labelsData);

            expect(aliasMap['php']).toBe('lang:php');
            expect(aliasMap['PHP']).toBe('lang:php');
            expect(aliasMap['bug']).toBe('type:bug');
            expect(aliasMap['defect']).toBe('type:bug');
            expect(aliasMap['priority:high']).toBeUndefined();
        });

        it('handles empty aliases array', () => {
            const labelsData = [
                { name: 'lang:php', aliases: [] },
                { name: 'type:bug' },
            ];

            const aliasMap = buildLabelAliasMap(labelsData);

            expect(Object.keys(aliasMap)).toHaveLength(0);
        });

        it('handles labels without aliases field', () => {
            const labelsData = [{ name: 'lang:php' }, { name: 'type:bug' }];

            const aliasMap = buildLabelAliasMap(labelsData);

            expect(Object.keys(aliasMap)).toHaveLength(0);
        });
    });

    describe('findStandardLabel', () => {
        const labelsData = [
            { name: 'lang:php', aliases: ['php'] },
            { name: 'type:bug', aliases: ['bug', 'defect'] },
        ];
        const aliasMap = buildLabelAliasMap(labelsData);
        const canonicalSet = new Set(['lang:php', 'type:bug']);

        it('returns correct canonical label for an alias', () => {
            expect(findStandardLabel('php', aliasMap, canonicalSet)).toBe(
                'lang:php'
            );
            expect(findStandardLabel('bug', aliasMap, canonicalSet)).toBe(
                'type:bug'
            );
            expect(findStandardLabel('defect', aliasMap, canonicalSet)).toBe(
                'type:bug'
            );
        });

        it('returns canonical label when given canonical label', () => {
            expect(findStandardLabel('lang:php', aliasMap, canonicalSet)).toBe(
                'lang:php'
            );
            expect(findStandardLabel('type:bug', aliasMap, canonicalSet)).toBe(
                'type:bug'
            );
        });

        it('returns null for unknown labels', () => {
            expect(
                findStandardLabel('unknown', aliasMap, canonicalSet)
            ).toBeNull();
            expect(
                findStandardLabel('nonexistent', aliasMap, canonicalSet)
            ).toBeNull();
        });

        it('handles empty alias map', () => {
            const emptyAliasMap = {};
            expect(
                findStandardLabel('php', emptyAliasMap, canonicalSet)
            ).toBeNull();
            expect(
                findStandardLabel('lang:php', emptyAliasMap, canonicalSet)
            ).toBe('lang:php');
        });

        it('handles null alias map', () => {
            expect(findStandardLabel('php', null, canonicalSet)).toBeNull();
            expect(findStandardLabel('lang:php', null, canonicalSet)).toBe(
                'lang:php'
            );
        });
    });

    describe('fetchCanonicalLabels', () => {
        const testLabelsFile = path.join(__dirname, 'test-labels.yml');

        beforeEach(() => {
            // Create test labels file
            const testLabelsContent = `
- name: "type:bug"
  color: "d73a4a"
  aliases: ["bug", "defect"]
- name: "type:feature"
  color: "0075ca"
  aliases: ["feature", "enhancement"]
- "simple-label"
      `.trim();

            fs.writeFileSync(testLabelsFile, testLabelsContent, 'utf8');
        });

        afterEach(() => {
            // Clean up test file
            if (fs.existsSync(testLabelsFile)) {
                fs.unlinkSync(testLabelsFile);
            }
        });

        it('loads canonical labels from YAML file', () => {
            const canonicalLabels = fetchCanonicalLabels(testLabelsFile);

            expect(canonicalLabels.has('type:bug')).toBe(true);
            expect(canonicalLabels.has('type:feature')).toBe(true);
            expect(canonicalLabels.has('simple-label')).toBe(true);
            expect(canonicalLabels.size).toBe(3);
        });

        it('handles mixed string and object label definitions', () => {
            const canonicalLabels = fetchCanonicalLabels(testLabelsFile);

            // Should extract names from objects and include string labels
            expect(canonicalLabels.has('type:bug')).toBe(true);
            expect(canonicalLabels.has('simple-label')).toBe(true);
        });

        it('throws error for nonexistent file', () => {
            expect(() => {
                fetchCanonicalLabels('/nonexistent/labels.yml');
            }).toThrow();
        });
    });

    describe('integration tests', () => {
        it('works with complete workflow', () => {
            const labelsData = [
                { name: 'lang:php', aliases: ['php', 'PHP'] },
                { name: 'type:bug', aliases: ['bug', 'defect'] },
                { name: 'priority:high', aliases: ['urgent', 'critical'] },
                { name: 'size:small' }, // No aliases
            ];

            const aliasMap = buildLabelAliasMap(labelsData);
            const canonicalSet = new Set(labelsData.map((l) => l.name));

            // Test various lookups
            expect(findStandardLabel('php', aliasMap, canonicalSet)).toBe(
                'lang:php'
            );
            expect(findStandardLabel('lang:php', aliasMap, canonicalSet)).toBe(
                'lang:php'
            );
            expect(findStandardLabel('urgent', aliasMap, canonicalSet)).toBe(
                'priority:high'
            );
            expect(
                findStandardLabel('size:small', aliasMap, canonicalSet)
            ).toBe('size:small');
            expect(
                findStandardLabel('nonexistent', aliasMap, canonicalSet)
            ).toBeNull();
        });
    });
});
