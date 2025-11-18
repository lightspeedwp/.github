/**
 * Markdownlint CLI2 Configuration for LightSpeedWP
 *
 * This configuration extends the base markdownlint.config.js and provides
 * CLI-specific settings for the markdownlint-cli2 tool.
 *
 * @see https://github.com/DavidAnson/markdownlint-cli2
 * @see ./markdownlint.config.js for base configuration
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load base configuration from markdownlint.config.js
 */
let baseConfig = {};
try {
    const configPath = join(__dirname, 'markdownlint.config.js');
    const configModule = await import(configPath);
    baseConfig = configModule.default || configModule;
} catch (error) {
    console.warn('Could not load markdownlint.config.js, using defaults');
}

/**
 * Markdownlint CLI2 Configuration
 */
export default {
    /**
     * Configuration object (merged with base config)
     */
    config: {
        ...baseConfig.rules,
        default: true,
        MD013: {
            line_length: 120,
            heading_line_length: 140,
            code_block_line_length: 160,
            tables: false,
            headings: false,
            headers: false,
        },
        MD033: {
            allowed_elements: [
                'br',
                'sub',
                'sup',
                'kbd',
                'mark',
                'details',
                'summary',
                'img',
                'a',
                'div',
                'span',
                'table',
                'thead',
                'tbody',
                'tr',
                'th',
                'td',
                'hr',
                'code',
                'pre',
            ],
        },
        MD041: false,
        MD024: {
            siblings_only: true,
        },
        MD029: {
            style: 'ordered',
        },
        MD040: false,
        MD046: {
            style: 'fenced',
        },
        MD049: {
            style: 'asterisk',
        },
        MD050: {
            style: 'asterisk',
        },
    },

    /**
     * Custom rules (optional)
     */
    customRules: [],

    /**
     * Files to process (glob patterns)
     */
    globs: ['**/*.md'],

    /**
     * Files to ignore (glob patterns)
     */
    ignores: [
        'node_modules/**',
        'coverage/**',
        'dist/**',
        'build/**',
        '.git/**',
        '**/CHANGELOG.md',
        '**/ALL-CONTRIBUTORS.md',
        'docs/api/**/*.md',
        '*.draft.md',
        'README.template.md',
    ],

    /**
     * Fix mode (auto-fix violations where possible)
     */
    fix: false,

    /**
     * Output formatter
     */
    outputFormatters: [
        ['markdownlint-cli2-formatter-default'],
        // Uncomment for JSON output in CI
        // ['markdownlint-cli2-formatter-json', { name: 'markdownlint-results.json' }]
    ],
};
