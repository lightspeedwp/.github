# Routing audit prompt

Use this recurring prompt when you want to verify that the agent's documented routing model still matches the real attached-skill layer, parity status, and intended operating sequence.

## Prompt

Run a focused routing audit over the current agent.

Goals:

- verify that routing docs still match the real attached skills
- verify that exact shared-skill parity status is reflected correctly in routing guidance
- verify that local uploaded helper skills are clearly distinguished from exact shared-skill matches
- verify that unresolved shared-skill gaps are not silently treated as resolved

Check:

- references/SKILL_INVENTORY.md
- references/skill-routing-spec.md
- references/skill-parity-audit.md
- docs/rebuild-guide.md
- docs/phased-builder-sequence.md
- rollout/rebuild-rollout-checklist.md
- rollout/skill-parity-manual-resolution-checklist.md

Constraints:

- do not invent replacement skills
- do not collapse near matches into exact parity matches
- do not claim full parity unless every expected exact skill is resolved

Output:

- list routing mismatches
- list stale routing references
- list parity-related routing risks
- make only high-signal routing corrections

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
