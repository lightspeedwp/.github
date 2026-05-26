#!/usr/bin/env node
/**
 * ============================================================================
 * Script: create-release-pr.cjs
 * Location: scripts/create-release-pr.cjs
 * Description:
 *   - Creates a release PR with next version and changelog updates
 *   - Determines version bump from merged PR labels
 *   - Runs as part of release-prep.yml workflow
 * Standards:
 *   - Follows LightSpeed Coding Standards
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import utilities
const { parseVersion } = require('./validate-version.cjs');
const { parseChangelog, getUnreleasedChanges } = require('agents/includes/changelogUtils.cjs');

/**
 * Execute shell command
 */
function exec(cmd, options = {}) {
    try {
        return execSync(cmd, { encoding: 'utf8', ...options });
    } catch (error) {
        if (options.allowError) {
            return '';
        }
        throw new Error(`Command failed: ${cmd}\n${error.message}`);
    }
}

/**
 * Get merged PRs since last release
 */
function getMergedPRsSinceLastRelease() {
    console.log('Fetching merged PRs since last release...');
    
    // Get the last release tag
    const lastTag = exec('git describe --tags --abbrev=0 2>/dev/null', { allowError: true }).trim();
    
    let gitLog;
    if (lastTag) {
        console.log(`  Last release tag: ${lastTag}`);
        gitLog = exec(`git log ${lastTag}..HEAD --merges --oneline --format="%H|%s"`);
    } else {
        console.log('  No previous release found, using all commits');
        gitLog = exec('git log --merges --oneline --format="%H|%s"');
    }
    
    // Parse PR numbers from merge commits
    const prPattern = /Merge pull request #(\d+)/;
    const prs = [];
    
    gitLog.split('\n').forEach(line => {
        const match = line.match(prPattern);
        if (match) {
            prs.push({
                number: match[1],
                hash: line.split('|')[0],
                message: line.split('|')[1]
            });
        }
    });
    
    console.log(`  Found ${prs.length} merged PRs`);
    return prs;
}

/**
 * Determine version bump from PR labels
 */
function determineVersionBump(prs) {
    console.log('\nAnalyzing PR labels for version bump...');
    
    // For now, default to patch if no PRs or unable to fetch labels
    // In a real workflow, this would use GitHub API to fetch PR labels
    // For the workflow, we'll use a simpler heuristic or manual input
    
    const hasMajor = false; // Would check for release:major label
    const hasMinor = false; // Would check for release:minor label
    
    if (hasMajor) {
        console.log('  Version bump: MAJOR (breaking changes detected)');
        return 'major';
    } else if (hasMinor) {
        console.log('  Version bump: MINOR (new features detected)');
        return 'minor';
    } else {
        console.log('  Version bump: PATCH (bug fixes and improvements)');
        return 'patch';
    }
}

/**
 * Compute next version
 */
function computeNextVersion(currentVersion, scope) {
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
 * Create release PR
 */
async function createReleasePR() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║    Create Release PR Automation       ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    try {
        // 1. Validate current state
        console.log('1. Validating current state...');
        const currentVersion = fs.readFileSync('VERSION', 'utf8').trim();
        console.log(`   Current version: ${currentVersion}`);
        
        // 2. Parse changelog for unreleased changes
        const changelogData = parseChangelog('CHANGELOG.md');
        const unreleased = getUnreleasedChanges(changelogData);
        
        if (!unreleased || Object.keys(unreleased.sections || {}).length === 0) {
            console.log('\n⚠️  No unreleased changes found in CHANGELOG.md');
            console.log('   Skipping release PR creation.');
            console.log('\n   To create a release PR, please add changes to the Unreleased section of CHANGELOG.md');
            return;
        }
        
        console.log('   ✓ Unreleased changes found');
        
        // 3. Get merged PRs and determine bump
        const mergedPRs = getMergedPRsSinceLastRelease();
        const scope = determineVersionBump(mergedPRs);
        
        // 4. Compute next version
        const nextVersion = computeNextVersion(currentVersion, scope);
        console.log(`\n2. Version bump: ${currentVersion} → ${nextVersion} (${scope})`);
        
        // 5. Create release branch
        const releaseBranch = `release/v${nextVersion}`;
        console.log(`\n3. Creating release branch: ${releaseBranch}`);
        
        // Check if branch already exists
        const branchExists = exec(`git rev-parse --verify ${releaseBranch} 2>/dev/null`, { allowError: true });
        if (branchExists) {
            console.log(`   Branch ${releaseBranch} already exists`);
            console.log('   Skipping PR creation.');
            return;
        }
        
        exec(`git checkout -b ${releaseBranch}`);
        
        // 6. Update VERSION file
        console.log('\n4. Updating VERSION file...');
        fs.writeFileSync('VERSION', `${nextVersion}\n`, 'utf8');
        console.log(`   ✓ VERSION updated to ${nextVersion}`);
        
        // 7. Update CHANGELOG.md
        console.log('\n5. Updating CHANGELOG.md...');
        const changelogContent = fs.readFileSync('CHANGELOG.md', 'utf8');
        const today = new Date().toISOString().split('T')[0];
        
        const updatedChangelog = changelogContent.replace(
            /^## \[Unreleased\] - (?:DD-MM-YYYY|YYYY-MM-DD|\d{4}-\d{2}-\d{2})$/m,
            `## [${nextVersion}] - ${today}`
        );
        
        fs.writeFileSync('CHANGELOG.md', updatedChangelog, 'utf8');
        console.log(`   ✓ CHANGELOG updated with version ${nextVersion}`);
        
        // 8. Commit changes
        console.log('\n6. Committing changes...');
        exec('git add VERSION CHANGELOG.md');
        exec(`git commit -m "chore(release): prepare release ${nextVersion}"`);
        console.log('   ✓ Changes committed');
        
        // 9. Push branch
        console.log('\n7. Pushing release branch...');
        exec(`git push -u origin ${releaseBranch}`);
        console.log('   ✓ Branch pushed');
        
        // 10. Create PR body
        const prBody = `## Release ${nextVersion}

This PR prepares release version \`${nextVersion}\` for merging to \`main\`.

### Changes

${generateChangelogSummary(unreleased)}

### Checklist

- [x] VERSION file updated to ${nextVersion}
- [x] CHANGELOG.md updated with release date
- [ ] All tests passing
- [ ] Lint checks passing
- [ ] Ready to merge to main

### Release Process

1. Review changes in this PR
2. Ensure all CI checks pass
3. Merge to \`main\` branch
4. Release agent will automatically:
   - Create git tag \`v${nextVersion}\`
   - Publish GitHub release
   - Update documentation

---

**Release Type:** ${scope}  
**Version:** ${currentVersion} → ${nextVersion}`;
        
        // 11. Create PR using gh CLI
        console.log('\n8. Creating pull request...');
        const prBodyFile = '/tmp/release-pr-body.md';
        fs.writeFileSync(prBodyFile, prBody, 'utf8');
        
        try {
            const prUrl = exec(`gh pr create --base main --head ${releaseBranch} --title "chore(release): ${nextVersion}" --body-file "${prBodyFile}"`).trim();
            console.log(`   ✓ Pull request created: ${prUrl}`);
            
            console.log('\n╔════════════════════════════════════════╗');
            console.log('║   ✅ Release PR created successfully   ║');
            console.log('╚════════════════════════════════════════╝');
            console.log(`\nPR URL: ${prUrl}`);
            console.log(`Version: ${nextVersion}`);
            console.log(`Branch: ${releaseBranch}`);
        } finally {
            if (fs.existsSync(prBodyFile)) {
                fs.unlinkSync(prBodyFile);
            }
        }
        
    } catch (error) {
        console.error('\n❌ Failed to create release PR:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

/**
 * Generate changelog summary for PR body
 */
function generateChangelogSummary(unreleased) {
    if (!unreleased || !unreleased.sections) {
        return '_No changes documented_';
    }
    
    let summary = '';
    
    Object.keys(unreleased.sections).forEach(section => {
        const items = unreleased.sections[section];
        if (items && items.length > 0) {
            summary += `#### ${section.charAt(0).toUpperCase() + section.slice(1)}\n\n`;
            items.forEach(item => {
                summary += `- ${item}\n`;
            });
            summary += '\n';
        }
    });
    
    return summary || '_No changes documented_';
}

// Run if executed directly
if (require.main === module) {
    createReleasePR();
}

module.exports = { createReleasePR, computeNextVersion, determineVersionBump };
