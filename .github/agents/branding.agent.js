// branding.agent.js - Unified agent for automating header, footer, and badge insertion in Markdown files.
// See .github/agents/branding.agent.md for spec.

const { insertHeaderFooter } = require('../../scripts/includes/header-footer');
const { updateBadgesInReadme } = require('../../scripts/includes/badges');
const path = require('path');
const Ajv = require('ajv');

// Unified config and schema
const brandingConfig = require('../../schemas/header-footer-agent/agent-config.schema.json');

function validateConfig(config, schema) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (!validate(config)) {
        throw new Error(
            `Branding config validation failed: ${JSON.stringify(validate.errors, null, 2)}`
        );
    }
}

async function main() {
    // Validate branding config
    validateConfig(brandingConfig, brandingConfig, 'Branding');

    // Example usage: update all README.md files
    await insertHeaderFooter(
        'README.md',
        { headers: brandingConfig.headers, footers: brandingConfig.footers },
        { backup: true }
    );
    await updateBadgesInReadme(
        path.join(process.cwd(), 'README.md'),
        '.github/workflows',
        { backup: true }
    );
    console.log('Headers, footers, and badges updated.');
}

if (require.main === module)
    main().catch((err) => (console.error(err), process.exit(1)));
