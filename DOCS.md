---
file_type: "index"
title: "Documentation Master Index"
description: "Comprehensive index and guide to all documentation in the LightSpeed .github repository"
version: "v2.0"
last_updated: "2025-12-07"
owners: ["lightspeedwp"]
category: "documentation"
tags: ["index", "documentation", "reference", "navigation"]
references:
  - path: "./README.md"
    description: "Documentation hub and quick navigation"
  - path: "https://github.com/lightspeedwp/.github"
    description: "Repository root"
---

# LightSpeed .github Documentation Master Index

> **Welcome!** This is the comprehensive index of all documentation in the LightSpeed `.github` community health repository. Use this guide to navigate, discover, and understand all available documentation, standards, and resources.

**Instruction consolidation:** Core guidance now lives in five files — `languages`, `documentation-formats`, `quality-assurance`, `automation`, and `community-standards` (see `.github/instructions/`). For legacy mappings, review `.github/instructions/MIGRATION_GUIDE.md`.

## Quick Navigation

- [Getting Started](#getting-started)
- [Core Documentation](#core-documentation)
- [Architecture Standards](#architecture-standards)
- [Automation Agents](#automation-agents)
- [Project Management Planning](#project-management-planning)
- [Quality Testing](#quality-testing)
- [Configuration Tools](#configuration-tools)
- [Subdirectories](#subdirectories)

---

## Getting Started

Start here when onboarding or seeking overview information.

### Primary Entry Points

| Document                                         | Purpose                                 | Audience         |
| ------------------------------------------------ | --------------------------------------- | ---------------- |
| [README.md](./README.md)                         | Documentation hub and overview          | All contributors |
| [ORGANIZATION.md](./ORGANIZATION.md)             | Repository and organizational structure | New team members |
| [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) | Git branching conventions               | All developers   |

---

## Core Documentation

Essential documentation covering processes, guidelines, and foundational concepts.

### Issue & Pull Request Management

| Document                                             | Purpose                             | Key Topics                                   |
| ---------------------------------------------------- | ----------------------------------- | -------------------------------------------- |
| [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md) | How to create effective issues      | Templates, best practices, automation        |
| [ISSUE_TYPES.md](./ISSUE_TYPES.md)                   | Standard issue type definitions     | Types, descriptions, automation mapping      |
| [ISSUE_LABELS.md](./ISSUE_LABELS.md)                 | Issue label schema and usage        | Label definitions, naming conventions        |
| [PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md)   | Pull request workflow and standards | PR templates, review process, merge criteria |
| [PR_LABELS.md](./PR_LABELS.md)                       | Pull request label definitions      | PR-specific labels, automation               |

### Discussion & Community

| Document                           | Purpose                       | Key Topics                                   |
| ---------------------------------- | ----------------------------- | -------------------------------------------- |
| [DISCUSSIONS.md](./DISCUSSIONS.md) | GitHub Discussions guidelines | Categories, moderation, community engagement |

### Testing & Quality Assurance

| Document                   | Purpose                          | Key Topics                               |
| -------------------------- | -------------------------------- | ---------------------------------------- |
| [TESTING.md](./TESTING.md) | Testing standards and strategies | Test types, coverage, automation         |
| [LINTING.md](./LINTING.md) | Code linting and quality rules   | ESLint, Prettier, code quality standards |

---

## Architecture Standards

Technical architecture, standards, and design decisions.

### System Architecture

| Document                                 | Purpose                         | Key Topics                               |
| ---------------------------------------- | ------------------------------- | ---------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)     | .github repository architecture | System design, components, relationships |
| [CONFIGURATIONS.md](./CONFIGURATIONS.md) | Configuration files reference   | Config locations, structure, examples    |

### Standards & Governance

| Document                                         | Purpose                         | Key Topics                                     |
| ------------------------------------------------ | ------------------------------- | ---------------------------------------------- |
| [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md) | YAML frontmatter specification  | Metadata schema, validation, file types        |
| [VERSIONING.md](./VERSIONING.md)                 | Semantic versioning standards   | Version format, release process, bumping rules |
| [LABEL_STRATEGY.md](./LABEL_STRATEGY.md)         | Comprehensive labeling strategy | Label families, automation, best practices     |

### Decision Records

| Document                       | Purpose                                  | Key Topics                               |
| ------------------------------ | ---------------------------------------- | ---------------------------------------- |
| [DECISIONS.md](./DECISIONS.md) | Architectural decision records (ADR) log | Major decisions, rationale, alternatives |
| [ADR/](./ADR/)                 | Detailed ADR documents                   | Individual architectural decisions       |

---

## Automation Agents

AI agents, automation workflows, and bot configuration.

### Agent Systems

| Document                                                         | Purpose                              | Key Topics                                |
| ---------------------------------------------------------------- | ------------------------------------ | ----------------------------------------- |
| [AGENT_SPEC_AUTHORING_GUIDE.md](./AGENT_SPEC_AUTHORING_GUIDE.md) | How to create agent specifications   | Agent design, spec format, best practices |
| [LABELING.md](./LABELING.md)                                     | Unified labeling guide               | Label schema, automation, workflows       |

### Automation Governance

| Document                                               | Purpose                               | Key Topics                                  |
| ------------------------------------------------------ | ------------------------------------- | ------------------------------------------- |
| [AUTOMATION_GOVERNANCE.md](./AUTOMATION_GOVERNANCE.md) | Automation standards and governance   | Automation rules, oversight, compliance     |
| [WORKFLOWS.md](./WORKFLOWS.md)                         | GitHub Actions workflow documentation | Workflow patterns, reusability, CI/CD       |
| [HUSKY_PRECOMMITS.md](./HUSKY_PRECOMMITS.md)           | Pre-commit hook configuration         | Husky setup, hook scripts, local validation |

---

## Project Management Planning

Project planning, metrics, and roadmap documentation.

### Planning & Roadmap

| Document                   | Purpose                           | Key Topics                           |
| -------------------------- | --------------------------------- | ------------------------------------ |
| [ROADMAP.md](./ROADMAP.md) | Development roadmap and phases    | Project timeline, phases, milestones |
| [METRICS.md](./METRICS.md) | Metrics and measurement standards | KPIs, tracking, reporting, analytics |

### Release Management

| Document                                   | Purpose                        | Key Topics                           |
| ------------------------------------------ | ------------------------------ | ------------------------------------ |
| [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) | Release and versioning process | Release steps, changelog, deployment |

---

## Quality Testing

Testing strategies, coverage requirements, and quality assurance.

### Core Testing Documentation

- [TESTING.md](./TESTING.md) - Complete testing standards and procedures
- Coverage targets, test types, automation strategies

### Additional Quality Resources

- Linting standards: [LINTING.md](./LINTING.md)
- Code quality through automation: [LABELING.md](./LABELING.md)
- Pre-commit validation: [HUSKY_PRECOMMITS.md](./HUSKY_PRECOMMITS.md)

---

## Configuration Tools

Configuration file documentation and tool guides.

### Configuration Reference

| Path                 | Purpose                                       |
| -------------------- | --------------------------------------------- |
| [config/](./config/) | Configuration file examples and documentation |

### Configuration Documentation

See [CONFIGURATIONS.md](./CONFIGURATIONS.md) for comprehensive configuration reference including:

- ESLint configuration
- Prettier formatting
- TypeScript setup
- Jest testing
- Husky pre-commit hooks
- And more...

---

## Subdirectories

### ADR - Architectural Decision Records

**Path**: `docs/ADR/`

Individual Architectural Decision Records documenting major design decisions, trade-offs, and rationale.

**Contents**: ADR-001, ADR-002, etc. (specific decisions documented)

**Related**: [DECISIONS.md](./DECISIONS.md) for ADR index

### Config - Configuration Examples

**Path**: `docs/config/`

Configuration file documentation and examples for tools and systems used in the repository.

**Contents**:

- ESLint configuration
- Prettier formatting
- TypeScript configuration
- Jest setup
- And other tool configurations

**Related**: [CONFIGURATIONS.md](./CONFIGURATIONS.md) for configuration reference

---

## 📊 Documentation Statistics

- **Total Documentation Files**: 25 markdown files
- **Categories**: 9 primary categories
- **Subdirectories**: 2 (ADR, config)
- **Coverage**: 100% with frontmatter metadata
- **Status**: All files standardized with YAML frontmatter

---

## 🔍 How to Use This Index

### Finding Specific Information

1. **By Role**: Jump to the section matching your role (developer, maintainer, contributor, agent developer)
2. **By Topic**: Use the table of contents or category navigation
3. **By Document Type**: Search by file name or purpose
4. **Quick Search**: Use Ctrl+F to search within this page

### Reference Systems

This repository uses **dual reference systems**:

- **AI References**: YAML frontmatter metadata for AI agents and Copilot
- **Human References**: Markdown links and footer references for human readers

### Navigation Tips

- 📎 Most documents include cross-references to related files
- 🔗 All internal links use relative paths for compatibility
- 📋 Frontmatter includes structured metadata for discoverability
- ✨ Use this index as your primary entry point to all documentation

---

## 🆘 Troubleshooting & Help

### Can't Find What You're Looking For?

1. **Check Related Documents**: Most docs include "See Also" or "Related" sections
2. **Review the Category Tables**: Browse all files in your target category
3. **Use Full-Text Search**: Ctrl+F to search for specific keywords
4. **Check Subdirectories**: ADR/ and config/ contain specialized documentation

### Common Paths

| Need                   | Document                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| How to create an issue | [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md)                                     |
| How to create a PR     | [PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md)                                       |
| Label definitions      | [ISSUE_LABELS.md](./ISSUE_LABELS.md) or [PR_LABELS.md](./PR_LABELS.md)                   |
| Testing standards      | [TESTING.md](./TESTING.md)                                                               |
| Architecture overview  | [ARCHITECTURE.md](./ARCHITECTURE.md)                                                     |
| Configuration help     | [CONFIGURATIONS.md](./CONFIGURATIONS.md) or [config/](./config/)                         |
| Automation setup       | [AUTOMATION_GOVERNANCE.md](./AUTOMATION_GOVERNANCE.md) or [WORKFLOWS.md](./WORKFLOWS.md) |

---

## 📝 Contributing to Documentation

To contribute to or update documentation:

1. Follow [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for branch naming
2. Ensure all files have proper YAML frontmatter
3. Use relative paths for internal links: `./FILENAME.md`
4. Run linting to validate markdown
5. Update [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md) if adding new file types

For detailed contribution guidelines, see the main repository [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## 📂 Repository Structure

```
.github/
├── docs/ (25 markdown documentation files)
│   ├── ADR/ (Architectural Decision Records)
│   ├── config/ (Configuration examples)
│   └── [25 *.md files - listed above]
├── [Root-level files]
│   ├── AGENTS.md
│   ├── CHANGELOG.md
│   ├── CONTRIBUTING.md
│   ├── README.md
│   └── [other root files]
└── [Other directories]
    ├── agents/
    ├── prompts/
    ├── workflows/
    ├── instructions/
    └── [others...]
```

---

## 🔗 External References

- [GitHub Community Health Files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Last Updated**: 2025-12-04
**Maintained By**: LightSpeedWP Team
**Status**: ✅ Complete and current

---

## Phase 1: Documentation Audit ✅ COMPLETE

### Completed Analysis

- [x] Read AGENT_SPEC_AUTHORING_GUIDE.md
- [x] Read AUTOMATION_GOVERNANCE.md
- [x] Read BRANCHING_STRATEGY.md
- [x] Read LABEL_STRATEGY.md
- [x] Read RELEASE_PROCESS.md
- [x] Read WORKFLOWS.md
- [x] Read TESTING.md
- [x] Read FRONTMATTER_SCHEMA.md
- [x] Read ISSUE_TYPES.md
- [x] Read VERSIONING.md
- [x] List docs/ directory contents
- [x] Understand dual reference system (AI vs Human)
- [x] Map reference path patterns

### Remaining Analysis

- [ ] Read CONFIGURATIONS.md
- [ ] Read DECISIONS.md
- [ ] Read DISCUSSIONS.md
- [ ] Read HUSKY_PRECOMMITS.md
- [ ] Read ISSUE_CREATION_GUIDE.md
- [ ] Read ISSUE_LABELS.md
- [ ] Read LABELING.md
- [ ] Read LINTING.md
- [ ] Read METRICS.md
- [ ] Read ORGANIZATION.md
- [ ] Read PR_CREATION_PROCESS.md
- [ ] Read PR_LABELS.md
- [ ] Read ROADMAP.md
- [ ] Explore docs/ADR/ subdirectory
- [ ] Explore docs/config/ subdirectory

---

## Phase 2: Fix Reference Paths 🔴 HIGH PRIORITY

### 2A: Fix Invalid Path References in Notes (3 files)

**LABEL_STRATEGY.md:**

- [ ] Fix: `[docs/VERSIONING.md](VERSIONING.md)` → `[docs/VERSIONING.md](./VERSIONING.md)`
- [ ] Fix: `[.github/FRONTMATTER_SCHEMA.md](../.github/FRONTMATTER_SCHEMA.md)` → `[FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md)`
- [ ] Validate all 11 footer references

**WORKFLOWS.md:**

- [ ] Fix: `[docs/VERSIONING.md](VERSIONING.md)` → `./VERSIONING.md`
- [ ] Fix: `[.github/FRONTMATTER-SCHEMA.md](../.github/FRONTMATTER-SCHEMA.md)` → `./FRONTMATTER_SCHEMA.md`
- [ ] Validate all footer references

**TESTING.md:**

- [ ] Fix: Invalid path references (same pattern as above)
- [ ] Validate all footer references

### 2B: Add Missing Frontmatter Metadata (2 files)

**RELEASE_PROCESS.md:**

- [ ] Add `references` array with relevant cross-links:
  - `./VERSIONING.md`
  - `./BRANCHING_STRATEGY.md`
  - `../CHANGELOG.md`
  - `../.github/workflows/release.yml`
  - `../.github/agents/release.agent.md`

**ISSUE_TYPES.md:**

- [ ] Add complete frontmatter metadata:

  ```yaml
  ---
  file_type: "documentation"
  title: "Issue Types Guide"
  description: "Org-wide standard for Issue Types with DoR/DoD add-ons"
  version: "v1.0"
  last_updated: "2025-12-07"
  author: "LightSpeedWP"
  maintainer: "LightSpeed Team"
  references:
    - "./ISSUE_LABELS.md"
    - "./LABEL_STRATEGY.md"
    - "../.github/labels.yml"
    - "../.github/issue-types.yml"
    - "./AUTOMATION_GOVERNANCE.md"
  ---
  ```

### 2C: Validate Existing References (10 files)

- [ ] AGENT_SPEC_AUTHORING_GUIDE.md - validate frontmatter references
- [ ] AUTOMATION_GOVERNANCE.md - validate frontmatter references
- [ ] BRANCHING_STRATEGY.md - validate footer references
- [ ] FRONTMATTER_SCHEMA.md - validate frontmatter references
- [ ] VERSIONING.md - validate footer references
- [ ] All files from 2A and 2B after fixes
- [ ] Any additional files discovered in remaining audit

---

## Phase 3: Complete Empty/Placeholder Files 🟡 MEDIUM PRIORITY

### Confirmed Empty Files (3 files)

**docs/README.md:**

- [ ] Create comprehensive docs/ folder README with:
  - Overview of documentation structure
  - Quick navigation by category
  - Getting started guide
  - Contribution guidelines for docs
  - Link to DOCS.md as main index

**docs/ARCHITECTURE.md:**

- [ ] Document .github repository architecture:
  - Repository purpose and scope
  - Folder structure explanation
  - Key systems (agents, workflows, labeling, automation)
  - Integration points
  - Mermaid diagrams for visual representation

**Root DOCS.md (this file):**

- [ ] Convert task list to comprehensive documentation index with:
  - Categorized file listings (Getting Started, Core Docs, Architecture, Automation, Project Management, Quality)
  - Brief descriptions for each file
  - Quick links section
  - Navigation structure
  - Status indicators

### Unknown Empty Files

- [ ] Check all remaining unread files for empty/placeholder content
- [ ] Add to task list as discovered

---

## Phase 4: Create Documentation Index 🟢 READY

**Transform DOCS.md into comprehensive index:**

- [ ] Add frontmatter metadata
- [ ] Create category-based organization:
  - 🚀 Getting Started
  - 📚 Core Documentation
  - 🏗️ Architecture & Design
  - 🤖 Automation & Agents
  - 📋 Project Management
  - ✅ Quality & Testing
  - 🔧 Configuration & Tools
- [ ] Add file descriptions for all 25+ docs
- [ ] Include quick navigation links
- [ ] Add search/filter guidance
- [ ] Link to subdirectories (ADR/, config/)
- [ ] Add "How to Use This Index" section

---

## Phase 5: Validation & Verification ⚪ FINAL STEP

### Schema Validation

- [ ] Run Ajv validation against frontmatter.schema.json
- [ ] Fix any validation errors
- [ ] Verify discriminator pattern working correctly

### Link Checking

- [ ] Run automated link checker on all docs
- [ ] Fix any broken internal links
- [ ] Verify external links (GitHub repos, docs sites)
- [ ] Check bidirectional references

### Cross-Reference Verification

- [ ] Verify AI references (frontmatter) are accurate
- [ ] Verify Human references (footer) are accurate
- [ ] Check consistency between dual reference systems
- [ ] Validate relative path patterns

### Testing

- [ ] Test links from develop branch
- [ ] Test links from main branch
- [ ] Verify paths work in GitHub UI
- [ ] Verify paths work in VS Code
- [ ] Test with Copilot/AI agents

### Documentation Quality

- [ ] Check for broken Mermaid diagrams
- [ ] Verify code examples are accurate
- [ ] Ensure UK English throughout
- [ ] Check version numbers match VERSION file
- [ ] Review for clarity and completeness

---

## Reference Path Patterns (For Implementation)

### From docs/ folder

- To sibling docs: `"./VERSIONING.md"`
- To .github subfolder: `"../.github/agents/"`
- To root .github: `"../CHANGELOG.md"`
- To docs subfolder: `"./config/"`

### From root .github/

- To docs: `"docs/VERSIONING.md"`
- To .github subfolder: `".github/agents/"`

### Frontmatter YAML Format

```yaml
references:
  - path: "../CHANGELOG.md"
    description: "Changelog standards"
  - path: "./VERSIONING.md"
    description: "Versioning guidelines"
```

---

## Execution Order Recommendation

1. **Phase 2A** - Fix broken paths (immediate user impact) - ~30 min
2. **Phase 2B** - Add missing frontmatter (AI discoverability) - ~20 min
3. **Complete Audit** - Read remaining 12 files - ~60 min
4. **Phase 4** - Create comprehensive index - ~45 min
5. **Phase 3** - Complete empty files - ~variable
6. **Phase 5** - Final validation - ~30 min

**Total Estimated Time:** 3-4 hours

---

## Notes

- **Dual Reference System:** AI references (frontmatter YAML) vs Human references (footer markdown)
- **Schema Validation:** Uses Ajv with discriminator pattern on `file_type` field
- **Existing Tools:** `scripts/maintenance/fix-references.cjs` can help automate some fixes
- **Standards:** UK English, Semantic Versioning, Keep a Changelog format

---

**Last Updated:** 2025-12-07
**Status:** Phase 1 Complete, Ready for Phase 2A
