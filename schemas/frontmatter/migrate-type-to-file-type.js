#!/usr/bin/env node
/**
 * Migrate frontmatter from 'type' to 'file_type'
 *
 * This script converts all markdown files that use the old 'type:' field
 * in their frontmatter to the new 'file_type:' field required by the schema.
 *
 * Usage:
 *   node migrate-type-to-file-type.js [--dry-run]
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const REPO_ROOT = path.resolve(__dirname, "../..");
const DRY_RUN = process.argv.includes("--dry-run");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

/**
 * Find all markdown files in the repository
 */
function findMarkdownFiles() {
  const patterns = ["**/*.md", "!node_modules/**", "!**/node_modules/**"];

  const files = [];
  patterns.forEach((pattern) => {
    const matches = glob.sync(pattern, {
      cwd: REPO_ROOT,
      dot: true, // Include files in directories starting with .
    });
    files.push(...matches.map((f) => path.join(REPO_ROOT, f)));
  });

  return [...new Set(files)];
}

/**
 * Check if a file has 'type:' in frontmatter and needs migration
 */
function needsMigration(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Match YAML frontmatter (--- ... ---)
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return false;
  }

  const frontmatter = match[1];

  // Check if it has 'type:' but not 'file_type:'
  const hasType = /^type:\s*["']?\w+["']?\s*$/m.test(frontmatter);
  const hasFileType = /^file_type:\s*["']?\w+["']?\s*$/m.test(frontmatter);

  return hasType && !hasFileType;
}

/**
 * Migrate a single file from 'type:' to 'file_type:'
 */
function migrateFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Replace 'type:' with 'file_type:' only in the frontmatter section
  const newContent = content.replace(
    /^(---\s*\n)([\s\S]*?)(---)/,
    (match, start, frontmatter, end) => {
      const updatedFrontmatter = frontmatter.replace(
        /^type:(\s+)/m,
        "file_type:$1",
      );
      return start + updatedFrontmatter + end;
    },
  );

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newContent, "utf8");
  }

  return newContent !== content;
}

/**
 * Main migration function
 */
function main() {
  console.log(
    `${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`,
  );
  console.log(
    `${colors.cyan}║  Frontmatter Type → File_Type Migration║${colors.reset}`,
  );
  console.log(
    `${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`,
  );

  if (DRY_RUN) {
    console.log(
      `${colors.yellow}🔍 DRY RUN MODE - No files will be modified${colors.reset}\n`,
    );
  }

  console.log(`${colors.blue}📋 Scanning markdown files...${colors.reset}\n`);

  const allFiles = findMarkdownFiles();
  console.log(`Found ${allFiles.length} markdown files\n`);

  const filesToMigrate = allFiles.filter(needsMigration);

  if (filesToMigrate.length === 0) {
    console.log(`${colors.green}✓ No files need migration!${colors.reset}`);
    process.exit(0);
  }

  console.log(
    `${colors.yellow}Found ${filesToMigrate.length} files that need migration${colors.reset}\n`,
  );

  let migratedCount = 0;
  let errorCount = 0;

  filesToMigrate.forEach((file) => {
    const relativePath = path.relative(REPO_ROOT, file);

    try {
      const changed = migrateFile(file);

      if (changed) {
        migratedCount++;
        console.log(`${colors.green}✓${colors.reset} ${relativePath}`);
      } else {
        console.log(
          `${colors.yellow}○${colors.reset} ${relativePath} (no changes needed)`,
        );
      }
    } catch (error) {
      errorCount++;
      console.log(`${colors.red}✗${colors.reset} ${relativePath}`);
      console.log(`  ${colors.red}Error: ${error.message}${colors.reset}\n`);
    }
  });

  // Summary
  console.log(
    `\n${colors.cyan}═══════════════════════════════════════${colors.reset}`,
  );
  console.log(`${colors.cyan}Summary${colors.reset}\n`);
  console.log(`${colors.green}Migrated:${colors.reset}  ${migratedCount}`);
  console.log(`${colors.red}Errors:${colors.reset}     ${errorCount}`);
  console.log(
    `${colors.cyan}═══════════════════════════════════════${colors.reset}\n`,
  );

  if (DRY_RUN) {
    console.log(
      `${colors.yellow}This was a dry run. Run without --dry-run to apply changes.${colors.reset}`,
    );
  } else if (migratedCount > 0) {
    console.log(`${colors.green}✓ Migration complete!${colors.reset}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Review changes: git diff`);
    console.log(`  2. Validate frontmatter: npm run validate`);
    console.log(
      `  3. Commit changes: git commit -am "fix(frontmatter): migrate type to file_type field"`,
    );
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  needsMigration,
  migrateFile,
  findMarkdownFiles,
};
