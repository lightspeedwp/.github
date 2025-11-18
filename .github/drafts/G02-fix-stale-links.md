---
name: "📚 Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Docs/Workflows] Fix stale links after automation move to `/.github/automation`"
labels: [type:documentation, status:needs-triage, priority:normal, area:documentation, area:workflows, version:v0.2.0, link-hygiene]
assignees: []
projects: []
milestone: 'v0.2.0'
type: documentation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - .github/AUTOMATION_GOVERNANCE.md
  - .github/automation/
  - ../README.md
---

## What documentation is needed?

Several documentation files across the repository still reference pre-move automation file paths, resulting in 404 errors and broken links. We need to comprehensively scan the repository and update all references to point to the new `/.github/automation` directory structure on the `develop` branch.

**Current state:**

- Automation files moved to `/.github/automation`
- Multiple docs still reference old paths
- Links result in 404 errors for readers
- Onboarding and operational docs are affected

**Desired state:**

- All documentation references updated to `/.github/automation` paths
- All links point to exact `develop` branch URLs
- Zero 404 errors from documentation links
- Clear navigation for contributors and maintainers

## Why is this documentation important?

**For contributors:**

- Broken links disrupt onboarding and understanding of workflows
- Readers cannot access referenced automation configs and examples
- Frustration and reduced trust in documentation quality

**For maintainers:**

- Risk of updating wrong files when following outdated references
- Increased support burden from confused contributors
- Blocks effective operations and workflow management

**Impact:**

- **High** - Blocks onboarding and operations
- **High** - Damages documentation credibility and trust
- **Medium** - Wastes contributor and maintainer time

## Acceptance Criteria

- [ ] Repository-wide scan produces comprehensive list of old → new path mappings
- [ ] All affected documentation files updated with correct paths
- [ ] All links point to exact `develop` branch URLs (not relative paths that might break)
- [ ] Spot-check of updated links confirms zero 404 errors
- [ ] Link checker tool run shows 100% success rate
- [ ] CHANGELOG.md updated with link hygiene improvements
- [ ] Follows [WordPress documentation standards](https://developer.wordpress.org/coding-standards/inline-documentation/)
- [ ] PR uses correct branch prefix (`docs/fix-automation-links`)

## Additional Context

**Scan strategy:**

```bash
# Find potential old automation references
git grep -n "\.github/workflows" | grep -v "\.github/automation"
git grep -n "workflows/" | grep -E '\.(md|txt)$'
git grep -n "automation" | grep -E '\.(md|txt)$' | grep -v "/.github/automation"
```

**Common old → new path mappings:**

- `.github/workflows/labeler.yml` → `.github/automation/labeler.yml`
- `.github/workflows/labels.yml` → `.github/automation/labels.yml`
- `workflows/` → `.github/automation/`

**Files likely affected:**

- README.md
- DOCS.md
- DEVELOPMENT.md
- AUTOMATION_GOVERNANCE.md
- All files in `docs/` directory
- Workflow and automation documentation

**Testing approach:**

1. Use automated link checker (e.g., `markdown-link-check`, `lychee`)
2. Manual spot-check of high-traffic docs
3. Verify all GitHub URLs resolve correctly

**Telemetry (post-merge):**

- Run link checker tool
- Count 404 errors → target: 0
- Monitor for support requests about broken links → target: ↓

## References

- [.github/automation/](https://github.com/lightspeedwp/.github/tree/develop/.github/automation)
- [README.md](https://github.com/lightspeedwp/.github/blob/develop/README.md)
- [DOCS.md](https://github.com/lightspeedwp/.github/blob/develop/DOCS.md)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)
- [Automation Governance](.github/AUTOMATION_GOVERNANCE.md)

---

### Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined
- [ ] Related docs/issues or files linked
- [ ] Acceptance criteria listed
- [ ] Estimate added: **Small-Medium** (1-2 hours: scan, update, verify)
- [ ] Milestone assigned: v0.2.0

### Definition of Done (DoD)

- [ ] All old automation paths identified
- [ ] All references updated to `/.github/automation`
- [ ] Link checker shows 0 broken links
- [ ] Documentation meets org standards and guidelines
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation reviewed for clarity and accessibility
- [ ] PR uses correct branch prefix (`docs/fix-automation-links`)

---

## Directions & Next Steps

1. Create feature branch: `docs/fix-automation-links`
2. Run comprehensive scan for old automation references
3. Create old → new path mapping document
4. Update all affected files systematically
5. Run automated link checker tool
6. Manual spot-check of critical documentation
7. Update CHANGELOG.md
8. Submit PR with reference: `fixes #<issue_number>`
9. Tag @docs-team or maintainer for review

**Branch prefix:** `docs/`

**Tools to use:**

- `git grep` for finding references
- `markdown-link-check` or `lychee` for link validation
- Editor find/replace for batch updates

See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
