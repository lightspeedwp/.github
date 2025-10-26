/**
 * NPM Package JSON Lint Configuration (schema-compliant)
 *
 * Supported top-level keys: ignorePaths, rules.
 * Helper utilities & advanced custom validation live in:
 *   scripts/utility/npm-package-json-lint-helpers.js
 *
 * Environment variables (optional overrides):
 *   NPMPKGJSONLINT_IGNORE_PATHS          Comma-separated extra ignore paths
 *   NPMPKGJSONLINT_STRICT_MODE            Treat version-format as error (default false)
 *   NPMPKGJSONLINT_NAME_FORMAT            Severity for name-format (default error)
 *   NPMPKGJSONLINT_REQUIRE_FIELDS         Backwards-compatible master toggle (if false, disables all require-* rules)
 *   NPMPKGJSONLINT_REQUIRE_DESCRIPTION    Toggle require-description (default true)
 *   NPMPKGJSONLINT_REQUIRE_REPOSITORY     Toggle require-repository (default true)
 *   NPMPKGJSONLINT_REQUIRE_LICENSE        Toggle require-license (default true)
 *   NPMPKGJSONLINT_REQUIRE_AUTHOR         Toggle require-author (default true)
 *   NPMPKGJSONLINT_DISABLE_ORDER          Disable prefer-property-order rule (default false)
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
// Granular required field toggles (fall back to master flag)
const requireDescription =
    requireFields && process.env.NPMPKGJSONLINT_REQUIRE_DESCRIPTION !== 'false';
const requireRepository =
    requireFields && process.env.NPMPKGJSONLINT_REQUIRE_REPOSITORY !== 'false';
const requireLicense =
    requireFields && process.env.NPMPKGJSONLINT_REQUIRE_LICENSE !== 'false';
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
            // Scope validation remains disabled until an allowed scope list is defined.
            'valid-values-name-scope': 'off',

        // --- Version rules ---
            'version-format': strictMode ? 'error' : 'warning',

        // --- Required metadata (env toggles) ---
            'require-description': requireDescription ? 'error' : 'off',
            'require-license': requireLicense ? 'error' : 'off',
            'require-repository': requireRepository ? 'error' : 'off',
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

        // --- License values ---
            'valid-values-license': ['warning', ['GPL-3.0-or-later']],
    },
};

// JSDoc compliance note: All functions & top-level structures documented. Additional
// custom validators now reside in scripts/utility/npm-package-json-lint-helpers.js.
