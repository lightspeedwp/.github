# Issue Pack README

This folder contains issue-ready markdown for the GitHub workflow consolidation workstream.

## Structure

- `parents/`: parent epic issue.
- `children/`: executable child issues linked to the parent.

## Posting Workflow

1. Create the parent epic issue first.
2. Create child issues in numeric order.
3. Link each child to the parent (`github_parent`) and add child links back into the parent file.
4. Keep canonical labels only (`status:*`, `priority:*`, `type:*`, optional `area:*`).

## Validation Before Posting

- `node scripts/agents/includes/check-template-labels.js`
- `node scripts/validation/validate-labeling-configs.cjs`
- `node scripts/validation/validate-issue-fields.cjs`
- `npm run validate:workflows`
