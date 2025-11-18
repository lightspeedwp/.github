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

// Load JSON files
const headerConfig = JSON.parse(
    readFileSync(path.join(__dirname, '../../scripts/includes/header-content.json'), 'utf-8')
);
const footerConfig = JSON.parse(
    readFileSync(path.join(__dirname, '../../scripts/includes/footer-content.json'), 'utf-8')
);
// Schemas now in schemas/header-footer-agent/ folder
const headerSchema = JSON.parse(
    readFileSync(path.join(__dirname, '../../schemas/header-footer-agent/header.schema.json'), 'utf-8')
);
const footerSchema = JSON.parse(
    readFileSync(path.join(__dirname, '../../schemas/header-footer-agent/footer.schema.json'), 'utf-8')
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
