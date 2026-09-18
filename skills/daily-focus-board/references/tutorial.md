# Using the Daily Focus Board

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

A warm, visual board for your day that you run **by talking to your AI partner** (Ember). You set
the tasks; you keep it current through conversation and a few one-tap controls. This guide covers
running it in the **GitHub Copilot app** (best experience) and **directly through Ember** anywhere.

## Quick start

Just ask:

> "Make me a focus board for today."

Ember will ask for your handful of tasks (or lift them from what you've already said), generate the
board, serve it locally, and open it. That's it — you're running your day with a partner.

## Two ways to run it

### A) In the GitHub Copilot app (browser canvas) — recommended

The app can show a **browser canvas** right next to the chat, so the board lives beside your
conversation.

1. Ask Ember to make the board. It serves the folder (e.g. `python -m http.server 8790 --bind 127.0.0.1`) and gives
   you an `http://localhost:…/…html` URL.
2. Open a **browser canvas** to that URL. The board sits in the side panel; the chat stays on the left.
3. Talk to Ember as you work; tap the board for quick updates. Progress saves automatically (localStorage).

### B) Directly through Ember (any Copilot session with this skill)

Same flow, without the side-panel polish:

1. "Make me a focus board for today."
2. Ember serves it and gives you the URL — open it in your browser.
3. Drive it by talking + tapping.

> localStorage needs an `http://` origin, so always **serve** the folder rather than double-clicking
> the file. If you truly can't serve, the file still opens, but progress may not persist.

## The daily loop

**1. Arrive (morning).**

- **Check in:** tap *below / in-between / above the line* — just noticing how you're arriving, no
  judgment. (Below the line? Be gentle and shrink the first step.)
- **Set a mantra:** type today's intention, tap 🔄 for a suggestion, or ask Ember for one.
- **List ~4–9 tasks.** Keep it a focus board, not a backlog. Mark the one real **anchor** (give it
  a `due`). Optionally set each task's **priority** (Do first / Schedule / Delegate / Later — tap
  🧭 for what they mean).

**2. Work (during the day).**

- Tap a task's pill to move it **to do → in progress → done** (starting counts — celebrate it).
- **Log momentum notes** ("first draft done") — they build the story of your day.
- **Focus mode** (🎯) dims everything but one task when the list feels loud.
- A stray thought? **Park it** in the 🧠 brain-dump box and keep going.
- Need to capture something new? **➕ add a task** right on the board.
- Reorder by importance with the **⠿** handle, or tap **⬍ sort by priority**.
- Rename any tile's **label** inline.

**3. Close (end of day).**

- Tap **💾 download recap** to keep the day as a Markdown file, or **📋 copy** it.
- If you copy it, **paste it to Ember** — Ember can journal your day and help you set up tomorrow.
- Carry unfinished things with **⤳ not today** — that's a healthy choice, not a miss.

## Things to say to Ember

- "I'm below the line today — give me a gentle mantra and one tiny first step."
- "What should I do next?" → Ember names **one** thing and can turn on Focus mode.
- "Add 'call the dentist' to the board."
- "Help me prioritize — what's actually important vs just urgent?"
- "Here's my end-of-day recap: …" (paste it) → "journal this and plan tomorrow."

## Good to know

- **It's yours and optional.** Every feature is a support, not a requirement. Focus-friendly for
  everyone; never a diagnosis.
- **Keep it small.** If it passes ~9 active tasks, the board nudges you — carry a few to tomorrow.
- **The Schedule quadrant** (important, not urgent) is where the good, non-frantic work lives —
  protect time for it.
- **State is per-browser.** The end-of-day recap is how you take your day *out* of the browser.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
