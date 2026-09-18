# Evidence model

Use these labels on findings:

- Confirmed live evidence: observed directly in connected site tooling.
- Confirmed repository evidence: confirmed from source code or repository files.
- Confirmed source-backed reference: confirmed from packaged source-backed references in this skill.
- Confirmed documentation evidence: confirmed from supplied docs or retained source links.
- Confirmed project rule: explicitly supplied by the user or project material.
- Memory only: stored from prior work and not freshly verified.
- Assumption: reasonable but unconfirmed; avoid using it for implementation claims.
- Unknown: not enough evidence.

## Conflict handling

Fresh live evidence overrides memory and older docs. If memory conflicts with current inspection, report the conflict, prefer the fresher verified source and update memory only with the new source-backed fact.

## Client-safe handling

Client-safe outputs may include confirmed findings, business impact and recommended actions. Keep internal speculation, raw dumps, unsure ownership and implementation debate out of client-facing sections.
