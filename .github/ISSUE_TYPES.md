# .github/ISSUE_TYPES.md

## Purpose

Defines the organisation-wide standard for **Issue Types** in LightSpeed projects.  
Use this reference to classify issues consistently, apply correct labels, and align with org-wide automation and reporting.

This guide works alongside the Projects/Issues/Labels strategy and the default label families used across all LightSpeed repos.

## Issue Types

- **Task** — Small, well-scoped unit of work (e.g., template tweak, config update, copy edit).  
  *Label:* `type:task`  
  *Colour:* Blue `#4393f8`
- **Bug** — Broken/incorrect behaviour (e.g., errors, regressions, failed specs).  
  *Label:* `type:bug`  
  *Colour:* Red `#9f3734`
- **Feature** — Net-new capability or enhancement (e.g., new block, API, editorial workflow).  
  *Label:* `type:feature`  
  *Colour:* Green `#3fb950`
- **Design** — Design artefacts/decisions (e.g., Figma, tokens, specs, a11y checks).  
  *Label:* `type:design`  
  *Colour:* Purple `#ab7df8`
- **Epic** — Parent issue grouping stories/tasks for a larger outcome.  
  *Label:* `type:epic`  
  *Colour:* Purple `#ab7df8`
- **Story** — User-centred vertical slice within an Epic.  
  *Label:* `type:story`  
  *Colour:* Blue `#4393f8`
- **Improvement** — Enhance existing behaviour or UX (e.g., copy, validation, polish).  
  *Label:* `type:improve`  
  *Colour:* Grey `#9198a1`
- **Code Refactor** — Internal restructure for maintainability, no behaviour change.  
  *Label:* `type:refactor`  
  *Colour:* Grey `#9198a1`
- **Build & CI** — Tooling, pipelines, packaging, releases, deploys.  
  *Label:* `type:chore` or `area:ci`  
  *Colour:* Blue `#4393f8`
- **Automation** — Bots/actions/scripts that reduce toil (e.g., labelers, changelog generators).  
  *Label:* `type:automation` or `area:ci`  
  *Colour:* Blue `#4393f8`
- **Test Coverage** — Add or expand tests (unit, integration, E2E).  
  *Label:* `type:test`  
  *Colour:* Yellow `#d29922`
- **Performance** — Improve speed/efficiency (e.g., LCP, lazy-loading, asset strategy).  
  *Label:* `type:performance`  
  *Colour:* Yellow `#d29922`
- **A11y** — Accessibility to WCAG 2.1 AA (e.g., semantics, focus, contrast).  
  *Label:* `type:a11y`  
  *Colour:* Pink `#db61a2`
- **Security** — Security issues or improvements.  
  *Label:* `type:security`  
  *Colour:* Red `#9f3734`
- **Compatibility** — Browser/device/plugin compatibility.  
  *Label:* `type:compat`  
  *Colour:* Orange `#8d4821`
- **Integration** — Integration with external systems/services.  
  *Label:* `type:integration`  
  *Colour:* Orange `#8d4821`
- **Release** — Release management and deployment.  
  *Label:* `type:release`  
  *Colour:* Green `#3fb950`
- **Maintenance** — Routine maintenance, updates, or audits.  
  *Label:* `type:chore`  
  *Colour:* Grey `#9198a1`
- **Documentation** — Docs, guides, onboarding, or knowledge base.  
  *Label:* `type:documentation`  
  *Colour:* Grey `#9198a1`
- **Research** — Discovery, investigation, or technical spikes.  
  *Label:* `type:research`  
  *Colour:* Grey `#9198a1`
- **Audit** — Security, code, or process audits.  
  *Label:* `type:audit`  
  *Colour:* Grey `#9198a1`
- **Code Review** — Peer review, QA, or validation.  
  *Label:* `type:review`  
  *Colour:* Blue `#4393f8`
- **AI Ops** — AI/automation operations, agents, or datasets.  
  *Label:* `type:ai-ops`  
  *Colour:* Blue `#4393f8`
- **Content Modelling** — Content structure, CPTs, or taxonomy.  
  *Label:* `type:content-modelling`  
  *Colour:* Purple `#ab7df8`

## Usage

- **Pick one Issue Type** per issue for classification.
- Add routing labels: **Priority + Status + Area/Component**
- Add **Lang/Env/Compat/CPT** as needed.

## Colour Palette

- Grey `#9198a1`
- Blue `#4393f8`
- Green `#3fb950`
- Yellow `#d29922`
- Orange `#8d4821`
- Red `#9f3734`
- Pink `#db61a2`
- Purple `#ab7df8`

## Branching Strategy Reference

Branch prefixes and Issue Types are tightly linked. See [Org-wide Branching Strategy](../docs/git-workflow/org-wide-branching-strategy.md) for conventions.  
Your branch prefix (e.g. `feat/`, `fix/`, `docs/`, etc.) determines which PR/issue template is used, the labels applied, and the automation that will run.  
Always use the correct prefix for your branch to ensure full automation and proper issue classification.

## Reference

- [CHANGELOG.md](../CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](../CONTRIBUTING.md): Contribution guidelines, templates, coding standards.
- [AUTOMATION_GOVERNANCE.md](./AUTOMATION_GOVERNANCE.md): Org-wide automation, branching, labeling, and release strategy.
- [Org-wide Issue Labels](./ISSUE_LABELS.md): Default labels and usage guidance.
- [Pull Request Labels](./PR_LABELS.md): PR classification and automation standards.
- [Issue Types YAML](./issue-types.yml): Machine-readable issue types for workflow and automation.
- [Canonical Label Definitions](./labels.yml): Label names, colours, and descriptions.
- [Automated Label Assignment Rules](./labeler.yml): Automation for applying labels based on file changes and branch patterns.

Use these resources to set the 'Type' field, apply companion labels, and ensure full alignment between documentation, label definitions, and automation.

*This Issue Types standard extends the LightSpeed Projects/Issues/Labels strategy and supports org-wide label and workflow automation. All guidance here is directly reflected in labels.yml and labeler.yml for traceability and consistency.*
