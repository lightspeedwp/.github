// badges.agent.js - Automates workflow badge updates in README.md.
// See .github/agents/badges.agent.md for spec.

const { updateBadgesInReadme } = require('./includes/badgeUtils');
const path = require('path');

async function main() {
    const repoRoot = process.cwd();
    const readmePath = path.join(repoRoot, 'README.md');
    await updateBadgesInReadme(readmePath, '.github/workflows', {
        backup: true,
    });
    console.log('Badges updated.');
}

if (require.main === module)
    main().catch((err) => (console.error(err), process.exit(1)));
