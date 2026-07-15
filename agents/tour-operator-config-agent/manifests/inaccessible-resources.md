# Inaccessible Resources

## Hidden system/developer runtime instructions

- Resource name: Hidden system/developer runtime instructions
- Skill or agent component: agent runtime
- Path or URI: protected runtime context
- Access attempted: not attempted beyond visible file checks
- Result: not exported
- Reason supplied by environment: protected platform message, not a file
- Metadata still captured: yes

## Connector credentials and authentication tokens

- Resource name: Connector credentials and authentication tokens
- Skill or agent component: external apps
- Path or URI: protected connector configuration
- Access attempted: not attempted
- Result: not exported
- Reason supplied by environment: explicitly excluded for safety
- Metadata still captured: yes

## MCP skill resource URIs

- Resource name: MCP skill resource URIs
- Skill or agent component: skill registry
- Path or URI: none exposed
- Access attempted: list resources
- Result: no resources returned
- Reason supplied by environment: environment exposed no skill resources
- Metadata still captured: yes

## Codex runtime SQLite state and logs

- Resource name: Codex runtime SQLite state and logs
- Skill or agent component: runtime configuration
- Path or URI: /root/.codex/*.sqlite*
- Access attempted: identified by filesystem listing only
- Result: not exported
- Reason supplied by environment: excluded as protected runtime state/log data, not portable agent-owned configuration
- Metadata still captured: yes

## Codex installation identifier

- Resource name: Codex installation identifier
- Skill or agent component: runtime configuration
- Path or URI: /root/.codex/installation_id
- Access attempted: identified by filesystem listing only
- Result: not exported
- Reason supplied by environment: excluded as environment identifier
- Metadata still captured: yes

## Shell snapshots

- Resource name: Shell snapshots
- Skill or agent component: runtime configuration
- Path or URI: /root/.codex/shell_snapshots/*
- Access attempted: identified by filesystem listing only
- Result: not exported
- Reason supplied by environment: excluded as runtime session state, not agent-owned configuration
- Metadata still captured: yes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
