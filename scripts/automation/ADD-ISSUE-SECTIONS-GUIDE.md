# Bulk Issue Template Section Fixer

**Purpose**: Automatically add missing Definition of Ready (DoR) and Definition of Done (DoD) sections to issues marked with `status:needs-more-info` label.

**Status**: Ready to use

---

## Quick Start

### Prerequisites

- Node.js 14+
- GitHub API token with `repo` scope
- Set `GITHUB_TOKEN` environment variable

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### Test Run (No Changes)

```bash
node scripts/automation/add-issue-template-sections.js --dry-run --limit=5
```

### Apply Fixes

```bash
node scripts/automation/add-issue-template-sections.js --limit=25
```

---

## How It Works

1. **Fetches Issues**: Queries all open issues with `status:needs-more-info` label
2. **Checks Content**: Skips issues that already have DoR/DoD sections
3. **Determines Type**: Identifies issue type from labels (feature, bug, epic, etc.)
4. **Generates Sections**: Creates appropriate DoR/DoD sections based on type
5. **Updates Issues**: Adds sections to issue body
6. **Cleans Up Labels**: Removes `status:needs-more-info` label after fixing

---

## Command Options

### `--dry-run`

Preview changes without applying them.

```bash
node scripts/automation/add-issue-template-sections.js --dry-run --limit=10
```

### `--limit=N`

Process only N issues (default: 10). Useful for testing.

```bash
node scripts/automation/add-issue-template-sections.js --limit=5
```

### `--issue=ID`

Process specific issue number only.

```bash
node scripts/automation/add-issue-template-sections.js --issue=1640
```

### `--start-from=N`

Start processing from issue N (for pagination/resumption).

```bash
node scripts/automation/add-issue-template-sections.js --limit=25 --start-from=25
```

---

## Examples

### Example 1: Preview First 5 Issues

```bash
node scripts/automation/add-issue-template-sections.js --dry-run --limit=5
```

**Output**:

```
🔧 Issue Template Section Fixer

📋 Configuration:
   Repository: lightspeedwp/.github
   Label: status:needs-more-info
   Limit: 5 issues
   Dry Run: YES

📥 Fetching issues...
✅ Found 91 issues with status:needs-more-info

🚀 Processing 5 issue(s)...

📋 DRY RUN: Would update #1640 (type: feature)
   Title: [PHASE-4] Implement Stacked PR Release Workflow
   Change: +847 chars

⏭️  #1626 - Already has template sections (bug)
📋 DRY RUN: Would update #1622 (type: task)
   Title: Fix broken CI validation workflows
   Change: +612 chars
...

📊 Summary:
   Processed: 5
   Would update: 3
   Skipped: 2

💡 Run without --dry-run to apply changes.
```

### Example 2: Fix High-Priority Issues First

```bash
# Fix all critical/important priority issues
node scripts/automation/add-issue-template-sections.js --limit=15

# Then process remaining normal priority issues
node scripts/automation/add-issue-template-sections.js --limit=25 --start-from=15
```

### Example 3: Fix Single Issue

```bash
node scripts/automation/add-issue-template-sections.js --issue=1640 --dry-run
# Verify output, then:
node scripts/automation/add-issue-template-sections.js --issue=1640
```

---

## Template Sections by Issue Type

### Feature Issues (`type:feature`)

**Definition of Ready** includes:

- Problem statement and outcome
- Acceptance criteria  
- Designs/specs/references
- Dependencies
- Estimates
- Stakeholder list
- Milestone assignment

**Definition of Done** includes:

- Acceptance criteria met
- Tests and CI
- Accessibility (WCAG 2.2 AA)
- Security (OWASP compliance)
- Performance validation
- Docs/changelog
- Feature toggles
- QA/UAT
- Release notes

### Bug Issues (`type:bug`)

**Definition of Ready** includes:

- Reproduction steps
- Expected vs actual behavior
- Environment/version info
- Related issues
- Severity/impact
- Fix acceptance criteria

**Definition of Done** includes:

- Bug fix verified
- Root cause documented
- Regression tests
- No new warnings
- Docs/changelog
- Backport consideration
- Release notes

### Epic/Story Issues (`type:epic`, `type:story`)

**Definition of Ready** includes:

- Vision and scope
- Success criteria
- High-level tasks
- Dependencies/risks
- Timeline and resources
- Stakeholder alignment

**Definition of Done** includes:

- Child issues completed
- Acceptance criteria met
- Epic documentation
- Release notes
- Post-launch support
- Retrospective

### Default (All Other Types)

**Definition of Ready** includes:

- Problem statement
- Acceptance criteria
- Related issues
- Required resources

**Definition of Done** includes:

- Acceptance criteria met
- Changes tested
- Documentation updated
- Merged and deployed
- Stakeholders notified

---

## Safety & Best Practices

### Before Running

1. **Backup**: Script only reads/writes issues; no destructive operations
2. **Test**: Always run with `--dry-run` first
3. **Verify**: Review the dry-run output for correctness
4. **Token**: Ensure `GITHUB_TOKEN` has sufficient permissions

### Recommended Workflow

```bash
# Step 1: Dry run to preview changes
node scripts/automation/add-issue-template-sections.js \
  --dry-run \
  --limit=10

# Step 2: Review output and verify sections look correct

# Step 3: Run actual fix on same batch
node scripts/automation/add-issue-template-sections.js \
  --limit=10

# Step 4: Check GitHub UI to verify changes applied
# - Issues should no longer have status:needs-more-info label
# - DoR/DoD sections should be visible in issue body

# Step 5: Continue with next batch
node scripts/automation/add-issue-template-sections.js \
  --limit=25 \
  --start-from=10
```

---

## Troubleshooting

### "GITHUB_TOKEN environment variable not set"

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Get a token: <https://github.com/settings/tokens/new

- Scopes needed: `repo` (all)

### "GitHub API error 401: Bad credentials"

- Token expired or invalid
- Generate new token: <https://github.com/settings/tokens/new
- Re-export environment variable

### "GitHub API error 403: API rate limit exceeded"

- Hit GitHub API rate limit (60 requests/hour for authenticated)
- Wait 1 hour before retrying
- Or: Reduce `--limit` and run in smaller batches

### "Issue not found or doesn't have the label"

- Verify issue number is correct
- Ensure issue has `status:needs-more-info` label
- Label may have been removed if already fixed

### Script stops unexpectedly

- Check internet connection
- Verify GitHub API is accessible
- Check console output for specific error

---

## Statistics & Progress

### Before Running

- **Total issues**: 91 with `status:needs-more-info`
- **Blocking issues** (critical/important): ~15 (manually fixed priority)
- **Remaining**: ~76 (good candidates for bulk automation)

### Expected Results

- **Success rate**: ~90-95% (some issues may have edge cases)
- **Time per batch**: ~10-15 minutes for 25 issues
- **Estimated total time**: 2-3 hours for all 91 issues

### Tracking Progress

After each run, GitHub will auto-remove the `status:needs-more-info` label from fixed issues. You can track progress by checking:

- Open issues with `status:needs-more-info`: Should decrease with each run
- Check: <https://github.com/lightspeedwp/.github/issues?q=is:open+label:status%3Aneeds-more-info

---

## Integration & Automation

### Potential Future Improvements

1. **Bulk fixes on PR creation** - Automatically add sections when issue is created
2. **Scheduled automation** - Run nightly to fix new issues
3. **Slack notifications** - Alert team when fixes applied
4. **Metrics dashboard** - Track issue health over time

### Related Workflows

- `.github/workflows/template-enforcement.yml` - Flags non-compliant issues
- `.github/workflows/issue-labeler.yml` - Auto-assigns issue type labels

---

## Support & Feedback

### If You Encounter Issues

1. Run with `--dry-run` to confirm expected changes
2. Check console output for error details
3. Verify GitHub token has correct permissions
4. Try with a smaller `--limit` to isolate issues

### Questions or Suggestions?

- Check this guide first
- Review the script source code (comments explain each section)
- Open an issue in the repository with details

---

**Last Updated**: 2026-08-09
**Status**: Production Ready
**Tested**: Initial bulk fix on 5-10 issues recommended before full run
