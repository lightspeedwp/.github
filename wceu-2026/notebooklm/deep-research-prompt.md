---
title: "NotebookLM Deep Research Prompt"
description: "Comprehensive prompt for NotebookLM to analyse the WCEU 2026 talk direction using only approved internal sources from lightspeedwp/.github repository with explicit develop-branch URLs"
created_date: "2026-05-28"
file_type: documentation
---

# NotebookLM Deep Research Prompt: WCEU 2026 Talk Analysis

## Purpose

Guide NotebookLM to research and synthesize the narrative for the WCEU 2026 talk: **"From Governance Silo to Installable Plugins: How LightSpeed Automated GitHub"**.

This prompt constrains analysis to **approved internal sources only** (all from `develop` branch) and defines the analysis direction, constraints, and expected outputs.

---

## Analysis Objectives

NotebookLM should synthesize insights across the following research questions:

1. **The Problem**: Why did LightSpeed evolve from a centralized `.github` repository to an installable plugin model?
2. **The Architecture**: What does the plugin-pack architecture look like, and how does it enable modularity and reuse?
3. **The Pivot**: What was the decision to move away from monolithic governance, and what triggered the change?
4. **The Outcomes**: What measurable benefits (adoption, consistency, maintainability) has LightSpeed achieved?
5. **The Adoption Path**: How can other organizations adopt this pattern?
6. **Key Narrative Arc**: Identify the compelling story elements that will resonate with a 25-minute conference audience (WordPress agency owners, product leaders, engineers).

---

## Canonical Source Set (Approved for NotebookLM Ingestion)

### 🔒 Source Approval Policy

**Approved sources** are **internal files from `develop` branch only**.  
**Prohibited sources** include external blogs, archived wikis, social media, or unverified tools.

All URLs below use the canonical develop-branch format:  
`https://github.com/lightspeedwp/.github/blob/develop/<path>`

### Foundation & Governance

1. **Organization README** (canonical entry point)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/README.md`
   - Content: org overview, structure, key initiatives
   - Use for: problem context, org mission

2. **AGENTS.md** (AI agents governance)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md`
   - Content: agent taxonomy, governance rules, execution model
   - Use for: AI/automation context, governance evolution

3. **CLAUDE.md** (AI coding standards & repository boundaries)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md`
   - Content: AI-ops principles, file organization, reusable assets
   - Use for: modularity and asset portability concepts

4. **CONTRIBUTING.md** (contribution guidelines)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/CONTRIBUTING.md`
   - Content: contributor workflow, standards, branching strategy
   - Use for: consistency and governance benefits

### Architecture & Design

1. **ARCHITECTURE.md** (system design documentation)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/docs/ARCHITECTURE.md`
   - Content: component interactions, design decisions, rationale
   - Use for: architectural narrative, design evolution

2. **AUTOMATION_GOVERNANCE.md** (automation strategy)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md`
   - Content: automation patterns, labeling, workflow orchestration
   - Use for: governance automation benefits

3. **PLUGIN_PACK_ROADMAP.md** (plugin-pack evolution)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_PACK_ROADMAP.md`
   - Content: plugin model rationale, roadmap phases, future direction
   - Use for: pivot story, modularity benefits, adoption pathway

### Plugin Pack & Adoption

1. **plugins/README.md** (plugin pack overview)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/plugins/README.md`
   - Content: plugin pack structure, manifest, installation, features
   - Use for: plugin model explanation, reusability, adoption story

2. **plugins/PLUGIN_MANIFEST.json** (canonical plugin definitions)
   - URL: `https://github.com/lightspeedwp/.github/blob/develop/plugins/PLUGIN_MANIFEST.json`
   - Content: plugin registry, versions, dependencies, metadata
   - Use for: concrete plugin examples, ecosystem context

3. **PLUGIN_INSTALLATION_GUIDE.md** (adoption & deployment)
    - URL: `https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_INSTALLATION_GUIDE.md`
    - Content: step-by-step adoption, configuration, validation
    - Use for: adoption pathway, getting-started narrative

### Branding & Specifications (Recent)

1. **ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md** (unified branding strategy)
    - URL: `https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md`
    - Content: 16-category taxonomy, schema/config model, delivery roadmap
    - Use for: modularity and standardization benefits, governance-as-code pattern

2. **ISSUE_46_TEMPLATE_DESIGN.md** (template standardization)
    - URL: `https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/ISSUE_46_TEMPLATE_DESIGN.md`
    - Content: header/footer templates, badge system, accessibility standards
    - Use for: consistency and scale benefits, governance automation

### Talk-Specific Assets

1. **SLIDES_GENERATION_PROMPT.md** (slide design guidance)
    - URL: `https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/SLIDES_GENERATION_PROMPT.md`
    - Content: design system, slide-by-slide guidance, visual strategy
    - Use for: talk narrative structure, key messages per slide

2. **talk-outline-25min.md** (speaker outline & timing)
    - URL: `https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/talk-outline-25min.md`
    - Content: speaker script, timing, talking points, transitions
    - Use for: narrative pacing, audience engagement, key takeaways

---

## Source Ingestion Order (Priority Sequence)

NotebookLM should ingest sources in this order to build narrative coherence:

### Priority 1: Foundation & Context (Build the Problem)

1. README.md — Org overview and mission
2. CLAUDE.md — Governance principles and file organization philosophy
3. AUTOMATION_GOVERNANCE.md — Current governance approach

→ **Output**: Clear understanding of LightSpeed's governance evolution and why centralization became a blocker.

### Priority 2: Architecture & Design (Explain the Solution)

1. PLUGIN_PACK_ROADMAP.md — Why the plugin model was chosen
2. ARCHITECTURE.md — How the plugin model is structured
3. AGENTS.md — AI/automation layer that plugins enable

→ **Output**: Clear explanation of the plugin model, modular architecture, and automation benefits.

### Priority 3: Plugin Pack & Adoption (Show the Impact)

1. plugins/README.md — Plugin pack overview and structure
2. plugins/PLUGIN_MANIFEST.json — Concrete plugin examples
3. PLUGIN_INSTALLATION_GUIDE.md — Adoption and deployment pathway
4. CONTRIBUTING.md — Contributor workflow benefits

→ **Output**: Concrete adoption narrative, measurable benefits, proof points.

### Priority 4: Recent Innovations (Demonstrate Modern Governance)

1. ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md — Modularity and standardization in action
2. ISSUE_46_TEMPLATE_DESIGN.md — Consistency at scale

→ **Output**: Modern governance patterns, reusability, and scaling benefits.

### Priority 5: Talk Assets (Refine Narrative)

1. SLIDES_GENERATION_PROMPT.md — Design guidance for visual narrative
2. talk-outline-25min.md — Speaker talking points and pacing

→ **Output**: Refined narrative arc, key messages, audience engagement strategy.

---

## Constraints & Guardrails

### ✅ Allowed Analysis

- Internal repository structure and architecture
- Governance patterns and automation benefits
- Plugin model, modularity, and reusability
- Adoption pathways and measurable outcomes
- AI/agent governance and automation
- WordPress-specific context and practices

### ❌ Prohibited Analysis

- **External sources**: Do NOT reference external blogs, Medium posts, archived wikis, or social media
- **Unverified tools**: Do NOT reference third-party tools without explicit approval
- **Speculative analysis**: Do NOT project features or timeline beyond what's documented in approved sources
- **Competitor analysis**: Do NOT compare against other organizations' approaches (stay focused on LightSpeed's story)

### 🔄 Verification Checklist Before Ingestion

Before using any source, verify:

- [ ] URL is from `develop` branch (`/blob/develop/`)
- [ ] File exists and is accessible
- [ ] Content is current (check last_updated frontmatter field)
- [ ] Content is relevant to the approved research questions above
- [ ] No external links in source contradict approved source list

---

## Analysis Output Expectations

NotebookLM should produce:

1. **Problem Statement** (2–3 paragraphs)
   - Why centralized `.github` governance is a bottleneck
   - Business and technical impact

2. **Solution Architecture** (3–4 paragraphs)
   - Plugin model structure and benefits
   - How modularity solves the problem
   - Key architectural innovations

3. **Narrative Arc** (5–7 key points)
   - Logical flow from Problem → Pivot → Solution → Adoption
   - Compelling story elements for 25-minute talk

4. **Adoption Pathway** (2–3 paragraphs)
   - How other organizations can adopt this model
   - Barriers and success factors

5. **Key Metrics & Proof Points** (bulleted list)
   - Measurable benefits (adoption rate, consistency, maintainability)
   - Concrete examples from approved sources

6. **Speaker Talking Points** (5–8 key messages)
   - What to emphasize for a conference audience
   - Audience engagement hooks

7. **Gap Analysis** (if applicable)
   - Areas where approved sources don't fully explain the narrative
   - Recommendations for additional documentation

---

## Acceptance Criteria for NotebookLM Output

The analysis is acceptable if it:

- ✅ Addresses all research questions above
- ✅ Uses only approved internal sources (develop-branch URLs only)
- ✅ Provides clear narrative arc suitable for 25-minute talk
- ✅ Identifies concrete adoption benefits and proof points
- ✅ Suggests audience engagement hooks and talking points
- ✅ Flags any gaps in source material or narrative coherence
- ✅ Is structured for easy adaptation into speaker script and slide content

---

## Next Steps After NotebookLM Analysis

1. Use NotebookLM output to refine `talk-outline-25min.md` (speaker script and timing)
2. Feed NotebookLM insights into `SLIDES_GENERATION_PROMPT.md` for slide content generation
3. Create slide-to-source mapping in `references/slide-to-source-mapping.md`
4. Document any new sources or revisions needed in approved source list

---

*This prompt last updated: 2026-05-28*
