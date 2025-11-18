#!/usr/bin/env node
/**
 * Fix all frontmatter files in the repository
 */

const { findMarkdownFiles } = require('./validate.js');
const { fixFrontmatter } = require('./fix-frontmatter.js');

const files = findMarkdownFiles();
const results = {
    fixed: [],
    skipped: [],
    errors: []
};

console.log(`Found ${files.length} markdown files to process\n`);

files.forEach(file => {
    const result = fixFrontmatter(file);

    if (result.fixed) {
        results.fixed.push({ file, result });
        console.log(`✓ Fixed: ${file}`);
    } else if (result.reason === 'error' || result.reason === 'yaml-parse-error') {
        results.errors.push({ file, result });
        console.log(`✗ Error: ${file} - ${result.error}`);
    } else {
        results.skipped.push({ file, result });
        // console.log(`○ Skipped: ${file} - ${result.reason}`);
    }
});

console.log(`\n═══════════════════════════════════════`);
console.log(`Summary\n`);
console.log(`Fixed:   ${results.fixed.length}`);
console.log(`Skipped: ${results.skipped.length}`);
console.log(`Errors:  ${results.errors.length}`);
console.log(`═══════════════════════════════════════\n`);

if (results.errors.length > 0) {
    console.log(`\nErrors:\n`);
    results.errors.forEach(({ file, result }) => {
        console.log(`  ${file}`);
        console.log(`    Reason: ${result.reason}`);
        if (result.error) {
            console.log(`    Error: ${result.error}`);
        }
    });
}

process.exit(results.errors.length > 0 ? 1 : 0);
