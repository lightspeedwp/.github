# QA Findings Workflow

## 1. Normalise findings

Convert raw notes into a consistent structure:

- finding ID
- summary
- source
- affected URL, template, block, component or form
- expected result
- actual result
- evidence
- reproduction steps
- severity
- workstream
- owner role
- launch status
- retest steps

## 2. Confirm evidence quality

Use these labels:

| Label | Meaning |
|---|---|
| Reproducible | Clear steps and evidence exist |
| Partial Evidence | Evidence exists but steps are incomplete |
| Needs Reproduction | Cannot confirm from supplied notes |
| Duplicate | Already covered by another finding |
| Invalid | Expected behaviour or out of scope |

## 3. Route work

Assign each finding to a workstream:

- Figma/design parity
- Block theme
- Block plugin
- Pattern/template
- Content/copy
- Claim/proof
- Accessibility
- Responsive/mobile
- Forms/conversion
- Analytics/tagging
- Redirects/SEO
- Schema/AI discoverability
- Performance
- Policy/governance
- Launch operations

## 4. Generate outputs

Always separate:

- launch blockers
- must-fix items
- post-launch items
- invalid/duplicate items
- GitHub-ready issue drafts
- retest checklist
