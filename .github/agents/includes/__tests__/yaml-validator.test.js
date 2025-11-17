/**
 * ============================================================================
 * Tests for yaml-validator utility functions
 * Location: .github/agents/includes/__tests__/yaml-validator.test.js
 * Description:
 *   - Tests YAML schema validation for labeling configuration files
 *   - Covers labels.yml, issue-types.yml, and labeler.yml validation
 * Standards:
 *   - Follows LightSpeedWP Coding Standards
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const {
    validateLabelsYml,
    validateIssueTypesYml,
    validateLabelerYml,
    validateAllConfigs,
    validateSchema,
    LABELS_SCHEMA,
    ISSUE_TYPES_SCHEMA,
    LABELER_SCHEMA,
} = require('../yaml-validator');

// Mock @actions/core
jest.mock('@actions/core', () => ({
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
}));

const core = require('@actions/core');

describe('yaml-validator.js', () => {
    const tempDir = path.join(__dirname, '.temp-yaml-validation');

    beforeAll(() => {
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
    });

    afterAll(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validateSchema', () => {
        test('validates basic type checking', () => {
            const schema = { type: 'string' };
            expect(validateSchema('test', schema)).toEqual([]);
            expect(validateSchema(123, schema)).toContainEqual(
                expect.stringContaining("Expected type 'string'")
            );
        });

        test('validates array type', () => {
            const schema = { type: 'array', items: { type: 'string' } };
            expect(validateSchema(['a', 'b'], schema)).toEqual([]);
            expect(validateSchema('not-array', schema)).toContainEqual(
                expect.stringContaining('Expected array')
            );
        });

        test('validates object with required properties', () => {
            const schema = {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string' },
                },
            };

            expect(validateSchema({ name: 'test' }, schema)).toEqual([]);
            expect(validateSchema({}, schema)).toContainEqual(
                expect.stringContaining("Missing required property 'name'")
            );
        });

        test('validates string patterns', () => {
            const schema = { type: 'string', pattern: '^[0-9A-Fa-f]{6}$' };

            expect(validateSchema('FF0000', schema)).toEqual([]);
            expect(validateSchema('ZZZZZZ', schema)).toContainEqual(
                expect.stringContaining("doesn't match pattern")
            );
        });

        test('validates string minimum length', () => {
            const schema = { type: 'string', minLength: 3 };

            expect(validateSchema('test', schema)).toEqual([]);
            expect(validateSchema('ab', schema)).toContainEqual(
                expect.stringContaining('less than minimum')
            );
        });

        test('validates oneOf schemas', () => {
            const schema = {
                type: 'array',
                items: {
                    oneOf: [
                        { type: 'string' },
                        {
                            type: 'object',
                            required: ['name'],
                            properties: { name: { type: 'string' } },
                        },
                    ],
                },
            };

            expect(validateSchema(['string', { name: 'obj' }], schema)).toEqual(
                []
            );
            expect(validateSchema([123], schema)).toContainEqual(
                expect.stringContaining("doesn't match any allowed schema")
            );
        });
    });

    describe('validateLabelsYml', () => {
        test('validates correct simple labels', () => {
            const validLabels = ['bug', 'enhancement', 'documentation'];
            const filePath = path.join(tempDir, 'labels-simple.yml');
            fs.writeFileSync(filePath, yaml.dump(validLabels));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(core.info).toHaveBeenCalledWith(
                expect.stringContaining('✅ labels.yml is valid')
            );
        });

        test('validates correct label objects with all properties', () => {
            const validLabels = [
                {
                    name: 'bug',
                    color: 'FF0000',
                    description: 'Bug report',
                    aliases: ['defect', 'issue'],
                },
                {
                    name: 'enhancement',
                    color: '00FF00',
                    description: 'Enhancement',
                },
            ];
            const filePath = path.join(tempDir, 'labels-objects.yml');
            fs.writeFileSync(filePath, yaml.dump(validLabels));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        test('rejects label object without required name', () => {
            const invalidLabels = [
                {
                    color: 'FF0000',
                    description: 'No name',
                },
            ];
            const filePath = path.join(tempDir, 'labels-no-name.yml');
            fs.writeFileSync(filePath, yaml.dump(invalidLabels));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        test('rejects invalid hex color code', () => {
            const invalidLabels = [
                {
                    name: 'bug',
                    color: 'ZZZZZZ', // Invalid hex
                },
            ];
            const filePath = path.join(tempDir, 'labels-invalid-color.yml');
            fs.writeFileSync(filePath, yaml.dump(invalidLabels));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.stringContaining("doesn't match pattern")
            );
        });

        test('handles non-existent file', () => {
            const result = validateLabelsYml('/nonexistent/labels.yml');

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(core.error).toHaveBeenCalled();
        });

        test('handles invalid YAML syntax', () => {
            const filePath = path.join(tempDir, 'labels-invalid-yaml.yml');
            fs.writeFileSync(filePath, 'invalid: yaml: content: [');

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('validateIssueTypesYml', () => {
        test('validates correct issue types', () => {
            const validTypes = {
                issue_types: [
                    { name: 'Bug', label: 'type:bug', color: 'FF0000' },
                    { name: 'Feature', label: 'type:feature' },
                ],
            };
            const filePath = path.join(tempDir, 'issue-types-valid.yml');
            fs.writeFileSync(filePath, yaml.dump(validTypes));

            const result = validateIssueTypesYml(filePath);

            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(core.info).toHaveBeenCalledWith(
                expect.stringContaining('✅ issue-types.yml is valid')
            );
        });

        test('rejects missing issue_types key', () => {
            const invalid = { types: [] }; // Wrong key
            const filePath = path.join(tempDir, 'issue-types-wrong-key.yml');
            fs.writeFileSync(filePath, yaml.dump(invalid));

            const result = validateIssueTypesYml(filePath);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.stringContaining("Missing required property 'issue_types'")
            );
        });

        test('rejects issue type without required fields', () => {
            const invalid = {
                issue_types: [
                    { name: 'Bug' }, // Missing label
                ],
            };
            const filePath = path.join(tempDir, 'issue-types-no-label.yml');
            fs.writeFileSync(filePath, yaml.dump(invalid));

            const result = validateIssueTypesYml(filePath);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.stringContaining("Missing required property 'label'")
            );
        });

        test('rejects empty name or label', () => {
            const invalid = {
                issue_types: [
                    { name: '', label: 'type:bug' }, // Empty name
                ],
            };
            const filePath = path.join(tempDir, 'issue-types-empty.yml');
            fs.writeFileSync(filePath, yaml.dump(invalid));

            const result = validateIssueTypesYml(filePath);

            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.stringContaining('less than minimum')
            );
        });
    });

    describe('validateLabelerYml', () => {
        test('validates correct labeler rules', () => {
            const validRules = {
                'type:feature': {
                    'head-branch': ['^feat/.*'],
                },
                'area:core': {
                    'changed-files': {
                        'any-glob-to-any-file': ['src/core/**/*.js'],
                    },
                },
            };
            const filePath = path.join(tempDir, 'labeler-valid.yml');
            fs.writeFileSync(filePath, yaml.dump(validRules));

            const result = validateLabelerYml(filePath);

            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(core.info).toHaveBeenCalledWith(
                expect.stringContaining('✅ labeler.yml is valid')
            );
        });

        test('accepts various changed-files configurations', () => {
            const validRules = {
                'test-label': {
                    'changed-files': {
                        'any-glob-to-any-file': ['**/*.test.js'],
                        'all-globs-to-all-files': ['**/*.js', '!**/*.test.js'],
                        'any-glob-to-all-files': ['src/**/*.js'],
                    },
                },
            };
            const filePath = path.join(tempDir, 'labeler-changed-files.yml');
            fs.writeFileSync(filePath, yaml.dump(validRules));

            const result = validateLabelerYml(filePath);

            expect(result.valid).toBe(true);
        });

        test('handles empty labeler file', () => {
            const filePath = path.join(tempDir, 'labeler-empty.yml');
            fs.writeFileSync(filePath, yaml.dump({}));

            const result = validateLabelerYml(filePath);

            expect(result.valid).toBe(true);
            expect(core.info).toHaveBeenCalledWith(
                expect.stringContaining('0 label rules')
            );
        });
    });

    describe('validateAllConfigs', () => {
        test('validates all configs when all are valid', () => {
            // Create valid files
            const labelsPath = path.join(tempDir, 'all-labels.yml');
            const issueTypesPath = path.join(tempDir, 'all-issue-types.yml');
            const labelerPath = path.join(tempDir, 'all-labeler.yml');

            fs.writeFileSync(labelsPath, yaml.dump(['bug', 'feature']));
            fs.writeFileSync(
                issueTypesPath,
                yaml.dump({
                    issue_types: [{ name: 'Bug', label: 'type:bug' }],
                })
            );
            fs.writeFileSync(
                labelerPath,
                yaml.dump({ 'type:bug': { 'head-branch': ['^fix/'] } })
            );

            const result = validateAllConfigs({
                labelsPath,
                issueTypesPath,
                labelerPath,
            });

            expect(result.valid).toBe(true);
            expect(result.results.labels.valid).toBe(true);
            expect(result.results.issueTypes.valid).toBe(true);
            expect(result.results.labeler.valid).toBe(true);
            expect(core.info).toHaveBeenCalledWith(
                expect.stringContaining('✅ All configuration files are valid')
            );
        });

        test('reports failures when any config is invalid', () => {
            // Create one invalid file
            const labelsPath = path.join(tempDir, 'all-invalid-labels.yml');
            const issueTypesPath = path.join(
                tempDir,
                'all-valid-issue-types.yml'
            );
            const labelerPath = path.join(tempDir, 'all-valid-labeler.yml');

            fs.writeFileSync(labelsPath, 'invalid: yaml: [');
            fs.writeFileSync(
                issueTypesPath,
                yaml.dump({
                    issue_types: [{ name: 'Bug', label: 'type:bug' }],
                })
            );
            fs.writeFileSync(labelerPath, yaml.dump({}));

            const result = validateAllConfigs({
                labelsPath,
                issueTypesPath,
                labelerPath,
            });

            expect(result.valid).toBe(false);
            expect(result.results.labels.valid).toBe(false);
            expect(result.results.issueTypes.valid).toBe(true);
            expect(result.results.labeler.valid).toBe(true);
            expect(core.error).toHaveBeenCalledWith(
                expect.stringContaining(
                    '❌ Some configuration files have validation errors'
                )
            );
        });
    });

    describe('edge cases and error handling', () => {
        test('handles mixed string and object labels', () => {
            const mixed = [
                'simple-label',
                { name: 'complex-label', color: 'FF0000' },
            ];
            const filePath = path.join(tempDir, 'labels-mixed.yml');
            fs.writeFileSync(filePath, yaml.dump(mixed));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(true);
        });

        test('handles very long label names', () => {
            const long = [{ name: 'a'.repeat(1000), color: 'FF0000' }];
            const filePath = path.join(tempDir, 'labels-long.yml');
            fs.writeFileSync(filePath, yaml.dump(long));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(true); // minLength but no maxLength
        });

        test('handles special characters in label names', () => {
            const special = [
                'label-with-dashes',
                'label:with:colons',
                'label_with_underscores',
                'label.with.dots',
            ];
            const filePath = path.join(tempDir, 'labels-special.yml');
            fs.writeFileSync(filePath, yaml.dump(special));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(true);
        });

        test('validates hex colors in various cases', () => {
            const colors = [
                { name: 'lower', color: 'ff0000' }, // lowercase
                { name: 'upper', color: 'FF0000' }, // uppercase
                { name: 'mixed', color: 'Ff0000' }, // mixed case
            ];
            const filePath = path.join(tempDir, 'labels-colors.yml');
            fs.writeFileSync(filePath, yaml.dump(colors));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(true);
        });

        test('rejects hex colors with wrong length', () => {
            const invalid = [
                { name: 'short', color: 'FFF' }, // Too short
                { name: 'long', color: 'FF00000' }, // Too long
            ];
            const filePath = path.join(tempDir, 'labels-color-length.yml');
            fs.writeFileSync(filePath, yaml.dump(invalid));

            const result = validateLabelsYml(filePath);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });
});
