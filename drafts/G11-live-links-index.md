---
name: "📚 Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Docs] Create Live Links index (exact `develop` URLs)"
labels: [type:documentation, status:needs-triage, priority:normal, area:documentation, link-hygiene]
assignees: []
projects: []
milestone: ''
type: documentation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - ../DOCS.md
---

## What documentation is needed?

We need a comprehensive Live Links index in DOCS.md that lists canonical files and key folders with exact `develop` branch GitHub URLs. This eliminates wayfinding issues, prevents stale relative path references, and provides a single source of truth for navigation.

**Current state:**
- No centralised link index
- Mix of relative paths and absolute URLs
- Risk of stale paths when files move
- Contributors waste time finding canonical files
- Broken links when referencing from outside repo

**Desired state:**
- Live Links section in DOCS.md
- Exact `develop` branch URLs for all key files and folders
- Single source of truth for navigation
- All links verified and working
- Easy copy-paste for external references

## Why is this documentation important?

**For contributors:**
- Quick access to canonical files without searching
- Confidence that links are current and working
- Easy external references for wikis, issues, PRs
- Reduced wayfinding friction

**For maintainers:**
- Fewer broken link reports
- Easier to maintain when file structure changes
- Single place to update when URLs change
- Professional, polished documentation experience

**Impact:**
- **Medium** - Wayfinding wastes contributor time
- **Medium** - Broken external references damage credibility
- **Low** - Quality-of-life improvement with high perceived value

## Acceptance Criteria

- [ ] Live Links index section added to `DOCS.md`
- [ ] Index organised by category (e.g., Governance, Documentation, Workflows, Agents)
- [ ] All key files included with exact `develop` URLs:
  - Governance: GOVERNANCE.md, CODEOWNERS, CONTRIBUTING.md, etc.
  - Documentation: DOCS.md, README.md, VERSIONING.md, etc.
  - Workflows: AUTOMATION_GOVERNANCE.md, labels.yml, labeler.yml, etc.
  - Agents: AGENTS.md, agent specs, CHATMODES.md, etc.
  - Security: SECURITY.md, SUPPORT.md
  - Development: DEVELOPMENT.md, coding standards, etc.
- [ ] Key folders included (e.g., `docs/`, `.github/automation/`, `agents/`)
- [ ] All links verified and working (100% success rate)
- [ ] Links use `develop` branch (not `main` or relative paths)
- [ ] Format: `- [File Name](https://github.com/lightspeedwp/.github/blob/develop/path/to/file.md)`
- [ ] Automated link checker run shows 0 broken links
- [ ] Follows [WordPress documentation standards](https://developer.wordpress.org/coding-standards/inline-documentation/)
- [ ] Changelog entry prepared for PR

## Additional Context

**Suggested Live Links index structure:**

```markdown
## Live Links

Quick access to canonical files and directories (all links point to `develop` branch).

### Governance & Meta
- [GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/GOVERNANCE.md) - Governance policies and team structure
- [CODEOWNERS](https://github.com/lightspeedwp/.github/blob/develop/CODEOWNERS) - Code ownership and review assignments
- [CONTRIBUTING.md](https://github.com/lightspeedwp/.github/blob/develop/CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](https://github.com/lightspeedwp/.github/blob/develop/CHANGELOG.md) - Version history and changes
- [VERSION](https://github.com/lightspeedwp/.github/blob/develop/VERSION) - Current version number

### Documentation
- [DOCS.md](https://github.com/lightspeedwp/.github/blob/develop/DOCS.md) - Documentation index (this file)
- [README.md](https://github.com/lightspeedwp/.github/blob/develop/README.md) - Repository overview
- [DEVELOPMENT.md](https://github.com/lightspeedwp/.github/blob/develop/DEVELOPMENT.md) - Development setup and workflows
- [docs/](https://github.com/lightspeedwp/.github/tree/develop/docs) - Documentation directory

### Workflows & Automation
- [AUTOMATION_GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/AUTOMATION_GOVERNANCE.md) - Automation governance
- [.github/automation/](https://github.com/lightspeedwp/.github/tree/develop/.github/automation) - Automation configs
- [.github/automation/labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/automation/labels.yml) - Label definitions
- [.github/automation/labeler.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/automation/labeler.yml) - Auto-labeling rules

### Agents & AI
- [AGENTS.md](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) - Agent index
- [CLAUDE.md](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md) - Claude agent guidance
- [.github/custom-instructions.md](https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md) - AI custom instructions
- [agents/](https://github.com/lightspeedwp/.github/tree/develop/agents) - Agent specifications

### Security & Support
- [SECURITY.md](https://github.com/lightspeedwp/.github/blob/develop/SECURITY.md) - Security policy and reporting
- [SUPPORT.md](https://github.com/lightspeedwp/.github/blob/develop/SUPPORT.md) - Support channels and resources

### Schemas & Standards
- [schemas/](https://github.com/lightspeedwp/.github/tree/develop/schemas) - JSON schemas directory
- [.github/instructions/](https://github.com/lightspeedwp/.github/tree/develop/.github/instructions) - Coding standards and instructions
```

**Link verification strategy:**

```bash
# Extract all links from Live Links section
grep -A 100 "## Live Links" DOCS.md | grep -oP 'https://[^\)]+' > links.txt

# Use link checker (multiple options)
# Option 1: markdown-link-check
npx markdown-link-check DOCS.md

# Option 2: lychee
lychee DOCS.md

# Option 3: Manual curl check
while read url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  echo "$url -> $status"
done < links.txt
```

**Maintenance plan:**
- Add link checking to CI/CD
- Review Live Links quarterly during governance audits
- Update when files are moved or renamed
- Include in PR template checklist for structural changes

**Telemetry (post-merge):**
- Automated link checker passes with 0 broken links
- Monitor wayfinding questions in support channels (target: decrease)
- Track usage analytics if possible (clicks on Live Links section)

## References

- [DOCS.md](https://github.com/lightspeedwp/.github/blob/develop/DOCS.md)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)

---

### Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined
- [ ] Related docs/issues or files linked
- [ ] Acceptance criteria listed
- [ ] Estimate added: **Small-Medium** (1-2 hours: create index, verify links)
- [ ] List of canonical files to include compiled

### Definition of Done (DoD)

- [ ] Live Links index added to DOCS.md
- [ ] All key files and folders included with exact URLs
- [ ] 100% of links verified and working
- [ ] Links use `develop` branch consistently
- [ ] Documentation meets org standards and guidelines
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation reviewed for clarity and accessibility
- [ ] Link checker run shows 0 broken links
- [ ] PR uses correct branch prefix (`docs/live-links-index`)

---

## Directions & Next Steps

1. Create feature branch: `docs/live-links-index`
2. Compile list of all canonical files and key folders
3. Create Live Links section in DOCS.md with categories
4. Add exact `develop` branch URLs for each file/folder
5. Run automated link checker to verify all links
6. Fix any broken links found
7. Add link checking to CI/CD (optional but recommended)
8. Update CHANGELOG.md
9. Submit PR with reference: `fixes #<issue_number>`
10. Tag @docs-team or maintainer for review

**Branch prefix:** `docs/`

**Link checker tools:**
- `markdown-link-check` (npm package)
- `lychee` (fast Rust-based checker)
- GitHub Actions workflows for automated checking

**Format template:**
```markdown
- [Descriptive Name](https://github.com/lightspeedwp/.github/blob/develop/path/to/file.md) - Brief description
```

See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
