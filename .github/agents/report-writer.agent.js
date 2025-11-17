#!/usr/bin/env node
/**
 * Writes a Markdown summary of the latest labeling run.
 * TODO: wire to agent telemetry once available.
 */
const fs = require('fs');

const data = {
  timestamp: new Date().toISOString(),
  totals: {
    issues_processed: 0,
    prs_processed: 0,
    discussions_processed: 0,
    labels_added: 0,
    labels_removed: 0,
    unknown_labels: 0,
    alias_hits: 0
  }
  // TODO: read from agent runtime cache/JSON once implemented
};

const md = `# Labeling Report

- Timestamp: ${data.timestamp}
- Processed: issues=${data.totals.issues_processed}, prs=${data.totals.prs_processed}, discussions=${data.totals.discussions_processed}
- Labels: added=${data.totals.labels_added}, removed=${data.totals.labels_removed}
- Quality: unknown_labels=${data.totals.unknown_labels}, alias_hits=${data.totals.alias_hits}

\`\`\`mermaid
pie
  title Labels by Source
  "Issues" : ${data.totals.issues_processed}
  "PRs" : ${data.totals.prs_processed}
  "Discussions" : ${data.totals.discussions_processed}
\`\`\`

> NOTE: Replace counters with real telemetry once exposed by labeling.agent.js.
`;

process.stdout.write(md);
