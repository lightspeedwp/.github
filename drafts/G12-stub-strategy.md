---
name: "🔧 Improvement"
about: "Propose enhancements, polish, or usability improvements."
title: "[DevEx] Stub strategy + optional sync PRs to child repos"
labels: [type:improve, status:needs-triage, priority:normal, area:devex, area:documentation]
assignees: []
projects: []
milestone: ''
type: improve
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - .github/AUTOMATION_GOVERNANCE.md
---

## Is your enhancement related to a problem? Please describe.

Child repositories across the LightSpeed organisation often have outdated or divergent CONTRIBUTING.md and other canonical files, leading to template drift, inconsistent contributor experiences, and repeated manual work to keep documentation synchronised.

**Current problems:**
- Child repos manually copy canonical files from `.github` repo
- Files drift out of sync over time
- Maintainers spend time manually updating each repo
- Contributors encounter inconsistent guidance
- No automated notification when canonical files change

**Opportunity:**
Implement a stub CONTRIBUTING.md pattern and optional GitHub Actions workflow to automatically open sync PRs in child repositories when canonical files are updated in the `.github` repo.

## Describe the solution you'd like

**Two-part solution:**

### Part 1: Stub CONTRIBUTING.md Pattern

Create a minimal stub CONTRIBUTING.md template that child repos can use, which:
- References the canonical `.github` repo for full guidelines
- Provides repo-specific quick-start information
- Links to LightSpeed org-wide standards
- Clearly indicates it's a stub pointing to canonical source

**Example stub:**
```markdown
# Contributing to [Project Name]

Thank you for your interest in contributing!

## Quick Start

[Project-specific quick start information]

## Full Contribution Guidelines

This project follows LightSpeed's organisation-wide contribution guidelines:

📖 **[Read the full Contributing Guide](https://github.com/lightspeedwp/.github/blob/develop/CONTRIBUTING.md)**

## Project-Specific Notes

[Any project-specific variations or requirements]

---

For questions, see [SUPPORT.md](https://github.com/lightspeedwp/.github/blob/develop/SUPPORT.md).
```

### Part 2: Optional Sync Action (Documented, Not Auto-Enabled)

Document a GitHub Actions workflow pattern that child repos can **optionally** enable to:
- Detect changes to canonical files in `.github` repo
- Automatically open PRs in child repos with updated content
- Allow repo maintainers to review and merge (or close if not applicable)
- Respect repo-specific customisations via exclusion config

**Important:** This should be **opt-in** and **documented**, not automatically enabled in all repos.

## Designs / Mockups

**Workflow diagram:**

```
.github repo update → Webhook/Schedule → Sync action triggers →
Opens PRs in configured child repos → Maintainers review → Merge or close
```

## Accessibility Considerations

- Stub CONTRIBUTING.md should follow WCAG 2.1 AA
- Links should be descriptive and clear
- Documentation should be easy to scan and navigate

## Acceptance Criteria

**Part 1: Stub pattern**
- [ ] Stub CONTRIBUTING.md snippet created and published
- [ ] Stub template includes:
  - Link to canonical CONTRIBUTING.md
  - Placeholder for project-specific quick-start
  - Placeholder for project-specific notes
  - Clear indication it's a stub
- [ ] Documentation explains when/how to use stub pattern
- [ ] Example published in `.github` repo (e.g., `templates/CONTRIBUTING.stub.md`)

**Part 2: Sync action outline**
- [ ] Sync action workflow outline documented (not auto-enabled)
- [ ] Documentation includes:
  - How the sync action works
  - How to enable it in a child repo
  - How to configure which files to sync
  - How to exclude repo-specific customisations
  - Security considerations
- [ ] Example workflow YAML provided
- [ ] Opt-in instructions clear and actionable
- [ ] Maintenance and troubleshooting guide included

**General:**
- [ ] All acceptance criteria met
- [ ] Documentation/changelog updated
- [ ] Tests added/updated (if applicable)
- [ ] PR uses correct branch prefix (`devex/stub-strategy`)
- [ ] Labels/types match org standards

## Testing Requirements

**Stub pattern testing:**
1. Deploy stub in a test child repo
2. Verify links resolve correctly
3. Confirm clarity and usability with contributors

**Sync action testing (if implemented):**
1. Create test child repo with sync action enabled
2. Update canonical file in `.github` repo
3. Verify PR is automatically opened in child repo
4. Test exclusion config prevents unwanted syncs
5. Verify repo-specific customisations are preserved

## Describe alternatives you've considered

**Alternative 1: Manual synchronisation**
- **Pros:** Simple, no automation complexity
- **Cons:** Error-prone, time-consuming, leads to drift

**Alternative 2: Enforce identical files (no stubs)**
- **Pros:** Perfect consistency
- **Cons:** Inflexible, doesn't support repo-specific needs

**Alternative 3: Full automation (not optional)**
- **Pros:** Maximum consistency
- **Cons:** May override necessary repo-specific variations, reduces autonomy

**Chosen approach (stub + optional sync):**
- Balances consistency with flexibility
- Opt-in respects repo autonomy
- Reduces maintainer burden where desired

## Additional Context

**Files likely to benefit from stub/sync pattern:**
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- SECURITY.md
- SUPPORT.md
- Issue/PR templates
- GitHub Actions workflows (selectively)

**Example sync action workflow (documented, not enabled):**

```yaml
name: Sync Canonical Files

on:
  schedule:
    # Check daily for updates
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout child repo
        uses: actions/checkout@v3

      - name: Fetch canonical files
        run: |
          curl -o CONTRIBUTING.md https://raw.githubusercontent.com/lightspeedwp/.github/develop/CONTRIBUTING.md

      - name: Create PR if changes detected
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: sync canonical CONTRIBUTING.md from .github repo'
          body: |
            This PR synchronises CONTRIBUTING.md with the canonical version.

            Review changes and merge if appropriate for this repo.
          branch: sync/contributing
          labels: type:task, area:docs
```

**Security considerations:**
- Sync action should use limited-scope tokens
- PRs should require review (never auto-merge)
- Exclude sensitive or repo-specific configs from sync

**Adoption strategy:**
1. Publish stub pattern and documentation
2. Pilot sync action in 2-3 repos
3. Gather feedback and iterate
4. Offer to other repos as opt-in
5. Document success metrics (time saved, reduced drift)

**Telemetry:**
- Sample downstream repo adopts stub (measure success)
- Optional action documented and available
- Track adoption rate and feedback from pilot repos

## References

- [CONTRIBUTING.md](https://github.com/lightspeedwp/.github/blob/develop/CONTRIBUTING.md)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)
- [Automation Governance](.github/AUTOMATION_GOVERNANCE.md)

---

### Definition of Ready (DoR)
- [ ] Problem/opportunity defined
- [ ] Acceptance criteria written
- [ ] Stub pattern designed
- [ ] Sync action approach outlined
- [ ] Dependencies mapped
- [ ] Estimate added: **Medium-Large** (3-5 hours: stub, documentation, example action)

### Definition of Done (DoD)
- [ ] All AC met and demonstrated
- [ ] Stub pattern published in templates/
- [ ] Sync action documented (not auto-enabled)
- [ ] Example workflow YAML provided
- [ ] Documentation and changelog updated
- [ ] Pilot testing completed (at least 1 repo)
- [ ] Correct labels/types applied
- [ ] PR uses correct branch prefix (`devex/stub-strategy`)

---

## Directions & Next Steps

1. Create feature branch: `devex/stub-strategy`
2. Design stub CONTRIBUTING.md template
3. Create `templates/CONTRIBUTING.stub.md` in `.github` repo
4. Document stub pattern usage in CONTRIBUTING.md or DEVELOPMENT.md
5. Design sync action workflow (documented, opt-in)
6. Create `docs/SYNC_ACTION.md` with full documentation
7. Create example workflow YAML in `examples/workflows/sync-canonical-files.yml`
8. Test stub pattern in one child repo
9. Document security considerations and opt-in process
10. Update CHANGELOG.md
11. Submit PR with reference: `fixes #<issue_number>`
12. Tag @devex-team or maintainer for review
13. Pilot sync action in 2-3 repos for feedback

**Branch prefix:** `devex/` or `feat/`

**Files to create:**
- `templates/CONTRIBUTING.stub.md`
- `docs/SYNC_ACTION.md`
- `examples/workflows/sync-canonical-files.yml`

**Files to update:**
- `CONTRIBUTING.md` or `DEVELOPMENT.md` (reference stub pattern)
- `CHANGELOG.md`

See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
