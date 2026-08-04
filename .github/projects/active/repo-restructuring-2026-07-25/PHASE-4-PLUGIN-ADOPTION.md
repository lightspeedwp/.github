# Phase 4: Plugin Adoption Strategy & Website Updates

## Repository Restructuring — Plugin Guides & Website Integration

**Duration:** 3–4 days  
**Owner:** Claude Code Agent (documentation) + Web team (website deployment)  
**Status:** Ready to Execute  
**Prerequisites:** Phase 3 complete, VSCode setup documented

---

## Copy This Prompt for Claude

```
PHASE 4: Create plugin adoption guides and document website updates.

STATUS: Phase 3 complete. VSCode setup infrastructure ready.

TASK: Create plugin setup guides and website update requirements.

=====================================
DELIVERABLE 4.1: PLUGIN SETUP GUIDES
=====================================

Create: docs/plugin-setup-claude-code.md

Content: Step-by-step guide for Claude Code setup:
- Installation from VSCode marketplace
- API key configuration
- Using agents in Claude Code
- Running commands and workflows
- Troubleshooting common issues
- Best practices for development

---

Create: docs/plugin-setup-github-copilot.md

Content: Step-by-step guide for GitHub Copilot setup:
- Installation from VSCode marketplace
- GitHub authentication setup
- Using inline code suggestions
- Accepting/rejecting suggestions
- Configuration options
- Troubleshooting
- Best practices

---

Create: docs/plugin-comparison.md

Content: Comparative table showing:
- Claude Code features vs GitHub Copilot vs Codex vs Gemini
- When to use each tool
- Cost/licensing
- Support level
- Recommendation: Tier 1 = Claude Code + Copilot (Aug/Sept 2026)

---

Create: docs/plugin-adoption-phases.md

Content:

---
# Plugin Adoption Roadmap

## Timeline Overview

Phased adoption across three tiers of team members.

### Tier 1: Core Maintainers & Lead Contributors (Aug 2026)
- Team: 2–3 core maintainers
- Plugins: Claude Code + GitHub Copilot
- Status: Early adopters, gather feedback
- Duration: August 2026
- Success Criteria: Both plugins working, team trained

### Tier 2: All Contributors (Sept 2026)
- Team: 4–5 contributors
- Plugins: Tier 1 plugins available, Codex optional
- Status: Broader rollout, feedback collection
- Duration: September 2026
- Success Criteria: >80% adoption, issues resolved

### Tier 3: WordPress Project Consumers (Oct 2026+)
- Team: 8–9 WordPress project teams
- Plugins: Tier 1–2 available, Gemini emerging
- Status: Full team adoption, vendor evaluation
- Duration: October 2026 onwards
- Success Criteria: All consumers equipped, satisfied with setup

## Grace Period & Support

- **Grace Period:** 3 weeks from plugin release
- **Support Channel:** GitHub issues with label `[plugin-help]`
- **Documentation:** Available on github.lightspeedwp.agency
- **Escalation:** Contact Ash Shaw for blockers

## Contingency

If blockers prevent adoption:
1. Document issue with detailed steps to reproduce
2. Contact Ash Shaw and Claude team
3. Alternative tooling identified if vendor issue
4. Grace period extended if necessary

---

=====================================
DELIVERABLE 4.2: WEBSITE UPDATE REQUIREMENTS
=====================================

Create: .github/projects/active/repo-restructuring-2026-07-25/WEBSITE-UPDATE-REQUIREMENTS.md

Content: Document what needs updating on github.lightspeedwp.agency

### Onboarding Page (/)

Current: Generic onboarding
New: Route by team tier

Implement:
- Three distinct onboarding flows:
  1. **Core Maintainers** — Full access, plugin setup, governance docs
  2. **Contributors** — Setup guide, branching strategy, contribution guidelines
  3. **Consumers** — Getting started with agents/skills, FAQ, support

### Getting Started (/getting-started/)

New: Separate guides for each tier

Create:
- /getting-started/maintainers/ — Full setup including plugins
- /getting-started/contributors/ — Setup, branching, PR workflow
- /getting-started/consumers/ — Using agents, skills, hooks

Link to:
- docs/vscode-workspace-setup.md
- docs/BRANCHING_STRATEGY.md
- docs/plugin-setup-*.md (based on tier)

### Documentation (/documentation/)

New: Render docs/ folder content

Implement:
- Auto-generate documentation pages from docs/ markdown
- Include migration guide (docs/MIGRATION.md)
- Include validation standards
- Include agent/skill documentation

### References (/references/)

New: Links to reusable assets

Implement:
- agents/ — List and links to all agents
- skills/ — List and links to all skills
- hooks/ — Git hooks documentation
- plugins/ — Plugin bundles
- instructions/ — Portable instructions

### Cookbook (/cookbook/)

New: Render cookbook/ folder

Implement:
- Auto-generate recipes from cookbook/ markdown
- Include setup recipes
- Include workflow examples
- Include troubleshooting guides

### Updates to Existing Pages

Homepage:
- Add link to new onboarding flow
- Highlight plugin adoption phases

Navigation:
- Add "Onboarding" dropdown (route by role)
- Add "References" to navigation
- Add "Cookbook" to navigation

---

=====================================
DELIVERABLE 4.3: PLUGIN TESTING GUIDE
=====================================

Create: docs/plugin-testing.md

Content: Manual testing checklist for plugins:
- Installation verification
- Feature testing for each plugin
- Common issues and resolution
- How to report plugin issues
- Version management and updates

---

=====================================
DELIVERABLE 4.4: VSCODE PLUGIN TROUBLESHOOTING
=====================================

Create: docs/vscode-plugin-troubleshooting.md

Content: Specific troubleshooting for plugin issues:
- Plugin installation failures
- Plugin authentication problems
- API key configuration issues
- Extension conflicts
- Performance issues
- Getting help and support

---

=====================================
PHASE 4: FINAL COMMIT
=====================================

git add -A

git commit -m "docs: Create plugin adoption strategy and website requirements

Created plugin setup guides:
- docs/plugin-setup-claude-code.md — Claude Code installation & setup
- docs/plugin-setup-github-copilot.md — Copilot installation & setup
- docs/plugin-comparison.md — Feature comparison table

Created plugin adoption documentation:
- docs/plugin-adoption-phases.md — Tier-based rollout timeline
- docs/plugin-testing.md — Testing checklist
- docs/vscode-plugin-troubleshooting.md — Plugin troubleshooting

Created website update requirements:
- .github/projects/.../WEBSITE-UPDATE-REQUIREMENTS.md
  * Onboarding routing by tier (maintainers/contributors/consumers)
  * Getting started guides for each tier
  * Documentation page rendering
  * References section setup
  * Cookbook integration

Website updates require handoff to web team for github.lightspeedwp.agency deployment.

Phase 5 (rollout & team communications) ready to proceed.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git log --oneline -3
```

---

## What to Expect

**Duration:** 3–4 days  
**Scope:** 7 documentation files, 1 website requirements document

**Outcomes:**

- ✅ Plugin setup guides available for all team members
- ✅ Website update requirements documented and handed off
- ✅ Adoption timeline clear and communicated
- ✅ Testing and troubleshooting guides available

---

**Document Version:** 1.0  
**Status:** Ready to Execute  
**Created:** 2026-07-26
