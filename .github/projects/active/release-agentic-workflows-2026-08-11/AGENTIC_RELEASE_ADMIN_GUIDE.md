---
title: "Agentic Release Workflow — Admin & Troubleshooting Guide"
description: "Administration, configuration, and troubleshooting for Phase 5A Release Agent"
status: "draft"
version: "1.0"
date: "2026-08-19"
audience: "admins, infrastructure team"
---

# Agentic Release Workflow — Admin & Troubleshooting Guide

## System Architecture

### Component Overview

```
Release Agent Layer (NEW — Phase 5A)
├─ Safety Gates (7 layers)
│  ├─ Pre-flight checks
│  ├─ Agentic reasoning score
│  ├─ Version consistency
│  ├─ Tag uniqueness
│  ├─ Authorization
│  ├─ Integrity filter (Gitleaks)
│  └─ Approval enforcement
└─ Audit Logging
   ├─ Gate results
   ├─ Secret redaction
   └─ Actor tracking

Phase 4 Release Layer (UNCHANGED)
├─ run-release-agent.cjs (version bump, changelog)
├─ create-main-release-pr.cjs (PR to main)
└─ create-github-release.cjs (publish release)
```

### File Structure

```
scripts/
├─ gates/
│  ├─ release-gates.js          # Safety gates implementation (445 LOC)
│  ├─ __tests__/
│  │  └─ release-gates.test.js   # Test suite (60+ tests, 517 LOC)
│  └─ README.md                  # Gates architecture
├─ workflows/release/
│  ├─ run-release-agent.cjs      # Phase 4 (UNCHANGED)
│  ├─ run-release-with-gates.cjs # NEW: Gates + Phase 4 integration
│  ├─ create-main-release-pr.cjs # Phase 4 (UNCHANGED)
│  └─ create-github-release.cjs  # Phase 4 (UNCHANGED)
└─ agents/
   └─ release.agent.js            # Phase 4 (UNCHANGED, 42KB)

.github/
├─ workflows/
│  └─ release.yml                # GitHub Actions workflow
└─ projects/active/release-agentic-workflows-2026-08-11/
   ├─ AGENTIC_WORKFLOW_SPEC.md
   ├─ PHASE_5A_IMPLEMENTATION_PLAN.md
   ├─ PHASE_5A_IMPLEMENTATION_STATUS.md
   ├─ AGENTIC_RELEASE_USER_GUIDE.md
   └─ AGENTIC_RELEASE_ADMIN_GUIDE.md (this file)
```

---

## Configuration

### Safety Gate Thresholds

Edit in `scripts/gates/release-gates.js`:

```javascript
const CONFIG = {
  AGENTIC_SCORE_THRESHOLD: 0.80,  // Change: 0.70–0.95 valid range
  LOG_DIR: './.agentic-logs',      // Audit log location
  // ... other config
};
```

### Maintainers Team

Authorized actors for releases:

```javascript
// In release-gates.js gate5Authorization()
const maintainers = ['ash', 'lightspeed-bot'];  // Add/remove as needed
```

Or via ReleaseGates constructor:

```javascript
const gates = new ReleaseGates({
  maintainers: ['ash', 'jane', 'lightspeed-bot'],
});
```

### GitHub Actions Workflow

Update `.github/workflows/release.yml`:

```yaml
- name: Run Release with Safety Gates
  run: node scripts/workflows/release/run-release-with-gates.cjs
  env:
    INPUT_SCOPE: ${{ inputs.scope || 'patch' }}
    INPUT_DRY_RUN: ${{ inputs.dry_run }}
    GITHUB_ACTOR: ${{ github.actor }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Troubleshooting

### Safety Gates Failing

**Scenario:** User reports "Safety gates failed"

**Steps:**
1. Check audit log: `.agentic-logs/release-*.json`
2. Identify which gate failed (`failedAt` field)
3. Review gate details for specific issue

**Example audit log:**

```json
{
  "timestamp": "2026-08-19T14:30:00Z",
  "actor": "ash",
  "scope": "patch",
  "gates": {
    "gate1_preflight": { "passed": true, "details": [...] },
    "gate2_agentic": { "passed": true, "score": 0.92 },
    "gate3_version": { "passed": false, "details": ["❌ Invalid semver"] },
    ...
  },
  "failedAt": "gate3",
  "outcome": "FAILED"
}
```

### Common Failures

#### Gate 1 (Pre-flight) Failed

**Possible causes:**
- User not on `develop` branch
- Uncommitted changes exist
- Missing VERSION or CHANGELOG file

**Admin action:**
- Guide user through Git setup
- No infrastructure change needed

#### Gate 2 (Agentic Score) Failed

**Possible cause:** Changelog quality too low

**Admin action:**
- Adjust `AGENTIC_SCORE_THRESHOLD` if too strict
- Or guide user to improve changelog
- No infrastructure change needed

#### Gate 5 (Authorization) Failed

**Possible cause:** User not in maintainers team

**Admin action:**
1. Verify GitHub team: `lightspeedwp/maintainers`
2. Add user via GitHub UI: https://github.com/orgs/lightspeedwp/teams/maintainers/members
3. User can retry after team sync (~5 min)

#### Gate 6 (Integrity) Failed

**Possible cause:** Gitleaks detected secrets

**Admin action:**
- User must remove secrets from code
- If false positive:
  1. Add to `.gitleaks.toml` ignore list
  2. Commit and try again

### Gitleaks Not Available

**Warning:** ⚠️ GATE 6 SKIPPED: Gitleaks not available

**Cause:** Gitleaks CLI not installed in CI environment

**Fix (infrastructure):**
```yaml
# In release.yml GitHub Actions job:
- name: Install Gitleaks
  run: |
    brew install gitleaks  # macOS
    # OR
    apt-get install gitleaks  # Linux
```

### Phase 4 Scripts Failing

**Scenario:** All gates pass, but Phase 4 fails

**Steps:**
1. Check if issue is in Phase 4 (not Phase 5A)
2. Review Phase 4 logs: `release-agent.log`
3. Run Phase 4 directly to isolate:
   ```bash
   node scripts/workflows/release/run-release-agent.cjs
   ```

**If Phase 4 issue:** Create GitHub issue for Phase 4 team

**If integration issue:** Check:
- Environment variables passed correctly
- Scripts can find each other
- File permissions

---

## Monitoring & Analytics

### Audit Logs

Audit logs stored in `.agentic-logs/release-*.json`:

```bash
# List all release audits
ls -la .agentic-logs/

# View latest release audit
cat .agentic-logs/release-$(ls -t .agentic-logs/ | head -1).json | jq .

# Count releases by actor
grep -h '"actor"' .agentic-logs/*.json | sort | uniq -c

# Find all failed releases
grep '"outcome": "FAILED"' .agentic-logs/*.json | wc -l
```

### Metrics Dashboard

Create a GitHub Gist with metrics:

```bash
# Count successful releases
grep -c '"outcome": "SUCCESS"' .agentic-logs/*.json

# Average agentic score
grep -h '"score"' .agentic-logs/*.json | \
  jq '.score' | awk '{sum+=$1; count++} END {print sum/count}'

# Most common gate failures
grep -h '"failedAt"' .agentic-logs/*.json | sort | uniq -c
```

### Health Check

```bash
# Verify all gates module can be imported
node -e "const ReleaseGates = require('./scripts/gates/release-gates.js'); console.log('✅ Gates module OK');"

# Run test suite
npm test -- scripts/gates/__tests__/release-gates.test.js

# Check coverage
npm run test:coverage -- scripts/gates/
```

---

## Maintenance Tasks

### Weekly

- [ ] Review audit logs for failures
- [ ] Check if any gates need threshold adjustment
- [ ] Verify maintainers team membership current

### Monthly

- [ ] Archive old audit logs (> 30 days)
- [ ] Review Phase 4 integration points for changes
- [ ] Test dry-run mode end-to-end

### Quarterly

- [ ] Review agentic reasoning logic for accuracy
- [ ] Update documentation with new patterns
- [ ] Plan Phase 5B (multi-repo) enhancements

---

## Security Considerations

### Secret Redaction

Audit logs automatically redact:
- `token=*`
- `secret=*`
- `password=*`
- `key=*`
- `api_key=*`

**Before log:**
```
GITHUB_TOKEN=ghp_1234567890abcdef
```

**After log:**
```
GITHUB_TOKEN=[REDACTED]
```

### Authorization

Gate 5 (Authorization) enforces GitHub team membership:
- Only members of `@lightspeedwp/maintainers` can release
- Check is done at runtime (not at deployment)
- Failure blocks release immediately

### Integrity

Gate 6 (Integrity Filter) blocks releases with secrets:
- Uses Gitleaks (optional, but recommended)
- Catches API keys, tokens, credentials
- Can have false positives (configure ignore list)

---

## Rollback Procedures

### If Entire Gate System Fails

**Fallback to Phase 4 directly:**

```bash
# Skip gates entirely
node scripts/workflows/release/run-release-agent.cjs

# OR bypass agentic layer in workflow
node scripts/workflows/release/run-release-agent.cjs
```

### If Specific Gate is Broken

**Temporarily disable gate:**

Edit `scripts/gates/release-gates.js`:

```javascript
// Comment out the failing gate call
async runAllGates() {
  // this.gate5Authorization();  // DISABLED: broken due to X
  // if (!this.results.gate5_authorization.passed) return false;
}
```

### Emergency Release Procedure

1. Verify release safety manually
2. Run Phase 4 directly:
   ```bash
   node scripts/workflows/release/run-release-agent.cjs
   ```
3. Document in GitHub issue why gates were bypassed
4. Fix gates and re-enable

---

## Performance

### Typical Gate Execution Times

| Gate | Typical Time | Notes |
|------|---|---|
| Gate 1 (Pre-flight) | <100ms | Local git operations |
| Gate 2 (Agentic) | 100-500ms | File reads + scoring |
| Gate 3 (Version) | <50ms | Regex parsing |
| Gate 4 (Tag) | 100-200ms | Git lookup |
| Gate 5 (Auth) | <10ms | Memory lookup |
| Gate 6 (Integrity) | 1-10s | Depends on repo size |
| Gate 7 (Approval) | <10ms | Env var check |
| **Total** | **~2-12 seconds** | Usually ~3-5s |

### Optimization Tips

- Gate 6 (Gitleaks) is slowest; consider caching results
- Gate 1 benefits from local git setup
- Parallel gate execution not recommended (order matters)

---

## Integration with CI/CD

### GitHub Actions

```yaml
# .github/workflows/release.yml
- name: Run Release with Gates
  run: node scripts/workflows/release/run-release-with-gates.cjs
  env:
    INPUT_SCOPE: ${{ inputs.scope || 'patch' }}
    GITHUB_ACTOR: ${{ github.actor }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Environment Variables Required

- `GITHUB_ACTOR` — GitHub username triggering release
- `GITHUB_TOKEN` — Token for API calls (default: ${{ secrets.GITHUB_TOKEN }})
- `INPUT_SCOPE` — Release scope: patch, minor, major
- `INPUT_DRY_RUN` — Optional: true/false
- `VERBOSE` — Optional: true for debug output

---

## Future Enhancements (Phase 5B+)

- [ ] Multi-repo support (plugins, themes)
- [ ] AI engine selection (Copilot, Claude, OpenAI)
- [ ] Scheduled auto-releases
- [ ] Rollback automation
- [ ] Slack notifications
- [ ] Advanced approval workflows (Jira, Linear)

---

## Support & Escalation

### Tier 1: Self-Service

- Check user guide: [AGENTIC_RELEASE_USER_GUIDE.md](./AGENTIC_RELEASE_USER_GUIDE.md)
- Review audit log in `.agentic-logs/`
- Try dry-run: `npm run release -- --dry-run`

### Tier 2: Admin Review

- Check this admin guide
- Verify GitHub team membership
- Review gate thresholds
- Contact @ash

### Tier 3: Engineering Team

- File GitHub issue with `release-agent` label
- Include audit log JSON
- Include reproduction steps

---

*Agentic Release Workflow Admin Guide v1.0*  
*Last updated: 2026-08-19*
