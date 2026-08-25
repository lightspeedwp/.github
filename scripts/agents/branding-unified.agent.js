#!/usr/bin/env node

/**
 * branding-unified.agent.js
 *
 * Unified Branding Agent — Consolidates header, footer, and badge logic
 * Reads Wave 4D configuration and applies category-aware branding
 *
 * Usage:
 *   node scripts/agents/branding-unified.agent.js <file-path> [options]
 *   node scripts/agents/branding-unified.agent.js docs/guide.md --dry-run
 *   node scripts/agents/branding-unified.agent.js docs/*.md --apply
 *
 * Configuration:
 *   - config/footers.config.yaml — Category definitions and footer templates
 *   - schemas/branding-schema.json — Branding schema validation
 *   - schemas/frontmatter.schema.json — Frontmatter field validation
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as yaml from "js-yaml";
import minimist from "minimist";

let _projectRoot = null;

function getProjectRoot() {
  if (!_projectRoot) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    _projectRoot = path.resolve(__dirname, "../..");
  }
  return _projectRoot;
}

// ============================================================================
// CONFIGURATION LOADING
// ============================================================================

/**
 * Load branding configuration from YAML
 */
function loadBrandingConfig() {
  const projectRoot = getProjectRoot();
  const configPath = path.join(projectRoot, "config/footers.config.yaml");
  if (!fs.existsSync(configPath)) {
    throw new Error(`Branding config not found: ${configPath}`);
  }

  try {
    const content = fs.readFileSync(configPath, "utf-8");
    return yaml.load(content);
  } catch (error) {
    throw new Error(`Failed to load branding config: ${error.message}`, {
      cause: error,
    });
  }
}

/**
 * Load frontmatter schema
 */
function _loadFrontmatterSchema() {
  const projectRoot = getProjectRoot();
  const schemaPath = path.join(projectRoot, "schemas/frontmatter.schema.json");
  if (!fs.existsSync(schemaPath)) {
    console.warn(`Frontmatter schema not found: ${schemaPath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(schemaPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to load frontmatter schema: ${error.message}`);
    return null;
  }
}

// ============================================================================
// FRONTMATTER PARSING
// ============================================================================

/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content — File content
 * @returns {Object} {frontmatter, body, raw_frontmatter}
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/m;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content, raw_frontmatter: null };
  }

  const [, raw, body] = match;

  try {
    const frontmatter = yaml.load(raw) || {};
    return { frontmatter, body, raw_frontmatter: raw };
  } catch (error) {
    throw new Error(`Failed to parse frontmatter: ${error.message}`, {
      cause: error,
    });
  }
}

/**
 * Validate frontmatter against requirements
 * @param {Object} frontmatter — Parsed frontmatter
 * @param {string} category — Document category
 * @param {Object} config — Branding configuration
 * @returns {Array} Array of validation errors (empty if valid)
 */
function validateFrontmatter(frontmatter, category, config) {
  const errors = [];
  const categoryConfig = config.categories[category];

  if (!categoryConfig) {
    errors.push(`Unknown category: ${category}`);
    return errors;
  }

  // Check required fields
  const requiredFields = categoryConfig.frontmatter_required || [
    "title",
    "description",
    "file_type",
    "category",
  ];

  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check field types
  if (frontmatter.created_date && !isValidDate(frontmatter.created_date)) {
    errors.push(
      `Invalid created_date format (expected YYYY-MM-DD): ${frontmatter.created_date}`,
    );
  }

  if (frontmatter.last_updated && !isValidDate(frontmatter.last_updated)) {
    errors.push(
      `Invalid last_updated format (expected YYYY-MM-DD): ${frontmatter.last_updated}`,
    );
  }

  if (frontmatter.version && !isValidVersion(frontmatter.version)) {
    errors.push(
      `Invalid version format (expected semantic versioning): ${frontmatter.version}`,
    );
  }

  return errors;
}

/**
 * Check if string is valid ISO date (YYYY-MM-DD)
 */
function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Check if string is valid semantic version
 */
function isValidVersion(versionStr) {
  return /^v?\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+)?$/.test(versionStr);
}

// ============================================================================
// CATEGORY INFERENCE
// ============================================================================

/**
 * Infer document category from frontmatter and file path
 * Uses hybrid strategy: frontmatter first, then path patterns
 *
 * @param {string} filePath — Path to the document (relative to project root)
 * @param {Object} frontmatter — Parsed frontmatter
 * @param {Object} config — Branding configuration
 * @returns {string} Inferred category
 */
function inferCategory(filePath, frontmatter, config) {
  // Strategy 1: Explicit category in frontmatter (highest priority)
  if (frontmatter.category && config.categories[frontmatter.category]) {
    return frontmatter.category;
  }

  // Strategy 2: Path-based inference (medium priority)
  const normalizedPath = filePath.replace(/\\/g, "/"); // Normalize Windows paths

  const pathPatterns = [
    // Issue and PR templates (highest path priority)
    {
      pattern: /^\.github\/ISSUE_TEMPLATE\/.*\.md$/i,
      category: "issue-template",
    },
    {
      pattern: /^\.github\/PULL_REQUEST_TEMPLATE\/.*\.md$/i,
      category: "pull-request-template",
    },

    // Agent and instruction files
    { pattern: /^agents\/.*\.(?:md|agent\.md)$/i, category: "agents" },
    { pattern: /awesome-copilot\/.*\.md$/i, category: "awesome-copilot" },
    {
      pattern: /^instructions\/.*\.md$|.*\.instructions\.md$/i,
      category: "instructions",
    },

    // Prompts and prompts
    {
      pattern: /^prompts\/.*\.md$|.*\.prompt\.md$|^wceu-2026\/.*\.md$/i,
      category: "prompts",
    },

    // Workflows
    { pattern: /^\.github\/workflows\/.*\.md$/i, category: "workflow" },

    // Schema
    { pattern: /^schema\/.*\.md$|.*\.schema\.md$/i, category: "schema" },

    // Reports and audits
    {
      pattern: /^\.github\/reports\/.*\.md$|.*audit.*\.md$/i,
      category: "audit",
    },

    // Research
    { pattern: /.*research.*\.md$/i, category: "research" },

    // Tests
    { pattern: /^test\/.*\.md$|.*test.*\.md$/i, category: "test" },

    // Utilities
    {
      pattern: /^scripts\/.*\.md$|^utils\/.*\.md$|.*utility.*\.md$/i,
      category: "utility",
    },

    // Governance (before generic docs)
    {
      pattern: /^docs\/.*governance.*\.md$|^governance\/.*\.md$/i,
      category: "governance",
    },

    // AI Ops (before generic docs)
    {
      pattern: /^docs\/.*(?:automation|ai-ops).*\.md$/i,
      category: "ai-ops",
    },

    // Generic documentation
    { pattern: /^docs\/.*\.md$/i, category: "docs" },

    // README files
    { pattern: /^(?:.*\/)?README\.md$/i, category: "readme" },
  ];

  for (const { pattern, category } of pathPatterns) {
    if (pattern.test(normalizedPath)) {
      return category;
    }
  }

  // Fallback: Default category
  return "docs";
}

// ============================================================================
// HEADER GENERATION
// ============================================================================

/**
 * Generate a header for the document based on category
 * @param {Object} frontmatter — Document frontmatter
 * @param {string} category — Document category
 * @param {Object} config — Branding configuration
 * @returns {string|null} Generated header or null if not needed
 */
function generateHeader(frontmatter, category, config) {
  const categoryConfig = config.categories[category];

  // Check if headers are required/optional for this category
  if (
    categoryConfig.header_behavior === "omitted" ||
    (categoryConfig.header_behavior === "optional" &&
      !frontmatter.include_header)
  ) {
    return null;
  }

  const lines = [];

  // Title
  if (frontmatter.title) {
    lines.push(`# ${frontmatter.title}\n`);
  }

  // Category badge
  const badge = getCategoryBadge(category);
  if (badge) {
    lines.push(`**Category**: ${badge}`);
  }

  // Status
  if (frontmatter.status) {
    lines.push(`**Status**: ${capitalize(frontmatter.status)}`);
  }

  // Version
  if (frontmatter.version) {
    lines.push(`**Version**: ${frontmatter.version}`);
  }

  // Owners
  if (Array.isArray(frontmatter.owners) && frontmatter.owners.length > 0) {
    const ownersList = frontmatter.owners
      .map((o) => (o.startsWith("@") ? o : `@${o}`))
      .join(", ");
    lines.push(`**Owners**: ${ownersList}`);
  }

  // Last updated
  if (frontmatter.last_updated) {
    lines.push(`**Last Updated**: ${frontmatter.last_updated}`);
  }

  if (lines.length === 0) {
    return null;
  }

  // Join with proper spacing
  const metadata = lines.slice(1).join(" · ");
  return lines[0] + (metadata ? metadata : "") + "\n\n---\n";
}

/**
 * Get category badge string
 */
function getCategoryBadge(category) {
  const badges = {
    readme: "[README]",
    docs: "[docs]",
    "ai-ops": "[AI Ops]",
    agents: "[agents]",
    instructions: "[instructions]",
    prompts: "[prompts]",
    schema: "[schema]",
    audit: "[audit]",
    research: "[research]",
    workflow: "[workflow]",
    "issue-template": "[issue-template]",
    "pull-request-template": "[pull-request-template]",
    test: "[test]",
    utility: "[utility]",
    "awesome-copilot": "[awesome-copilot]",
    governance: "[governance]",
  };

  return badges[category] || `[${category}]`;
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ============================================================================
// FOOTER MANAGEMENT
// ============================================================================

/**
 * Get the appropriate footer for a document
 * @param {string} category — Document category
 * @param {Object} frontmatter — Document frontmatter
 * @param {Object} config — Branding configuration
 * @returns {string} Footer content
 */
function getFooter(category, frontmatter, config) {
  const categoryConfig = config.categories[category];

  if (!categoryConfig) {
    throw new Error(`Unknown category: ${category}`);
  }

  // Determine which footer to use
  let footerId =
    frontmatter.footer_id ||
    categoryConfig.default_footer ||
    "lightspeed-standard";

  // Validate footer exists
  if (!config.footers[footerId]) {
    console.warn(
      `Footer '${footerId}' not found for category '${category}', using default`,
    );
    footerId = "lightspeed-standard";
  }

  const footerTemplate = config.footers[footerId];

  // Render footer template (substitute variables)
  let content = footerTemplate.template;

  // Replace template variables
  if (frontmatter.audit_date) {
    content = content.replace(/{audit_date}/g, frontmatter.audit_date);
  }
  if (frontmatter.research_date) {
    content = content.replace(/{research_date}/g, frontmatter.research_date);
  }
  if (frontmatter.file_path) {
    content = content.replace(/{file_path}/g, frontmatter.file_path);
  }

  return content;
}

/**
 * Remove existing footer from content
 * @param {string} content — Document content
 * @returns {string} Content without footer
 */
function removeExistingFooter(content) {
  // Match common footer markers
  const footerPatterns = [
    /\n---\n\*Built by 🧱[\s\S]*$/,
    /\n---\n\*Maintained with ❤️[\s\S]*$/,
    /\n---\n🤖[\s\S]*$/,
    /\n---\n⚖️[\s\S]*$/,
    /\n---\n🔧[\s\S]*$/,
    /\n---\n📚[\s\S]*$/,
    /\n---\n✨[\s\S]*$/,
    /\n---\n🔍[\s\S]*$/,
    /\n---\n📐[\s\S]*$/,
    /\n---\n\*Documentation maintained[\s\S]*$/,
  ];

  let result = content;
  for (const pattern of footerPatterns) {
    result = result.replace(pattern, "");
  }

  return result;
}

// ============================================================================
// DOCUMENT PROCESSING
// ============================================================================

/**
 * Process a markdown file with unified branding
 * @param {string} filePath — Path to file (relative to project root)
 * @param {Object} options — Processing options
 * @returns {Object} {status, content, changes, warnings, errors}
 */
function processBrandingDocument(filePath, options = {}) {
  const {
    dry_run = true,
    apply = false,
    _verbose = false,
    infer_missing_metadata = false,
  } = options;

  const result = {
    status: "success",
    file: filePath,
    changes: [],
    warnings: [],
    errors: [],
    metadata: {},
  };

  try {
    // Load file
    const projectRoot = getProjectRoot();
    const fullPath = path.join(projectRoot, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const originalContent = fs.readFileSync(fullPath, "utf-8");
    let content = originalContent;

    // Load configuration
    const config = loadBrandingConfig();

    // Parse frontmatter
    const { frontmatter, body, raw_frontmatter } = parseFrontmatter(content);

    // Infer category
    const category = inferCategory(filePath, frontmatter, config);
    result.metadata.category = category;

    // Validate frontmatter
    const validationErrors = validateFrontmatter(frontmatter, category, config);
    if (validationErrors.length > 0) {
      result.warnings.push(...validationErrors);

      if (infer_missing_metadata) {
        // Add defaults for missing fields
        if (!frontmatter.title) {
          frontmatter.title = path.basename(filePath, ".md");
          result.changes.push(`Set title to: ${frontmatter.title}`);
        }
        if (!frontmatter.category) {
          frontmatter.category = category;
          result.changes.push(`Set category to: ${category}`);
        }
        if (!frontmatter.file_type) {
          frontmatter.file_type = "documentation";
          result.changes.push(`Set file_type to: documentation`);
        }
        if (!frontmatter.last_updated) {
          const today = new Date().toISOString().split("T")[0];
          frontmatter.last_updated = today;
          result.changes.push(`Set last_updated to: ${today}`);
        }
      }
    }

    // Generate header if needed
    const categoryConfig = config.categories[category];
    if (categoryConfig.header_behavior !== "omitted") {
      const header = generateHeader(frontmatter, category, config);
      if (header) {
        // Remove old header if exists
        const headerRegex = /^# .*\n\n---\n/m;
        content = content.replace(headerRegex, "");

        // Reconstruct content with new header
        const frontmatterBlock = `---\n${raw_frontmatter}\n---\n`;
        content = frontmatterBlock + header + body;
        result.changes.push("Updated header");
      }
    }

    // Manage footer
    if (categoryConfig.footer_behavior !== "omitted") {
      const footer = getFooter(category, frontmatter, config);

      // Remove old footer
      const cleanContent = removeExistingFooter(content);

      if (categoryConfig.footer_behavior === "required" || footer) {
        // Add new footer
        content = cleanContent + "\n\n" + footer + "\n";
        result.changes.push("Updated footer");
      }
    }

    // Write file if apply mode
    if (apply && content !== originalContent) {
      fs.writeFileSync(fullPath, content, "utf-8");
      result.status = "applied";
    } else if (!dry_run && !apply) {
      fs.writeFileSync(fullPath, content, "utf-8");
      result.status = "written";
    }

    result.metadata.content_changed = content !== originalContent;
  } catch (error) {
    result.status = "error";
    result.errors.push(error.message);
  }

  return result;
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

/**
 * Main CLI handler
 */
async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ["dry-run", "apply", "verbose", "infer-metadata", "help"],
    alias: { h: "help", v: "verbose", d: "dry-run" },
  });

  if (argv.help || argv._.length === 0) {
    console.log(`
Unified Branding Agent — Category-aware header, footer, and badge management

Usage:
  node scripts/agents/branding-unified.agent.js <file-path> [options]

Arguments:
  <file-path>  Path to markdown file (relative to project root)

Options:
  --dry-run             Preview changes without writing (default: true)
  --apply               Apply changes to file
  --verbose, -v         Verbose output
  --infer-metadata      Infer missing metadata with defaults
  --help, -h            Show this help message

Examples:
  node scripts/agents/branding-unified.agent.js docs/guide.md
  node scripts/agents/branding-unified.agent.js docs/guide.md --apply
  node scripts/agents/branding-unified.agent.js docs/guide.md --verbose

Configuration:
  config/footers.config.yaml — Category definitions and footers
  schemas/branding-schema.json — Branding schema
`);
    process.exit(0);
  }

  const filePath = argv._[0];
  const options = {
    dry_run: !argv.apply,
    apply: argv.apply,
    verbose: argv.verbose,
    infer_missing_metadata: argv["infer-metadata"],
  };

  try {
    const result = processBrandingDocument(filePath, options);

    // Output result
    console.log(`\n📄 File: ${result.file}`);
    console.log(`Status: ${result.status}`);

    if (result.metadata.category) {
      console.log(`Category: ${result.metadata.category}`);
    }

    if (result.changes.length > 0) {
      console.log(`\n✅ Changes:`);
      result.changes.forEach((change) => console.log(`  - ${change}`));
    }

    if (result.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      result.warnings.forEach((warning) => console.log(`  - ${warning}`));
    }

    if (result.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      result.errors.forEach((error) => console.log(`  - ${error}`));
      process.exit(1);
    }

    if (result.status === "success" && result.changes.length === 0) {
      console.log(`No changes needed.`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// ============================================================================
// EXPORTS (for testing)
// ============================================================================

export {
  loadBrandingConfig,
  parseFrontmatter,
  validateFrontmatter,
  inferCategory,
  generateHeader,
  getFooter,
  removeExistingFooter,
  processBrandingDocument,
};

// Run CLI if this is the main module
try {
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
      console.error(error);
      process.exit(1);
    });
  }
} catch {
  // import.meta not available (running in test/require context)
}
