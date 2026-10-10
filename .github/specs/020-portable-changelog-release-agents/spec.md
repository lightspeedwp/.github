# Feature Specification: Portable Changelog and WordPress Release Preparation Agents

**Feature Branch**: `docs/portable-changelog-release-agents`

**Created**: 2026-10-09

**Status**: Draft

**Input**: User description: "Create .github/specs/020-portable-changelog-release-agents and use the attached prompt (Spec Kit 020 verified issue/PR plan) to specify the spec."

## Scope and Delivery Boundaries

This specification defines a bounded, manually invoked **release-preparation MVP** (delivery priority 1) and a **standalone changelog MVP** (delivery priority 2), joined by an explicit, blocking verification handoff. It extends existing implementations; it does not rebuild them.

**In scope (executable MVP)**

- Release-preparation readiness and approved preparation edits for WordPress plugins, themes and enhancement repositories.
- Standalone changelog inspection, drafting, validation, release-entry preparation and separately approved bounded edits.
- The release-to-changelog verification request and handback.
- Reuse and hardening of the existing WordPress version utilities and the shipped changelog validation engine.

**Roadmap only (not executable spec 020 tasks)**

- Other first-wave agents (PRD, linting, PR, reviewer, testing, PageSpeed, design-partner, issue, reporting).
- Provider installation and marketplace distribution, release/rollback workflow automation, pilot rollouts and the later documentation restructure. These are tracked in `issue-map.md` and `delivery-plan.md` as separate, later, independently reviewable slices.

**Out of scope**

- Promising a same-day release, or inferring deployment from a merged preparation PR.
- A second changelog validation engine, a second release agent, or speculative deletion of existing utilities.
- Any change to locked governance files (labels, issue types, issue/PR templates, branch routing).
- Changes to GitHub or Linear records, commits, PRs, tags, releases or deployments, without separate approval.

## Clarifications

### Session 2026-10-09

- Q: How should a maintainer's approval of a preparation or changelog edit be recorded so the agent can prove an edit was approved before it writes anything? → A: Option A - a digest of the exact proposed edit, shown by the agent, supplied by the maintainer and rechecked before any write.
- Q: When a changelog agent is copied into another repository, where should it find the shared changelog checker it validates with? → A: Option B - always use a bundled copy pinned to a recorded version, and report that version in every result.
- Q: When the other agent gives no answer to a verification request, how long should the release agent wait before counting it as not received? → A: Option A - not received means no response was returned within the same invocation; there is no timer.
- Q: What counts as the required checks that must be present before the release agent reports a repository ready? → A: Option A - the checks named in the target repository's own instructions or CI configuration; if none are named, readiness is not ready with `missing-check`, because nothing can be verified.
- Q: How should the release agent recognise a repository as an enhancement rather than a plugin or theme? → A: Option C - only when the target's own instructions declare it and name its version fields; otherwise it stops as `component-unknown`.

### Session 2026-10-10

- Q: When a repository's own instructions don't say which version field is authoritative, should the release agent stop and list every version it found, or fall back to a built-in order? → A: Option A - stop as ambiguous and report every version found with its source; no fallback order exists.

## Release Process Contract (guidance, not execution permission)

This section states the contract the agents are built around. It does not authorise any agent to tag, push, publish or deploy; those are outside the executable MVP.

- **Invariant**: no tag is created before reviewed release changes are merged into the authoritative main release commit.
- **Typical flow**: clean validated preparation; an approved preparation PR into the integration branch if required; a release branch from the accepted integration state; a reviewed release PR to main; verification of the merged main SHA and version; one immutable annotated version tag; approved publication; a reviewed main-to-develop backmerge that retains legitimate develop work.
- **Not forced**: targets are not required to share one branch flow. Each target's own instructions and owner decision determine its actual branching and gates.
- **Never**: push a tag during preparation and retag later, bypass protected branches, force-reset, equate "no drift" with identical branch tips, or equate GitHub publication with live deployment. Required checks and maintainer reviews stay required where configured.
- **Existing contradiction**: current release documentation describes both a single-PR and a two-PR flow. The documentation slice resolves this by stating the invariant above once and allowing target-specific flow; this specification does not edit those documents.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Release preparation readiness (Priority: P1)

A maintainer points the release agent at a target WordPress plugin, theme or enhancement repository (by explicit repository root) and asks whether it is ready to prepare for release. The agent reports readiness without writing anything. Only after the maintainer separately approves does it apply allowlisted, recoverable preparation edits.

**Why this priority**: Release preparation is delivery priority 1. A false "ready" result or a partially updated version set is the most damaging failure, so the safe, read-only readiness check is the first value delivered.

**Independent Test**: Run the agent in dry-run mode against fixtures for a plugin, a theme, an enhancement and an ordinary repository, with the working directory set somewhere other than the target. Confirm correct detection and readiness output, and confirm zero writes.

**Acceptance Scenarios**:

1. **Given** a plugin or theme repository with consistent version fields, **When** the maintainer requests a dry run with an explicit repository root, **Then** the agent reports readiness for that target and makes no file or git changes.
2. **Given** a process working directory that differs from the requested repository root, **When** the agent runs, **Then** every filesystem and git operation applies to the requested root only.
3. **Given** a repository with no optional `VERSION` file, **When** the agent detects the component, **Then** detection and readiness still succeed using the authoritative plugin header, theme stylesheet, readme or package fields.
4. **Given** an ordinary WordPress repository that merely contains `.github`, `package.json` and `VERSION`, **When** the agent evaluates it, **Then** it is not misidentified as a governance repository.
5. **Given** version fields that disagree (drift) or authoritative headers that are ambiguous, **When** readiness is checked, **Then** the agent stops, names the conflicting sources and files, and does not report ready.
6. **Given** a dirty working tree, missing required checks, an unsafe path, or conflicting version/tag evidence, **When** readiness is checked, **Then** the agent stops with a meaningful error and takes no staging, stashing or remote action.
7. **Given** an approved preparation edit that fails part-way, **When** the failure is detected, **Then** the agent reports the failure, does not present the result as ready, and leaves the repository recoverable.

---

### User Story 2 - Standalone changelog preparation (Priority: P2)

A maintainer uses the changelog agent on its own, without any release workflow, to inspect a changelog, draft entries, validate them and prepare a release entry. Edits are applied only when separately approved and are bounded.

**Why this priority**: The changelog agent is delivery priority 2 and must work locally without unbuilt `changelog.yml` or `release.yml` workflows. Future workflows may enforce per-PR use later.

**Independent Test**: Run the agent against fixtures (well-formed, malformed, repeated-run, empty-Unreleased) in inspect and draft modes, then apply one approved edit and confirm only that edit occurred.

**Acceptance Scenarios**:

1. **Given** a changelog with entries under Unreleased, **When** the maintainer asks for a draft, **Then** the agent proposes release entries and changes no file.
2. **Given** an entry using a category outside Added, Changed, Deprecated, Removed, Fixed or Security, **When** validated, **Then** it is reported as invalid with the allowed categories listed.
3. **Given** the shipped validation engine, **When** the agent validates, **Then** it uses that engine and no second validation implementation exists.
4. **Given** an approved bounded edit, **When** applied, **Then** historic entries and links are preserved unchanged.
5. **Given** the agent is run twice with no new changes, **When** Unreleased handling executes the second time, **Then** the result is unchanged (idempotent).
6. **Given** neither `changelog.yml` nor `release.yml` exists, **When** the agent runs locally, **Then** all MVP behaviour still works.

---

### User Story 3 - Blocking release-to-changelog handoff (Priority: P1)

When release preparation reaches the changelog step, the release agent explicitly asks the changelog agent to verify the changelog. The release agent treats the verification result as blocking evidence and only proceeds on recorded success.

**Why this priority**: Without a fail-closed handoff, preparation could be reported ready while the changelog is unverified. This is the integration point that makes the two MVPs one safe flow. Sequencing: this story depends on the changelog verification operation delivered by User Story 2, so it is built after US2 even though its safety value ranks it P1.

**Independent Test**: Simulate success, failure, and no response within the same invocation; confirm the release agent reports ready only on recorded success.

**Acceptance Scenarios**:

1. **Given** the changelog agent returns verification success with evidence, **When** the release agent receives it, **Then** readiness may be reported complete.
2. **Given** verification fails, is missing or is not received, **When** the release agent evaluates handback, **Then** it reports not ready and names the missing or failing evidence.
3. **Given** the changelog agent is unavailable, **When** release preparation is run, **Then** the agent fails closed and never silently falls back or skips the gate.
4. **Given** the MVP flow, **When** it runs, **Then** it requires no new labels and no event services.

---

### User Story 4 - Portable, self-contained packaging (Priority: P2)

A maintainer copies the two agents into another repository or user environment. Each is a coherent package with one canonical agent definition, a README, an agent changelog and namespaced skills, and it works without depending on a checkout of this governance repository.

**Why this priority**: Portability is the purpose of the work, but it is only valuable once the behaviour in Stories 1-3 is correct.

**Independent Test**: Install the packages into a clean location that has no `~/.github` checkout and confirm they resolve all needed resources and run.

**Acceptance Scenarios**:

1. **Given** a copied Claude adapter, **When** it runs outside the governance checkout, **Then** it resolves its resources without relying on thin relative references into that checkout.
2. **Given** an existing release or WordPress utilities capability, **When** callers and exports are inventoried, **Then** the WordPress utilities become reused and hardened adapter functionality, with callers and tests migrated before any removal.
3. **Given** a skill package, **When** validated, **Then** it conforms to the skill standard; the agent envelope as a whole is not forced into that standard.

---

### User Story 5 - Verified delivery plan for the work (Priority: P3)

A governance maintainer reviews a traceable plan that maps existing GitHub issues to bounded roles and to one-PR-per-slice branch profiles, so existing work is reused rather than duplicated and no record changes without approval.

**Why this priority**: The plan makes delivery governable but does not itself change runtime behaviour.

**Independent Test**: Review `issue-map.md` and `delivery-plan.md` against live issue and PR records and confirm every entry has a URL, current state, proposed change and approval preview, with no fabricated numbers.

**Acceptance Scenarios**:

1. **Given** an existing issue that fits a role, **When** the map is produced, **Then** it proposes repurposing that issue rather than creating a replacement.
2. **Given** any proposed issue, label, type or assignment change, **When** presented, **Then** it appears as an exact preview that requires separate approval.
3. **Given** a PR profile, **When** documented, **Then** it states branch, base, title, template, labels, assignee, prerequisites and closure rule, using the repository's current routing and flagging any template-label conflict for maintainer resolution.

### Edge Cases

- Plugin and theme markers both present, or neither present.
- Authoritative header missing, duplicated or contradicting `readme` stable-tag, `style.css` version or package version.
- A `VERSION` file present but disagreeing with headers.
- Repository root path containing symlinks, relative segments or characters that escape the root.
- Existing tag already present, or local and remote tag evidence conflicting.
- Changelog missing, empty, or containing only Unreleased with no entries.
- Changelog edited by hand between draft and apply.
- Approved edit interrupted part-way (some files updated, others not).
- Repository access denied for a target (for example a permission boundary on a pilot repository): affected checks remain blocked, not skipped.
- The proposed edit changes between the digest being shown and the write (for example a hand edit to a version file or the changelog): the digests no longer match and the agent writes nothing.
- The changelog agent returns no verification response within the same invocation: the release agent treats it as not received and reports not ready with `changelog-unverified`.
- A target repository names no required checks in its instructions or CI configuration: readiness reports not ready with `missing-check` rather than assuming success.
- A repository looks like an enhancement but its instructions do not declare it: the agent stops as `component-unknown` rather than guessing its packaging.
- Spec directory number 019 is reserved on an unmerged branch and must not be allocated.

## Requirements *(mandatory)*

### Functional Requirements

**Release preparation**

- **FR-001**: The release agent MUST operate in readiness (dry-run) mode by default and MUST NOT write files or change git state in that mode.
- **FR-002**: An explicit repository root MUST be propagated to every filesystem and git operation, independent of the process working directory.
- **FR-003**: The agent MUST detect plugin, theme and enhancement targets without requiring an optional `VERSION` file, and MUST NOT classify a repository as governance merely because it contains `.github`, `package.json` and `VERSION`. An enhancement is recognised only when the target's own instructions declare it and name its version fields; otherwise the agent MUST stop as `component-unknown`.
- **FR-004**: The agent MUST determine authoritative version sources (plugin header, readme, theme stylesheet, package, `VERSION`) from the target's own instructions, and MUST handle ambiguity and drift deterministically by stopping and naming the conflict rather than choosing silently. No built-in order of preference exists: when no field is designated, or sources disagree, the agent MUST stop as ambiguous and report every version found with its source, and the set of files it may edit is empty.
- **FR-005**: The agent MUST stop on a dirty working tree, missing required checks, unsafe paths, or conflicting version or tag evidence. Required checks are those named in the target repository's own instructions or CI configuration; if none are named the agent MUST report not ready with `missing-check`, because nothing can be verified.
- **FR-006**: The agent MUST NOT use broad staging, silent gate fallback, automatic stashing, or any remote effect.
- **FR-007**: Approved preparation edits (approval as defined in FR-029) MUST be limited to files the target's own instructions designate as version fields (for example the plugin header Version, readme Stable tag, theme stylesheet Version, package version, `VERSION`), and MUST NOT touch `CHANGELOG.md`, workflows or any other file. Before any write the agent MUST capture the original contents of every file it will edit. On any failure it MUST restore all of them and report per-file restored or failed. If restoration fails it MUST report `unrecoverable` naming the files and MUST NOT report ready; a partial version update MUST NOT be presented as ready. Every error MUST state a cause code, the repository-relative path and the next action.
- **FR-008**: The agent MUST treat preparation and readiness as its default purpose and MUST NOT perform automatic release execution, tagging or publication.

**Changelog**

- **FR-009**: The changelog agent MUST work standalone to inspect, draft, validate and prepare release entries, and MUST apply edits only when separately approved (as defined in FR-029) and bounded.
- **FR-010**: The agent MUST reuse the shipped changelog validation engine and MUST NOT introduce a second engine. A copied agent package MUST validate with a bundled copy of that engine pinned to a recorded version, and every validation result MUST state the engine version it used.
- **FR-011**: The agent MUST preserve historic entries and links, handle Unreleased idempotently, and accept only the categories Added, Changed, Deprecated, Removed, Fixed and Security. Entries MUST be at most 250 characters, user-focused and linked to a PR or issue (constitution Principle IX).
- **FR-012**: The local MVP MUST function without the unbuilt `changelog.yml` or `release.yml` workflows.
- **FR-013**: The five-operation shared-skill obligations carried by the existing changelog MVP issue MUST be preserved.

**Handoff**

- **FR-014**: The release agent MUST send an explicit verification request to the changelog agent and MUST treat the response as blocking evidence; missing, failed or unreceived verification MUST yield not-ready (fail closed). A response is "not received" when none is returned within the same invocation; no timer applies.
- **FR-015**: The handoff MUST require no new labels or event services for the MVP.

**Packaging and architecture**

- **FR-016**: Exactly two user-facing orchestration agents exist; the WordPress utilities become reused and hardened release adapter functionality after callers, exports and tests are migrated, with no speculative deletion.
- **FR-017**: Each agent package MUST contain one canonical `AGENT.md`, a `README.md`, an agent `CHANGELOG.md`, `package.json` and lockfile where the project convention requires, `scripts/`, namespaced `skills/<capability>/SKILL.md`, and a small Claude adapter; `references/` and `assets/` only for actual content, with no gratuitous includes, gates, shared, results, manifest or example trees and no invented dependencies.
- **FR-018**: The specification MUST resolve explicitly the distinct roles of working-instructions `AGENTS.md` and the definition `AGENT.md`, reuse the in-flight canonical-source migration, and keep module boundaries (no incidental CommonJS-to-ESM or TypeScript migration).
- **FR-019**: Copied agent packages MUST resolve all resources without a governance checkout and MUST NOT read secrets, hooks or cloud configuration.
- **FR-020**: Compatibility claims for Gemini, OpenAI and Copilot adapters MUST be backed by independent current documentation and tests; none is assumed.

**Testing**

- **FR-021**: Automated tests MUST use Jest beside JavaScript scripts (`scripts/__tests__/` or `scripts/adapters/__tests__/`) and Bash/Bats at the agent-root `tests/` with fixtures; no new test framework or language is introduced and existing Node-test, PHP and Playwright tests are not converted merely for placement.
- **FR-022**: Fixtures MUST cover plugin, theme and enhancement variation, an ordinary `.github` target, optional `VERSION`, ambiguous headers, drift, repeated runs, invalid paths, working directory differing from repository root, dry-run zero writes, fail-closed handoff and recoverable edit failures.

**Release-process contract (guidance, not execution permission)**

- **FR-023**: The specification MUST state the safe invariant that no tag is created before reviewed release changes are merged into the authoritative main release commit, and MUST describe the typical flow: validated preparation, approved preparation PR if required, release branch, reviewed release PR to main, verification of merged main SHA and version, one immutable annotated tag, approved publication, and a reviewed main-to-develop backmerge.
- **FR-024**: The specification MUST resolve the single-PR versus two-PR contradiction in current release docs, MUST NOT force identical branch flow on every target, and MUST NOT equate GitHub publication with live deployment or no drift with identical branch tips.

**Governance of the work itself**

- **FR-025**: Spec artefacts MUST be Markdown/design only, limited to the permitted allowlist, with a draft entry in the spec catalog that follows its actual schema; feature number 019 MUST NOT be allocated.
- **FR-026**: `issue-map.md` MUST map each existing issue to a bounded role with full URLs, current state, proposed repurpose, preserved history, task/story/path mapping, owner and decision gaps, native-type versus label distinction, and an exact approval preview; `delivery-plan.md` MUST give one profile per slice (branch, base, title, template, labels, assignee, closure rule, prerequisites), existing PR reuse, conditional stack plan, merge order and deferred phases; neither may contain fabricated issue/PR numbers or test results.
- **FR-027**: Locked governance files MUST NOT be edited; template and label conflicts MUST be presented for maintainer resolution.
- **FR-028** (roadmap, owned by the setup and distribution slices, not an MVP task): Installation MUST default to dry run, refuse name collisions, preserve user and project overrides, pin source and version, define upgrade and uninstall ownership, and never copy secrets, hooks or cloud configuration wholesale.
- **FR-029**: An edit is approved only when the maintainer supplies the digest of the exact proposed edit that the agent displayed. The agent MUST recompute the digest of the edit it is about to apply immediately before writing, MUST write only if the two digests match, MUST write nothing and report the mismatch otherwise, and MUST record the digest in its report.

### Key Entities

- **Target repository**: the plugin, theme or enhancement being prepared; identified by an explicit repository root.
- **Authoritative version source**: a header, readme, stylesheet, package or `VERSION` field designated by the target's instructions.
- **Readiness report**: the read-only outcome of a dry run, including detected type, version evidence, drift and blockers.
- **Preparation edit**: an approved, allowlisted, recoverable change to version fields.
- **Changelog entry / release entry**: an entry in one of the six allowed categories, linked to history that must be preserved.
- **Verification handoff**: the request and blocking response between the release and changelog agents.
- **Delivery slice**: one independently reviewable issue-to-PR unit (spec, consolidation, release MVP, changelog MVP, decisions, documentation, setup, distribution, workflows, rollback).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In every required fixture scenario, a dry run produces zero file or git-state changes.
- **SC-002**: With the working directory different from the target, 100% of filesystem and git operations in the fixtures act on the requested repository root.
- **SC-003**: Every drift, ambiguity, dirty-tree, unsafe-path and conflicting-tag fixture results in a not-ready outcome that names the specific cause; none results in a false ready.
- **SC-004**: Every interrupted-edit fixture ends with the repository recoverable and no result presented as ready.
- **SC-005**: Every missing, failed or unreceived changelog verification fixture yields not-ready; ready is reported only on recorded success.
- **SC-006**: The changelog flow completes all MVP fixtures with neither `changelog.yml` nor `release.yml` present, and a second run with no new changes alters nothing.
- **SC-007**: Historic changelog entries and links are byte-identical after every approved apply fixture.
- **SC-008**: A copied agent package runs in a clean location with no governance checkout present.
- **SC-009**: Each existing issue in scope is either repurposed in the issue map or explicitly dispositioned; zero replacement issues are proposed where an existing issue fits, and zero entries contain fabricated numbers.
- **SC-010**: No locked governance file, source code, package manifest, root version or root changelog is modified by this specification's pull request.
- **SC-011**: In every fixture where the supplied approval digest does not match the edit about to be applied, zero files are written.
- **SC-012**: Every changelog validation result, including each verification response, states the engine version used, and that version matches the recorded pin of the bundled copy.

## Assumptions

- Feature number 020 is final. Maintainer decision 2026-10-10: this specification keeps number 020 and does not take 019. Number 019 is reserved on the unmerged `aiops/qodo-pr-agent-integration` branch and is not allocated here. Develop was at `65a013b25eb4f81806496965adad8e3f458a34e5` at drafting; these refs are inspected facts, not permanent guarantees, and must be rechecked before the PR.
- Existing work is reused: the in-flight consolidation (issue 3880 / PR 3881, head `7e0bcaab55703f0866d1c063c0b6e7530b97b747`, open and blocked, not merged), merged PR 3820, and spec 016 with the shipped `.github/validation/changelog/` engine.
- Default delivery is S independent, existing consolidation finished, then release MVP and changelog MVP branched from refreshed develop; stacking the release MVP on PR 3881 happens only if it needs layout available exclusively there, and never on the Qodo reservation.
- Pilot repositories, installer behaviour, marketplace distribution, workflow restoration and rollback are later work owned by existing issues; no pilot architecture or code transfer is decided here.
- Live environment, version, deployment and rollback decisions remain unresolved and are not inferred.
- Archived release workflows are evidence only and not production-ready dependencies.
- Branch creation and the rename to `docs/portable-changelog-release-agents` followed the session branching hook; the branch was created from the current develop tip and no commit or push has occurred.

## Open Decisions for `/speckit-clarify`

These are recorded as decisions for the clarify stage rather than guessed:

1. Resolved 2026-10-10 (option A): when a target's own instructions are silent on version fields, the agent stops as ambiguous and reports every version found; there is no fallback order (FR-004).
2. Whether any release-preparation edit beyond version fields (for example changelog stamping) belongs to the release agent or only to the changelog agent.
3. Whether a plugin/theme adapter ships as one coherent module or two separately reviewed slices.
