---
file_type: documentation
version: "3.0"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
mode: "information"
stability: "stable"
domain: "governance"
deprecated: false
references:
  - path: "docs/VERSIONING.md"
    description: "Versioning guidelines for documentation"
  - path: "docs/CHATMODE-FRONTMATTER.md"
    description: "Chatmode frontmatter standards"
  - path: ".github/automation/AUTOMATION_GOVERNANCE.md"
    description: "Automation governance and policies"
  - path: "docs/LABEL_STRATEGY.md"
    description: "Labeling strategy and policies"
  - path: "docs/LABELING_AGENT_USAGE.md"
    description: "Labeling agent usage guide"
tags:
  - documentation
  - audit
  - governance
  - quality-assurance
  - maintenance
title: "Documentation Audit & Gap Analysis for LightSpeedWP/.github Repository"
description: "Comprehensive audit of documentation structure, identifying gaps, inconsistencies, and recommendations for improvement"
created_date: "2025-11-12"
last_updated: "2025-11-12"
---

# Documentation Audit & Gap Analysis for LightSpeedWP/.github Repository

## Overview & Current Documentation Structure

LightSpeedWP's **`.github` repository** serves as the central hub for organization-wide templates, automation, and community health files. It contains a variety of documentation and configuration files, broadly categorized as:

* **Community & Governance Docs:** e.g. `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `SECURITY.md`, `SUPPORT.md` – guidelines for behavior, contributions, and project governance.

* **AI & Copilot Instructions:** e.g. `AGENTS.md` (AI agents index), `CLAUDE.md` and `GEMINI.md` (AI configuration), plus custom instruction and prompt files (currently all under `.github/` folder).

* **Automation & Workflow Docs:** e.g. `AUTOMATION_GOVERNANCE.md` (automation policies), labeling config (`labels.yml`, `labeler.yml`, `issue-types.yml`), and related documentation such as **labeling strategy** and **agent usage guides**.

* **Schemas & Validation:** JSON schemas (like `frontmatter.schema.json`) and docs describing frontmatter and tagging conventions.

* **Project Management Files:** Changelog (`CHANGELOG.md`), version info (`VERSION` file), roadmap and decision records (in `docs/ROADMAP.md`, `docs/DECISIONS.md`, etc).

Each document category plays a role in ensuring consistency across all LightSpeed repos. However, this audit has uncovered **inconsistencies, outdated links, and missing pieces** that need attention.

## Key Findings & Issues

### 1. Outdated or Broken Links

* **Branch References:** Some internal links still point to the **`master`** branch instead of the default **`develop`** branch. For example, the *Labeling Agent Usage* doc's references to "Coding Standards" and "Custom Instructions" use a `blob/master` URL, which is likely broken given that `develop` is the active branch. These should be updated to use relative links or the correct branch to avoid 404 errors.

* **Moved Files & Incorrect Paths:** A recent reorganization moved certain **automation files into a subfolder**, but not all documentation was updated. For instance, the central label config files (`labels.yml`, `labeler.yml`) were moved to the `automation/` directory, yet some docs or references still assume they are in the root `.github/` directory. These inconsistent path references need to be reconciled.

* **Cross-Repo Linking:** There are references intended to point to files within this repo (like linking to `.github/instructions/...` paths). All such links should be tested. Some may still target old locations (e.g. the **Tagging & Frontmatter conventions** instructions file path). Ensuring all internal links use the new structure (or at least relative paths that remain valid after moves) is crucial to avoid broken documentation.

### 2. Inconsistencies in Documentation Content

* **Frontmatter Schema Placement:** The **unified frontmatter schema** file (`frontmatter.schema.json`) is currently located at the root of the `schemas/` directory. It would be more logical to move it into a dedicated `schemas/frontmatter/` subfolder for better organization (e.g. `schemas/frontmatter/schema.json`). This aligns with the repository's goal of structured schemas.

* **Awesome-Copilot vs LightSpeed Conventions:** Some instruction documents originated from the "awesome-copilot" project and still contain legacy conventions that conflict with LightSpeed's needs. Notably, the **tagging and frontmatter conventions** guide needs updating to include LightSpeed-specific frontmatter fields and to resolve any conflicts with the original awesome-copilot guidelines.

* **Duplicate or Overlapping Info:** There is potential overlap between different documents. For example, **AGENTS.md** (the main index of AI agents) and the individual agent spec files (e.g. files in an `agents/` directory) need to be in sync. Similarly, **custom instruction** files vs. **global instructions**: the repository plans to have per-repo `custom-instructions.md` in each project linking back to central ones. We must ensure the central instructions (in the `.github` repo) are generic and do not conflict with specialized per-repo instructions.

### 3. Status of Previously Missing Documents

Several documents that were identified as potential gaps have been found to exist:

* **VERSIONING.md** ✓ - Exists at `docs/VERSIONING.md` with comprehensive guidelines on semantic versioning, changelog management, and version control practices.

* **CHATMODE-FRONTMATTER.md** ✓ - Exists at `docs/CHATMODE-FRONTMATTER.md` with detailed documentation on chatmode file frontmatter standards.

* **AUTOMATION_GOVERNANCE.md** ✓ - Exists at `.github/automation/AUTOMATION_GOVERNANCE.md` documenting automation policies and governance.

* **chatmodes.md** ✓ - Master index exists at `.github/chatmodes/chatmodes.md`.

However, these documents should be reviewed to ensure they are:
- Up-to-date with current practices
- Properly cross-referenced in other documentation
- Free from the link and path issues identified above

### 4. AI Instructions & Prompt Files Audit

All AI-related instruction files should be reviewed for consistency and efficacy:

* **Custom vs Global Instructions:** The `.github` repository holds global AI copilot instructions (e.g., coding standards, tagging conventions, Mermaid diagram guidelines) likely intended to apply across the organization. However, the plan is to allow individual repos to override or augment these via a `custom-instructions.md` in each repo that links back to the main ones. We need to ensure the **global instructions** are not too intrusive or contradictory.

* **Prompts & Agents Index:** `AGENTS.md` should list all agent files (like `labeling.agent.md`, any "branding" agents, etc.) and summarize their purpose. If new agents (such as a future "metrics agent" or others) are added, `AGENTS.md` must be updated.

* **Branding Agents Placeholder:** Documentation for any branding or marketing-related AI agents is pending. We should include a placeholder note in the relevant index (or a section in `AGENTS.md`) that a detailed description will be added once defined.

### 5. Mermaid Diagrams Accessibility Issues

The repository heavily uses **Mermaid diagrams** in documentation (for workflows, process flows, task breakdowns, etc.). While these diagrams are excellent for visualization, many currently suffer from **poor color contrast and readability**. Specific issues include:

* Low contrast between node background and text (especially if Mermaid's default dark theme is used).
* Small font sizes in rendered diagrams and no alternative text descriptions for those who can't see the image.

To address this, diagrams should be updated for accessibility:

* Use a light background with dark text or vice-versa in Mermaid (Mermaid allows styling classes – we can define a class with accessible colors and apply it to all nodes).
* Increase font size or bold important text in the diagram if possible.
* Provide an **alt-text or caption** for each diagram describing what it depicts (this can be done by a preceding paragraph).

### 6. Labeling & Automation Discrepancies

Labeling is one of the most critical automated systems in this repo. A few discrepancies or points needing clarification:

* The **label config files** are confirmed to be in `.github/automation/` directory (labels.yml, labeler.yml, issue-types.yml). Documentation should consistently reference this location.

* **Issue Type application:** The documentation mentions automatic issue type labeling from titles or content. If there are any differences between what's documented and what the agent actually does, those need syncing.

* **Workflow vs Documentation:** Ensure that the documented **"one-hot" status enforcement and required labels** match what the workflows enforce in practice.

## Recommendations & Action Items

Based on the gaps identified, here is a list of recommended actions and the creation/update of specific documents:

### Immediate Actions

1. **Fix Broken Links and Paths**
   - Update all internal links to use correct relative paths and branch references
   - Change any `.../blob/master/...` URLs to `.../blob/develop/...` or use relative links
   - Verify links to files in `automation/` directory are correct
   - **Priority:** High

2. **Relocate Frontmatter Schema** (Optional)
   - Consider moving `frontmatter.schema.json` into `schemas/frontmatter/` folder
   - Update any references in documentation to the new path
   - Ensure validation scripts point to the new location
   - **Priority:** Medium

3. **Review and Update Existing Documentation**
   - Audit `docs/VERSIONING.md` for accuracy and completeness
   - Review `docs/CHATMODE-FRONTMATTER.md` for LightSpeed-specific needs
   - Verify `.github/automation/AUTOMATION_GOVERNANCE.md` reflects current processes
   - Ensure all cross-references between docs are valid
   - **Priority:** High

4. **Update Agents & Prompts Indexes**
   - Bring `AGENTS.md` up to date by listing all current agents
   - Cross-reference with individual agent specs in `agents/` folder
   - Create or update `prompts.md` index for prompt templates
   - Add placeholder entries for planned agents (e.g., branding agents, metrics agent)
   - **Priority:** Medium

5. **Improve Mermaid Diagram Styling**
   - Define custom accessible style for all Mermaid diagrams
   - Document style guidelines in `mermaid-diagrams.instructions.md`
   - Add descriptive captions below each diagram
   - Re-generate diagrams with poor contrast
   - **Priority:** Medium

6. **Refresh README Files in Subfolders**
   - Audit all subfolder READMEs (docs/, scripts/, tests/, etc.)
   - Ensure standardized frontmatter in all README files
   - Add footer with references as per project conventions
   - **Priority:** Low

7. **Implement Metrics Tracking**
   - Set up Metrics workflow and agent to gather repository health data
   - Create `docs/METRICS.md` documentation
   - Define key metrics (documentation coverage, automation effectiveness, etc.)
   - Add badges to README for key metrics
   - **Priority:** Low

### Documentation Review Checklist

For each existing document, verify:

- [ ] Frontmatter is complete and follows LightSpeed standards
- [ ] All internal links use relative paths or correct branch references
- [ ] References to moved files (automation/, etc.) are updated
- [ ] Cross-references between related docs are bidirectional
- [ ] Mermaid diagrams have accessible styling and captions
- [ ] Version and last_updated fields are current
- [ ] Tags are consistent with other similar documents

### Ongoing Best Practices

1. **Documentation Linting:** Run markdownlint regularly and fix issues
2. **Link Checking:** Use automated link checker to catch broken links early
3. **Changelog Updates:** Keep `CHANGELOG.md` current with significant documentation changes
4. **Version Bumping:** Follow versioning policy when making material changes to docs
5. **Regular Audits:** Conduct quarterly documentation audits to prevent drift

## Conclusion

The LightSpeedWP `.github` repository has a solid documentation foundation, with many critical documents already in place. The primary issues are:

1. **Link maintenance** - outdated branch references and paths after file reorganization
2. **Consistency** - ensuring all documentation reflects current file locations and practices
3. **Accessibility** - improving Mermaid diagrams for better readability
4. **Discoverability** - keeping indexes (AGENTS.md, prompts.md) up-to-date

By addressing these issues systematically, we ensure this repo truly serves as a reliable "single source of truth" for all projects in the organization. Each recommended action should be treated as a separate deliverable, ideally tracked in GitHub Issues with appropriate labels and milestones.

Going forward, maintaining a change log for documentation and regularly auditing links will prevent such drift from happening again. With these improvements, the LightSpeedWP `.github` repository will robustly support our open-source community and internal teams alike.

---

**Next Steps:**

1. Create GitHub issues for each recommended action
2. Prioritize based on impact and effort
3. Assign to appropriate maintainers
4. Track progress in project board
5. Schedule follow-up audit in Q2 2026
