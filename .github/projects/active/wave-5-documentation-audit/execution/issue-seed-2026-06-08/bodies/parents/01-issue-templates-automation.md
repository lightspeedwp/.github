## Overview

Comprehensive audit of issue templates, their relationship to the automated labeling system, and how AI agents should create issues to trigger proper automation.

## In-Scope

- Inventory and standardise issue templates in `.github/ISSUE_TEMPLATE/`
- Map template usage to expected automation triggers
- Identify issue-specific automation gaps in `.github/labeler.yml`
- Define agent-safe instructions for issue creation and triage

## Out-of-Scope

- Workflow engine rewrites unrelated to issue automation
- PR-only template redesign unless directly needed for issue parity

## Current Problems

1. Issue templates exist but do not consistently trigger expected automation.
2. PR template behaviour is better defined than issue template behaviour.
3. Issue-side rules in `.github/labeler.yml` are limited or unclear.
4. Agent guidance on issue construction is incomplete.

## Acceptance Criteria

- [ ] All issue templates audited and categorised
- [ ] Template-to-automation mapping documented with gaps
- [ ] Issue-rule coverage in `.github/labeler.yml` assessed
- [ ] Agent issue-creation guidance drafted/updated

## Deliverables

- Inventory matrix (template, type, status, usage)
- Trigger mapping report (expected vs observed)
- Gap list and recommendations
- Follow-up implementation issue list (if required)

## Related Files

- `.github/ISSUE_TEMPLATE/`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/README.md`
- `.github/labeler.yml`
- `.github/issue-types.yml`
- `docs/ISSUE_CREATION_GUIDE.md`
- `.github/custom-instructions.md`
