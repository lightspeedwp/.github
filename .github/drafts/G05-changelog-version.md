---
name: "📚 Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Docs/Governance] Fix CHANGELOG/VERSION and add doc-versioning policy (semver)"
labels: [type:documentation, status:needs-triage, priority:normal, area:documentation, governance, version:v0.2.0]
assignees: []
projects: []
milestone: 'v0.2.0'
file_type: documentation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - ../CHANGELOG.md
  - ../VERSION
  - ../GOVERNANCE.md
---

## What documentation is needed?

We need to clarify how semantic versioning (semver) applies to documentation and governance files, ensure the CHANGELOG is current with a properly dated release section, and align the VERSION file to match.

**Current state:**
- Unclear versioning policy for docs and governance files
- CHANGELOG may be missing current release section
- VERSION file may not match CHANGELOG
- No documented semver application for non-code changes
- Untrusted documentation state

**Desired state:**
- Clear doc-versioning policy documented in `docs/VERSIONING.md`
- CHANGELOG contains dated current release section
- VERSION file matches CHANGELOG version
- Contributors understand when/how to version docs
- Governance and docs follow consistent semver approach

## Why is this documentation important?

**For contributors:**
- Clear versioning policy enables confident documentation updates
- Understanding version impact prevents incorrect bumps
- Consistent history builds trust in documentation state

**For maintainers:**
- Automated checks can enforce versioning rules
- Clear changelog simplifies release management
- Proper version alignment supports audit and compliance

**Impact:**
- **Medium** - Unclear history damages trust
- **Medium** - Blocks v0.2.0 release without clear versioning
- **Low** - Inconsistent versions cause confusion

## Acceptance Criteria

- [ ] `docs/VERSIONING.md` created with clear semver policy for docs/governance
- [ ] VERSIONING.md explains when to bump major/minor/patch for docs
- [ ] VERSIONING.md referenced from CONTRIBUTING.md and GOVERNANCE.md
- [ ] `CHANGELOG.md` contains dated current release section (e.g., "## [0.2.0] - 2025-11-12")
- [ ] All recent changes documented in CHANGELOG under correct version
- [ ] `VERSION` file content matches CHANGELOG version exactly
- [ ] Version format follows semver: `MAJOR.MINOR.PATCH`
- [ ] Examples provided for doc-only version bumps
- [ ] Policy integrated with PR and release workflows
- [ ] Follows [WordPress documentation standards](https://developer.wordpress.org/coding-standards/inline-documentation/)
- [ ] Changelog entry prepared for PR

## Additional Context

**Suggested semver policy for docs/governance:**

**MAJOR (e.g., 0.x.0 → 1.0.0):**
- Breaking changes to governance processes
- Major documentation restructuring
- Incompatible changes to contribution workflows

**MINOR (e.g., 0.1.x → 0.2.0):**
- New documentation sections or significant additions
- New governance policies or team structures
- New automation or workflow features

**PATCH (e.g., 0.1.1 → 0.1.2):**
- Typo fixes and clarifications
- Link updates and formatting improvements
- Minor corrections without new content

**Example `docs/VERSIONING.md` structure:**
```markdown
---
title: Documentation Versioning Policy
version: '1.0.0'
---

# Documentation Versioning

This repository follows semantic versioning for documentation and governance.

## Version Format

`MAJOR.MINOR.PATCH`

## When to Bump Versions

### MAJOR
- [list criteria]

### MINOR
- [list criteria]

### PATCH
- [list criteria]

## Workflow

1. Update documentation
2. Determine version impact
3. Update CHANGELOG.md
4. Update VERSION file
5. Create PR with version bump
```

**Current VERSION detection:**
```bash
# Check current VERSION file
cat VERSION

# Check latest CHANGELOG version
grep -E "^[[:space:]]*##[[:space:]]*\[" CHANGELOG.md | head -1
```

**Integration points:**
- PR template: remind contributors to update CHANGELOG
- Release workflow: validate VERSION matches CHANGELOG
- CI lint: ensure VERSION and CHANGELOG align

**Telemetry (post-merge):**
- Next release PR includes correct version bumps
- CI/lint ensures presence of changelog entry
- No version mismatches in future releases

## References

- [CHANGELOG.md](https://github.com/lightspeedwp/.github/blob/develop/CHANGELOG.md)
- [VERSION](https://github.com/lightspeedwp/.github/blob/develop/VERSION)
- [GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/GOVERNANCE.md)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)

---

### Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined
- [ ] Related docs/issues or files linked
- [ ] Acceptance criteria listed
- [ ] Estimate added: **Medium** (2-3 hours: policy doc, CHANGELOG update, VERSION align)
- [ ] Milestone assigned: v0.2.0

### Definition of Done (DoD)

- [ ] `docs/VERSIONING.md` created and linked from key docs
- [ ] CHANGELOG.md updated with current dated release
- [ ] VERSION file matches CHANGELOG
- [ ] Documentation meets org standards and guidelines
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation reviewed for clarity and accessibility
- [ ] Policy integrated with workflows
- [ ] PR uses correct branch prefix (`docs/versioning-policy`)

---

## Directions & Next Steps

1. Create feature branch: `docs/versioning-policy`
2. Create `docs/VERSIONING.md` with semver policy for docs
3. Review current VERSION file and CHANGELOG
4. Update CHANGELOG with dated current release section
5. Ensure VERSION matches CHANGELOG version
6. Add cross-references from CONTRIBUTING.md and GOVERNANCE.md
7. Consider adding CI check for version alignment
8. Update CHANGELOG.md with this change
9. Submit PR with reference: `fixes #<issue_number>`
10. Tag @docs-team or @governance-team for review

**Branch prefix:** `docs/`

**Files to update:**
- `docs/VERSIONING.md` (create)
- `CHANGELOG.md` (update)
- `VERSION` (align)
- `CONTRIBUTING.md` (reference)
- `GOVERNANCE.md` (reference)

See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
