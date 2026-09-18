# Capability Profile Pack Patch

This patch adds a portable capability-profile pack for shared workspace agents using the Zendesk Backlog Trend Analysis skill.

## Files to copy into the skill

```text
profiles/workspace-capability-profile.template.json
profiles/workspace-capability-profile.shared-agent-example.json
references/capability-profile-maintenance.md
templates/shared-agent-installation-note.md
```

## Optional instruction update

Apply the `patch-notes/SKILL.md-insertion.md` snippet to the skill entrypoint so agents know when to use the new files.

## Validation

After copying the files into the skill directory, run:

```bash
python scripts/validate_capability_profile.py profiles/workspace-capability-profile.template.json
python scripts/validate_capability_profile.py profiles/workspace-capability-profile.shared-agent-example.json
python scripts/lint_portability.py .
```

Then run the full skill QA command if available:

```bash
python scripts/run_all_checks.py
```

## Shared-agent safety notes

The profile files intentionally avoid private ticket data, customer names, personal users, Zendesk view IDs, credentials, and raw custom-field IDs. They are designed to document capability, not live backlog state.
