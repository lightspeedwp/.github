# WordPress CI Integration

Use this reference when a WordPress project needs continuous `DESIGN.md` validation in GitHub Actions or local scripts.

## Goal

Keep the `DESIGN.md` contract healthy as WordPress theme files, style variations and CSS evolve.

## Included Companion Files

- `scripts/ci-design-md-check.sh`
- `assets/github-actions/design-md-lint.yml`

## Recommended Setup

1. Copy `scripts/ci-design-md-check.sh` into your repository tooling folder, such as `scripts/`.
2. Copy `assets/github-actions/design-md-lint.yml` to `.github/workflows/design-md-lint.yml`.
3. Ensure the repo root contains `DESIGN.md`.
4. If the project keeps `DESIGN.md` elsewhere, set `DESIGN_MD_FILE` in the workflow or script step.

## What the CI Should Enforce

- `DESIGN.md` exists and remains valid plain text.
- canonical section names and ordering remain intact;
- lint errors fail the build;
- warnings are surfaced for review, even if they do not fail the build;
- pull requests receive a refreshed lint summary comment;
- the validation report is retained as a CI artefact for review.

## Suggested WordPress Triggers

Run the workflow when these change:

- `DESIGN.md`
- `theme.json`
- `styles/*.json`
- global CSS or Sass token files
- pattern or component files when they materially affect token usage

## Notes

- Prefer machine-readable JSON output from the CLI inside CI.
- Keep CI strict on errors and advisory on warnings unless the team explicitly raises the bar.
- Use the local validator script for richer reports during development, and the GitHub Action for continuous enforcement.
- Use a marker-based PR comment so each run updates one standing comment instead of spamming the thread.
