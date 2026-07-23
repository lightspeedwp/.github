---
file_type: documentation
title: Playwright Testing Agent — How to Test It
description: >-
  How to validate the Playwright Testing Agent's packaging and exercise its
  behaviour across Claude, GitHub Copilot, and OpenAI, including the execution
  model and a worked end-to-end example.
last_updated: '2026-07-22'
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
node hooks/multi-provider-consistency-checker/index.js agents/playwright-testing-agent

# No hardcoded secrets anywhere in the agent
node hooks/agent-security-auditor/index.js agents/playwright-testing-agent

# Plugin manifests + referenced files resolve
node hooks/plugin-integrity-checker/index.js plugins/lightspeed-playwright-testing

# Everything at once (this is what CI runs)
npm run validate:agent-hooks

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

## 2. Test the behaviour per provider

### Claude (Claude Code)

1. Install the plugin from `plugins/lightspeed-playwright-testing/`
   (`.claude-plugin/plugin.json`).
2. Connect the **Playwright MCP** server so the agent has live browser tools.
3. Give it a real PRD/acceptance criteria and confirm it follows the
   **review-before-code** contract (see checklist below) — it must return the
   seven-section test pack and **stop at the review gate**, not jump to code.
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

- [ ] Produces requirements with stable IDs, grounded in the supplied sources
      (no invented requirements).
- [ ] Emits the seven sections in order: Scope Summary → Sources Used →
      Confirmed Requirements → Assumptions and Gaps → Human-Readable Test Cases
      → Traceability Matrix → Review Gate.
- [ ] **Stops at the review gate** before generating any Playwright code
      (unless you explicitly asked for a quick prototype).
- [ ] After approval, generates `@playwright/test` specs using
      `getByRole`/`getByLabel`/`getByText`/`getByTestId`, fixtures for repeated
      setup, and `// requirement: R# / test-case: TC#` traceability comments.
- [ ] Uses environment variables for base URLs/credentials — never literals.
- [ ] Flags state-changing WooCommerce tests and prefers staging over production.

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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
