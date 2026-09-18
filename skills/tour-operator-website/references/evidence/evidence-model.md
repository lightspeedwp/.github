# Evidence model

## Evidence labels

- Confirmed live evidence: observed via current connected tooling, admin, front-end, crawler or test output.
- Confirmed repository evidence: verified from source code.
- Confirmed uploaded source evidence: verified from files supplied in the current task.
- Confirmed documentation evidence: verified from approved documentation.
- Confirmed project rule: approved project-specific instruction or decision.
- Memory only: useful context but lower priority than fresh evidence.
- Assumption: a labelled inference that needs confirmation.
- Unknown: not enough evidence.

## Conflict handling

When sources conflict, report the conflict and prefer the newest verified evidence. Do not silently overwrite memory or documentation with assumptions.

## Source handling

- Cite or name the source type in the finding.
- Do not turn relationship/facet references into ownership claims.
- Do not expose secrets, credentials, raw logs or private client data.
- Keep client-safe outputs free of internal speculation and raw tool dumps.

## Stale evidence handling

- Treat memory and older documentation as helpful context, not proof.
- If fresh live evidence conflicts with bundled references, label the conflict and prefer the live evidence for the current task.
- If bundled references conflict with uploaded source files from the current request, prefer the current uploaded source files and recommend a content-model maintenance update.
- Do not delete or overwrite older evidence silently; mark it superseded and note the replacement source.

## Client-safe evidence posture

Client-facing copy may say "we found", "we checked" or "this needs confirmation". Avoid phrases that expose internal uncertainty such as "the skill does not know" or "the model hallucinated". Keep speculation in internal handoff only.
