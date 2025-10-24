// header-footer.agent.js - Automates header/footer insertion and randomisation.
// See .github/agents/header-footer.agent.md for spec.

const { insertHeaderFooter } = require('../../scripts/includes/header-footer');
const path = require('path');
const headerConfig = require('../../scripts/includes/header-content.json');
const footerConfig = require('../../scripts/includes/footer-content.json');
// Schemas now in schemas/ folder
const headerSchema = require('../../schemas/header.schema.json');
const footerSchema = require('../../schemas/footer.schema.json');
const Ajv = require('ajv');

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

if (require.main === module)
    main().catch((err) => (console.error(err), process.exit(1)));
