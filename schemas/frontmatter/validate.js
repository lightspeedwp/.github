#!/usr/bin/env node
/**
 * Frontmatter Schema Validator
 *
 * Validates:
 * 1. The frontmatter schema itself is valid JSON Schema (Draft 07)
 * 2. All markdown files with frontmatter validate against the schema
 *
 * Usage:
 *   node validate.js                    # Validate all files in repo
 *   node validate.js path/to/file.md    # Validate specific file
 *   node validate.js --schema-only      # Only validate the schema itself
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const glob = require('glob');

// Initialize AJV with strict mode and formats
const ajv = new Ajv({
    strict: true,
    allErrors: true,
    verbose: true,
    discriminator: true,
});
addFormats(ajv);

// Paths
const SCHEMA_PATH = path.join(__dirname, 'frontmatter.schema.json');
const REPO_ROOT = path.resolve(__dirname, '../..');

// ANSI color codes for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

/**
 * Load and validate the schema file itself
 */
function validateSchemaFile() {
    console.log(`${colors.blue}📋 Validating schema file...${colors.reset}\n`);

    try {
        const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');
        const schema = JSON.parse(schemaContent);

        // Check if it's a valid JSON Schema Draft 07
        const metaSchema = ajv.getSchema(
            'http://json-schema.org/draft-07/schema#'
        );
        if (!metaSchema) {
            throw new Error('JSON Schema Draft 07 meta-schema not found');
        }

        const valid = metaSchema(schema);

        if (valid) {
            console.log(
                `${colors.green}✓ Schema is valid JSON Schema Draft 07${colors.reset}`
            );
            return { valid: true, schema };
        } else {
            console.error(
                `${colors.red}✗ Schema validation failed:${colors.reset}`
            );
            console.error(metaSchema.errors);
            return { valid: false, errors: metaSchema.errors };
        }
    } catch (error) {
        console.error(
            `${colors.red}✗ Failed to load schema:${colors.reset}`,
            error.message
        );
        return { valid: false, error };
    }
}

/**
 * Extract YAML frontmatter from markdown file
 */
function extractFrontmatter(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Match YAML frontmatter (--- ... ---)
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return null;
    }

    try {
        return yaml.parse(match[1]);
    } catch (error) {
        throw new Error(`Failed to parse YAML frontmatter: ${error.message}`);
    }
}

/**
 * Find all markdown files that should have frontmatter
 */
function findMarkdownFiles() {
    const patterns = [
        '.github/agents/**/*.md',
        '.github/chatmodes/**/*.md',
        '.github/instructions/**/*.md',
        '.github/prompts/**/*.md',
        '.github/ISSUE_TEMPLATE/**/*.md',
        '.github/PULL_REQUEST_TEMPLATE/**/*.md',
        '.github/SAVED_REPLIES/**/*.md',
        'docs/**/*.md',
        'AGENTS.md',
        'CLAUDE.md',
        'GEMINI.md',
    ];

    const files = [];
    patterns.forEach((pattern) => {
        const matches = glob.sync(pattern, { cwd: REPO_ROOT });
        files.push(...matches.map((f) => path.join(REPO_ROOT, f)));
    });

    return [...new Set(files)]; // Remove duplicates
}

/**
 * Validate a single file's frontmatter against the schema
 */
function validateFile(filePath, schema) {
    const relativePath = path.relative(REPO_ROOT, filePath);

    try {
        const frontmatter = extractFrontmatter(filePath);

        if (!frontmatter) {
            return {
                file: relativePath,
                status: 'no-frontmatter',
                message: 'No frontmatter found',
            };
        }

        // Compile schema validator
        const validate = ajv.compile(schema);
        const valid = validate(frontmatter);

        if (valid) {
            return {
                file: relativePath,
                status: 'valid',
            };
        } else {
            return {
                file: relativePath,
                status: 'invalid',
                errors: validate.errors,
            };
        }
    } catch (error) {
        return {
            file: relativePath,
            status: 'error',
            message: error.message,
        };
    }
}

/**
 * Format validation errors for display
 */
function formatErrors(errors) {
    return errors
        .map((err) => {
            const path = err.instancePath || '/';
            const message = err.message || 'Unknown error';
            const params = err.params ? JSON.stringify(err.params) : '';
            return `  ${colors.yellow}→${colors.reset} ${path}: ${message} ${params}`;
        })
        .join('\n');
}

/**
 * Main validation function
 */
function main() {
    const args = process.argv.slice(2);
    const schemaOnly = args.includes('--schema-only');
    const specificFile = args.find((arg) => !arg.startsWith('--'));

    console.log(
        `${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`
    );
    console.log(
        `${colors.cyan}║  Frontmatter Schema Validator          ║${colors.reset}`
    );
    console.log(
        `${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`
    );

    // Step 1: Validate the schema itself
    const {
        valid: schemaValid,
        schema,
        errors: schemaErrors,
    } = validateSchemaFile();

    if (!schemaValid) {
        console.error(
            `\n${colors.red}✗ Schema validation failed. Cannot proceed.${colors.reset}`
        );
        process.exit(1);
    }

    if (schemaOnly) {
        console.log(
            `\n${colors.green}✓ Schema-only validation complete!${colors.reset}`
        );
        process.exit(0);
    }

    // Step 2: Validate frontmatter files
    console.log(
        `\n${colors.blue}📄 Validating frontmatter files...${colors.reset}\n`
    );

    const filesToValidate = specificFile
        ? [path.resolve(specificFile)]
        : findMarkdownFiles();

    console.log(`Found ${filesToValidate.length} markdown files to check\n`);

    const results = {
        valid: [],
        invalid: [],
        noFrontmatter: [],
        errors: [],
    };

    filesToValidate.forEach((file) => {
        const result = validateFile(file, schema);

        switch (result.status) {
            case 'valid':
                results.valid.push(result);
                console.log(`${colors.green}✓${colors.reset} ${result.file}`);
                break;
            case 'invalid':
                results.invalid.push(result);
                console.log(`${colors.red}✗${colors.reset} ${result.file}`);
                console.log(formatErrors(result.errors));
                console.log('');
                break;
            case 'no-frontmatter':
                results.noFrontmatter.push(result);
                console.log(
                    `${colors.yellow}○${colors.reset} ${result.file} ${colors.yellow}(no frontmatter)${colors.reset}`
                );
                break;
            case 'error':
                results.errors.push(result);
                console.log(`${colors.red}⚠${colors.reset} ${result.file}`);
                console.log(
                    `  ${colors.red}Error: ${result.message}${colors.reset}`
                );
                console.log('');
                break;
        }
    });

    // Summary
    console.log(
        `\n${colors.cyan}═══════════════════════════════════════${colors.reset}`
    );
    console.log(`${colors.cyan}Summary${colors.reset}\n`);
    console.log(
        `${colors.green}Valid:${colors.reset}          ${results.valid.length}`
    );
    console.log(
        `${colors.red}Invalid:${colors.reset}        ${results.invalid.length}`
    );
    console.log(
        `${colors.yellow}No frontmatter:${colors.reset} ${results.noFrontmatter.length}`
    );
    console.log(
        `${colors.red}Errors:${colors.reset}         ${results.errors.length}`
    );
    console.log(
        `${colors.cyan}═══════════════════════════════════════${colors.reset}\n`
    );

    // Exit with appropriate code
    if (results.invalid.length > 0 || results.errors.length > 0) {
        console.error(`${colors.red}✗ Validation failed!${colors.reset}`);
        process.exit(1);
    } else {
        console.log(`${colors.green}✓ All validations passed!${colors.reset}`);
        process.exit(0);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    validateSchemaFile,
    extractFrontmatter,
    validateFile,
    findMarkdownFiles,
};
