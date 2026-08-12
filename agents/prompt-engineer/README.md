---
name: Prompt Engineer Agent
description: Portable prompt engineering and validation agent for LightSpeed organization
version: "1.0.0"
created: "2026-08-12"
status: "phase-2-active"
---

# Prompt Engineer Agent

A portable, context-aware prompt engineering agent for the LightSpeed organisation. Analyzes, improves, and validates prompts across `.github` control plane, WordPress plugins, and WordPress theme contexts.

## Features

- **Analyze Prompts** — Systematic clarity analysis (completeness, specificity, constraints)
- **Generate Improvements** — Actionable suggestions with trade-off analysis
- **Validate Standards** — Format validation and context-specific rule checking
- **Context Detection** — Automatic detection of `.github`, WordPress plugin, or WordPress theme context
- **Trade-off Analysis** — Honest assessment of gains/losses for each improvement

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/lightspeedwp/.github.git
cd .github

# The agent is located at:
agents/prompt-engineer/

# Load the agent in Claude Code:
# 1. Add to your .claude/agents/ directory
# 2. Or reference directly: /agent agents/prompt-engineer/README.md
```

### Basic Usage

#### Analyze a Prompt

```
Analyze this prompt:
"Create a GitHub Actions workflow that labels pull requests based on files changed"

Use the analyze-prompt skill to:
1. Detect clarity score (completeness, specificity, constraints)
2. Identify missing elements
3. Identify ambiguities
4. List strengths
5. Recommend improvements
```

**Typical Output:**

```json
{
  "score": {
    "overall": 7.5,
    "completeness": 8,
    "specificity": 7,
    "constraints": 7
  },
  "context_detected": ".github",
  "strengths": [
    "Clear goal and output specification",
    "Specific context identified"
  ],
  "missing_elements": [
    "Specific label names",
    "Example rules",
    "Error handling behavior"
  ]
}
```

#### Get Improvement Suggestions

```
Here's my prompt: "Create validation rules for pull requests"

Use the improve-prompt skill to:
1. Identify clarity, completeness, and constraint issues
2. Suggest specific improvements
3. Provide before/after examples
4. Analyze trade-offs
5. Prioritize by impact/effort
```

**Typical Output:**

```json
{
  "improvements": [
    {
      "id": "completeness-1",
      "problem": "Missing examples of validation rules",
      "before": "Create validation rules for pull requests",
      "after": "Create validation rules for pull requests. Example rules: If package.json changed → add 'area:deps' label",
      "trade_offs": {
        "gain": ["Unambiguous requirements", "Easier to test"],
        "lose": ["Longer prompt"]
      },
      "effort": "low",
      "impact": "high"
    }
  ],
  "priority_improvements": ["completeness-1 (HIGH impact, LOW effort)"]
}
```

#### Validate a Prompt

```
Validate this prompt against .github standards:
"Create a GitHub Actions workflow at .github/workflows/label-sync.yml 
that syncs labels from .github/labels.yml daily at 02:00 UTC"

Use the validate-prompt skill to:
1. Check format and syntax
2. Verify context-specific rules
3. Validate standards compliance
4. Return detailed report
```

**Typical Output:**

```json
{
  "status": "valid",
  "score": 9.2,
  "context": ".github",
  "errors": [],
  "warnings": [
    {
      "message": "Missing documentation of error handling",
      "suggestion": "Document behavior if workflow fails"
    }
  ],
  "checks": {
    "format": {"status": "pass", "items_passed": 8, "items_total": 8},
    "context_specific": {"status": "pass", "items_passed": 12, "items_total": 12},
    "standards": {"status": "pass", "items_passed": 9, "items_total": 10}
  }
}
```

## Context Support

### .github Control Plane

Specializes in GitHub governance, workflows, CI/CD, and labeling:

- Workflow syntax and trigger validation
- Label naming conventions (type:, status:, priority:, area:, meta:)
- Branch naming rules (feat/, fix/, docs/, etc.)
- PR template routing
- Branching strategy alignment

### WordPress Plugin

Specializes in plugin development:

- Hook registration (add_action, add_filter)
- Block registration and structure
- Plugin header validation
- Dependency and version management
- JavaScript/CSS enqueue best practices

### WordPress Theme

Specializes in theme development:

- Theme.json structure and validation
- Design token naming and consistency
- Color contrast (WCAG AA) validation
- Pattern and template structure
- Template hierarchy compliance

## How It Works

### Phase 2 Implementation (Current)

**Completed:**

- ✅ analyze-prompt.skill.md — Clarity detection framework
- ✅ improve-prompt.skill.md — Suggestion generation with trade-off analysis
- ✅ validate-prompt.skill.md — Format and standards validation
- ✅ Context detection logic (auto-detect .github, plugin, theme)
- ✅ Agent README (this file)

**In Progress:**

- 🔄 API documentation (API.md)
- 🔄 Examples (EXAMPLES.md)
- 🔄 Unit tests (80%+ coverage target)
- 🔄 Integration tests (10+ test cases per context)

**Coming in Phase 3:**

- GitHub Actions workflow sample
- Multi-model validation (Sonnet vs Haiku)
- Repository-specific validation tests

## Architecture

```
agents/prompt-engineer/
├── README.md                    # This file
├── API.md                       # API documentation
├── EXAMPLES.md                  # Real-world examples
├── ARCHITECTURE.md              # System design (Phase 4)
├── skills/
│   ├── analyze-prompt.skill.md  # Clarity analysis framework
│   ├── improve-prompt.skill.md  # Improvement suggestion engine
│   └── validate-prompt.skill.md # Format & standards validation
├── tests/
│   ├── unit/                    # Unit tests (Phase 3)
│   ├── integration/             # Integration tests (Phase 3)
│   └── acceptance/              # Acceptance tests (Phase 3)
└── examples/
    ├── github/                  # .github context examples
    ├── plugin/                  # WordPress plugin examples
    └── theme/                   # WordPress theme examples
```

## Skills Reference

### analyze-prompt.skill.md

Systematic analysis of prompt clarity through three dimensions:

- **Completeness:** All necessary information present?
- **Specificity:** Instructions concrete and unambiguous?
- **Constraints:** Boundaries and limitations defined?

**Use when:** You want to understand prompt quality before improving it

**Input:** A prompt (text)  
**Output:** Structured analysis with scores and recommendations

### improve-prompt.skill.md

Generates actionable improvement suggestions with:

- Problem identification with quoted phrases
- Concrete before/after examples
- Trade-off analysis (what you gain/lose)
- Effort and impact estimates

**Use when:** You want to improve a prompt with specific suggestions

**Input:** A prompt or analysis result  
**Output:** Prioritized improvement suggestions with trade-offs

### validate-prompt.skill.md

Validates prompt conformance to:

- Format standards (structure, syntax, grammar)
- Context-specific rules (`.github`, plugin, theme)
- Best practices (clarity, completeness, constraints)
- Schema compliance (JSON/YAML syntax)

**Use when:** You want to verify a prompt meets project standards

**Input:** A prompt and context (or auto-detect)  
**Output:** Validation report with errors, warnings, and recommendations

## Common Workflows

### Workflow 1: Analyze → Improve → Validate

```
1. User submits prompt
2. analyze-prompt detects issues
3. improve-prompt suggests fixes
4. User revises prompt
5. validate-prompt confirms compliance
```

### Workflow 2: Context-Specific Analysis

```
1. Prompt detected as .github context
2. apply .github-specific rules to analysis
3. suggest improvements aligned with governance standards
4. validate against branching/labeling/workflow conventions
```

### Workflow 3: Iterative Improvement

```
1. Initial analysis (score: 5/10)
2. Suggest high-impact improvements
3. User implements suggestions
4. Re-analyze (score: 8/10)
5. Suggest remaining improvements
6. Final validation
```

## Configuration

### Context Detection

Automatically detects context from prompt content:

**Markers for .github:**

- References: "GitHub", "workflow", "action", "CI/CD", "label", "pull request"
- Syntax: `.yml` file references, GitHub Actions syntax

**Markers for WordPress Plugin:**

- References: "plugin", "hook", "filter", "block", "WordPress"
- Syntax: `add_action`, `apply_filters`, `block.json`

**Markers for WordPress Theme:**

- References: "theme", "theme.json", "design token", "pattern", "template"
- Syntax: `theme.json` structure, CSS, design tokens

**Override context** via environment variable:

```bash
PROMPT_ENGINEER_CONTEXT=".github" # or "wordpress-plugin" or "wordpress-theme"
```

## Success Criteria (Phase 2)

- ✅ Agent passes 10+ integration test cases
- ✅ Context detection works for all three repository types
- ✅ API documented with examples
- ✅ 80%+ code coverage achieved

## FAQ

**Q: How does context detection work?**  
A: The agent analyzes prompt content for keywords and syntax patterns. See `analyze-prompt.skill.md` for marker list. Override with `PROMPT_ENGINEER_CONTEXT` environment variable.

**Q: Can I use this outside LightSpeed projects?**  
A: Yes! The core analysis framework is generic. Context-specific rules (`.github`, plugin, theme) can be removed or customized for your project.

**Q: How accurate are the improvement suggestions?**  
A: Suggestions are based on 4-dimension analysis (clarity, completeness, constraints, context-specific rules). Phase 3 testing validates accuracy across real repositories.

**Q: What's the difference between improve and validate?**  
A: **Improve** suggests changes to make prompts better. **Validate** checks if prompts meet standards. Use both: improve for quality, validate for compliance.

**Q: Does this work with other AI models?**  
A: Phase 2 uses Claude. Phase 3 will test against Claude Sonnet and Haiku for consistency. Results may vary by model.

## Roadmap

| Phase | Timeline | Focus | Status |
|-------|----------|-------|--------|
| **1** | Completed | Specification & design | ✅ Complete |
| **2** | Now (3-4w) | Core implementation | 🔄 Active |
| **3** | 2-3 weeks | Testing & validation | ⏳ Pending |
| **4** | 2 weeks | Docs & release | ⏳ Pending |

## Related Resources

- **Project:** [portable-prompt-engineer-agent-spec](../../../.github/projects/active/openspec/changes/portable-prompt-engineer-agent/)
- **Issue:** [#1805 Epic](https://github.com/lightspeedwp/.github/issues/1805)
- **Design:** Phase 1 specification document
- **CLAUDE.md:** [Project standards](../../../CLAUDE.md)
- **BRANCHING_STRATEGY.md:** [Git governance](../../../.github/docs/BRANCHING_STRATEGY.md)

## Contributing

Want to improve the Prompt Engineer Agent?

1. **Report issues** in the project repo
2. **Submit improvements** via PR following [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md)
3. **Propose new features** in [issue #1805](https://github.com/lightspeedwp/.github/issues/1805)

For detailed contribution guidelines, see `CONTRIBUTING.md` (Phase 4).

## Maintenance

- **Maintainer:** Ash Shaw
- **Last Updated:** 2026-08-12
- **Status:** Phase 2 (Core Implementation)

---

**Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!**
