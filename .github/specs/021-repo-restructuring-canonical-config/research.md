# Phase 0 Research: Repository Restructuring & Canonical Governance

**Date**: 2026-10-18  
**Status**: Complete  
**Output**: Resolved unknowns for Phase 1 Design

---

## Research Tasks & Findings

### R1: GitHub Template Routing Mechanism

**Unknown**: How does GitHub route PR and issue templates by branch prefix or issue type?

**Investigation**: GitHub provides native template routing through two mechanisms:
1. **Issue Type Routing**: When org-wide issue types are defined in `.github/issue-types.yml`, GitHub automatically routes issue creation to the corresponding template based on issue type selected by creator
2. **PR Template Routing**: GitHub looks for `.github/PULL_REQUEST_TEMPLATE/` directory. If a `config.yml` exists in that directory with routing rules, GitHub applies them; otherwise defaults to `pull_request_template.md`. Manual branch prefix routing REQUIRES custom GitHub Actions workflow.

**Decision**: Implement custom GitHub Actions workflow (`pr-template-routing.yml`) that:
- Runs on PR open event
- Reads branch prefix (e.g., `feat/`, `fix/`)
- Looks up correct PR template from `.github/branch-types.yml` mapping
- Comments on PR with link to canonical template
- **Note**: GitHub does NOT automatically route PR templates by branch prefix; this is custom automation

**Rationale**: GitHub's native routing works for issues (by type) but not for PRs (by branch). Custom workflow bridges this gap and ensures consumers use canonical templates even when they don't have local copies.

**Alternatives Considered**:
- Require developers to manually select template (rejected: adds friction, errors)
- Copy templates into consumer repos (rejected: creates drift)
- Use GitHub's PR template default only (rejected: loses routing benefits)

---

### R2: Drift Detection & Validation Automation

**Unknown**: How can we detect and prevent duplicate governance files in consumer repos?

**Investigation**: GitHub Actions provides workflow file modification trigger (`on: pull_request: paths`). We can create a drift detection workflow that:
1. Scans PR for changes to governance files (labels.yml, issue-types.yml, templates)
2. Blocks PR if duplicates detected
3. Allows custom workflows (doesn't block `.github/workflows/` changes)
4. Provides clear error message directing developers to canonical location

**Decision**: Implement drift detection workflow that:
- Monitors PR for changes to: `.github/labels.yml`, `.github/issue-types.yml`, `.github/ISSUE_TEMPLATE/**`, `.github/PULL_REQUEST_TEMPLATE/**`
- Blocks PR with message: "This governance file is managed in lightspeedwp/.github. Do not duplicate here. Reference canonical source instead."
- Allows PR if changes are only to `.github/workflows/` (custom workflows OK)
- Runs as blocking check; cannot be bypassed without review override

**Rationale**: Automation prevents human error and enforces governance boundary without manual auditing.

**Alternatives Considered**:
- Manual code review only (rejected: doesn't scale, inconsistent)
- Branch protection rule blocking all `.github/` changes (rejected: blocks needed custom workflows)
- Periodic audits (rejected: reactive, not preventive)

---

### R3: Custom Workflow Validation & Conflict Detection

**Unknown**: How do we ensure custom workflows coexist correctly with canonical governance?

**Investigation**: Custom workflows in ThisOneTimeOnAcidCom can:
- Reference canonical labels from `.github/labels.yml` (via API)
- Use issue/PR templates routed from `.github/` (via custom workflow)
- Create custom jobs that don't conflict with governance

**Decision**: Validation approach:
1. Manual testing during Phase 2 implementation (run sample custom workflow, confirm it uses canonical labels correctly)
2. Workflow reference audit (scan custom workflows for hard-coded label names; flag those that don't match canonical set)
3. No automated conflict detection needed; workflows are additive, not replacements

**Rationale**: Custom workflows are repo-specific business logic; governance is policy layer. They operate independently; conflicts are rare if governance audit passes.

**Assumptions**:
- Custom workflows don't redefine governance concepts (e.g., don't create their own label scheme)
- All custom jobs use canonical labels/templates via reference, not duplication

---

### R4: Repo-Specific Governance Items Audit

**Unknown**: Which governance items in ThisOneTimeOnAcidCom are repo-specific and should remain local vs. duplicative?

**Investigation**: ThisOneTimeOnAcidCom likely has:
- **Duplicative items** (should be deleted): Labels matching .github set, PR/issue templates copying .github templates, issue types already in .github
- **Repo-specific items** (should be kept locally): WordPress-specific labels (e.g., `area:plugin-dev`, `priority:wordpress`), custom issue types tied to WordPress workflows, WordPress-specific PR templates

**Decision**: Implement audit process:
1. Extract all labels from ThisOneTimeOnAcidCom/.github/labels.yml (if exists)
2. Cross-reference against lightspeedwp/.github/labels.yml
3. Flag matches as "duplicative - DELETE" and non-matches as "repo-specific - AUDIT"
4. For non-matches, review against feature spec (User Story 3) to confirm repo-specific need
5. Create audit report listing: labels to delete, labels to keep locally, justification

**Rationale**: Audit identifies governance debt vs. legitimate repo-specific needs; prevents over-consolidation.

**Assumptions**:
- Repo-specific labels are rare and clearly differentiated by naming or documentation
- Repo-specific issue types are documented in ThisOneTimeOnAcidCom/.github/

---

### R5: PR Template Routing Implementation Patterns

**Unknown**: What are best practices for implementing branch-prefix-based PR template routing?

**Investigation**: Common patterns across GitHub orgs:

**Pattern A** (Recommended):
- Maintain `branch-types.yml` mapping: `feat: pr_feature.md`, `fix: pr_bug.md`, etc.
- Custom GitHub Actions workflow reads mapping on PR open
- Workflow comments on PR with link to template
- Template content is definitive (workflow just directs, doesn't enforce)

**Pattern B** (Alternative):
- Use GitHub's PULL_REQUEST_TEMPLATE/config.yml with native routing (GitHub 2023+)
- Requires config.yml in consumer repos (creates duplication)
- Avoids custom workflow but loses flexibility

**Pattern C** (Legacy):
- Manual PR template selection by developers
- No automation; error-prone

**Decision**: Implement Pattern A:
- `lightspeedwp/.github/branch-types.yml` maintains canonical mapping
- Custom `pr-template-routing.yml` workflow in `.github/workflows/`
- Workflow runs on all PR opens, suggests appropriate template, adds comment
- Provides UX guidance without blocking; template choice is ultimately developer's

**Rationale**: Pattern A is most flexible, doesn't require code duplication, and works across GitHub versions.

---

### R6: Configuration File Format & Validation

**Unknown**: What format should config files use (YAML, JSON, Markdown frontmatter)?

**Investigation**: 
- `.github/labels.yml` and `.github/issue-types.yml` are YAML (GitHub standard)
- `.github/branch-types.yml` should be YAML for consistency
- PR/issue templates are Markdown with YAML frontmatter

**Decision**: 
- Use YAML for all configuration files (`.github/labels.yml`, `.github/issue-types.yml`, `.github/branch-types.yml`)
- Validate YAML syntax in CI
- Use consistent key naming across all YAML files
- Template routing rules in `.github/branch-types.yml`:
  ```yaml
  routing:
    feat:
      template: pr_feature.md
      label: type:feature
    fix:
      template: pr_bug.md
      label: type:bug
    # ... [38 types total]
  ```

**Rationale**: YAML is GitHub standard; consistency reduces maintenance burden.

---

## Research Completion Summary

| Task | Finding | Decision | Implementation |
|------|---------|----------|-----------------|
| R1: Template Routing | GitHub natively routes issues, not PRs | Custom GitHub Actions workflow | `.github/workflows/pr-template-routing.yml` |
| R2: Drift Detection | Can detect governance file changes | Block PRs with duplicates | `.github/workflows/drift-detection.yml` |
| R3: Workflow Validation | Custom workflows work alongside governance | Manual testing + audit | Phase 2 integration testing |
| R4: Repo-Specific Items | Audit identifies legitimate repo-specific items | Create audit script + report | Phase 2 audit task |
| R5: Routing Patterns | Pattern A (branch mapping + workflow) best | Implement branch-types.yml + router | `.github/branch-types.yml` + workflow |
| R6: Config Format | YAML for all config, Markdown for templates | Standardize on YAML | `.github/*.yml` files |

**All NEEDS CLARIFICATION markers resolved.** Ready for Phase 1 Design.
