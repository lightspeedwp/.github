#!/usr/bin/env node
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const glob = require('glob');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('.github/automation/schemas/frontmatter.schema.json', 'utf8'));
// TODO: implement front-matter extraction (YAML header) for .md files
const files = glob.globSync('**/*.md', { ignore: ['node_modules/**'] });

let errors = 0;
// TODO: For each file in `files`, extract and validate front-matter here.
if (errors > 0) process.exit(1);
