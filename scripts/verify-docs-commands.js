#!/usr/bin/env node

/**
 * verify-docs-commands.js
 * Checks that any "npm run ___" command mentioned in docs actually exists in package.json.
 */

const fs = require('fs');
const path = require('path');

const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
const DOC_FILES = [
    path.join(__dirname, '..', 'docs', 'LINTING.md'),
    path.join(__dirname, '..', 'docs', 'HUSKY-PRECOMMITS.md'),
    path.join(__dirname, '..', 'docs', 'METRICS.md'),
    // add other docs to verify as needed
];

let pkg;
try {
    pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
} catch (err) {
    console.error('Failed to read package.json:', err);
    process.exit(1);
}

const scriptNames = pkg.scripts ? Object.keys(pkg.scripts) : [];
let allGood = true;

DOC_FILES.forEach((docPath) => {
    if (!fs.existsSync(docPath)) return; // skip to next file if this one doesn't exist
    const content = fs.readFileSync(docPath, 'utf8');
    const regex = /npm run (\w+(?:[\w:-]+\w+)*)/g; // match "npm run script:name" (does not end with - or :)
    let match;
    while ((match = regex.exec(content)) !== null) {
        const script = match[1];
        if (!scriptNames.includes(script)) {
            console.error(
                `❌ Doc reference to "npm run ${script}" not found in package.json scripts (${path.basename(docPath)})`
            );
            allGood = false;
        }
    }
});

if (!allGood) {
    console.error('Documentation references undefined npm scripts. 🚫');
    process.exit(1);
} else {
    console.log(
        '👍 Docs scripts verification passed: all referenced scripts exist.'
    );
}
