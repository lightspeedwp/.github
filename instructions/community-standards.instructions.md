---
file_type: instructions
title: Community Standards
description: 'Community health standards: naming conventions, README expectations,
  saved replies, and shared assets. File placement lives in file-organisation.instructions.md.'
scope: organization-wide
version: v1.1
last_updated: '2026-05-29'
owners:
- GitHub Community Health Team
tags:
- community
- standards
- file-management
- naming
- readme
- best-practices
applyTo:
- '**/*'
status: active
stability: stable
domain: generic
---

# Community Standards

You are a community health curator. Follow our naming, README, and shared asset standards to keep repositories consistent and welcoming. Avoid relocating files outside the documented paths or inventing new naming schemes unless explicitly approved.

This document consolidates community health standards (naming, README expectations, saved replies) for consistent GitHub repositories. **File and folder placement now lives in `file-organisation.instructions.md` (UK English).**

## Purpose

Ensure repositories are well-organized, easily navigable, and welcoming to contributors through consistent file management, clear naming patterns, comprehensive documentation, and helpful community interactions.

---

## Table of Contents

- [Naming Conventions](#naming-conventions)
  - [File Names](#file-names)
  - [Directory Names](#directory-names)
  - [Special Files](#special-files)
- [README Standards](#readme-standards)
  - [Required Sections](#required-sections)
  - [README Templates](#readme-templates)
  - [Best Practices](#best-practices)
- [Saved Replies](#saved-replies)
  - [Usage Guidelines](#usage-guidelines)
  - [Creating Replies](#creating-replies)
- [Best Practices](#best-practices-1)

---

## Community Health Assets (Org-wide)

- **Shared across the organisation:** discussion templates (`.github/DISCUSSION_TEMPLATE/`), saved replies (`.github/SAVED_REPLIES/`), issue templates (`.github/ISSUE_TEMPLATE/`), pull request templates (including branch-specific) (`.github/PULL_REQUEST_TEMPLATE/`), and the default PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
- **Repository-scoped only:** issue types (`.github/issue-types.yml`) and labels (`.github/labels.yml`) are defined per repository and must not be assumed shared org-wide.
- **File placement:** see `file-organisation.instructions.md` for canonical folder/file location rules.

---

## File Management

### Directory Structure

**Standard Repository Layout:**

```
.github/
├── README.md                      # Community health documentation
├── CODE_OF_CONDUCT.md            # Community conduct standards
├── CONTRIBUTING.md               # Contribution guidelines
├── SECURITY.md                   # Security policy
├── SUPPORT.md                    # Support resources
├── agents/                       # Automation agents
│   ├── README.md
│   ├── *.agent.md               # Agent specifications
│   ├── *.agent.js               # Agent implementations
│   └── __tests__/               # Agent tests
├── workflows/                    # GitHub Actions workflows
│   ├── README.md
│   └── *.yml
├── instructions/                 # Documentation and standards
│   ├── README.md
│   └── *.instructions.md
├── prompts/                      # Reusable prompts
│   ├── README.md
│   └── *.prompt.md
├── reports/                      # Generated reports and analysis outputs
│   ├── README.md
│   ├── analysis/                # Code analysis and technical audits
│   ├── audits/                  # One-time audit reports
│   ├── implementation/          # Implementation tracking
│   ├── migration/               # Migration reports
│   ├── validation/              # Schema/config validation
│   ├── agents/                  # Agent execution reports
│   ├── coverage/                # Test coverage reports
│   ├── frontmatter/             # Frontmatter validation
│   ├── issue-metrics/           # GitHub analytics
│   ├── labeling/                # Labeling agent reports
│   ├── linting/                 # Code quality reports
│   ├── meta/                    # Documentation metadata
│   ├── metrics/                 # Metrics collection
│   └── optimisation/            # Performance optimisation
├── projects/                     # Task tracking and project planning
│   ├── README.md
│   ├── active/                  # Current active projects and sprints
│   ├── completed/               # Finished project archives
│   ├── planning/                # Planning and scoping documents
│   └── ADR/                     # Architecture Decision Records
├── tmp/                          # Temporary files (gitignored)
│   └── .gitkeep
├── ISSUE_TEMPLATE/              # Issue templates
│   └── *.md
├── PULL_REQUEST_TEMPLATE/       # PR templates
│   └── *.md
└── SAVED_REPLIES/               # Standard responses
    ├── issues/
    └── pull-requests/
```

### File Lifecycle

**Permanent Files:**

- Committed to version control
- Stored in appropriate permanent directories
- Updated with version tracking
- Archived when deprecated (not deleted)

**Temporary Files:**

- Stored in `tmp/` directory
- NOT committed to version control
- Deleted after workflow completion
- Promoted to `reports/` if valuable

### Temporary vs Permanent Files

#### Reports Folder (Permanent)

**Location**: `.github/reports/`

**Purpose**: Long-term documentation and analysis

**Use For:**

- Final reports and summaries
- Baseline data and benchmarks
- Decision records
- Impact analysis
- Metrics reports

**Naming:**

```
reports/
├── {category}/
│   ├── {subject}-{type}.md
│   ├── {subject}-{type}.json
│   ├── {subject}-{type}.spec.md
│   └── {subject}-analysis-{date}.md
```

#### Temporary Folder

**Location**: `.github/tmp/`

**Purpose**: Short-term processing artifacts

**Use For:**

- Intermediate processing outputs
- Working documents
- Draft versions
- Processing logs
- Temporary experiments

**Naming:**

```
tmp/
├── processing-{phase}-{timestamp}.json
├── draft-{document}-{date}.md
├── analysis-working-{topic}.json
└── temp-{description}.txt
```

**Lifecycle:**

1. Create during processing
2. Use for calculations
3. Move to `reports/` if permanent
4. Delete after workflow completion

### File Organization Decision Tree

```
Is this a FINAL, permanent result?
├─ YES → reports/ folder
│        (completed analysis, final docs, baselines)
└─ NO → Is this a working/intermediate file?
         ├─ YES → tmp/ folder
         │        (drafts, processing steps)
         └─ MAYBE → Will I need this later?
                    ├─ YES → reports/ folder
                    └─ NO → tmp/ folder
```

---

## Naming Conventions

### File Names

**General Rules:**

- Use **lowercase** with **hyphens** for word separation
- Be descriptive and concise
- Include file type suffix when appropriate
- Use consistent extensions

**File Type Patterns:**

| File Type     | Pattern                               | Example                            |
| ------------- | ------------------------------------- | ---------------------------------- |
| Documentation | `{name}.md`                           | `contributing.md`                  |
| Instructions  | `{name}.instructions.md`              | `coding-standards.instructions.md` |
| Agent Spec    | `{name}.agent.md`                     | `labeling.agent.md`                |
| Agent Code    | `{name}.agent.{js,py,sh}`             | `labeling.agent.js`                |
| Prompt        | `{name}.prompt.md`                    | `code-review.prompt.md`            |
| Workflow      | `{name}.yml`                          | `labeling.yml`                     |
| Test          | `{name}.test.js`                      | `labeling.test.js`                 |
| Report        | `{subject}-{type}.md`                 | `metrics-monthly.md`               |
| Spec File     | `{json-file}.spec.md`                 | `baseline.json.spec.md`            |
| Chatmode      | `{name}.chatmode.md`                  | `thinking.chatmode.md`             |
| Saved Reply   | `name.md` in `.github/SAVED_REPLIES/` | `triage.md`                        |

**Examples:**

✅ **GOOD:**

- `code-of-conduct.md`
- `coding-standards.instructions.md`
- `labeling.agent.js`
- `issue-metrics.yml`
- `eslint-baseline.json`

❌ **BAD:**

- `Code_Of_Conduct.md` (wrong case)
- `codingStandards.instructions.md` (camelCase)
- `LabelingAgent.js` (wrong case)
- `IssueMetrics.YAML` (wrong case)
- `baseline.json` (not descriptive)
- Missing `file_type` in frontmatter (required for instruction/spec/report docs)

### Directory Names

**Rules:**

- Use **lowercase** with **hyphens**
- Use **plural** for collections
- Keep names short but meaningful

**Examples:**

✅ **GOOD:**

- `agents/`
- `workflows/`
- `instructions/`
- `reports/labeling/`

❌ **BAD:**

- `Agents/`
- `work-flows/`
- `instruction/`
- `Reports/Labeling/`

### Special Files

**Top-Level Community Health Files:**

These files use **UPPERCASE** for visibility:

- `README.md` - Project overview
- `CODE_OF_CONDUCT.md` - Community conduct
- `CONTRIBUTING.md` - Contribution guide
- `SECURITY.md` - Security policy
- `SUPPORT.md` - Support resources
- `LICENSE` - License file
- `CHANGELOG.md` - Change history

**Configuration Files:**

- `.editorconfig` - Editor configuration
- `.gitignore` - Git ignore patterns
- `.markdownlint.json` - Markdown linting
- `package.json` - Node.js dependencies

**GitHub Specific:**

- `CODEOWNERS` - Code ownership
- `FUNDING.yml` - Sponsorship links

---

## README Standards

### README File Naming Convention

**RULE**: One `README.md` per folder only.

**Prohibited:**

- `README.{filename}.md`
- `README.{NAME}.md.md`
- Any `README.*.md` except `README.md`

**Rationale:**

- File-specific READMEs create clutter
- Folder README should index all files
- Use inline docs for individual files
- Special docs belong in `docs/` folder

**If You Need to Document a File:**

1. Add inline documentation
2. Reference in folder's `README.md`
3. Create detailed docs in `docs/`
4. Only create file-specific README with approval

### Required Sections

All `README.md` files must include:

```markdown
---
description: "Brief folder/project description"
last_updated: "YYYY-MM-DD"
---

# Folder/Project Name

## Overview

What this folder/project contains and its purpose.

## Usage

How to use or interact with contents.

## Structure

├── file1.md - Description
├── file2.js - Description
└── folder/ - Description

## Template References

- [Link to related docs]
- [Link to instructions]
```

### README Templates

**Recommended extra sections:** Owners/Maintainers, Status/Badges, Structure/Contents, Contribution/Development, Inputs/Examples, Validation/Testing, Change History/Changelog, and References/Links (including badges/TOC where relevant).

#### **Repository Root README**

````markdown
---
description: "GitHub community health repository"
last_updated: "YYYY-MM-DD"
---

# Repository Name

Brief description of repository purpose.

## Overview

Detailed explanation of what this repository contains.

## Quick Start

```bash
# Installation
npm install

# Usage
npm test
```
````

## Structure

Overview of repository organization.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).

## License

[LICENSE](../LICENSE)

````

#### **Folder README**

```markdown
---
description: "Folder purpose and contents"
last_updated: "YYYY-MM-DD"
---

# Folder Name

## Purpose

What this folder contains and why.

## Contents

| File/Folder | Description |
|-------------|-------------|
| `file1.md` | Purpose of file 1 |
| `file2.js` | Purpose of file 2 |

## Usage

How to use files in this folder.

## Template References

- [Related documentation]
````

### Best Practices

**DO:**

- ✅ Keep READMEs concise and scannable
- ✅ Use tables for file listings
- ✅ Include code examples
- ✅ Add diagrams for complex concepts
- ✅ Link to related documentation
- ✅ Update `last_updated` field
- ✅ Use relative links

**DON'T:**

- ❌ Create multiple README files per folder
- ❌ Duplicate content from other docs
- ❌ Include outdated information
- ❌ Use absolute GitHub URLs
- ❌ Omit frontmatter metadata
- ❌ Write walls of text

---

## Saved Replies

Saved replies are pre-written responses for common GitHub interactions.

### Usage Guidelines

**Location**: `.github/SAVED_REPLIES/`

**Organization:**

```
SAVED_REPLIES/
├── issues/
│   ├── missing-info.md
│   ├── duplicate.md
│   └── needs-triage.md
└── pull-requests/
    ├── missing-tests.md
    ├── needs-changelog.md
    └── ready-to-merge.md
```

**Using Saved Replies:**

1. **In GitHub Web UI:**
   - Click speech bubble icon in comment box
   - Select appropriate reply
   - Personalize before sending

2. **Copy-Paste:**
   - Navigate to file in repository
   - Copy markdown content
   - Paste into comment

3. **Automation:**
   - Reference in workflows
   - Use in bots/agents

### Creating Replies

**Template:**

```markdown
---
file_type: "saved_reply"
title: "Reply Title"
description: "When to use this reply"
category: "issues|pull-requests"
---

# Reply Title

Hi @username,

[Standard response content]

**Next Steps:**

1. Action item 1
2. Action item 2

**Resources:**

- [Link to documentation]

Thank you!
```

**Best Practices:**

- ✅ Always personalize with `@username`
- ✅ Be friendly and helpful
- ✅ Provide clear next steps
- ✅ Link to relevant documentation
- ✅ Keep tone professional
- ✅ Update outdated replies

**Common Saved Replies:**

| File                 | Purpose              |
| -------------------- | -------------------- |
| `missing-info.md`    | Request more details |
| `duplicate.md`       | Mark as duplicate    |
| `stale.md`           | Close inactive issue |
| `missing-tests.md`   | Request tests        |
| `needs-changelog.md` | Request changelog    |
| `ready-to-merge.md`  | Approve PR           |

---

## Best Practices

### File Organization

**DO:**

- ✅ Use consistent naming across repository
- ✅ Store files in appropriate directories
- ✅ Clean up temporary files regularly
- ✅ Archive deprecated files
- ✅ Document file purposes
- ✅ Maintain directory READMEs

**DON'T:**

- ❌ Mix temporary and permanent files
- ❌ Use vague file names
- ❌ Create deeply nested structures
- ❌ Commit temp files to version control
- ❌ Leave orphaned files
- ❌ Duplicate content across files

### Documentation

**DO:**

- ✅ Write clear, concise docs
- ✅ Use consistent formatting
- ✅ Include examples
- ✅ Add diagrams where helpful
- ✅ Keep docs up to date
- ✅ Link related resources

**DON'T:**

- ❌ Write overly technical docs
- ❌ Assume prior knowledge
- ❌ Skip code examples
- ❌ Use broken links
- ❌ Ignore accessibility
- ❌ Create orphaned docs

### Community Interaction

**DO:**

- ✅ Be welcoming and inclusive
- ✅ Respond promptly
- ✅ Provide helpful feedback
- ✅ Use saved replies appropriately
- ✅ Follow code of conduct
- ✅ Recognize contributors

**DON'T:**

- ❌ Be dismissive or rude
- ❌ Ignore questions
- ❌ Provide generic responses
- ❌ Over-automate interactions
- ❌ Violate community standards
- ❌ Ignore feedback

---

## Cleanup and Maintenance

### Regular Tasks

**Daily:**

- Monitor `tmp/` folder size
- Delete stale temporary files (> 7 days)

**Weekly:**

- Archive completed reports
- Clean up temporary processing files
- Review for accidentally committed temp files

**Monthly:**

- Archive old reports per retention policy
- Review folder structure
- Update documentation
- Audit saved replies

### Cleanup Commands

```bash
# View temporary files
ls -lh .github/tmp/

# Delete specific patterns
rm .github/tmp/draft-*.md
rm .github/tmp/temp-*.json

# Archive old files
mv .github/tmp/analysis-*.json .github/reports/archived/

# Clear all tmp (CAUTION!)
rm -rf .github/tmp/*
mkdir -p .github/tmp
touch .github/tmp/.gitkeep
```

### Git Configuration

**`.gitignore` Setup:**

```bash
# Temporary files
.github/tmp/
.github/tmp/*
!.github/tmp/.gitkeep

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Build artifacts
dist/
build/
coverage/
```

*This document consolidates community health standards for GitHub repositories. All files and documentation must follow these standards for consistency and professionalism.*

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
