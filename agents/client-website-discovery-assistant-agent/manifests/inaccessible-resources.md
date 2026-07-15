# Inaccessible Resources

| Resource name | Skill or agent component | Path or URI | Access attempted | Result | Reason supplied by the environment | Metadata captured |
| --- | --- | --- | --- | --- | --- | --- |
| hidden system messages | protected runtime | not exposed | not attempted | not exported | protected platform content; not accessible as files | no |
| developer instructions | protected runtime | not exposed | not attempted | not exported | protected platform content; not accessible as files | no |
| connector credentials | connected apps | not exposed | not attempted | not exported | credentials/secrets are protected and out of scope | no |
| workspace memory git metadata | agent memory | /workspace/memory/.git | not attempted | not exported | excluded to avoid repository metadata and possible remotes | yes |
| MCP skill resources | skill registry | MCP resources/templates | listed | none returned | environment returned empty resource and template lists | yes |

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
