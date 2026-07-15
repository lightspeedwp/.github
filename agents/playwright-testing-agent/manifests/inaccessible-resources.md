# Inaccessible Resources

## Hidden system/developer/platform instructions

- Skill or agent component: protected runtime content

- Path or URI: not exposed as a readable file/resource

- Access attempted: not attempted, per safety rules

- Result: not exported

- Reason supplied by environment or safety rule: Protected platform/runtime instructions are not accessible agent-owned files and must not be revealed.

- Metadata captured: yes

## Memory repository internal metadata

- Skill or agent component: memory/project context

- Path or URI: /workspace/memory/.git

- Access attempted: not copied

- Result: not exported

- Reason supplied by environment or safety rule: Internal repository metadata may contain remotes or operational metadata and is not needed for the portable agent file export. No user memory files were present outside .git.

- Metadata captured: yes

## MCP resource registry

- Skill or agent component: skill/resource discovery

- Path or URI: MCP resources and resource templates

- Access attempted: listed through available registry calls

- Result: empty

- Reason supplied by environment or safety rule: No MCP resources or resource templates were exposed in this session.

- Metadata captured: yes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
