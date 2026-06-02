---
title: "Speaker Notes Template — All 24 Slides"
description: "Pre-structured speaker notes for WCEU 2026 talk (to fill in after NotebookLM)"
created_date: "2026-05-30"
file_type: documentation
---

# Speaker Notes Template — 25-Minute Talk

**Total Talk Time**: 25 minutes
**Delivery Style**: Informative + inspiring + approachable + fun
**Audience**: 200–500 people (agencies, product teams, engineers, mixed experience)
**Format**: Theater-style presentation + Q&A after + Happiness Bar follow-up

---

## How to Use These Notes

1. **After NotebookLM briefs are ready**: Transfer content to slides 3–22
2. **Add to Google Slides**: Paste these templates into the Notes section of each slide
3. **Fill in details**: Replace `[BRACKETED SECTIONS]` with specific talking points
4. **Rehearse timing**: Adjust talking points to match your delivery pace
5. **Finalise**: Remove template brackets, polish phrasing

---

## Slide 1: Cover

```
SPEAKER NOTES:

**Timing**: 30 seconds (opening)

**Opening Delivery**:
"Good morning! I'm Ash Shaw, founder of LightSpeed. Today I want to share
something that's transformed how we think about GitHub governance at scale.
The talk is called 'One .github repo to rule them all.'"

**Key Message**:
We've discovered that a single, well-designed .github repository can be the
foundation for consistent automation and governance across an entire organization.

**Transition to Slide 2**:
"But first, let me tell you a bit about myself and why this matters to me."
```

---

## Slide 2: Speaker Introduction

```
SPEAKER NOTES:

**Timing**: 45 seconds

**Personal Context**:
"I'm Ash Shaw, founder of LightSpeed [point to photo]. I've been working with
WordPress for [X] years, contributing to core, speaking at conferences, and
most recently, obsessing over ways to scale governance without burning out teams.

I'm also [mention: designer, traveller, community builder — whatever resonates]."

**Why This Matters to Me**:
"Three years ago, we hit a wall. Managing consistency across multiple client
projects and open-source contributions became impossible. We were drowning in
manual processes: labeling issues by hand, inconsistent PR templates,
re-writing governance rules for every repository."

**Bridge to Problem Section**:
"That's when we started thinking differently about how GitHub could help us.
And that's the story I want to share with you today."

**Visual Note**: Your face + bio on screen — use this to connect personally.
```

---

## Slides 3–5: Problem Section

### Slide 3: The Challenge

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
The current state is fragmented, inconsistent, and manual. This is a problem
at scale.

**Talking Points**:
1. "If you manage 2–3 repositories, you can get away with manual processes.
   But once you hit 5, 10, 20 repositories? You need consistency."

2. "Right now, most organisations either: (a) accept chaos and inconsistency,
   or (b) hire someone to manually maintain governance. Neither scales."

3. "There's a third way: automation and inheritance. But it requires rethinking
   how we structure GitHub."

**Why Show This Slide**:
Set the problem before introducing the solution. Let the audience recognise
their own pain.

**Transition**:
"So what does this inconsistency actually cost us?"
```

### Slide 4: Pain Points

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Inconsistency drains time, energy, and morale.

**Talking Points**:
1. "Labeling issues: our teams were spending ~50 minutes per day on
   **manual labeling**. That's 250+ hours per year."

2. "Inconsistent PR templates mean reviewers spend extra time understanding
   context. Inconsistent issue types mean issues get lost."

3. "The hidden cost? Team morale. Contributors get frustrated when processes
   change between projects. New team members re-learn governance rules every time."

**Bridge**:
"We quantified the cost. Here's what we found."
```

### Slide 5: Why It Matters

```
SPEAKER NOTES:

**Timing**: 1 minute (include metric callout here)

**Key Message**:
Consistency is an investment in productivity, quality, and trust.

**Talking Points**:
1. "Our pilot: We implemented centralised governance across 2 repositories.
   Result? 80% reduction in manual labeling time. That's 200 hours saved in
   one year on two repos alone."

2. "100% consistency in issue types, PR reviews, release processes. No more
   'wait, how do we do this here?'"

3. "Most importantly: team morale improved. Developers could focus on code,
   not process."

**Metric Emphasis**:
[Show or read: "80% time savings. 100% consistency. 2 pilot repos."]

**Transition**:
"So how do we scale this? What's the architecture that makes this possible?"
```

---

## Slides 6–12: Solution Section

### Slide 6: The Solution — One .github Repo

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Centralised governance enables consistency without micromanagement.

**Talking Points**:
1. "GitHub allows organisations to have a special repository called `.github`.
   This is the control plane."

2. "Inside this repository, you define: issue templates, PR templates, labels,
   workflows, governance rules."

3. "Every repository in your organisation **automatically inherits** these
   templates and configurations. One source of truth, scaled across 50+ repos."

**Visual Note**:
Show hub-and-spoke diagram. Make the hub (.github) visually prominent.

**Transition**:
"This solves the consistency problem. But how do we make it flexible and portable?"
```

### Slide 7: The Plugin Pack System

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Governance isn't one-size-fits-all. We built a plugin system.

**Talking Points**:
1. "Different teams need different workflows. A labeling team needs different
   automation than a release team."

2. "We created a 'plugin pack' system: reusable bundles of governance logic
   that organisations can install, configure, and customize."

3. "Think of it like WordPress plugins, but for GitHub governance. Pick the
   plugins you need, install them, configure them."

**Example**:
"E.g., 'Labeling Plugin' = automated issue labeling. 'Release Plugin' =
automated release notes. Mix and match."

**Transition**:
"Now, how do plugins actually work? That's where hooks come in."
```

### Slide 8: Hooks Layer

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Hooks are the semantic abstraction layer. They say *what* automation happens,
not *how*.

**Talking Points**:
1. "A hook is a declaration: 'When issue is opened, label it based on title.'"

2. "The hook doesn't care *how* you implement labeling. You could use a
   GitHub Action, a third-party API, or a custom script."

3. "This separation of concerns (what vs. how) is key. It lets different teams
   implement automation their own way, while maintaining consistency."

**Why It Matters**:
"Decoupling means you can change the implementation without changing the plugin.
Flexibility + consistency."

**Transition**:
"Speaking of implementation, let's talk about the workflow layer."
```

### Slide 9: Workflow Layer

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Workflows are where the magic happens. This is the GitHub Actions layer.

**Talking Points**:
1. "A workflow is a YAML file that describes a series of jobs.
   Trigger: issue opened. Jobs: extract title, check schema, apply labels."

2. "Workflows live in `.github/workflows/` and run automatically when triggered."

3. "You can reuse workflow logic: same labeling logic runs across 20 repos,
   consistent every time."

**Example**:
"A single 'label-issues.yml' workflow runs on every repository. No duplication."

**Transition**:
"Templates and workflows handle the 'how.' But what about making it easy to use?"
```

### Slide 10: Template System

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Templates reduce friction. They guide users through consistent processes.

**Talking Points**:
1. "A template is a pre-filled form. When someone opens a new issue, they see
   your issue template (not a blank form)."

2. "Templates include: issue type, priority, description format, acceptance
   criteria checklist. Guided consistency."

3. "Same for PRs: PR template shows checklist (testing, documentation, accessibility)."

**Why It Matters**:
"Users don't have to *remember* the process. The template guides them. Better
data quality, less reviewer burden."

**Transition**:
"Templates + workflows + hooks = automation. But what does this actually look like in practice?"
```

### Slide 11: Automation Examples

```
SPEAKER NOTES:

**Timing**: 1–2 minutes (give concrete examples here)

**Key Message**:
Real examples from LightSpeed deployments. This is what it looks like in action.

**Talking Points**:
1. "Before: Manual labeling took 50 min/day per team member.
   After: Automated within seconds of issue creation. Team focuses on content,
   not labels."

2. "Before: Release notes written manually, often inaccurate.
   After: Generated from PR titles, commits, and labels. Accurate every time."

3. "Before: Accessibility checks performed by one expert.
   After: Automated checks run on every PR. Expert reviews only flagged items."

**Examples to Mention**:
[Reference specific examples from SLIDES_GENERATION_PROMPT.md or NotebookLM briefs]

**Impact**:
"The pattern: **What took humans 30–60 minutes now takes the agent seconds.**"

**Transition**:
"This is where AI agents come in."
```

### Slide 12: The Agent Layer

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
AI agents amplify human decisions. They handle the repetitive work, freeing
humans for the important stuff.

**Talking Points**:
1. "An agent is an AI system that can read context, make decisions, and take
   actions autonomously."

2. "Example: A labeling agent reads issue titles and descriptions, then applies
   appropriate labels. It learns from feedback."

3. "Agents aren't replacing humans. They're doing the grunt work so humans can
   focus on strategy and creativity."

**Why This Matters**:
"At scale (100+ issues per week), manual labeling is impossible. Agents make
governance scalable."

**Transition**:
"So we have hooks, workflows, templates, and agents. How do you actually
implement this?"
```

---

## Slides 13–18: Implementation Section

### Slide 13: Plugin Manifest

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
A manifest is a declarative file that describes what a plugin is, what it
depends on, and what it does.

**Talking Points**:
1. "Like a WordPress plugin header, or a package.json. Declares: name, version,
   hooks, dependencies, metadata."

2. "Someone can look at a manifest and immediately understand: What does this
   plugin do? What version is it? What does it depend on?"

3. "This enables automated validation, dependency resolution, and version
   management."

**Example**:
[Show simplified manifest structure from NotebookLM or repo]

**Transition**:
"With a manifest, we can distribute plugins. But how do repositories inherit them?"
```

### Slide 14: Repository Inheritance

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Child repositories automatically inherit configuration and templates from .github.

**Talking Points**:
1. "GitHub has a feature: if you define files in `.github/`, they're inherited
   by all repositories in the organisation."

2. "So your issue templates, PR templates, labels, and workflows are
   automatically available in every repo. No copying, no setup."

3. "Optional override: if a repo needs different rules, it can override them.
   But by default, consistency wins."

**Why It Matters**:
"Inheritance is what makes this scale. 1 definition, 50+ repos benefit. Updates
propagate automatically."

**Transition**:
"Now, how do you actually get these plugins into repositories?"
```

### Slide 15: Distribution & Installation

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Plugins are versioned, installable, and updatable. Like app stores.

**Talking Points**:
1. "Our plugin pack is stored in `.github` and versioned semantically
   (1.0.0, 1.1.0, 2.0.0, etc.)."

2. "Adoption path: Fork `.github` repo → enable plugins in your org → they
   propagate to all your repositories."

3. "You can pin a version, update incrementally, or rollback if needed. Full
   control."

**Example**:
"Org A installs v1.0 (stable). Org B installs v2.0 (latest). Both can coexist,
no conflicts."

**Transition**:
"But adoption doesn't happen overnight. How do you roll this out at scale?"
```

### Slide 16: Adoption Path

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Start small (pilot repos), gather feedback, scale organisation-wide.

**Talking Points**:
1. "Don't implement across 50 repos on day one. Pick 2–3 pilot repos, test
   assumptions, iterate."

2. "Gather feedback from pilots. What worked? What slowed people down? Refine."

3. "Once pilots are successful, roll out organisation-wide. Phased, tested,
   de-risked."

**Our Experience**:
"We piloted on 2 repos, collected feedback, and then scaled to 20+. Each wave
informed the next."

**Transition**:
"At scale, how do you enforce standards without becoming the governance police?"
```

### Slide 17: Governance at Scale

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Enforce standards through automation, not micromanagement. Transparency is key.

**Talking Points**:
1. "Rules are checked automatically: issue type validation, label correctness,
   PR descriptions, accessibility."

2. "If something's wrong, the bot gives instant feedback: 'Your issue is
   missing a priority label.' Not a human scolding, just feedback."

3. "Audit trails: every action (label applied, issue closed) is logged. You
   can trace how decisions were made."

**Why It Matters**:
"Governance doesn't feel like gatekeeping. It feels like helpful guidance."

**Transition**:
"Let me show you the impact of this in practice."
```

### Slide 18: Real-World Impact

```
SPEAKER NOTES:

**Timing**: 1–2 minutes (emphasis on metrics here)

**Key Message**:
Proof that this works. Real data from LightSpeed.

**Talking Points**:
1. "Time saved: 80% reduction in manual labeling. That's ~250 hours per year
   on 2 repos. Extrapolated: 2,500+ hours across 20 repos."

2. "Consistency: 100% of issues follow the same structure, same labeling, same
   review process. No more 'wait, how do we do this here?'"

3. "Adoption: 2 pilot repos → 5 → 12 → 20. Word of mouth. Volunteers wanted
   to adopt."

**The Why**:
"When process is automated and fair, people adopt. When it's manual and
arbitrary, they resist."

**Transition**:
"Okay, so this works at LightSpeed. How can *you* get started?"
```

---

## Slides 19–22: Adoption & Future

### Slide 19: Getting Started

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Three simple steps: Fork, Read, Join.

**Talking Points**:
1. "Fork the LightSpeed `.github` repository on GitHub. It's fully portable."

2. "Read the `README.md` and `AGENTS.md` files. They explain every component."

3. "Join our community on GitHub Discussions. Share what you're building, ask
   questions, contribute back."

**Call to Action**:
"You don't need to implement everything. Start with one plugin. See if it helps
your team."

**Transition**:
"Now, we're also thinking about the future."
```

### Slide 20: The Roadmap Ahead

```
SPEAKER NOTES:

**Timing**: 1–2 minutes

**Key Message**:
Year 1 vision: WordPress agent-skills integration. Then ecosystem expansion.

**Talking Points**:
1. "WordPress just released 'agent-skills,' a set of reusable AI automation
   patterns for WordPress governance."

2. "Our Year 1 goal: audit WordPress agent-skills, map LightSpeed patterns,
   contribute under GPL 3.0."

3. "Year 2+: Expand ecosystem. Other plugins, integrations, community contributions."

**Why It Matters**:
"This isn't just about LightSpeed. It's about building a commons for open-source
governance."

**Reference**:
[Mention WORDPRESS_INTEGRATION_ROADMAP.md on slide]

**Transition**:
"Before we wrap up, I want to challenge you."
```

### Slide 21: Call to Action

```
SPEAKER NOTES:

**Timing**: 1 minute

**Key Message**:
Join the community. Contribute. Share what you build.

**Talking Points**:
1. "If you manage repositories, you face these problems. Start with `.github`.
   Fork it, customize it, use it."

2. "Share your innovations. Built a plugin? Contributed an agent? Submit a PR.
   Let's learn from each other."

3. "This is a community project. It's as much yours as it is ours."

**Emphasis**:
"Governance doesn't have to be a drag. With the right tools, it's invisible
and powerful."

**Transition**:
"Let me leave you with one thought."
```

### Slide 22: Closing Thought

```
SPEAKER NOTES:

**Timing**: 30–45 seconds (memorable closing)

**Key Message**:
One .github repo is the foundation for scalable governance.

**Closing Statement**:
[Craft a memorable 1–2 sentence summary, e.g.:]

"Governance at scale doesn't require hiring another person to manage processes.
It requires rethinking how tools can amplify human decisions. One `.github`
repository, shared knowledge, and a community of builders. That's the future."

OR

"Three years ago, we couldn't scale governance. Today, we manage 20+ repositories
with consistent automation, transparent rules, and happy developers. If we can do
it, you can too."

**Transition to Contact Slide**:
"Thanks for listening. If you want to chat more, here's how to reach me."
```

---

## Slides 23–24: Closing

### Slide 23: Contact Details

```
SPEAKER NOTES:

**Timing**: 30 seconds

**How to Use**:
[Invite audience to connect]

"Thanks for watching. If you want to chat about governance, plugins, WordPress
integration, or anything else, here's how to reach me:

• Email: ashley@lightspeedwp.agency
• GitHub: github.com/lightspeedwp
• Website: lightspeedwp.agency
• LinkedIn: [Your LinkedIn]

I read every message. Seriously."

**Optional Q&A Note**:
"We have time for a few questions. Or stick around for the Happiness Bar after!"
```

### Slide 24: Thank You

```
SPEAKER NOTES:

**Timing**: 15 seconds (closing slide, brief)

**How to Use**:
[Simple closing]

"Thank you."

[Pause. Let the applause happen.]

[If taking questions immediately, you can skip this slide and move to Q&A.]
```

---

## Delivery Tips

### Pacing & Timing

- **Slides 1–2** (problem setup): 1.5 min
- **Slides 3–5** (problem deep dive): 3 min
- **Slides 6–12** (solution + agents): 8 min ← slow down here, let it sink in
- **Slides 13–18** (implementation): 7 min
- **Slides 19–22** (adoption + future): 4 min
- **Slides 23–24** (contact + closing): 1 min

### Emphasis Points

- **80% time savings metric**: Repeat this. It's your credibility anchor.
- **Hub-and-spoke diagram**: Explain it slowly. Visual learners need this.
- **Hooks → Workflows → Agents**: Break this into 3 slides for clarity.
- **WordPress integration**: Brief mention now, deep conversation post-talk.

### Engagement Tips

- **Ask rhetorical questions**: "How many of you manage 5+ repositories? How many do it manually?"
- **Tell a story**: Weave in the "before and after" narrative throughout.
- **Use concrete examples**: "We saved 250 hours in one year. That's a full-time person."
- **Invite participation**: "Have you had this problem?" Pause for hands.

### Handling Interruptions

If someone asks a question during the talk:

- Answer briefly (30 seconds max)
- Offer deeper discussion at the end: "Great question. Let's dive into that after the talk."

---

## Notes for Print / Reference

**Total timing**: ~25 minutes
**Format**: Theater-style, no audience interaction required (but encouraged)
**Recording**: VideoPress will handle, available within weeks
**Handout**: This slide deck + wceu-2026/glossary.md

---

**Created**: 2026-05-30
**Updated**: [After NotebookLM briefs generated]
**Finalised**: May 31 EOD
