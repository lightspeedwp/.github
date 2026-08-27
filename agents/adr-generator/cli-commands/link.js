const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Create a relationship link between two ADRs
 * Adds target ADR to the source ADR's relates_to array
 */
async function execute(parsed, config) {
  try {
    // Parse arguments
    const sourceAdrPath = parsed.positional[0];
    const targetAdrPath = parsed.positional[1];

    if (!sourceAdrPath || !targetAdrPath) {
      console.error("Error: Both source and target ADR paths are required");
      console.error("Usage: adr link <source-adr-path> <target-adr-path>");
      return 4; // Input validation error
    }

    // Resolve paths
    const sourcePath = path.resolve(sourceAdrPath);
    const targetPath = path.resolve(targetAdrPath);

    // Validate files exist
    if (!fs.existsSync(sourcePath)) {
      console.error(`Error: Source ADR file not found: ${sourceAdrPath}`);
      return 1;
    }

    if (!fs.existsSync(targetPath)) {
      console.error(`Error: Target ADR file not found: ${targetAdrPath}`);
      return 1;
    }

    // Read and parse source ADR
    const sourceContent = fs.readFileSync(sourcePath, "utf8");
    let sourceAdr;
    try {
      sourceAdr = yaml.load(sourceContent);
    } catch (error) {
      console.error(`Error: Invalid YAML in source ADR: ${error.message}`);
      return 1;
    }

    // Read and parse target ADR (just to validate it exists and is valid)
    const targetContent = fs.readFileSync(targetPath, "utf8");
    let targetAdr;
    try {
      targetAdr = yaml.load(targetContent);
    } catch (error) {
      console.error(`Error: Invalid YAML in target ADR: ${error.message}`);
      return 1;
    }

    // Validate ADR structures
    if (!sourceAdr || typeof sourceAdr !== "object") {
      console.error("Error: Invalid source ADR format");
      return 1;
    }

    if (!targetAdr || typeof targetAdr !== "object") {
      console.error("Error: Invalid target ADR format");
      return 1;
    }

    // Get ADR IDs
    const sourceId =
      sourceAdr.id || path.basename(sourcePath, ".md").replace(/^adr-/, "");
    const targetId =
      targetAdr.id || path.basename(targetPath, ".md").replace(/^adr-/, "");

    // Validate no self-link
    if (sourceId === targetId) {
      console.error("Error: Source and target ADR cannot be the same");
      return 1;
    }

    // Add to relates_to array
    if (!sourceAdr.relates_to) {
      sourceAdr.relates_to = [];
    }
    if (!Array.isArray(sourceAdr.relates_to)) {
      sourceAdr.relates_to = [sourceAdr.relates_to];
    }

    // Check if link already exists
    if (sourceAdr.relates_to.includes(targetId)) {
      console.log(`ℹ Link already exists between ${sourceId} and ${targetId}`);
      return 0; // Already linked, not an error
    }

    sourceAdr.relates_to.push(targetId);

    // Write source file
    const sourceUpdated = yaml.dump(sourceAdr, {
      indent: 2,
      lineWidth: -1,
    });

    fs.writeFileSync(sourcePath, sourceUpdated, "utf8");

    console.log(`✓ Link created between ADRs`);
    console.log(`  Source: ${sourceId}`);
    console.log(`  Target: ${targetId}`);

    return 0; // Success
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 2; // Unexpected error
  }
}

module.exports = { execute };
