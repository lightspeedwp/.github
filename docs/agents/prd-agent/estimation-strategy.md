---
title: Estimation Strategy
description: How to structure PRDs for accurate work breakdown and team estimates
created: 2026-09-17
---

# PRD Estimation Strategy

This guide explains how to structure PRDs so that engineering teams can accurately estimate effort and break work into tasks.

## Overview

**The goal**: A PRD structured so that engineering can estimate effort (story points, days, or other unit) with high confidence and break the work into tasks that can be estimated, assigned, and completed.

**Key insight**: Poor PRD structure → vague estimates → schedule slips. Good PRD structure → confident estimates → predictable delivery.

## Estimation Fundamentals

### What Makes a Requirement Estimable?

A requirement is estimable when an engineer can answer:

- What exactly needs to be built?
- How will I know it's done?
- What dependencies exist? (other systems, data, APIs)
- What are the edge cases and error scenarios?
- Any non-obvious constraints? (performance, compliance, integration)

### What Makes a Requirement NOT Estimable?

- **Vague scope**: "Build a dashboard" vs. "Build a dashboard with 5 KPIs, filters for date range and segment"
- **Unclear acceptance**: "Make it user-friendly" vs. "All actions complete within 2 clicks, using existing design system"
- **Hidden dependencies**: No mention of required integrations, APIs, or third-party systems
- **Unknown constraints**: No mention of performance targets, data volume limits, compliance requirements
- **Fuzzy edges**: No clear definition of MVP vs. phase 2

## PRD Structure for Estimation

### Level 1: Feature Scope

Start by defining what's in scope and what isn't.

```
# Feature: Automated Design Spec Generator

## What We're Building
- Auto-generate Figma design specs from PRDs
- Specs include colors, typography, spacing, and component definitions
- Engineers can iterate on specs in Figma after generation

## What We're NOT Building (v1)
- Mobile design specs
- Animation/interaction specs
- Real-time collaboration on specs
- Support for custom design tokens
```

**Why this helps estimation**:

- Engineering knows hard boundaries
- No scope creep during estimation
- Clear go/no-go decisions for phase 2 features

### Level 2: User Stories with Acceptance Criteria

Each user story should be small enough to estimate (not > 13 story points) and have clear acceptance criteria.

```
User Story: Generate design specs from a PRD

As a Design Lead, I want to generate design specs from a PRD with one click,
so that I can hand off to developers 2 days faster.

Acceptance Criteria:
1. [Input] User opens a PRD in the UI
2. [Action] User clicks "Generate Specs" button
3. [Output] System processes PRD and outputs a Figma file within 2 minutes
4. [Content] Generated specs include:
   - Color palette (extracted from PRD mention of brand colors)
   - Typography (headings, body text, with font families and sizes)
   - Spacing/layout grid (inferred from PRD layout descriptions)
   - Component list (buttons, forms, cards, etc. mentioned in PRD)
5. [Validation] Generated specs match PRD requirements (manual review by design lead)
6. [Error handling] If spec generation fails, user sees error message with suggested fixes (e.g., "PRD missing color definition; please add to PRD and retry")
```

**Why this helps estimation**:

- Each acceptance criterion is a testable unit of work
- Engineering can estimate each criterion independently
- QA knows exactly what to test

### Level 3: Requirements Breakdown

For complex features, break requirements into categories:

#### Functional Requirements (What it does)

```
## Functional Requirements

### PRD Parsing
- FR-01: Extract text from PRD (must handle Markdown and plaintext)
- FR-02: Identify brand colors mentioned in PRD (keyword matching)
- FR-03: Identify typography definitions (font family, size, weight)
- FR-04: Parse user roles/personas and map to design patterns
- FR-05: Generate list of UI components needed (from acceptance criteria)

### Spec Generation
- FR-06: Create Figma file with extracted colors
- FR-07: Create Figma typography styles from extracted definitions
- FR-08: Create Figma component library from component list
- FR-09: Apply styles to components
- FR-10: Generate page layout with components (if PRD specifies page structure)

### Error Handling
- FR-11: Detect missing required fields (e.g., no color definition) → return error with remediation steps
- FR-12: Log all spec generations for audit trail
```

**Why this helps estimation**:

- Each FR is a discrete feature that can be estimated
- Engineering can identify dependencies (FR-07 depends on FR-03)
- Can prioritize (FR-01 and FR-06 are critical path; FR-10 is nice-to-have)

#### Non-Functional Requirements (How well it works)

```
## Non-Functional Requirements

### Performance
- NFR-01: Spec generation completes within 2 minutes for a typical 5-page PRD
- NFR-02: API call to Figma responds within 5 seconds (including file creation)
- NFR-03: UI remains responsive during file generation (show progress bar)

### Scalability
- NFR-04: Support 100 concurrent spec generations
- NFR-05: Figma file size < 10 MB (to avoid slowdowns)

### Reliability
- NFR-06: 99% success rate for spec generation (1 in 100 fails gracefully)
- NFR-07: If Figma API is unavailable, gracefully fail and suggest retry

### Compliance & Security
- NFR-08: User data (PRDs, generated specs) encrypted at rest
- NFR-09: Audit log all spec generations (user, timestamp, PRD, output)
- NFR-10: Comply with GDPR: delete user's data within 30 days of account deletion

### Accessibility & UX
- NFR-11: All UI elements keyboard-navigable
- NFR-12: Error messages are clear and actionable ("Missing color definition in section 'Brand'. Add a line like: 'Primary color: #0066CC'"
```

**Why this helps estimation**:

- Engineering can identify if NFRs are achievable with proposed architecture
- Can break NFRs into engineering tasks ("Add monitoring for Figma API response time")
- Prevents "oh, we need to add caching" mid-project

### Level 4: Dependency & Integration Map

Identify what needs to exist before this work can start:

```
## Dependencies

### Required Before Development
- [Design System v2.1] (finalized color palette, typography tokens)
- [Figma API documentation] (confirm v2.0 endpoints for file creation, component library)
- [User authentication system] (so we can log spec generations to user)

### Integration Points
- [Figma API] (create file, add components)
- [User authentication] (log user who generated specs)
- [Database] (store metadata: user, PRD, generated file, timestamp, status)

### Optional Integrations (Phase 2)
- [Linear integration] (auto-create design tasks from components)
- [Slack notification] (notify design team when specs are ready)
```

**Why this helps estimation**:

- Engineering can identify blockers ("Can't start if design system isn't finalized")
- Can parallelize work ("Auth system and Figma API integration can happen in parallel")
- Can timeline dependencies ("PRD parsing can start now; Figma integration must wait for API access")

### Level 5: Effort Estimation Guide

After detailing requirements, provide a rough estimation framework:

```
## Effort Estimation Breakdown

| Component | Estimate | Notes |
|-----------|----------|-------|
| PRD parsing (text extraction, keyword matching) | 3–5 days | May vary if PRD format is unstructured |
| Figma integration (file creation, component setup) | 5–8 days | Depends on Figma API learning curve |
| Spec generation (map PRD to Figma) | 5–7 days | Complex logic; needs iteration |
| Error handling & validation | 3–4 days | Edge cases often discovered during dev |
| Testing (unit, integration, e2e) | 4–6 days | Should be ~equal to feature dev time |
| **Total** | **20–30 days** | 1 engineer, full-time; assumes design system & Figma API access ready |

### Uncertainty Factors (may increase estimate)
- Figma API has learning curve or undocumented behavior → +3 days
- PRDs are in many different formats (not standardized) → +2 days
- Figma API rate limits hit during testing → +2 days

### Confidence Level
**Medium-high (70%)**: Requirements are clear; dependencies identified; known unknowns listed
```

**Why this helps estimation**:

- Team has a shared baseline ("20–30 days")
- Can identify if proposed timeline is realistic
- Uncertainty factors are documented (not hidden)

## Estimation Process

### Step 1: Requirements Freeze

Before estimation starts, lock down the PRD:

- All acceptance criteria finalized
- Scope is explicit (MVP vs. phase 2)
- Dependencies identified
- Stakeholder alignment confirmed

Once frozen, announce: "PRD for [Feature] is locked. Estimation begins."

### Step 2: Team Estimation

Bring in engineers who'll build it:

1. **Individual estimation**: Each engineer reads PRD, estimates independently (in story points, days, or whatever unit your team uses)
2. **Discussion**: Compare estimates; discuss disagreements
   - If estimates vary widely (e.g., 5 days vs. 15 days), that signals ambiguity in the PRD → revise the PRD and re-estimate
   - If estimates are close (e.g., 8 days vs. 10 days), you're done
3. **Final estimate**: Agree on one estimate as a team

### Step 3: Capacity Planning

Once you have an estimate:

- How many engineers? How long will each task take?
- When can work start? (Any blockers?)
- What's the critical path? (What must happen first?)
- What can be parallelized?

**Example**:

```
Estimate: 20–30 days (1 engineer)

Team capacity: 3 engineers available

Proposed plan:
- Week 1: 2 engineers on PRD parsing + Figma integration (parallel)
- Week 1–2: 1 engineer on spec generation logic
- Week 2: 1 engineer on testing
- Total: 2–2.5 weeks with 2–3 engineers

Alternative plan (if we need to ship faster):
- Week 1: 3 engineers (spec parsing + Figma + spec generation, all parallel)
- Week 2: 2 engineers (testing, polish)
- Total: 1.5 weeks with 3 engineers (but higher risk of rework)
```

### Step 4: Risk Assessment

Identify estimation risks:

```
Risk: "Figma API is more complex than estimated" → +5 days
Risk: "PRD parsing needs custom logic for edge cases" → +3 days
Risk: "Integration testing uncovers rework" → +4 days

Contingency buffer: +10 days (33% of base estimate)

Final timeline: 20–30 days base + 10 days buffer = 30–40 days
```

## Red Flags: When a PRD Is NOT Estimable

If you encounter any of these, the PRD is not ready for estimation:

- [ ] **Unclear scope**: "Build a better workflow" (unclear what "better" means)
- [ ] **Vague acceptance criteria**: "User can manage settings" (not verifiable)
- [ ] **Hidden dependencies**: No mention of integrations or third-party systems needed
- [ ] **Uncertain constraints**: No clear performance, scalability, or compliance requirements
- [ ] **Conflicting requirements**: "< 1 second load time" AND "process 1M records"
- [ ] **Stakeholder misalignment**: Team disagrees on what "done" looks like
- [ ] **Estimated spread too wide**: 5-day estimate vs. 20-day estimate (signal: PRD is ambiguous)

**What to do**: Revise the PRD with the team until it passes the estimability checklist. Then re-estimate.

## Estimation Anti-Patterns

| Anti-Pattern | Why It's Bad | Better Approach |
|---|---|---|
| "5 days to build, 1 day to test" | Testing takes as long as building; plan accordingly | "5 days build, 4 days test" |
| Estimate padding ("It's 3 days, but I'll say 5") | Hidden padding means you can't forecast accurately | Be honest about estimate; identify risks explicitly |
| Single engineer estimates without team discussion | Hidden assumptions; team may spot issues | Team estimation; discuss disagreements |
| No contingency buffer | Every project runs late | Add 25–30% buffer for unknowns |
| "We'll optimize later" (NFRs ignored in estimate) | Performance work is discovered mid-project | Include NFR work in estimate upfront |

---

**Last Updated**: 2026-09-17  
**Estimation Goal**: High-confidence effort forecasts that reduce schedule surprises  
**Questions?** See [FAQ](./faq.md)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
