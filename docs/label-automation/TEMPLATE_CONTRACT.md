# Template → Label/Type Contract (develop)

**Canonical sources:**

- Labels: `.github/automation/labels.yml`
- Types: `.github/automation/issue-types.yml`

## Rules

- Every issue template must yield exactly one `type:*` label.
- All `labels[]` must exist in `labels.yml` (exact-case).
- Hidden anchors allowed: `<!-- type::bug -->`, `<!-- scope:docs -->`.

## Verification

- CI job validates template labels/types against YAML.
- Changes to templates/automation trigger `labeling.yml`.
