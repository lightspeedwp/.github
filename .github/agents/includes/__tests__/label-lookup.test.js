/**
 * ============================================================================
 * Tests for label-lookup utility functions
 * Location: .github/agents/includes/__tests__/label-lookup.test.js
 * Description:
 *   - Tests label lookup functions: fetchCanonicalLabels, buildLabelAliasMap, findStandardLabel
 *   - Uses shared helpers for consistent testing patterns
 *   - Coverage: label matching, alias resolution, canonical label lookup
 * Standards:
 *   - Follows [LightSpeedWP Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - Org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 * Contribution:
 *   - Update docblock when expanding coverage or adding new helpers
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const {
    fetchCanonicalLabels,
    buildLabelAliasMap,
    findStandardLabel,
} = require('../label-lookup');

describe('label-lookup.js', () => {
    // Mock label data similar to your type-lookup pattern
    const mockLabels = [
        { name: 'Bug', label: 'type:bug', aliases: ['bug', 'issue', 'defect'] },
        {
            name: 'Feature',
            label: 'type:feature',
            aliases: ['feature', 'enhancement'],
        },
        {
            name: 'Documentation',
            label: 'area:docs',
            aliases: ['docs', 'documentation'],
        },
        { name: 'PHP', label: 'lang:php', aliases: ['php'] },
    ];

    describe('buildLabelMap', () => {
        test('builds correct label mapping', () => {
            const labelMap = buildLabelMap(mockLabels);
            expect(labelMap).toHaveProperty('type:bug');
            expect(labelMap).toHaveProperty('type:feature');
            expect(labelMap).toHaveProperty('area:docs');
        });

        test('includes aliases in mapping', () => {
            const labelMap = buildLabelMap(mockLabels);
            expect(labelMap.bug).toBe('type:bug');
            expect(labelMap.feature).toBe('type:feature');
            expect(labelMap.docs).toBe('area:docs');
        });
    });

    describe('findLabel', () => {
        const labelMap = buildLabelMap(mockLabels);

        test('finds labels by exact match', () => {
            expect(findLabel('type:bug', labelMap)).toBe('type:bug');
            expect(findLabel('type:feature', labelMap)).toBe('type:feature');
        });

        test('finds labels by alias', () => {
            expect(findLabel('bug', labelMap)).toBe('type:bug');
            expect(findLabel('feature', labelMap)).toBe('type:feature');
            expect(findLabel('docs', labelMap)).toBe('area:docs');
        });

        test('returns null for unknown labels', () => {
            expect(findLabel('unknown', labelMap)).toBeNull();
            expect(findLabel('nonexistent', labelMap)).toBeNull();
        });

        test('handles case insensitive matching', () => {
            expect(findLabel('BUG', labelMap)).toBe('type:bug');
            expect(findLabel('Feature', labelMap)).toBe('type:feature');
            expect(findLabel('DOCS', labelMap)).toBe('area:docs');
        });
    });

    describe('normalizeLabelName', () => {
        test('normalizes label names correctly', () => {
            expect(normalizeLabelName('Bug Report')).toBe('bug-report');
            expect(normalizeLabelName('Feature Request')).toBe(
                'feature-request'
            );
            expect(normalizeLabelName('DOCUMENTATION')).toBe('documentation');
        });

        test('handles special characters', () => {
            expect(normalizeLabelName('C# Language')).toBe('c-language');
            expect(normalizeLabelName('Node.js')).toBe('node-js');
        });

        test('handles empty and null inputs', () => {
            expect(normalizeLabelName('')).toBe('');
            expect(normalizeLabelName(null)).toBe('');
            expect(normalizeLabelName(undefined)).toBe('');
        });
    });

    describe('findLabelByAlias', () => {
        test('finds labels using multiple alias strategies', () => {
            const labelMap = buildLabelMap(mockLabels);

            // Test direct alias matching
            expect(findLabelByAlias('bug', mockLabels)).toBe('type:bug');
            expect(findLabelByAlias('enhancement', mockLabels)).toBe(
                'type:feature'
            );

            // Test case insensitive
            expect(findLabelByAlias('BUG', mockLabels)).toBe('type:bug');
            expect(findLabelByAlias('PHP', mockLabels)).toBe('lang:php');
        });

        test('returns null for unmatched aliases', () => {
            expect(findLabelByAlias('xyz', mockLabels)).toBeNull();
            expect(findLabelByAlias('unknown', mockLabels)).toBeNull();
        });
    });

    describe('edge cases and error handling', () => {
        test('handles empty label arrays', () => {
            const emptyMap = buildLabelMap([]);
            expect(Object.keys(emptyMap)).toHaveLength(0);
        });

        test('handles malformed label objects', () => {
            const malformedLabels = [
                { name: 'Valid', label: 'valid:label' },
                { name: null, label: 'invalid' },
                { label: 'missing-name' },
                null,
                undefined,
            ];

            const labelMap = buildLabelMap(malformedLabels);
            expect(labelMap['valid:label']).toBe('valid:label');
        });

        test('handles duplicate labels gracefully', () => {
            const duplicateLabels = [
                { name: 'Bug', label: 'type:bug' },
                { name: 'Bug Duplicate', label: 'type:bug' },
            ];

            const labelMap = buildLabelMap(duplicateLabels);
            expect(labelMap['type:bug']).toBe('type:bug');
        });
    });

    describe('integration with label-lookup utility patterns', () => {
        test('works with real-world GitHub label patterns', () => {
            const githubLabels = [
                { name: 'good first issue', label: 'good-first-issue' },
                { name: 'help wanted', label: 'help-wanted' },
                { name: 'wontfix', label: 'wontfix' },
            ];

            const labelMap = buildLabelMap(githubLabels);
            expect(findLabel('good-first-issue', labelMap)).toBe(
                'good-first-issue'
            );
            expect(findLabel('help-wanted', labelMap)).toBe('help-wanted');
        });

        test('handles WordPress-specific label patterns', () => {
            const wpLabels = [
                { name: 'WordPress Core', label: 'component:wordpress-core' },
                { name: 'Gutenberg', label: 'component:gutenberg' },
                { name: 'Theme', label: 'component:theme' },
            ];

            const labelMap = buildLabelMap(wpLabels);
            expect(findLabel('component:wordpress-core', labelMap)).toBe(
                'component:wordpress-core'
            );
        });
    });
});
