# Window.openai Patterns

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

Load this reference when a task needs ChatGPT-only widget features, when translating older examples that use an `app` wrapper, or when a React widget should read host globals safely.

## Core Rule

- Build baseline widget behavior on the MCP Apps bridge: `ui/*` notifications, `tools/call`, `ui/message`, and `ui/update-model-context`.
- Use `window.openai` only when the task specifically benefits from ChatGPT-only runtime conveniences.
- Treat `window.openai` as additive. The app should still have a coherent baseline path on the MCP Apps standard when possible.

## Canonical `window.openai` Surface

### State And Data

- `window.openai.toolInput`: tool arguments supplied by the host
- `window.openai.toolOutput`: current `structuredContent`
- `window.openai.toolResponseMetadata`: current `_meta` payload (widget-only)
- `window.openai.widgetState`: persisted widget-local snapshot
- `window.openai.setWidgetState(state)`: persist widget-local snapshot after meaningful UI changes

### Runtime APIs

- `window.openai.callTool(name, args)`: call another MCP tool from the widget
- `window.openai.sendFollowUpMessage({ prompt, scrollToBottom? })`: ask ChatGPT to post a widget-authored follow-up message
- `window.openai.openExternal({ href, redirectUrl? })`: open an external URL through ChatGPT's vetted flow
- `window.openai.requestDisplayMode({ mode })`: request `inline`, `pip`, or `fullscreen`
- `window.openai.requestModal({ params, template? })`: open a host-owned modal
- `window.openai.requestClose()`: ask ChatGPT to close the widget
- `window.openai.uploadFile(file, options?)`: upload a file from the widget
- `window.openai.selectFiles()`: open ChatGPT's file library picker and return app-authorized files
- `window.openai.getFileDownloadUrl({ fileId })`: resolve a temporary download URL
- `window.openai.notifyIntrinsicHeight(...)`: report dynamic height changes
- `window.openai.setOpenInAppUrl({ href })`: override the fullscreen punch-out target

### Context Signals

- `window.openai.theme`
- `window.openai.displayMode`
- `window.openai.maxHeight`
- `window.openai.safeArea`
- `window.openai.view`
- `window.openai.userAgent`
- `window.openai.locale`

## Mapping From Repo Wrapper Examples

- `app.callServerTool({ name, arguments })`:
  Use `window.openai.callTool(name, args)` when you intentionally want the ChatGPT compatibility layer.
  Use `tools/call` over the bridge when you want the portable MCP Apps path.
- `app.sendMessage(...)`:
  Use `ui/message` for portable bridge messaging.
  If the task is intentionally ChatGPT-specific, `window.openai.sendFollowUpMessage({ prompt })` is the closest supported path.
- `app.updateModelContext(...)`:
  Use `ui/update-model-context` over the bridge.
  This is part of the standard bridge, not a `window.openai` feature.
- `app.openLink({ url })`:
  Use `window.openai.openExternal({ href: url })` when you intentionally want ChatGPT's external navigation flow.
- `app.requestDisplayMode({ mode })`:
  Use `window.openai.requestDisplayMode({ mode })`.
- `app.getHostContext()`:
  Read the documented globals directly (`theme`, `displayMode`, `locale`, `maxHeight`, `safeArea`, `userAgent`).
- `app.getHostCapabilities()` / `app.getHostVersion()`:
  These are wrapper-level convenience APIs.
  Prefer feature detection (`if (window.openai?.requestModal)`) and the documented globals instead of teaching these as the primary public surface.

## File Patterns

- Use `window.openai.uploadFile(file)` when the user is adding a new local file inside the widget.
- Use `window.openai.uploadFile(file, { library: true })` when the upload should also be saved into the user's ChatGPT file library.
- Use `window.openai.selectFiles()` when the user should be able to reuse files that are already in their ChatGPT file library instead of uploading again.
- Use `window.openai.getFileDownloadUrl({ fileId })` when the widget needs a temporary URL for previewing a file or forwarding it through a file-param payload.
- Feature-detect these helpers in the widget (`if (window.openai?.selectFiles)`) and provide a fallback upload flow when a ChatGPT-only helper is unavailable.

## React Helper Extraction

- The repo's `src/use-openai-global.ts` is a good baseline for subscribing to host global changes without scattering direct `window.openai` reads through components.
- The repo's `src/use-widget-state.ts` is a good baseline for mirroring React state into `window.openai.setWidgetState(...)`.
- The repo's `src/use-widget-props.ts` is a good baseline for reading typed `toolOutput` with a local fallback.
- Keep these helpers optional. Do not force a React abstraction when a simple vanilla widget is enough.

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

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
