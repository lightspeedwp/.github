/**
 * Keep a Changelog Parser
 * Parse and manipulate Keep a Changelog 1.1.0 format
 */

const fs = require('fs');

/**
 * Parse a CHANGELOG.md file in Keep a Changelog format
 * @param {string} changelogPath
 * @returns {Object} Parsed changelog with unreleased entries and releases
 */
function parseChangelog(changelogPath) {
  const content = fs.readFileSync(changelogPath, 'utf8');

  const result = {
    unreleased: [],
    releases: {},
    dates: {},
    content,
  };

  // Extract [Unreleased] section
  const unreleasedMatch = content.match(
    /## \[Unreleased\]\n([\s\S]*?)(?=\n## \[[\d.]+\]|\n\[Unreleased\]:|$)/
  );

  if (unreleasedMatch) {
    const unreleasedContent = unreleasedMatch[1];
    result.unreleased = parseSection(unreleasedContent);
  }

  // Extract release sections
  const releasePattern = /## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?\n([\s\S]*?)(?=\n## \[|$)/g;
  let match;

  while ((match = releasePattern.exec(content)) !== null) {
    const [, version, date, sectionContent] = match;
    if (version !== 'Unreleased') {
      result.releases[version] = parseSection(sectionContent);
      if (date) {
        result.dates[version] = date;
      }
    }
  }

  return result;
}

/**
 * Parse a changelog section into entries
 * @param {string} sectionContent
 * @returns {Array} Array of entries { category, items }
 */
function parseSection(sectionContent) {
  const entries = [];
  const lines = sectionContent.split('\n').filter((line) => line.trim());

  let currentCategory = null;
  let currentItems = [];

  for (const line of lines) {
    if (line.startsWith('### ')) {
      // New category
      if (currentCategory && currentItems.length > 0) {
        entries.push({
          category: currentCategory,
          items: currentItems,
        });
      }
      currentCategory = line.replace('### ', '').trim();
      currentItems = [];
    } else if (line.startsWith('- ')) {
      // List item
      currentItems.push(line.replace('- ', '').trim());
    }
  }

  // Push last category
  if (currentCategory && currentItems.length > 0) {
    entries.push({
      category: currentCategory,
      items: currentItems,
    });
  }

  return entries;
}

/**
 * Get [Unreleased] entries from parsed changelog
 * @param {Object} parsed - Parsed changelog from parseChangelog()
 * @returns {Array} Unreleased entries
 */
function getUnreleasedEntries(parsed) {
  return parsed.unreleased;
}

/**
 * Convert [Unreleased] section to a release section
 * @param {string} changelogContent
 * @param {string} version - New version (e.g. "1.2.3")
 * @param {string} date - Release date (e.g. "2026-08-09")
 * @returns {string} Updated changelog content
 */
function convertUnreleasedToRelease(changelogContent, version, date) {
  // Replace [Unreleased] with [version] - date
  const updated = changelogContent.replace(
    /## \[Unreleased\]/,
    `## [${version}] - ${date}`
  );

  // Update links section if it exists
  // Change [Unreleased]: ...compare/vX.Y.Z...HEAD
  // To [Unreleased]: ...compare/vX.Y.Z...vNEW.VERSION
  // And add [vX.Y.Z]: ...tag/vX.Y.Z

  return updated;
}

/**
 * Get changelog excerpt for a specific version
 * @param {Object} parsed
 * @param {string} version
 * @returns {string} Changelog text for that release
 */
function getChangelogExcerpt(parsed, version) {
  if (!parsed.releases[version]) {
    return '';
  }

  const sections = parsed.releases[version];
  let excerpt = '';

  for (const section of sections) {
    excerpt += `### ${section.category}\n`;
    for (const item of section.items) {
      excerpt += `- ${item}\n`;
    }
    excerpt += '\n';
  }

  return excerpt.trim();
}

/**
 * Append a new entry to [Unreleased] section
 * @param {string} changelogContent
 * @param {Object} entry - { category, text }
 * @returns {string} Updated changelog content
 */
function appendEntry(changelogContent, entry) {
  const { category = 'Changed', text = '' } = entry;

  // Find [Unreleased] section
  const unreleasedRegex = /## \[Unreleased\]\n([\s\S]*?)(?=\n### |$)/;
  const match = changelogContent.match(unreleasedRegex);

  if (!match) {
    // Create [Unreleased] section if missing
    const newSection = `## [Unreleased]\n\n### ${category}\n- ${text}\n\n`;
    return newSection + changelogContent;
  }

  // Check if category already exists in [Unreleased]
  const categoryRegex = new RegExp(`### ${category}\\n([\\s\\S]*?)(?=\\n###|$)`, 'i');
  const categoryMatch = match[1].match(categoryRegex);

  if (categoryMatch) {
    // Add to existing category
    const updated = match[1].replace(
      categoryMatch[0],
      `### ${category}\n${categoryMatch[1]}- ${text}\n`
    );
    return changelogContent.replace(match[0], `## [Unreleased]\n${updated}`);
  }

  // Create new category in [Unreleased]
  const updated = match[1].replace(
    /$/,
    `\n### ${category}\n- ${text}`
  );
  return changelogContent.replace(match[0], `## [Unreleased]\n${updated}`);
}

/**
 * Write updated changelog back to file
 * @param {string} changelogPath
 * @param {string} content
 * @returns {boolean}
 */
function writeChangelog(changelogPath, content) {
  try {
    fs.writeFileSync(changelogPath, content, 'utf8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all versions in order (newest first)
 * @param {Object} parsed
 * @returns {string[]}
 */
function getVersions(parsed) {
  return Object.keys(parsed.releases);
}

/**
 * Check if a version exists
 * @param {Object} parsed
 * @param {string} version
 * @returns {boolean}
 */
function versionExists(parsed, version) {
  return version in parsed.releases;
}

module.exports = {
  parseChangelog,
  parseSection,
  getUnreleasedEntries,
  convertUnreleasedToRelease,
  getChangelogExcerpt,
  appendEntry,
  writeChangelog,
  getVersions,
  versionExists,
};
