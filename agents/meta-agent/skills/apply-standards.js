const fs = require("fs");

const UK_ENGLISH_MAP = {
  optimization: "optimisation",
  optimized: "optimised",
  optimize: "optimise",
  organization: "organisation",
  organizational: "organisational",
  organized: "organised",
  organizes: "organises",
  organize: "organise",
  organizer: "organiser",
  behavior: "behaviour",
  behaviors: "behaviours",
  behavioral: "behavioural",
  color: "colour",
  colors: "colours",
  customization: "customisation",
  customized: "customised",
  customize: "customise",
  normalization: "normalisation",
  normalized: "normalised",
  normalize: "normalise",
  memorization: "memorisation",
  memorized: "memorised",
  memorize: "memorise",
  initialization: "initialisation",
  initialized: "initialised",
  initialize: "initialise",
  realization: "realisation",
  realized: "realised",
  realize: "realise",
};

/**
 * Applies UK English corrections to text.
 * @param {string} text - Text to correct
 * @returns {string} Corrected text
 */
function applyUkEnglish(text) {
  let corrected = text;
  for (const [us, uk] of Object.entries(UK_ENGLISH_MAP)) {
    const regex = new RegExp(`\\b${us}\\b`, "gi");
    corrected = corrected.replace(regex, (match) => {
      if (match === us) {
        return uk; // All lowercase
      }
      if (match[0] === us[0].toUpperCase()) {
        return uk[0].toUpperCase() + uk.slice(1); // Capitalized
      }
      if (match === us.toUpperCase()) {
        return uk.toUpperCase(); // All caps
      }
      return uk;
    });
  }
  return corrected;
}

/**
 * Generates a footer block for a file based on repo type.
 * @param {string} repoType - Type of repository
 * @param {object} frontmatter - File frontmatter
 * @returns {string} Footer block markdown
 */
function generateFooter(repoType, frontmatter) {
  const now = new Date().toISOString().split("T")[0];
  const status = frontmatter.status || "active";
  const lastUpdated = frontmatter.last_updated || now;

  let footer = "\n---\n\n";

  switch (repoType) {
    case "block-plugin":
      footer += `**Status:** ${status}\n`;
      footer += `**Last Updated:** ${lastUpdated}\n`;
      if (frontmatter.version) {
        footer += `**Version:** ${frontmatter.version}\n`;
      }
      if (frontmatter.author) {
        footer += `**Author:** ${frontmatter.author}\n`;
      }
      break;

    case "block-theme":
      footer += `**Status:** ${status}\n`;
      footer += `**Last Updated:** ${lastUpdated}\n`;
      if (frontmatter.version) {
        footer += `**Version:** ${frontmatter.version}\n`;
      }
      break;

    case "control-plane":
      footer += `**Maintainer:** ${frontmatter.maintainer || "LightSpeed"}\n`;
      footer += `**Status:** ${status}\n`;
      footer += `**Last Updated:** ${lastUpdated}\n`;
      break;

    default:
      footer += `**Status:** ${status}\n`;
      footer += `**Last Updated:** ${lastUpdated}\n`;
  }

  return footer;
}

/**
 * Applies standards to a markdown file.
 * @param {string} filePath - Path to markdown file
 * @param {object} options - Options including repoType, dryRun
 * @returns {object} Result with applied changes
 */
function applyStandards(filePath, options = {}) {
  const { repoType = "generic", dryRun = false } = options;

  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      error: `File not found: ${filePath}`,
      changes: [],
    };
  }

  const content = fs.readFileSync(filePath, "utf8");

  // Check for opt-out marker
  if (
    content.includes("<!-- meta:ignore -->") ||
    content.includes("meta:ignore")
  ) {
    return {
      success: true,
      skipped: true,
      reason: "File marked with meta:ignore",
      changes: [],
    };
  }

  const changes = [];
  let updated = content;

  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
  let frontmatter = {};
  let body = content;

  if (frontmatterMatch) {
    try {
      const yaml = require("js-yaml");
      frontmatter = yaml.load(frontmatterMatch[1]) || {};
      body = frontmatterMatch[2];
    } catch (err) {
      return {
        success: false,
        error: `YAML parsing error: ${err.message}`,
        changes: [],
      };
    }
  }

  // Apply UK English corrections
  const ukBody = applyUkEnglish(body);
  if (ukBody !== body) {
    changes.push("Applied UK English corrections");
    updated = updated.replace(body, ukBody);
    body = ukBody;
  }

  // Ensure frontmatter has required fields
  if (!frontmatter.status) {
    frontmatter.status = "active";
    changes.push("Added default status field");
  }

  if (!frontmatter.last_updated) {
    frontmatter.last_updated = new Date().toISOString().split("T")[0];
    changes.push("Added last_updated field");
  }

  if (!frontmatter.language) {
    frontmatter.language = "en";
    changes.push("Added language field");
  }

  // Add footer if not present
  if (!body.includes("---") || !body.slice(-20).includes("---")) {
    const footer = generateFooter(repoType, frontmatter);
    changes.push("Added footer block");
    body += footer;
  }

  // Rebuild content with updated frontmatter
  if (frontmatterMatch) {
    const yaml = require("js-yaml");
    const frontmatterStr = yaml.dump(frontmatter, { lineWidth: -1 });
    updated = `---\n${frontmatterStr}---\n${body}`;
  }

  // Write if not dry-run
  if (!dryRun && changes.length > 0) {
    fs.writeFileSync(filePath, updated, "utf8");
  }

  return {
    success: true,
    skipped: false,
    changes,
    dryRun,
    filePath,
  };
}

/**
 * CLI interface for apply-standards skill.
 */
async function run(options = {}) {
  const {
    filePath,
    repoType = "generic",
    dryRun = false,
    json = false,
  } = options;

  if (!filePath) {
    throw new Error("filePath is required");
  }

  const result = applyStandards(filePath, { repoType, dryRun });

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.success) {
      if (result.skipped) {
        console.log(`⊘ Skipped: ${filePath} (${result.reason})`);
      } else {
        console.log(`✓ Applied standards to ${filePath}`);
        if (result.changes.length > 0) {
          result.changes.forEach((change) => console.log(`  - ${change}`));
        }
        if (dryRun) {
          console.log("  (dry-run: no changes written)");
        }
      }
    } else {
      console.log(`✗ Error: ${result.error}`);
    }
  }

  return result;
}

module.exports = { applyStandards, applyUkEnglish, generateFooter, run };
