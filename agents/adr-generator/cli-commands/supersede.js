const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Mark an ADR as superseded by another ADR
 * Updates both the old ADR (superseded status) and new ADR (supersedes reference)
 */
async function execute(parsed, config) {
  try {
    // Parse arguments
    const oldAdrPath = parsed.positional[0];
    const newAdrPath = parsed.positional[1];

    if (!oldAdrPath || !newAdrPath) {
      console.error("Error: Both old and new ADR paths are required");
      console.error("Usage: adr supersede <old-adr-path> <new-adr-path>");
      return 4; // Input validation error
    }

    // Resolve paths
    const oldPath = path.resolve(oldAdrPath);
    const newPath = path.resolve(newAdrPath);

    // Validate files exist
    if (!fs.existsSync(oldPath)) {
      console.error(`Error: Old ADR file not found: ${oldAdrPath}`);
      return 1;
    }

    if (!fs.existsSync(newPath)) {
      console.error(`Error: New ADR file not found: ${newAdrPath}`);
      return 1;
    }

    // Read and parse old ADR
    const oldContent = fs.readFileSync(oldPath, "utf8");
    let oldAdr;
    try {
      oldAdr = yaml.load(oldContent);
    } catch (error) {
      console.error(`Error: Invalid YAML in old ADR: ${error.message}`);
      return 1;
    }

    // Read and parse new ADR
    const newContent = fs.readFileSync(newPath, "utf8");
    let newAdr;
    try {
      newAdr = yaml.load(newContent);
    } catch (error) {
      console.error(`Error: Invalid YAML in new ADR: ${error.message}`);
      return 1;
    }

    // Validate ADR structures
    if (!oldAdr || typeof oldAdr !== "object") {
      console.error("Error: Invalid old ADR format");
      return 1;
    }

    if (!newAdr || typeof newAdr !== "object") {
      console.error("Error: Invalid new ADR format");
      return 1;
    }

    // Get ADR IDs
    const oldId =
      oldAdr.id || path.basename(oldPath, ".md").replace(/^adr-/, "");
    const newId =
      newAdr.id || path.basename(newPath, ".md").replace(/^adr-/, "");

    // Validate no circular references
    if (oldId === newId) {
      console.error("Error: Old and new ADR cannot be the same");
      return 1;
    }

    if (newAdr.supersedes && newAdr.supersedes.includes(oldId)) {
      console.error("Error: Circular reference detected");
      return 1;
    }

    // Update old ADR
    oldAdr.status = "Superseded";
    oldAdr.superseded_by = newId;
    oldAdr.superseded_date = new Date().toISOString().split("T")[0];

    // Update new ADR
    if (!newAdr.supersedes) {
      newAdr.supersedes = [];
    }
    if (!Array.isArray(newAdr.supersedes)) {
      newAdr.supersedes = [newAdr.supersedes];
    }
    if (!newAdr.supersedes.includes(oldId)) {
      newAdr.supersedes.push(oldId);
    }

    // Write both files
    const oldUpdated = yaml.dump(oldAdr, {
      indent: 2,
      lineWidth: -1,
    });

    const newUpdated = yaml.dump(newAdr, {
      indent: 2,
      lineWidth: -1,
    });

    fs.writeFileSync(oldPath, oldUpdated, "utf8");
    fs.writeFileSync(newPath, newUpdated, "utf8");

    console.log(`✓ ADR superseded: ${path.basename(oldAdrPath)}`);
    console.log(`  Status: ${oldAdr.status}`);
    console.log(`  Superseded by: ${newId}`);
    console.log(`  Date: ${oldAdr.superseded_date}`);

    return 0; // Success
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 2; // Unexpected error
  }
}

module.exports = { execute };
