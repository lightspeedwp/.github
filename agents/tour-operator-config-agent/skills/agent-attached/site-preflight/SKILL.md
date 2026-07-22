---
name: site-preflight
description: Inspect a connected WordPress site before deeper audit or implementation work. Use when the request needs a baseline WordPress site preflight, environment summary, plugin-stack snapshot, confirmed-facts register, assumption tracking, or clean routing into Gravity Forms, Yoast, accessibility, or Tour Operator specialist workflows.
---

# Site Preflight

## Overview

Use this skill to ground the next step in verified site evidence before giving deeper recommendations or routing into a narrower workflow.

This skill is for the first-pass inspection of the connected WordPress site, not for broad implementation. Start with reads, capture the baseline, separate confirmed facts from assumptions, then route to the best-fit specialist skill only when the evidence supports that route.

Use {{label:SD-Dev-Site,id:asdk_app_6a464e6c24b08191b5488222af5ee04f,type:app}} as the default WordPress target unless the user clearly names a different connected site.

## Use This Skill When

Use this skill when the user asks to:

- inspect or assess the connected WordPress site before deeper work
- establish a baseline for WordPress configuration, plugin stack, content model, or launch readiness
- gather evidence before making recommendations
- determine which specialist workflow should handle the next phase
- explain what is known, what is inferred, and what still needs verification

Do not use this skill for standalone deep work that is already clearly scoped to one specialist area, such as a pure Gravity Forms configuration task, a pure Yoast SEO task, a pure accessibility task, or a narrowly defined Tour Operator plugin-structure review. In those cases, route directly to the relevant attached skill.

## Preflight Goals

Produce a concise baseline that covers:

1. site target and reachability
2. WordPress environment snapshot
3. theme and active plugin snapshot
4. key WordPress settings that influence structure or launch readiness
5. observable content-model signals
6. confirmed facts versus assumptions
7. the best next workflow or specialist skill

## Read-First Workflow

Follow this order unless the user explicitly narrows the scope.

1. Confirm the target site.
   - Default to {{label:SD-Dev-Site,id:asdk_app_6a464e6c24b08191b5488222af5ee04f,type:app}}.
   - If another connected WordPress site is clearly named, use that instead.
   - If no usable WordPress connection is available, stop and say the preflight could not verify the site directly.

2. Verify the connection and collect a minimal environment baseline.
   - Check that the site responds.
   - Capture the observable site identity when available.
   - Capture WordPress version and other readily visible environment signals.

3. Capture the active build surface.
   - Identify the active theme.
   - List active plugins.
   - Call out the presence of Tour Operator plugins, Gravity Forms, Yoast SEO, accessibility tooling, caching/security layers, and any other clearly relevant plugins.

4. Check foundational WordPress settings when available.
   - Site title and tagline
   - Admin email when visible
   - Timezone and language when visible
   - Homepage and posts-page configuration when visible
   - Search-engine visibility posture when visible
   - Permalink or related structure signals when observable

5. Capture content-structure signals.
   - Identify available post types and taxonomies when supported.
   - Call out whether `tour`, `destination`, `accommodation`, or related entities are confirmed by site evidence.
   - Distinguish core WordPress content from Tour Operator plugin content.

6. Create an evidence register.
   - Mark each meaningful statement as one of:
     - `Confirmed`
     - `Assumption`
     - `Not verified`
   - Treat read results as `Confirmed` only when the site evidence directly supports them.
   - If something is likely but not directly supported, mark it as `Assumption`.
   - If the needed check was unavailable, mark it as `Not verified`.

7. Route to the next workflow.
   - If the request is primarily about Gravity Forms planning, auditing, setup, troubleshooting, validation, or handoff, route to {{label:gravity-forms-configuration,id:6a464c3b63e081918a32dcaec679b5dc,type:skill}}.
   - If the request is primarily about Yoast SEO configuration, audit, rendered SEO output, sitemap readiness, metadata templates, or launch SEO, route to {{label:yoast-configuration,id:6a46e1db9158819194f9e81117afe60a,type:skill}} or {{label:wordpress-yoast-seo-auditor,id:6a43cc76e8408191ac88a70871c7a93d,type:skill}} when a narrower Yoast audit is the better fit.
   - If the request is primarily about accessibility evidence, remediation planning, or supported accessibility fixes, route to {{label:wordpress-accessibility-checker,id:6a438df2fd588191a22017ca4047e069,type:skill}}.
   - If the request is about Tour Operator CPTs, taxonomies, fields, relationships, extension boundaries, or plugin-stack coherence, route to {{label:tour-operator-plugin-stack,id:hsk_6a46390350e48191b3f020bde38c6808,type:skill}}.
   - If the evidence does not yet justify a specialist route, stay in main audit or discovery behaviour and say what must be checked next.

## Output Contract

When this skill is used, return these sections in this order:

### Preflight Summary

Give a short paragraph stating:

- which site was inspected
- what was successfully verified
- the main preflight takeaway

### Baseline Evidence

Use short bullets for the most relevant verified baseline facts, such as:

- site identity
- environment signals
- active theme
- active plugins or plugin groups
- foundational settings
- content-model signals

### Confirmed Facts

List only facts directly supported by observed site evidence.

### Assumptions And Not Yet Verified

Split this section into:

- `Assumptions`
- `Not verified`

Do not merge these categories.

### Recommended Next Route

Name the best next workflow.

- If routing to a specialist skill, state which skill should handle the next phase and why.
- If not routing yet, state the next read or decision needed.

### Immediate Next Checks

List the smallest useful next checks or actions, prioritised from most important to least important.

## Decision Rules

- Prefer a smaller, verified baseline over a larger speculative one.
- Do not guess plugin purpose, content architecture, or launch readiness from names alone when direct checks are available.
- Do not present assumptions as findings.
- Do not jump into writes or configuration edits from this skill unless the user explicitly asked for implementation work and the requested action is already clear.
- If the site appears to be a Tour Operator build, still separate confirmed Tour Operator evidence from project assumptions before routing.
- If multiple specialist skills could apply, choose the narrowest one that matches the user's actual next task.

## Example Trigger Shapes

- “Inspect the connected site and tell me what we’re working with before we change anything.”
- “Run a WordPress preflight first, then tell me whether this should go into the Gravity Forms or Yoast workflow.”
- “Check the connected site, capture the baseline evidence, and separate what’s confirmed from what still needs verifying.”

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
