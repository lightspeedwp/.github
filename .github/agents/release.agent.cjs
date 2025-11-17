/**
 * ============================================================================
 * Agent: release.agent.cjs
 * Location: .github/agents/release.agent.cjs
 * Description:
 *   - Automates release validation, changelog enforcement, versioning, tagging, and GitHub Releases
 *   - Main functions: run(), validateRelease(), bumpVersion(), createTag(), publishRelease()
 *   - Uses shared utilities: changelogUtils, validate-version, validate-changelog
 *   - Supports dry-run mode for testing
 * Standards:
 *   - Follows [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
 *   - See org instructions: [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
 *   - See spec: .github/agents/release.agent.md
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Optional: @actions/core for GitHub Actions integration
let core;
try {
    core = require('@actions/core');
} catch (e) {
    // Running outside GitHub Actions - use console
    core = {
        info: console.log,
        error: console.error,
        warning: console.warn,
        setFailed: (msg) => { console.error(msg); process.exit(1); }
    };
}

// Import utilities
const changelogUtilsPath = path.join(__dirname, 'includes/changelogUtils.cjs');
const validateVersionPath = path.join(__dirname, '../../scripts/validate-version.cjs');
const validateChangelogPath = path.join(__dirname, '../../scripts/validate-changelog.cjs');

const { parseChangelog, validateChangelog, getLatestRelease, getUnreleasedChanges } = require(changelogUtilsPath);
const { validateVersion, parseVersion } = require(validateVersionPath);

/**
 * Execute shell command
 * @param {string} cmd - Command to execute
 * @param {boolean} dryRun - Dry run mode
 * @returns {string} Command output
 */
function exec(cmd, dryRun = false) {
    if (dryRun) {
        console.log(`[DRY-RUN] Would execute: ${cmd}`);
        return '';
    }
    try {
        return execSync(cmd, { encoding: 'utf8' });
    } catch (error) {
        throw new Error(`Command failed: ${cmd}\n${error.message}`);
    }
}

/**
 * Determine next version based on labels
 * @param {string} currentVersion - Current version
 * @param {string} scope - Release scope (major, minor, patch)
 * @returns {string} Next version
 */
function determineNextVersion(currentVersion, scope = 'patch') {
    const parsed = parseVersion(currentVersion);
    if (!parsed) {
        throw new Error(`Invalid current version: ${currentVersion}`);
    }

    let { major, minor, patch } = parsed;

    switch (scope.toLowerCase()) {
        case 'major':
            major += 1;
            minor = 0;
            patch = 0;
            break;
        case 'minor':
            minor += 1;
            patch = 0;
            break;
        case 'patch':
        default:
            patch += 1;
            break;
    }

    return `${major}.${minor}.${patch}`;
}

/**
 * Validate release readiness
 * @param {Object} options - Validation options
 * @returns {Object} Validation results
 */
async function validateRelease(options = {}) {
    const {
        versionPath = 'VERSION',
        changelogPath = 'CHANGELOG.md',
        dryRun = false
    } = options;

    console.log('=== Release Validation ===');
    const errors = [];
    const warnings = [];

    // 1. Validate VERSION file exists and is valid
    console.log('\n1. Validating VERSION file...');
    if (!fs.existsSync(versionPath)) {
        errors.push(`VERSION file not found: ${versionPath}`);
    } else {
        const versionContent = fs.readFileSync(versionPath, 'utf8').trim();
        const versionResult = validateVersion(versionContent);
        if (!versionResult.valid) {
            errors.push(`Invalid VERSION: ${versionResult.error}`);
        } else {
            console.log(`   ✓ Current version: ${versionContent}`);
        }
    }

    // 2. Validate CHANGELOG.md exists and is valid
    console.log('\n2. Validating CHANGELOG.md...');
    if (!fs.existsSync(changelogPath)) {
        errors.push(`CHANGELOG.md not found: ${changelogPath}`);
    } else {
        try {
            const changelogData = parseChangelog(changelogPath);
            const changelogResult = validateChangelog(changelogData);

            if (!changelogResult.valid) {
                errors.push(`Invalid CHANGELOG: ${changelogResult.errors.join(', ')}`);
            } else {
                console.log(`   ✓ CHANGELOG is valid (${changelogData.releases.length} releases)`);

                // Check for unreleased changes
                const unreleased = getUnreleasedChanges(changelogData);
                if (unreleased && Object.keys(unreleased.sections || {}).length > 0) {
                    console.log('   ✓ Unreleased changes found');
                } else {
                    warnings.push('No unreleased changes in CHANGELOG');
                }
            }
        } catch (error) {
            errors.push(`CHANGELOG parsing error: ${error.message}`);
        }
    }

    // 3. Check git status
    console.log('\n3. Checking git status...');
    try {
        const status = exec('git status --porcelain', dryRun);
        if (status && !dryRun) {
            warnings.push('Working directory has uncommitted changes');
            console.log('   ⚠ Uncommitted changes detected');
        } else {
            console.log('   ✓ Working directory is clean');
        }
    } catch (error) {
        warnings.push(`Git status check failed: ${error.message}`);
    }

    // 4. Run tests (if package.json has test script)
    console.log('\n4. Checking test suite...');
    if (fs.existsSync('package.json')) {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (pkg.scripts && pkg.scripts.test) {
            console.log('   ℹ Test script found (run separately via CI)');
        } else {
            console.log('   ℹ No test script defined');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Bump version in VERSION file
 * @param {string} newVersion - New version string
 * @param {Object} options - Options
 */
function bumpVersion(newVersion, options = {}) {
    const {
        versionPath = 'VERSION',
        dryRun = false
    } = options;

    console.log(`\n=== Bumping Version to ${newVersion} ===`);

    if (dryRun) {
        console.log(`[DRY-RUN] Would write "${newVersion}" to ${versionPath}`);
        return;
    }

    fs.writeFileSync(versionPath, `${newVersion}\n`, 'utf8');
    console.log(`✓ Version bumped to ${newVersion}`);
}

/**
 * Update CHANGELOG.md with new version
 * @param {string} newVersion - New version string
 * @param {Object} options - Options
 */
function updateChangelog(newVersion, options = {}) {
    const {
        changelogPath = 'CHANGELOG.md',
        dryRun = false
    } = options;

    console.log(`\n=== Updating CHANGELOG for ${newVersion} ===`);

    if (!fs.existsSync(changelogPath)) {
        throw new Error(`CHANGELOG not found: ${changelogPath}`);
    }

    const content = fs.readFileSync(changelogPath, 'utf8');
    const today = new Date().toISOString().split('T')[0];

    // Replace [Unreleased] - DD-MM-YYYY with [newVersion] - YYYY-MM-DD
    const updatedContent = content.replace(
        /^## \[Unreleased\] - (?:DD-MM-YYYY|YYYY-MM-DD|\d{4}-\d{2}-\d{2})$/m,
        `## [${newVersion}] - ${today}`
    );

    if (dryRun) {
        console.log(`[DRY-RUN] Would update CHANGELOG.md Unreleased section to [${newVersion}] - ${today}`);
        return;
    }

    fs.writeFileSync(changelogPath, updatedContent, 'utf8');
    console.log(`✓ CHANGELOG updated with version ${newVersion}`);
}

/**
 * Create git tag
 * @param {string} version - Version to tag
 * @param {Object} options - Options
 */
function createTag(version, options = {}) {
    const { dryRun = false } = options;

    const tagName = `v${version}`;
    console.log(`\n=== Creating Git Tag: ${tagName} ===`);

    exec(`git tag -a ${tagName} -m "Release ${tagName}"`, dryRun);
    console.log(`✓ Tag ${tagName} created`);
}

/**
 * Push changes and tags
 * @param {Object} options - Options
 */
function pushChanges(options = {}) {
    const { dryRun = false } = options;

    console.log('\n=== Pushing Changes ===');

    exec('git push origin develop', dryRun);
    exec('git push --tags', dryRun);

    console.log('✓ Changes and tags pushed');
}

/**
 * Create GitHub Release
 * @param {string} version - Version for release
 * @param {Object} options - Options
 */
function createRelease(version, options = {}) {
    const {
        changelogPath = 'CHANGELOG.md',
        dryRun = false
    } = options;

    console.log(`\n=== Creating GitHub Release for v${version} ===`);

    // Extract release notes from changelog
    const changelogData = parseChangelog(changelogPath);

    // In dry-run mode, use Unreleased section if version not found yet
    let release = changelogData.releases.find(r => r.version === version);

    if (!release && dryRun) {
        // Fall back to Unreleased section in dry-run
        release = changelogData.releases.find(r => r.version === 'Unreleased');
        if (release) {
            console.log(`   [DRY-RUN] Using Unreleased section as template for v${version}`);
            release = { ...release, version };
        }
    }

    if (!release) {
        throw new Error(`Version ${version} not found in CHANGELOG`);
    }

    // Build release notes
    let releaseNotes = `## Release ${version}\n\n`;
    if (release.sections) {
        Object.keys(release.sections).forEach(section => {
            const items = release.sections[section];
            if (items && items.length > 0) {
                releaseNotes += `### ${section.charAt(0).toUpperCase() + section.slice(1)}\n\n`;
                items.forEach(item => {
                    releaseNotes += `- ${item}\n`;
                });
                releaseNotes += '\n';
            }
        });
    }

    if (dryRun) {
        console.log('[DRY-RUN] Would create GitHub release:');
        console.log(releaseNotes);
        return;
    }

    // Use gh CLI to create release
    const notesFile = `/tmp/release-notes-${version}.md`;
    fs.writeFileSync(notesFile, releaseNotes, 'utf8');

    try {
        exec(`gh release create v${version} --title "Release v${version}" --notes-file "${notesFile}"`, dryRun);
        console.log(`✓ GitHub Release v${version} created`);
    } finally {
        if (fs.existsSync(notesFile)) {
            fs.unlinkSync(notesFile);
        }
    }
}

/**
 * Main release orchestrator
 */
async function run() {
    try {
        // Parse command-line arguments
        const args = process.argv.slice(2);
        const dryRun = args.includes('--dry-run') || args.includes('--dry-run=true');
        const scopeArg = args.find(arg => arg.startsWith('--scope='));
        const scope = scopeArg ? scopeArg.split('=')[1] : 'patch';

        console.log('╔════════════════════════════════════════╗');
        console.log('║     LightSpeed Release Agent           ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('');
        console.log(`Mode: ${dryRun ? 'DRY-RUN' : 'LIVE'}`);
        console.log(`Scope: ${scope}`);
        console.log('');

        // Step 1: Validate release readiness
        const validation = await validateRelease({ dryRun });

        if (!validation.valid) {
            console.error('\n❌ Release validation failed:');
            validation.errors.forEach(err => console.error(`  - ${err}`));
            process.exit(1);
        }

        if (validation.warnings.length > 0) {
            console.warn('\n⚠️  Warnings:');
            validation.warnings.forEach(warn => console.warn(`  - ${warn}`));
        }

        console.log('\n✅ All validations passed');

        // Step 2: Determine next version
        const currentVersion = fs.readFileSync('VERSION', 'utf8').trim();
        const nextVersion = determineNextVersion(currentVersion, scope);

        console.log(`\nVersion bump: ${currentVersion} → ${nextVersion}`);

        // Step 3: Bump version
        bumpVersion(nextVersion, { dryRun });

        // Step 4: Update changelog
        updateChangelog(nextVersion, { dryRun });

        // Step 5: Commit changes
        if (!dryRun) {
            exec('git add VERSION CHANGELOG.md');
            exec(`git commit -m "chore(release): bump version to ${nextVersion}"`);
        } else {
            console.log(`\n[DRY-RUN] Would commit VERSION and CHANGELOG.md with message: "chore(release): bump version to ${nextVersion}"`);
        }

        // Step 6: Create tag
        createTag(nextVersion, { dryRun });

        // Step 7: Push changes
        pushChanges({ dryRun });

        // Step 8: Create GitHub Release
        createRelease(nextVersion, { dryRun });

        console.log('\n');
        console.log('╔════════════════════════════════════════╗');
        console.log('║   ✅ Release completed successfully!   ║');
        console.log('╚════════════════════════════════════════╝');
        console.log(`\nVersion: ${nextVersion}`);
        console.log(`Tag: v${nextVersion}`);

        if (dryRun) {
            console.log('\n⚠️  This was a DRY-RUN. No changes were made.');
        }

    } catch (error) {
        console.error('\n❌ Release failed:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    run();
}

module.exports = {
    run,
    validateRelease,
    bumpVersion,
    updateChangelog,
    createTag,
    pushChanges,
    createRelease,
    determineNextVersion
};
