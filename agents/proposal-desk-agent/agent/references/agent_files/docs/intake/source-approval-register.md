# Source Approval Register

Use this register when the workflow depends on approved sources, restricted sources, cited evidence, or publication-sensitive material.

| Source | Source type | Intended use | Approval status | Approved by | Usage limits | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | questionnaire / user-upload / URL / Drive / Slack / design / repo / policy / brief |  | approved / restricted / pending / rejected |  | internal only / draft only / public use allowed / quote only / current-run only | confirmed / inferred / defaulted / missing |  |

## Rules

- Treat source restrictions as binding until the user or named approver changes them.
- Mark questionnaire-derived source assumptions as `inferred` unless explicitly confirmed.
- Do not treat internal discussion, Memory, or questionnaire defaults as approved public evidence by default.
- If publication rights or evidence suitability are unclear, mark the source as `pending` or `restricted` and proceed conservatively.
