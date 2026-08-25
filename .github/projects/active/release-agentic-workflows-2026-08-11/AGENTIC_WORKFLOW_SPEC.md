# GitHub Agentic Workflows Release Agent — Specification

## Executive Summary

This document specifies the design of the **GitHub Agentic Workflows Release Agent**, which augments the existing shell-based release process (Phases 1-4) with LLM-driven orchestration, improved UX, and safety guardrails.

**Key Points:**

- **Augmentation Strategy:** Agentic workflow wraps existing shell scripts; no breaking changes
- **Scope:** Full (patch + minor + major releases) with tiered approval gates
- **Safety-First:** Multiple layers of validation + deterministic fallback
- **Long-term Vision:** Agentic for control plane (interactive); portable agents for plugins/themes (CI/CD)

---

## Design Decisions

### Decision 1: AUGMENT vs. Replace vs. Parallel

**Decision:** AUGMENT (wrap shell scripts with agentic orchestration)

**Rationale:**

- ✅ Preserves Phase 4 foundation (proven, tested, deployed)
- ✅ Maintains fallback to shell scripts (safety valve)
- ✅ Leverages authorization gating already implemented
- ✅ Fast time-to-value (weeks, not months)
- ⚠️ More integration points (requires testing)

**Trade-off Diagram:**

```
REPLACE    │ High risk, high reward
           │ (complete rewrite, lose all fallbacks)
           │
AUGMENT    │ ✅ CHOSEN: Medium risk, good reward
           │ (wrap + call existing code, keep safety)
           │
PARALLEL   │ Low risk, low reward
           │ (learn by doing, but duplicated effort)
```

**Implementation:**

```
.github/agentic-workflows/release.md (NEW)
  ↓ orchestrates
.github/workflows/release.yml (EXISTING)
  ↓ calls
scripts/workflows/release/run-release-agent.cjs (EXISTING)
  ↓ uses
scripts/validation/validate-changelog.cjs (EXISTING)
scripts/agents/includes/changelogUtils.cjs (EXISTING)
```

### Decision 2: Target Repositories (Single or Multi-repo?)

**Decision:** Single-repo agentic workflow for control plane; portable agents for plugins/themes

**Rationale:**

- Control plane (`.github`): Interactive, human-driven → agentic is ideal
- Plugins/Themes: CI/CD-driven, deterministic → portable agents are ideal
- Complexity: Keep agentic focused on one use case (control plane)
- Reusability: Portable agents already provide multi-repo support

**Scope:**

```
PHASE 5A (Agentic Workflows):
  .github repository (control plane only)
    ├─ Single agentic workflow: .github/agentic-workflows/release.md
    ├─ Targets: control plane releases
    └─ Triggers: manual gh CLI, GitHub Copilot chat, workflow_dispatch

PHASE 5 (Portable Agents) — parallel:
  agents/release/ (multi-repo support)
    ├─ Reusable agent code: agents/release/index.js
    ├─ Targets: control plane, plugins, themes
    └─ Used by: CI/CD pipelines, scheduled releases, agentic workflows

PHASE 6 (WordPress Support):
  agents/changelog/ (changelog utilities)
    ├─ WordPress-specific handling: plugin headers, theme CSS versions
    └─ Shared: both agentic and portable agents can use
```

### Decision 3: Scope — Patch / Minor / Major

**Decision:** FULL scope (patch + minor + major) with tiered approval gates

**Rationale:**

- ✅ Flexibility (handle all release types)
- ✅ Safety (gates scaled to risk level)
- ✅ Aligns with Phase 4 (which already supports all scopes)
- ⚠️ Requires careful testing (major releases are high-risk)

**Approval Tier System:**

```
PATCH Releases (lowest risk)
├─ User action: "gh release --scope=patch"
├─ Agentic checks:
│  ├─ Changelog valid + entries present ✓
│  ├─ Safety score ≥ 0.8 (integrity + threat detection) ✓
│  ├─ Version bump semantic (1.2.3 → 1.2.4) ✓
│  └─ No breaking changes mentioned in changelog ✓
├─ Approval: AUTO-APPROVE (if all checks pass)
└─ Fallback: Shell scripts still work

MINOR Releases (moderate risk)
├─ User action: "gh release --scope=minor --confirm-minor"
├─ Agentic checks:
│  ├─ Changelog valid + entries present ✓
│  ├─ Safety score ≥ 0.8 ✓
│  ├─ Version bump semantic (1.2.3 → 1.3.0) ✓
│  ├─ At least 1 merge commit on develop (code review evidence) ✓
│  └─ No accidental breaking changes ✓
├─ Approval: REQUIRE human review comment ("approved" / "LGTM")
└─ Fallback: Shell scripts still work

MAJOR Releases (highest risk)
├─ User action: "gh release --scope=major --confirm-major"
├─ Agentic checks:
│  ├─ Changelog valid + entries present ✓
│  ├─ Safety score ≥ 0.8 ✓
│  ├─ Version bump semantic (1.2.3 → 2.0.0) ✓
│  ├─ ADR documenting breaking changes exists ✓
│  ├─ On develop for 3+ days (stabilization) ✓
│  └─ Breaking changes documented in changelog ✓
├─ Approval: REQUIRE 2+ maintainers (separate approvals)
├─ Agentic suggestion: "This is MAJOR. Breaking changes detected: [list]. Confirm migration guide OK?"
└─ Fallback: Shell scripts still work
```

### Decision 4: AI Engine Selection

**Decision:** Multi-engine support (GitHub Copilot primary, Claude Code fallback)

**Rationale:**

- ✅ GitHub Copilot: Native integration, first-class agentic support
- ✅ Claude Code: Flexible, good reasoning for complex decisions
- ✅ Fallback: If Copilot API fails, use Claude
- ⚠️ Cost: ~$0.02 per release (negligible)

**Implementation:**

```
Agentic workflow input:
  --engine=copilot (default, uses GitHub Copilot API)
  --engine=claude (uses Claude Code API)
  --engine=auto (tries Copilot, falls back to Claude)

Prompt engineering:
  - Simple: Markdown workflow + safety instructions
  - Complex: Call shell scripts for mutations, AI for reasoning only
```

### Decision 5: Integration with Phase 4 Shell Scripts

**Decision:** Call existing shell scripts without modification; preserve all Phase 4 logic

**Rationale:**

- ✅ Zero risk to Phase 4 (no touching working code)
- ✅ All Phase 4 validation/logic preserved
- ✅ Fallback trivial (if agentic fails, shell still works)
- ✅ Testing simpler (test shell separately, test agentic wrapper)

**Script Call Chain:**

```
Agentic workflow (Markdown):
  1. Parse user input (scope, options)
  2. Check authorization (actor in maintainers team)
  3. Display: "I'll release vX.Y.Z (scope: patch)"
  4. Ask confirmation: "Ready?"
  5. Call: trigger-telemetry.cjs (validate auth)
  6. Call: run-release-agent.cjs (version bump, changelog)
  7. Display: "Created PR #1234, awaiting merge"
  8. If error: "Failed at step X. Try: npm run release -- --dry-run"

Phase 4 shell scripts (unchanged):
  - trigger-telemetry.cjs (authorization check)
  - run-release-agent.cjs (version bump, changelog update)
  - create-main-release-pr.cjs (PR to main)
  - create-github-release.cjs (publish release)
```

### Decision 6: Error Handling & Fallback

**Decision:** Fail-fast + suggest fixes; fallback to shell scripts available

**Rationale:**

- ✅ Clear error messages (LLM strength)
- ✅ Actionable suggestions (fix or rollback)
- ✅ Shell scripts remain operable fallback
- ✅ Audit trail of AI decisions

**Error Scenarios:**

```
SCENARIO: Changelog validation fails
├─ Agentic detects: Schema mismatch or missing entries
├─ Message: "❌ CHANGELOG.md schema error at line 42: [detail]"
├─ Suggestion: "Run: npm run validate:changelog"
├─ Fallback: User runs shell script manually
└─ Outcome: User fixes, retries

SCENARIO: Version conflict (tag already exists)
├─ Agentic detects: git tag v1.2.3 already present
├─ Message: "❌ Tag v1.2.3 already exists"
├─ Suggestion: "Delete old tag: git tag -d v1.2.3 && git push origin :refs/tags/v1.2.3"
├─ Alternative: "Or use --force to skip tag creation"
└─ Outcome: User fixes, retries

SCENARIO: AI prompt times out or fails
├─ Agentic detects: LLM API error (timeout, rate limit, etc.)
├─ Message: "⚠️ AI service unavailable. Using deterministic fallback."
├─ Fallback: Call shell scripts directly
└─ Outcome: Release completes via shell (no AI reasoning, but works)

SCENARIO: AI hallucinates version number
├─ Safety gate: Agentic output validated against version schema
├─ Check: "I decided vX.Y.Z. Is this valid semver?" (AI self-check)
├─ Integrity filter: GitHub's safe-outputs blocks unsafe mutations
├─ Outcome: Invalid version rejected, not applied
```

### Decision 7: Safety Gates & Validation

**Decision:** Multi-layer validation (changelog, version, agentic score, audit trail)

**Rationale:**

- ✅ Catches errors early (before mutations)
- ✅ Multiple validation points (defense in depth)
- ✅ Agentic score quantifies confidence
- ✅ Audit trail for compliance

**Safety Gate Stack (all releases):**

```
GATE 1: Pre-flight checks (before agentic decides)
├─ [ ] Branch is develop (correct starting point)
├─ [ ] No uncommitted changes (clean state)
├─ [ ] CHANGELOG.md exists + schema-valid
├─ [ ] VERSION file exists and is readable
└─ [ ] User is in maintainers team (authorization)

GATE 2: Agentic reasoning (AI decides next step)
├─ Prompt: "Review this release. Is it safe? Confidence: 0-100%"
├─ Inputs:
│  ├─ Changelog entries (recent changes)
│  ├─ Commit history (what was merged)
│  ├─ Breaking changes (if any)
│  └─ Version bump scope (patch/minor/major)
├─ Output: Agentic score (confidence %), decision (approve/reject), reason
└─ Threshold: Must be ≥ 0.8 (80% confidence) to proceed

GATE 3: Integrity filter (GitHub's built-in safety)
├─ Safe outputs: Verify AI output before mutations
├─ Integrity filter: Block untrusted AI suggestions
├─ Threat detection: Detect anomalies (e.g., "delete all repos")
└─ Verdict: Pass/Fail (safe outputs pass, unsafe rejected)

GATE 4: Version validation (semantic versioning rules)
├─ [ ] Version matches semver format (X.Y.Z)
├─ [ ] Not a duplicate (no existing tag vX.Y.Z)
├─ [ ] Logical bump (not backwards, not too big)
│  ├─ patch: (1.2.3 → 1.2.4) OK
│  ├─ minor: (1.2.3 → 1.3.0) OK
│  ├─ major: (1.2.3 → 2.0.0) OK
│  └─ invalid: (1.2.3 → 1.5.0 for patch) BLOCKED
└─ Verdict: Valid / Invalid

GATE 5: Changelog structure (ensure entries exist)
├─ [ ] [Unreleased] section exists
├─ [ ] Section has entries (not empty)
├─ [ ] Entries match allowed formats (Added, Changed, Fixed, etc.)
├─ [ ] No typos in section names
└─ Verdict: Valid / Invalid

GATE 6: Approval gates (scope-based)
├─ PATCH: Auto-approve if all gates pass
├─ MINOR: Require 1 human approval (review comment)
├─ MAJOR: Require 2+ human approvals
└─ Verdict: Approved / Pending / Rejected

GATE 7: Post-mutation validation (after tags created)
├─ [ ] Tag vX.Y.Z exists and points to correct commit
├─ [ ] GitHub Release created with notes
├─ [ ] PR #N created (release/vX.Y.Z → main)
├─ [ ] Changelog rolled (Unreleased → vX.Y.Z)
└─ Verdict: Success / Rollback needed
```

### Decision 8: Dry-Run & Testing Support

**Decision:** Dry-run mode generates preview artifacts; full rehearsal without mutations

**Rationale:**

- ✅ Test before committing
- ✅ Show user what will happen
- ✅ No side effects (no commits, tags, releases)
- ✅ Validates all gates without risky mutations

**Dry-Run Behavior:**

```
Command: gh agentic release --scope=patch --dry-run

Output:
├─ release-dry-run-plan.md (step-by-step what would happen)
├─ release-notes-preview.md (compiled release notes)
├─ version-bump-preview.txt (old version → new version)
├─ changelog-rolled.md (how CHANGELOG.md would look)
└─ No commits, tags, or PRs created

User can then:
├─ Review output artifacts
├─ Make adjustments if needed
└─ Run again without --dry-run to proceed
```

### Decision 9: Logging & Auditability

**Decision:** Log agentic decisions (reasoning, approvals, outcomes); redact secrets

**Rationale:**

- ✅ Compliance/audit trail
- ✅ Troubleshooting (why did release fail?)
- ✅ Security (detect unauthorized attempts)
- ⚠️ Privacy (don't expose AI prompts or internal reasoning)

**Logging Strategy:**

```
Log Levels:

INFO (always logged):
├─ Workflow triggered by @user at 2026-08-11T16:30:00Z
├─ Scope: patch, dry_run: false
├─ Authorization: ✅ user in maintainers team
├─ Agentic decision: APPROVE (score 0.92)
├─ Approval gates: PASSED (patch auto-approved)
├─ Created: tag vX.Y.Z, PR #N, GitHub Release
└─ Outcome: SUCCESS

DEBUG (on request with --verbose):
├─ Changelog parsed: 5 entries in [Unreleased]
├─ Version calculation: 1.2.3 + patch = 1.2.4
├─ Gate status: all 7 gates PASS
├─ Agentic confidence: 0.92 (≥ 0.80 threshold)
└─ API calls: 3 calls to GitHub API (all successful)

REDACTED (never logged):
├─ Full agentic prompt (internal reasoning)
├─ API keys or tokens
├─ User's email or personal data
├─ Commit messages containing secrets
```

### Decision 10: Approval Flow (Patch vs. Minor vs. Major)

**Decision:** Tiered approval based on scope and risk

**Rationale:**

- ✅ PATCH: Low risk (docs, CI, perf) → auto-approve
- ✅ MINOR: Medium risk (new features) → human review
- ✅ MAJOR: High risk (breaking changes) → 2+ approvals
- ✅ Aligns with semantic versioning philosophy

**Approval Workflow:**

```
PATCH Release Flow:
  1. User: gh agentic release --scope=patch
  2. Agentic: All gates pass? Agentic score ≥ 0.8?
  3. Decision: YES to both → AUTO-APPROVE
  4. Outcome: Release created immediately (no PR, auto-merge)

MINOR Release Flow:
  1. User: gh agentic release --scope=minor
  2. Agentic: Create PR #N (release/vX.Y.Z → develop)
  3. Agentic: "Changelog looks good. Ready to bump to vX.Y.Z?"
  4. User: Review changelog, approve PR with comment "approved"
  5. Action: User merges PR #N
  6. Agentic: Detects merge → creates PR #N+1 (release/vX.Y.Z → main)
  7. User: Reviews PR #N+1, approves
  8. Action: User merges PR #N+1 → Release published

MAJOR Release Flow:
  1. User: gh agentic release --scope=major
  2. Agentic: Create PR #N (release/vX.Y.Z → develop)
  3. Agentic: "⚠️ MAJOR release detected. Breaking changes: [list]"
  4. Agentic: "Requires 2+ maintainer approvals. Ping @ash and @team?"
  5. User 1 (Ash): Review PR, approve with comment "approved #1"
  6. User 2 (other maintainer): Review PR, approve with comment "approved #2"
  7. Action: Both approvals present → User merges PR #N
  8. Agentic: Detects merge → creates PR #N+1 (to main)
  9. Action: User merges PR #N+1 → Release published

Fallback (if agentic unavailable):
  └─ Manual: npm run release -- --scope=patch (shell script path)
```

---

## Architecture Diagram

```
User Interaction Layer:
  gh agentic release --scope=patch
  gh release --scope=minor
  GitHub Copilot: "@release-agent patch"

Agentic Workflow Layer (.github/agentic-workflows/release.md):
  ├─ Parse inputs
  ├─ Pre-flight checks
  ├─ Agentic decision (invoke AI)
  ├─ Approval gates (scope-based)
  └─ Fallback to shell if needed

Integration Layer:
  ├─ Call Phase 4 shell scripts
  │  ├─ trigger-telemetry.cjs (auth)
  │  ├─ run-release-agent.cjs (version + changelog)
  │  └─ create-main-release-pr.cjs (PRs)
  └─ Call Phase 5 portable agents (optional)
     ├─ agents/release/index.js (multi-repo support)
     └─ agents/changelog/index.js (changelog utilities)

Safety Layer:
  ├─ GitHub integrity filter (blocks unsafe outputs)
  ├─ Threat detection (built-in)
  ├─ Safe outputs (validated before mutation)
  └─ Audit logging (all decisions recorded)

State Layer:
  ├─ Git commits (on develop → main)
  ├─ Git tags (vX.Y.Z)
  ├─ GitHub Releases (published notes)
  └─ GitHub PRs (for review)
```

---

## Safety Considerations

### What Could Go Wrong? (Risk Matrix)

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|-----------|
| AI decides to publish broken release | 🔴 CRITICAL | 🟡 Medium | Pre-release gates + human review for minor/major |
| AI hallucinates version numbers | 🔴 CRITICAL | 🟡 Medium | Integrity filter + version validation gate |
| AI leaks secrets in logs | 🔴 CRITICAL | 🟢 Low | Redact all sensitive data from logs |
| Agentic prompt injection (user crafts malicious input) | 🔴 CRITICAL | 🟢 Low | Validate inputs; use safe outputs |
| AI unavailable (API timeout/rate limit) | 🟡 MAJOR | 🟡 Medium | Fallback to shell scripts |
| Approval gate bypassed | 🟡 MAJOR | 🟢 Low | GitHub branch protection rules enforce gates |
| Version bump calculation error | 🟡 MAJOR | 🟢 Low | Semver validation gate |
| Duplicate tag conflict | 🟡 MAJOR | 🟢 Low | Check tag exists before creation |

### Mitigation Strategy

1. **Multiple validation layers** (7 gates, not just 1)
2. **LLM + deterministic checks** (AI + schema validation)
3. **Fallback always available** (shell scripts as safety valve)
4. **Human-in-loop for risk** (MINOR/MAJOR require approval)
5. **Safe outputs guarantee** (GitHub's integrity filter blocks unsafe mutations)
6. **Audit trail** (log all decisions for compliance)

---

## Implementation Constraints

### Must-Haves (Phase 5A)

- ✅ Works with Phase 4 shell scripts (no modifications)
- ✅ Preserves authorization gating (maintainers team)
- ✅ Supports dry-run mode
- ✅ Agentic score validation (≥ 0.8 threshold)
- ✅ Fallback to shell scripts if AI fails
- ✅ Audit logging (decisions + outcomes)
- ✅ Works for patch + minor + major scopes
- ✅ Tested on develop branch (not production-critical repos)

### Nice-to-Haves (Phase 5B+)

- 🔜 Multiple AI engines (Copilot, Claude, OpenAI, Gemini)
- 🔜 Integration with GitHub Copilot chat (interactive prompts)
- 🔜 Integration with Phase 6 (WordPress plugin/theme support)
- 🔜 Auto-suggestions for changelog improvements
- 🔜 Metrics + analytics on release patterns
- 🔜 Integration with Linear/GitHub Projects for tracking

### Out-of-Scope (Phase 5A)

- ❌ Multi-repo releases (use portable agents for that)
- ❌ Scheduled auto-releases (use CI/CD + portable agents)
- ❌ Rollback automation (shell script available, agentic suggests steps)
- ❌ Complex approval workflows (JIRA, Slack integration)

---

## Next Steps

1. **Finalize spec** (this document) → collect feedback
2. **Create RFC** (RFC_AGENTIC_WORKFLOWS.md) → design review
3. **Write implementation plan** (PHASE_5A_IMPLEMENTATION_PLAN.md) → task breakdown
4. **Build Markdown workflow** (.github/agentic-workflows/release.md) → executable code
5. **Test MVP** (dry-run, then live on develop) → validation
6. **Document for team** (RELEASE_PROCESS.md update) → onboarding

---

*Specification v1.0 — Approved 2026-08-11*  
*Built by 🧱 LightSpeedWP with ☕, 🚀, and agentic workflows!*
