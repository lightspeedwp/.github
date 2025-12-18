#!/usr/bin/env node
/**
 * ============================================================================
 * Script: validate-changelog.cjs
 * Location: scripts/validate-changelog.cjs
 * Description:
 *   - Validates CHANGELOG.md files against Keep a Changelog format
 *   - Uses changelogUtils.js for parsing and validation
 *   - Exits with code 0 on success, 1 on failure
 * Standards:
 *   - Follows LightSpeed Coding Standards
 *   - See: https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md
 * ============================================================================
 * @module scripts/validation/validate-changelog
 * @see scripts/agents/includes/changelogUtils.cjs
 */

const path = require('path');
const fs = require('fs');

// Import changelogUtils
const changelogUtilsPath = path.join(__dirname, '../agents/includes/changelogUtils.cjs');

if (!fs.existsSync(changelogUtilsPath)) {
    console.error('Error: changelogUtils.js not found at', changelogUtilsPath);
    console.error('Please ensure scripts/agents/includes/changelogUtils.js exists');
    process.exit(1);
}

const { parseChangelog, validateChangelog } = require(changelogUtilsPath);

/**
 * Main validation function
 */
function main() {
    const args = process.argv.slice(2);
    const changelogPath = args[0] || path.join(__dirname, '../CHANGELOG.md');

    console.log(`Validating changelog: ${changelogPath}`);

    try {
        // Check if file exists
        if (!fs.existsSync(changelogPath)) {
            console.error(`Error: Changelog file not found: ${changelogPath}`);
            process.exit(1);
        }

        // Parse changelog
        const data = parseChangelog(changelogPath);
        console.log(`Found ${data.releases.length} release(s)`);

        // Validate changelog
        const result = validateChangelog(data);

        if (result.valid) {
            console.log('✓ Changelog is valid');
            console.log('');
            console.log('Releases:');
            data.releases.forEach(release => {
                const sectionCount = Object.keys(release.sections || {}).length;
                console.log(`  - ${release.version} (${release.date}) - ${sectionCount} section(s)`);
            });
            process.exit(0);
        } else {
            console.error('✗ Changelog validation failed:');
            console.error('');
            result.errors.forEach(err => console.error(`  - ${err}`));
            console.error('');
            console.error('Please fix the errors above and try again.');
            process.exit(1);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { main };
