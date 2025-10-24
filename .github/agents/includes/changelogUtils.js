/**
 * changelogUtils.js
 * Utilities for validating and updating CHANGELOG.md files.
 */

const fs = require('fs');

/**
 * Validate that all [Unreleased] changelog entries have a PR/Issue/Commit link.
 * Returns array of lines missing a link.
 */
function validateChangelogLinks(changelogPath = 'CHANGELOG.md') {
    if (!fs.existsSync(changelogPath)) {
        return [];
    }
    const content = fs.readFileSync(changelogPath, 'utf-8');
    // Extract [Unreleased] block
    const match = content.match(/^## \[Unreleased\][\s\S]*?(?=^## \[|$)/m);
    if (!match) {
        return [];
    }
    const unreleasedBlock = match[0];
    const lines = unreleasedBlock.split('\n');
    const missingLinks = [];
    for (const line of lines) {
        if (
            /^-/.test(line) &&
            !/(#[0-9]+|\[.*\]\(https:\/\/github.com\/.*\/(pull|issues|commit)\/[^)]+\))/.test(
                line
            )
        ) {
            missingLinks.push(line);
        }
    }
    return missingLinks;
}

module.exports = {
    validateChangelogLinks,
};
