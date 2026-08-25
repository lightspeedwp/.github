# Release Agent — GitHub Agentic Workflow

**Version:** 1.0 (Phase 5A, MVP)  
**Status:** SKELETON (to be filled during Phase 5A implementation)  
**Last Updated:** 2026-08-11

---

## Overview

This is the **GitHub Agentic Workflows definition** for the LightSpeed release agent. It orchestrates release automation by:

1. Parsing user intent (scope: patch/minor/major)
2. Running pre-flight safety checks
3. Invoking agentic reasoning (confidence scoring)
4. Calling Phase 4 shell scripts for mutations
5. Applying approval gates (scope-based)
6. Publishing releases with audit trail

**Approach:** AUGMENT (wrap shell scripts, don't replace)

---

## Inputs

```yaml
scope:
  description: Release type (patch|minor|major)
  default: patch
  
dry_run:
  description: Preview without mutations
  default: false

confirm_minor:
  description: User confirms minor release (required for --scope=minor)
  default: false

confirm_major:
  description: User confirms major release (required for --scope=major)
  default: false

engine:
  description: AI engine to use (copilot|claude|auto)
  default: copilot
```

---

## Outputs

```yaml
release_version:
  description: Semantic version released (e.g., 1.2.3)
  
release_branch:
  description: Branch name created (e.g., release/v1.2.3)

release_prs:
  description: PR numbers created (#N, #N+1)

github_release_url:
  description: Link to published GitHub Release

agentic_score:
  description: Confidence score from agentic reasoning (0.0-1.0)
```

---

## Workflow Steps

### Step 1: Initialize & Pre-flight

**Goal:** Validate environment before agentic reasoning

```
- Check branch is develop
- Verify no uncommitted changes
- Confirm user is in maintainers team
- Load VERSION and CHANGELOG.md
- Report: "Ready to release. Scope: patch"
```

### Step 2: Agentic Reasoning

**Goal:** Invoke AI to validate release safety

**Prompt Template:**

```
You are a release manager. Validate this release:

Release Scope: {scope}
Current Version: {version}
Next Version: {next_version}
Changelog Entries: {changelog_entries}
Commit History: {recent_commits}

Questions to answer:
1. Is the scope appropriate? (patch=docs/fix, minor=feature, major=breaking)
2. Are breaking changes documented?
3. Is the version bump semantic and correct?
4. Is the changelog populated?
5. Any security concerns?

Respond with:
{
  "approved": true/false,
  "confidence": 0.0-1.0,
  "reason": "string",
  "concerns": ["..."],
  "suggestions": ["..."]
}
```

**Output:**

```
Agentic Score: {confidence}
Decision: APPROVE / REJECT
Reason: {reason}
Concerns: [list any issues]
Suggestions: [recommended actions]
```

### Step 3: Gate 1 - Changelog Validation

**Goal:** Ensure changelog is schema-valid and populated

```bash
node scripts/validation/validate-changelog.cjs CHANGELOG.md
# Expected: Exit code 0, valid JSON schema

node scripts/agents/includes/changelogUtils.cjs --unreleased CHANGELOG.md
# Expected: Find [Unreleased] section with entries
```

**Verdict:** PASS / FAIL

### Step 4: Gate 2 - Version Validation

**Goal:** Verify version bump is semantic and unique

```
Check:
- Version format matches semver (X.Y.Z)
- No existing tag vX.Y.Z
- Bump is logical (not backwards, not too big)
  - patch: X.Y.Z → X.Y.(Z+1)
  - minor: X.Y.Z → X.(Y+1).0
  - major: X.Y.Z → (X+1).0.0
- No version collision with other branches
```

**Verdict:** PASS / FAIL

### Step 5: Gate 3 - Authorization Check

**Goal:** Verify user can trigger release (maintainers team)

```
Call: scripts/workflows/release/trigger-telemetry.cjs
Expected: Output trigger-telemetry.json with is_authorized: true
```

**Verdict:** PASS / FAIL

### Step 6: Gate 4 - Integrity Filter

**Goal:** Apply GitHub's safe-outputs validation

```
Check:
- No suspicious patterns in agentic output
- No command injection attempts
- No secret/credential leaks
- Version number is valid
```

**Verdict:** PASS / FAIL

### Step 7: Approval Gate (Scope-based)

**Goal:** Apply tiered approval based on release scope

**PATCH:**

```
if agentic_score >= 0.8 AND all_gates_pass:
  approval = AUTO_APPROVE
else:
  approval = REJECTED
```

**MINOR:**

```
Create PR #N (release/vX.Y.Z → develop)
Wait for: human review comment "approved"
Then: proceed to next step
If: no approval after 1 hour, abort
```

**MAJOR:**

```
Create PR #N (release/vX.Y.Z → develop)
Wait for: 2+ maintainer approvals
Then: proceed to next step
If: insufficient approvals, abort
```

### Step 8: Call Phase 4 Shell Scripts

**Goal:** Execute actual release operations (mutations)

```bash
# Step 8a: Trigger telemetry + authorization
node scripts/workflows/release/trigger-telemetry.cjs

# Step 8b: Run release agent (bump version, update changelog)
node scripts/workflows/release/run-release-agent.cjs
  INPUT_SCOPE={scope}
  INPUT_PROVIDER=shell
  INPUT_VERSION={release_version}
  INPUT_DRY_RUN={dry_run}

# Step 8c: Create main release PR
node scripts/workflows/release/create-main-release-pr.cjs
  INPUT_VERSION={release_version}
  INPUT_RELEASE_BRANCH={release_branch}

# Step 8d: Publish GitHub Release
node scripts/workflows/release/create-github-release.cjs
  INPUT_VERSION={release_version}
  INPUT_NOTES_FROM={notes_from}
```

**Mutations Made:**

- Git commits (version bump, changelog)
- Git tags (vX.Y.Z)
- GitHub PRs (#N, #N+1)
- GitHub Release (published with notes)

### Step 9: Post-Release Validation

**Goal:** Verify mutations were successful

```
Check:
- Tag vX.Y.Z exists and points to correct commit
- GitHub Release published
- PRs created (#N, #N+1) and opened
- Changelog rolled (Unreleased → vX.Y.Z)
- Version file updated correctly
```

**Verdict:** SUCCESS / ROLLBACK_NEEDED

### Step 10: Report & Cleanup

**Goal:** Summarize outcome and log decisions

```
Output:
- ✅ Release vX.Y.Z published successfully
- PR #N (develop): [link]
- PR #N+1 (main): [link]
- GitHub Release: [link]
- Agentic Score: {confidence}
- Audit Log: [link]

If dry-run:
- release-dry-run-plan.md (artifacts only, no mutations)
```

---

## Error Handling

### Error: Changelog validation fails

```
→ Agentic detects schema error
→ Message: "❌ CHANGELOG.md schema error at line X: [detail]"
→ Suggestion: "Run: npm run validate:changelog"
→ Fallback: User runs manually
→ Outcome: ABORT, retry after fix
```

### Error: Agentic score < 0.8

```
→ Agentic reasoning yields low confidence
→ Message: "⚠️ I'm uncertain about this release. Confidence: 0.65"
→ Concerns: [list issues]
→ Suggestion: "Address concerns or use --force-proceed (manual)"
→ Outcome: ABORT, wait for retry or manual command
```

### Error: AI service unavailable

```
→ Agentic API fails (timeout, rate limit, etc.)
→ Message: "⚠️ AI service unavailable. Using deterministic fallback."
→ Fallback: Skip agentic reasoning, use shell scripts
→ Outcome: Release proceeds without AI reasoning
```

### Error: Version conflict (tag exists)

```
→ Git reports tag v1.2.3 already present
→ Message: "❌ Tag v1.2.3 already exists"
→ Suggestion: "Delete old tag: git tag -d v1.2.3"
→ Fallback: User deletes tag, retries
→ Outcome: ABORT, wait for tag cleanup
```

---

## Dry-Run Mode

**Command:**

```bash
gh agentic release --scope=patch --dry-run
```

**Behavior:**

```
- All gates executed normally
- Agentic reasoning runs
- No commits/tags/PRs created
- Output artifacts generated:
  - release-dry-run-plan.md (step-by-step)
  - release-notes-preview.md (compiled notes)
  - version-bump-preview.txt (old → new)
  - changelog-rolled.md (how it would look)
```

**User Can Then:**

- Review artifacts
- Make adjustments
- Run again without --dry-run

---

## Fallback Path

If agentic workflow fails at any point, shell scripts remain operational:

```bash
# Manual shell-based release (Phase 4, always works)
npm run release -- --scope=patch --dry-run
npm run release -- --scope=patch
```

---

## Integration Points

### With Phase 4 (Shell Scripts)

- ✅ Calls all existing shell scripts unchanged
- ✅ Preserves all Phase 4 logic
- ✅ Uses existing VERSION and CHANGELOG.md handling

### With Phase 5 (Portable Agents)

- 🔄 Can call agents/release/ (optional, for future)
- 🔄 Shares changelog utilities with agents/changelog/
- 🔄 Agentic orchestrates, portable agents execute (future)

### With Phase 6 (WordPress Support)

- 🔄 Agentic workflow template can be adapted for plugins/themes
- 🔄 Same safety gates apply
- 🔄 Portable agents provide WordPress-specific logic

---

## Logging & Audit Trail

All agentic decisions logged to:

```
.github/reports/agentic-releases/
├── 2026-08-11_release-v1.2.3_patch.json (structured log)
├── 2026-08-11_agentic-score.txt (confidence: 0.92)
└── 2026-08-11_decisions.md (human-readable summary)
```

**Logged:**

- ✅ Workflow triggered (user, timestamp)
- ✅ Agentic score and reasoning
- ✅ Gate results (all 7)
- ✅ Approvals (who, when)
- ✅ Mutations (commits, tags, PRs, releases)
- ✅ Outcome (success/failure)

**Redacted:**

- ❌ Full agentic prompts
- ❌ API keys or tokens
- ❌ User email or personal data
- ❌ Commit messages with secrets

---

## Testing & Validation (Phase 5A)

### Test 1: Dry-run on develop

```bash
gh agentic release --scope=patch --dry-run
# Expected: Artifacts generated, no mutations
```

### Test 2: Dry-run failure scenarios

```bash
# Break changelog, test validation
# Break version file, test parsing
# Test authorization with non-maintainer
# Test all error paths
```

### Test 3: Live release (patch)

```bash
gh agentic release --scope=patch
# Expected: Full release vX.Y.Z published
```

### Test 4: Integration tests

```bash
# Test with portable agents (Phase 5)
# Test with WordPress (Phase 6, future)
# Test multi-engine fallback
```

---

## Future Enhancements (Phase 5B+)

- 🔜 Interactive Copilot chat: `@release-agent patch`
- 🔜 Auto-suggestions for changelog improvements
- 🔜 Multi-engine support (Claude, OpenAI, Gemini)
- 🔜 Metrics + analytics on release patterns
- 🔜 Integration with GitHub Projects for tracking
- 🔜 Slack notifications on release events

---

## Related Files & Integration

This release agent integrates with the LightSpeed changelog ecosystem:

- **Changelog Spec Agent:** [`.github/agents/changelog.agent.md`](../../.github/agents/changelog.agent.md) — Primary GitHub-native specification for changelog management
- **Changelog Portable Agent:** [`agents/changelog/README.md`](../../agents/changelog/README.md) — Multi-file implementation with Keep a Changelog 1.1.0 support
- **Changelog Schema:** [`schemas/changelog.schema.json`](../../schemas/changelog.schema.json) — JSON schema validation for Keep a Changelog 1.1.0 compliance
- **Changelog Workflow:** [`.github/workflows/changelog-management.yml`](../../.github/workflows/changelog-management.yml) — GitHub Actions workflow for automated changelog processing
- **Changelog Documentation:** [`docs/CHANGELOG_AUTOMATION.md`](../../docs/CHANGELOG_AUTOMATION.md) — Complete guide to changelog automation and contributor workflow

The release agent uses these components to:
- Validate changelog structure before release
- Convert [Unreleased] section to release version
- Ensure changelog entries meet Keep a Changelog 1.1.0 standard
- Apply two-gate validation (PR validation + release validation)

---

## References

- [AGENTIC_WORKFLOW_SPEC.md](../.github/projects/active/release-agentic-workflows-2026-08-11/AGENTIC_WORKFLOW_SPEC.md) — Design decisions
- [RELEASE_PROCESS.md](../docs/RELEASE_PROCESS.md) — Phase 4 (shell scripts)
- [GitHub Agentic Workflows Docs](https://github.github.com/gh-aw/) — Official reference

---

*Markdown Workflow v1.0 — Phase 5A Skeleton*  
*To be implemented during Phase 5A (Aug 12-16, 2026)*  
*Built by 🧱 LightSpeedWP with ☕, 🚀, and agentic workflows!*
