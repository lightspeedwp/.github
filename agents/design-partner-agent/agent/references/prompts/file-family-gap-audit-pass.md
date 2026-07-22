# File-family gap audit pass

Run a focused pass on visible workflow families to identify grounded gaps between examples, templates, schemas, and folder indexes.

## Goal

Catch visible workflow families that are incomplete, unevenly indexed, or described too confidently for the files that are actually present.

## Required workflow

1. Refresh your understanding of the current visible templates, examples, schemas, and folder READMEs.
2. Review workflow families that appear to share a common name or artifact type.
3. Check for drift between:
   - visible examples and matching visible template families
   - visible templates and matching visible schema families
   - README wording and the file families that are actually present
   - standalone visible examples and the surrounding folder guidance
4. Apply the smallest useful set of updates needed to make those visible family gaps explicit and non-misleading.

## What to look for

- visible examples with no matching visible template or schema family
- visible template families with no visible example or schema support
- README wording that implies every visible example belongs to a complete family when some are standalone exceptions
- file families that are partially present but described as fully structured or validator-backed
- composite or multi-artifact examples that should be described as exceptions rather than treated as standard families

## Editing rules

- Keep fixes conservative and grounded in the visible package.
- Do not invent missing templates, schemas, validators, or hidden workflow files.
- Prefer clarifying visible exceptions in READMEs over fabricating missing family members.
- Preserve useful examples unless they are clearly stale or misleading.

## Deliverable

Apply the smallest useful set of updates needed to make visible workflow-family gaps explicit and keep folder guidance accurate about which families are fully present versus standalone exceptions.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
