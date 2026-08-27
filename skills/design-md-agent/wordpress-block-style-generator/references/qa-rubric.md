# QA Rubric

Score each generated output from 1 to 5 against these checks.

| Area | Check | Pass condition |
|---|---|---|
| Trigger fit | Block-style generation is the right skill | The request is for a style on a specific block |
| Naming quality | Style naming is clear | Label is readable and slug is stable hyphen-case |
| Scope quality | The style stays block-specific | The output does not drift into section-wide styling |
| Implementation discipline | Native mechanisms are preferred | The result does not add unnecessary custom complexity |
| CSS discipline | CSS is scoped well | Selectors are tied to the style and block context |
| Boundary discipline | Broader styling requests are routed away | Section-style work is not absorbed here |

## Minimum Acceptance Standard

- no section-wide design request treated as a simple block style
- no unclear style slug or label
- no unscoped custom CSS
- no unnecessary hardcoded values where presets are the better fit
