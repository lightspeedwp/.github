/**
 * Markdownlint CLI2 Configuration for LightSpeedWP
 *
 * This configuration uses markdownlint-cli2 with custom rules
 * to enforce consistent Markdown formatting across all documentation.
 *
 * @see https://github.com/DavidAnson/markdownlint-cli2
 * @see https://github.com/github/markdownlint-github
 */

/**
 * Markdownlint CLI2 configuration options
 */
const options = {
    /**
     * Configuration object for markdownlint rules
     * Base configuration with LightSpeedWP-specific rules
     */
    config: {
        // Use default rules as base
        default: true,

        // MD003: Heading style - Enforce ATX-style headings
        MD003: {
            style: 'atx',
        },

        // MD013: Line length - Allow longer lines (120 chars)
        MD013: {
            line_length: 120,
            code_blocks: false,
            tables: false,
            headings: false,
        },

        // MD024: Multiple headings with same content - Allow in different sections
        MD024: {
            siblings_only: true,
        },

        // MD025: Multiple top-level headings - Allow for documents with YAML frontmatter
        MD025: false,

        // MD033: Inline HTML - Allow common HTML elements for enhanced formatting
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
                'filename',
            ],
        },

        // MD041: First line in file should be a top-level heading
        // Disabled to allow YAML frontmatter before headings
        MD041: false,
    },

    /**
     * Globs to ignore (in addition to command-line exclusions)
     */
    ignores: [
        'node_modules',
        'coverage',
        'dist',
        'build',
        '.git',
        '*.draft.md',
    ],
};

export default options;
