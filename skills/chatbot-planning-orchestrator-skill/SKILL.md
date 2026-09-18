---
name: wordpress-plugin-packaging-review
description: Evidence-led technical and commercial due diligence for WordPress plugins, especially AI, chatbot, automation, ecommerce, and agency-delivered service plugins. Use when Codex needs to inspect a WordPress plugin's repo, WordPress.org listing, vendor pages, official docs, add-ons, and operational risks to determine what it can actually do today, what is free vs Pro vs add-on, what is code-confirmed vs docs-backed vs marketing-backed, and how it should be packaged, gated, upsold, or excluded from a client offer.
---

# WordPress Plugin Packaging Review

## Overview

Perform code-aware commercial due diligence on a WordPress plugin before recommending it in a client package, managed service, or internal delivery playbook.

Prioritise what is real, supportable, governable, and commercially usable over generic feature summaries.

## Core approach

Anchor the review in five questions:

1. What can the plugin actually do today?
2. Which capabilities matter for the target service or workflow?
3. Which claims are code-confirmed, doc-confirmed, commercially claimed, or inferred?
4. What should be packaged as standard, gated behind discovery, sold as an upsell, or excluded?
5. What technical, governance, privacy, support, content, and operational prerequisites exist before recommending it?

## Inputs

Start with the strongest available artifacts and treat them in this order:

1. User-supplied brief, source list, package model, or target questions
2. Uploaded reports, notes, audits, or prior recommendations
3. Official plugin repository and WordPress.org listing
4. Vendor product pages, pricing pages, and add-on pages
5. Official documentation
6. Public issue trackers, tutorials, and dependency documentation

If the user provides a research brief or an existing report, treat it as a governing artifact. Extract the required questions, deliverables, and scope limits before adding new research.

State important assumptions explicitly whenever business context is missing.

## Workflow

### 1. Frame the review

Define the commercial context before diving into feature detail:

- Identify the plugin, vendor, current public version, and review date
- Identify the buyer or delivery context: agency, MSP, in-house team, publisher, ecommerce operator, or enterprise team
- Identify the target outcome: packaging decision, implementation due diligence, competitor comparison, or launch-readiness review
- Identify the most important use cases
- List open assumptions that could change the recommendation

If the user has not defined the commercial context, infer a conservative one and label it as an assumption.

### 2. Build the source map

Review sources in layers instead of relying on one surface:

- `WordPress.org`: active installs, ratings, version, changelog, support patterns
- `GitHub` or public repo: architecture, extension points, code-backed evidence, release clues
- `Vendor product pages`: positioning, plan structure, add-ons, pricing claims
- `Official docs`: setup, operational guidance, hidden constraints, implementation details
- `Tutorials and ecosystem pages`: rough edges, dependencies, setup burden, troubleshooting clues
- `Dependency docs`: costs, API constraints, hosting implications, external system requirements

Create a source coverage log. Mark duplicates instead of counting them twice.

When facts may have changed recently, verify them from live sources instead of relying on memory.

### 3. Inspect the codebase first

Treat the public repository as a product, not a brochure.

At minimum:

- Inspect the repo root and note the overall structure
- Read `README`, `readme.txt`, and the main plugin bootstrap file
- Inspect major implementation directories such as `app/`, `classes/`, `common/`, `constants/`, `themes/`, and any `modules/`, `admin/`, or `assets/` trees
- Inspect any architecture notes such as `CLAUDE.md`, `STUDY-*.md`, or internal design notes that are shipped publicly

Look specifically for evidence of:

- Frontend and admin entry points
- Chatbot, assistant, form, or widget modules
- Provider and engine abstractions
- REST endpoints and AJAX handlers
- Hooks, filters, shortcodes, blocks, and extension APIs
- Query, memory, conversation, transcript, or reply models
- File handling, uploads, storage, moderation, rate limits, analytics, or usage tracking
- Knowledge, embeddings, search, or vector-store integrations
- Function-calling, tool-calling, MCP, agent, or automation surfaces
- Theme, UI, popup, and customisation support
- Separation between free, Pro, premium, or add-on code
- Experimental features or architectural tension called out by the maintainers

Use fast code search to build evidence. Prefer precise references over sweeping claims.

### 4. Separate evidence types

Never collapse all sources into one undifferentiated summary.

Label important findings with one of these evidence classes:

- `Code-confirmed`: visible in the public repository
- `Docs-confirmed`: clearly described in official documentation
- `Commercially claimed`: stated on product or pricing pages
- `Tutorial-backed`: shown in tutorials or ecosystem guidance
- `Inference`: your conclusion based on the combined evidence

Use the phrase `documented/commercially claimed but not code-confirmed from public repo` whenever the public repo does not visibly support a marketed capability.

If the public repo appears to cover only the free tier or core plugin, say so plainly.

### 5. Judge delivery relevance

Evaluate each meaningful capability across commercial delivery criteria, not just technical novelty:

- User value
- Relevance to the target service
- Delivery complexity
- Configuration burden
- Ongoing support burden
- Dependency risk
- Governance risk
- Content readiness requirements
- Cost exposure

Distinguish between features that sound impressive and features that repeatedly improve real delivery outcomes.

### 6. Assess technical and operational reality

Make launch prerequisites explicit.

Check for:

- Hosting or PHP requirements
- WordPress REST availability
- Caching, CDN, WAF, or auth conflicts
- Cron, email, or webhook dependencies
- External API keys and cost controls
- Logging, transcript access, and troubleshooting visibility
- Staging and rollback needs
- Plugin conflicts and live-site fragility

Do not recommend a plugin as launch-ready if those prerequisites are undefined.

### 7. Assess governance and safety

Treat automation, external actions, and sensitive data as review-gated by default.

Check for:

- Moderation features and topic boundaries
- Human handoff or escalation pathways
- Privacy and retention controls
- File-storage and upload handling
- Customer data exposure
- Role-based access or admin-only actions
- Snippet, code execution, or callable action surfaces
- MCP, bearer token, or system-control capabilities

State clearly what the plugin can help with and what must still be governed by human process, policy, or contract language.

### 8. Turn findings into package decisions

Convert the review into packaging guidance, not just research.

Classify capabilities as:

- `Standard package`
- `Advanced package`
- `Optional add-on`
- `Discovery-gated`
- `Internal-only`
- `Exclude from fixed-scope offer`

For each recommendation, state the reason, prerequisites, and likely support burden.

## AI and chatbot plugin focus

When the plugin includes AI or chatbot capabilities, always cover these areas explicitly:

- Chatbot setup, placement, themes, and UX controls
- System instructions, prompts, and contextual grounding
- Conversation memory, discussions, transcript review, and history model
- Realtime, voice, or streaming features
- File upload, image, and multimodal handling
- Function-calling, action execution, or code hooks
- Lead capture, forms, or visitor qualification
- Ecommerce support, product discovery, or order-help features
- Knowledge, embeddings, RAG, or vector-store options
- Web search or freshness features
- Notifications, human awareness, or escalation triggers
- Moderation, restricted topics, and behavioural boundaries
- Link handling, citation, grounding, or content parsing
- MCP or agent workflow implications

## Output requirements

Produce a structured review that is easy to use in delivery and commercial planning.

Default to this shape unless the user asks for another format:

### 1. Executive Summary

Summarise:

- What the plugin is strongest at
- Where it is risky, easy to oversell, or hard to support
- Whether it is suitable for packaging at all

### 2. Source Coverage Log

List every reviewed source in a table with:

- Source
- Type
- Reviewed
- Notes
- Confidence contribution

Flag duplicates explicitly.

### 3. Capability Map

Build a matrix with these columns:

- Capability
- What it does
- Free / Pro / Add-on
- Source evidence
- Code-confirmed
- Relevance
- Delivery complexity
- Ongoing support burden
- Package recommendation

### 4. Delivery Findings

Cover implementation reality, not just features:

- What matters most for the target offer
- What prerequisites the client must meet
- What delivery traps or hidden costs exist
- What needs discovery before commitment

### 5. Governance and Safety Findings

Explain:

- What can be safely delegated
- What needs approval or human review
- What data, privacy, or operational controls are still needed

### 6. Package Recommendation

Translate the review into a commercial recommendation:

- Standard offer
- Advanced offer
- Optional upsells
- Retainer or optimisation layer
- Features to exclude from fixed scope

### 7. Open Questions and Next Steps

List the gaps that materially affect the recommendation and the fastest way to close them.

## Writing rules

Use professional, plain language.

Prefer UK English unless the user asks for another house style.

Separate facts, vendor claims, and your inference.

Do not overstate private or unverified features.

Do not hide uncertainties. Make them commercially useful.

Prefer tables and matrices when comparing capabilities or tiers.

Use citations whenever the output depends on live sources.

## Stop and escalate

Pause and surface a review gate when any of these conditions apply:

- The plugin's most important features appear to live in private code you cannot inspect
- Legal, medical, financial, pricing, or security-sensitive actions are being delegated without clear review controls
- Production-changing actions are exposed through MCP, callable functions, or admin automation
- The plugin depends on external services with unclear pricing or data handling
- The client's hosting, caching, or security stack is likely to block the plugin's core workflow
- The content corpus is too weak, stale, or unstructured for a credible chatbot or retrieval experience

When escalating, say what is known, what is missing, why it matters, and what validation step should happen next.

## Quality bar

Before finishing, confirm that the review:

- Answers the user's actual commercial question
- Distinguishes code evidence from docs and marketing
- Names the free, paid, and add-on boundaries clearly
- Flags private-code visibility gaps honestly
- Covers delivery, support, governance, and content prerequisites
- Produces package guidance rather than a generic summary
- Leaves the reader with concrete next steps

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
