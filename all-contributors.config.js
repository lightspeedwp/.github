/**
 * All Contributors Configuration for LightSpeedWP Organization
 *
 * Manages contributor recognition and README generation.
 * This configuration provides:
 * - Comprehensive contributor type definitions
 * - Environment variable overrides for CI/CD
 * - Custom commit message templates
 * - Badge and image customization
 *
 * Environment Variables:
 * - CONTRIBUTORS_AUTO_COMMIT: Enable auto-commits (default: false)
 * - CONTRIBUTORS_IMAGE_SIZE: Badge image size (default: 100)
 * - CONTRIBUTORS_PER_LINE: Contributors per line (default: 7)
 * - CONTRIBUTORS_PROJECT_NAME: Override project name
 * - CONTRIBUTORS_PROJECT_OWNER: Override project owner
 */

/**
 * Load environment variables with fallback defaults
 */
require('dotenv').config();

/**
 * Configuration constants with environment variable overrides
 */
const projectName = process.env.CONTRIBUTORS_PROJECT_NAME || '.github';
const projectOwner = process.env.CONTRIBUTORS_PROJECT_OWNER || 'lightspeedwp';
const autoCommit = process.env.CONTRIBUTORS_AUTO_COMMIT === 'true';
const imageSize = parseInt(process.env.CONTRIBUTORS_IMAGE_SIZE) || 100;
const contributorsPerLine = parseInt(process.env.CONTRIBUTORS_PER_LINE) || 7;

/**
 * All Contributors Configuration Object
 *
 * @type {import('all-contributors-cli').Configuration}
 */
module.exports = {
    /**
     * Project identification
     */
    projectName,
    projectOwner,
    repoType: 'github',
    repoHost: 'https://github.com',

    /**
     * Project metadata
     */
    projectDescription:
        'GitHub Community Health files for LightSpeedWP organization',
    projectWebsite: 'https://lightspeedwp.agency',
    license: 'GPL-2.0-or-later',

    /**
     * Files to update with contributor information
     * Additional files can be added for multi-file projects
     */
    files: [
        'README.md',
        // Add more files as needed
        // 'docs/CONTRIBUTORS.md',
        // 'CHANGELOG.md'
    ],

    /**
     * Badge and image configuration
     */
    imageSize,
    contributorsPerLine,

    /**
     * Badge URL template (can be customized for different services)
     */
    badgeTemplate:
        'https://img.shields.io/badge/all_contributors-<%= contributors.length %>-orange.svg?style=flat-square',

    /**
     * Commit configuration
     * Controls automatic commits when contributors are added
     */
    commit: autoCommit,
    commitConvention: 'conventional',

    /**
     * Custom commit message templates
     */
    commitTemplate: {
        add: 'docs: add <%= username %> as a contributor for <%= contributions %>',
        update: 'docs: update contributors',
    },

    /**
     * Link to usage guidelines
     * Helps new contributors understand how to get recognized
     */
    linkToUsage: true,

    /**
     * Skip asking for contribution types
     * When true, will add all available contribution types
     */
    skipCi: false,

    /**
     * Current contributors list
     * This will be automatically updated as contributors are added
     */
    contributors: [
        {
            login: 'lightspeedwp',
            name: 'LightSpeedWP',
            avatar_url: 'https://avatars.githubusercontent.com/u/13472139?v=4',
            profile: 'https://github.com/lightspeedwp',
            contributions: [
                'ideas', // Ideas, planning, feedback
                'fundingFinding', // Finding/providing funding
                'projectManagement', // Project management
                'business', // Business development
                'code', // Code
                'design', // Design
                'doc', // Documentation
                'infra', // Infrastructure (CI/CD, etc)
                'maintenance', // Maintenance
                'test', // Tests
            ],
        },
    ],

    /**
     * Available contribution types
     * Can be extended with custom contribution types
     */
    contributionTypes: {
        // Standard types are automatically included
        // Custom types can be added here
        agent: {
            symbol: '🤖',
            description: 'AI Agent Development',
            link: '[<%= symbol %>](<%= url %> "AI Agent Development")',
        },
        automation: {
            symbol: '⚙️',
            description: 'Automation & Workflows',
            link: '[<%= symbol %>](<%= url %> "Automation & Workflows")',
        },
        devops: {
            symbol: '🚀',
            description: 'DevOps & Deployment',
            link: '[<%= symbol %>](<%= url %> "DevOps & Deployment")',
        },
    },

    /**
     * Custom functions for contributor validation and processing
     */
    functions: {
        /**
         * Validate GitHub username format
         */
        validateUsername: function (username) {
            const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
            return usernameRegex.test(username);
        },

        /**
         * Generate contributor stats
         */
        generateStats: function (contributors) {
            return {
                total: contributors.length,
                byType: contributors.reduce((acc, contributor) => {
                    contributor.contributions.forEach((type) => {
                        acc[type] = (acc[type] || 0) + 1;
                    });
                    return acc;
                }, {}),
            };
        },
    },
};
