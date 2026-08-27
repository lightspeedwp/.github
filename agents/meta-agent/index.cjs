/**
 * Meta Agent v2.0 - Organisation-wide metadata and standards orchestrator.
 * Imports and coordinates all skills for managing documentation metadata.
 */

const skills = {
  "repo-type-detection": require("./skills/repo-type-detection.cjs"),
  "frontmatter-validation": require("./skills/frontmatter-validation.cjs"),
  "metadata-extraction": require("./skills/metadata-extraction.cjs"),
  "apply-standards": require("./skills/apply-standards.cjs"),
  "generate-badges": require("./skills/generate-badges.cjs"),
};

/**
 * Gets help documentation for all skills.
 */
function getHelp() {
  return `
Meta Agent v2.0 - Organisation-wide Metadata & Standards

SKILLS:
  repo-type-detection     Detect repository type from filesystem markers
  frontmatter-validation  Validate markdown frontmatter against schemas
  metadata-extraction     Extract metadata from repo files
  apply-standards         Apply UK English and standard formatting to files
  generate-badges         Generate repo-specific badges for documentation

USAGE:
  node index.js <skill> [options]

EXAMPLES:
  node index.js repo-type-detection
  node index.js apply-standards --filePath README.md --repoType block-plugin
  node index.js generate-badges --repoType block-theme --injectTo README.md

OPTIONS:
  --help                  Show this help message
  --json                  Output results as JSON
  --dryRun               Run without making changes (apply-standards)
  --filePath             Path to markdown file
  --repoType             Type of repository (block-plugin, block-theme, control-plane)
  --repoRoot             Root directory to scan (default: current directory)
  --schemaPath           Path to JSON schema file
  --injectTo             Position to inject badges (top, after-frontmatter)
`;
}

/**
 * Parses CLI arguments into options object.
 */
function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const value = args[i + 1]?.startsWith("--") ? true : args[i + 1];
      options[key] =
        value === "true" ? true : value === "false" ? false : value;
      if (value && !value.startsWith("--")) i++;
    }
  }
  return options;
}

/**
 * Main CLI entry point.
 */
async function main(args) {
  const skillName = args[0];
  const options = parseArgs(args.slice(1));

  // Show help
  if (options.help || !skillName) {
    console.log(getHelp());
    process.exit(0);
  }

  // Validate skill exists
  if (!skills[skillName]) {
    console.error(`Error: Unknown skill '${skillName}'`);
    console.error(`Available skills: ${Object.keys(skills).join(", ")}`);
    process.exit(1);
  }

  // Run skill
  try {
    const skill = skills[skillName];
    const result = await skill.run(options);

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    }

    // Exit with appropriate code
    process.exit(result.success === false || result.error ? 1 : 0);
  } catch (error) {
    console.error(`Error running skill '${skillName}':`, error.message);
    if (options.json) {
      console.log(
        JSON.stringify({ success: false, error: error.message }, null, 2),
      );
    }
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = {
  skills,
  getHelp,
  parseArgs,
  repoTypeDetection: skills["repo-type-detection"],
  fronmatterValidation: skills["frontmatter-validation"],
  metadataExtraction: skills["metadata-extraction"],
  applyStandards: skills["apply-standards"],
  generateBadges: skills["generate-badges"],
};

// Run CLI if called directly
if (require.main === module) {
  main(process.argv.slice(2));
}
