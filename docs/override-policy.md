---
title: "Downstream Override Policy For Organisation Defaults"
description: "Policy defining mandatory and optional organisation defaults for downstream repositories, including exceptions, versioning, and promotion."
version: "v0.1.1"
last_updated: "2026-05-27"
owners: ["LightSpeed Team"]
tags: ["governance", "policy", "adoption", "override", "documentation"]
domain: "governance"
stability: "active"
references:
  - path: "SHARED_GITHUB_ADOPTION_GUIDE.md"
    description: "Adoption process and practical implementation guidance"
  - path: "AUTOMATION_GOVERNANCE.md"
    description: "Organisation automation and governance standards"
  - path: "../instructions/file-organisation.instructions.md"
    description: "Canonical placement and boundary guidance"
---

# Downstream Override Policy For Organisation Defaults

## Scope

This policy defines how downstream LightSpeed repositories adopt organisation
defaults published from this `.github` repository, and where local overrides
are allowed.

This policy applies to:

- Community health files (issue and pull request templates, support, security,
  and conduct).
- GitHub governance defaults (labels, issue types, triage conventions, and
  governance-aligned docs).
- Shared adoption guidance for repository maintainers.

This policy does not replace repository-specific implementation rules, product
architecture, or runtime behaviour decisions.

## Mandatory Vs Optional

Downstream repositories must inherit mandatory defaults unless an approved
exception is recorded.

| Default Area | Default Source | Requirement | Local Override Policy |
| --- | --- | --- | --- |
| Community health baseline (`CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, contributing flow) | `.github` root canonical files | Mandatory | Allowed only with approved exception and documented legal or operational reason. |
| Pull request and issue template structure | `.github/PULL_REQUEST_TEMPLATE*`, `.github/ISSUE_TEMPLATE/*` | Mandatory | Local wording and examples may be adjusted; required sections and governance checks must remain. |
| Label families and issue type schema shape | `.github/labels.yml`, `.github/issue-types.yml` | Mandatory | Repository-specific additive labels are allowed; canonical families and schema contract cannot be removed. |
| Workflow governance controls | `docs/AUTOMATION_GOVERNANCE.md` plus workflow defaults | Mandatory | Local workflow steps may extend checks; governance gates and security guardrails must not be weakened. |
| Instruction and documentation implementation detail | `instructions/*`, `docs/*` guidance | Optional with constraints | Repositories may add stricter local rules when they do not conflict with mandatory governance controls. |
| Repository-specific delivery logic | Local repository codebase | Optional | Fully overrideable; must still meet security, accessibility, and quality standards. |

## Requesting Exceptions

Use this process for any deviation from a mandatory default:

1. Open a governance issue in [lightspeedwp/.github](https://github.com/lightspeedwp/.github/issues) with:
   - downstream repository name and path;
   - default being overridden;
   - business or technical reason;
   - risk assessment and rollback plan;
   - proposed review date.
2. Link the downstream pull request and include side-by-side diff evidence.
3. Obtain approval from maintainers responsible for governance.
4. Record the approved exception in downstream documentation, including:
   - rationale;
   - approval reference (issue and pull request links);
   - expiry or review checkpoint.
5. Reconfirm exception validity during major governance version changes.

Emergency exceptions are permitted for production safety or legal obligations,
but must be backfilled with full documentation within two working days.

## Versioning And Promotion

Policy evolution uses incremental versions with explicit promotion steps:

1. Draft changes on a `docs/*` branch and link a governance issue.
2. Validate links, formatting, and cross-references before review.
3. Merge after maintainer approval.
4. Announce the new version in downstream adoption or release notes.
5. Allow downstream repositories one adoption cycle to align unless a critical
   security change requires immediate rollout.

Versioning model:

- `v0.x`: policy is active but still refining edge cases.
- `v1.0`: policy baseline is stable and expected for all downstream repos.
- `v1.x`: additive clarifications or tighter controls that remain backward
  compatible.
- `v2.0+`: potentially breaking governance changes requiring explicit migration.

## Telemetry

Track downstream adoption acknowledgement with the pull request checkbox:

- `I have reviewed and applied the downstream override policy (or linked an approved exception).`

This checkbox is a governance signal and does not replace reviewer judgement.

## References

- [Shared .github Adoption Guide](./SHARED_GITHUB_ADOPTION_GUIDE.md)
- [Automation Governance](./AUTOMATION_GOVERNANCE.md)
- [Contributing](../CONTRIBUTING.md)
- [Documentation Hub](./README.md)
