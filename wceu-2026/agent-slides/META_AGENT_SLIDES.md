---
title: "Meta Agent Slide Deck Prompt"
description: "NotebookLM and design prompt for generating Meta Agent presentation slides"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Meta Agent Slide Deck Prompt

## Agent Overview

The **Meta Agent** provides operational intelligence and repository health analysis across the lightspeedwp/.github ecosystem. It monitors frontmatter freshness, detects stale documents, validates link integrity, flags linting violations, and generates health dashboards that inform other agent decisions.

**Operational scope**: Repository-wide health monitoring, metric collection, violation detection, health dashboards, trend analysis.

**Owned by**: LightSpeedWP ops & engineering teams

## Key Capabilities

1. **Frontmatter Freshness Monitoring** - Track last_updated dates, flag documents older than 6 months
2. **Link Validation** - Detect broken internal/external references, generate link health reports
3. **Linting Violation Detection** - Monitor markdown, YAML, JSON, and code style errors
4. **Health Dashboards** - Visual metrics on document coverage, error counts, staleness distribution
5. **Trend Analysis** - Track changes over time (improving vs. degrading health)
6. **Violation Heatmaps** - Identify which files/categories have highest error density

## Integration Points

- **Upstream**: Branding Agent (provides governance rules), Linting Agent (reports style violations)
- **Downstream**: All agents (consume health metrics to prioritize work), Planner Agent (roadmap informed by health gaps)
- **Governance**: `.github/metrics/meta-metrics.json` (snapshot), `.github/metrics/meta-log.md` (time-series)

## Use Cases & Examples

### Use Case 1: Quarterly Health Audit

Team wants to understand repository health status at end of quarter.

**Meta Agent workflow:**

1. Scan all documents for freshness (last_updated field)
2. Run link validation across all .md files
3. Compile linting error report
4. Generate health dashboard with trends
5. Identify top 10 files needing updates
6. Produce executive summary for stakeholders

### Use Case 2: Continuous Health Monitoring

Every PR triggers health check to ensure quality doesn't degrade.

**Meta Agent workflow:**

1. On each PR: validate changed files for freshness violations
2. Check for broken links introduced by changes
3. Run linting on markdown changes
4. Report violations in PR review comment
5. Block merge if critical violations detected
6. Update health metrics after merge

### Use Case 3: Stale Document Detection

Automated alert: A key document hasn't been updated in 8 months.

**Meta Agent workflow:**

1. Detect documents with last_updated > 6 months old
2. Assess criticality based on document category and reference count
3. Generate remediation task: "Review and update [file]"
4. Notify document owners via issue
5. Track remediation progress
6. Report on overall staleness trend

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Repository health unknown; no visibility into freshness, broken links, errors
- Stakes: Outdated docs mislead contributors; broken links frustrate users; errors accumulate

**Slide 02** - Meta Agent Role

- Provides continuous visibility into repository health
- Detects problems early; enables data-driven decisions for other agents

**Slide 03** - Frontmatter Freshness Monitoring

- Tracks last_updated field in document frontmatter
- Flags documents stale (>6 months), warning (>3 months)
- Generates staleness report by category
- Prioritizes remediation by impact (high-traffic docs first)

**Slide 04** - Link Validation System

- Scans all .md files for internal and external references
- Tests link targets: file existence, anchor validity, URL reachability
- Generates broken link report with severity (internal > external)
- Suggests fixes or removal

**Slide 05** - Linting Violation Tracking

- Monitors markdown syntax errors (bare URLs, heading spacing, list formatting)
- Tracks YAML/JSON/code errors in config and automation files
- Aggregates violations by file, category, and error type
- Trends: Is linting quality improving or degrading?

**Slide 06** - Health Metrics Dashboard

- Document freshness: % fresh, warning, stale by category
- Link health: % working links, broken count, external vs. internal
- Linting compliance: % of files with zero violations
- Coverage: % of repository with frontmatter, changelog entries, etc.

**Slide 07** - Trend Analysis & Burndown

- Track metrics over time (weekly/monthly snapshots)
- Show improvement trends (health getting better)
- Identify recurring problem areas (specific categories, file types)
- Predict future health if current trends continue

**Slide 08** - Violation Heatmaps

- Visual: Which files have the most errors?
- Visual: Which categories have highest violation rates?
- Visual: Are errors concentrated in few files or distributed?
- Actionable: Target high-violation files for remediation

**Slide 09** - Integration with Branding Agent

- Branding Agent enforces governance rules (frontmatter, footers)
- Meta Agent monitors compliance with those rules
- Feedback: Report violations, Branding Agent remediates

**Slide 10** - Integration with Planner Agent

- Meta Agent provides health baseline for current sprint
- Planner Agent assigns remediation tasks based on health report
- Example: "High linting error count → assign to Linting Agent"

**Slide 11** - On-PR Health Checks

- Every PR: validate changed files for freshness, links, linting
- Block merge on critical violations (broken internal links)
- Warn on quality regressions (new violations introduced)
- Enable developers to fix issues before merge

**Slide 12** - Adoption & Transparency

- All metrics publicly visible in `.github/metrics/`
- Weekly dashboard updates (automated)
- Quarterly health reports for stakeholders
- Open roadmap: known health gaps, planned improvements

**Slide 13** - Metrics & Targets (optional)

- Target: 95% of documents with up-to-date last_updated
- Target: 100% internal link validity
- Target: 90% of files with zero linting violations
- Target: Full frontmatter compliance (all required fields)

**Slide 14** - Lessons & Edge Cases (optional)

- Lesson: External links change; maintain allowlist strategy
- Challenge: Bulk updates can spike violation counts; need context
- Lesson: Health trends matter more than absolute numbers

**Slide 15** - Close & Next Actions

- Meta Agent provides continuous health visibility
- Contribute: Keep last_updated current; test links in PRs
- Questions & feedback

## Evidence Anchors

- `.github/metrics/meta-metrics.json` - Current health snapshot
- `.github/metrics/meta-log.md` - Time-series metrics and trends
- `.github/workflows/meta.yml` - Meta Agent workflow definition
- `scripts/validation/validate-frontmatter-freshness.js` - Freshness checking logic
- `scripts/validation/validate-links.js` - Link validation implementation
- `AGENTS.md` - Meta Agent responsibility specification

## Design Notes

- **Visual theme**: Monitoring & intelligence (dashboards, gauges, trending charts)
- **Color palette**: Use monitoring/ops colors (greens for healthy, reds for violations)
- **Key visuals**: Health dashboard screenshot, trend line graphs, heatmap examples, metric breakdown pie charts
- **Accessibility**: High contrast for status indicators; data tables with proper headers
- **Animations**: Consider metric counter animation, trend line animation

## Quality Bar

- Distinguish real-time metrics vs. daily/weekly snapshots
- Include confidence levels for metric accuracy
- Explain how metrics inform agent decisions (e.g., "High staleness → Branding Agent marks deprecated")
- Validate examples against actual `.github/metrics/` files
- Ensure all evidence references are current
