---
file_type: audit
title: Release Process Audit for v0.5.0
description: Comprehensive audit of release infrastructure (agent, documentation, workflows, changelog) with recommendations for v0.5.0 release
created_date: 2026-05-31
audit_scope: Release processes, agent specification, workflow orchestration, changelog validation, documentation completeness
status: ready-for-review
---

# Release Process Audit for v0.5.0

**Audit Date:** 2026-05-31  
**Current Version:** 0.3.0  
**Target Release:** 0.5.0 (minor release)  
**Repository:** `lightspeedwp/.github`

---

## Executive Summary

Your release infrastructure is **well-structured and documented**, but requires **critical refinements** before v0.5.0 to ensure reliability and auditability:

### Key Strengths
- ✅ Comprehensive agent spec (`agents/release.agent.md`) with clear orchestration contract
- ✅ Schema-validated changelog (`changelog.schema.json`) enforcing Keep a Changelog format
- ✅ Dual validation gates: changelog-validate.yml runs on every PR; release.yml has pre-flight checks
- ✅ Process documentation (`docs/RELEASE_PROCESS.md`) maps agent phases to workflows
- ✅ Dry-run mode supports safe testing end-to-end
- ✅ ESM-based agent (`release.agent.js`) with clear separation of concerns

### Critical Issues (Must Fix Before v0.5.0)

| Issue | Severity | Impact | Category |
|-------|----------|--------|----------|
| **DRY-RUN INCOMPLETE**: Dry-run doesn't actually create branches/commits for validation | HIGH | Can't test release flow safely; silent failures in workflows | Workflow |
| **NO RELEASE BRANCH CREATION**: release.agent.js missing branch creation steps for release/* | HIGH | Manual PR creation required; breaks orchestration contract | Agent |
| **MISSING UNRELEASED SECTION**: No validation that [Unreleased] section is recreated after release | MEDIUM | Next release cycle starts broken; changelog drifts | Changelog |
| **WEAK VERSION OVERRIDE LOGIC**: No safeguards against invalid/regressive version bumps | MEDIUM | Risk of version conflicts or downgrades | Agent |
| **INCOMPLETE RELEASE PR BODY**: PR template lacks clarity on release intent and scope | MEDIUM | Reviewers can't assess release scope quickly | Workflow |
| **NO ROLLBACK AUTOMATION**: Manual steps required to recover from failed releases | MEDIUM | Risk of state corruption if error recovery needed | Workflow |
| **TELEMETRY-ONLY AUTH CHECK**: Trigger telemetry runs but doesn't block unauthorized actors | LOW | False sense of security; actual auth enforcement missing | Security |

### Nice-to-Have Refinements
- 🔧 Multi-ref release notes (support releasing from branches other than develop)
- 🔧 Contribution graph metrics in release notes
- 🔧 Automated changelog validation output in PR comments
- 🔧 Post-release notifications to stakeholders

---

## Detailed Audit Findings

### 1. RELEASE AGENT (`scripts/agents/release.agent.js`)

#### Observations

**Status: Mostly complete but missing branch/PR orchestration**

- ✅ Validation phase is comprehensive (VERSION, CHANGELOG, git status, tests check)
- ✅ Version bumping and changelog update logic is correct
- ✅ Tag creation, GitHub Release generation, and notes compilation work as designed
- ✅ Argument parsing and dry-run mode are implemented
- ❌ **CRITICAL**: Missing release branch creation (`git checkout -b release/v${version}`)
- ❌ **CRITICAL**: PR creation (`gh pr create`) is stubbed with error recovery but untested
- ❌ **CRITICAL**: Changelog `[Unreleased]` section not recreated post-release
- ⚠️ Dry-run mode doesn't persist files or branches for validation testing

#### Issues

**Issue 1.1: Missing Release Branch Creation** (Severity: HIGH)

The agent spec (line 129–133 of `agents/release.agent.md`) mandates:
> Create `release/vX.Y.Z` from `develop`.

But `release.agent.js` line 691–695 has a stub:
```javascript
if (!dryRun) {
  exec(`git checkout -b ${releaseBranch}`);
}
```

**Problem**: This branch is created locally but never pushed before PR creation (line 609). The PR creation then relies on an unpushed branch—GitHub can't see it.

**Fix**: Add branch push immediately after creation:
```javascript
// After version/changelog updates but before tag creation
exec(`git add VERSION CHANGELOG.md`);
exec(`git commit -m "chore(release): bump to ${nextVersion}"`);
exec(`git push -u origin ${releaseBranch}`, dryRun);
```

**Issue 1.2: PR Creation Failure Recovery** (Severity: MEDIUM)

Line 614–618 swallows PR creation errors:
```javascript
catch (error) {
  console.warn(`⚠️  Failed to auto-create release PR...`);
}
```

**Problem**: If `gh pr create` fails (network, auth, branch not found), the release continues. User is left with a tag but no PR—confusing state.

**Fix**: Make PR creation mandatory or provide clear rollback instructions in error output.

**Issue 1.3: [Unreleased] Section Not Recreated** (Severity: MEDIUM)

After rolling `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD` (line 499–503), the new Unreleased section for the next cycle is never added.

**Problem**: Next release cycle finds no Unreleased section → changelog validation fails → can't add PRs to changelog.

**Fix**: After updating CHANGELOG, append new Unreleased section:
```javascript
function updateChangelog(newVersion, options = {}) {
  // ... existing code to roll version ...
  
  // ADD THIS: Inject new Unreleased section
  const unreleasedSection = `## [Unreleased] - DD-MM-YYYY

### Added

### Changed

### Fixed

### Deprecated

### Removed

### Security

### Documentation

### Performance

`;
  
  const finalContent = unreleasedSection + updatedContent;
  fs.writeFileSync(changelogPath, finalContent, 'utf8');
}
```

**Issue 1.4: Weak Version Override Logic** (Severity: MEDIUM)

Line 671–683 validate explicit `--version=` but don't check if it matches the release scope:

```javascript
if (compareVersions(explicitVersion, currentVersion) <= 0) {
  throw new Error(`Explicit version must be greater than current version`);
}
```

**Problem**: User can pass `--version=1.5.0` with `--scope=patch`. No validation that version matches scope intent.

**Fix**: Add scope alignment check:
```javascript
const expectedVersion = determineNextVersion(currentVersion, scope);
if (explicitVersion !== expectedVersion && !process.env.RELEASE_FORCE_VERSION) {
  throw new Error(
    `Explicit version ${explicitVersion} does not match scope ${scope} ` +
    `(expected ${expectedVersion}). Use RELEASE_FORCE_VERSION=1 to override.`
  );
}
```

**Issue 1.5: Incomplete Dry-Run** (Severity: HIGH)

Dry-run mode logs what *would* happen but doesn't create branches or commit files. So:
- Can't validate that version bump passes tests
- Can't validate that changelog is schema-valid after roll
- Can't validate that git history would be clean

**Problem**: Users can't safely test the full release flow.

**Fix**: Implement "sandboxed" dry-run:
1. Create temp branch (`release/v${nextVersion}--dry-run`)
2. Actually write VERSION and CHANGELOG
3. Commit and validate (lint, schema check)
4. Report results and **clean up** temp branch

```javascript
function exec(cmd, dryRun = false, sandbox = false) {
  if (dryRun) {
    if (sandbox) {
      // Actually run in a temp branch
      const sandboxCmd = `git stash && git checkout --orphan release-sandbox && ${cmd} && git checkout - && git stash pop`;
      return execSync(sandboxCmd, { encoding: 'utf8' });
    }
    console.log(`[DRY-RUN] Would execute: ${cmd}`);
    return "";
  }
  try {
    return execSync(cmd, { encoding: 'utf8' });
  } catch (error) {
    throw new Error(`Command failed: ${cmd}\n${error.message}`);
  }
}
```

---

### 2. RELEASE WORKFLOW (`.github/workflows/release.yml`)

#### Observations

**Status: Well-structured but needs gating enforcement**

- ✅ Telemetry job records trigger attempts
- ✅ Conditional flow (telemetry → lint → release)
- ✅ Validates changelog schema before running agent
- ❌ **CRITICAL**: Telemetry records unauthorized attempts but doesn't **block** them (line 72)
- ❌ Lint is gated on telemetry but not tested independently
- ⚠️ No explicit test gate (only mentions "run separately via CI")
- ⚠️ Dry-run artifacts uploaded but not linked in workflow output

#### Issues

**Issue 2.1: Telemetry Doesn't Enforce Auth** (Severity: MEDIUM)

Line 72:
```yaml
if: needs.trigger-telemetry.outputs.unauthorized_attempts == '0'
```

But telemetry script only *records* attempts, doesn't prevent them. If telemetry fails/crashes, `unauthorized_attempts` might be `null` → condition passes anyway.

**Fix**: Make telemetry mandatory and validate its output:
```yaml
trigger-telemetry:
  runs-on: ubuntu-latest
  outputs:
    status: ${{ steps.telemetry.outputs.status }}
  steps:
    - id: telemetry
      name: Record and verify trigger telemetry
      run: |
        RESULT=$(node scripts/workflows/release/trigger-telemetry.cjs)
        if [ "$RESULT" != "authorized" ]; then
          echo "::error::Unauthorized release trigger attempt"
          exit 1
        fi
        echo "status=authorized" >> "$GITHUB_OUTPUT"

lint:
  needs: [trigger-telemetry]
  if: needs.trigger-telemetry.outputs.status == 'authorized'
```

**Issue 2.2: Lint Is a Hard Gate but Tests Are Optional** (Severity: MEDIUM)

Line 83 lints before release, but line 131 says tests run "separately via CI". So release can proceed with untested code if:
- Linting passes
- But CI test job is still running in parallel

**Problem**: Release might be published before tests complete.

**Fix**: Make testing a hard gate by calling the test workflow:
```yaml
test:
  needs: [trigger-telemetry]
  if: needs.trigger-telemetry.outputs.status == 'authorized'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: "lts/*"
    - name: Install
      run: npm ci
    - name: Run tests
      run: npm test
```

**Issue 2.3: Dry-Run Artifacts Not Linked** (Severity: LOW)

Dry-run artifacts (`release-agent.log`, `release-notes-preview.md`) are uploaded (line 122–129) but not downloadable from the workflow UI—they're "hidden" in the artifacts section.

**Fix**: Add workflow output to summarize dry-run results:
```yaml
release:
  # ... steps ...
  outputs:
    dry_run_notes_preview: ${{ steps.build-notes.outputs.preview_path }}

- id: build-notes
  if: inputs.dry_run == true
  name: Build dry-run release notes preview
  run: |
    node scripts/workflows/release/build-notes-preview.cjs
    echo "preview_path=file://$(pwd)/release-notes-preview.md" >> "$GITHUB_OUTPUT"
```

---

### 3. CHANGELOG VALIDATION (`.github/workflows/changelog-validate.yml`)

#### Observations

**Status: Comprehensive but missing post-release automation**

- ✅ Runs on every PR to develop
- ✅ Enforces CHANGELOG.md updates or `meta:no-changelog` label
- ✅ Blocks conflicting labels (meta:needs-changelog + meta:no-changelog)
- ✅ Schema and unreleased content validation
- ❌ No post-release automation to validate that new Unreleased section exists
- ⚠️ Labels are type-specific (line 48: feature|bug|performance|security|release|hotfix) but no link to release scope

#### Issues

**Issue 3.1: Post-Release Validation Not Automated** (Severity: MEDIUM)

After release, `CHANGELOG.md` is updated. But the new `[Unreleased]` section is not validated—next PR to develop finds a malformed changelog.

**Problem**: Drift between actual and expected changelog structure.

**Fix**: Add post-release step to release workflow:
```yaml
release:
  # ... after create GitHub release ...
  - name: Validate post-release changelog
    if: inputs.dry_run == false
    run: |
      node scripts/validation/validate-changelog.cjs CHANGELOG.md
      node scripts/agents/includes/changelogUtils.cjs --unreleased CHANGELOG.md
```

**Issue 3.2: Label-to-Scope Mapping Unclear** (Severity: LOW)

Label guidance (issue template, saved replies) don't map type labels to release scope:
- `release:patch` → should map to bugfixes/docs
- `release:minor` → should map to added features
- `release:major` → should map to breaking changes

**Fix**: Update saved reply `/release-label-guidance.md` with explicit mapping:
```markdown
## Release Label Mapping

When preparing a release, apply exactly one label per PR:

| Label | Scope | Use When |
|-------|-------|----------|
| `release:patch` | patch | Bug fixes, documentation, performance improvements, minor refactors |
| `release:minor` | minor | New features, backward-compatible enhancements, new agents/workflows |
| `release:major` | major | Breaking changes, API restructures, platform requirement changes |

Only a single release:* label per PR. The release agent uses --scope flag; labels are for human communication.
```

---

### 4. DOCUMENTATION & SPECIFICATION

#### Observations

**Status: Good but needs synchronization**

- ✅ `docs/RELEASE_PROCESS.md` is current and aligns to agent spec
- ✅ `agents/release.agent.md` is comprehensive with clear orchestration contract
- ✅ `instructions/release.instructions.md` has frontmatter but incomplete body
- ❌ Instructions file is incomplete (only 15 lines, no guidance)
- ❌ Release templates (`pr_release.md`, issue template 17-release.md) not linked from main docs
- ⚠️ No runbook for common failure scenarios (tag conflicts, PR creation failures, rollback)

#### Issues

**Issue 4.1: Instructions File Is Incomplete** (Severity: MEDIUM)

`instructions/release.instructions.md` only has frontmatter. Body is empty.

**Problem**: Doesn't fulfill its governance purpose—no guidance for agents/workflows.

**Fix**: Move current content from `docs/RELEASE_PROCESS.md` into instructions file and link back.

**Issue 4.2: No Rollback Runbook** (Severity: MEDIUM)

`docs/RELEASE_PROCESS.md` line 113–124 has rollback steps, but they're manual and not integrated with the agent.

**Problem**: If release fails, user must manually undo git state—error-prone.

**Fix**: Create `.github/scripts/workflows/release/rollback.cjs` to automate:
```bash
node scripts/workflows/release/rollback.cjs --version=0.5.0 [--force]
```

And link from release agent error handling.

**Issue 4.3: Release Templates Not Discoverable** (Severity: LOW)

Release issue template (`.github/ISSUE_TEMPLATE/17-release.md`) and PR template (`pr_release.md`) exist but aren't mentioned in `docs/RELEASE_PROCESS.md`.

**Fix**: Add section to process docs:
```markdown
## Templates

- **Release Issue** (`.github/ISSUE_TEMPLATE/17-release.md`): Use to coordinate manual release prep.
- **Release PR** (`pr_release.md`): Auto-populated by release agent; review and merge to main.
```

---

### 5. SCRIPTS & UTILITIES

#### Observations

**Status: Functional but needs integration**

- ✅ `scripts/validation/validate-changelog.cjs` enforces schema
- ✅ `scripts/agents/includes/changelogUtils.cjs` parses changelog
- ✅ `scripts/workflows/release/run-release-agent.cjs` bridges workflow and agent
- ❌ `scripts/create-release-pr.cjs` is **abandoned** (replaced by release.agent.js) but still in repo
- ❌ No test coverage for critical agent functions (branch creation, PR creation, tag validation)

#### Issues

**Issue 5.1: Abandoned Script in Repo** (Severity: LOW)

`scripts/create-release-pr.cjs` (143 lines) duplicates release agent logic. It's unused but confuses contributors.

**Fix**: Either:
1. Delete if truly deprecated (preferred), or
2. Repurpose as standalone utility for PR creation only

**Issue 5.2: Missing Test Coverage** (Severity: MEDIUM)

`scripts/agents/__tests__/release.agent.test.js` exists but likely incomplete. Critical paths not covered:
- Branch creation and push
- PR creation with proper body formatting
- Changelog [Unreleased] section injection
- Version override validation

**Fix**: Expand test coverage in test file. Run with `npm test` before release.

---

## Checklist for v0.5.0 Release

### Critical (Must Fix Before Tagging)

- [ ] **Fix Issue 1.1**: Add branch creation + push to `release.agent.js` (line ~695)
- [ ] **Fix Issue 1.3**: Add [Unreleased] section injection to changelog update function
- [ ] **Fix Issue 1.5**: Implement sandboxed dry-run mode for safe testing
- [ ] **Fix Issue 2.1**: Make telemetry enforce auth (not just record)
- [ ] **Fix Issue 2.2**: Add test job as hard gate in release workflow
- [ ] Validate all existing tests pass: `npm test`
- [ ] Run release agent in dry-run mode: `node scripts/agents/release.agent.js --scope=minor --dry-run`
- [ ] Manually verify release notes preview reads correctly

### Important (Should Fix Before Tagging)

- [ ] **Fix Issue 1.2**: Improve PR creation error handling (make mandatory or clear rollback)
- [ ] **Fix Issue 1.4**: Add scope alignment check to version override
- [ ] **Fix Issue 3.1**: Add post-release changelog validation to workflow
- [ ] **Fix Issue 4.1**: Complete `instructions/release.instructions.md`
- [ ] **Fix Issue 4.2**: Create rollback automation script
- [ ] **Fix Issue 5.1**: Remove or repurpose `scripts/create-release-pr.cjs`
- [ ] Run linting: `npm run lint`
- [ ] Lint workflows: `npm run lint:workflows`
- [ ] Validate frontmatter: `npm run validate:frontmatter`

### Nice-to-Have (Can Do Post-v0.5.0)

- [ ] **Fix Issue 3.2**: Update label guidance documentation
- [ ] **Fix Issue 4.3**: Link templates from process docs
- [ ] **Fix Issue 5.2**: Expand release agent test coverage
- [ ] Add contribution graph to release notes
- [ ] Add multi-ref release support (release from branches other than develop)

---

## Recommendations for v0.5.0 Execution

### Pre-Release (Today/Tomorrow)

1. **Triage Issues**: Review critical issues above and decide fix priority.
   - Suggest: Fix 1.1, 1.3, 1.5, 2.1, 2.2 before tagging
   - Can defer 1.2, 1.4, 3.1, 4.1, 4.2, 5.1 to v0.5.1 if timeline tight

2. **Changelog Readiness**: Verify CHANGELOG.md [Unreleased] section is complete and schema-valid
   ```bash
   node scripts/validation/validate-changelog.cjs CHANGELOG.md
   node scripts/agents/includes/changelogUtils.cjs --validate CHANGELOG.md
   ```

3. **Dry-Run**: Test release agent end-to-end in dry-run mode
   ```bash
   node scripts/agents/release.agent.js --scope=minor --dry-run
   ```
   Review:
   - `release-agent.log` for validation errors
   - `release-notes-preview.md` for notes formatting
   - Changelog [Unreleased] → [0.5.0] rollover

4. **Gate Validation**: Ensure all gates green
   ```bash
   npm run lint:all      # ESLint, Markdown, YAML, JSON, pkg.json
   npm test              # Unit tests
   npm run validate:frontmatter  # YAML frontmatter
   ```

### Release Day

1. **Create Release Issue**: Use `.github/ISSUE_TEMPLATE/17-release.md` to coordinate
2. **Run Release Agent**: Via workflow_dispatch or CLI
   ```bash
   node scripts/agents/release.agent.js --scope=minor
   ```
3. **Review Release PR**: Check title, body, tag, and GitHub Release
4. **Merge to main**: After review gates pass
5. **Verify Tags & Releases**: Confirm on GitHub
6. **Publish Announcement**: Link to GitHub Release

### Post-Release (v0.5.1 Sprint)

1. Address deferred issues (1.2, 1.4, 3.1, 4.1, 4.2, 5.1)
2. Monitor for changelog drift on next develop PRs
3. Gather feedback on release experience

---

## Proposed Timeline

| Phase | Tasks | Est. Duration |
|-------|-------|---------------|
| **Pre-Release Audit** | Review findings, triage issues, plan fixes | 1 hour |
| **Critical Fixes** | Implement issues 1.1, 1.3, 1.5, 2.1, 2.2 (if chosen) | 3–4 hours |
| **Testing** | Dry-run, gate validation, changelog verification | 1 hour |
| **Release Prep** | Create issue, coordinate team, final review | 1 hour |
| **Release Execution** | Run agent, merge PR, verify tags & releases | 30 min |
| **Total** | | **6–8 hours** |

---

## References

| File | Purpose |
|------|---------|
| `agents/release.agent.md` | Release agent specification with orchestration contract |
| `scripts/agents/release.agent.js` | Agent implementation (ESM) |
| `.github/workflows/release.yml` | Release workflow (develop → main) |
| `.github/workflows/changelog-validate.yml` | Changelog validation gate (every PR) |
| `docs/RELEASE_PROCESS.md` | Release process guide (authoritative) |
| `instructions/release.instructions.md` | Release governance instructions (incomplete) |
| `schema/changelog.schema.json` | Keep a Changelog schema enforcement |
| `CHANGELOG.md` | Changelog source of truth |

---

## Sign-Off

**Audit Conducted By:** Claude Code  
**Audit Date:** 2026-05-31  
**Status:** Ready for review and decision  
**Recommended Action:** Review critical issues; prioritize fixes; proceed with release once gates satisfied
