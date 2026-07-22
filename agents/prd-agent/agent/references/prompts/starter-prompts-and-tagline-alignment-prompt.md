# Starter prompts and tagline alignment prompt

Use this recurring prompt when the agent’s public-facing description or starter prompts may have drifted from the actual attached skills, instructions, and supported outputs.

## Prompt

Run a focused alignment pass over the agent tagline and starter prompts.

Goals:

- verify that the tagline and starter prompts still match what the agent actually does
- verify that the public-facing examples are aligned with the attached skills, configured sources, and current routing model
- identify starter prompts that are stale, misleading, duplicated, too generic, or no longer representative of the agent’s strongest workflows
- preserve the accepted agent role unless a concrete mismatch requires a correction

Priority checks:

1. verify that the tagline accurately reflects the current role and main outcomes
2. verify that each starter prompt demonstrates a real supported workflow
3. verify that starter prompts are distinct from one another and not redundant
4. verify that no starter prompt promises unsupported tools, sources, outputs, or delivery paths
5. verify that the starter prompts showcase the most valuable current entry points into the agent

Scope guidance:

- review the current tagline, starter prompts, instructions, attached skills, files, and configured apps
- compare the public-facing prompt library with the real routing and output model
- identify wording drift, stale examples, or missing showcase scenarios

Constraints:

- do not rewrite the whole agent role unless required by a concrete mismatch
- do not invent unsupported capabilities
- do not convert starter prompts into long setup forms
- do not make edits during this validation pass unless explicitly asked in follow-up

Output standard:

- identify high-signal alignment issues only
- explain what is stale, misleading, redundant, or missing
- recommend the smallest safe set of prompt and tagline repairs

## When to use it

- after major instruction changes
- after attaching or detaching major skills
- before sharing, publishing, or handoff
- whenever the public-facing entry points may have drifted from the agent’s real capabilities

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
