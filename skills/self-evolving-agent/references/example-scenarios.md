# Example Scenarios

Use this reference when trigger, routing, or output expectations are unclear. Pick the closest examples and adapt them to the artefact under review.

## Positive triggers

| User request | Correct route | Expected output |
|---|---|---|
| “What improvements can you make to this skill?” | Quick improvement audit | Baseline, opportunities, risk, recommended mutation; no file edits. |
| “Proceed with your recommendations to improve this skill.” | Apply and archive | Local file updates, validation, changelog, packaged `skill.zip`. |
| “Compare these two agent prompts.” | Evaluate mutation or variant comparison | Side-by-side verdict with evidence and regression checks. |
| “Create a rollback note for this accepted change.” | Archive discipline | Changelog/archive entry with version, evidence, evaluation, rollback. |
| “Turn this feedback log into mutation proposals.” | Evolution cycle | Normalised observations if useful, then bounded mutation candidates. |

## Negative triggers

| User request | Correct route | Why |
|---|---|---|
| “Create a brand new skill from this workflow.” | `skill-creator` primary | New skill creation and packaging rules belong there. |
| “Validate this uploaded skill zip.” | `skill-creator` primary | Uploaded ZIP intake and packaging validation belong there. |
| “Draft a reply to this customer.” | Domain drafting skill | This skill should not absorb customer-facing domain work. |
| “Write the WordPress pattern from this design.” | WordPress/Figma specialist skill | Self-evolution only captures reusable lessons after the domain work. |
| “Check this current law or product price.” | Web/research workflow | This skill does not replace current-source research. |

## Edge cases

| User request | Safe handling |
|---|---|
| “Improve yourself automatically every time you fail.” | Refuse autonomous self-modification; propose a human-approved proposal/evaluation loop. |
| “Apply this mutation to the repo.” | Require explicit repo target and approval for connected edit; local package approval is not enough. |
| “Publish this skill to the workspace.” | Require explicit publication approval after validation. |
| “Add Slack, Gmail, Drive, and GitHub access.” | Treat as a permission change; require safety review and explicit approval. |
| “Remember all failed outputs forever.” | Keep raw failures local unless the user explicitly approves durable memory and it is safe to store. |

## Output examples

### Quick audit result

```markdown
- Value: [highest-impact opportunity]
- Risk: [main regression or safety risk]
- Next step: [one bounded mutation]

| Priority | Type | Target | Change | Risk | Evidence |
|---:|---|---|---|---|---|
| 1 | workflow | SKILL.md | Add quick audit path | Low | Confirmed |
```

### Approved application result

```markdown
- Value: Applied the approved local update set.
- Risk: No connected systems were edited or published.
- Next step: Review or upload the packaged `skill.zip`.

Changed files: ...
Validation: passed
Rollback: restore previous package ...
```

## Common failure modes

- Producing a broad rewrite when a small mutation would do.
- Skipping archive and rollback notes after accepted changes.
- Treating local packaging approval as publication approval.
- Inventing benchmark metrics from subjective review.
- Absorbing specialist domain work instead of routing to the correct skill.
- Adding scripts without testing or documenting safe usage.
