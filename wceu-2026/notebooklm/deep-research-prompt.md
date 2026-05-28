---
title: "NotebookLM Deep Research Prompt"
description: "Prompt for NotebookLM to analyse the talk direction using only lightspeedwp/.github files and this wceu-2026 asset pack."
file_type: "documentation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
tags: ["wceu-2026", "notebooklm", "research", "prompt"]
---

# NotebookLM Deep Research Prompt

## Context

Analyse this talk direction for WordCamp Europe 2026 on evolving the LightSpeed `.github` repository into an installable AI-ops and governance plugin platform. Focus on coherence, narrative arc, technical accuracy, and audience engagement for a 25-minute conference talk.

## Source Materials (APPROVED ONLY)

### Foundation Architecture

- [Repository README](https://github.com/lightspeedwp/.github/blob/develop/README.md)
- [AGENTS.md](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md)
- [CLAUDE.md](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md)

### Governance & Standards

- [Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md)
- [Automation Governance](https://github.com/lightspeedwp/.github/blob/develop/.github/AUTOMATION_GOVERNANCE.md)

### Plugin Pack Architecture

- [Plugins README](https://github.com/lightspeedwp/.github/blob/develop/plugins/README.md)
- [Plugin Manifest](https://github.com/lightspeedwp/.github/blob/develop/plugins/PLUGIN_MANIFEST.json)

### Documentation

- [Plugin Pack Roadmap](https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_PACK_ROADMAP.md)
- [Plugin Installation Guide](https://github.com/lightspeedwp/.github/blob/develop/docs/PLUGIN_INSTALLATION_GUIDE.md)

### Talk Assets

- [Talk Outline (25 min)](https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/talk-outline-25min.md)
- [Slides Directory](https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/slides/)
- [Repository Source Index](https://github.com/lightspeedwp/.github/blob/develop/wceu-2026/references/repo-source-index.md)

## Analysis Goals

1. **Narrative Coherence**: Does the talk flow logically from problem → solution → implementation → outcomes?
2. **Technical Accuracy**: Are claims about plugin architecture, governance model, and AI ops aligned with actual implementation?
3. **Audience Fit**: Does the 25-minute format work for WordCamp attendees (mix of plugin devs, agency leads, tech decision-makers)?
4. **Key Messages**: What are the 3-5 core takeaways? Are they reinforced throughout?
5. **Call to Action**: Is there a clear next step (adoption path, repo link, questions)?

## Constraints

- **Source Restriction**: Use ONLY the approved GitHub URLs above and files in this `/wceu-2026/` directory.
- **No External Links**: Do not reference external sites, blogs, or non-approved documentation.
- **Repo State**: Assume the repository state as of 2026-05-28 (develop branch).
- **Talk Duration**: 25 minutes + Q&A; estimate ~15 min talking, ~10 min slides/demos.

## Output Format

Provide:

1. **Strengths** (3-5 points) — what works well in the talk narrative
2. **Risks** (2-3 points) — gaps, unclear sections, timing concerns
3. **Recommended Changes** (prioritised by impact):
   - **High priority** — must fix before the talk
   - **Medium priority** — nice to have, improves clarity
   - **Low priority** — polish/refinement
