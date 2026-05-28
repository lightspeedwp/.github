---
title: "NotebookLM Deep Research Prompt"
description: "Prompt for NotebookLM to analyse the talk direction using only lightspeedwp/.github files and this wceu-2026 asset pack."
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# NotebookLM Deep Research Prompt

Copy and paste the prompt below into NotebookLM after adding only allowed sources.

## Allowed sources

Use only files from this repository (`lightspeedwp/.github`) plus files under `wceu-2026/`.

Do not use web links, external repos, or prior memory.

## Prompt

You are a research editor preparing a conference mini-site and speaker pack.

Objective:
Produce a deeply researched, evidence-backed content set for a 25-minute WordCamp Europe talk that explains the evolution of `lightspeedwp/.github` from a central governance repo into installable plugin packs for AI coding tools.

Critical constraints:

1. Only use evidence from files in `lightspeedwp/.github`.
2. Every claim must map to one or more repository files.
3. Flag any claim that cannot be supported by repository evidence.
4. Keep recommendations practical for WordPress agencies and product teams.
5. Include explicit acknowledgement that `github/awesome-copilot` was inspirational.

Deliverables:

1. A refined narrative arc with 3 act structure for 25 minutes.
2. Slide-by-slide evidence table (20 slides):
   - slide objective
   - key message
   - supporting repository files
   - risky or weak claims to avoid
3. A mini-site content map:
   - homepage (talk summary)
   - problem page
   - architecture page
   - plugin-pack pivot page
   - outcomes page
   - adoption playbook page
4. A source-backed FAQ (minimum 15 questions).
5. A "myths vs reality" section about `.github` inheritance and governance limits.
6. A speaker notes section with:
   - likely audience objections
   - concise responses grounded in repo evidence
   - one practical example for agency owners
   - one practical example for senior engineers
7. A repository-safe references section listing only internal file paths.

Output format:

- Start with an executive summary.
- Then provide the six deliverables in order.
- Use bullet points and short sections.
- Include confidence level (high/medium/low) per major claim.

Quality bar:

- Prefer direct evidence over interpretation.
- Distinguish "implemented now" vs "roadmap/in progress".
- Make trade-offs explicit (control vs flexibility, standardisation vs autonomy).
