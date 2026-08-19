---
file_type: documentation
title: Playwright Testing Agent — How to Test It
description: >-
  How to validate the Playwright Testing Agent's packaging and exercise its
  behaviour across Claude, GitHub Copilot, and OpenAI, including the execution
  model and a worked end-to-end example.
last_updated: '2026-08-17'
domain: generic
tags:
  - playwright
  - testing
  - agents
  - multi-provider
---

# How to Test the Playwright Testing Agent

There are **two distinct things to test**, and it helps to keep them separate:

1. **The packaging** — is the agent spec well-formed, multi-provider-consistent,
   secret-free, and correctly wired into its plugin? This is deterministic and
   fully automated (no LLM or browser needed).
2. **The behaviour** — does the agent, when loaded into a provider, actually
   produce a review-ready test pack and then valid Playwright specs? This is
   exercised interactively per provider.

## Execution model (read this first)

This agent is a **specification**, not a standalone program. There is no
`playwright-testing.js` to run. It works like every other agent in this repo:

- `AGENT.md` + `shared/core-prompt.md` are the provider-agnostic instructions.
- `claude/`, `copilot/`, `openai/` add provider-specific instructions and
  **tool/function declarations** (`tools.json`, `skills.yaml`).
- The **host runtime supplies the actual capabilities.** Browser automation
  comes from the **Playwright MCP server** (or the `@playwright/test` runner in
  CI); requirement extraction and test-case authoring are performed by the model
  following the prompt. The `tools.json` files describe the contract the host
  binds to those tools — they are intentionally declarations, mirroring how
  `plugins/lightspeed-github-ops` and the other LightSpeed agents are packaged.

So "testing the agent" means (1) validating the package and (2) loading it into
a provider and checking the outputs against the workflow contract below.

## 1. Test the packaging (automated, no LLM)

Run from the repo root:

```bash
# Agent spec frontmatter (required fields, provider list, version/status format)
node hooks/agent-spec-validator/index.js agents/playwright-testing-agent

# Provider parity (shared core prompt + claude/copilot/openai configs present)
# and content parity for the invariants declared in consistency.json
node hooks/multi-provider-consistency-checker/index.js agents/playwright-testing-agent

# No hardcoded secrets anywhere in the agent
node hooks/agent-security-auditor/index.js agents/playwright-testing-agent

# Plugin manifests + referenced files resolve
node hooks/plugin-integrity-checker/index.js plugins/lightspeed-playwright-testing

# Everything at once
# Note: not currently wired into CI — see scripts/validation/validate-agent-hooks.cjs
# and https://github.com/lightspeedwp/.github/issues/1962
node scripts/validation/validate-agent-hooks.cjs

# Schemas + tool definitions are valid JSON Schema
npm run validate:json:schemas
```

You can also validate the `tools.json` files against the provider-config schema:

```bash
node -e '
const fs=require("fs"),Ajv=require("ajv"),addFormats=require("ajv-formats");
const ajv=new Ajv({allErrors:true,strict:false}); addFormats(ajv);
const v=ajv.compile(JSON.parse(fs.readFileSync("schema/provider-config.schema.json")));
for (const p of ["claude/tools.json","openai/tools.json"]) {
  const ok=v(JSON.parse(fs.readFileSync("agents/playwright-testing-agent/"+p)));
  console.log(p, ok ? "VALID" : JSON.stringify(v.errors));
}'
```

**Expected:** every command exits `0` / prints `VALID`.

### Content-parity invariants (`consistency.json`)

Some wording is deliberately restated in more than one file — most importantly the
**approved requirement types**, which appear in `shared/core-prompt.md`,
`AGENT.md`, and the `test-pack-builder` SKILL. If those copies drift, an
extraction run can classify against a list that one file does not recognise,
which is exactly how performance requirements went missing before `performance
rule` became a first-class type.

[`consistency.json`](./consistency.json) declares those invariants, and
`multi-provider-consistency-checker` enforces them — whitespace is normalised, so
line-wrapping may differ between files. The check runs as part of
`node scripts/validation/validate-agent-hooks.cjs` (not currently wired into
CI — see above), and its own tests live in
`hooks/multi-provider-consistency-checker/__tests__/`.

Confirm it actually fails on drift rather than trusting a green run:

Run it against a **throwaway copy** so your working tree is never touched — and
so uncommitted edits can't be lost:

```bash
WORK="$(mktemp -d)"
cp -R agents/playwright-testing-agent "$WORK/agent"
trap 'rm -rf "$WORK"' EXIT

# drop one type from the copy, then expect a non-zero exit
sed -i.bak 's/accessibility rule, performance rule/accessibility rule/' \
  "$WORK/agent/AGENT.md" && rm -f "$WORK/agent/AGENT.md.bak"
node hooks/multi-provider-consistency-checker/index.js "$WORK/agent"
# → ❌ Shared phrase 'requirement-type-taxonomy' is out of sync: AGENT.md …
echo "exit: $?"   # expect 1
```

> **Never** use `git checkout <file>` to undo a deliberate edit like this. It
> discards *all* uncommitted changes to that file, including unrelated work in
> progress. Copy first, or back the file up and restore it from a `trap`.
>
> `sed -i.bak` is used rather than the BSD-only `sed -i ''`, so the same command
> works on Linux and macOS.

**Add an entry whenever you introduce wording that must match across files.** A
hand-run `grep` is not a substitute — it verifies today and protects nothing
tomorrow.

## 2. Test the behaviour per provider

### Claude (Claude Code)

1. Install the plugin from `plugins/lightspeed-playwright-testing/`
   (`.claude-plugin/plugin.json`).
2. Connect the **Playwright MCP** server so the agent has live browser tools.
   Optionally connect the **Chrome DevTools MCP** server for live accessibility
   and SEO auditing (`lighthouse_audit`).
3. Give it a real PRD/acceptance criteria and confirm it follows the
   **review-before-code** contract (see checklist below) — it must return the
   canonical test pack (full eight sections, or the condensed form for a small
   single flow), persist it to the project's test-pack directory
   (`.githu./.github/reports/test-packs/` in a repo with a `.github/` control plane), and
   **stop at the review gate**, not jump to code.
4. Approve the pack, then ask for specs; confirm it emits `@playwright/test`
   files with accessible locators and traceability comments.

### GitHub Copilot

1. Make the plugin discoverable via `copilot-plugin.json`.
2. In Copilot Chat: `@playwright-testing build a test pack from this PRD: …`.
3. Confirm the Markdown test-pack + review gate; then request specs.

### OpenAI

1. Register the functions in `openai/tools.json` with your API tool config and
   pass `shared/core-prompt.md` + `openai/agent.md` as system context.
2. Call `build_test_pack` first. Confirm it returns the structured pack and does
   **not** call `generate_playwright_specs` until you pass an approved pack ID.

## Behaviour acceptance checklist

Regardless of provider, a correct run:

- [ ] Opens with a one-line integration pre-flight (Playwright MCP / Chrome
      DevTools MCP / Figma / BugHerd / GitHub — available or degraded path), and
      lists only capabilities actually wired into the session.
- [ ] Establishes an Environment & Test-Data Contract, marking unknown fields as
      gaps rather than fabricating values — including the accessibility and
      console-error baselines.
- [ ] Produces requirements with stable IDs, grounded in the supplied sources
      (no invented requirements).
- [ ] Emits the full eight sections in order (Scope Summary → Sources Used →
      Environment & Test-Data Contract → Confirmed Requirements → Assumptions and
      Gaps → Human-Readable Test Cases → Traceability Matrix → Review Gate), or
      the condensed form when right-sized to a small/single flow — and states
      which form it used.
- [ ] Persists the pack to the project's test-pack directory
      (`.githu./.github/reports/test-packs/<flow>-<date>.md` where a `.github/` control
      plane exists, otherwise the project-configured or repo-local equivalent) and
      reports the written path.
- [ ] **Stops at the review gate** before generating any Playwright code
      (unless you explicitly asked for a quick prototype).
- [ ] After approval, generates `@playwright/test` specs using
      `getByRole`/`getByLabel`/`getByText`/`getByTestId`, fixtures for repeated
      setup, and `// requirement: R# / test-case: TC#` traceability comments,
      plus a fixtures/env starter kit (`playwright.config` sketch, `.env.example`,
      cart/checkout fixture).
- [ ] Uses environment variables for base URLs/credentials — never literals.
- [ ] Flags state-changing WooCommerce tests (`@stateful`), detects Blocks vs
      classic checkout, waits on Store API recalculation, and prefers staging
      over production.
- [ ] Given a PRD containing a **speed / Core Web Vitals / Lighthouse-score**
      requirement: classifies it as a `performance rule`, records
      `deferred → pagespeed-agent` in the Traceability Matrix, and names that
      agent as owner. It must **not** invent a threshold, emit a wall-clock timing
      assertion, or drop the requirement silently.
- [ ] For accessibility requirements: emits `@axe-core/playwright` gates tagged
      `@a11y` and scoped per page/widget, keyboard-traversal cases for custom
      interactive widgets, and cites WCAG 2.2 AA success criteria — asserting **no
      new** violations against the recorded baseline, not zero outright.
- [ ] **When no baseline has been recorded**, the a11y and console gates are
      emitted as **proposed/deferred** with baseline capture named as the blocking
      prerequisite. The agent must **not** emit a comparison assertion with
      nothing to compare against, and must **not** fabricate a baseline or an
      allowlist to make the gate look runnable. Same rule for any requirement
      whose supporting evidence is missing: mark it proposed, state what is
      needed, and stop.
- [ ] Given a PRD that **excludes** a category of work (e.g. "formal accessibility
      audit is excluded") while an org standard would require it: records a
      change-control item naming the standard and the exclusion, and generates
      **no** cases for it. It must not promote the org standard into a Confirmed
      Requirement, and must not write the coverage and defer the scope question to
      the review gate.
- [ ] For SEO/metadata requirements: derives the URL set from a site inventory
      where one is available rather than hand-listing pages, and asserts only the
      rules the source states.
- [ ] Emits a per-page console-error check gated against the recorded
      console-error baseline, and treats a new error as a finding rather than
      widening the baseline.

## Try the generated specs for real

Once the agent has produced specs, run them like any Playwright suite:

```bash
npm install -D @playwright/test
npx playwright install
BASE_URL="https://staging.example.test" npx playwright test
```

## Regression tests for the tooling

The hooks that guard this agent have their own unit tests:

```bash
npx jest --config .jest.config.cjs hooks/
```

## Related

- [AGENT.md](./AGENT.md) · [shared/core-prompt.md](./shared/core-prompt.md)
- [Plugin README](../../plugins/lightspeed-playwright-testing/README.md)
- [Cookbook playbook](../../cookbook/playwright-agent-creation-guide.md)

---

*Maintained by the 🤖 LightSpeedWP Automation Team* · [📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
