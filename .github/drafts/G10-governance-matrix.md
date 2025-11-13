---
name: "📚 Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Governance/Teams] Publish Governance → Team → Paths matrix & tighten CODEOWNERS"
labels: [type:documentation, status:needs-triage, priority:normal, area:documentation, governance]
assignees: []
projects: []
milestone: ''
type: documentation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - ../GOVERNANCE.md
  - ../CODEOWNERS
---

## What documentation is needed?

We need to make code review ownership explicit by creating a clear matrix mapping governance roles to team handles and repository paths, then tightening CODEOWNERS patterns to reduce overly broad glob patterns that create ambiguous approval requirements.

**Current state:**
- CODEOWNERS uses broad globs (e.g., `docs/**/*`)
- Unclear which team owns which paths
- Approval ambiguity slows review process
- No documented governance audit schedule
- Hard to determine correct reviewer

**Desired state:**
- Governance → Team → Paths matrix published in GOVERNANCE.md
- CODEOWNERS uses narrow, specific patterns
- Clear ownership for every repository area
- Documented governance audit schedule
- Faster, clearer review assignments

## Why is this documentation important?

**For contributors:**
- Clear ownership enables faster PR reviews
- Reduces guesswork about who to request reviews from
- Improves confidence that right stakeholders are involved

**For maintainers:**
- Explicit ownership reduces review bottlenecks
- Narrow patterns prevent unintended required reviews
- Regular audits keep ownership current as team evolves

**Impact:**
- **High** - Slower reviews due to unclear ownership
- **Medium** - Approval ambiguity blocks merges
- **Medium** - Team changes cause outdated ownership

## Acceptance Criteria

- [ ] Governance → Team → Paths matrix added to `GOVERNANCE.md`
- [ ] Matrix includes:
  - Governance role (e.g., "Documentation Lead")
  - Team handle (e.g., `@lightspeedwp/docs-team`)
  - Owned paths (e.g., `docs/**/*.md`, `*.md`)
  - Review SLA (e.g., "24 hours for docs")
- [ ] CODEOWNERS updated with narrower patterns:
  - Replace broad globs with specific paths where possible
  - Add comments explaining each ownership block
  - Test patterns don't conflict or create gaps
- [ ] Governance audit schedule documented:
  - Frequency (e.g., quarterly)
  - Audit checklist (verify teams, paths, contacts)
  - Owner responsible for audit
- [ ] Cross-reference between GOVERNANCE.md and CODEOWNERS
- [ ] Examples provided for how to determine correct owner
- [ ] Follows [WordPress documentation standards](https://developer.wordpress.org/coding-standards/inline-documentation/)
- [ ] Changelog entry prepared for PR

## Additional Context

**Example Governance → Team → Paths matrix:**

| Governance Role | Team Handle | Owned Paths | Review SLA |
|----------------|-------------|-------------|------------|
| Documentation Lead | `@lightspeedwp/docs-team` | `docs/**/*.md`, `*.md` (root), `README.md` | 24 hours |
| Workflows Lead | `@lightspeedwp/workflows-team` | `.github/workflows/**/*`, `.github/automation/**/*` | 48 hours |
| Security Lead | `@lightspeedwp/security-team` | `SECURITY.md`, `security/**/*`, `*.security.*` | 12 hours (critical) |
| Governance Lead | `@lightspeedwp/governance-team` | `GOVERNANCE.md`, `CODEOWNERS`, `CONTRIBUTING.md` | 48 hours |

**Example tightened CODEOWNERS:**

```
# CODEOWNERS
# This file defines code ownership for automatic review assignment.
# Patterns are evaluated top-to-bottom; last match takes precedence.
# See: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners

# Default owners for everything (fallback)
* @lightspeedwp/maintainers

# Documentation ownership
docs/**/*.md @lightspeedwp/docs-team
*.md @lightspeedwp/docs-team
README.md @lightspeedwp/docs-team

# Workflows and automation
.github/workflows/**/* @lightspeedwp/workflows-team
.github/automation/**/* @lightspeedwp/workflows-team

# Security-critical files
SECURITY.md @lightspeedwp/security-team
security/**/* @lightspeedwp/security-team

# Governance and meta
GOVERNANCE.md @lightspeedwp/governance-team
CODEOWNERS @lightspeedwp/governance-team
CONTRIBUTING.md @lightspeedwp/governance-team @lightspeedwp/docs-team

# Agent specifications
agents/**/* @lightspeedwp/agents-team
AGENTS.md @lightspeedwp/agents-team @lightspeedwp/docs-team

# Schemas and validation
schemas/**/* @lightspeedwp/devex-team
```

**Audit schedule section to add to GOVERNANCE.md:**

```markdown
## Governance Audit Schedule

**Frequency:** Quarterly (every 3 months)

**Next Audit:** [Date]

**Responsible:** Governance Lead

**Audit Checklist:**
- [ ] Verify all teams in CODEOWNERS still exist
- [ ] Confirm team members are current and active
- [ ] Check paths still match repository structure
- [ ] Update SLAs if needed
- [ ] Review and remove any stale ownership entries
- [ ] Test CODEOWNERS patterns don't conflict
- [ ] Update matrix in GOVERNANCE.md

**Audit Log:**
- 2025-11-12: Initial matrix published
- [Future audit dates and changes]
```

**Testing CODEOWNERS patterns:**

```bash
# GitHub CLI method
gh api repos/lightspeedwp/.github/contents/CODEOWNERS --jq '.content' | base64 -d

# Test which owners are assigned for a file
# (requires GitHub CODEOWNERS testing tool or manual review)
```

**Common pitfalls to avoid:**
- Overlapping patterns that conflict
- Gaps where no owner is assigned
- Overly specific patterns that miss related files
- Missing team handles (must exist in GitHub org)

**Telemetry (post-merge):**
- Measure time to first reviewer assignment via CODEOWNERS (before/after)
- Track review SLA compliance
- Monitor conflicts or unclear ownership reports

## References

- [GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/GOVERNANCE.md)
- [CODEOWNERS](https://github.com/lightspeedwp/.github/blob/develop/CODEOWNERS)
- [GitHub CODEOWNERS documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)

---

### Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined
- [ ] Related docs/issues or files linked
- [ ] Acceptance criteria listed
- [ ] Estimate added: **Medium** (2-3 hours: matrix, CODEOWNERS, audit schedule)
- [ ] Team handles verified to exist

### Definition of Done (DoD)

- [ ] Matrix added to GOVERNANCE.md
- [ ] CODEOWNERS patterns narrowed and commented
- [ ] Audit schedule documented
- [ ] No pattern conflicts or gaps
- [ ] Documentation meets org standards and guidelines
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation reviewed for clarity and accessibility
- [ ] CODEOWNERS tested for correctness
- [ ] PR uses correct branch prefix (`docs/governance-matrix`)

---

## Directions & Next Steps

1. Create feature branch: `docs/governance-matrix`
2. Identify all current teams and their areas of responsibility
3. Create Governance → Team → Paths matrix in GOVERNANCE.md
4. Review current CODEOWNERS for overly broad patterns
5. Tighten CODEOWNERS with specific paths and add comments
6. Test CODEOWNERS patterns for conflicts and gaps
7. Add governance audit schedule section to GOVERNANCE.md
8. Cross-reference GOVERNANCE.md ↔ CODEOWNERS
9. Update CHANGELOG.md
10. Submit PR with reference: `fixes #<issue_number>`
11. Tag @governance-team or maintainer for review

**Branch prefix:** `docs/`

**Files to update:**
- `GOVERNANCE.md` (add matrix and audit schedule)
- `CODEOWNERS` (tighten patterns, add comments)
- `CHANGELOG.md` (document changes)

**Validation:**
```bash
# Check for team existence (GitHub CLI)
gh api orgs/lightspeedwp/teams

# Verify team handles in CODEOWNERS are valid
grep "@" CODEOWNERS | sort -u
```

See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
