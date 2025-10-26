# Automation Governance & Agent-Driven Release Strategy

**LightSpeed Organisation — Community Health Defaults**  
_Last updated: 2025-10-22_

---

## 0. Agent-Driven Automation & Instructions Architecture

All automation in this repository is implemented and governed according to the following standards:

- **Instruction-First:** Each automation workflow is paired with a canonical instruction file in [.github/instructions/workflows/](./instructions/workflows.instructions.md).
- **Agent-Driven:** Each workflow is powered by a corresponding agent, documented in [.github/instructions/agents/](./instructions/agents.instructions.md).
- **Dynamic Indexing:** Agents and workflows are discoverable and versioned via dynamic index files. These files are the single source of truth for automation and should be referenced for all changes or onboarding.
- **Reciprocal Specification:** Every workflow must reference its agent; every agent must have a reciprocal specification file and reference its workflow(s).
- **Evolving Standards:** All automation governance, standards, and best practices are maintained in the `.github/instructions/` folder and updated as the organization evolves.

**Canonical Indexes:**
- [Workflows Instructions Index](./instructions/workflows.instructions.md)
- [Agent Instructions Index](./instructions/agents.instructions.md)

---

## 1. Principles

- **Automate everything:** Releases, changelogs, labelling, project sync, and more—no manual steps or local scripts unless explicitly allowed.
- **Use standard, agent-driven workflows:** Prefer reusable GitHub Actions and org-wide config from this repo, with all logic encapsulated in agents.
- **Keep a Changelog:** All changes must be traceable, user-facing, and formatted for automated extraction.
- **Semantic versioning:** Release versioning is driven by PR labels and workflow triggers, enforced by the release agent.

---

## 2. Required Workflows, Agents & Files

### a. Changelog Enforcement & Compilation

- **Every PR must add an entry** under **Unreleased** in `CHANGELOG.md`, following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.
- PR template must include a `## Changelog` section ([PR Template](https://github.com/lightspeedwp/.github/blob/main/.github/PULL_REQUEST_TEMPLATE.md)).
- **Automated Enforcement:** The release agent and related workflows enforce the presence and validity of changelog entries. PRs without valid changelogs will fail CI.

### b. Release Automation

- When `develop` merges to `main` (or on a release PR to main):
  1. **Validation:** Run tests, build, and validate changelog format (release agent).
  2. **Versioning:** Determine next version from labels or config (semantic versioning).
  3. **Changelog:** Move `Unreleased` to `vX.Y.Z (YYYY-MM-DD)` section, start new Unreleased section.
  4. **Release:** Tag & create GitHub Release with compiled changelog (release agent).
  5. **Artifacts:** Attach built artifacts (ZIP, etc) if required.
  6. **Docs Update:** Update stable tag, README badges, and other documentation as needed.
  7. **Notifications:** Notify maintainers/channels of release outcome.

- **Reciprocal Spec:** All release steps are defined in [workflow-release.instructions.md](./instructions/workflows/workflow-release.instructions.md) and [agent-release.instructions.md](./instructions/agents/agent-release.instructions.md).

### c. Labelling, Project Sync, and Issue/PR Management

- **Labelling:** 
  - Issue forms/templates auto-apply type labels (e.g., `type: bug`, `type: enhancement`), enforced by the labeling agent.
  - PRs are auto-labelled via file globs, branch prefixes, or PR front matter.
  - Each PR links its labels to corresponding Project fields (status, area, priority, etc.).
- **Project Board Sync:**
  - On PR open/label change, add item to relevant Projects board and set status.
  - On merge, auto-move item to Done and close linked issues.
  - Project meta sync logic is agent-driven and customizable.
- **Labeling Rules:** 
  - One `status:*`, one `priority:*`, and one `area:*` or `comp:*` per item; enforced by the labeling agent and validated through the agent spec.

- **Reciprocal Spec:** See [workflow-labeling-status.instructions.md](./instructions/workflows/workflow-labeling-status.instructions.md), [agent-labels-issues-prs.instructions.md](./instructions/agents/agent-labels-issues-prs.instructions.md), and [agent-project-meta-sync.instructions.md](./instructions/agents/agent-project-meta-sync.instructions.md).

### d. Branching Discipline

- **Branch Naming:** Use `{type}/{scope}-{short-title}` pattern (see [Branching Strategy](./BRANCHING_STRATEGY.md)).
- **Enforcement:** Branch name patterns are enforced by CI and corresponding agent logic.
- **Squash Merge Only:** All branches are squash-merged and deleted post-merge.

---

## 3. Label & Issue Type Policy

- **Labels as Routing Signals:** For status, priority, area/component, environment, compatibility.
- **Single-select:** Use exactly one `status:*`, one `priority:*`, and one `area:*` or `comp:*` per item.
- **Issue Types:** Classification managed in the Issue Type field and Project Board, not via `type:*` labels.
- **Org Standards:** All labels should match org-wide colours and naming (see [Labels Guide](./labels-guide.md) and [Issue Types Guide](./issue-types.md)).
- **Automated Assignment:** Label assignment and enforcement is handled by agents and described in their specifications.

---

## 4. Changelog Format & Release Policy

**Changelog format:**  
```markdown
## [Unreleased]
### Added
- User-facing note. (#123, @author)

### Fixed
- Short, clear fix description.

### Changed
- Update details.

### Removed
- Deprecated or removed features.

<!-- If no changelog entry is needed (internal-only), apply the skip-changelog label. -->
```

- Changelog entries are for end-users, not just developers.
- The release agent extracts changelog notes from PR bodies and labels automatically.

**Release Triggers:**
- PR labels (`release:patch`, `release:minor`, `release:major`) or config determine version bump.
- `BREAKING CHANGE:` in PR body or commit forces a major bump.
- Release agent tags and publishes a new GitHub Release with compiled notes.

---

## 5. Recommended Actions & Example Configs

**Actions & Agents:**
- Changelog enforcement/compilation: `changelog-enforcer`, `release.agent.js`
- Release creation: `release.agent.js`
- Label automation: `labeling.agent.js`, `actions/labeler@v5`
- Project sync: `project-meta-sync.agent.js`, `actions/add-to-project@v1`

**Example configs:**  
- [labels-issues-prs.yml](./workflows/labels-issues-prs.yml)
- [project-meta-sync.yml](./workflows/project-meta-sync.yml)
- [labeler.yml](./labeler.yml)

---

## 6. Project Field Alignment

- **Project Board Fields:** Ensure single-select fields in Projects match the values mapped from labels and branch prefixes:
  - **Status:** Triage, Ready, In progress, In review, In QA, Blocked, Done
  - **Priority:** Critical, Important, Normal, Minor
  - **Type:** Feature, Bug, Documentation, Task

---

## 7. Secrets & Permissions

- Use repo/org **Environments** for release tokens and automation secrets.
- Limit `GITHUB_TOKEN` permissions; use fine-grained PATs only when required.
- Ensure build artifacts are reproducible; no local-only or unspec'd release tooling.

---

## 8. Rollout Plan

1. Add labels, Issue/PR templates, and labeler config to `.github` repo.
2. Enable changelog enforcer and educate contributors.
3. Ship release and labeling agents behind `workflow_dispatch` for dry-run testing.
4. Switch main triggers to `develop → main`, monitor and iterate.

---

## 9. Maintaining and Auditing Automation

- **Yearly Audit:** Annually, inventory all workflows and ensure every referenced agent has a reciprocal specification file in `.github/instructions/agents/`.
- **Change Process:** Any automation or agent update must update both its workflow and agent instruction/specification files.
- **CI Enforcement:** (Recommended) Use a CI job or script to validate instruction/agent reciprocity and spec compliance.

---

## How to use this document

- Reference this file in repo-level README, CONTRIBUTING, and PR templates.
- Link to it in project onboarding docs and contributor guides.
- Treat as the single source of truth for automation, changelog, release, and labelling policies.
- Update as automation or org-wide standards evolve; changes should be reviewed by maintainers.

---

## Reference

- [Workflows Instructions Index](./instructions/workflows.instructions.md)
- [Agent Instructions Index](./instructions/agents.instructions.md)
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)
- [CHANGELOG.md](../CHANGELOG.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Org-wide Issue Labels](./ISSUE_LABELS.md)
- [Pull Request Labels](./PR_LABELS.md)
- [Issue Types YAML](./issue-types.yml)
- [Canonical Label Definitions](./labels.yml)
- [Automated Label Assignment Rules](./labeler.yml)

---

_This file is maintained by the LightSpeed Tools & Automation team. For updates or questions, open an issue in the `.github` repo or contact #automation-support._