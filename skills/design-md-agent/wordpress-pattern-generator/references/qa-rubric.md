# QA Rubric

Score each generated output from 1 to 5 against these checks.

| Area | Check | Pass condition |
|---|---|---|
| Trigger fit | Pattern generation is the right skill | The request is for a theme pattern |
| Metadata quality | Header fields are correct | The pattern header uses supported keys and a namespaced slug |
| Category discipline | Category choice is sensible | Core categories are preferred unless a custom one is justified |
| Body validity | The body is usable block markup | The pattern file contains plausible WordPress block markup |
| Boundary discipline | The skill stays focused | Template or custom-template work is routed elsewhere |
| Validation handoff | Review is encouraged | The output points to validator review before commit |

## Minimum Acceptance Standard

- no unnamespaced slug
- no missing standard header scaffold
- no invalid asset-type mixing
- no silent assumption about visibility when `Inserter` intent is clear
