// manage-readmes.agent.js - Automates README creation and maintenance.
// See .github/agents/manage-readmes.agent.md for spec.

const { manageReadmes } = require('../../scripts/includes/manage-readmes');
const path = require('path');

async function main() {
    const repoRoot = process.cwd();
    await manageReadmes(repoRoot, { backup: true, lint: true });
    console.log('READMEs managed.');
}

if (require.main === module)
    main().catch((err) => (console.error(err), process.exit(1)));
