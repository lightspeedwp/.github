# Maintenance and Release Guide

Use this guide when updating, reviewing, or sharing the router skill in a shared workspace agent.

## Release Discipline

- Treat every shared-agent package as a full replacement, not a patch.
- Keep the package filename as `skill.zip` when sharing the finished bundle.
- Update `references/changelog.md` for every behavioural, validation, fixture, or deployment change.
- Keep examples and fixture data anonymised.
- Keep `references/companion-skill-manifest.json` and `references/companion-skill-manifest.schema.json` aligned whenever supported downstream skills, connector assumptions, or fallback behaviours change.
- Prefer small, auditable edits over broad rewrites.
- Preserve the router boundary: route to the right workflow; do not perform downstream triage, investigation, drafting, escalation, or trend analysis.

## Before Editing

1. Identify the reason for the change: routing coverage, shared-agent safety, connector fallback, output consistency, validation, or documentation clarity.
2. Check whether the change belongs in `SKILL.md` or a reference file.
3. Keep `SKILL.md` compact and move detailed support material into `references/`.
4. Avoid adding assets or scripts unless they materially improve repeatability or validation.

## Edit Checklist

- Keep the frontmatter name as `zendesk-router-skill`.
- Keep the frontmatter description lowercase and trigger-focused.
- Mention new reference files in the Bundled References section of `SKILL.md`.
- Add or update anonymised examples when routing behaviour changes.
- Keep `references/router-test-fixtures.json` aligned with `references/test-cases.md`.
- Keep `references/companion-skill-manifest.json` aligned with the routing matrix, deployment checklist, and supported downstream skill list.
- Review `references/companion-interoperability-audit.md` when companion skill route names or parent-agent invocation rules change.
- Update `scripts/validate_router_pack.py` if a new required file, phrase, or portability rule is introduced.
- Do not include real ticket IDs, customer names, email addresses, account IDs, private queue/view names, or individual user assumptions.

## Validation Checklist

Run this from the skill root when code execution is available:

```bash
python3 scripts/validate_router_pack.py
```

The validation should confirm:

- Required files are present.
- Frontmatter is valid and shared-agent aware.
- Output contract fields are present.
- All supported `zendesk-` workflow skills have routing coverage.
- Reference links are mentioned from `SKILL.md`.
- Fixture data is valid JSON and has required fields.
- Shared-agent portability markers are absent.
- Deployment and maintenance references are present.
- Companion-skill manifest entries exist for every supported `zendesk-` workflow skill.
- Companion interoperability guidance is present for shared-agent skill-selection and canonical `zendesk-` route names.
- Manifest policy keeps router use independent of live Zendesk access while documenting which downstream workflows need Zendesk evidence.

## Packaging Checklist

- Remove temporary files, drafts, caches, and local notes before zipping.
- Confirm the package is well below the 25 MB upload limit.
- Confirm the zip contains the skill folder and not only loose files.
- Confirm `skill.zip` opens successfully and includes `SKILL.md`, `agents/openai.yaml`, `references/`, and `scripts/`.

## Shared-Agent Review Prompt

Use this prompt after installing the package in a shared agent:

```text
Route this Zendesk support request. The shared agent may not have Zendesk access, and the user has only pasted a short issue summary.
```

Expected behaviour: recommend a support workflow or ask for the smallest useful pasted evidence extract without assuming private connector access.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
