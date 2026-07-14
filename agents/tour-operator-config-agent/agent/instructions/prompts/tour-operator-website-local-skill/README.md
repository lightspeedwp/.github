# Tour Operator Website local skill prompt pack

Use this folder for the phased prompts that audit, build, verify, package, upload, attach, and debug a local `tour-operator-website` skill from `prompts/tour-operator-website`.

## Core rule

Treat `prompts/tour-operator-website` as the single source of truth.

Do not invent missing files, missing wording, missing metadata, missing routes, missing references, missing scripts, missing assets, or missing package structure.

If something needed for a valid skill package is absent, unreadable, contradictory, or only partially visible, report the gap and stop or narrow the task instead of filling it with plausible-looking replacements.

## Default entrypoint

Start with `00-orchestrator-prompt.md` when you need to run the full local-skill workflow or decide which phase should run next.

The orchestrator controls phase order, phase gates, blocker handling, attach discipline, and corruption-debug routing.

## Intended phase order

0. `00-orchestrator-prompt.md`
1. `01-source-audit-prompt.md`
2. `02-package-contract-prompt.md`
3. `03-skill-entrypoints-prompt.md`
4. `04-reference-assets-reconciliation-prompt.md`
5. `05-local-package-assembly-prompt.md`
6. `06-upload-attach-alignment-prompt.md`
7. `07-corruption-debug-prompt.md`

## Pack purpose

This phased pack supports two safe outcomes:

- build a local `tour-operator-website` skill package from the verified source folder
- publish that local skill into the current draft with the smallest coherent routing alignment

The pack is designed for a large, exacting skill package where unsupported invention would create package drift or agent corruption.

## Package goal

The end state is a local `tour-operator-website` skill package that:

- is built only from verified material in `prompts/tour-operator-website`
- has a valid canonical skill entrypoint and package metadata
- preserves the exact specialist role already evidenced by the source folder
- can be uploaded and attached without mixing guessed content into the package
- can be routed from the agent instructions with the smallest coherent instruction change
- can be debugged methodically if upload or attach causes draft instability

## Non-invention rules

- Never replace a missing source file with a newly drafted substitute unless a later phase explicitly says the source folder itself contains enough verified content to derive that file exactly.
- Never treat partial file visibility as proof that a directory is complete.
- Never convert maintenance assumptions into package facts.
- Never claim upload-readiness, package validity, publish-readiness, or attach safety until the relevant phase has verified it.
- Preserve exact current paths whenever the source folder already defines them.
- Use UK English.
