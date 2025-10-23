---
_Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [docs/VERSIONING.md](VERSIONING.md) and [.github/FRONTMATTER-SCHEMA.md](../.github/FRONTMATTER-SCHEMA.md)._
---

# LightSpeed GitHub Community Health Roadmap

This roadmap defines our stepwise rollout of organization-wide GitHub community health, automation, and workflow standards. These phases are designed to make LightSpeed a model of open source hygiene, transparency, and operational excellence—driving contributor happiness, project velocity, and product quality.

---

## **Phase 1: Foundations – Org-wide Standards, Labelling, Templates, and Basic Automation**

**Objective:** Establish a consistent, automated baseline for issues, PRs, discussions, and contributor guidance across all repos.

### 1. Org-wide Label Taxonomy & Issue Types
- Create a single source of truth for labels in `.github/labels.yml` (synced to all repos).
- Define label families: `status:*`, `priority:*`, `type:*`, `area:*`, `comp:*`, `meta:*`, `phase:*`, `contrib:*`, `community`, `support`, etc.
- Align color palette and documentation for visual consistency and easy scanning.
- Document and publish the [Label Strategy](LABEL_STRATEGY.md) and [Issue Types Guide](../.github/ISSUE_TYPES.md).
- Set up `.github/labeler.yml` to automate label assignment based on branch, file path, and file type.

### 2. Issue & Pull Request Templates
- Develop issue templates covering: Bug, Feature, Task, Docs, Design, Epic/Story, Support, and more.
- Templates include clear sections for context, acceptance criteria, effort, and links to label guides.
- Develop PR templates for: Feature, Bugfix, Chore, Docs, Release, Refactor, Hotfix, and General.
- PR templates auto-apply initial labels, enforce changelog entries, and require issue linkage.
- Templates reference [CONTRIBUTING.md], [BRANCHING_STRATEGY.md], and [AUTOMATION_GOVERNANCE.md].

### 3. Basic Automation Workflows
- Activate GitHub Actions for:
  - Automatic label assignment (via labeler)
  - PR gating (changelog, release label, review, status checks)
  - Stale issue/PR management (auto-closing or pinging)
  - Changelog enforcement (`meta:needs-changelog`)
  - Release label gating (`release:*`)
  - Automatic semantic version/tagging on release
- Begin project board sync using status/priority/type labels.

### 4. Org-wide Guidance for Contributors and AI
- Publish [custom instructions](../.github/custom-instructions.md) for Copilot and agents (tone, standards, context).
- Document [chatmodes](../.github/chatmodes/chatmodes.md), [prompts](../.github/prompts/prompts.md), and basic [starter agents](../.github/agents/agent.md).
- Launch a [Contribution Guide](../CONTRIBUTING.md) referencing all standards, templates, and automation.

### 5. Initial Linting and Documentation Drive
- Add base linting configs:
  - JavaScript/TypeScript: ESLint, Prettier
  - PHP: PHPCS (WordPress standards)
  - CSS/SCSS: stylelint
  - Markdown: markdownlint
- Publish “Getting Started” and “Linting” guides.
- Begin org-wide effort to improve inline code documentation (JSDoc, DocBlocks, etc.).
- Provide basic test helpers for Jest, Playwright, and Bats.

### 6. Governance & Org Strategy Documentation
- Publish [GOVERNANCE.md]: Roles, responsibilities, escalation, and decision-making.
- Add docs for branching, automation, release, changelog, and test framework policies ([AUTOMATION_GOVERNANCE.md]).
- Decide on initial test frameworks and linting baseline.

### 7. Product/Project Synchronisation (Initial Planning)
- Initial workflow research: start planning for auto-syncing issues/PRs to org-level product projects.

---

## **Phase 2: AI Agents, Advanced Automation, In-Depth Documentation, and Project Sync**

**Objective:** Expand automation and AI, close documentation gaps, and roll out project/issue/PR synchronisation to central project boards.

### 1. AI Agents, Chatmodes, and Custom Prompts
- Build and deploy custom Copilot agents and chatmodes for:
  - Code review automation and feedback
  - Security triage and reporting
  - Accessibility and pattern checks
  - Onboarding and contributor Q&A
- Integrate agents with issue, PR, and discussion workflows.
- Develop a library of reusable prompts for specialized tasks.

### 2. Advanced Workflow Automation
- **Product/Project Sync:**  
  - Roll out automatic synchronisation of GitHub issues and PRs to product/project boards.
  - Ensure project fields (Status, Priority, Type) are mapped from labels/branch semantics.
  - Automate movement of issues/PRs across columns as status/labels change.
  - Automate milestone and release linkage.
- Enhance automation for:
  - Issue/PR assignment and escalation (auto-assign, auto-escalate)
  - Automated reviewer assignment
  - Auto-close stale issues/PRs with context-aware messaging
  - Automated release tagging and changelog publishing

### 3. Documentation Expansion and Coverage
- Finish documenting all automation, workflows, test helpers, linting, and agent setups.
- Write deep-dive guides for:
  - “How automation works” (including project sync)
  - “How to add/maintain agents and chatmodes”
  - “How to contribute to documentation”
- Expand [Testing Guide](TESTING.md) for all frameworks, including coverage, troubleshooting, and best practices.

### 4. Testing Improvements
- Document and begin enforcing test frameworks and helpers.
- Write initial integration/E2E tests for automation and agents.
- Begin tracking code/test coverage in all major repos.

### 5. Developer Experience Upgrades
- Roll out precommit hooks for linting, formatting, and tests using tools like Husky or lint-staged.
- Provide developer tooling for easy compliance (e.g., scripts for local linting, test running, and doc checks).

### 6. Continuous Feedback and Refinement
- Actively collect contributor feedback on new automation and docs.
- Refine labeler rules, automation triggers, and templates based on real-world usage.
- Begin quarterly review of labels and workflows.

---

## **Phase 3: Test Coverage, Full Automation, Precommit Enforcement, and QA**

**Objective:** Achieve full automation of all core workflows, robust test coverage, and seamless developer safeguards.

### 1. Comprehensive Test Coverage
- Reach and enforce coverage thresholds for all codebases (unit, integration, E2E, a11y, security).
- Cover all automation workflows (sync, label, changelog, release, agent actions) with E2E and integration tests.
- Expand reporting and dashboards for code/test coverage.

### 2. Full CI/CD and Automation Maturity
- Roll out complete CI/CD for all repos, covering:
  - Linting, formatting, and type checks
  - All test suites, including agent/automation tests
  - Accessibility and performance testing
  - Security scanning and dependency checks
- Automated release publishing with semantic versioning and changelog extraction/validation.
- All PR merges gated on passing checks, labels, and reviews.

### 3. Precommit Enforcement
- Mandatory precommit hooks for linting, formatting, and required tests on every repo.
- Auto-fix and feedback tooling for contributors.
- Document and support precommit hook troubleshooting.

### 4. Advanced Linting, Docs, and Agent Expansion
- Add advanced linting rules for code quality, patterns, a11y, security, and performance.
- Continue expanding inline documentation and code comments.
- Add more Copilot agents and chatmodes for new use cases (e.g., doc review, performance analysis).

### 5. Automation, Project, and Release Governance
- Document policies for automation maintenance, CI/CD, and agent upgrades.
- Quarterly automation/label/project reviews.
- Automated release tags, milestone linkage, and retrospective documentation.

---

## **Phase 4: Placeholder – Product Analytics, Observability, and Feedback Loops**
_(To be defined. Possible focus: integrating analytics, metrics, and feedback into project health and release cycles. May include automated dashboards, user feedback capture, and usage reporting.)_

---

## **Phase 5: Placeholder – Community Growth, Mentorship, and Ecosystem Integrations**
_(To be defined. Possible focus: growing contributor base, mentorship programs, cross-org collaborations, integrations with external tools, and fostering a sustainable open source ecosystem.)_

---

## **Phase 6: Placeholder – Continuous Evolution and Open Source Leadership**
_(To be defined. Possible focus: continuous improvement, thought leadership, new standards, and open source advocacy across the WordPress and broader software community.)_

---

## **Milestone Deliverables Checklist**

- [ ] **Org-wide Label & Issue Type System:** `.github/labels.yml`, `.github/issue-types.yml`
- [ ] **Templates:** Issue, PR, Saved Replies
- [ ] **Automation:** Labeler, Changelog, Release, Project Sync
- [ ] **Governance Docs:** Branching, Automation, Release, Changelog, Test Policy
- [ ] **AI/Agents:** Instructions, Chatmodes, Prompts, Initial Agents
- [ ] **Linting & Docs:** Baseline configs, coverage, test helpers, precommit hooks
- [ ] **Testing:** Initial, Integration, E2E, Full Coverage
- [ ] **Product/Project Sync:** Automated issue/PR to project mapping, status sync
- [ ] **CI/CD:** Lint, test, release, coverage, a11y, security
- [ ] **Community:** Discussions, support, feedback channels, saved replies
- [ ] **Quarterly Reviews:** Labels, automation, CI, docs, coverage, community

---

## **How to Use This Document**

- Reference in onboarding and contributor guides.
- Use as a planning and progress-tracking tool.
- Update as phases progress and deliverables evolve.
- Share with the team for vision, accountability, and alignment.

---

*Questions or suggestions? Open a discussion or PR in the `.github` repo!*