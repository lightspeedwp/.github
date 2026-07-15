# Inaccessible Resources

| Resource name | Skill or agent component | Path or URI | Access attempted | Result | Reason supplied by the environment | Metadata captured |
| --- | --- | --- | --- | --- | --- | --- |
| /workspace/memory/.git | memory folder | /workspace/memory/.git | export decision | not exported | runtime repository internals are not agent content and may contain remote configuration; skipped by safety rule | yes |
| HarvestApp connector tools | attached connector | not exposed as filesystem skill folder | skill source export | not exported | connector/tool implementation and credentials are platform-managed and not exposed as skill files | yes |
| MCP skill/resource registry | skill discovery | MCP resources/templates | list resources and templates | empty | environment returned no MCP resources or resource templates | yes |

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
