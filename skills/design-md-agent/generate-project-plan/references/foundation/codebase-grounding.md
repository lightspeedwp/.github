# Codebase grounding

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
<!-- BADGES-END -->

Hybrid strategy: user provides entry points, skill expands with bounded depth. Runs between interview phase A and phase B.

## Input: entry points from the user

Collected during interview phase A. User supplies any combination of:

- **File paths** — absolute or relative, e.g. `share/mermaid/src/processors/edge_routing.ts`.
- **Directory paths** — e.g. `share/mermaid/src/processors/`.
- **Globs** — e.g. `web/src/components/diagrams/**/*.ts`.
- **Service names** — mapped via repo conventions (e.g. a known service manifest or `services/` directory).
- **Doc paths** — `ARCHITECTURE.md`, `docs/*.md`, `README.md` in a relevant directory.

If the user says "none" or "skip", skip grounding entirely and proceed to interview phase B. Architecture diagrams will be drawn from PRD text alone.

## Expansion rules

For each entry point, up to the 20-file cap:

1. **Read the file.** Use `Read` (or `Glob` first for a dir/glob, then `Read` on selected files).
2. **Extract imports.** Collect static import paths (TS/JS `import`, Ruby `require`/`require_relative`, Python `import`, Go `import`, etc.). Resolve to in-repo paths where possible.
3. **Follow 1 level of imports** into the same repo. Do NOT chase transitively (depth > 1). External package imports are noted but not opened.
4. **Read adjacent architecture docs.** For each file, walk up the directory tree to the repo root looking for `CLAUDE.md`, `README.md`, `ARCHITECTURE.md`, `DESIGN.md`. Read any found. This provides architectural context.
5. **Extract OWNERSHIP / OWNERS file** if present in any ancestor directory (Figma repo has these). Capture the team name.

### Cap

- **20 files total.** Hard limit. Counts every `Read` invocation.
- When the cap is hit, stop. Record in the tech-context: `expansion_truncated: true, files_read_count: 20`. The content plan printout surfaces this so the user knows grounding was incomplete.

### Do not

- Execute any code read from the repo.
- Follow cross-repo references. V1 stays inside the current repo.
- Read files that look like tests (`*_test.go`, `*.test.ts`, `spec/`, `__test__/`) unless the user explicitly named them — they rarely help with architecture.
- Read binary files or files > 2000 lines (`Read` with no offset/limit would fail anyway; skip and record the skip).

## Output: tech-context object

The grounding phase produces a structured object consumed by interview + content-shape phases:

```jsonc
{
  "files_read": [
    { "path": "share/mermaid/src/processors/edge_routing.ts", "kind": "source" },
    { "path": "share/mermaid/CLAUDE.md", "kind": "doc" },
    // ...
  ],
  "services": [
    { "name": "mermaid-processor", "path": "share/mermaid/src/", "one_line_description": "Server-side Mermaid diagram layout engine" }
  ],
  "external_deps": [
    { "name": "mermaid.js", "role": "Upstream parser" }
  ],
  "key_modules": [
    { "path": "share/mermaid/src/processors/edge_routing.ts", "purpose": "Routes connectors around nodes in architecture diagrams" }
  ],
  "architecture_notes": [
    "From share/mermaid/CLAUDE.md: Use bazel test //share/mermaid:test to validate",
    "From repo root CLAUDE.md: PR titles follow 'domain: Description' format"
  ],
  "ownership": "share/mermaid owned by: (team name if found in OWNERS file)",
  "expansion_truncated": false,
  "files_read_count": 7
}
```

### Field guidance

- **`files_read`** — exhaustive list for transparency in the content-plan printout. User can spot wrong branches.
- **`services`** — inferred from directory names, `services.yaml`, or explicit mentions in CLAUDE.md. If none found, leave empty. Do NOT invent.
- **`external_deps`** — packages the code imports from third-party sources. Names + roles only.
- **`key_modules`** — a short list of the most important files encountered (≤8). Use judgment based on file size, how many others import them, and whether they're named in architecture docs.
- **`architecture_notes`** — verbatim quotes or close paraphrases from CLAUDE.md / ARCHITECTURE.md. Prefer quotes with attribution so the user can trace back.
- **`ownership`** — team name if discoverable.

## How the content-shape phase uses this

| Section | Grounding input |
|---|---|
| Context & Background | `architecture_notes` prepended if they give useful framing; `ownership` if the PRD doesn't name an owner |
| Proposed Approach | `key_modules` cited inline so the narrative has factual anchors |
| Dependencies stickies | `services` (Blue cross-team), `external_deps` (Orange external). Users add upstream Blockers in the interview. |
| Current State Architecture diagram | `services` → service subgraph nodes; `external_deps` → external subgraph nodes; reading `architecture_notes` for data flows |
| Target State Architecture diagram | Current State plus additions from the PRD's Proposed Approach |

## Safety

- Every file path that was read is printed back to the user in phase D's content plan. User approves before writes.
- If the user's entry point is outside the repo root, refuse and ask for an in-repo path.
- The skill never writes to or edits any file it reads as part of grounding.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
