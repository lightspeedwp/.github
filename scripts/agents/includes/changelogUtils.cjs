#!/usr/bin/env node
/**
 * ============================================================================
 * Utility: changelogUtils.cjs
 * Location: includes/changelogUtils.cjs
 * Description:
 *   - Parses and validates CHANGELOG.md files against Keep a Changelog format
 *   - Validates against changelog.schema.json
 *   - Extracts versions, dates, and changes
 *   - Can be used as CLI tool or imported as module
 * Standards:
 *   - Follows LightSpeed Coding Standards
 *   - See: https://github.com/lightspeedwp/.github/blob/HEAD/instructions/coding-standards.instructions.md
 * ============================================================================
 */
// TODO: Align this helper with the latest automation spec updates.

const fs = require('fs');
const path = require('path');

/**
 * Parse a Keep a Changelog formatted CHANGELOG.md file
 * @param {string} changelogPath - Path to CHANGELOG.md file
 * @returns {Object} Parsed changelog data
 */
function parseChangelog(changelogPath) {
    if (!fs.existsSync(changelogPath)) {
        throw new Error(`Changelog file not found: ${changelogPath}`);
    }

    const content = fs.readFileSync(changelogPath, 'utf8');
    const releases = [];

    // Match release headers: ## [version] - date
    const releaseRegex = /^##\s+\[([^\]]+)\]\s*-\s*(.+)$/gm;
    const sectionRegex = /^###\s+(.+)$/gm;

    let match;
    const releasePositions = [];

    // Find all release positions
    while ((match = releaseRegex.exec(content)) !== null) {
        releasePositions.push({
            version: match[1].trim(),
            date: match[2].trim(),
            startPos: match.index,
            endPos: -1
        });
    }

    // Set end positions
    for (let i = 0; i < releasePositions.length; i++) {
        if (i < releasePositions.length - 1) {
            releasePositions[i].endPos = releasePositions[i + 1].startPos;
        } else {
            releasePositions[i].endPos = content.length;
        }
    }

    // Parse each release
    releasePositions.forEach(release => {
        const releaseContent = content.substring(release.startPos, release.endPos);
        const sections = {};

        // Find all sections within this release
        const sectionMatches = [];
        let sectionMatch;
        const localSectionRegex = /^###\s+(.+)$/gm;

        while ((sectionMatch = localSectionRegex.exec(releaseContent)) !== null) {
            sectionMatches.push({
                name: sectionMatch[1].trim(),
                startPos: sectionMatch.index,
                endPos: -1
            });
        }

        // Set end positions for sections
        for (let i = 0; i < sectionMatches.length; i++) {
            if (i < sectionMatches.length - 1) {
                sectionMatches[i].endPos = sectionMatches[i + 1].startPos;
            } else {
                sectionMatches[i].endPos = releaseContent.length;
            }
        }

        // Extract content for each section
        sectionMatches.forEach(section => {
            const sectionContent = releaseContent.substring(section.startPos, section.endPos);
            const lines = sectionContent
                .split('\n')
                .slice(1) // Skip the section header
                .map(line => line.trim())
                .filter(line => {
                    // Include lines that start with - or * (list items)
                    // Exclude empty lines, comments, and placeholders
                    return line &&
                           (line.startsWith('-') || line.startsWith('*')) &&
                           !line.includes('[placeholder]') &&
                           !line.startsWith('<!--');
                })
                .map(line => {
                    // Remove leading - or * and trim
                    return line.replace(/^[-*]\s*/, '').trim();
                });

            if (lines.length > 0) {
                const sectionKey = section.name.toLowerCase();
                sections[sectionKey] = lines;
            }
        });

        releases.push({
            version: release.version,
            date: release.date,
            sections
        });
    });

    return {
        releases,
        format: 'keepachangelog',
        semver: true
    };
}

/**
 * Validate parsed changelog data against schema
 * @param {Object} changelogData - Parsed changelog data
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateChangelog(changelogData) {
    const errors = [];

    // Basic structure validation
    if (!changelogData.releases || !Array.isArray(changelogData.releases)) {
        errors.push('Changelog must contain a releases array');
        return { valid: false, errors };
    }

    if (changelogData.releases.length === 0) {
        errors.push('Changelog must contain at least one release');
        return { valid: false, errors };
    }

    // Validate each release
    changelogData.releases.forEach((release, index) => {
        // Check version format
        if (!release.version) {
            errors.push(`Release ${index + 1}: Missing version`);
        } else {
            const versionPattern = /^(Unreleased|\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?)$/;
            if (!versionPattern.test(release.version)) {
                errors.push(`Release ${index + 1}: Invalid version format "${release.version}"`);
            }
        }

        // Check date format
        if (!release.date) {
            errors.push(`Release ${index + 1}: Missing date`);
        } else {
            const datePattern = /^(\d{4}-\d{2}-\d{2}|DD-MM-YYYY|YYYY-MM-DD)$/;
            if (!datePattern.test(release.date)) {
                errors.push(`Release ${index + 1}: Invalid date format "${release.date}" (expected YYYY-MM-DD)`);
            }
        }

        // Check sections
        if (release.sections) {
            const validSections = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security', 'documentation', 'performance'];
            Object.keys(release.sections).forEach(section => {
                if (!validSections.includes(section)) {
                    errors.push(`Release ${index + 1}: Unknown section "${section}"`);
                }
            });
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Get the latest release from changelog
 * @param {Object} changelogData - Parsed changelog data
 * @returns {Object|null} Latest release or null
 */
function getLatestRelease(changelogData) {
    if (!changelogData.releases || changelogData.releases.length === 0) {
        return null;
    }

    // Find first non-unreleased version
    const released = changelogData.releases.find(r => r.version !== 'Unreleased');
    return released || null;
}

/**
 * Get unreleased changes
 * @param {Object} changelogData - Parsed changelog data
 * @returns {Object|null} Unreleased section or null
 */
function getUnreleasedChanges(changelogData) {
    if (!changelogData.releases || changelogData.releases.length === 0) {
        return null;
    }

    const unreleased = changelogData.releases.find(r => r.version === 'Unreleased');
    return unreleased || null;
}

/**
 * Check if changelog has any unreleased changes
 * @param {Object} changelogData - Parsed changelog data
 * @returns {boolean} True if there are unreleased changes
 */
function hasUnreleasedChanges(changelogData) {
    const unreleased = getUnreleasedChanges(changelogData);
    if (!unreleased || !unreleased.sections) {
        return false;
    }

    // Check if any section has content
    return Object.keys(unreleased.sections).some(section => {
        return unreleased.sections[section] && unreleased.sections[section].length > 0;
    });
}

/**
 * CLI handler
 */
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Usage: changelogUtils.js [--validate|--parse|--latest|--unreleased] <path-to-changelog>');
        console.error('');
        console.error('Options:');
        console.error('  --validate    Validate changelog format');
        console.error('  --parse       Parse and display changelog data');
        console.error('  --latest      Get latest release version');
        console.error('  --unreleased  Check for unreleased changes');
        process.exit(1);
    }

    const command = args[0];
    const changelogPath = args[1] || 'CHANGELOG.md';

    try {
        const data = parseChangelog(changelogPath);

        switch (command) {
            case '--validate': {
                const result = validateChangelog(data);
                if (result.valid) {
                    console.log('✓ Changelog is valid');
                    process.exit(0);
                } else {
                    console.error('✗ Changelog validation failed:');
                    result.errors.forEach(err => console.error(`  - ${err}`));
                    process.exit(1);
                }
                break;
            }

            case '--parse': {
                console.log(JSON.stringify(data, null, 2));
                process.exit(0);
                break;
            }

            case '--latest': {
                const latest = getLatestRelease(data);
                if (latest) {
                    console.log(latest.version);
                    process.exit(0);
                } else {
                    console.error('No released version found');
                    process.exit(1);
                }
                break;
            }

            case '--unreleased': {
                const hasChanges = hasUnreleasedChanges(data);
                if (hasChanges) {
                    console.log('✓ Unreleased changes found');
                    const unreleased = getUnreleasedChanges(data);
                    console.log(JSON.stringify(unreleased, null, 2));
                    process.exit(0);
                } else {
                    console.log('No unreleased changes');
                    process.exit(1);
                }
                break;
            }

            default:
                console.error(`Unknown command: ${command}`);
                process.exit(1);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run CLI if executed directly
if (require.main === module) {
    main();
}

// Export functions for use as module
module.exports = {
    parseChangelog,
    validateChangelog,
    getLatestRelease,
    getUnreleasedChanges,
    hasUnreleasedChanges
};
