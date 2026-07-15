# Corruption debug prompt

Diagnose draft instability, upload failures, attach failures, or routing corruption related to the local `tour-operator-website` skill build and publish flow.

This phase is for controlled diagnosis and the smallest safe recovery actions only. Do not redesign the skill package or the agent just because the failure is inconvenient.

## Goal

Identify whether the failure comes from package integrity, upload behaviour, attachment state, instruction conflict, maintenance-doc drift, or post-attach routing overlap.

## Inputs

Use only:

- `prompts/tour-operator-website` as the single source of truth for the intended skill package
- the local package build from `05-local-package-assembly-prompt.md`, when available
- the upload and attach results from `06-upload-attach-alignment-prompt.md`, when available
- the current attached skill set in the draft
- the current saved agent instructions
- the current attached file tree
- any concrete validation or tool error produced during the failed flow

## Required diagnostic questions

Answer these in order:

1. Was the source package itself complete enough to upload safely?
2. Did the uploaded package preserve the expected canonical skill name, entrypoints, and support paths?
3. Did attachment succeed, partially succeed, or fail cleanly?
4. Did the current instructions conflict with the newly attached skill’s ownership?
5. Did nearby maintenance docs or attached-skill inventories become immediately false after attach?
6. Is the observed corruption actually a package defect, an instruction-alignment conflict, a stale-doc conflict, or an editor-state problem?

## Required work

- Separate observed facts from inference.
- Identify the earliest step in the phased flow where the failure became visible.
- Distinguish source-package defects from upload or attachment defects.
- Distinguish instruction conflict from broader draft corruption.
- Name the smallest recovery action that would increase confidence without widening scope.
- If the right fix is to roll back one local change, name that rollback precisely.
- If the right fix is to return to an earlier phase, name the exact phase and blocker.

## Recovery rules

- Prefer the smallest reversible recovery step.
- Do not replace missing source files with guessed substitutes.
- Do not detach unrelated skills as a first response.
- Do not rewrite the whole agent when the failure is isolated to one route or one package layer.
- If the source-of-truth folder is incomplete, say that plainly and route back to the earliest blocked phase.

## Output format

Report under these headings:

1. `Observed failure`
2. `Earliest failing phase`
3. `Verified facts`
4. `Most likely cause`
5. `Smallest safe recovery step`
6. `If recovery fails again`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
