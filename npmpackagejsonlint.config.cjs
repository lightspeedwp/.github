/**
 * NPM Package JSON Lint Configuration (schema-compliant)
 *
 * Supported top-level keys: ignorePaths, rules.
 * Helper utilities & advanced custom validation live in:
 *   scripts/utility/npm-package-json-lint-helpers.js
 *
 * Environment variables (optional overrides):
 *   NPMPKGJSONLINT_IGNORE_PATHS       Comma-separated extra ignore paths
 *   NPMPKGJSONLINT_STRICT_MODE        Treat version-format as error (default false)
 *   NPMPKGJSONLINT_NAME_FORMAT        Severity for name-format (default error)
 *   NPMPKGJSONLINT_REQUIRE_FIELDS     Toggle description/repository/license (default true)
 *   NPMPKGJSONLINT_REQUIRE_AUTHOR     Toggle require-author rule (default true)
 *   NPMPKGJSONLINT_DISABLE_ORDER      Disable prefer-property-order rule (default false)
 *
 * NOTE: Only documented rules supported by npm-package-json-lint v7 are enabled.
 */
require('dotenv').config();

/**
 * Parse a comma-separated list environment variable safely.
 * @param {string|undefined} raw
 * @returns {string[]}
 */
function parseList(raw) {
    return raw
        ? raw
              .split(',')
              .map((p) => p.trim())
              .filter(Boolean)
        : [];
}

// Environment-controlled flags
const strictMode = process.env.NPMPKGJSONLINT_STRICT_MODE === 'true';
const nameFormat = process.env.NPMPKGJSONLINT_NAME_FORMAT || 'error';
const requireFields = process.env.NPMPKGJSONLINT_REQUIRE_FIELDS !== 'false';
const requireAuthor = process.env.NPMPKGJSONLINT_REQUIRE_AUTHOR !== 'false';
const disableOrder = process.env.NPMPKGJSONLINT_DISABLE_ORDER === 'true';
const ignorePathsEnv = parseList(process.env.NPMPKGJSONLINT_IGNORE_PATHS);

// Base ignores plus any dynamic additions.
const baseIgnore = [
    'node_modules',
    'dist',
    'build',
    'coverage',
    'vendor',
    'logs',
    '.cache',
    // Template scaffolds we do not want lint noise from.
    'docs/mustache-repo-templates',
    'docs/mustache-repo-templates/**',
    './docs/mustache-repo-templates',
    './docs/mustache-repo-templates/**',
    'docs/mustache-repo-templates/block-themes',
    'docs/mustache-repo-templates/block-themes/**',
];

/**
 * Property ordering aligned with common metadata before scripts/dependencies.
 */
const preferredOrder = [
    'name',
    'version',
    'description',
    'license',
    'author',
    'repository',
    'homepage',
    'bugs',
    'funding',
    'keywords',
    'contributors',
    'engines',
    'type',
    'main',
    'files',
    'scripts',
    'dependencies',
    'devDependencies',
];

/**
 * Exported configuration consumed by npm-package-json-lint.
 * Only schema-supported keys are present (ignorePaths, rules).
 * Additional custom logic moved to scripts/utility/npm-package-json-lint-helpers.js.
 *
 * @type {{ ignorePaths: string[]; rules: Record<string, any>; }}
 */
module.exports = {
    /**
     * Paths excluded from evaluation.
     */
    ignorePaths: [...baseIgnore, ...ignorePathsEnv],

    /**
     * Rules validated against npm-package-json-lint v7.
     */
    rules: {
        // --- Naming & scope rules ---
            'name-format': nameFormat,
            'valid-values-name-scope': 'error',

        // --- Version rules ---
            'version-format': strictMode ? 'error' : 'warning',

        // --- Required metadata (env toggles) ---
            'require-description': requireFields ? 'error' : 'off',
            'require-license': requireFields ? 'error' : 'off',
            'require-repository': requireFields ? 'error' : 'off',
            'require-author': requireAuthor ? 'error' : 'off',

        // --- Type checks (low risk, ensure JSON shape consistency) ---
            'description-type': 'error',
            'license-type': 'error',
            'repository-type': 'error',
            'keywords-type': 'error',

        // --- Ordering (optional) ---
        'prefer-property-order': disableOrder
            ? 'off'
            : ['warning', preferredOrder],

        // --- License values (relaxed set; enable later if stricter policy adopted) ---
            'valid-values-license': 'error',
    },
};

// JSDoc compliance note: All functions & top-level structures documented. Additional
// custom validators now reside in scripts/utility/npm-package-json-lint-helpers.js.
