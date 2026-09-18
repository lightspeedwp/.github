# Archive and Versioning

Use this reference when a mutation is accepted, a changelog is needed, a rollback path must be recorded, or the user asks for version history.

## Version bump rules

Use semantic-style versions for skill packages unless the user supplies another convention.

| Change type | Bump | Examples |
|---|---|---|
| Patch | `x.y.z + 0.0.1` | typo fixes, wording clarity, template copy, non-behavioural cleanup |
| Minor | `x.y.z + 0.1.0` | new template, new reference file, new validator, new optional workflow, clearer routing |
| Major | `x.y.z + 1.0.0` | changed trigger scope, removed workflow, changed approval gates, changed tool permissions, incompatible output contract |

When uncertain, prefer the smaller bump and state the assumption. Do not use a major bump unless prior behaviour may break.

## Archive decision record

Create an archive entry when a mutation is accepted, rejected for an important reason, or deferred because of a safety or evidence gap.

Required fields:

- `version`: new version or proposed version.
- `parent_version`: previous version, source file, or baseline reference.
- `date`: ISO date when the decision was made.
- `owner`: approving person or team if known; otherwise `unknown`.
- `mutation_type`: one taxonomy label from `SKILL.md`.
- `summary`: one-sentence description.
- `evidence`: source feedback, test result, user approval, or artefact citation.
- `evaluation`: how the change was checked.
- `verdict`: `accepted`, `revised`, `held`, or `rejected`.
- `rollback`: how to restore the previous state.

Optional fields:

- `risk_level`: `low`, `medium`, `high`, or `blocked`.
- `affected_files`: list of files changed.
- `approval_level`: proposal, local package, connected edit, publication, or permission change.
- `follow_up`: next action if the change is incomplete.

## Evidence discipline

Use these labels in archive entries and changelogs:

- **Confirmed**: directly supported by a source file, tool result, test output, or explicit user instruction.
- **Inferred**: reasonable but not directly proven.
- **Unverified**: plausible, not tested, and not safe as the basis for irreversible work.
- **Blocked**: cannot proceed without missing authority, source access, or evidence.

## Rollback notes

A rollback note must be practical enough for another agent to follow. Prefer:

- restore the previous packaged `skill.zip`;
- restore named files from an archive path;
- revert a named commit or patch;
- remove the added reference or script and restore the previous `SKILL.md` reference list.

Avoid vague rollback notes such as “undo changes”.

## JSONL archive example

```json
{"version":"1.2.0","parent_version":"1.1.0","date":"2026-07-03","owner":"Ash Shaw","mutation_type":"reference","summary":"Added versioning and archive discipline guidance.","evidence":[{"source":"user approval","note":"User asked to proceed with next batch of recommendations."}],"evaluation":{"method":"manual review plus packaging validation","result":"passed"},"verdict":"accepted","rollback":"restore version 1.1.0 package from archive"}
```

## Markdown archive example

```markdown
| Version | Parent | Date | Type | Evidence | Evaluation | Verdict | Rollback |
|---|---|---|---|---|---|---|---|
| 1.2.0 | 1.1.0 | 2026-07-03 | reference | user-approved update | packaging validation passed | accepted | restore 1.1.0 zip |
```
