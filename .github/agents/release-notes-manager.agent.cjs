#!/usr/bin/env node
/**
 * ============================================================================
 * Agent: release-notes-manager.agent.cjs
 * Location: .github/agents/release-notes-manager.agent.cjs
 * Description:
 *   - Compiles clean release notes from PRs, issues, and changelog
 *   - Generates highlights and grouped sections
 *   - Flags breaking changes and lists contributors
 *   - Formats output suitable for GitHub releases
 * Standards:
 *   - Follows LightSpeed Coding Standards
 *   - See spec: .github/agents/TODO/release-notes-manager.agents.md
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import utilities
const changelogUtilsPath = path.join(__dirname, 'includes/changelogUtils.cjs');
const { parseChangelog, getLatestRelease } = require(changelogUtilsPath);

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
 * Get merged PRs for a version
 */
function getMergedPRs(fromTag, toTag = 'HEAD') {
    console.log(`Fetching PRs from ${fromTag || 'beginning'} to ${toTag}...`);

    let gitLog = '';

    try {
        if (fromTag) {
            // Check if tag exists
            exec(`git rev-parse ${fromTag}`, { allowError: false });
            gitLog = exec(`git log ${fromTag}..${toTag} --merges --format="%H|%s|%an|%ae"`, { allowError: true });
        } else {
            gitLog = exec(`git log ${toTag} --merges --format="%H|%s|%an|%ae"`, { allowError: true });
        }
    } catch (error) {
        console.warn(`  Warning: Could not fetch git log (${error.message})`);
        console.warn(`  Continuing with empty PR list...`);
        return [];
    }

    if (!gitLog) {
        return [];
    }

    const prPattern = /Merge pull request #(\d+) from (.+)/;
    const prs = [];

    gitLog.split('\n').filter(Boolean).forEach(line => {
        const parts = line.split('|');
        if (parts.length >= 4) {
            const [hash, message, author, email] = parts;
            const match = message.match(prPattern);

            if (match) {
                prs.push({
                    number: match[1],
                    branch: match[2],
                    hash,
                    message,
                    author: { name: author, email }
                });
            }
        }
    });

    return prs;
}

/**
 * Get unique contributors
 */
function getContributors(prs) {
    const contributorsMap = new Map();
    
    prs.forEach(pr => {
        const key = pr.author.email;
        if (!contributorsMap.has(key)) {
            contributorsMap.set(key, {
                name: pr.author.name,
                email: pr.author.email,
                prCount: 0
            });
        }
        contributorsMap.get(key).prCount += 1;
    });
    
    return Array.from(contributorsMap.values()).sort((a, b) => b.prCount - a.prCount);
}

/**
 * Detect breaking changes
 */
function detectBreakingChanges(changelogData, version) {
    const release = changelogData.releases.find(r => r.version === version);
    if (!release || !release.sections) {
        return [];
    }
    
    const breakingChanges = [];
    
    // Check for explicit breaking changes or major version bump indicators
    Object.keys(release.sections).forEach(section => {
        const items = release.sections[section] || [];
        items.forEach(item => {
            const lowerItem = item.toLowerCase();
            if (lowerItem.includes('breaking') || 
                lowerItem.includes('incompatible') ||
                lowerItem.includes('removed') ||
                (section === 'removed' && !lowerItem.includes('deprecated'))) {
                breakingChanges.push({ section, item });
            }
        });
    });
    
    return breakingChanges;
}

/**
 * Generate highlights from changelog
 */
function generateHighlights(changelogData, version) {
    const release = changelogData.releases.find(r => r.version === version);
    if (!release || !release.sections) {
        return [];
    }
    
    const highlights = [];
    
    // Priority sections for highlights
    const prioritySections = ['added', 'changed', 'security'];
    
    prioritySections.forEach(section => {
        const items = release.sections[section] || [];
        // Take up to 3 items from high-priority sections
        items.slice(0, 3).forEach(item => {
            highlights.push({ section, item });
        });
    });
    
    return highlights.slice(0, 5); // Max 5 highlights
}

/**
 * Format release notes
 */
function formatReleaseNotes(options = {}) {
    const {
        version,
        changelogPath = 'CHANGELOG.md',
        includeContributors = true,
        includeBreakingChanges = true,
        includeHighlights = true
    } = options;
    
    if (!version) {
        throw new Error('Version is required');
    }
    
    console.log(`Generating release notes for version ${version}...`);
    
    // Parse changelog
    const changelogData = parseChangelog(changelogPath);
    const release = changelogData.releases.find(r => r.version === version);
    
    if (!release) {
        throw new Error(`Version ${version} not found in CHANGELOG`);
    }
    
    // Get previous version tag
    const tagsOutput = exec('git tag --sort=-version:refname', { allowError: true });
    const tags = tagsOutput ? tagsOutput.split('\n').filter(Boolean) : [];
    const currentTag = `v${version}`;
    const currentTagIndex = tags.indexOf(currentTag);
    const previousTag = currentTagIndex >= 0 && currentTagIndex < tags.length - 1 ? tags[currentTagIndex + 1] : null;
    
    // Get PRs and contributors
    const prs = getMergedPRs(previousTag, currentTag);
    const contributors = getContributors(prs);
    
    // Detect breaking changes
    const breakingChanges = includeBreakingChanges ? detectBreakingChanges(changelogData, version) : [];
    
    // Generate highlights
    const highlights = includeHighlights ? generateHighlights(changelogData, version) : [];
    
    // Build release notes
    let notes = `# Release ${version}\n\n`;
    
    // Highlights section
    if (highlights.length > 0) {
        notes += `## ✨ Highlights\n\n`;
        highlights.forEach(h => {
            notes += `- **${h.section.charAt(0).toUpperCase() + h.section.slice(1)}**: ${h.item}\n`;
        });
        notes += '\n';
    }
    
    // Breaking changes warning
    if (breakingChanges.length > 0) {
        notes += `## ⚠️ Breaking Changes\n\n`;
        notes += `This release contains **${breakingChanges.length}** breaking change(s):\n\n`;
        breakingChanges.forEach(bc => {
            notes += `- ${bc.item}\n`;
        });
        notes += '\n';
        notes += `Please review the migration guide and update your code accordingly.\n\n`;
    }
    
    // Grouped changes
    notes += `## 📋 Changes\n\n`;
    
    const sectionOrder = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security', 'documentation', 'performance'];
    const sectionEmojis = {
        added: '✨',
        changed: '🔄',
        deprecated: '⚠️',
        removed: '🗑️',
        fixed: '🐛',
        security: '🔒',
        documentation: '📚',
        performance: '⚡'
    };
    
    sectionOrder.forEach(section => {
        const items = release.sections[section] || [];
        if (items.length > 0) {
            const emoji = sectionEmojis[section] || '•';
            const title = section.charAt(0).toUpperCase() + section.slice(1);
            notes += `### ${emoji} ${title}\n\n`;
            items.forEach(item => {
                notes += `- ${item}\n`;
            });
            notes += '\n';
        }
    });
    
    // Contributors section
    if (includeContributors && contributors.length > 0) {
        notes += `## 👥 Contributors\n\n`;
        notes += `This release was made possible by ${contributors.length} contributor(s):\n\n`;
        contributors.forEach(c => {
            notes += `- **${c.name}** (${c.prCount} PR${c.prCount > 1 ? 's' : ''})\n`;
        });
        notes += '\n';
        notes += `Thank you to everyone who contributed to this release! 🎉\n\n`;
    }
    
    // Installation/upgrade section
    notes += `## 📦 Installation\n\n`;
    notes += `\`\`\`bash\n`;
    notes += `# Update to version ${version}\n`;
    notes += `npm install @lightspeedwp/github-community-health@${version}\n`;
    notes += `\`\`\`\n\n`;
    
    // Metadata
    notes += `---\n\n`;
    notes += `**Full Changelog**: `;
    if (previousTag) {
        notes += `[\`${previousTag}...v${version}\`](../../compare/${previousTag}...v${version})\n`;
    } else {
        notes += `[View all changes](../../commits/v${version})\n`;
    }
    
    return notes;
}

/**
 * Main function
 */
async function run() {
    try {
        const args = process.argv.slice(2);
        
        // Parse arguments
        let version = null;
        let outputFile = null;
        let format = 'markdown';
        
        for (let i = 0; i < args.length; i++) {
            if (args[i].startsWith('--version=')) {
                version = args[i].split('=')[1];
            } else if (args[i].startsWith('--output=')) {
                outputFile = args[i].split('=')[1];
            } else if (args[i].startsWith('--format=')) {
                format = args[i].split('=')[1];
            } else if (args[i] === '--latest') {
                // Get latest version from changelog
                const changelogData = parseChangelog('CHANGELOG.md');
                const latest = getLatestRelease(changelogData);
                version = latest ? latest.version : null;
            } else if (!args[i].startsWith('--')) {
                version = args[i];
            }
        }
        
        if (!version) {
            console.error('Usage: release-notes-manager.agent.cjs [--version=X.Y.Z | --latest] [--output=file.md] [--format=markdown]');
            console.error('');
            console.error('Examples:');
            console.error('  node release-notes-manager.agent.cjs --version=1.0.0');
            console.error('  node release-notes-manager.agent.cjs --latest');
            console.error('  node release-notes-manager.agent.cjs 1.0.0 --output=RELEASE_NOTES.md');
            process.exit(1);
        }
        
        console.log('╔════════════════════════════════════════╗');
        console.log('║   Release Notes Manager Agent          ║');
        console.log('╚════════════════════════════════════════╝\n');
        
        const notes = formatReleaseNotes({ version });
        
        if (outputFile) {
            fs.writeFileSync(outputFile, notes, 'utf8');
            console.log(`\n✅ Release notes written to: ${outputFile}`);
        } else {
            console.log('\n' + notes);
        }
        
    } catch (error) {
        console.error('\n❌ Failed to generate release notes:', error.message);
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
    formatReleaseNotes,
    getMergedPRs,
    getContributors,
    detectBreakingChanges,
    generateHighlights
};
