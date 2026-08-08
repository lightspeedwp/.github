---
version: v0.1.2
last_updated: '2026-08-08'
title: Architecture Guide
owners:
- lightspeedwp
file_type: documentation
description: System architecture and design overview of the .github community health
  repository
---

# Architecture Overview

## Repository Structure

The `.github` repository serves as the organization-wide control plane for governance, automation, and standards across all LightSpeedWP projects.

### Directory Organization

```
.github/
├── workflows/          # GitHub Actions workflows
├── ISSUE_TEMPLATE/     # Issue templates
├── PULL_REQUEST_TEMPLATE/
├── SAVED_REPLIES/      # Canned responses
├── instructions/       # Repository-local instructions
└── projects/           # Active and archived projects

agents/                 # Portable agent specifications
cookbook/              # Recipes and playbooks
hooks/                 # Portable hooks and guardrails
instructions/          # Organization-wide instructions
plugins/               # Installable plugin bundles
skills/                # Self-contained skills
workflows/             # Portable agentic workflows
docs/                  # Documentation
```

### Layering

1. **GitHub Native** (`.github/`): Issues, PRs, workflows, templates
2. **Portable Assets** (top-level folders): Reusable across organization
3. **Documentation** (`docs/`): User-facing guides and references

## Data Flow

### Workflow Execution

```
GitHub Event (issue, PR, push)
  → GitHub Actions Workflow
  → Agent Processing (validation, labeling, etc.)
  → Policy Enforcement
  → Automated Actions (labels, comments, status)
```

### Issue Lifecycle

```
Issue Created
  → Auto-labeled by labeler workflow
  → Checked against templates
  → Routed to appropriate team
  → Status tracked and monitored
  → Closed with documentation
```

### Release Workflow (Develop-First Stacked PR Flow)

```
Feature Complete (on develop)
  → PR Created to develop
  → Automated Checks (tests, linting, changelog validation)
  → Code Review & Merge to develop
  → Release Workflow Triggered (manual, workflow_dispatch)
  → Authorisation Gating (actor in maintainers team)
  → Release Agent Creates release/vX.Y.Z branch from develop
  → PR #1: release/vX.Y.Z → develop (changelog + version)
  → Developer Merges PR #1
  → PR #2: release/vX.Y.Z → main (stacked)
  → Developer Merges PR #2
  → Git tag created, GitHub Release published
  → Post-Release Sync: main → develop (automatic)
```

See [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) and [ADR-001](./ADRs/ADR-001-develop-first-release-flow.md) for complete details on release flow rationale.

## Key Components

### Workflows (`workflows/` and `.github/workflows/`)

| Workflow | Trigger | Purpose | Agent |
|----------|---------|---------|-------|
| **Labelling** | PR/issue created | Apply labels based on content | labeler.agent.js |
| **Validation** | PR opened, push | Lint, test, security checks | validation.agent.js |
| **Changelog** | PR/push to develop | Validate changelog format | changelog.agent.js |
| **Release** | Manual `workflow_dispatch` | Version bumps, tag, publish | release.agent.js |
| **Post-Release Sync** | After release publish | Sync main → develop | post-release-sync.agent.js |
| **Metrics** | Scheduled (daily) | Gather org-wide metrics | metrics.agent.js |

### Instructions (`instructions/` and `.github/instructions/`)

- **Coding Standards**: Language and framework-specific standards
- **Accessibility (A11y)**: WCAG 2.2 AA compliance
- **Community Standards**: Code of conduct and contribution guidelines
- **Documentation Formats**: Markdown, YAML, Mermaid standards
- **Pull Requests**: PR creation and review standards
- **Issues**: Issue creation and triage standards

### Templates

- **Issue Templates**: Bug reports, features, documentation, support
- **PR Templates**: Standard PR structure and checklist
- **Discussion Templates**: For GitHub Discussions
- **Saved Replies**: Pre-written responses for common scenarios

## Agent Architecture

### Agent Types

- **Labelling Agent**: Applies organization labels
- **Release Agent**: Manages releases and versioning
- **Metrics Agent**: Gathers and reports metrics
- **Review Agent**: Automated code review
- **Planning Agent**: Task breakdown and estimation

### Agent Integration Points

- GitHub API for issue/PR manipulation
- Workflow data for metrics
- Git history for analysis
- External APIs for integrations

## Automation Patterns

### Event-Driven

- Issue created → labeling workflow
- PR opened → checks workflow
- Push to main → release candidate evaluation

### Scheduled

- Daily: Metrics collection
- Weekly: Governance sync
- Monthly: Dependency updates

### Manual Triggers

- Release workflows (triggered by PR or tag)
- Manual project sync
- Metrics reports

## Security Model

- No secrets stored in repository
- All credentials in GitHub organization secrets
- Encrypted data at rest
- Audit logging for all automation
- Code review required for workflow changes

## Scalability Considerations

- Workflows use job matrices for parallel execution
- Caching for dependency management
- Batch processing for large datasets
- Incremental metrics collection

## Future Architecture

- Multi-repository webhook coordination
- Cross-organization issue linking
- Advanced analytics and reporting
- ML-based issue classification
- Automated dependency management

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
