# Local skill pack orchestrator prompt

Orchestrate the full local `tour-operator-website` skill workflow using the phased prompt pack in `prompts/tour-operator-website-local-skill/`.

This prompt is the default entrypoint for the pack. Its job is to choose, sequence, and gate the later phases without inventing package content, skipping unresolved blockers, or treating partial evidence as proof.

## Goal

Safely move from the source-of-truth folder `prompts/tour-operator-website` to one of these outcomes:

- a verified local skill package build
- a safely attached draft skill with the smallest coherent instruction alignment
- a controlled diagnosis of upload, attach, or routing corruption

## Single source of truth

Treat `prompts/tour-operator-website` as the only source of truth for the intended `tour-operator-website` skill package.

Do not treat maintenance notes, routing snapshots, old prompt wording, memory notes, or prior assumptions outside that source folder as stronger evidence than the source folder itself.

## Phase order

Default phase order:

0. `00-orchestrator-prompt.md`
1. `01-source-audit-prompt.md`
2. `02-package-contract-prompt.md`
3. `03-skill-entrypoints-prompt.md`
4. `04-reference-assets-reconciliation-prompt.md`
5. `05-local-package-assembly-prompt.md`
6. `06-upload-attach-alignment-prompt.md`
7. `07-corruption-debug-prompt.md`

## Core orchestration rules

- Start with phase 01 unless the current task already has a fresh, trustworthy source audit from this same pack.
- Run phases in order unless a later phase is explicitly required for diagnosis after a failed earlier attempt.
- Do not skip over a blocking gap identified by an earlier phase.
- Do not continue to package, upload, attach, or align instructions when the current phase verdict says the package is not yet safe.
- If a phase reports `not yet packageable`, route back to the earliest blocking phase rather than improvising a workaround.
- If upload, attach, or instruction alignment causes instability, move to phase 07 and diagnose the earliest failing step before making broader repairs.

## Required phase gates

Before moving to the next phase, confirm that the current phase has provided the minimum safe outcome:

- Phase 01 must produce a verified inventory and a packaging verdict.
- Phase 02 must lock the package contract or mark blocking gaps as unverified.
- Phase 03 must verify or safely derive the entrypoint layer without guessing.
- Phase 04 must reconcile required support files and flag missing references clearly.
- Phase 05 must assemble the local package or stop on missing required files.
- Phase 06 must upload, attach, and align only if earlier phases marked the package ready.
- Phase 07 must separate observed failure from inference and identify the smallest safe recovery step.

## Non-invention rules

- Do not invent missing files, metadata, assets, scripts, schemas, references, examples, or behaviour.
- Do not write `SKILL.md` from memory.
- Do not silently replace a missing source file with a plausible substitute.
- Do not treat partial file visibility as proof that a directory is complete.
- Do not broaden the skill’s role beyond what the source folder clearly supports.
- Do not conflate attached status, package readability, package validity, and live routing.

## Attach and publish discipline

- Treat local package assembly as separate from upload.
- Treat upload as separate from attachment.
- Treat attachment as separate from instruction alignment.
- Treat draft attachment as separate from making the current draft live.
- Do not claim the skill is live until the current draft has actually been made live.

## When to branch to corruption debugging

Route to `07-corruption-debug-prompt.md` when:

- upload fails unexpectedly
- attachment fails or partially succeeds
- the draft becomes unstable after attach
- instruction alignment produces conflicting routing ownership
- maintenance docs immediately contradict the new draft state
- the failure source is unclear and needs earliest-step diagnosis

## Output contract

At the end of an orchestration run, report:

1. `Current phase reached`
2. `Completed phases`
3. `Blocking gaps`
4. `Current package status`
5. `Smallest safe next phase`
6. `Why that next phase is the right one`

## Editing rules

- Be surgical, not expansive.
- Preserve exact current paths.
- Prefer stopping with a precise blocker over continuing with guessed package content.
- Use UK English.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
