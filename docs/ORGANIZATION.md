---
_Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [docs/VERSIONING.md](VERSIONING.md) and [.github/FRONTMATTER_SCHEMA.md](../.github/FRONTMATTER_SCHEMA.md)._
---

# Documentation Organization

Document types, folder structure, and navigation guide.

- **README.md:** Project overview and quick start
- **ROADMAP.md:** Development plan and release phases
- **ARCHITECTURE.md:** System design, data architecture, and application structure
- **DECISIONS.md:** Architectural log and rationale for past choices
- **docs/ADR/**: Architecture Decision Records (detailed technical rationale)
- **ISSUE_CREATION_GUIDE.md:** Issue types, templates, and labeling
- **LABEL_STRATEGY.md:** Label usage, taxonomy, and automation
- **TESTING.md:** Test and CI/CD guides, frameworks, and coverage
- **DISCUSSIONS.md:** Community engagement and GitHub Discussions usage guide
- **CONTRIBUTING.md:** General contribution guidelines (in repo root)
- **GOVERNANCE.md:** Org/project roles, responsibilities, and escalation paths (if present)

---

## Folder Structure

```
docs/
  ARCHITECTURE.md
  DECISIONS.md
  DISCUSSIONS.md
  ISSUE_CREATION_GUIDE.md
  LABEL_STRATEGY.md
  ORGANIZATION.md
  PR_CREATION_PROCESS.md
  ROADMAP.md
  TESTING.md
  WORKFLOWS.md
  VERSIONING.md
.github/
  labels.yml
  labeler.yml
  issue-types.yml
  ...
CONTRIBUTING.md
GOVERNANCE.md
README.md
```

---

## Navigation

- All core documentation is under `docs/`
- Automation and label definitions are under `.github/`
- Contributor and governance docs are at repo root
- Link between docs to ensure discoverability (see cross-references in each file)

---

*If you add new documentation types or major files, update this file and cross-references in the docs suite.*
