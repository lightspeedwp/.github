---
title: "Documentation Standards & Governance Slide Deck Prompt"
description: "NotebookLM and design prompt for docs consistency and quality"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Documentation Standards & Governance Slide Deck Prompt

## System Overview

The **Documentation Standards & Governance System** enforces unified documentation quality across the repository. It establishes 16 document categories, enforces frontmatter requirements, manages footer systems, validates references, and ensures WCAG accessibility compliance.

**Operational scope**: Document category taxonomy, metadata standardization, footer governance, reference validation, accessibility enforcement.

**Owned by**: LightSpeed product & ops teams

## Key Components

1. **Category Taxonomy** - 16 document types with distinct governance rules
2. **Frontmatter Schema** - Required fields (title, description, owners, status, stability, domain)
3. **Footer System** - 5 footer variants per category, centralized templates
4. **Reference Governance** - Internal links validated, external links whitelisted
5. **Accessibility Standards** - WCAG AA compliance, alt text, link descriptions
6. **Enforcement** - CI gates, pre-commit hooks, automated remediation

## Integration Points

- **Branding Agent**: Applies metadata and footer rules
- **Linting Agent**: Validates markdown syntax and formatting
- **Meta Agent**: Reports on documentation health and compliance
- **Validation System**: Checks frontmatter, links, accessibility

## Use Cases & Examples

### Use Case 1: New Plugin Documentation

Team creates documentation for new plugin; automatically governed.

**Documentation flow:**

1. Team creates README.md for plugin
2. Branding agent detects: new document in plugin folder
3. Applies frontmatter template: title, description, owners, status, stability
4. Assigns category: "plugin-documentation"
5. Applies category-specific footer (plugin changelog footer)
6. Adds stability badge (beta, experimental, etc.)
7. Validates references (links, installation instructions)
8. Document published with consistent format

### Use Case 2: Documentation Quality Audit

Quarterly review; identify documentation needing updates.

**Audit flow:**

1. Meta agent scans all .md files
2. Checks: frontmatter completeness, footer accuracy, badge coverage
3. Validates: all internal links resolve, external links accessible
4. Accessibility check: alt text present, link descriptions clear
5. Freshness check: last_updated recent (< 6 months)
6. Generates report: which docs need attention
7. Creates issues for remediation

### Use Case 3: Cross-Repository Consistency

Enforce standards across all LightSpeedWP repositories.

**Consistency flow:**

1. Branding agent scans multiple repos
2. Compares each to canonical standards
3. Identifies gaps: missing fields, wrong categories, inconsistent footers
4. Generates remediation plan: priority-ordered updates
5. Proposes batch updates with user review
6. Applies approved changes

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Documentation scattered, inconsistent metadata, unclear ownership
- Stakes: Readers confused by unclear status/owners, discovery difficult, quality unmeasured

**Slide 02** - Documentation System Overview

- 16 document categories with distinct rules
- Unified frontmatter schema (required fields)
- Centralized footer templates (5 per category)
- Reference validation and link checking
- Accessibility compliance (WCAG AA)

**Slide 03** - The 16 Document Categories

- **Core**: README, CONTRIBUTING, DEVELOPMENT
- **Project**: ROADMAP, CHARTER, STATUS_REPORT
- **Instructions**: GETTING_STARTED, SETUP_GUIDE, ARCHITECTURE
- **Policy**: SECURITY, PRIVACY, CODE_OF_CONDUCT
- **Automation**: WORKFLOW_REFERENCE, SCRIPT_GUIDE
- **Planning**: SPRINT_PLAN, RELEASE_PLAN
- Each category has specific governance rules

**Slide 04** - Frontmatter Standardization

- **Required fields**: title, description, owners, status, stability, domain
- **Optional fields**: version, last_updated, related_issues, tags
- **Format**: YAML frontmatter at top of .md file
- **Benefits**: searchable metadata, ownership clarity, status visibility
- **Enforcement**: CI gate fails if required fields missing

**Slide 05** - Footer System & Governance

- **5 footer variants per category**:
  1. Contributors - Lists contributors and maintainers
  2. Changelog - Links to related changelog
  3. Legal - Copyright, license, terms
  4. Acknowledgements - Thanks and credits
  5. Navigation - Links to related docs
- **Single footer per document** - Prevents duplicates
- **Centralized templates** - Easy updates, consistent messaging

**Slide 06** - Status & Stability Badges

- **Status badges**: active, archived, in-progress, planned, deprecated
- **Stability badges**: stable, beta, experimental, alpha
- **Ownership badge**: team/person responsible
- **Applied automatically** by branding agent
- **Visibility**: status immediately clear to readers

**Slide 07** - Category-Specific Rules

- **Plugin documentation**: Plugin header + CHANGELOG footer + install badge
- **Instructions**: Numbered headers + step numbers + success badge
- **Project roadmaps**: Milestone headers + status timeline + adoption footer
- **Security docs**: Confidentiality notice + escalation procedures + legal footer
- Examples with before/after screenshots

**Slide 08** - Reference & Citation Governance

- **Internal references**: `[text](path/to/file.md)` format
- **External links**: Must be in `.lycheeignore` whitelist
- **Link validation**: Broken link detection runs automatically
- **Reporting**: Reference count metrics, broken link alerts
- **Enforcement**: CI gate fails if internal links break

**Slide 09** - Accessibility Standards (WCAG AA)

- **Alt text**: All images must have descriptive alt text
- **Link descriptions**: Links must have clear anchor text
- **Heading hierarchy**: H1 = title, H2+ = sections (no skips)
- **Color contrast**: Text must have sufficient contrast
- **Lists & tables**: Proper semantic structure
- **Validation**: Automated checks during CI

**Slide 10** - Typography & Visual Consistency

- **Heading hierarchy**: H1 = document title, H2 = sections, H3 = subsections
- **Spacing**: Blank lines around headings, lists, code blocks
- **Code examples**: Language-tagged blocks (```js,```bash, etc.)
- **Lists**: Consistent bullet/number formatting
- **Tables**: Proper alignment and headers

**Slide 11** - Integration with Agents

- **Branding Agent**: Applies governance (metadata, footers, badges)
- **Linting Agent**: Validates markdown syntax (no bare URLs, spacing)
- **Meta Agent**: Reports health (freshness, coverage, errors)
- **Reviewer Agent**: Reviews documentation quality (clarity, completeness)
- All agents coordinate: syntax first, then governance, then quality

**Slide 12** - Compliance Metrics

- **Frontmatter completeness**: % of docs with all required fields
- **Footer accuracy**: % of docs with correct footer per category
- **Badge coverage**: % of docs with status and stability badges
- **Reference health**: % of internal links that resolve
- **Accessibility**: % of docs meeting WCAG AA standard
- **Freshness**: % of docs with recent last_updated

**Slide 13** - Enforcement & Rollout

- **Phase 1**: Establish master spec (categories, fields, schema)
- **Phase 2**: Audit existing docs, generate remediation plan
- **Phase 3**: Apply governance updates with user review
- **Phase 4**: Enforce in CI (block PRs without proper metadata)
- **Phase 5**: Monitor compliance, adjust rules based on feedback

**Slide 14** - Best Practices

- Use documentation templates for new documents
- Update last_updated when modifying docs
- Include clear alt text for all images
- Link to related documentation in footers
- Keep documentation DRY (Don't Repeat Yourself)
- Test links locally before committing

**Slide 15** - Close & Next Actions

- Documentation standards ensure consistency and accessibility
- Contribute: Follow frontmatter rules for new documents
- Questions & feedback

## Evidence Anchors

- `.github/projects/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` - Master specification
- `config/footers.config.yaml` - Footer templates
- `schema/footer-config.schema.json` - Validation schema
- `.github/scripts/validate-footers.js` - Footer validation
- `CLAUDE.md` - Governance rules
- `.github/labels.yml` - Status and stability badges

## Design Notes

- **Visual theme**: Governance and consistency (shields, checkmarks, organized filing)
- **Color palette**: Use governance colors (blues, greens, organized layout)
- **Key visuals**: Category taxonomy diagram, frontmatter example, footer variant gallery, badge showcase
- **Accessibility**: High contrast for badges; alt text for all diagrams
- **Animations**: Consider category highlight reveal, before/after comparison

## Quality Bar

- Show actual frontmatter examples from repository
- Include real footer templates
- Validate against actual category taxonomy
- Show accessibility compliance examples
- Ensure all evidence references point to current develop branch
