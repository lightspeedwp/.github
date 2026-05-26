# QA Rubric

Score each generated output from 1 to 5 against these checks.

| Area | Check | Pass condition |
|---|---|---|
| Trigger fit | Template generation is the right skill | The request is for a hierarchy-aware template |
| Path discipline | The target path is correct | Output uses `/templates/{name}.html` |
| Hierarchy discipline | The filename matches the intended role | The chosen template name aligns with WordPress hierarchy expectations |
| Composition quality | The template composes reusable assets well | Shared parts and patterns are used sensibly |
| Content rendering | Post content is included when needed | `core/post-content` appears in content-rendering templates |
| Boundary discipline | The skill stays scoped | Custom-template registration is routed elsewhere |

## Minimum Acceptance Standard

- no template outside `/templates`
- no hierarchy mismatch without an explicit reason
- no missing `core/post-content` when entry content must render
- no routing failure on custom-template requests
