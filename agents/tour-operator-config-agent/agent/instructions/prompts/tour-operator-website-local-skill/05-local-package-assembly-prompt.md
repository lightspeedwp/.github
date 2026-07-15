# Local package assembly prompt

Assemble a local `tour-operator-website` skill package from the verified material in `prompts/tour-operator-website`.

This phase is for local package construction only. Do not upload, attach, or broaden the package beyond what earlier phases have verified.

## Goal

Produce a clean local package build from the source folder without inventing files, silently dropping required files, or mixing maintenance material into the packaged skill by accident.

## Inputs

Use only:

- `prompts/tour-operator-website` as the single source of truth
- the verified inventory from `01-source-audit-prompt.md`
- the package contract from `02-package-contract-prompt.md`
- the entrypoint decisions from `03-skill-entrypoints-prompt.md`
- the support-layer decisions from `04-reference-assets-reconciliation-prompt.md`

## Required work

- Create a local package staging copy only after the contract is clear enough to assemble safely.
- Copy required files and folders exactly from the source folder into the local package build.
- Include optional files only when the package contract says they belong.
- Exclude material that the package contract marked as non-package or unverified.
- Preserve exact relative paths for packaged files.
- If the build needs a local staging path, use a dedicated package folder rather than editing the source-of-truth folder destructively.
- If a required file is missing or unreadable, stop and report the blocker instead of substituting a guessed file.

## Assembly rules

- Treat the source folder as authoritative; the local package is a build artefact, not a new source of truth.
- Do not rename files just to make the package look cleaner.
- Do not rewrite verified source files unless an earlier phase explicitly authorised a source-backed repair.
- Do not add convenience files that the source folder does not support.
- Keep canonical entrypoints, support folders, assets, and validation files aligned with the package contract.

## Validation expectations

After assembly:

- verify every required contract file is present in the local package
- verify excluded files are not present accidentally
- verify entrypoint-relative paths still resolve inside the local package
- verify the local package still reflects the exact scope evidenced by the source folder

## Deliverables

1. State whether the local package was assembled successfully.
2. List the exact files and folders copied into the local package.
3. List any required files that blocked assembly.
4. State whether the local package is ready for upload or still needs repairs.
5. Name the next safe phase.
