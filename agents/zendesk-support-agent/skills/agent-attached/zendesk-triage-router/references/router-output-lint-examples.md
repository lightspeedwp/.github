# Router output lint examples

Use these synthetic examples to test `scripts/lint_router_output.py`. They contain no real customer or ticket data.

## Valid routing output

```markdown
## Recommended route

- **Primary workflow:** `zendesk-evidence-collector`
- **Optional supporting workflow:** `zendesk-case-readiness-check`

## Why this route fits

The user needs proof of what happened before a customer reply. The object of work is one support case with an unclear cause, so evidence collection is the immediate next action.

## Next deliverable

An evidence-backed case summary with confirmed symptoms, timeline, unknowns, and the smallest next support action.
```

Expected lint result:

```bash
python3 scripts/lint_router_output.py valid-routing.md
# Router output lint passed.
```

## Valid embedded triage output

```markdown
## Triage

**Issue type:** Bug
**Severity:** Medium
**Recommended priority:** Normal
**Recommended owner/team:** Senior / technical support
**Duplicate risk:** Not completed

### Summary
The supplied evidence describes a contained product issue with no confirmed outage or broad pattern. The case needs support ownership and a clearer impact check before any escalation.

### Evidence
- The customer reports a repeatable failure in one workflow.
- No security, billing, or broad outage signal is included in the supplied context.

### Unknowns
- Zendesk priority, SLA state, organisation impact, related-ticket links, and workaround status are not available.

### Recommended next step
- Ask senior / technical support to confirm scope, workaround availability, and duplicate or pattern risk in Zendesk.
```

Expected lint result:

```bash
python3 scripts/lint_router_output.py valid-triage.md
# Router output lint passed.
```

## Invalid routing output

```markdown
## Recommended route

- **Primary workflow:** `linear-triage-router`
- **Optional supporting workflow:** `zendesk-evidence-collector`

## Why this route fits

The ticket mentions a bug.

## Next deliverable

Create a Linear issue now.
```

Expected lint result: fail, because Linear is not a valid primary route for Zendesk-first support routing and the downstream issue is premature.

## Invalid embedded triage output

```markdown
## Triage

**Issue type:** Bug
**Severity:** Urgent
**Recommended priority:** Medium
**Recommended owner/team:** Engineering
**Duplicate risk:** Confirmed

### Summary
The root cause is definitely the import service.
```

Expected lint result: fail, because `Urgent` is a priority, `Medium` is not an allowed priority value, `Confirmed` is not an allowed duplicate-risk value, and required sections are missing.
