# Apps SDK Docs Workflow

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
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

Use this reference to keep code generation aligned with current OpenAI Apps SDK docs.

## Always Fetch These Pages (Baseline)

- `https://developers.openai.com/apps-sdk/build/mcp-server/`
- `https://developers.openai.com/apps-sdk/build/chatgpt-ui/`
- `https://developers.openai.com/apps-sdk/build/examples/`
- `https://developers.openai.com/apps-sdk/plan/tools/`
- `https://developers.openai.com/apps-sdk/reference/`

## Fetch Conditionally (Greenfield / First Pass)

- `https://developers.openai.com/apps-sdk/quickstart/` for first implementation scaffolds and happy-path wiring
- `https://developers.openai.com/apps-sdk/deploy/` when the task includes local ChatGPT testing via tunnel, hosting, or production deployment planning
- `https://developers.openai.com/apps-sdk/deploy/submission/` when the task includes public launch, app review, or publishing steps
- `https://developers.openai.com/apps-sdk/app-submission-guidelines/` when the task includes submission readiness, policy/reliability checks, or review-risk reduction

## Suggested `openai-docs` / MCP Queries

Use focused searches before fetching:

- `ChatGPT Apps SDK build MCP server register resource template resourceUri outputTemplate`
- `ChatGPT Apps SDK build ChatGPT UI MCP Apps bridge ui/notifications/tool-result`
- `ChatGPT Apps SDK examples React widget upload modal Pizzaz`
- `Apps SDK define tools annotations readOnlyHint destructiveHint openWorldHint`
- `Apps SDK reference tool descriptor _meta ui.resourceUri openai/outputTemplate`
- `ChatGPT Apps SDK quickstart build web component tools/call`
- `ChatGPT app company knowledge compatibility search fetch tools`
- `platform MCP search tool fetch tool schema`
- `ChatGPT Apps SDK deploy app local development tunnel ngrok refresh connector`
- `ChatGPT Apps SDK submit app review prerequisites app submission guidelines`

## Docs-Derived Checklist (Current Guidance)

### Archetype / Shape

- Classify the request into one primary app archetype before choosing examples or scaffolds
- Keep the repo shape consistent with that archetype instead of inventing a new structure for each prompt

### Server

- Register the widget resource/template with the MCP Apps UI MIME type (`text/html;profile=mcp-app`) or `RESOURCE_MIME_TYPE` when using `@modelcontextprotocol/ext-apps/server`
- Version template URIs when widget HTML or JS or CSS changes in a breaking way (treat URI as cache key)
- Set `_meta.ui.resourceUri` on render tools; optionally mirror `_meta["openai/outputTemplate"]` for ChatGPT compatibility
- Design tool handlers to be idempotent because the model may retry calls
- Keep `structuredContent` concise and move widget-only payloads to `_meta`

### Tool Design

- Plan one user intent per tool
- Use action-oriented names and precise descriptions
- Set tool impact hints accurately (`readOnlyHint`, `destructiveHint`, `openWorldHint`)
- Split data and render tools so that the model can fetch the data and look at it before choosing to render the widget UI or not
- Make the widget input a list of unique identifiers (e.g. `propertyIds` for a render property map widget that takes IDs returned from the fetch properties nearby tool) if you want to make sure the widget only renders 1p data; make the widget input semantically relevant if you want to allow the model to render the widget with generated data (e.g. `questionAndAnswerPairs` for a flashcards widget)
- For connector-like, data-only, sync-oriented, or company-knowledge-style apps, prefer the standard `search` and `fetch` tools by default

### UI

- Prefer the MCP Apps bridge (`ui/*` notifications + `tools/call`) for new apps
- Prefer `ui/message` for follow-up messaging in baseline examples; treat `window.openai.sendFollowUpMessage` as optional ChatGPT-specific compatibility
- Treat `window.openai` as compatibility plus optional ChatGPT extensions
- Render from `structuredContent` and treat host-delivered data as untrusted input
- Use `ui/update-model-context` only for UI state the model should reason about

### Starting Point Selection

- Check `apps-sdk/build/examples` and the official examples repo before generating a greenfield scaffold from scratch
- Prefer the smallest upstream example that matches the requested stack and interaction pattern
- Use the local fallback scaffold only when upstream examples are a poor fit or undesirable for the request

### Resource Metadata / Security

- Set `_meta.ui.csp.connectDomains` and `_meta.ui.csp.resourceDomains` exactly
- Avoid `frameDomains` unless iframe embedding is central to the experience
- Set `_meta.ui.domain` for submission-ready apps
- Always set `openai/widgetDescription` to inform the model what the widget is to be used for

### Developer Mode / Local Testing

- Run the MCP server locally on `http://localhost:<port>/mcp`
- Expose it with a public HTTPS tunnel for ChatGPT access during development
- Use the public URL + `/mcp` when adding the app in ChatGPT settings
- Include ChatGPT Developer Mode setup and app creation steps in implementation handoff
- Remind users to refresh the app after MCP tool/metadata changes
- Note terminology differences when relevant: some docs/screenshots may still say "connector" while product UI uses "app"

### Validation

- Validate against a minimum working repo contract, not just file creation
- Run the cheapest useful syntax or compile check first
- If feasible, confirm the local `/mcp` route responds before calling the result “working”
- If you cannot run a deeper check, say so explicitly
- If the app is connector-like or sync-oriented, verify the `search` and `fetch` tool shapes against the standard

### Production Hosting / Deploy

- Prefer a stable public HTTPS endpoint with reliable TLS and low-latency streaming `/mcp`
- Document platform-specific secrets handling and environment variables
- Include logging/metrics expectations for debugging production tool calls
- Re-test the hosted endpoint in ChatGPT Developer Mode before submission

### Submission / Review

- Read `deploy/submission` and `app-submission-guidelines` together (process + policy requirements)
- Check org verification and Owner-role prerequisites before generating submission steps
- Ensure the endpoint is public production infrastructure (not localhost/tunnel/testing URLs)
- Ensure CSP is defined and accurate for submission
- Prepare submission artifacts (metadata, screenshots, privacy policy/support contacts, test prompts/responses)
- If auth is required, prepare review-safe demo credentials and validate them outside internal networks

## Generation Pattern

1. Classify the app archetype.
2. Fetch docs with `$openai-docs`.
3. Check official examples before inventing a scaffold from scratch.
4. Summarize relevant constraints and metadata keys.
5. Propose tool plan and architecture.
6. Adapt the closest example or use the local fallback scaffold.
7. Generate or patch the server scaffold.
8. Generate or patch the widget scaffold.
9. Validate the repo against the minimum working contract.
10. Add local run + tunnel + ChatGPT Developer Mode app setup instructions.
11. Add hosting/deployment guidance when the task implies go-live.
12. Add submission/readiness steps when the user intends public distribution.
13. Call out compatibility aliases vs MCP Apps standard fields.

## Starter Scaffold Script

- Use `./scripts/scaffold_node_ext_apps.mjs <output-dir> --app-name <name>` only when the user wants a greenfield Node + `@modelcontextprotocol/ext-apps` starter and no upstream example is the better fit.
- If the file is not executable in the current environment, fall back to `node .github/scripts/scaffold_node_ext_apps.mjs <output-dir> --app-name <name>`.
- The script generates `package.json`, `tsconfig.json`, `public/widget.html`, and `src/server.ts`.
- It intentionally uses the MCP Apps bridge by default, keeps follow-up messaging on `ui/message`, and limits `window.openai` to optional host signals/extensions.
- After generation, compare the output against the docs you fetched and adjust package versions, metadata, transport details, or URI/versioning if the docs changed.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
