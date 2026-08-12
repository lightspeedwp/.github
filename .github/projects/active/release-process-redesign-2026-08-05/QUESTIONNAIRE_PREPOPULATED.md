---
file_type: markdown
title: "Prepopulated Questionnaire — Release Process Redesign"
description: "Complete questionnaire with recommended best-practice answers (single-decision-maker model, develop-first flow, multi-repo support)"
status: active
version: "1.0"
last_updated: "2026-08-05"
owners: ["Ash Shaw"]
tags: ["questionnaire", "release", "design", "answers"]
notes: "Prepopulated for organization-wide release process covering .github control plane + WordPress plugin/theme repos with portable agents"
---

# Release Process Redesign Questionnaire

**PREPOPULATED VERSION WITH RECOMMENDED ANSWERS**

*Based on:*

- *Your stated preference for develop-first release flow*
- *Single decision-maker model (you)*
- *Multi-repo organization (control plane + plugins + themes)*
- *WordPress plugin/theme versioning requirements*
- *Portable agent architecture (reusable across repos)*

---

## PART 1: RELEASE FLOW ARCHITECTURE (Questions 1-8)

### 1. **Primary Branch for Development**

**ANSWER:**

```
[X] Yes, develop is the source of truth; all integration happens here
```

**Rationale:**
All repos (control plane, plugins, themes) use develop as primary integration branch. Continuous feature merging to develop; release branches cut from develop.

**Applies To:**

- ✅ .github control plane
- ✅ WordPress block plugins
- ✅ WordPress block themes
- ✅ Other LightSpeedWP repositories

---

### 2. **Release PR Target — First Stage**

**ANSWER:**

```
[X] develop (your stated preference: finalize version/changelog here first)

If develop: [X] Yes, full CI/lint/test
```

**Rationale:**
Develop-first flow ensures:

1. Version bump is validated on develop
2. Changelog is finalized on develop before tagging
3. No version skew between main and develop
4. Next feature starts from correct version

**Flow for all repos:**

```
develop (current version)
  ↓ create release/vX.Y.Z
release/vX.Y.Z (bumps version, updates changelog)
  ↓ PR #1
PR to develop (runs full CI: tests, lint, changelog validation)
  ↓ merge to develop
develop (updated version)
  ↓ PR #2
PR to main (runs final validation)
  ↓ merge to main
main (tagged vX.Y.Z)
  ↓ GitHub Release published
```

**WordPress-Specific:**

- Plugin header (Version: X.Y.Z) updated
- Theme style.css header (Version: X.Y.Z) updated
- readme.txt (Stable tag: X.Y.Z) updated
- All validated before main merge

---

### 3. **Post-Release Sync Strategy**

**ANSWER:**

```
[X] No sync: develop stays separate; next release derives version from scratch

Rationale: Develop-first flow already updated develop. When develop merges to main,
           version is already correct. No back-sync needed.
```

**Applies To:**
All repos follow same pattern — develop is always up-to-date after release.

---

### 4. **Release Branch Cleanup Timing**

**ANSWER:**

```
[X] After GitHub Release is published (final step)
```

**Rationale:**
Keep release branch around for audit trail. Delete only after:

1. Merge to develop confirmed
2. Merge to main confirmed
3. GitHub Release published
4. Tag confirmed in git

**Benefits:** Can trace exact commit for any released version.

---

### 5. **Hotfix Flow Integration**

**ANSWER:**

```
[X] Auto-sync hotfix version back to develop
```

**Rationale:**
Hotfix flows from main back to develop. Version in main's hotfix commit should sync to develop.

**Pattern:**

```
main (v1.0.0 release)
  ↓ hotfix/critical-security-patch
hotfix branch (fixes bug, bumps to v1.0.1)
  ↓ PR to main (runs CI)
  ↓ merge + tag v1.0.1
main (v1.0.1)
  ↓ Auto-sync to develop
develop (now v1.0.1)
```

**Applies To:** All repos (plugins, themes, control plane)

---

### 6. **Pre-Release Branch Protection**

**ANSWER:**

```
[X] Yes, same as main (require reviews, CI green)
```

**Rationale:**
Release branch is official; protect it like main.

**Rules:**

- Require 1 approval (from you, as single decision-maker)
- Require CI green (tests, lint, changelog validation)
- Require branches up-to-date with develop
- No force push

---

### 7. **Stacked PR Strategy Decision**

**ANSWER:**

```
[X] Yes, adopt stacked PR strategy (develop-first flow naturally enables this)
```

**Rationale:**
Develop-first flow uses stacked PRs naturally:

- PR #1: release → develop (review, test, validate)
- PR #2: develop → main (final gate, tagged after merge)

**Benefits:**

- Independent CI for each stage
- Rollback at either stage
- Clear separation: "integration" vs "release"

---

### 8. **Dry-Run Mode Default**

**ANSWER:**

```
[X] Remove default; require explicit true/false input
```

**Rationale:**
Force user to consciously choose:

- Dry-run first (preview)
- Then live release (real commit/tag)

This prevents accidental "skip the release" because user forgot to toggle a flag.

**Workflow Input:**

```
inputs:
  dry_run:
    description: "Dry-run mode (preview only) or live release?"
    required: true
    type: choice
    options:
      - "false (LIVE RELEASE)"
      - "true (DRY RUN / PREVIEW)"
```

User must explicitly choose one.

---

## PART 2: VERSION & CHANGELOG MANAGEMENT (Questions 9-16)

### 9. **Version Bump Determination**

**ANSWER:**

```
[X] Hybrid: try scope first, fallback to explicit version
```

**Implementation:**

```
Command: node release.agent.js --scope=patch
   OR    node release.agent.js --version=1.2.3

Flow:
1. If --scope provided: derive next version from VERSION file
   - Current: 1.0.0
   - Scope: patch
   - Next: 1.0.1
2. If --version provided: use as-is (skip scope calculation)
3. If neither: fail with clear error
```

**Applies To:**

- ✅ .github control plane
- ✅ WordPress plugins (Version: X.Y.Z)
- ✅ WordPress themes (Version: X.Y.Z in style.css)

---

### 10. **VERSION File Format**

**ANSWER:**

```
[X] Yes, single-line X.Y.Z format
```

**Format:**

```
1.2.3
```

**Also Update (WordPress Repos):**

- Plugin: `Plugin header (Version: X.Y.Z)`
- Theme: `style.css header (Version: X.Y.Z)`
- npm: `package.json (version: X.Y.Z)`
- Composer: `composer.json (version: X.Y.Z)` (if applicable)

**Agent Responsibility:**
Release agent updates all version files simultaneously.

---

### 11. **Pre-release Version Support**

**ANSWER:**

```
[X] Yes, optional; support it but don't require

Examples:
  - v1.0.0-alpha.1
  - v1.0.0-beta.1
  - v1.0.0-rc.1
```

**Rationale:**
Optional feature for planned release cycles. Users don't need to use it.

**Rules:**

- Pre-release never marked as "latest" in GitHub Releases
- VERSION file supports pre-release format
- Changelog [Unreleased] section still validates
- SemVer-compliant

---

### 12. **Unreleased Section Requirement**

**ANSWER:**

```
[X] Hard block: refuse to release, fail workflow
```

**Logic:**

```javascript
if (!hasUnreleasedSection(CHANGELOG.md)) {
  throw new Error(
    "CHANGELOG.md missing [Unreleased] section. " +
    "Add changelog entries before releasing."
  )
}

if (getUnreleasedEntries(CHANGELOG.md).length === 0) {
  throw new Error(
    "[Unreleased] section is empty. " +
    "Add at least one changelog entry before releasing."
  )
}
```

**Prevents:** Empty releases with no documented changes.

---

### 13. **Changelog Validation Timing**

**ANSWER:**

```
[X] On PR to develop AND on release.yml (before agent runs)

Two-gate validation:
1. PR validation (on every PR to develop)
   - Format checking (title, em-dash, PR link)
   - Entry length limits
   - em-dash vs hyphen validation
   
2. Release validation (before agent modifies)
   - Full schema validation
   - [Unreleased] section exists and has entries
   - No duplicate entries
   - All PR links valid
```

**Benefit:** Catch errors early (on PR) and again at release time (final gate).

---

### 14. **Changelog Sections Order**

**ANSWER:**

```
[X] Yes, strict ordering required

Order (Keep a Changelog 1.1.0):
1. [Unreleased]
2. Removed
3. Deprecated
4. Added
5. Changed
6. Fixed
7. Security
```

**Validation:**
Enforce this order for both [Unreleased] and release sections [X.Y.Z].

---

### 15. **Release Notes Generation**

**ANSWER:**

```
[X] Medium; needs tuning for highlights/breaking changes

Current: Works, but can be smarter

Improvements needed:
- Prioritize "Added" entries (new features)
- Flag "Removed" and "Changed" entries as breaking changes
- Highlight critical "Security" entries
- Extract contributor list from merged PRs
```

**Release Notes Will Include:**

```
## Highlights
- New features (from Added section)
- Breaking changes (from Changed/Removed sections)

## Full Changelog
- All entries from changelog

## Contributors
- List of PR authors since last release

## Installation
- For plugins: How to install (WordPress.org URL, manual upload)
- For themes: How to install (WordPress.org URL, manual upload)
```

---

### 16. **Changelog Entry Deduplication**

**ANSWER:**

```
[X] Yes, works fine

Confirmation: Current merge-entries.cjs handles deduplication correctly.
- Detects duplicate PR numbers
- Removes exact duplicates
- Preserves section headers
- Validates result before write
```

---

## PART 3: GOVERNANCE & AUTHORIZATION (Questions 17-22)

### 17. **Release Authorization**

**ANSWER:**

```
[X] Only team leads (list: Ash Shaw)

Single decision-maker model for now.
Future: Add other leads to this list as needed.
```

**Access Control:**

- **GitHub:** Only Ash Shaw can trigger workflow_dispatch for release.yml
- **CI:** Workflow validates trigger user before running

**Applies To:**

- ✅ .github control plane releases
- ✅ Plugin releases
- ✅ Theme releases

---

### 18. **Authorization Enforcement**

**ANSWER:**

```
[X] Yes, implement proper authorization checks

Current Problem: telemetry job has continue-on-error: true (doesn't actually block)

Solution:
1. Remove continue-on-error: true
2. Add explicit authorization validation
3. Use GitHub branch protection to prevent non-authorized PRs to main
4. Log unauthorized attempts for audit trail
```

**Implementation:**

```yaml
trigger-telemetry:
  runs-on: ubuntu-latest
  outputs:
    is_authorized: ${{ steps.auth.outputs.authorized }}
  steps:
    - id: auth
      name: Validate authorization
      # NO continue-on-error: true
      run: node scripts/workflows/release/authorize-release.cjs
    
lint:
  needs: [trigger-telemetry]
  if: needs.trigger-telemetry.outputs.is_authorized == 'true'
  # This job is SKIPPED if auth fails (not just silently ignored)
```

---

### 19. **Release Approval Workflow**

**ANSWER:**

```
[X] No, workflow is approval enough (tests/lint gates it)

Rationale: You're deciding alone; your triggering the workflow IS the approval.
           If tests pass, release is good to go.
```

**Future:** If team grows, add peer review approval step.

---

### 20. **Rollback Authorization**

**ANSWER:**

```
[X] Same as release trigger (only you)

If only you can release, only you can rollback.
```

---

### 21. **Release Audit Trail**

**ANSWER:**

```
[X] Yes, log all release attempts (successful and failed)

Logs Include:
- Who triggered release
- When (timestamp)
- For which repo
- What version
- Success or failure
- If failure: error message
- Time-to-release metrics
```

**Storage:** Git commit messages + workflow artifacts + release notes

---

### 22. **Notification on Release**

**ANSWER:**

```
[X] Slack channel #releases (or configured channel)

Notification Template:
"
🚀 Released: lightspeedwp/.github v0.7.0
   Author: Ash Shaw
   PR: #123 → develop, #124 → main
   Changes: 5 Added, 2 Fixed, 1 Security
   GitHub: https://github.com/lightspeedwp/.github/releases/tag/v0.7.0
"
```

**Applies To:** All repos when released.

---

## PART 4: TESTING & VALIDATION GATES (Questions 23-30)

### 23. **Pre-Release Testing Requirements**

**ANSWER:**

```
[X] All of the above:
    - npm test (unit tests)
    - npm run lint (code quality)
    - Changelog validation (schema + unreleased)
    - Manual smoke tests (documented in checklist)
```

**Test Plan for Each Repo Type:**

**Control Plane (.github):**

- npm test (all tests pass)
- npm run lint (ESLint, Prettier, MarkdownLint)
- Changelog validation
- Workflow validation (all YAML is valid)
- Check that all referenced workflows exist (badge validation)

**WordPress Plugin:**

- npm test (unit tests)
- npm run lint (ESLint for JS)
- PHPCS (WordPress coding standards)
- Changelog validation
- Plugin activation test (can be installed without errors)
- Version headers match (VERSION, plugin header, readme.txt)

**WordPress Theme:**

- npm test (theme tests)
- npm run lint (ESLint)
- PHPCS (WordPress theme coding standards)
- CSS validation
- Changelog validation
- Version headers match (VERSION, style.css header)
- Screenshot present (theme_screenshot.png)

---

### 24. **Changelog Validation Strictness**

**ANSWER:**

```
[X] Yes, add all three:
    - Link target validation (PR actually exists)
    - Entry doesn't duplicate previous releases
    - Entry matches commit/PR scope
```

**Validation Rules:**

1. **Format Compliance** (existing)
   - Title: <60 chars
   - Description: <150 chars
   - Em-dash (—) not hyphen (-)
   - PR link required: ([PR #1234](url))

2. **Link Validation** (new)
   - PR link actually resolves
   - Issue link (if present) actually resolves
   - URLs use HTTPS
   - URLs are valid format

3. **No Duplication** (new)
   - Same PR number doesn't appear twice
   - Same entry (by content hash) doesn't appear across releases

4. **Scope Matching** (new)
   - "Added" entries make sense as new features
   - "Fixed" entries reference actual bug fixes
   - "Removed" entries documented breaking changes
   - "Security" entries are security-related

---

### 25. **Version Format Validation**

**ANSWER:**

```
[X] Strict SemVer (X.Y.Z only, but pre-release support via --version flag)

Valid:
  - 1.0.0 ✅
  - 0.6.3 ✅
  - 2.1.0-beta.1 ✅ (if user explicitly specifies with --version)

Invalid:
  - 1.0 ❌ (missing patch)
  - v1.0.0 ❌ (tag uses v; version file doesn't)
  - 1.0.0.0 ❌ (too many segments)
```

---

### 26. **Commit Message Format**

**ANSWER:**

```
[X] No special format; use default release agent message

Message Template:
"chore(release): v1.2.3 — [Unreleased] → [1.2.3]

- Updated VERSION to 1.2.3
- Rolled changelog [Unreleased] to [1.2.3] — YYYY-MM-DD
- Generated release notes with X features, Y fixes, Z security"
```

Release commits are machine-generated; specific format not needed. Human commits to feature branches follow your existing standards.

---

### 27. **Working Tree Validation**

**ANSWER:**

```
[X] Yes, fail if any uncommitted changes

Check:
1. git status (no untracked files)
2. git diff (no modified files)
3. git diff --staged (no staged changes)

If dirty: Fail with message:
"❌ Working tree is not clean. Commit or stash changes before releasing."
```

**Rationale:** Prevent accidental uncommitted changes from being in release.

---

### 28. **Git Tag Naming Convention**

**ANSWER:**

```
[X] Always use v prefix (v1.0.0)

Consistent Tagging:
  ✅ v1.0.0 (production release)
  ✅ v1.0.0-beta.1 (pre-release)
  ✅ v1.0.0-rc.1 (release candidate)
  ❌ 1.0.0 (bare version without v)
  ❌ release-1.0.0 (non-standard prefix)
```

**Benefits:**

- Standard convention (matches Git best practices)
- Distinguishes releases from other tags
- Clear what's a version tag vs other refs

---

### 29. **GitHub Release Creation**

**ANSWER:**

```
[X] Always create; release isn't complete without it
```

**GitHub Release Includes:**

- Title: "v1.2.3 — Release Notes Summary"
- Body: Full changelog entries + highlights + breaking changes + contributors
- Tag: v1.2.3
- Draft: false (publish immediately)
- Pre-release: true if version contains -alpha, -beta, -rc (false otherwise)
- Target Commitish: main (the merge commit)

**Rationale:** GitHub Release is the public artifact. It's essential for discoverability.

---

### 30. **GitHub Release as "Latest"**

**ANSWER:**

```
[X] Mark by SemVer (highest version wins)

Logic:
  if (isPrerelease) {
    // v1.0.0-beta.1, v1.0.0-rc.1
    setAsLatest: false
    // Only stable releases are "latest"
  } else {
    // v1.0.0, v1.2.3
    if (isHighestSemVer) {
      setAsLatest: true
    }
  }
```

**Examples:**

- v1.0.0 released → marked "latest"
- v1.0.1 released → marked "latest", v1.0.0 unmarked
- v1.0.0-beta.1 released → NOT marked "latest"
- v1.0.0-rc.1 released → NOT marked "latest"
- v1.0.0 released after RC → marked "latest", RC not marked

---

## PART 5: ERROR HANDLING & ROLLBACK (Questions 31-37)

### 31. **Rollback Automation**

**ANSWER:**

```
[X] Yes, create rollback.cjs with one-button revert

Status: Currently missing but documented in RELEASE_PROCESS.md
Action: CREATE this automation

Rollback Command:
  node scripts/workflows/release/rollback.cjs --version=1.2.3
  
Steps:
1. Delete git tag (local + remote)
2. Revert VERSION file to previous version
3. Revert CHANGELOG.md ([X.Y.Z] section → [Unreleased])
4. Delete GitHub Release
5. Create rollback commit: "chore(rollback): v1.2.3 reverted"
6. Log rollback in audit trail
```

---

### 32. **Partial Release Recovery**

**ANSWER:**

```
[X] Auto-cleanup; delete PR and exit without tagging

If Release Agent fails mid-way (PR created but validation fails):
1. Detect failure before commit
2. Delete draft PR (if created)
3. Clean up any temporary branches
4. Exit with clear error message
5. User must fix root cause and retry

This prevents half-done releases in git.
```

---

### 33. **Failed Validation Recovery**

**ANSWER:**

```
[X] Workflow fails; user must fix and rerun

If Release Agent validation fails (changelog broken, version mismatch):
1. Workflow stops
2. Error message explains what's wrong
3. User fixes issue (fix changelog, fix version)
4. User manually reruns workflow
5. Workflow succeeds on retry

No auto-override; forces fixing root cause.
```

---

### 34. **Tag Conflict Handling**

**ANSWER:**

```
[X] Fail; refuse to overwrite existing tag

If tag vX.Y.Z already exists (from failed prior attempt):
1. Detect existing tag
2. Fail with message: "Tag v1.2.3 already exists"
3. User must rollback first (node rollback.cjs --version=1.2.3)
4. Then retry release

Prevents accidental tag corruption.
```

---

### 35. **Release Notes Rollback**

**ANSWER:**

```
[X] Publish amended release with "retracted/rollback" notice

If GitHub Release was created but release needs rollback:
1. Don't delete release (breaks links, confuses users)
2. Instead: Publish amended release with notice
   
   Title: "v1.2.3 — RETRACTED"
   Body: 
   "
   ⚠️ This release has been retracted due to [reason].
   
   Please use v1.2.2 instead.
   
   [Original changelog below...]
   "
3. Unmark from "latest" (if was marked)
4. Update GitHub Release notes to reflect retraction

This keeps history intact and warns users.
```

---

### 36. **Changelog Rollback**

**ANSWER:**

```
[X] Auto-revert: [X.Y.Z] section moves back to [Unreleased]

If release is rolled back:
1. CHANGELOG.md reverted to pre-release state
2. [1.2.3] section becomes [Unreleased] again
3. Next attempt can try again with same entries

Ensures changelog reflects reality.
```

---

### 37. **Incomplete Release Detection**

**ANSWER:**

```
[X] Check for existing tag; fail if present + offer rollback

If user runs release agent twice (accidental double-trigger):
1. First run succeeds: v1.2.3 tag created
2. Second run tries to create same version
3. Agent detects existing tag
4. Fails with message: "v1.2.3 already released"
5. Offers: "Run 'node rollback.cjs --version=1.2.3' to undo"

Prevents accidental double-releases.
```

---

## PART 6: DOCUMENTATION & STANDARDS (Questions 38-44)

### 38. **Release Documentation Organization**

**ANSWER:**

```
[X] Split: separate docs for flow, automation, troubleshooting, rollback

Structure:
docs/
├── RELEASE_PROCESS.md
│   └── Main flow + pre-release checklist
│       (applies to all repos)
├── RELEASE_AUTOMATION.md
│   └── Workflow YAML, agent details, triggers
│       (technical reference for implementers)
├── RELEASE_TROUBLESHOOTING.md
│   └── Common issues + solutions
├── RELEASE_ROLLBACK.md
│   └── Step-by-step rollback procedure
├── RELEASE_WORDPRESS.md
│   └── WordPress-specific (plugin headers, readme.txt, etc.)
└── CHANGELOG_AUTOMATION.md
    └── Changelog format, validation, management

agents/
├── release/
│   ├── release.agent.md (spec)
│   └── release.agent.js (implementation)
└── changelog/
    ├── changelog.agent.md (spec)
    └── changelog.agent.js (implementation)
```

**Benefit:** Each doc has single focus; easier to maintain.

---

### 39. **Documentation Audience**

**ANSWER:**

```
[X] All three (need separate sections per audience)

Audiences:
1. Technical Leads
   - Workflow architecture, YAML structure
   - Agent implementation, Node modules
   - Testing strategy
   
2. Developers (preparing for release)
   - Changelog format, entry examples
   - Pre-release checklist, what to verify
   - Scope determination (patch vs minor)
   
3. Release Manager (you)
   - Step-by-step procedure
   - Troubleshooting, common issues
   - Rollback procedures, edge cases

Implementation:
- Single docs with clearly labeled sections, OR
- Separate docs per audience (linked together)

Recommend: Single RELEASE_PROCESS.md with sections per audience.
```

---

### 40. **Release Checklist**

**ANSWER:**

```
[X] Yes, checklist in docs + enforced by workflow

Pre-Release Checklist (in RELEASE_PROCESS.md):
- [ ] CHANGELOG.md has [Unreleased] section with entries
- [ ] VERSION file contains correct current version
- [ ] All tests passing (npm test green)
- [ ] All linting passing (npm run lint green)
- [ ] Working tree clean (no uncommitted changes)
- [ ] Branch is develop (correct starting point)
- [ ] No local-only commits (everything pushed)

Enforced by Workflow:
- [ ] Changelog schema validation
- [ ] [Unreleased] section existence check
- [ ] VERSION file validation
- [ ] Git working tree cleanliness check
- [ ] Branch verification (must be develop)

Human + Machine: Humans read checklist, workflow validates.
```

---

### 41. **Badge Management**

**ANSWER:**

```
[X] Add CI check to prevent adding badges for missing workflows

CI Validation Rule:
- Every badge in docs must reference an actual workflow
- If workflow doesn't exist: PR blocked with error
- If workflow exists but is broken: Badge shows broken (OK; catches issues)

Implementation:
- Script: scripts/validation/validate-badges.cjs
- Runs on: PR with changes to docs/**/*.md
- Checks: Each workflow badge URL against .github/workflows/
- Blocks PR if referenced workflow missing

Prevents broken badges from being committed.
```

---

### 42. **Documentation Maintenance**

**ANSWER:**

```
[X] CI validation (auto-detect drift, flag in PR)

Drift Detection:
1. When workflow changes, validate docs mention the same behavior
2. When docs change, validate they describe actual workflows
3. Flag mismatches in PR comments

Examples:
- If release.yml input changes, flag RELEASE_AUTOMATION.md
- If workflow trigger changes, flag RELEASE_PROCESS.md
- If badge URL changes, flag all references

CI Step: npm run validate:docs
```

---

### 43. **Decision Records**

**ANSWER:**

```
[X] Single ADR for entire release redesign (plus one for WordPress support)

ADR-00X: Release Flow Architecture (Multi-Repo)
  Status: Accepted
  Context: Single decision-maker, develop-first flow, portable agents
  Decision: Release PRs target develop first, then main
  Consequences: Stacked PR workflow, no post-release sync needed
  References: Questionnaire responses, OpenSpec analysis
  
ADR-00Y: WordPress Plugin/Theme Release Support
  Status: Accepted
  Context: Need to release plugins/themes alongside .github control plane
  Decision: Portable release agent in agents/release/, handles version headers
  Consequences: Release agent updates plugin header + readme.txt + style.css
  References: WordPress plugin/theme structure requirements
```

---

### 44. **Beta/RC Documentation**

**ANSWER:**

```
[X] Yes, with examples (v1.0.0-beta.1, v1.0.0-rc.1)

Documentation includes:
- When to use beta/RC (planned release cycles)
- Naming convention (X.Y.Z-betaX, X.Y.Z-rcX)
- Example: "Release v2.0.0-beta.1 for community testing"
- Example: "Release v2.0.0-rc.1 before final v2.0.0"
- GitHub Release: marked pre-release (not "latest")
- Changelog: entries in [Unreleased], moved to [X.Y.Z-beta.1], then to [X.Y.Z]

Supports full release cycle:
  v1.0.0-alpha.1
    ↓ (testing + fixes)
  v1.0.0-beta.1
    ↓ (more testing + community feedback)
  v1.0.0-rc.1
    ↓ (final validation)
  v1.0.0 (production)
```

---

## PART 7: INTEGRATION WITH BROADER SYSTEM (Questions 45-50)

### 45. **Relation to Branching Strategy**

**ANSWER:**

```
[X] Yes, must rewrite both together; they're interdependent

Current state:
- BRANCHING_STRATEGY.md: develop is primary
- RELEASE_PROCESS.md: says PR to main
- Contradiction: which is primary?

Fix: Rewrite BRANCHING_STRATEGY.md + RELEASE_PROCESS.md together

Key alignment:
1. Develop is primary integration branch (all features merge here)
2. Release cut from develop (release/vX.Y.Z)
3. Release finalized on develop (PR #1)
4. Release promoted to main (PR #2)
5. Main is stable / tagged / released

Both docs must show same flow.
```

---

### 46. **Relation to Changelog Automation**

**ANSWER:**

```
[X] Yes, changelog docs assume direct-main flow; need updating

Current state:
- CHANGELOG_AUTOMATION.md: Describes PR validation + merge sync
- But assumes releases go straight to main
- Needs updating for develop-first flow

Changes needed:
1. Explain develop-first release flow in changelog context
2. Clarify when changelog validation happens (on PR, on release)
3. Document "roll [Unreleased] to [X.Y.Z]" step
4. Explain post-release changelog state (new [Unreleased] created)

Update CHANGELOG_AUTOMATION.md to reflect develop-first flow.
```

---

### 47. **Relation to Automation.md**

**ANSWER:**

```
[X] Yes, add release workflow to automation overview table

Current state:
- AUTOMATION.md describes workflow strategy
- Table 73-84 lists workflows
- Release.yml missing from table

Update Table to Include:
| release.yml | manual (workflow_dispatch) | Versioning, changelog rolling, tagging, release creation | release.agent.js |
| changelog.agent.js | scheduled or on-demand | Changelog entry extraction, deduplication, sync | changelog.agent.js |

Add to AUTOMATION.md:
- Release workflow triggers on user action (not branch push)
- Release agent is portable (can be used in other repos)
```

---

### 48. **GitHub Project Integration**

**ANSWER:**

```
[X] Yes, both:
    - Mark released version milestone as done
    - Auto-create next version milestone

Workflow:
1. Release v1.2.3
2. Workflow finds GitHub Project milestone "v1.2.3"
3. Marks milestone as closed
4. Creates new milestone "v1.3.0-planned" (next minor)
5. Posts comment to milestone: "Released on YYYY-MM-DD"

Benefit: Project board stays in sync with releases.
```

---

### 49. **Semantic Versioning Guidance**

**ANSWER:**

```
[X] Yes, add decision flowchart (when do you bump major vs minor?)

Add to VERSIONING.md:

When to bump MAJOR (X.Y.Z → (X+1).0.0):
  ├─ Has breaking change? → YES → MAJOR
  ├─ Removed feature? → YES → MAJOR
  ├─ API incompatibility? → YES → MAJOR
  └─ NO → go to MINOR

When to bump MINOR (X.Y.Z → X.(Y+1).0):
  ├─ Added new feature? → YES → MINOR
  ├─ New backward-compatible functionality? → YES → MINOR
  └─ NO → go to PATCH

When to bump PATCH (X.Y.Z → X.Y.(Z+1)):
  ├─ Bug fix? → YES → PATCH
  ├─ Security fix? → YES → PATCH
  ├─ Docs/internal only? → YES → PATCH
  └─ Uncertain → Ask team lead

Example Decision:
  Changelog has:
    - Added: New block variant
    - Fixed: Style glitch in theme
  → Scope: MINOR (has new feature, no breaking change)
  → Version: 1.2.0 → 1.3.0
```

---

### 50. **Deployment Integration**

**ANSWER:**

```
[X] Yes, but only for production releases (not beta/RC)

Deployment Trigger:
  Release v1.2.3 (stable)
    ↓
  Creates GitHub Release with pre-release: false
    ↓
  Workflow detects: not pre-release
    ↓
  Triggers deployment workflow
    ↓
  awesome-github-site.yml builds + deploys (for .github repo)
    ↓
  Themes deployed to WordPress.org (if applicable)
    ↓
  Plugins deployed to WordPress.org (if applicable)

Pre-Release Handling:
  Release v1.2.3-beta.1 (pre-release)
    ↓
  Creates GitHub Release with pre-release: true
    ↓
  Workflow detects: is pre-release
    ↓
  Does NOT trigger deployment
    ↓
  Manual testing only; no live deployment

Benefit: Don't auto-deploy beta/RC; only deploy stable releases.
```

---

## ADDITIONAL CONTEXT QUESTIONS

### Q-A: What is the primary pain point with the current release process?

**Answer:**
Develop and main get out of sync (version skew). After tagging main with v1.2.0, develop is still at v1.1.0. Next feature development starts from wrong version. Also, current workflow is undocumented (docs say one thing, code does another) causing confusion.

---

### Q-B: What does a successful release look like to you?

**Answer:**
One-button release workflow (run release.agent.js with --scope=patch). Workflow:

1. Bumps version ✅
2. Rolls changelog ✅
3. Runs all tests ✅
4. Creates PR to develop ✅
5. Merges to develop ✅
6. Creates PR to main ✅
7. Merges to main ✅
8. Tags v1.2.0 ✅
9. Creates GitHub Release ✅
10. Notifies #releases in Slack ✅
11. Main and develop both at v1.2.0 ✅

Zero manual steps. Complete in < 10 minutes. Clear audit trail. Rollback available if needed.

---

### Q-C: Are there any upcoming changes to the release process that I should know about?

**Answer:**
Yes — need to support WordPress plugins and themes in addition to .github control plane. Release agent must be portable and handle:

- Plugin Version header updates
- Theme Version header in style.css
- readme.txt Stable tag updates
- package.json version updates
- Changelog entry validation per repo type

Should be single agent (agents/release/) that's reusable across all LightSpeedWP repos.

---

### Q-D: What's the acceptable "time-to-release"?

**Answer:**
From "ready to release" (all code on develop) to "live on GitHub": < 10 minutes.
Includes:

- Running all tests ✅
- Creating both PRs ✅
- Merging both PRs ✅
- Tagging + GitHub Release ✅
- Slack notification ✅

Manual review/approval time not included (that happens during normal PR review process, before release decision).

---

## SUMMARY

### Key Decisions Made

✅ **Release Flow:** Develop-first (develop → PR, develop merge, then main PR)  
✅ **Authorization:** Single decision-maker (you)  
✅ **Portability:** Release agent in agents/ folder (reusable across repos)  
✅ **Multi-Repo Support:** Handles .github, plugins, themes  
✅ **WordPress Support:** Updates version headers in plugin/theme files  
✅ **Validation:** Strict (all tests, lint, changelog, pre-commit checks)  
✅ **Error Handling:** Rollback automation available  
✅ **Documentation:** Split docs (flow, automation, troubleshooting, WordPress)  
✅ **Pre-Release:** Support beta/RC versions (optional)  

### Implementation Scope

| Component | Status | Effort |
|-----------|--------|--------|
| Release workflow redesign | Plan phase | 2-3 days |
| Release agent updates | Plan phase | 2-3 days |
| Changelog agent creation | Plan phase | 2-3 days |
| Portable agents in agents/ | Plan phase | 1-2 days |
| WordPress plugin support | Plan phase | 1-2 days |
| WordPress theme support | Plan phase | 1 day |
| Documentation rewrite | Plan phase | 3-4 days |
| Testing + validation | Testing phase | 2-3 days |
| **TOTAL** | **Design Phase** | **16-23 days** |

---

**Status:** ✅ QUESTIONNAIRE PREPOPULATED & READY FOR REVIEW

**Next Step:** Review these answers. Modify any that don't match your actual requirements. Then share with me for OpenSpec analysis.

---

*Prepopulated by Claude on 2026-08-05*  
*Based on audit findings, user preference (develop-first flow), and organization-wide scope (multi-repo support)*
