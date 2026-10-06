---
name: validate-changelog
description: Validate CHANGELOG.md entries and structure against Keep a Changelog 1.1.0 and this repository's changelog rules. Use when adding or editing changelog entries, before pushing a PR that touches CHANGELOG.md, or when the changelog CI checks fail.
---

# Validate Changelog

Validate a changelog entry or a whole `CHANGELOG.md` the same way this
repository's CI does, before pushing.

## When to use this skill

- Adding entries under `[Unreleased]` in `CHANGELOG.md`.
- Editing existing entries or sections.
- A PR fails the Changelog Validation or changelog-safety checks.
- Reviewing another agent's changelog edits.

## Procedure

Follow the steps in order. Stop and fix failures before moving on.

### 1. Check the single entry first (two-gate validation)

From the repository root, validate the entry (a YAML file) with the changelog
agent's own validator. `--entry` takes a file path; to pass the YAML on stdin
instead, use `--input -`:

```bash
node agents/changelog-agent/changelog-validator.js --entry ./path/to/entry.yml --json
```

This runs the two gates in
`agents/changelog-agent/includes/changelogValidator.cjs` — entry format, then
structure — using the rules in `.github/changelog-rules.yml`. A non-zero exit
means the entry itself is invalid; fix the entry, not the validator.

### 2. Validate the whole file the way CI does

```bash
node scripts/agents/includes/changelogUtils.cjs --validate CHANGELOG.md
node scripts/validation/validate-changelog.cjs CHANGELOG.md
```

These are the exact commands `.github/workflows/changelog-unified.yml` runs.
The second command enforces the rules in
`.github/validation/changelog/rules.json`, including `CHK_MAX_LENGTH`
(entries must not exceed 250 characters). The schema file
`schemas/changelog.schema.json` defines the expected document shape.

### 3. Entry rules

Every entry must:

- Sit under `[Unreleased]` until release, in the correct section
  (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`).
- Be one user-facing sentence of 250 characters or fewer.
- Name the user-visible change, not the implementation
  ("Faster Sync: files now sync 2x faster" rather than
  "refactored sync worker internals").
- Reference its PR or issue (for example `(#3814)`).

## Examples

Valid entry:

```markdown
- **Stale Changelog-Agent Links Repointed** — The agent index, agent docs and automation docs, plus the changelog safety script, again point at `agents/changelog-agent/` after the move left them aimed at removed paths. (#3814)
```

Invalid entry (describes implementation, no PR or issue reference):

```markdown
- Refactored the internal validation helper to use a different module loading strategy with additional error handling branches and logging statements throughout the file for debugging purposes.
```

## Edge cases

- The helper `agents/changelog-agent/validate-changelog.js` only emits a
  pass-through JSON result (`passed: 0, failed: 0, warnings: 0`) for CI
  plumbing. It performs no validation: a zero exit from it proves nothing.
  Always run steps 1 and 2 above.
- `CHANGELOG.md` merges with union strategy (see `.gitattributes`); if your
  branch conflicts there, keep both sides' entries rather than picking one.
- Snapshot and archived audit documents under `.github/projects/` and
  `.github/reports/` describe historical layouts and are intentionally not
  updated; validate only live docs and the changelog itself.
- If `validate-changelog.cjs` and the agent validator disagree, the CI
  command (step 2) is authoritative for merging; record the disagreement
  for the changelog maintainers instead of editing either validator.
