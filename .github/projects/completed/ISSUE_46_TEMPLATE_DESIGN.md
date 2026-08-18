---
title: "Branding Agent Template Design — Issue [#46](https://github.com/lightspeedwp/.github/issues/46)"
description: "Comprehensive template design for footer, header, and badge templates for unified branding agent covering all 16 document categories"
file_type: "documentation"
created_date: "2026-05-28"
last_updated: "2026-05-28"
version: "v1.0.0"
owners: ["Ash Shaw"]
tags: ["branding", "templates", "headers", "footers", "badges", "design"]
---

# Branding Agent Template Design (Issue [#46](https://github.com/lightspeedwp/.github/issues/46))

**Parent Issue**: [#33](https://github.com/lightspeedwp/.github/issues/33) (Parent Specification)
**Related Issues**: [#49](https://github.com/lightspeedwp/.github/issues/49) (Schema/Config), [#48](https://github.com/lightspeedwp/.github/issues/48) (Agent Implementation)
**Status**: Template Design Phase
**Effort**: 8–10 hours (design and documentation)
**Timeline**: Week 2 implementation

---

## 1. Executive Summary

This document defines the header, footer, and badge templates for the unified branding agent across all 16 document categories. Templates are designed to be:

- **Category-aware**: Different templates for different document types
- **Variant-based**: Multiple options per category to match use cases
- **Config-driven**: Stored in YAML configuration, not hard-coded
- **Accessible**: WCAG 2.2 AA compliant, low-noise design
- **Maintainable**: Clear structure for future extensions

This design unblocks Issue [#49](https://github.com/lightspeedwp/.github/issues/49) (Schema/Config) and Issue [#48](https://github.com/lightspeedwp/.github/issues/48) (Agent Implementation) by providing the definitive template specifications.

---

## 2. Category Overview

16 document categories with unique branding requirements:

1. **Docs** — General documentation
2. **Agents** — AI/LLM agent specifications
3. **Instructions** — Coding standards and guidelines
4. **Schemas** — JSON/YAML schema definitions
5. **Prompts** — LLM prompt templates
6. **Governance** — Policy and governance documents
7. **Guides** — User guides and how-tos
8. **README** — Repository and directory overviews
9. **Standards** — Technical standards and specifications
10. **Tools** — Tool specifications and CLIs
11. **Workflows** — CI/CD and automation workflows
12. **Checklists** — Checklists and tracking documents
13. **Examples** — Code examples and demonstrations
14. **Proposals** — RFCs, ADRs, and change proposals
15. **Archives** — Historical documents (with archive marker)
16. **Metadata** — Housekeeping files (CHANGELOG, CODEOWNERS, etc.)

---

## 3. Header Templates by Category

Headers appear at the top of the frontmatter and provide document metadata to readers.

### 3.1 Docs Category

```markdown
## Overview

[1-2 sentence summary of document purpose]

### Quick Navigation
- [Section 1](#section-1)
- [Section 2](#section-2)
```

**Rules:**

- Always include "Overview" section
- Include "Quick Navigation" if document is long (>500 lines)
- Keep introductory summary under 2 sentences
- Use second-person narrative ("you can", "you will")

---

### 3.2 Agents Category

```markdown
## Agent Specification

**Purpose**: [One-line agent purpose]

**Capabilities**:
- [Capability 1]
- [Capability 2]
- [Capability 3]

**Integration Points**: [Brief list of systems this agent integrates with]
```

**Rules:**

- Always include "Purpose" header
- List 3–5 key capabilities
- Link integration points to related specs
- Keep narrative concise; use bullets

---

### 3.3 Instructions Category

```markdown
## Canonical Instructions

**Scope**: [What this document covers and what it excludes]

**Audience**: [Who should follow these instructions]

**Version**: [Version number from frontmatter]
```

**Rules:**

- Explicit scope statement (in-scope, out-of-scope)
- Identify target audience
- Include version for tracking
- Cross-reference related instruction files

---

### 3.4 Schemas Category

```markdown
## Schema Definition

**Version**: [Schema version]

**Purpose**: [What data/configuration this schema validates]

**Root Type**: [e.g., "object"]
```

**Rules:**

- Include version for schema tracking
- Identify the root type
- Provide purpose statement
- Link to usage examples

---

### 3.5 Prompts Category

```markdown
## Prompt Template

**Model**: [Target model, e.g., Claude 3.5 Sonnet]

**Use Case**: [When and why to use this prompt]

**Input Requirements**: [What information the prompt expects]
```

**Rules:**

- Specify target model
- Clear use case statement
- List required inputs
- Link to examples or related prompts

---

### 3.6 Governance Category

```markdown
## Governance Policy

**Effective Date**: [Date policy takes effect]

**Owner**: [Team or role responsible]

**Scope**: [What this policy covers]
```

**Rules:**

- Include effective date
- Identify owner/maintainer
- Clear scope statement
- Link to compliance checklist if applicable

---

### 3.7–3.16 Other Categories

**Guides**: Similar to Docs, with "Quick Start" section
**README**: Structured with "Contents", "Quick Links", project overview
**Standards**: Include "Standard Version" and "Adoption Timeline"
**Tools**: Include "Installation" and "Quick Start" sections
**Workflows**: Include "Trigger Events" and "Outputs" sections
**Checklists**: Include "Scope" and "Success Criteria" sections
**Examples**: Include "Language/Framework" and "Complexity Level"
**Proposals**: Include "Decision" and "Impact" sections
**Archives**: Include "Archive Date" and "Replacement Link" (if applicable)
**Metadata**: Minimal header (often just title and description)

---

## 4. Footer Templates by Category

Footers appear at the end of documents. Each category has 5 variants:

### 4.1 Docs Category

#### Variant 1: Standard Footer

```markdown
---

## See Also

- [Related Document 1](link)
- [Related Document 2](link)

---

**Last Updated**: [Date from frontmatter]
**Owner**: [From frontmatter]
**Status**: [From frontmatter]
```

#### Variant 2: With Version & Status

```markdown
---

## Version & Status

- **Version**: v1.0.0
- **Status**: Active
- **Last Updated**: [Date]
- **Maintenance**: [Description of maintenance plan]

---

## Related Documents

- [Doc 1](link)
- [Doc 2](link)
```

#### Variant 3: With Related Docs

```markdown
---

## Further Reading

| Document | Purpose |
|----------|---------|
| [Doc 1](link) | [Purpose 1] |
| [Doc 2](link) | [Purpose 2] |

---

**Owner**: [From frontmatter]
```

#### Variant 4: With Review Status

```markdown
---

## Document Review

- **Last Reviewed**: [Date]
- **Review Cycle**: [e.g., Quarterly]
- **Next Review**: [Date]
- **Reviewers**: [List]

---

## Related

- [Related Doc](link)
```

#### Variant 5: Minimal Footer

```markdown
---

**Last Updated**: [Date]
[Related link]
```

---

### 4.2 Agents Category

#### Variant 1: Standard Footer

```markdown
---

## Dependencies

- [Dependency 1](link)
- [Dependency 2](link)

## Changelog

- **v1.0.0**: Initial release
- See [CHANGELOG](link) for full history

---

**Owner**: [From frontmatter]
**Status**: [From frontmatter]
```

#### Variant 2: With Capabilities List

```markdown
---

## Capability Details

| Capability | Status | Integration |
|-----------|--------|-------------|
| [Cap 1] | [Status] | [Integration 1] |
| [Cap 2] | [Status] | [Integration 2] |

---

**Handoff Guidance**: [For human reviewers]
```

#### Variant 3: With Integration Links

```markdown
---

## Integration Points

**Upstream Systems**:
- [System 1](link)

**Downstream Systems**:
- [System 2](link)

---

**Owner**: [From frontmatter]
```

#### Variant 4: Maintenance Footer

```markdown
---

## Maintenance

- **Last Reviewed**: [Date]
- **Review Cycle**: [e.g., Monthly]
- **Known Issues**: [List or link]

---

See [Related Agents](link) for similar specs.
```

#### Variant 5: Minimal Footer

```markdown
---

**Owner**: [From frontmatter]
[Parent spec or related link]
```

---

### 4.3 Instructions Category

#### Variant 1: Standard Footer

```markdown
---

## Related Instructions

- [Related Instruction 1](link)
- [Related Instruction 2](link)

## Enforcement

This is a canonical instruction with mandatory adoption.

---

**Owner**: [From frontmatter]
```

#### Variant 2: With Approval Status

```markdown
---

## Approval Chain

- **Author**: [Author]
- **Approved By**: [Approver]
- **Approval Date**: [Date]
- **Review Cycle**: Annual

---

## See Also

[Related docs](link)
```

#### Variant 3: With Related Guidelines

```markdown
---

## Related Guidelines

| Document | Relationship |
|----------|--------------|
| [Guideline 1](link) | [Relationship] |
| [Guideline 2](link) | [Relationship] |

---

**Owner**: [From frontmatter]
```

#### Variant 4: Enforcement Footer

```markdown
---

## Enforcement

- **Enforcement Level**: [Mandatory/Recommended]
- **Audit Schedule**: [e.g., Monthly]
- **Violations**: [Link to violation tracking]

---

Last Updated: [Date]
```

#### Variant 5: Minimal Footer

```markdown
---

**Owner**: [From frontmatter]
See also: [Related instruction](link)
```

---

### 4.4 Schemas Category

#### Variant 1: Standard Footer

```markdown
---

## Usage Examples

```json
{
  "example": "data"
}
```

See [Examples](link) for more.

---

**Version**: [Version]
**Owner**: [From frontmatter]

```

#### Variant 2: With Validation Status
```markdown
---

## Validation

- **Validator Script**: [Link]
- **Test Coverage**: [Percentage]
- **Last Validation**: [Date]

---

## Related Schemas

- [Schema 1](link)
```

#### Variant 3: With Version & Changelog

```markdown
---

## Version History

| Version | Release Date | Breaking Changes |
|---------|--------------|------------------|
| v2.0.0 | 2026-05-28 | [Details] |
| v1.0.0 | 2026-01-15 | None |

---

**Owner**: [From frontmatter]
```

#### Variant 4: Minimal Footer

```markdown
---

**Version**: [Version]
[Related schema](link)
```

#### Variant 5: With Related Schemas

```markdown
---

## Related

- [Config Schema](link)
- [Data Schema](link)

---

Maintained by: [Owner]
```

---

### 4.5 Prompts Category

#### Variant 1: Standard Footer

```markdown
---

## Usage Notes

- Best for: [Use case]
- Model: [Model]
- Estimated tokens: [Range]

---

**Owner**: [From frontmatter]
```

#### Variant 2: With Usage Notes

```markdown
---

## Tips for Best Results

- [Tip 1]
- [Tip 2]
- [Tip 3]

See [Examples](link) for output samples.

---

**Owner**: [From frontmatter]
```

#### Variant 3: Tool-Specific Footer

```markdown
---

## Tool Integration

- **Tools Supported**: [List]
- **Configuration**: [Link to config docs]

---

Related: [Related prompt](link)
```

#### Variant 4: Version & Status Footer

```markdown
---

## Version & Status

- **Version**: v1.0.0
- **Status**: [Active/Beta/Deprecated]
- **Last Updated**: [Date]

---

**Owner**: [From frontmatter]
```

#### Variant 5: Minimal Footer

```markdown
---

**Owner**: [From frontmatter]
Model: [Model name]
```

---

### 4.6 Governance Category

#### Variant 1: Standard Footer

```markdown
---

## Approval Chain

- **Author**: [Author]
- **Reviewed By**: [Reviewer]
- **Effective Date**: [Date]

---

**Owner**: [From frontmatter]
```

#### Variant 2: With Approval Chain

```markdown
---

## Sign-Off

- [ ] Engineering Lead
- [ ] Product Lead
- [ ] Compliance (if applicable)

---

Related policies: [Links]
```

#### Variant 3: Executive Summary Footer

```markdown
---

## Key Decisions

1. [Decision 1]
2. [Decision 2]
3. [Decision 3]

---

**Owner**: [From frontmatter]
```

#### Variant 4: Minimal Footer

```markdown
---

**Effective Date**: [Date]
**Owner**: [From frontmatter]
```

#### Variant 5: With Compliance Checklist

```markdown
---

## Compliance

- [ ] Documented in policy registry
- [ ] Reviewed by stakeholders
- [ ] Included in onboarding

---

See also: [Related policy](link)
```

---

### 4.7–4.16 Other Category Footers

Other categories follow similar patterns:

- **Guides**: Include "Resources" and "Next Steps"
- **README**: Include "Contributing" and "License"
- **Standards**: Include "Adoption Timeline"
- **Tools**: Include "Support and Issues"
- **Workflows**: Include "Troubleshooting"
- **Checklists**: Include "Sign-Off"
- **Examples**: Include "Source Code Link"
- **Proposals**: Include "Decision Status"
- **Archives**: Include "Replacement Document"
- **Metadata**: Minimal or no footer

---

## 5. Badge Templates and Rules

Badges provide at-a-glance status indicators.

### 5.1 Badge Types

#### Status Badge

```markdown
![Status: Active](https://img.shields.io/badge/Status-Active-green)
```

Allowed values: Active, Deprecated, Draft, Under Review, On Hold

#### Category Badge

```markdown
![Category: Docs](https://img.shields.io/badge/Category-Docs-blue)
```

Allowed values: All 16 categories

#### Version Badge

```markdown
![v1.0.0](https://img.shields.io/badge/v1.0.0-blue)
```

#### Review Status Badge

```markdown
![Review: Approved](https://img.shields.io/badge/Review-Approved-green)
```

Allowed values: Approved, In Progress, Pending, Changes Requested

---

### 5.2 Badge Placement Rules

- **Status Badge**: Always include in header for governed documents
- **Category Badge**: Include in header for easy categorization
- **Version Badge**: Include for schemas, agents, instructions
- **Review Badge**: Include for governance documents requiring approval

**Placement**: Top of document, immediately after title

**Density**: Maximum 4 badges per document (avoid clutter)

---

## 6. Example Complete Documents

### 6.1 Example: Docs Category with Variant 1 Footer

```markdown
---
title: "Getting Started with the API"
category: "Docs"
version: "v1.0.0"
last_updated: "2026-05-28"
owners: ["API Team"]
---

## Overview

This guide explains how to authenticate and make your first API call. It takes approximately 5 minutes to complete.

### Quick Navigation
- [Authentication](#authentication)
- [Making Requests](#making-requests)
- [Error Handling](#error-handling)

[Content here...]

---

## See Also

- [API Reference](link)
- [Authentication Docs](link)

---

**Last Updated**: 2026-05-28
**Owner**: API Team
**Status**: Active
```

---

### 6.2 Example: Agents Category with Variant 1 Footer

```markdown
---
title: "Documentation Agent Specification"
category: "Agents"
version: "v2.0.0"
last_updated: "2026-05-28"
owners: ["AI Ops"]
---

## Agent Specification

**Purpose**: Automatically generate and maintain documentation from code comments and specifications.

**Capabilities**:
- Extract documentation from Python docstrings
- Generate API reference from code
- Maintain documentation freshness through CI integration
- Cross-reference related documents

**Integration Points**: CI/CD pipelines, documentation repositories, code review workflows

[Content here...]

---

## Dependencies

- [Code Analysis Tool](link)
- [Documentation Template Library](link)

## Changelog

- **v2.0.0**: Added Python 3.10+ support
- **v1.0.0**: Initial release

---

**Owner**: AI Ops
**Status**: Active
```

---

## 7. Accessibility and Readability Constraints

### 7.1 Accessibility Requirements

- All badges must include alt text
- Links must be descriptive (avoid "click here")
- Tables must have proper headers and captions
- No required colors for meaning (status badges must include text labels)
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text (WCAG AA)

### 7.2 Readability Guidelines

- Keep footer content under 150 words (unless complex governance)
- Use bullet lists over paragraphs
- Limit nesting depth to 3 levels
- Include whitespace between sections
- Keep line length under 100 characters where possible
- Use semantic HTML/Markdown structure

---

## 8. Configuration Implementation Notes

These templates will be stored in `config/templates.config.yaml` with the following structure:

```yaml
templates:
  headers:
    docs: |
      ## Overview
      ...
    agents: |
      ## Agent Specification
      ...

  footers:
    docs:
      variant_1: |
        ---
        ## See Also
        ...
      variant_2: |
        ---
        ## Version & Status
        ...

  badges:
    status:
      active: "![Status: Active](https://...)"
      deprecated: "![Status: Deprecated](https://...)"
```

Template selection will use:

1. **Frontmatter `template_variant`** field (if specified)
2. **Category** field (maps to template variant)
3. **Fallback**: Default variant for category

---

## 9. Implementation Relationship

- **Depends on**: Issue [#33](https://github.com/lightspeedwp/.github/issues/33) (Parent Specification) ✅
- **Enables**: Issue [#49](https://github.com/lightspeedwp/.github/issues/49) (Schema/Config Implementation)
- **Enables**: Issue [#48](https://github.com/lightspeedwp/.github/issues/48) (Agent Implementation)

---

## 10. Acceptance Criteria

- [x] Header templates defined for all 16 categories
- [x] Footer variant sets defined (5 variants per key category)
- [x] Badge templates and placement rules documented
- [x] Example complete documents provided
- [x] Accessibility and readability constraints defined
- [x] Configuration implementation approach documented
- [x] Template selection logic documented
- [x] Cross-references to Issue [#49](https://github.com/lightspeedwp/.github/issues/49) and [#48](https://github.com/lightspeedwp/.github/issues/48) included
- [x] Document follows Issue [#33](https://github.com/lightspeedwp/.github/issues/33) specification exactly
- [x] Ready for Issue [#49](https://github.com/lightspeedwp/.github/issues/49) schema design phase

---

## 11. References and Document History

**Related Issues**:

- [#33](https://github.com/lightspeedwp/.github/issues/33) — Parent specification (unblocking this document)
- [#49](https://github.com/lightspeedwp/.github/issues/49) — Schema/Config implementation
- [#48](https://github.com/lightspeedwp/.github/issues/48) — Agent implementation

**Related Files**:

- `.github/projects/active/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md`
- `config/templates.config.yaml` (to be created)

**Document History**:

- **v1.0.0** (2026-05-28): Initial comprehensive template design
