// header-footer.agent.js - Automates header/footer insertion and randomisation.
// See .github/agents/header-footer.agent.md for spec.

import { insertHeaderFooter } from '../../scripts/includes/header-footer.js';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON files with error handling
function safeJsonParse(filePath, label) {
    try {
        const content = readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        throw new Error(`Failed to parse JSON for ${label} at ${filePath}: ${err.message}`);
    }
}

const headerConfig = safeJsonParse(
    path.join(__dirname, '../../scripts/includes/header-content.json'),
    'header-content.json'
);
const footerConfig = safeJsonParse(
    path.join(__dirname, '../../scripts/includes/footer-content.json'),
    'footer-content.json'
);
// Schemas now in schemas/header-footer-agent/ folder
const headerSchema = safeJsonParse(
    path.join(__dirname, '../../schemas/header-footer-agent/header.schema.json'),
    'header.schema.json'
);
const footerSchema = safeJsonParse(
    path.join(__dirname, '../../schemas/header-footer-agent/footer.schema.json'),
    'footer.schema.json'
);

function validateConfig(config, schema, name) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (!validate(config)) {
        throw new Error(
            `${name} config validation failed: ${JSON.stringify(validate.errors, null, 2)}`
        );
    }
}

async function main() {
    // Validate configs
    validateConfig(headerConfig, headerSchema, 'Header');
    validateConfig(footerConfig, footerSchema, 'Footer');

    // Example usage: update all README.md files
    await insertHeaderFooter(
        'README.md',
        { headers: headerConfig.headers, footers: footerConfig.footers },
        { backup: true }
    );
    console.log('Headers and footers updated.');
}

// Run main if this module is executed directly
if (
    import.meta.url.startsWith('file:') &&
    process.argv[1] &&
    fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
