# QA Rubric

Score each generated output from 1 to 5 against these checks.

| Area | Check | Pass condition |
|---|---|---|
| Trigger fit | Section-style generation is the right skill | The request is for a reusable layout zone rather than one block |
| Naming quality | Section naming is clear | The style name or class reflects the layout role |
| Scope quality | The output stays section-focused | It does not drift into full template or single-block work |
| Implementation discipline | Presets are preferred | The result does not hardcode values unnecessarily |
| CSS discipline | CSS is scoped well | Selectors are clearly tied to the section treatment |
| Boundary discipline | Adjacent requests are routed correctly | Block-style or template work is not absorbed here |

## Minimum Acceptance Standard

- no single-block request treated as a section style
- no full-template composition masquerading as a section style
- no unscoped custom CSS
- no unnecessary hardcoded values where presets are the better fit
