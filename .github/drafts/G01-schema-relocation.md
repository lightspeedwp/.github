---
name: "📚 Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Docs/DevEx] Relocate front-matter schema to `schemas/frontmatter/` and update references"
labels: [type:documentation, status:needs-triage, priority:normal, area:documentation, area:devex, version:v0.2.0]
assignees: []
projects: []
milestone: 'v0.2.0'
file_type: documentation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - .github/AUTOMATION_GOVERNANCE.md
  - ../schemas/frontmatter/frontmatter.schema.json
  - ../DOCS.md
---

## What documentation is needed?

We need to reorganise the front-matter JSON schema into a dedicated subdirectory and update all references across the repository. The schema currently lives at `schemas/` root but should be moved to `schemas/frontmatter/frontmatter.schema.json` to support future schema additions without confusion.

Additionally, we need to implement CI validation that enforces required front-matter fields (version, category, references) to maintain documentation quality and consistency.

**Current state:**

- Schema exists at root of `schemas/` directory
- No CI validation for required front-matter fields
- Future schemas will cause confusion with flat structure

**Desired state:**

- Schema at `schemas/frontmatter/frontmatter.schema.json`
- All imports and documentation references updated
- CI job validates required fields and fails builds when missing

## Why is this documentation important?

**For contributors:**

- Clear, discoverable schema location reduces onboarding friction
- Automated validation prevents incomplete documentation from being merged
- Organised structure prepares for additional schemas (workflow configs, agent specs, etc.)

**For maintainers:**

- Consistent front-matter across all docs enables automation and indexing
- CI enforcement reduces manual review burden
- Proper organisation supports scalability as documentation grows

**Impact:**

- **High** - Broken imports if references aren't updated systematically
- **Medium** - Confusion when multiple schemas appear later without clear organisation
- Blocks v0.2.0 release if not addressed

## Acceptance Criteria

- [ ] File exists at `schemas/frontmatter/frontmatter.schema.json`
- [ ] All documentation files refer to the new schema path
- [ ] All validator scripts/tools updated with new path
- [ ] CI job added to validate required front-matter fields (version, category, references)
- [ ] CI fails with clear error message when required fields are missing
- [ ] Migration documented in CHANGELOG.md
- [ ] DOCS.md updated to reference new schema location
- [ ] Follows [WordPress documentation standards](https://developer.wordpress.org/coding-standards/inline-documentation/)
- [ ] Documentation is accessible and easy to find
- [ ] Changelog entry prepared for PR

## Additional Context

**Files likely requiring updates:**

- `schemas/` → move schema file to new location
- `DOCS.md` → update schema reference path
- `.github/workflows/` → add or update CI validation job
- Any linting or validation scripts
- Documentation guides that reference schema location

**Migration approach:**

1. Create `schemas/frontmatter/` directory
2. Move schema file to new location
3. Update all import paths (use `git grep` to find references)
4. Add CI validation workflow
5. Test validation with intentionally incomplete front-matter
6. Update docs and changelog

**Telemetry (post-merge):**

- CI run logs show schema validation executing successfully
- PR diff shows all updated paths
- No broken links or import errors in subsequent builds

## References

- [schemas/](https://github.com/lightspeedwp/.github/blob/develop/schemas)
- [DOCS.md](https://github.com/lightspeedwp/.github/blob/develop/DOCS.md)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)
- [Automation Governance](.github/AUTOMATION_GOVERNANCE.md)

---

### Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined
- [ ] Related docs/issues or files linked
- [ ] Acceptance criteria listed
- [ ] Estimate added: **Medium** (2-3 hours: file move, update refs, CI job)
- [ ] Milestone assigned: v0.2.0

### Definition of Done (DoD)

- [ ] Schema relocated to `schemas/frontmatter/frontmatter.schema.json`
- [ ] All references updated (zero broken imports)
- [ ] CI validation job added and tested
- [ ] Documentation meets org standards and guidelines
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation reviewed for clarity and accessibility
- [ ] PR uses correct branch prefix (`docs/schema-relocation`)

---

## Directions & Next Steps

1. Create feature branch: `docs/schema-relocation`
2. Find all schema references: `git grep -l "schemas/" | grep -E '\.(md|json|ya?ml|js|ts)$'`
3. Create `schemas/frontmatter/` directory structure
4. Move schema file and update all references
5. Add CI validation workflow (GitHub Actions) with required field checks
6. Test validation by creating test doc with missing required fields
7. Update DOCS.md with new schema location
8. Add migration note to CHANGELOG.md
9. Submit PR with reference: `fixes #<issue_number>`
10. Tag @docs-team or maintainer for review

**Branch prefix:** `docs/`

**Related areas:**

- area:docs
- area:devex
- area:automation (for CI validation)

See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
