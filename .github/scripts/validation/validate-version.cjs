#!/usr/bin/env node
/**
 * ============================================================================
 * Script: validate-version.cjs
 * Location: scripts/validation/validate-version.cjs
 * Description:
 *   - Validates VERSION file against semantic versioning format
 *   - Validates against version.schema.json
 *   - Exits with code 0 on success, 1 on failure
 * Standards:
 *   - Follows LightSpeed Coding Standards
 *   - See: https://github.com/lightspeedwp/.github/blob/HEAD/instructions/coding-standards.instructions.md
 * ============================================================================
 * @module scripts/validation/validate-version
 * @see schemas/version.schema.json
 */

const path = require('path');
const fs = require('fs');

/**
 * Validate semantic version string
 * @param {string} version - Version string to validate
 * @returns {Object} Validation result with valid flag and error message
 */
function validateVersion(version) {
    // Semantic versioning regex pattern
    // Supports: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
    const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

    if (!version || typeof version !== 'string') {
        return {
            valid: false,
            error: 'Version must be a non-empty string'
        };
    }

    const trimmed = version.trim();

    if (!semverPattern.test(trimmed)) {
        return {
            valid: false,
            error: `Invalid semantic version format: "${trimmed}". Expected format: MAJOR.MINOR.PATCH (e.g., 1.0.0, 2.1.3-alpha, 1.0.0+build)`
        };
    }

    return {
        valid: true,
        version: trimmed
    };
}

/**
 * Parse version components
 * @param {string} version - Semantic version string
 * @returns {Object} Parsed version components
 */
function parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/);

    if (!match) {
        return null;
    }

    return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3], 10),
        prerelease: match[4] || null,
        build: match[5] || null,
        raw: version
    };
}

/**
 * Main validation function
 */
function main() {
    const args = process.argv.slice(2);
    const versionPath = args[0] || path.join(__dirname, '../VERSION');

    console.log(`Validating version file: ${versionPath}`);

    try {
        // Check if file exists
        if (!fs.existsSync(versionPath)) {
            console.error(`Error: VERSION file not found: ${versionPath}`);
            console.error('Please create a VERSION file containing a semantic version (e.g., 1.0.0)');
            process.exit(1);
        }

        // Read version file
        const content = fs.readFileSync(versionPath, 'utf8');
        const version = content.trim();

        console.log(`Version string: "${version}"`);

        // Validate version
        const result = validateVersion(version);

        if (result.valid) {
            const parsed = parseVersion(result.version);

            console.log('✓ Version is valid');
            console.log('');
            console.log('Version components:');
            console.log(`  - Major: ${parsed.major}`);
            console.log(`  - Minor: ${parsed.minor}`);
            console.log(`  - Patch: ${parsed.patch}`);
            if (parsed.prerelease) {
                console.log(`  - Prerelease: ${parsed.prerelease}`);
            }
            if (parsed.build) {
                console.log(`  - Build: ${parsed.build}`);
            }

            process.exit(0);
        } else {
            console.error('✗ Version validation failed:');
            console.error(`  ${result.error}`);
            console.error('');
            console.error('Valid examples:');
            console.error('  - 1.0.0');
            console.error('  - 2.1.3');
            console.error('  - 1.0.0-alpha');
            console.error('  - 1.0.0-beta.1');
            console.error('  - 1.0.0+20130313144700');
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

module.exports = { validateVersion, parseVersion, main };
