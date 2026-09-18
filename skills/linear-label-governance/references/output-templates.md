# Output Templates

## Label Review

```markdown
### Label Check

- Target: [Linear issue or linked PR]
- Mode: read-only
- Result: [compliant / non-compliant / unable to verify]
- Observed: `[labels]`
- Violations: [none or concise list]
- Taxonomy-sync gaps: [none or concise list]
- Recommended set: `[canonical labels]`
- Verification: [canonical file checked; live Linear checked or not checked]
```

## Pre-Write Summary

```markdown
### Proposed Label Change

- Records affected: [count and identifiers]
- Add: `[labels]`
- Remove: `[labels]`
- Reason: [one sentence]
- Canonical membership: [verified / not verified]
- Live Linear availability: [verified / missing labels]
```

## Taxonomy-Sync Gap

```markdown
### Taxonomy-Sync Gap

- Canonical label: `[family:value]`
- Linear state: [missing or legacy alternative]
- Impact: [why compliant labeling cannot proceed]
- Recommendation: sync the canonical label into Linear before applying labels; do not substitute `[legacy label]`.
```

## New Label Needed

```markdown
### Governance Request Needed

- Unmet classification need: [short description]
- Existing canonical labels checked: [scope]
- Recommendation: propose a new canonical label in `.github/labels.yml`, then sync it to Linear.
- No label was invented or applied.
```
