---
title: "Talk Outline (25 Minutes)"
description: "Speaker outline for WCEU 2026: from central .github governance repo to installable AI-ops plugin packs."
created_date: "2026-05-28"
file_type: documentation
last_updated: "2026-05-29"
---

# WCEU 2026: Talk Outline (25 Minutes)

**Title**: "One .github repo to rule them all: From central governance to installable AI-Ops plugins"
**Speaker**: Ash Shaw (LightSpeed)
**Audience**: WordPress agency owners, product teams, senior engineers
**Duration**: 25 minutes (20 slides content + 3-4 min Q&A buffer)
**Key Story**: Problem → Architecture Solution → Pivot to Plugins → Real Outcomes → Adoption Path

---

## Talk Structure (by slides)

### Slides 1–2: Hook & Introduction (2 min)

**Slide 1: Title Slide**

- Title: "One .github repo to rule them all"
- Subtitle: "From central governance to installable AI-Ops plugins"
- Speaker: Ash Shaw, LightSpeed
- Design: Bold, dark theme, high-impact typography
- Hook: Establish that GitHub governance is critical at scale but creates silos

**Slide 2: Speaker Intro**

- Photo + brief bio (Ash Shaw, LightSpeed founder, WordPress contributor)
- Personal angle: "I've built systems to scale .github governance across 50+ repos"

### Slides 3–6: The Problem (3 min)

**Slide 3: The Problem — Governance Boundaries**

- Diagram: Single .github repo as bottleneck
- Pain points: Inflexibility, maintenance burden, no tool inheritance
- Key stat: "Centralized governance works for small teams, breaks at scale"

**Slide 4: The Inheritance Boundary**

- Diagram: Repository A (.github) ↔ Repository B (plugin) with red dashed boundary
- Constraint: GitHub's `.github/` inheritance only works within one repo
- Challenge: Plugin repositories can't automatically inherit rules
- Question raised: "How do we break down this boundary?"

**Slide 5: Why Copying Rules Fails**

- Anti-pattern: Manual duplication of governance rules in each repo
- Problems: Drift, maintenance overhead, inconsistency
- Real example: Label names diverge, issue templates become stale
- Key insight: "We needed a source of truth that plugin repos could import"

**Slide 6: Why We Pivoted from "Control Plane" to "Plugin Model"**

- Context: LightSpeed originally built a control-plane approach
- Limitation: Control plane was read-only, teams needed ownership
- Realization: "We needed modularity, not just centralization"
- The pivot: "Let's make the .github repo a plugin pack"

### Slides 7–12: The Architecture Solution (5 min)

**Slide 7: Control Plane Architecture**

- Diagram: Hub-and-spoke model
- Central node: `.github` repository (source of truth)
- Spokes: Plugin repositories (agents/, skills/, plugins/)
- Data flow: Plugins import rules, assets, and metadata from .github

**Slide 8: Canonical Governance Assets**

- Table: What lives in the control plane
  - `.github/labels.yml` → Issue labeling
  - `.github/workflows/` → CI/CD patterns
  - `instructions/` → Coding standards
  - `agents/` → Agent specifications
  - `schema/` → Data validation
  - `hooks/` → Pre-commit enforcement
- Key: "Everything is documented, versioned, and auditable"

**Slide 9: The Plugin Manifest**

- YAML file that describes: metadata, hooks, workflows, instructions
- Example snippet: Plugin manifest for "labeling-agent"
- Key concept: "Plugins declare what they need; the .github repo provides it"

**Slide 10: Multi-Platform Plugin Parity**

- Challenge: Plugin rules must work across different platforms (WordPress, CI/CD, CLI)
- Solution: Abstraction layer (hooks, instructions, schemas)
- Example: Same labeling rules work in GitHub Actions, Copilot, local CLI
- Benefit: "Write once, use everywhere"

**Slide 11: Quality & Release Gates**

- Validation: All plugins must validate against schema
- Testing: CI/CD gates before plugin installation
- Approval: Human review for governance changes
- Version control: Semantic versioning for plugin releases
- Key: "Quality assurance is built into the model"

**Slide 12: Metrics & Governance Outcomes**

- Real data from LightSpeed deployment:
  - 80% reduction in labeling time (automated)
  - 50+ repositories on unified governance
  - 25 active plugins, all versioned
  - Zero drift in label definitions (schema validation)
- Stat: "Governance at scale = compliance + speed"

### Slides 13–18: Real-World Implementation (8 min)

**Slide 13: The Labeling Agent**

- Problem solved: Manual issue labeling takes hours per week
- Solution: AI-driven labeling (Copilot + custom agent)
- Implementation: Rules from .github/labels.yml + intelligence
- Outcome: "Consistent labels, less human overhead"
- Demo/screenshot: Label suggestions in real GitHub issue

**Slide 14: The Release Agent**

- Problem: Release coordination across multiple repos is error-prone
- Solution: Automated release workflow (triggered by label)
- Flow: PR tagged "release-ready" → agent validates → creates release → publishes
- Outcome: "Releases go from hours to minutes"

**Slide 15: Plugin Architecture in Action**

- Case study: Adding a new plugin (e.g., security-scanner)
- Steps: (1) Define plugin manifest, (2) Write rules, (3) Test against schema, (4) Deploy
- Key: "New plugins inherit standards immediately, no manual setup"
- Scalability: "Same process whether deploying to 5 or 500 repos"

**Slide 16: Governance Across the Organization**

- How the control plane scales: One team owns .github, all teams own their plugins
- Customization example: Different project types use different label subsets
- Benefit: "Centralized governance + distributed ownership"

**Slide 17: Challenges We Hit**

- Challenge 1: Adoption friction (teams didn't trust centralized rules)
  - Solution: Made opt-in, with clear benefits documentation
- Challenge 2: Schema drift (plugins used old manifest versions)
  - Solution: Validation CI/CD gates, auto-upgrade helpers
- Challenge 3: Performance (large number of repos slow to govern)
  - Solution: Caching, parallel validation, lazy-loading rules

**Slide 18: Key Lessons**

- Lesson 1: "Governance must be modular, not monolithic"
- Lesson 2: "Provide tools/automation, not just rules"
- Lesson 3: "Measure outcomes; justify the overhead"
- Lesson 4: "Invest in schema validation early"

### Slides 19–24: Adoption & Outcomes (4 min)

**Slide 19: Why This Matters for WordPress**

- WordPress ecosystem problem: Theme/plugin compatibility is hard
- LightSpeed approach: Standardize governance like WordPress standardizes code standards
- Parallel: "Just as WordPress has Coding Standards, GitHub repos need Governance Standards"
- Vision: "WordPress plugins could declare dependencies on governance rules"

**Slide 20: Plugin Pack Capabilities**

- Labeling agents (Copilot)
- Release automation
- Accessibility audits
- Documentation generation
- Metrics collection
- Security scanning
- Custom workflows (team-specific)
- Future: "Extensible to any repository type"

**Slide 21: Getting Started**

- Step 1: Fork the LightSpeed `.github` repo
- Step 2: Review `INSTALLATION_GUIDE.md`
- Step 3: Customize `plugin-manifest.yml` for your setup
- Step 4: Run validation, deploy to one test repo
- Step 5: Expand to more repos once comfortable
- Resource: "Full documentation + examples in the repository"

**Slide 22: Questions & Discussion**

- CTA: "Try it out, tell us what breaks"
- Feedback channels: GitHub issues, Slack community
- Next steps: Roadmap for Phase 2 features

### Slide 23–24: Closing & Call-to-Action (1 min)

**Slide 23: Vision**

- "GitHub automation is no longer bespoke; it's modular and reusable"
- "Governance scales with your organization, not against it"
- "AI agents make governance intelligent, not just enforced"

**Slide 24: Call-to-Action + Closing**

- CTA 1: "Explore the LightSpeed `.github` repo"
- CTA 2: "Join the community; help us build the next generation of governance tooling"
- CTA 3: "Share your use cases — we want to hear how you're governing at scale"
- Closing: "Questions?"
- Contact: Email, GitHub, Slack (provide handles)

---

## Timing Breakdown

| Section | Slides | Duration |
|---------|--------|----------|
| Hook & Intro | 1–2 | 2 min |
| Problem Statement | 3–6 | 3 min |
| Architecture Solution | 7–12 | 5 min |
| Real-World Implementation | 13–18 | 8 min |
| Adoption & Outcomes | 19–22 | 4 min |
| Closing & CTA | 23–24 | 1 min |
| **Total** | **24 slides** | **~23 min** |
| Q&A Buffer | — | ~2–3 min |

---

## Key Statistics & Examples

- **50+ repositories** on unified governance
- **80% reduction** in manual labeling time
- **25 active plugins**, all versioned and validated
- **Zero governance drift** (enforced by schema validation)
- **Deployment time**: Release goes from hours to minutes

---

## Design & Accessibility Notes

- **Colour**: Dark theme (#1a1a1a background, #00d4ff accents)
- **Typography**: Sans-serif (Inter, Poppins), 28pt+ body text
- **Contrast**: All text ≥4.5:1 ratio (WCAG AAA)
- **Animations**: Subtle transitions, no flashing (accessibility-safe)
- **Diagrams**: Mermaid or hand-drawn, with alt-text descriptions
- **Footers**: WordCamp Europe 2026, slide numbers, consistent branding

---

## Resources Referenced

- `wceu-2026/SLIDES_GENERATION_PROMPT.md` — Detailed slide-by-slide generation guide
- `wceu-2026/notebooklm/sources-index.md` — ~60 source URLs for NotebookLM briefing
- `wceu-2026/references/glossary.md` — 45+ definitions
- `wceu-2026/SPEAKER_NOTES_TEMPLATE.md` — Template for detailed speaker notes
- `docs/AUTOMATION_GOVERNANCE.md` — Governance architecture deep-dive
- `plugins/README.md` — Plugin system documentation

---

## Next Steps (Phase 2–3)

1. **Phase 2 (May 30)**: Ash runs NotebookLM to generate speaker notes + foundation slides
2. **Phase 3 (May 31)**: Ash builds complete Google Slides deck with NotebookLM output + design
3. **May 31 EOD**: Slides locked, ready for final review and rehearsal
