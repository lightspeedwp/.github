# QA Rubric

Score each generated output from 1 to 5 against these checks.

| Area | Check | Pass condition |
|---|---|---|
| Trigger fit | Custom-template generation is the right skill | The request is for a registered non-hierarchy template |
| Pairing discipline | Both deliverables are present | The template file and `theme.json` fragment are both returned |
| Naming quality | Template name and title are sound | `name` is stable hyphen-case and `title` is readable |
| Scope quality | Post type scope is explicit | `postTypes` reflects the intended use case |
| Content rendering | Entry content appears when needed | `core/post-content` is included where content must render |
| Boundary discipline | Standard hierarchy requests are routed away | Normal templates are not mislabeled as custom templates |

## Minimum Acceptance Standard

- no custom template without a matching registration fragment
- no registration fragment without a matching template file unless explicitly requested
- no hierarchy-template request handled as a custom template
- no missing `core/post-content` where editable content must render
