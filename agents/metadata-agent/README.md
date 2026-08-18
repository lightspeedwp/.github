# Metadata Agent

Portable AI agent for syncing GitHub issue labels, PRs, and project fields with confidence scoring and validation tiers.

**Status:** Active | **Version:** 2.0.0 | **Type:** Portable Agent

## What This Agent Does

The Metadata Agent helps teams:

1. **Audit** metadata consistency (labels, fields, status)
2. **Sync** labels and project fields with confidence scoring
3. **Validate** release readiness across Tier 1, Tier 2, and Tier 3 checks
4. **Discover** and learn label taxonomy
5. **Recover** from errors with intelligent retry and suggestions

Perfect for:

- Preparing releases with metadata validation
- Fixing inconsistent labels across repositories
- Syncing GitHub Projects board fields from labels
- Teaching teams about label taxonomy
- Automating metadata governance

## Installation

### Option 1: Use in .github control plane

The agent is available in the GitHub control plane (LightSpeed organization) at:

```
.github/agents/project-meta-sync.agent.md (v2.0)
.github/agents/project-meta-sync-prompt.md
```

### Option 2: Install in your own repo

Copy the portable agent to your repository:

```bash
# Copy agent spec and prompt
cp -r agents/metadata-agent/ your-repo/agents/

# Install npm package
npm install @lightspeedwp/metadata-agent
```

### Option 3: Use as npm package only

If you just need the utilities without the agent spec:

```bash
npm install @lightspeedwp/metadata-agent
```

See [packages/metadata-agent/README.md](../../packages/metadata-agent/README.md) for npm package documentation.

## Quick Start

### Example 1: Audit labels

```
User: My labels are inconsistent. Can you audit them?

Agent: I'll audit your labels and show you coverage by family.
  - Type: 100% (all issues have a type label)
  - Priority: 65% (21 of 42 issues missing priority)
  - Area: 90% (4 issues missing area)

I found 7 issues with missing labels. Would you like me to:
1. Auto-fix (high confidence only, >85%)
2. Interactive review (you choose for each)
3. Dry-run (preview changes without applying)
```

### Example 2: Prepare for release

```
User: Help me prepare for a minor release.

Agent: I'll validate release readiness.

✅ Tier 1 (Blockers): 42/42 PASS
  - All issues have type label
  - No conflicting labels
  - All PRs have release status

⚠️  Tier 2 (Warnings): 40/42 PASS (95%)
  - 2 issues missing priority label

Recommendation: READY for minor release
  Action: Proceed with release preparation
```

### Example 3: Sync project fields

```
User: How do I sync project fields to GitHub Projects?

Agent: I'll show you the process and apply field mappings.

Label → Project Field mapping:
  type:bug → Type: "Bug"
  status:in-progress → Status: "In Progress"
  priority:critical → Priority: "Critical"

I've derived and synced fields for 42 issues. All issues now have
proper Type and Status fields in GitHub Projects. ✅
```

## Core Workflows

### 1. Audit Workflow

```
User Query → Agent calls audit → Analyze coverage → Present findings → Show options
                                                     ↓
                                        User chooses mode (auto/interactive/dry-run)
                                                     ↓
                                        Agent applies changes
```

**Usage:**

```
"My labels are inconsistent"
"Audit all labels in this repo"
"What's my label coverage?"
"Check type label coverage"
```

### 2. Sync Workflow

```
User Query → Analyze labels → Apply high-confidence changes → Report results
                ↓
            Multiple modes:
            - Auto (>85% confidence)
            - Interactive (user confirms each)
            - Dry-run (preview only)
```

**Usage:**

```
"Sync all labels automatically"
"Apply labels with my input"
"What would change in a dry-run?"
```

### 3. Validate Workflow

```
User Query → Check Tier 1 blockers → Check Tier 2 warnings → Return recommendation
                                                               ↓
                                                    Status: READY, WARNING, or BLOCKED
```

**Usage:**

```
"Help me prepare for release"
"Am I ready for a patch release?"
"Check release readiness"
```

### 4. Learn Workflow

```
User Query → Teach Tier 1 families → Teach Tier 2 families → Point to docs
```

**Usage:**

```
"What's our label taxonomy?"
"Explain the label families"
"I want to learn about labels"
```

## Configuration

The agent adapts to your repository's configuration. Customize by creating:

### .metadata-agent.json

```json
{
  "labelFamilies": ["type:", "status:", "priority:", "area:"],
  "requiredFamilies": ["type:", "status:"],
  "projectFields": {
    "Type": "type:*",
    "Status": "status:*",
    "Priority": "priority:*"
  },
  "validationTiers": {
    "tier1": [
      "All issues have type: label",
      "No conflicting labels",
      "All PRs have release status"
    ],
    "tier2": [
      "95%+ have priority: label",
      "95%+ have area: label"
    ]
  },
  "releaseRequirements": {
    "patch": ["tier1"],
    "minor": ["tier1", "tier2"],
    "major": ["tier1", "tier2", "comprehensive_audit"]
  },
  "confidenceThreshold": 0.85
}
```

### Repo-specific extensions

For control plane, block plugin, or block theme:

```javascript
// agents/metadata-agent/extensions/your-repo.js
export const yourRepoConfig = {
  labelFamilies: ['type:', 'status:', 'area:'],
  projectFields: { /* ... */ },
  validationTiers: { /* ... */ },
};
```

## Integration with label-orchestrator.js

The agent works with the label-orchestrator.js Phase 3-4 helper:

```bash
# Agent calls orchestrator commands
label-orchestrator audit --all
label-orchestrator sync --mode=auto --confidence=0.85
label-orchestrator validate --release-type=minor
```

The npm package provides utilities matching orchestrator output:

- Parsing results JSON
- Applying label changes
- Validating metadata
- Scoring confidence

## Validation Tiers

### Tier 1: Blockers (Must pass for any release)

- ✅ All issues have `type:*` label
- ✅ No conflicting labels (e.g., multiple `status:*`)
- ✅ All PRs have release notes status

Failure → **BLOCKED** (fix before release)

### Tier 2: Warnings (Recommended for releases)

- ✅ 95%+ have `priority:*` label
- ✅ 95%+ have `area:*` label
- ✅ All labels are canonical

Failure → **WARNING** (consider fixing)

### Tier 3: Info (Nice-to-have)

- ℹ️  Description is detailed (50+ chars)
- ℹ️  Issue has comments/discussion
- ℹ️  All families represented

Failure → **INFO** (no action required)

## Confidence Scoring

The agent scores label suggestions from 0-100:

- **Base score**: 50 (valid label)
- **+20**: Family matches context
- **+20**: Label name matches context
- **+10**: Description matches context
- **Max**: 100

Auto-apply threshold: **85%+** confidence (customizable)

## Error Handling

### Rate Limiting

```
Hit rate limit → Wait until reset → Retry → Continue
```

### Missing Labels

```
Invalid label → Suggest alternatives → User confirms → Apply
```

Example:

```
User: "Apply custom:label"

Agent: "custom:label" is not canonical.

Did you mean?
  - type:* (bug, feature, task, documentation)
  - status:* (needs-triage, in-progress, done)
  - priority:* (critical, important, normal)

Which family did you want?
```

### Complex Issues

```
Detect complex issue → Gather context → Handoff to specialist agent
```

Example:

```
User: "Redesign our entire label taxonomy"

Agent: This is beyond my scope. I'm transferring you to the
label-design-agent who specializes in taxonomy redesign.

Context being transferred:
  - Current families: 5
  - Coverage issues: low priority, conflicting labels
  - Recommendation: comprehensive redesign

label-design-agent will contact you shortly.
```

## Command Reference

### In prompts or issue descriptions

```markdown
<!-- Agent commands -->

/audit                              # Audit current labels
/sync --mode=auto --dry-run        # Preview changes
/validate --release=minor           # Check release readiness
/learn-taxonomy                     # Teach label families
```

### Inline requests

```
"@metadata-agent audit this repo"
"Show me label coverage by family"
"Am I ready to release v2.0.0?"
```

## Examples

### Example: Complete audit → sync → validate workflow

```
1. User: "My labels are inconsistent"
2. Agent: Audits and finds 21 issues missing priority label
3. Agent: Shows options (auto/interactive/dry-run)
4. User: "Auto-fix"
5. Agent: Applies 21 priority labels (92% confidence)
6. Agent: Re-validates and shows 100% priority coverage now
7. Agent: "All issues now have complete metadata. Ready for release."
```

### Example: Release preparation

```
1. User: "Help me prepare for v1.5.0 (patch release)"
2. Agent: Validates Tier 1 blockers → PASS
3. Agent: Shows recommendation: "READY for patch release"
4. User: "What about Tier 2?"
5. Agent: Shows Tier 2 warnings (2 issues missing priority)
6. Agent: "Not required for patch, but recommended for minor"
7. User: "Thanks, releasing now"
```

## Limitations & Handoffs

The agent recognizes when to escalate:

| Scenario | Agent | Handoff |
|----------|-------|---------|
| Audit & fix labels | ✅ | — |
| Sync to project fields | ✅ | — |
| Validate release | ✅ | — |
| Fix invalid labels | ✅ | — |
| Taxonomy redesign | ❌ | label-design-agent |
| Policy changes | ❌ | governance-agent |
| Custom integrations | ❌ | Platform Engineer |

## Architecture

```
Agent Prompt (250-300 lines)
    ↓
Agent executes workflows
    ↓
Calls label-orchestrator.js
    ↓
Uses @lightspeedwp/metadata-agent (npm package)
    ↓
GitHub API (Octokit)
```

### Files Included

```
agents/metadata-agent/
├── README.md                          # This file
├── agent.md                          # Spec (generic, repo-agnostic)
├── prompt.md                         # Prompt (250-300 lines)
├── scripts/
│   ├── audit.js                      # Audit helper script
│   ├── sync.js                       # Sync helper script
│   ├── validate.js                   # Validate helper script
│   └── __tests__/                    # Unit tests (80%+ coverage)
├── extensions/
│   ├── github-control-plane.js      # Control plane config
│   ├── block-plugin.js               # Block plugin config
│   ├── block-theme.js                # Block theme config
│   └── __tests__/                    # Extension tests
├── integration/
│   ├── github-api-adapter.js        # GitHub API wrapper
│   ├── orchestrator-adapter.js      # Orchestrator integration
│   └── __tests__/                    # Integration tests
└── CHANGELOG.md                      # Version history
```

## Testing

The agent includes comprehensive test coverage:

- **100+ unit tests** (label parsing, validation, scoring)
- **20+ integration tests** (orchestrator calls, API operations)
- **7 E2E scenarios** (complete workflows from user query to resolution)
- **80%+ coverage** target across all code

Run tests:

```bash
npm test                    # All tests
npm run test:coverage       # With coverage report
npm run test:integration    # Integration only
npm run test:e2e           # E2E scenarios only
```

## Contributing

To extend or customize:

1. Create a `.metadata-agent.json` config
2. Implement repo-specific extension in `extensions/`
3. Add tests in `__tests__/` folders
4. Update `README.md` with your customization

## Support & Issues

- **Bug reports**: GitHub Issues with label `area:labels`
- **Feature requests**: GitHub Discussions or Issues
- **Documentation**: See related links below

## Related Resources

### Documentation

- [Label Strategy Guide](../../docs/LABEL_STRATEGY.md) — Design your taxonomy
- [Labeling Standards](../../docs/LABELING.md) — Naming conventions
- [Validation Tiers](../../docs/VALIDATION_TIERS.md) — Detailed tier definitions

### Code

- [npm Package](../../packages/metadata-agent/) — Reusable utilities
- [label-orchestrator.js](../../scripts/automation/label-orchestrator.js) — Helper script
- [Integration Tests](../../packages/metadata-agent/tests/integration/)

### Related Agents

- **label-design-agent** — Redesign taxonomies
- **governance-agent** — Policy enforcement
- **project-updater** — Sync project fields

---

Built with ☕ by LightSpeedWP — [GitHub](https://github.com/lightspeedwp/.github) | [Discussions](https://github.com/lightspeedwp/.github/discussions)
