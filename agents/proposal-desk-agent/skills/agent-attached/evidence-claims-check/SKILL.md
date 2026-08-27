---
name: evidence-claims-check
description: Use when the user asks to gather proof points, verify proposal statements, assess whether claims are well supported, compare strong versus weak evidence, or review a draft for unsupported, stale, or high-risk assertions before it is finalized.
---

# Evidence & Claims Check

## Overview

Use this skill when the task is to improve answer quality by finding source-backed support and separating safe claims from risky ones.

This skill is especially useful for:

- collecting reusable proof points before drafting a section
- checking an existing proposal draft for unsupported or overstated statements
- preparing a source-backed evidence pack the user can review quickly
- deciding which claims are safe to keep, soften, route for review, or remove

Use the agent's existing grounded sources first:

1. the current request artifact and attachments
2. {{label:business-context.md,id:69f8f20ea63481919b06250a71539b9d,type:file}}
3. {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}}
4. {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} when internal context would materially improve owner routing, blocker history, or evidence discovery
5. {{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}} only when ticket history or support themes materially support a proposal claim
6. {{label:Memory,id:file_persistence,type:file_persistence}} for stable source preferences or reusable review defaults

Treat {{label:rfp-response,id:hsk_69f8a30d53a8819185088e8fe016a8f3,type:skill}} as the broader drafting workflow. Use this skill when evidence quality or claim safety needs focused attention.

## When To Use This Skill

Use this skill when the user asks for any of the following outcomes:

- “find proof points” or “pull supporting evidence”
- “check whether this claim is safe to use”
- “review this draft for weak claims”
- “show me which sections need validation”
- “separate confirmed facts from assumptions”
- “find reusable prior answers and tell me how trustworthy they are”

Do not use this skill for full end-to-end proposal drafting when the main job is to produce the whole response package. In those cases, use the broader drafting workflow and call this skill only for the parts that need deeper evidence review.

## Core Workflow

1. Identify the target material.
   - Determine whether you are checking a full document, a section, a list of claims, or a request for reusable proof points.
   - If the target content is missing, ask for the exact draft, section, question set, or artifact before continuing.

2. Break the work into discrete claims or evidence needs.
   - Convert broad prose into short, testable statements.
   - Keep claims granular enough that each one can be supported, softened, routed for review, or removed independently.

3. Retrieve evidence selectively.
   - Start with the current artifact and reusable business context.
   - Search connected sources only when retrieval is likely to improve quality or confidence.
   - Prefer the minimum search needed to confirm, qualify, or reject the claim.
   - Reuse prior proposal language only after checking whether it is still relevant and properly scoped to the current request.

4. Classify each claim.
   - Use one of these labels exactly:
     - Confirmed
     - Supported but needs qualification
     - Weak support
     - Unsupported
     - High-risk claim
   - Choose the strongest honest label, not the most convenient one.

5. Explain the reason for the classification.
   - State the best supporting source or why support is missing.
   - Note whether the issue is staleness, scope mismatch, missing evidence, overstatement, or a need for specialist review.

6. Recommend the next action for each claim.
   - Keep as written
   - Soften wording
   - Replace with narrower supported wording
   - Route for review
   - Remove from draft

7. Produce a compact evidence-backed output.
   - Group results by section or topic when that helps reuse.
   - Keep source notes concise but specific enough for the user to locate the support.
   - End with the highest-priority review flags and the most important evidence gaps.

## Evidence Rules

- Prefer primary request materials and approved reusable context over casual internal discussion.
- Treat Slack as a directional source unless corroborated.
- Treat ticket history as contextual evidence, not universal proof of policy or capability.
- Do not upgrade weak evidence into a stronger classification because it sounds plausible.
- Do not preserve impressive wording if the evidence only supports a narrower claim.
- When a prior answer is useful but stale, say so and adapt it cautiously.
- When evidence conflicts, surface the conflict instead of averaging it away.

## Claim Review Heuristics

Mark a claim as **High-risk claim** when it involves any of the following without clear support:

- certifications, compliance, privacy, or security posture
- guaranteed delivery outcomes, timelines, or staffing promises
- named integrations or specialty capabilities
- enterprise scale, AI maturity, or accessibility maturity claims
- legal, contractual, or pricing commitments
- customer references or performance assertions presented as general facts

Mark a claim as **Supported but needs qualification** when the core idea is defensible but the wording is too broad, too absolute, too current-looking, or too universal for the available evidence.

Mark a claim as **Weak support** when you found partial or indirect support but not enough to safely keep the current wording.

## Output Format

Default to concise Markdown with these sections when relevant:

# Evidence And Claims Check

## Scope

## Strongest Supporting Evidence

## Claim Review

For each claim, use this structure:

- **Claim:** `<short statement>`
- **Status:** Confirmed | Supported but needs qualification | Weak support | Unsupported | High-risk claim
- **Best support:** `<source-backed summary or "No reliable support found">`
- **Risk:** <why this is safe, weak, stale, overstated, or needs review>
- **Recommended action:** Keep as written | Soften wording | Replace with narrower supported wording | Route for review | Remove from draft

## Priority Review Flags

## Reusable Proof Points

Use only the sections that help the current request. For a lightweight check, a short Claim Review list is enough.

## Success Criteria By Request Shape

### 1. Proof-point gathering

Success means:

- the results are grouped by section, question, or theme
- each proof point is clearly tied to a source
- missing evidence is called out separately from confirmed support

### 2. Draft claim review

Success means:

- the draft is broken into distinct claims worth reviewing
- each claim has a clear classification and next action
- risky claims are surfaced before the user reuses them elsewhere

### 3. Reusable answer reuse check

Success means:

- reused language is tested against the current request
- stale or over-broad language is softened or rejected
- only evidence-backed wording is recommended for carry-forward use

## Example

### Example input

“Review this draft capabilities section and tell me which statements are safe to keep, which need softening, and which need review.”

### Example output shape

# Evidence And Claims Check

## Scope

Capabilities section review for a proposal draft.

## Claim Review

- **Claim:** We have deep experience delivering accessible custom WordPress platforms.
- **Status:** Supported but needs qualification
- **Best support:** Business context supports custom WordPress delivery and accessibility-aware implementation, but does not by itself prove depth across all platform types.
- **Risk:** The idea is directionally supported, but “deep experience” is broader than the current evidence set.
- **Recommended action:** Replace with narrower supported wording

- **Claim:** We maintain SOC 2-aligned delivery processes.
- **Status:** High-risk claim
- **Best support:** No reliable support found.
- **Risk:** This is a security/compliance statement and should not be used without explicit validation.
- **Recommended action:** Route for review

## Priority Review Flags

- Security and compliance wording needs explicit validation before reuse.
- Capability claims are safer when tied to WordPress delivery, UX, accessibility, performance, and governance rather than broad enterprise language.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
