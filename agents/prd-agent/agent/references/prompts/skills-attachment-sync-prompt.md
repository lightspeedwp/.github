# Skills attachment sync prompt

Use this recurring prompt when attached skills, skill-routing language, or skill-inventory files may have drifted after new skills were added, removed, renamed, or promoted.

## Prompt

Run a focused attached-skills sync pass over the current agent scaffold.

Goals:

- verify that the real attached-skill layer matches the routing language in the agent instructions, references, prompt-library files, and skill-inventory docs
- identify stale skill references, missing attached-skill references, duplicate routing language, and misleading role boundaries
- keep the skill layer auditable after promotion, attach, detach, or routing updates

Priority checks:

1. verify that every attached skill referenced in the instructions is still attached and correctly named
2. verify that newly attached skills are represented where the routing model clearly depends on them
3. verify that inventory files, parity docs, and skill-routing docs match the actual attached-skill layer
4. verify that generic or legacy skill references do not conflict with the current specialist skill boundaries
5. verify that the routing layer still makes it clear which requests should not be forced through every skill

Scope guidance:

- review the main instructions first
- review skill inventory and skill-routing reference files
- review prompt-library files that mention attached skills or skill-routing expectations
- review rollout or parity docs where attached-skill state materially affects guidance

Constraints:

- do not invent replacement skills
- do not silently rename attached skills
- do not claim full alignment if exact-name or exact-role gaps remain unresolved
- do not widen scope into unrelated cleanup unless a concrete skill-sync issue requires it

Output standard:

- list only high-signal sync findings
- group findings by blocking, important, and cleanup-only
- explain the smallest safe sync change for each mismatch
- summarize which parts of the skill-routing layer are trustworthy versus drifted

## When to use it

- after attaching or detaching skills
- after promoting local skills into attached skills
- after a major routing rewrite
- before a promotion-readiness or handoff review

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
