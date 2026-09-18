## Case Investigation Working Note

**Case or ticket ID:** <id or `MISSING`> **Customer / account:** <name or handle> **Goal:** <RCA | Proof | Lookup> **Surface:** <UI | API | billing | SSO | import/export | other> **Current disposition:** <Open | Likely cause | Proven | Disproven | Inconclusive | Blocked> **Confidence:** <High | Medium | Low> **Recommended next action:** <best next move>

### Active issue

<one paragraph describing the customer-reported problem, expected behavior,
actual behavior, and why the case matters>

### Known identifiers

- ticket or case: <id or `MISSING`>
- user / org / workspace / account: <id(s) or `MISSING`>
- request / trace / error ID: <id(s) or `MISSING`>
- relevant time window: <absolute date or timestamp range, or `NOT_COMPLETED`>

### Branch ledger

| branch | question | source category | status | evidence |
| --- | --- | --- | --- | --- |
| <branch> | <what needs to be proven> | <{{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}} / [[logs]] / {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} / [[crm]] / {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}} / {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}> | <verified / disproven / blocked> | <artifact or note> |

### Sources checked

- {{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}}: <what was checked or `NOT_COMPLETED`>
- `[[logs]]`: <what was checked or `NOT_COMPLETED`>
- {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}}: <what was checked or `NOT_COMPLETED`>
- {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}: <what was checked or `NOT_COMPLETED`>
- {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} / {{label:Asana,id:asdk_app_69616780bd208191b4fb44ba44f72b61,type:app}}: <what was checked or `NOT_COMPLETED`>
- `[[crm]]`: <what was checked or `NOT_COMPLETED`>
- {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / exports / pasted artifacts: <what was checked or `NOT_COMPLETED`>

### Strongest evidence

- <fact with source and timestamp when relevant>
- <fact with source and timestamp when relevant>
- <fact with source and timestamp when relevant>

### Contradictions or gaps

- <where sources disagree>
- <what is still missing>

### Best-supported conclusion

<one concise conclusion matched to the investigation goal>

### Handoff options

- `draft-response`: <when the user now needs a customer-facing update>
- `customer-escalation`: <when the case needs cross-functional escalation>
- `create-knowledge`: <when the issue produced a stable workaround or reusable pattern>
- `customer-research`: <when broader account context would change the next move>

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
