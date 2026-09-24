# Feature Specification: Qodo PR-Agent Installation & Agent/Skill Integration

**Feature Branch**: `aiops/qodo-pr-agent-integration`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "I would like to scope out installing pr-agent - <https://docs.pr-agent.ai/installation/> - and integrated the PR-agent tools with our various existing agents and skills"

## Terminology

To avoid confusion with the organisation's own internal agent at `agents/pr-agent/` (a PR *creation* agent, see spec 015), this specification uses:

- **Qodo PR-Agent**: the third-party, open-source AI pull-request assistant documented at <https://docs.pr-agent.ai/>. It offers these commands: describe, review, improve, ask, add docs, generate labels, similar issues, update changelog, and help.
- **Internal PR agent**: LightSpeed's `agents/pr-agent/`, which creates PRs, validates branches, routes templates and applies labels.

Every artefact this feature produces MUST use the "Qodo PR-Agent" / `qodo-pr-agent` name, never a bare "pr-agent".

## Clarifications

### Session 2026-09-24

- Q: How should Qodo PR-Agent work alongside CodeRabbit, which already reviews every PR? → A: Complement. Responsibilities are split so each concern has exactly one owning tool; CodeRabbit keeps primary code review, and Qodo PR-Agent owns diff-based descriptions, improvement suggestions, on-demand questions and changelog drafting.
- Q: How many repositories should this feature switch Qodo PR-Agent on for? → A: Only `lightspeedwp/.github`. The reusable, organisation-standard setup is built and documented so other repositories can opt in later, but enabling any other repository is out of scope.
- Q: Where should Qodo PR-Agent actually run when a PR is opened or someone comments a command? → A: Inside the organisation's own CI, triggered by PR and comment events, using a secret credential for the model provider (see the FR-002 clarification below). There is no self-hosted server, and the Qodo-hosted app is not used.
- Q: Which credential should the spec require for the Qodo PR-Agent pilot? → A: The dedicated key `ANTHROPIC_API_KEY_QODO_PR_AGENT` is required. Keyless Workload Identity Federation is an optional alternative, and a stored key takes precedence when both are configured.
- Q: Should FR-018 let the reusable workflow and the root `.pr_agent.toml` stay where GitHub and Qodo PR-Agent require them, under the constitution's platform-required locations exception? → A: Yes. Both use the Principle III exception (constitution v1.3.0), reusable logic stays in portable top-level folders wherever it can, and the plan records it as an exception, not a violation.
- Q: How should we measure whether the opt-in guide is good enough, given that the walkthrough deliberately doesn't enable another repository? → A: A second maintainer's walkthrough finds no missing step or prerequisite. The 30-minute target is dropped.
- Q: What should the spec require when Qodo PR-Agent's comment might repeat a secret that appears in a PR's changes? → A: Record it as a known limitation, with a documented response: a maintainer deletes the comment, rotates the exposed secret, and uses the kill-switch if it recurs.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Governed Qodo PR-Agent pilot on this repository (Priority: P1)

A LightSpeed maintainer opens or updates a pull request in `lightspeedwp/.github` and, without doing anything else, receives a generated description and code-improvement suggestions from Qodo PR-Agent. CodeRabbit continues to provide the code review. The output follows organisation rules: UK English, canonical prefixed labels only, and no secrets exposed. The maintainer can also trigger any other Qodo PR-Agent command on demand by commenting on the PR.

**Why this priority**: Nothing else can be integrated until the tool is installed, secured and producing trustworthy output somewhere. A single-repository pilot proves the value and the cost before any wider rollout.

**Independent Test**: Open a test PR on a correctly named branch in this repository and confirm that:

- an automatic description and improvement suggestions appear, but no automatic Qodo review verdict;
- a comment command (e.g. ask) receives a reply;
- no non-canonical label is applied;
- nothing runs on draft PRs or bot-authored PRs.

**Acceptance Scenarios**:

1. **Given** a non-draft PR opened by a human, **When** the PR is opened or marked ready for review, **Then** Qodo PR-Agent posts one description update and one set of improvement suggestions within 10 minutes, and does not post an automatic review verdict.
2. **Given** an open PR, **When** a maintainer comments with a supported Qodo PR-Agent command, **Then** the corresponding tool runs and replies on that PR.
3. **Given** a PR authored by `dependabot[bot]` or `lightspeed-docs-bot[bot]`, or a PR in draft, **When** it is opened or updated, **Then** no automatic Qodo PR-Agent run occurs, matching the existing CodeRabbit exclusions.
4. **Given** the language-model credential is missing or invalid, **When** a run is triggered, **Then** the check reports a clear, non-blocking warning and does not fail or block the PR, following the existing "warn, don't fail" convention for AI keys.
5. **Given** a PR from a fork or an untrusted contributor, **When** it triggers Qodo PR-Agent, **Then** no repository secret is exposed to code from that PR.

---

### User Story 2 - Clear division of labour with existing AI review (Priority: P1)

A reviewer looking at a PR sees complementary, non-duplicated AI feedback. It is documented which concerns CodeRabbit owns and which Qodo PR-Agent owns (for example description, code suggestions, or changelog). Contributors therefore know which bot to address and do not get two competing reviews of the same thing.

**Why this priority**: CodeRabbit is the organisation's governed, central reviewer (constitution Principle I, `.coderabbit.yml`). Adding a second reviewer without defined responsibilities doubles noise and cost and undermines trust in both.

**Independent Test**: Review five pilot PRs and confirm that no concern is flagged by both tools as a primary finding, and that the responsibility matrix accounts for every automatic Qodo PR-Agent output.

**Acceptance Scenarios**:

1. **Given** the responsibility matrix, **When** a PR receives feedback from both tools, **Then** each automatic output maps to exactly one owning tool in the matrix.
2. **Given** a tool is set to "on-demand only" in the matrix, **When** a PR is opened, **Then** that tool does not run automatically.

Relationship to CodeRabbit: Qodo PR-Agent **complements** CodeRabbit; it does not replace it. CodeRabbit keeps primary code review (correctness, security, standards, and `.coderabbit.yml` path guidance). Qodo PR-Agent owns diff-based PR descriptions, code-improvement suggestions, on-demand questions and changelog drafting. Qodo PR-Agent's own review tool does not post an automatic, standalone review verdict. It runs on demand, or as an input to the LightSpeed review skill and agents (User Story 3).

---

### User Story 3 - Existing agents and skills can invoke and consume Qodo PR-Agent (Priority: P2)

An engineer or AI agent working through an existing LightSpeed agent or skill can call the relevant Qodo PR-Agent tool as a step in its workflow and act on the result. The Qodo PR-Agent command is not a parallel, disconnected path.

**Why this priority**: This is the "integrate with our various existing agents and skills" goal. Its value depends on Story 1 being in place.

**Independent Test**: For each integration point in the table below, run the named agent or skill against a test PR. Confirm it can request the Qodo PR-Agent output, receive it, and use it in its own result. Also confirm the agent still works when Qodo PR-Agent is unavailable.

**Integration map** (scope of this feature; each row is independently deliverable):

| Qodo PR-Agent tool | Existing LightSpeed asset | Intended integration |
| --- | --- | --- |
| review | `skills/pr-review`, `agents/reviewer-agent/` | Qodo review becomes an input to the LightSpeed review, which applies org standards on top. It does not run as a separate verdict. |
| improve | `skills/gh-address-comments`, `agents/address-comments.agent.md` | Suggestions are triaged and addressed through the existing comment-resolution flow. |
| describe | Internal PR agent (`agents/pr-agent/`, spec 015 US2: PR body derived from the diff) | Offered as a diff-summary source. The internal PR agent keeps ownership of template routing and the final body. |
| review / improve findings | Internal PR agent's self-review gate (spec 015 US2) | Findings count as the "AI-review findings" the gate checks. |
| generate labels | `agents/labeling-agent/`, `skills/label-governance` | Label suggestions are filtered through the canonical label set before anything is applied. |
| update changelog | `agents/changelog-agent/`, `skills/changelog-generator`, changelog gate | Proposed entries must pass the existing changelog validation (≤250 characters, user-focused, linked to a PR or issue). |
| similar issues | `agents/issue-agent/`, `skills/ticket-triage` | **Deferred** (see plan research R8). The upstream tool is experimental, needs OpenAI embeddings and isn't in the Action image. When delivered, duplicate candidates are surfaced during triage for a human to confirm, and issues are never closed automatically. |
| add docs | `agents/document-reviewer-agent/`, `skills/documentation-writer` | On-demand only; output is reviewed by the documentation agent. |
| ask | `skills/pr-review`, `agents/qa-subagent.agent.md` | Available as an on-demand question tool inside review and QA flows. |
| (all) | AI feedback validation process (`workflows/ai-feedback-validation.yml`) | Qodo PR-Agent feedback is recognised as AI review feedback and recorded under the same process as CodeRabbit feedback. |

**Acceptance Scenarios**:

1. **Given** an integrated agent or skill, **When** it runs against a PR, **Then** it can obtain the mapped Qodo PR-Agent output and reflect it in its own result.
2. **Given** Qodo PR-Agent is unavailable (no credential, outage, or rate limit), **When** an integrated agent or skill runs, **Then** it completes with its existing behaviour and states that Qodo PR-Agent input was skipped.
3. **Given** Qodo PR-Agent suggests a label outside the canonical set, **When** the labelling integration processes it, **Then** that label is dropped and recorded; it is never created or applied.
4. **Given** Qodo PR-Agent proposes a changelog entry that breaks the changelog rules, **When** it is processed, **Then** it is rejected with the specific failing rule and never committed.

---

### User Story 4 - Organisation-standard configuration that other repositories can adopt (Priority: P3)

A maintainer of another LightSpeed repository can enable Qodo PR-Agent by referencing a central, versioned configuration from this control plane. They inherit the organisation's defaults: UK English, technology-agnostic review guidance, canonical labels, exclusions, and which tools run automatically. They can override a setting only for a documented, repository-specific reason.

**Why this priority**: Portability across 50+ repositories is the long-term value (constitution Principles I and III), but it should follow a proven pilot.

**Independent Test**: Confirm that the pilot in `lightspeedwp/.github` runs entirely from the central configuration, with no repository-specific settings. Then walk through the opt-in guide against a non-`.github` repository without enabling it, and confirm that every step and prerequisite needed to enable it is documented.

**Acceptance Scenarios**:

1. **Given** a repository that references the central configuration, **When** a PR is opened, **Then** Qodo PR-Agent behaves identically to the pilot unless that repository has a documented override.
2. **Given** the central configuration changes, **When** a consuming repository next runs Qodo PR-Agent, **Then** it picks up the change without a per-repository edit (or on the next pinned-version bump, if pinning is chosen).
3. **Given** the central review guidance, **When** it is audited, **Then** it contains no framework- or language-specific rules (Principle IV).

Rollout scope: this feature enables Qodo PR-Agent on `lightspeedwp/.github` only. Other repositories are **not** enabled as part of this feature. The central configuration and opt-in guide are delivered ready for them, and each later enablement is a separate, follow-up change. Acceptance scenarios 1 and 2 are validated against the pilot, which consumes the central configuration exactly as a future repository would.

---

### User Story 5 - Documented operation, cost visibility and exit path (Priority: P3)

The organisation owner can see how often Qodo PR-Agent runs, roughly what it costs, and how contributors rate its usefulness. There is a documented way to turn it off per repository or organisation-wide within minutes.

**Why this priority**: Metrics-driven governance (Principle X) and cost control. This is required before the pilot can become a permanent standard.

**Independent Test**: After two weeks of pilot operation, produce a report of runs per tool, estimated spend and usefulness feedback. Then disable Qodo PR-Agent with the documented procedure and confirm that no further runs occur.

**Acceptance Scenarios**:

1. **Given** the pilot has run for 14 days, **When** the owner requests a report, **Then** it shows runs per tool, failure count and estimated spend.
2. **Given** a need to stop Qodo PR-Agent, **When** the documented kill-switch is used, **Then** no new runs start on any enabled repository within 15 minutes.

---

### Edge Cases

- **Very large PRs** (for example more than 25 files or 800 lines, the org hard-flag threshold): Qodo PR-Agent must degrade gracefully, reviewing a subset and saying so. It must not fail or post truncated output without noting the truncation.
- **Rate limits and spend caps** on the language-model provider: runs are skipped with a visible notice and never retried endlessly.
- **Command collisions**: comment commands must not trigger CodeRabbit, Copilot or other bots, and other bots' commands must not trigger Qodo PR-Agent.
- **Loops**: Qodo PR-Agent output and bot-authored commits must never re-trigger Qodo PR-Agent or the internal agents.
- **Description overwrites**: if a PR body follows a routed PR template, an automatic describe must not remove required template sections. It adds content, or it runs on demand only.
- **LOCKED files**: Qodo PR-Agent suggestions touching `.github/labels.yml`, `.github/issue-types.yml` or issue/PR templates are informational only and never auto-applied.
- **Forbidden branch prefixes** (`claude/`, `copilot/`, `openai/`): Qodo PR-Agent does not replace branch validation. Such PRs still fail the existing gate.
- **Secrets or sensitive content in diffs**: the model's output can't be guaranteed never to repeat a secret from the diff, so this is a known limitation. `docs/QODO_PR_AGENT.md` MUST document the response: a maintainer deletes the comment, rotates the exposed secret, and uses the kill-switch if it happens again. The workflow's own logs already mask the model credential.
- **Tool outage mid-run**: partial output is marked incomplete and does not block merge.

## Requirements *(mandatory)*

### Functional Requirements

**Installation & security**

- **FR-001**: The organisation MUST have Qodo PR-Agent installed and operational on `lightspeedwp/.github` using the open-source (self-managed) distribution, running inside the organisation's own CI on PR and comment events. It MUST NOT depend on a separately hosted server, a paid hosted plan or the Qodo-hosted app.
- **FR-002**: The language-model credential MUST be a dedicated Anthropic API key used only by Qodo PR-Agent, stored as the organisation or repository secret `ANTHROPIC_API_KEY_QODO_PR_AGENT`. Keyless Workload Identity Federation MAY be configured as an alternative; it creates a short-lived token for each run and stores no key. When both are configured, the stored key MUST take precedence. A credential or token MUST NOT appear in configuration files, logs or PR comments.
- **FR-003**: Qodo PR-Agent MUST run with least-privilege permissions, and any third-party action it depends on MUST be pinned to an immutable version, consistent with existing workflow standards.
- **FR-004**: Code from forked or untrusted PRs MUST NOT be able to read repository secrets through Qodo PR-Agent runs.
- **FR-005**: Automatic runs MUST be skipped for draft PRs and for the bot authors already excluded from CodeRabbit.
- **FR-006**: A missing, invalid or rate-limited credential MUST result in a clear, non-blocking notice rather than a failed required check.

**Behaviour & governance**

- **FR-007**: All Qodo PR-Agent output MUST be in UK English.
- **FR-008**: Qodo PR-Agent MUST NOT create labels, and MUST NOT apply any label outside the canonical, prefixed set in `.github/labels.yml`.
- **FR-009**: Qodo PR-Agent MUST NOT commit to branches, merge, approve, or dismiss reviews. All code or changelog changes it proposes MUST go through a human or an existing governed agent.
- **FR-010**: CodeRabbit MUST remain the primary automatic code reviewer, and Qodo PR-Agent MUST NOT post an automatic standalone review verdict. A responsibility matrix MUST define, for each Qodo PR-Agent tool, whether it runs automatically, on demand, or not at all, and which tool (CodeRabbit, Qodo PR-Agent or an internal agent) owns each review concern.
- **FR-011**: The central review guidance given to Qodo PR-Agent MUST be technology-agnostic and consistent with, not duplicating, the guidance in `.coderabbit.yml` and AGENTS.md.
- **FR-012**: Qodo PR-Agent's automatic description MUST preserve the sections of the routed PR template.

**Integration with existing agents & skills**

- **FR-013**: Each integration row in User Story 3 MUST be documented in the owning agent's or skill's own entrypoint (`AGENT.md` / `SKILL.md`): when it calls Qodo PR-Agent, what it does with the output, and how it behaves without it.
- **FR-014**: Integrated agents and skills MUST treat Qodo PR-Agent as an optional input and keep working when it is unavailable.
- **FR-015**: Label and changelog output from Qodo PR-Agent MUST pass through the existing labelling and changelog validation before any effect is applied.
- **FR-016**: Qodo PR-Agent feedback MUST be recognised by the existing AI feedback validation process in the same way as CodeRabbit feedback.
- **FR-017**: A single reusable skill (or an equivalent shared entrypoint) MUST let any agent request a named Qodo PR-Agent tool for a given PR and receive its result. This prevents each agent from re-implementing the call.

**Portability, operations & documentation**

- **FR-018**: Reusable logic (the shared skill and its runner) MUST live in the portable top-level folders (Principle III). The reusable run definition MUST live in `.github/workflows/`, and the central configuration at the repository root as `.pr_agent.toml`, under the Principle III platform-required locations exception, because GitHub and Qodo PR-Agent only load them from there. All of them MUST be consumable by other repositories, and the reusable run definition MUST be documented as callable.
- **FR-019**: Consuming repositories MUST be able to override individual settings with a documented reason, and all overrides MUST be discoverable.
- **FR-020**: Qodo PR-Agent MUST be switchable off per repository and organisation-wide through a documented procedure.
- **FR-021**: Run counts per tool, failures and estimated spend MUST be reported, feeding the existing metrics and reporting practice.
- **FR-022**: Human documentation in `docs/` MUST explain what Qodo PR-Agent does, the available commands, the responsibility matrix, and how it differs from the internal PR agent.
- **FR-023**: Any change this feature needs to a LOCKED file (for example a new label or template section) MUST be raised as a tagged change-request issue, not edited directly.

### Key Entities

- **Qodo PR-Agent tool**: one of describe, review, improve, ask, add docs, generate labels, similar issues, update changelog, or help. Attributes: trigger mode (automatic / on demand / disabled), owning concern, consuming LightSpeed asset.
- **Responsibility matrix**: maps each review concern to exactly one owning tool across CodeRabbit, Qodo PR-Agent and internal agents.
- **Central configuration**: the organisation-standard Qodo PR-Agent settings (language, model provider, exclusions, auto-run tools, review guidance, label constraints). It is versioned in this repository.
- **Repository override**: a per-repository deviation from the central configuration, with a recorded justification.
- **Integration point**: a pairing of a Qodo PR-Agent tool with an existing agent or skill, plus its fallback behaviour.
- **Run record**: one Qodo PR-Agent execution: repository, PR, tool, outcome, and estimated cost.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of eligible (non-draft, human-authored) pilot PRs receive their automatic Qodo PR-Agent output within 10 minutes of opening or being marked ready.
- **SC-002**: 0 non-canonical labels are applied, and 0 secrets are exposed, across the whole pilot.
- **SC-003**: 0 PRs are blocked from merging solely because Qodo PR-Agent was unavailable.
- **SC-004**: At least 70% of surveyed maintainers rate Qodo PR-Agent output as useful after a 14-day pilot, and fewer than 20% of its automatic comments are marked as duplicating another bot's.
- **SC-005**: Every integration point in User Story 3 has documented fallback behaviour, and each passes an "unavailable" test.
- **SC-006**: A second maintainer walks through the opt-in guide against a non-`.github` repository, without enabling it, and finds no missing step or prerequisite. The guide relies only on the central configuration and the documentation. Actually enabling another repository is outside this feature's scope.
- **SC-007**: The kill-switch stops all new runs within 15 minutes of use.
- **SC-008**: Monthly Qodo PR-Agent spend is reported and stays within a budget agreed by the organisation owner before any repository beyond the pilot is enabled.

## Assumptions

- The open-source Qodo PR-Agent is used, not the paid Qodo Merge hosted product. It runs inside the organisation's own CI, triggered by PR and comment events. No self-hosted GitHub App or webhook server is built, and the Qodo-hosted app is not used, so diffs go only to the organisation's chosen model provider. Replies may take a few minutes because each run starts fresh, which is accepted (see SC-001).
- Anthropic Claude models are the default provider, following the organisation's `ANTHROPIC_API_KEY*` secret naming convention. A dedicated key keeps Qodo PR-Agent spend separate and lets it be revoked or capped on its own. Other providers remain possible through configuration.
- CodeRabbit stays in place as the primary reviewer. Replacing it is out of scope for this feature.
- The internal PR agent (spec 015) keeps ownership of PR creation, branch validation, template routing and final label application. This feature does not change spec 015's scope; it only adds optional inputs to it.
- No new labels are needed for the pilot. If any are later wanted (e.g. an opt-out label), they go through the `[LABEL-UPDATE-REQUEST]` process.
- Qodo PR-Agent's own help and configuration commands are available to maintainers only, not to anonymous commenters.
- Maintainer usefulness feedback is gathered with a lightweight method, such as reactions or a short survey. A formal feedback system is out of scope.
- Enabling Qodo PR-Agent on any repository other than `lightspeedwp/.github` is out of scope; each later enablement is a follow-up change.
- GitLab, Bitbucket, Azure DevOps and Gitea support is out of scope; LightSpeed uses GitHub only.
