const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Accept an ADR (transition from Proposed → Accepted status)
 * Updates the ADR file with the new status and acceptance date
 */
async function execute(parsed, config) {
  try {
    // Parse arguments
    const adrPath = parsed.positional[0];

    if (!adrPath) {
      console.error("Error: ADR path is required");
      console.error("Usage: adr accept <path>");
      return 4; // Input validation error
    }

    // Resolve path
    const fullPath = path.resolve(adrPath);

    // Validate file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: ADR file not found: ${adrPath}`);
      return 1; // Execution error
    }

    // Read and parse YAML
    const content = fs.readFileSync(fullPath, "utf8");
    let adr;
    try {
      adr = yaml.safeLoad(content);
    } catch (error) {
      console.error(`Error: Invalid YAML in ${adrPath}: ${error.message}`);
      return 1;
    }

    // Validate ADR structure
    if (!adr || typeof adr !== "object") {
      console.error(`Error: Invalid ADR format in ${adrPath}`);
      return 1;
    }

    // Check current status
    if (adr.status !== "Proposed") {
      console.error(
        `Error: ADR status is already "${adr.status}", cannot accept`,
      );
      console.error('Only ADRs with "Proposed" status can be accepted');
      return 1;
    }

    // Update status and add acceptance date
    adr.status = "Accepted";
    adr.accepted_date = new Date().toISOString().split("T")[0];

    // Write back to file
    const updatedContent = yaml.dump(adr, {
      indent: 2,
      lineWidth: -1,
    });

    fs.writeFileSync(fullPath, updatedContent, "utf8");

    console.log(`✓ ADR accepted: ${path.basename(adrPath)}`);
    console.log(`  Status: Proposed → Accepted`);
    console.log(`  Date: ${adr.accepted_date}`);

    return 0; // Success
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 2; // Unexpected error
  }
}

module.exports = { execute };
