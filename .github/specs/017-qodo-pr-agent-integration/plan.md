# Implementation Plan: Qodo PR-Agent Installation & Agent/Skill Integration

**Branch**: `aiops/qodo-pr-agent-integration` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/017-qodo-pr-agent-integration/spec.md`

## Summary

Install the open-source Qodo PR-Agent on `lightspeedwp/.github` as a CodeRabbit **complement**. It runs in our own GitHub Actions from a digest-pinned container image, on PR events (automatic describe and improve) and on maintainer-only comment commands (review, ask, update_changelog, add_docs, help). Nothing it produces changes the PR body, applies labels or commits.

The organisation-standard behaviour lives in two places:

- a root `.pr_agent.toml` central configuration, in UK English, technology-agnostic, with governance-safe settings;
- a `workflow_call` reusable workflow that future repositories can call.

The pilot calls that same reusable workflow.

The model credential is the dedicated key `ANTHROPIC_API_KEY_QODO_PR_AGENT`. Keyless Workload Identity Federation is an optional alternative: the run job exchanges its GitHub OIDC token for a short-lived Anthropic token, and a stored key takes precedence (FR-002, clarified 2026-09-24).

Existing agents and skills consume Qodo PR-Agent through one new shared skill, `skills/qodo-pr-agent`, which runs the CLI with publishing disabled and returns `ok | skipped | error`. Each integration point documents its fallback.

Run records, a pilot report and a variable-based kill-switch cover operations. Full rationale is in [research.md](./research.md).

## Technical Context

- **Language/Version**:
  - GitHub Actions YAML
  - Bash (skill runner script)
  - Node.js ≥ 20, CommonJS (report script and Jest contract tests, matching the repo's `scripts/` and `tests/js/`)
  - TOML (Qodo PR-Agent config)
- **Primary Dependencies**:
  - Qodo PR-Agent `0.46.0` via the container `pragent/pr-agent@sha256:<digest>` (`-github_action` variant), or PyPI `pr-agent==0.46.0` for the skill fallback
  - Anthropic API (`anthropic/claude-sonnet-5`, fallback `anthropic/claude-haiku-4-5-20251001`), authenticated by the dedicated key or, optionally, by Workload Identity Federation (`POST /v1/oauth/token`)
  - Existing: `smol-toml`, `yaml`, `jest`, `.github/actions/collect-metrics`
- **Storage**: None. Run records are Actions artefacts (30 days) plus a Markdown pilot report in `.github/reports/metrics/qodo-pr-agent/`.
- **Testing**:
  - Jest contract tests in `tests/js/qodo-pr-agent-*.test.js` for the config, workflows (including the token exchange), integration docs, report script and skill runner
  - Existing `validate:workflows`, `lint:workflows` (spectral), actionlint (`workflow-lint.yml`), `validate:skills` and `lint:md`
  - Manual end-to-end validation via [quickstart.md](./quickstart.md)
- **Target Platform**: GitHub-hosted `ubuntu-latest` runners, and maintainer or agent workstations with Docker or Python ≥ 3.12 (skill).
- **Project Type**: Governance and automation assets in a control-plane repository: workflow, config, skill and documentation.
- **Performance Goals**: The automatic output is posted within 10 minutes of a PR being opened or marked ready (SC-001). The job timeout is 15 minutes.
- **Constraints**:
  - Least privilege: no `contents: write`, and no checkout. The `run` job's OIDC write permission (`id-token` set to `write`) is used only by the optional federation exchange.
  - No `pull_request_target`.
  - Never blocks merge (SC-003).
  - Spend is capped at the provider and reported (SC-008).
  - The config is read from the default branch.
- **Scale/Scope**: One repository, with roughly 10–40 PRs a month on this control plane. Seven allow-listed commands, eight in-scope integration points and one deferred one.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design (below).*

| Principle | Assessment | Status |
| --- | --- | --- |
| I. Org-wide governance authority | The central `.pr_agent.toml` and reusable workflow are owned by this repository, and consumers inherit them. CodeRabbit stays the governed primary reviewer. | ✅ |
| II. Locked curated assets | No edits to `labels.yml`, `issue-types.yml`, or the issue or PR templates. Posting descriptions as comments avoids template markers. Any future marker or label need goes through a tagged request (FR-023). | ✅ |
| III. Clear asset boundaries | The skill is in `skills/` and the docs in `docs/`. **Exception (platform-required locations, constitution v1.3.0)**: the reusable workflow lives in `.github/workflows/`, because GitHub only resolves callable workflows there, and `.pr_agent.toml` sits at the root, where Qodo PR-Agent reads it. The workflow is documented as callable in `docs/WORKFLOWS.md` and `docs/QODO_PR_AGENT.md`. Its preflight and token-exchange logic stays inline because the no-checkout design forbids loading repository scripts; all other reusable logic is in `skills/qodo-pr-agent`. | ✅ exception |
| IV. Technology-agnostic guidance | `extra_instructions` point to AGENTS.md, and a contract test rejects stack-specific terms. | ✅ |
| V / VIII. Branch naming | The branch is `aiops/qodo-pr-agent-integration`, validated. No change to routing. | ✅ |
| VI. UK English, accessibility, security | `response_language = "en-GB"`. The credential is a dedicated key in an organisation or repository secret, or a per-run federated token that is masked in logs. No secrets reach the shell. Pinned by digest. Secrets repeated in model output are a documented known limitation with a response procedure. | ✅ |
| VII. Spec quality | The spec checklist is at 16/16, and clarifications are resolved (2026-09-24). | ✅ |
| IX. Changelog compliance | `update_changelog` only proposes. Proposals must pass changelog-agent validation (≤250 chars, linked). The PR gate is unchanged. | ✅ |
| X. Metrics-driven governance | Run records, the `collect-metrics` integration and a 14-day pilot report. | ✅ |

**Gate result**: PASS. Principle III uses the platform-required locations exception; there are no violations.

**Post-design re-check (after Phase 1, repeated 2026-09-24 after clarification)**: the contracts introduce no violations, including the federation token exchange (the OIDC write permission is granted to the `run` job only). The config contract locks the governance keys, the workflow contract forbids checkout, write-contents and `pull_request_target`, and the skill contract never publishes. Gate still **PASS**.

## Project Structure

### Documentation (this feature)

```text
.github/specs/017-qodo-pr-agent-integration/
├── spec.md
├── plan.md                         # This file
├── research.md                     # Phase 0: R1–R12 decisions
├── data-model.md                   # Phase 1: entities
├── quickstart.md                   # Phase 1: validation guide (Q-01…Q-13)
├── contracts/
│   ├── responsibility-matrix.md    # Concern → owner, and integration points
│   ├── pr-agent-config.md          # Required .pr_agent.toml keys
│   ├── reusable-workflow.md        # workflow_call interface, guards, permissions
│   └── skill-interface.md          # skills/qodo-pr-agent I/O
├── checklists/requirements.md
└── tasks.md                        # Phase 2 (/speckit-tasks; not created here)
```

### Source Code (repository root)

```text
.pr_agent.toml                                   # NEW: central Qodo PR-Agent config (contract: pr-agent-config.md)

.github/workflows/
├── qodo-pr-agent-reusable.yml                   # NEW: workflow_call definition (contract: reusable-workflow.md)
├── qodo-pr-agent.yml                            # NEW: pilot caller (triggers, then the local reusable workflow)
└── qodo-pr-agent-report.yml                     # NEW: daily pilot report (Principle X; analysis finding C2)

skills/qodo-pr-agent/                            # NEW: shared skill (contract: skill-interface.md)
├── SKILL.md
├── metadata.yml
└── scripts/run-qodo-pr-agent.sh
skills/SKILL_REGISTRY.json                       # EDIT: register lightspeed-qodo-pr-agent in the core group

# EDIT: add a "## Qodo PR-Agent integration" section (invocation, on-output, fallback)
skills/pr-review/SKILL.md
skills/gh-address-comments/SKILL.md
skills/label-governance/SKILL.md
skills/changelog-generator/SKILL.md
skills/documentation-writer/SKILL.md
agents/reviewer-agent/AGENT.md                   # under "Configuration"
agents/address-comments.agent.md
agents/labeling-agent/AGENT.md
agents/changelog-agent/AGENT.md
agents/document-reviewer-agent/AGENT.md
agents/qa-subagent.agent.md
agents/pr-agent/AGENT.md                         # describe input and self-review gate input (coordinate with spec 015)
agents/issue-agent/AGENT.md                      # "Integration Points": record similar_issue as deferred (R8)

scripts/metrics/qodo-pr-agent-report.cjs         # NEW: aggregates run-record artefacts into the pilot report

tests/js/
├── qodo-pr-agent-config.test.js                 # NEW
├── qodo-pr-agent-workflow.test.js               # NEW (includes the token exchange)
├── qodo-pr-agent-integrations.test.js           # NEW
├── qodo-pr-agent-report.test.js                 # NEW
└── qodo-pr-agent-runner.test.js                 # NEW

docs/QODO_PR_AGENT.md                            # NEW: what it is, commands, matrix, how it differs from agents/pr-agent,
                                                 #      recognising feedback, kill-switch, opt-in guide, overrides
docs/AI_FEEDBACK_SYSTEM_SUMMARY.md               # EDIT: list Qodo PR-Agent as an AI reviewer
docs/WORKFLOWS.md                                # EDIT: register the new workflows (inventory only)
.github/workflows/README.md                      # EDIT: inventory entry
CHANGELOG.md                                     # EDIT: Added entry
```

**Structure Decision**: The workflow and config sit where GitHub and Qodo PR-Agent require them. The reusable logic lives in the skill (`skills/`) and the reusable workflow. Integration is added as documentation sections in the existing assets, not new agents, so no agent is duplicated (Principle III). The spec-015 files under `agents/pr-agent/` are touched only by adding the integration section, and that change is coordinated with the open stacked PRs of spec 015 to avoid conflicts.

## Delivery phases (input to `/speckit-tasks`)

1. **P1 — Pilot and matrix** (US1, US2): `.pr_agent.toml`, both workflows, the config and workflow contract tests, the `docs/QODO_PR_AGENT.md` core sections, the CHANGELOG entry, and prerequisites P-1…P-4. Validated by Q-01…Q-12.
2. **P2 — Integrations** (US3): the shared skill, its registry entry, the integration sections in all in-scope assets, the integrations contract test, and the integration checks.
3. **P3 — Portability and operations** (US4, US5): the opt-in guide and override rules, the report script and run-record artefacts, the kill-switch docs, the walkthrough (SC-006), and the 14-day pilot report.

## Risks and follow-ups

| Risk | Mitigation |
| --- | --- |
| `CONFIG.EXTRA_CONFIG_URL` via env is not honoured by the Action runner (R3) | Quickstart Q-09. Fallback: a consumer-side copy of the config plus a parity test. |
| An upstream image changes behaviour | Digest pin. Bumps go through a normal PR with a changelog note, and provenance is verified with `gh attestation verify`. |
| The upstream repo moved (`qodo-ai` → `the-pr-agent`) | Docs link the new name. The digest is independent of the repo name. |
| Comment noise alongside CodeRabbit | The matrix, persistent comments, no automatic review, and the SC-004 duplicate-rate measure. |
| Spend overrun | Provider-side monthly limit on the dedicated key (or the federation service account's workspace), the kill-switch and the pilot report. |
| Qodo PR-Agent may not accept a federated `sk-ant-oat01-` token as its key | The dedicated key stays the required route; federation is optional until quickstart Q-13 passes (FR-002). |
| The model repeats a secret from the diff in a comment | Known limitation with a documented response: delete the comment, rotate the secret, use the kill-switch if it recurs. |
| `docs/WORKFLOWS.md` wrongly claims root `workflows/` files are callable | Out of scope here; raise a separate fix. This feature documents the correct `.github/workflows/` path. |

## Complexity Tracking

No violations. The reusable workflow's location under `.github/workflows/` was tracked here as a deviation until constitution v1.3.0 added the Principle III platform-required locations exception; it is now recorded as an exception in the Constitution Check (see research R2).
