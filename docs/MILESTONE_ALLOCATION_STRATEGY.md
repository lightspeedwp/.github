# Milestone Allocation Strategy

This document explains how issues and pull requests are automatically allocated to version milestones in the LightSpeed `.github` repository.

## Overview

The **metadata-governance** workflow automatically routes new issues and PRs to the appropriate version milestone based on their labels. This ensures consistent planning and capacity management across the release roadmap.

## How It Works

### Workflow Trigger

The `metadata-governance.yml` workflow activates when:

- **Issues**: opened, reopened, or edited
- **Pull Requests**: opened, reopened, edited, synchronized, or marked ready for review

The workflow executes three sequential jobs:

1. **Sync issue/PR metadata** — Extract and normalize issue fields
2. **Allocate to milestone** — Determine target milestone based on labels
3. **Check milestone capacity** — Post warnings if a milestone approaches capacity

### Label-Based Routing

Issues are routed to milestones using a three-tier label system:

#### Tier 1: High-Priority Labels → v1.0 (Current Release)

Issues labeled with any of these are assigned to **v1.0** (or the configured `next_milestone`):

- `security` — Security vulnerabilities or hardening
- `critical-bug` — Blocking defects
- `compliance` — Regulatory or legal requirements
- `a11y` — Accessibility compliance work

**Use case**: These issues block the current release and must be addressed immediately.

#### Tier 2: Backlog Labels → No Milestone (Unplanned)

Issues labeled with any of these are **not assigned a milestone** (`null`):

- `research` — Exploratory or discovery work
- `spike` — Time-boxed investigation
- `proof-of-concept` — Prototype or experimental feature
- `enhancement` — Future improvement

**Use case**: These are candidate work for future releases but not yet committed to a specific version.

#### Tier 3: Default → v1.0

All other issues without matching labels default to **v1.0**.

**Use case**: Generic issues (bugs, features, chores) are assigned to the next planned release.

### Multiple Labels

If an issue has multiple labels:

- **High-priority labels take precedence** over backlog labels
- Example: an issue labeled both `security` and `enhancement` → assigned to v1.0 (security wins)

### No Re-Allocation on Edit

Once allocated, an issue's milestone is **not updated if labels change after creation**. This prevents race conditions and allows deliberate milestone reassignment via GitHub's UI.

To move an issue to a different milestone:

1. Open the issue on GitHub
2. Click the **Milestone** field
3. Select the target milestone

## Milestone Configuration

Milestones must be pre-created in GitHub. The allocation system expects these versions to exist:

| Milestone | Purpose |
|-----------|---------|
| **v1.0** | Foundation & Multi-Provider Agent Standardization |
| **v1.1** | File Organization & Core Infrastructure |
| **v1.2** | Documentation Consolidation & Governance |
| **v1.3** | Automation Hardening & Release Safety |
| **v1.4** | Testing & Quality Coverage |
| **v1.5** | Advanced Features & Plugin Integration |
| **v1.6** | Future/Reserve |

### Creating Milestones

Milestones are managed via GitHub's web interface:

1. Go to **Issues** → **Milestones**
2. Click **New milestone**
3. Enter the version title (e.g., `v1.0`)
4. Set an optional due date
5. Click **Create milestone**

**Note:** If a milestone doesn't exist, allocation fails silently with a warning in the workflow logs.

## Capacity Management

The workflow monitors milestone capacity and posts warnings when thresholds are exceeded.

### Capacity Thresholds

- **Warn**: 50+ open issues (non-excluded types)
- **Error**: 100+ open issues (non-excluded types)

### Excluded Issue Types

The following issue types do **not count** toward capacity warnings:

- `chore` — Maintenance, dependency updates
- `task` — Small scoped work
- `documentation` — Docs and content updates

**Rationale**: These are typically smaller, lower-risk items and shouldn't block milestone planning.

### Capacity Warnings

When a milestone reaches a threshold, the workflow posts a comment on the triggering issue:

```
## ⚠️ Milestone Capacity Warning

⚠️ **v1.0**: Milestone 'v1.0' approaching capacity (52 >= 50 issues)

_Maintained by milestone capacity monitoring. Consider deferring lower-priority work to future milestones._
```

**Action**: Review the milestone and defer lower-priority items to v1.1 or later.

## Configuration

The allocation strategy is configured in `.github/project-routes.yml`:

```yaml
milestone_strategy:
  type: "version-based"
  
  active_milestones:
    - v1.0
    - v1.1
    - v1.2
    - v1.3
    - v1.4
    - v1.5
    - v1.6
  
  allocation:
    high_priority_labels: [security, critical-bug, compliance, a11y]
    next_milestone: v1.0
    
    backlog_labels: [research, spike, proof-of-concept, enhancement]
    backlog_milestone: null
    
    default_milestone: v1.0
  
  capacity:
    warn_threshold: 50
    error_threshold: 100
    exclude_types: [chore, task, documentation]
```

### Customizing Routes

To adjust the allocation strategy:

1. Edit `.github/project-routes.yml`
2. Modify `allocation` or `capacity` sections
3. Create a PR with the changes
4. The workflow automatically uses the updated config on merge

## Implementation Details

### Workflow Files

- `.github/workflows/metadata-governance.yml` — Main workflow orchestrator
- `scripts/agents/includes/milestone-allocation.cjs` — Allocation logic and label routing
- `scripts/agents/includes/allocate-milestone.cjs` — GitHub API integration
- `scripts/agents/includes/check-milestone-capacity.cjs` — Capacity monitoring
- `.github/project-routes.yml` — Configuration

### Label Extraction

Labels are extracted from:

1. **GitHub issue labels** — Primary source (checked first)
2. **Fallback**: Issue type field (if available)

### Estimation Notes

Capacity counts use **estimated totals** based on pagination:

- Fetches first 100 issues per milestone
- Calculates total pages from HTTP link headers
- Estimates total count as `page_count × 100`
- Applies exclusion filter to estimate filtered count

**Limitation**: This estimation can over/underestimate for edge cases. For exact counts, check GitHub's issue filter UI.

## Troubleshooting

### Issue not allocated to a milestone

**Cause**: Workflow failed or milestone doesn't exist.

**Fix**:

1. Check the workflow run log (GitHub Actions → Metadata • Issues & PRs)
2. Verify milestones exist in **Issues → Milestones**
3. Check the issue's labels against the allocation rules
4. Manually assign the milestone via GitHub's UI

### Milestone capacity warning always triggered

**Cause**: Included issue types exceed capacity.

**Fix**:

1. Review the milestone's issue count
2. Defer lower-priority items to future milestones
3. Consider adjusting thresholds in `.github/project-routes.yml`

### Allocation logic not working

**Cause**: Configuration syntax error or missing labels.

**Fix**:

1. Validate `.github/project-routes.yml` syntax (run `npm run lint:js`)
2. Ensure issue has the expected labels
3. Check workflow logs for error messages

## Best Practices

### For Contributors

1. **Apply labels when creating issues** — Allocation happens on issue open, so labels must exist at creation time
2. **Use high-priority labels judiciously** — Only for blocking work that impacts the current release
3. **Use backlog labels for future work** — Exploratory or enhancement issues shouldn't be assigned to a specific milestone
4. **Check milestone before submitting** — Review the target milestone and consider capacity

### For Maintainers

1. **Review capacity warnings** — When a milestone approaches thresholds, discuss deferral of lower-priority work
2. **Keep milestones current** — Close completed milestones and create new versions as releases progress
3. **Audit label usage** — Periodically review which labels trigger allocation to ensure consistency
4. **Communicate changes** — If modifying the allocation strategy, update this doc and notify the team

## Future Enhancements

- [ ] Automatic re-allocation on label changes (currently manual)
- [ ] GraphQL-based exact capacity counts (currently estimated via pagination)
- [ ] Escalation workflow for backlog items to active milestones
- [ ] Burndown and velocity charts per milestone
- [ ] Epic-based routing (future support when GitHub Projects v3 adds parent/child relations)

## Related

- [Branching Strategy](./BRANCHING_STRATEGY.md) — How to name branches
- [PR Creation Process](./PR_CREATION_PROCESS.md) — PR template routing
- `.github/project-routes.yml` — Configuration source
- `.github/workflows/metadata-governance.yml` — Workflow implementation

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
