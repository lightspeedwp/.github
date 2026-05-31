---
title: "Branding Agent Slide Deck Prompt"
description: "NotebookLM and design prompt for generating Branding Agent presentation slides"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Branding Agent Slide Deck Prompt

## Agent Overview

The **Branding Agent** enforces unified document identity, governance metadata consistency, and organizational standards across the lightspeedwp/.github ecosystem. It standardizes frontmatter, maintains header/footer integrity, applies badges and status indicators, and ensures 16 document categories follow canonical styling rules.

**Operational scope**: Repository-wide document governance, metadata standardization, visual identity enforcement, category-based styling rules.

**Owned by**: LightSpeedWP product & ops teams

## Key Capabilities

1. **Frontmatter Standardization** - Enforce required fields (title, description, owners, status, stability, domain)
2. **Header & Footer Governance** - 5 footer variants per category, eliminate duplicate/conflicting footers
3. **Badge & Status System** - Apply consistency badges, status labels, stability indicators
4. **Category-Based Rules** - 16 document categories with per-category styling, header/footer rules
5. **References & Citations** - Validate internal reference formats and external link governance
6. **Brand Consistency** - Unified typography, spacing, heading hierarchy, and visual markers

## Integration Points

- **Upstream**: Meta Agent (content analysis and health metrics), Linting Agent (markdown format validation)
- **Downstream**: All documents in repository (every .md file is subject to branding rules)
- **Governance**: `.github/projects/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` (master spec), `config/footers.config.yaml` (footer templates), `schema/footer-config.schema.json` (validation schema)

## Use Cases & Examples

### Use Case 1: New Repository Document

A team creates a new README.md for a plugin.

**Branding Agent workflow:**

1. Detect new .md file in repository
2. Extract document purpose from filename/content
3. Assign category (e.g., "plugin-documentation")
4. Generate frontmatter template with required fields
5. Apply category-specific header/footer
6. Add stability & status badges
7. Validate references against canonical patterns
8. Commit branding updates with user approval

### Use Case 2: Broken Document Identity

Footer remediation script accidentally removes content; Branding Agent restores consistency.

**Branding Agent workflow:**

1. Detect frontmatter-only documents (missing body content)
2. Flag as inconsistent with canonical category rules
3. Alert team to potential corruption
4. Offer remediation: restore footer, validate references
5. Prevent re-occurrence with schema validation

### Use Case 3: Cross-Repository Consistency Audit

LightSpeedWP wants unified branding across all public repositories.

**Branding Agent workflow:**

1. Scan all repositories under lightspeedwp organization
2. Extract frontmatter and metadata from each
3. Generate consistency report: which repos match canonical rules?
4. Identify category-specific violations
5. Propose batch updates to enforce standard
6. Provide migration guide for team-specific variations

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Documents scattered across repositories with inconsistent metadata, footers, badges
- Stakes: Readers confused by unclear ownership, status unknown, discovery difficult

**Slide 02** - Branding Agent Role

- Enforces unified identity and governance metadata across all documents
- Maintains consistency without changing document content or author intent

**Slide 03** - The 16 Document Categories

- Documentation (README, CONTRIBUTING, DEVELOPMENT)
- Issue & PR templates (issue-template-*.md, pull-request-template-*.md)
- Instructions & guides (step-by-step, how-to, reference)
- Project & initiative materials (roadmaps, plans, status updates)
- Code & automation (scripts, workflows, configurations)
- Metrics & reporting (dashboards, audit results, health reports)

**Slide 04** - Frontmatter Standardization

- Required fields: title, description, owners, status, stability, domain
- Optional fields: version, last_updated, related_issues, tags
- Enforcement: Schema-driven validation, auto-remediation for missing fields
- Benefit: Searchable metadata, ownership clarity, status transparency

**Slide 05** - Footer Governance Model

- 5 footer variants per category (contributors, changelog, legal, acknowledgement, navigation)
- Single footer per document (prevent duplicates)
- Category-specific selection rules
- Centralized footer library (easy updates, consistent messaging)

**Slide 06** - Badge & Status System

- Stability badges: stable, beta, experimental, deprecated
- Status badges: active, archived, in-progress, planned
- Ownership badges: team/person responsible
- Consistency: All docs clearly show these signals

**Slide 07** - Branding Rules by Category

- Plugin documentation: Plugin header + CHANGELOG footer + install badge
- Instructions: Numbered headers + step numbers + success badge
- Project roadmaps: Milestone headers + status timeline + adoption footer
- Show 2-3 examples with before/after screenshots

**Slide 08** - References & Citation Governance

- Internal reference format: `[text](path/to/file.md)` (relative or repository-root)
- External links: Governed by `.lycheeignore` whitelist
- Validation: Broken link detection, reference count metrics
- Enforcement: CI gate fails if internal references break

**Slide 09** - Typography & Visual Consistency

- Heading hierarchy: H1 = title, H2 = sections, H3 = subsections
- Spacing rules: Blank lines around headings, lists, code blocks
- Code examples: Language-tagged blocks with syntax highlighting
- Visual markers: Icons, badges, color-coded callouts

**Slide 10** - Integration with Meta Agent

- Meta Agent scans repository health (staleness, coverage, errors)
- Branding Agent applies governance (frontmatter, footers, badges)
- Feedback: Health report drives branding updates (e.g., mark stale docs)

**Slide 11** - Integration with Linting Agent

- Linting Agent enforces markdown syntax (no bare URLs, heading spacing)
- Branding Agent enforces governance layer (metadata, categorization)
- Both run in pre-commit: syntax first, then governance

**Slide 12** - Adoption & Rollout

- Phase 1: Establish master spec (category taxonomy, footer rules, schema)
- Phase 2: Audit existing documents and generate remediation plan
- Phase 3: Apply governance updates with user review
- Phase 4: Enforce in CI (block PRs without proper frontmatter)

**Slide 13** - Metrics & Health

- Frontmatter completeness: % of docs with all required fields
- Footer accuracy: % of docs with single, correct footer per category
- Badge coverage: % of docs with status and stability badges
- Reference health: % of internal references that resolve
- Category alignment: % of docs matching their assigned category rules

**Slide 14** - Lessons & Challenges (optional)

- Lesson: Centralized footer library prevents drift
- Challenge: Large repositories need careful batch remediation
- Lesson: Category taxonomy must be stable (changes break rules)

**Slide 15** - Roadmap & Vision (optional)

- Current: 16 document categories, 5 footer variants, frontmatter schema
- Near-term: Cross-repository branding audit & harmonization
- Future: Automated content recommendations based on category

**Slide 16** - Close & Next Actions

- Branding Agent enforces consistency while respecting author autonomy
- Contribute: Follow frontmatter rules for new documents
- Questions & feedback

## Evidence Anchors

- `.github/projects/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` - Master specification (1,100+ lines)
- `config/footers.config.yaml` - Footer templates for 16 categories
- `schema/footer-config.schema.json` - JSON Schema validation rules
- `.github/scripts/validate-footers.js` - Remediation automation script
- `.github/FOOTER_REMEDIATION_GUIDE.md` - User guide for remediation
- `CLAUDE.md` - Governance rules (references field prohibition, frontmatter requirements)
- `.github/labels.yml` - Status and stability badge label definitions

## Design Notes

- **Visual theme**: Governance & consistency (shields, checkmarks, organized filing cabinets)
- **Color palette**: Use governance/compliance colors from brand guide
- **Key visuals**: Frontmatter template example, footer variant gallery, badge showcase, category taxonomy diagram
- **Accessibility**: High contrast for badges and status indicators; alt text for all taxonomy diagrams
- **Animations**: Consider category-highlight reveal, before/after footer comparison

## Quality Bar

- Distinguish "implemented now" vs "roadmap"
- Flag which document categories are fully compliant vs. in-progress
- Include confidence levels for branding impact estimates
- Validate examples against actual repository documents
- Ensure all evidence references point to current develop branch
