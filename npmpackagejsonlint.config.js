/**
 * Lightweight, schema-compliant npm-package-json-lint configuration.
 * Only supported top-level keys are used: ignorePaths, rules.
 * Extra helper logic has been moved to scripts/utility/npm-package-json-lint-helpers.js.
 */
require('dotenv').config();

const ignorePathsEnv = process.env.NPMPKGJSONLINT_IGNORE_PATHS
    ? process.env.NPMPKGJSONLINT_IGNORE_PATHS.split(',')
          .map((p) => p.trim())
          .filter(Boolean)
    : [];

const strictMode = process.env.NPMPKGJSONLINT_STRICT_MODE === 'true';
const nameFormat = process.env.NPMPKGJSONLINT_NAME_FORMAT || 'error';
const requireFields = process.env.NPMPKGJSONLINT_REQUIRE_FIELDS !== 'false';

const baseIgnore = [
    'node_modules',
    'dist',
    'build',
    'coverage',
    'vendor',
    'logs',
    '.cache',
];

/** @type {{ ignorePaths: string[]; rules: Record<string, any>; }} */
module.exports = {
    ignorePaths: [...baseIgnore, ...ignorePathsEnv],
    rules: {
        'name-format': nameFormat,
        'valid-values-name-scope': ['error', ['@lightspeedwp']],
        'version-format': strictMode ? 'error' : 'warning',
        'require-description': requireFields ? 'error' : 'off',
        'require-license': requireFields ? 'error' : 'off',
        'require-repository': requireFields ? 'error' : 'off',
        'prefer-property-order': [
            'warning',
            [
                'name',
                'version',
                'description',
                'license',
                'author',
                'repository',
                'scripts',
                'dependencies',
                'devDependencies',
            ],
        ],
    },
};
