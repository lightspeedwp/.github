const fs = require('fs');
const path = require('path');

/**
 * Detects the repository type based on filesystem markers.
 * @param {string} repoRoot - Root directory of the repository
 * @returns {string} Repository type: 'block-plugin', 'block-theme', 'control-plane', 'documentation', or 'generic'
 */
function detectRepoType(repoRoot) {
  // Block Plugin: block.json or {plugin-name}.php with Block Name header
  if (fs.existsSync(path.join(repoRoot, 'block.json'))) {
    return 'block-plugin';
  }

  const phpFiles = fs.readdirSync(repoRoot, { withFileTypes: true })
    .filter(f => f.isFile() && f.name.endsWith('.php'));

  for (const file of phpFiles) {
    const content = fs.readFileSync(path.join(repoRoot, file.name), 'utf8');
    if (content.includes('Block Name:') || content.includes('block_name')) {
      return 'block-plugin';
    }
  }

  // Block Theme: theme.json + style.css with Text Domain header
  if (fs.existsSync(path.join(repoRoot, 'theme.json')) &&
      fs.existsSync(path.join(repoRoot, 'style.css'))) {
    const styleContent = fs.readFileSync(path.join(repoRoot, 'style.css'), 'utf8');
    if (styleContent.includes('Text Domain:')) {
      return 'block-theme';
    }
  }

  // Control-Plane: .github directory with agents structure
  if (fs.existsSync(path.join(repoRoot, '.github', 'agents'))) {
    return 'control-plane';
  }

  // Documentation Repo: docs/ directory or extensive markdown
  if (fs.existsSync(path.join(repoRoot, 'docs'))) {
    return 'documentation';
  }

  return 'generic';
}

/**
 * CLI interface for repo type detection skill.
 */
async function run(options = {}) {
  const { repoRoot = process.cwd() } = options;
  const repoType = detectRepoType(repoRoot);

  if (options.json) {
    console.log(JSON.stringify({ repoType }, null, 2));
  } else {
    console.log(`Detected repo type: ${repoType}`);
  }

  return repoType;
}

module.exports = { detectRepoType, run };
