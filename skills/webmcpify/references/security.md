# Security checklist

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Apply at two points: **before the manifest gate** (classify + flag) and **at the
final audit** (verify). Any unchecked box on a `mutating: "server"` tool blocks
it. Client-only mutations (`mutating: "client"`) still must pass the
**Trust boundary** and **Honesty & hints** boxes.

## Threat model in one paragraph

Any Chrome extension with host permissions — and any agent the user runs — can
enumerate and execute your tools **with the user's live session**. The spec has no
agent-identity mechanism. Page-visible strings (descriptions, labels, enum values,
tool outputs) all enter the model's context, so they are prompt-injection surface in
both directions. Design every tool as if it were a public, authenticated API endpoint
— because effectively it is one.

## Checklist

**Trust boundary**

- [ ] Every `execute()` calls only code paths the UI already uses — same endpoints,
      same validation, same authz, same rate limits. No new endpoints, no bypasses.
- [ ] No secrets, tokens, or privileged config inside tool code or descriptions.
- [ ] Role-based apps: tools registered per role/session and re-scoped on auth
      changes; nothing registered the current session couldn't do via the UI.

**Human-in-the-loop**

- [ ] No `toolautosubmit` on any state-changing form.
- [ ] No destructive/irreversible/payment tools at all in a first integration.
      If the human explicitly insists later: an in-page manual confirmation the
      **user** performs, PLUS a server-side two-step (short-lived confirm token).
      No client-side API exists that can force an agent to confirm — never rely on
      one.
- [ ] Initiation tools (`start_*_flow`) genuinely only navigate/open — they must
      not pre-execute any part of the mutation, and never carry `readOnlyHint`.

**Production side effects (verification)**

- [ ] Any verification that unavoidably causes a real production effect (e.g. an
      Origin-allow-listed mailer) has explicit gate approval recorded in the
      tool's `approval.productionSideEffect` — without it, the live path is
      `skipped`, never executed.
- [ ] Every such test payload is marked `[webmcpify verification]`, and every
      caused effect is listed in `report.md`.
- [ ] The Origin-replay pattern (`heal.md`) lives only in the env-gated harness
      (`WEBMCP_LIVE_MUTATIONS=1`) — never in shipped code, never default-on in CI.

**Honesty & hints**

- [ ] Description says exactly what `execute()` does — no more, no less (agents make
      consent decisions from it).
- [ ] `readOnlyHint: true` ONLY on genuinely pure data reads (agents skip
      confirmation based on it; mislabeling is the worst single mistake).
- [ ] `untrustedContentHint: true` on every tool returning user-generated or
      external content.
- [ ] Outputs capped (~1.5k chars) and free of instruction-like content where
      possible.

**Privacy**

- [ ] Schemas request no more personal data than the equivalent visible form —
      agents auto-fill anything you declare (over-parameterization = silent
      profiling vector).

**Containment**

- [ ] HTTPS/secure context; Permissions-Policy `tools` left at default `'self'`;
      cross-origin `exposedTo`/`allow="tools"` only with explicit human sign-off.
- [ ] Pages that must never expose tools (un-audited checkout, admin consoles you
      didn't inventory) can send `Permissions-Policy: tools=()` — suggest it in the
      report where relevant.
- [ ] No third-party WebMCP runtime added to the project; enumeration/execution
      surfaces (`getTools`/`executeTool`, legacy `modelContextTesting`) appear
      nowhere in shipped application code.
- [ ] Component-side `webmcp:*` event bridges attach only when
      `isWebMCPAvailable()` and validate their event payloads — a page script can
      dispatch the same CustomEvents; the bridge must not become an unvalidated
      side door into app actions.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
