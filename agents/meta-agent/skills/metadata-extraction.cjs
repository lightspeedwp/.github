const fs = require("fs");
const path = require("path");

/**
 * Extracts metadata from repository files based on repo type.
 * @param {string} repoRoot - Root directory of the repository
 * @param {string} repoType - Type of repository (block-plugin, block-theme, etc.)
 * @returns {object} Extracted metadata
 */
function extractMetadata(repoRoot, repoType) {
  const metadata = {
    repoType,
    files: [],
    foundMarkers: {},
  };

  switch (repoType) {
    case "block-plugin":
      metadata.foundMarkers.blockJson = fs.existsSync(
        path.join(repoRoot, "block.json"),
      );
      metadata.foundMarkers.composerJson = fs.existsSync(
        path.join(repoRoot, "composer.json"),
      );
      if (metadata.foundMarkers.blockJson) {
        try {
          metadata.blockMetadata = JSON.parse(
            fs.readFileSync(path.join(repoRoot, "block.json"), "utf8"),
          );
        } catch (err) {
          // Ignore malformed JSON
        }
      }
      break;

    case "block-theme":
      metadata.foundMarkers.themeJson = fs.existsSync(
        path.join(repoRoot, "theme.json"),
      );
      metadata.foundMarkers.styleCss = fs.existsSync(
        path.join(repoRoot, "style.css"),
      );
      if (metadata.foundMarkers.themeJson) {
        try {
          metadata.themeMetadata = JSON.parse(
            fs.readFileSync(path.join(repoRoot, "theme.json"), "utf8"),
          );
        } catch (err) {
          // Ignore malformed JSON
        }
      }
      break;

    case "control-plane":
      metadata.foundMarkers.agents = fs.existsSync(
        path.join(repoRoot, ".github", "agents"),
      );
      metadata.foundMarkers.workflows = fs.existsSync(
        path.join(repoRoot, ".github", "workflows"),
      );
      break;

    default:
      break;
  }

  return metadata;
}

/**
 * CLI interface for metadata extraction skill.
 */
async function run(options = {}) {
  const { repoRoot = process.cwd(), repoType } = options;

  if (!repoType) {
    throw new Error("repoType is required");
  }

  const metadata = extractMetadata(repoRoot, repoType);

  if (options.json) {
    console.log(JSON.stringify(metadata, null, 2));
  } else {
    console.log(`Extracted metadata for ${repoType} repository:`);
    console.log(JSON.stringify(metadata, null, 2));
  }

  return metadata;
}

module.exports = { extractMetadata, run };
