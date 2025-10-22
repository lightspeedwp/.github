# LightSpeedWP Core GitHub Workflows

This document defines and describes the purpose, current behavior, and future goals for each core workflow in the `.github/workflows/` directory.  
**Each workflow should correspond to an agent in `.github/agents/` where possible.**

---

## release.yml — **Release Agent**

**Current Behavior:**  
- Runs on pushes to release/main branches.
- Runs tests and validations.
- Generates or verifies `CHANGELOG.md`.
- Bumps version numbers (semantic versioning).
- Tags and publishes a GitHub Release.

**TODO/Scope:**  
- Move logic into `release.agent.js` where possible for atomic actions.
- Add dry-run and preview modes.
- Block on missing or invalid changelog.
- Auto-update README/version badges on release.
- Extract and summarize release notes from PRs/commits.
- Support multi-branch release.
- Notify maintainers of release outcomes.
- Provide a complete audit trail.

---

## planner.yml — **Planner Agent**

**Current Behavior:**  
- On PR open/update, posts a Markdown checklist and exit criteria as a comment.
- Checklist covers tests, docs, changelog, review steps.
- Standardizes merge readiness.

**TODO/Scope:**  
- Drive checklist from `planner.agent.js`.
- Support updating (not duplicating) the checklist on PR changes.
- Block merges if checklist not satisfied.
- Allow per-repo/project checklist config.
- Collect analytics on checklist completion.
- Suggest reviewers or enforce security steps.

---

## reviewer.yml / ai-pr-reviewer.yml — **Reviewer Agent**

**Current Behavior:**  
- On PR open/update or CI completion, posts a review summary as a comment.
- Summarizes CI status, presence of changelog, and reviewer guidance.

**TODO/Scope:**  
- Refactor so all review logic is in `reviewer.agent.js`.
- Add AI-powered feedback (code quality, security, doc checks).
- Configurable required checks/files.
- Summarize failed jobs and reasons.
- Alert if changelog/docs are missing.
- Suggest/auto-assign reviewers.
- Allow `/rerun-review` trigger.
- Track accuracy and acceptance rates.

---

## auto-issue-type.yml — **Issue Type Agent**

**Current Behavior:**  
- On issue or PR creation, analyzes the title/body.
- Applies type labels (`type:bug`, `type:feature`, etc.) using heuristics (e.g., title prefix).

**TODO/Scope:**  
- Move all logic to `issue-type.agent.js`.
- Support label suggestions and user corrections.
- Allow maintainers to define type aliases/heuristics.
- Option for confirmation before applying labels.
- Support multi-type and label drift reporting.

---

## org-label-sync.yml — **Label Standardization Agent**

**Current Behavior:**  
- On schedule or manual dispatch, compares repo labels to org standard.
- Adds, updates, or migrates labels as needed.

**TODO/Scope:**  
- Centralize all sync logic in `label-standardization.agent.js`.
- Allow opt-in/out for label categories.
- Post summary reports on changes.
- Offer migration guidance for deleted/renamed labels.
- Audit label history and analyze org-wide usage.

---

## labels-issues-prs.yml — **Labeling & Status Automation**

**Current Behavior:**  
- Triggers on issue and PR events (opened, labeled, edited, etc.).
- For PRs: uses `actions/labeler` for file/branch-based labeling, ensures one `status:*` label is present, adds `meta:needs-changelog` if missing, and enforces status rules.
- For issues: sets default status and priority, ensures only one `status:*` label.

**TODO/Scope:**  
- Migrate logic to corresponding agents (`labeling.agent.js`, `status-one-hot.enforcer.js`).
- Reduce shell scripting by moving logic into agents.
- Make label and status enforcement fully agent-driven and configurable.
- Provide feedback/reporting to PR authors.

---

## label-prs.yml, labeler.yml, label-prs-project.yml — **Auto-labeling (File/Branch/Project)**

**Current Behavior:**  
- Use GitHub’s `actions/labeler` or custom scripts to apply labels to PRs based on changed files, branch conventions, or project config.

**TODO/Scope:**  
- Consolidate all file/branch/project labeling into `labeling.agent.js`.
- De-duplicate or merge these workflows.
- Ensure labels are synced with org standards.
- Make configuration per-repo or per-project.

---

## label-prs.yml — **Auto-label PRs (front matter + heuristics)**

**Current Behavior:**  
- On PR events, parses PR body front matter and changed files to determine labels.
- Applies labels via GitHub API if not already present.

**TODO/Scope:**  
- Fold all heuristics into `labeling.agent.js`.
- Support more flexible front matter parsing.
- Allow maintainers to extend or override heuristics.

---

## project-meta-sync.yml — **Project Board Metadata Sync**

**Current Behavior:**  
- On issue/PR events, adds items to GitHub Projects and syncs meta fields (Status, Priority, Type) from labels/branch names.
- Uses GitHub App token and project APIs.

**TODO/Scope:**  
- Integrate meta sync logic into planner and labeling/status agents.
- Let teams define custom mapping from labels to project fields.
- Add rollback/audit trail for sync actions.

---

## issue-type.yml — **Issue Type Sync**

**Current Behavior:**  
- On new issues, inspects the title for prefixes (`bug:`, `feature:`, `task:`), fetches org-wide issue types, and sets the issue type accordingly.
- Uses custom script with organization-level API.

**TODO/Scope:**  
- Merge with `auto-issue-type.yml` and drive from `issue-type.agent.js`.
- Allow for more flexible matching (not just prefix).
- Fallback to suggestions if type can’t be auto-detected.

---

## issue_metrics.yml — **Monthly Issue Metrics Reporting**

**Current Behavior:**  
- On manual trigger, calculates last month’s date range.
- Uses `github/issue-metrics` to collect issue stats for a repo.
- Generates a markdown report (currently a placeholder).
- Posts the report as a new issue.

**TODO/Scope:**  
- Expand metrics (labels, aging, assignments, response times).
- Automate scheduling (run monthly).
- Replace placeholder report with actual stats and charts.
- Allow reporting across multiple repos/projects.
- Integrate with agent for custom reporting and notifications.

---

## pr-project-label.yml — **PR Project Board Labeler**

**Current Behavior:**  
- On PR events, uses `actions/labeler` with a project-specific config to apply project-relevant labels.

**TODO/Scope:**  
- Merge with main `labeling.agent.js` and/or project meta sync workflows.
- Allow project-to-label mapping to be managed in code.

---

## project-sync-*.yml — **Project Label/Type Sync**

**Current Behavior:**  
- (If present) Syncs issues/PRs/project boards with label/type standards, may trigger on schedule.

**TODO/Scope:**  
- Merge all project sync logic into a single agent/workflow.
- Configurable sync rules.
- Full audit trail.

---

## Summary

- Each workflow should have a single, clear purpose and correspond to an agent.
- Overlapping and redundant workflows should be merged, with logic centralized in agents.
- All workflows should be documented in this file and kept up to date as agents evolve.

---

## Contribution

- All workflow changes must comply with [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md).
- See [Custom Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md) for workflow and agent integration guidelines.
- Each workflow should be driven by a corresponding agent and updated as agent capabilities evolve.
- Propose/document new features or changes in this file before implementation.