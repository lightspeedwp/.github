---
title: "Web Search Prompt Template"
description: "Template for crafting a prompt to instruct ChatGPT to perform a web search."
last_updated: "2025-10-17"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Purpose
This template helps you formulate a web search request so that ChatGPT returns up‑to‑date, well‑sourced information.

# Paste or reference instructions
Ensure that the **Web Search Instructions** are loaded or included. This tells ChatGPT how to conduct the search and cite results.

# User input checklist
- [ ] Clearly state the question or topic.
- [ ] Specify the desired time frame (e.g. “past 30 days”, “since 2020”).
- [ ] Mention any specific locations or languages.
- [ ] Identify preferred source types (e.g. official docs, peer‑reviewed papers).
- [ ] Note any excluded domains or irrelevant sources.

# System constraints
- Keep the answer concise (e.g. ≤300 words).
- Include at least two citations from reputable sources.
- Summarise rather than quote verbatim.

# Example first message to Copilot
```
Please search the web for the latest guidance on optimising Core Web Vitals for WordPress sites in 2025. Focus on metrics like LCP, FID and CLS. Use sources from official WordPress documentation or reputable performance blogs within the last 12 months. Provide a concise summary with citations.
```

# Verification steps
- Check that the response cites recent and relevant sources.
- Ensure the summary directly addresses the query.
- Verify that any time or domain constraints were respected.
