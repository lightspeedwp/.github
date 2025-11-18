// badges.agent.js - Automates workflow badge updates in README.md.
// See .github/agents/badges.agent.md for spec.

import { updateBadgesInReadme } from '../../scripts/includes/badges.js';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
    const repoRoot = process.cwd();
    const readmePath = path.join(repoRoot, 'README.md');
    await updateBadgesInReadme(readmePath, '.github/workflows', {
        backup: true,
    });
    console.log('Badges updated.');
}

// Run if called directly
if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
