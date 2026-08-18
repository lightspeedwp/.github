const fs = require('fs');
const path = require('path');

/**
 * Generates badges for a repository based on type and available metadata.
 * @param {string} repoRoot - Root directory of repository
 * @param {string} repoType - Type of repository
 * @returns {object} Badge configuration
 */
function generateBadges(repoRoot, repoType) {
  const badges = [];
  const packageJsonPath = path.join(repoRoot, 'package.json');
  const composerJsonPath = path.join(repoRoot, 'composer.json');

  // Get repo name from package.json or composer.json
  let repoName = 'repo';
  let version = '';
  let license = '';

  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      repoName = pkg.name || 'repo';
      version = pkg.version || '';
      license = pkg.license || 'MIT';
    } catch (err) {
      // ignore parse errors
    }
  }

  if (fs.existsSync(composerJsonPath)) {
    try {
      const composer = JSON.parse(fs.readFileSync(composerJsonPath, 'utf8'));
      repoName = composer.name || repoName;
      version = composer.version || version;
      license = (composer.license && Array.isArray(composer.license)) ? composer.license[0] : 'MIT';
    } catch (err) {
      // ignore parse errors
    }
  }

  // Build badges array based on repo type
  switch (repoType) {
    case 'block-plugin':
      badges.push({
        name: 'CI Status',
        badge: '![CI](https://github.com/lightspeedwp/.github/workflows/ci.yml/badge.svg)',
        link: 'https://github.com/lightspeedwp/.github/actions',
      });
      badges.push({
        name: 'License',
        badge: `![License: ${license}](https://img.shields.io/badge/License-${license}-blue.svg)`,
      });
      if (version) {
        badges.push({
          name: 'Version',
          badge: `![Version: ${version}](https://img.shields.io/badge/Version-${version}-brightgreen.svg)`,
        });
      }
      break;

    case 'block-theme':
      badges.push({
        name: 'CI Status',
        badge: '![CI](https://github.com/lightspeedwp/.github/workflows/ci.yml/badge.svg)',
        link: 'https://github.com/lightspeedwp/.github/actions',
      });
      badges.push({
        name: 'License',
        badge: `![License: ${license}](https://img.shields.io/badge/License-${license}-blue.svg)`,
      });
      if (version) {
        badges.push({
          name: 'Version',
          badge: `![Version: ${version}](https://img.shields.io/badge/Version-${version}-brightgreen.svg)`,
        });
      }
      break;

    case 'control-plane':
      badges.push({
        name: 'Governance',
        badge: '![Active](https://img.shields.io/badge/Status-Active-success.svg)',
      });
      badges.push({
        name: 'Maintained By',
        badge: '![Maintained: LightSpeed](https://img.shields.io/badge/Maintained%20By-LightSpeed-blue.svg)',
      });
      break;

    default:
      badges.push({
        name: 'Status',
        badge: '![Active](https://img.shields.io/badge/Status-Active-success.svg)',
      });
  }

  return {
    repoName,
    repoType,
    badges,
    markdownBlock: formatBadgesAsMarkdown(badges, repoType),
  };
}

/**
 * Formats badges as a markdown block.
 * @param {array} badges - Array of badge objects
 * @param {string} repoType - Type of repository
 * @returns {string} Markdown formatted badge block
 */
function formatBadgesAsMarkdown(badges, repoType) {
  let markdown = '';

  if (repoType === 'control-plane') {
    // For control-plane, badges go at the top
    markdown = badges.map(b => b.link ? `[${b.badge}](${b.link})` : b.badge).join(' ');
  } else {
    // For plugins/themes, create a badge section
    markdown = '## Badges\n\n';
    markdown += badges.map(b => `${b.name}: ${b.link ? `[${b.badge}](${b.link})` : b.badge}`).join('\n\n');
  }

  return markdown;
}

/**
 * Injects badges into a markdown file at the specified location.
 * @param {string} filePath - Path to markdown file
 * @param {string} badgesBlock - Formatted badges markdown
 * @param {string} position - Where to insert: 'top' or 'after-frontmatter'
 * @returns {object} Result of injection
 */
function injectBadges(filePath, badgesBlock, position = 'after-frontmatter') {
  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      error: `File not found: ${filePath}`,
    };
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if badges already exist
  if (content.includes('## Badges') || content.includes('<!-- badges -->')) {
    return {
      success: false,
      alreadyExists: true,
      message: 'Badges block already exists',
    };
  }

  if (position === 'after-frontmatter') {
    const frontmatterMatch = content.match(/^---\n[\s\S]*?\n---\n/);
    if (frontmatterMatch) {
      const insertPoint = frontmatterMatch[0].length;
      content = content.slice(0, insertPoint) + '\n' + badgesBlock + '\n' + content.slice(insertPoint);
    } else {
      content = badgesBlock + '\n\n' + content;
    }
  } else if (position === 'top') {
    content = badgesBlock + '\n\n' + content;
  }

  return {
    success: true,
    filePath,
    position,
    content,
  };
}

/**
 * CLI interface for generate-badges skill.
 */
async function run(options = {}) {
  const { repoRoot = process.cwd(), repoType = 'generic', filePath, injectTo, json = false } = options;

  const result = generateBadges(repoRoot, repoType);

  if (filePath && injectTo) {
    const injectionResult = injectBadges(filePath, result.markdownBlock, injectTo);
    if (injectionResult.success) {
      fs.writeFileSync(filePath, injectionResult.content, 'utf8');
      if (!json) {
        console.log(`✓ Injected badges into ${filePath}`);
      }
    } else {
      if (!json) {
        console.log(`⊘ ${injectionResult.message}`);
      }
    }
    Object.assign(result, injectionResult);
  }

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Generated badges for ${repoType} repository:`);
    result.badges.forEach(b => console.log(`  - ${b.name}`));
  }

  return result;
}

module.exports = { generateBadges, formatBadgesAsMarkdown, injectBadges, run };
