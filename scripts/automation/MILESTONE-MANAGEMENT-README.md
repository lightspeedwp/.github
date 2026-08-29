# Milestone Management Scripts

AI-enhanced scripts for bulk managing GitHub milestone assignments for issues.

## Scripts Overview

### 1. `reassign-v1-to-v1-1.js`

Reassigns all open issues from milestone v1.0 to milestone v1.1.

**Purpose**: Migrate issues from a completed milestone to the next phase.

**Features**:
- Fetches all open issues with v1.0 milestone
- Reassigns them to v1.1 in batch
- Provides detailed logging and statistics
- Dry-run mode for safe preview

**Usage**:

```bash
# Dry-run to preview changes
node reassign-v1-to-v1-1.js --dry-run

# Dry-run with verbose output
node reassign-v1-to-v1-1.js --dry-run --verbose

# Execute reassignment
node reassign-v1-to-v1-1.js

# Reassign between custom milestones
node reassign-v1-to-v1-1.js --source v1.0 --target v1.1
```

**Options**:
- `--dry-run`: Show what would be changed without making API calls
- `--verbose`: Enable detailed logging of each operation
- `--source MILESTONE`: Source milestone to reassign from (default: v1.0)
- `--target MILESTONE`: Target milestone to reassign to (default: v1.1)

**Environment Variables**:
- `GITHUB_TOKEN`: Required. Personal Access Token with 'repo' scope
- `GITHUB_OWNER`: Optional. Repository owner (default: lightspeedwp)
- `GITHUB_REPO`: Optional. Repository name (default: .github)

**Output Example**:
```
✅ 2024-08-29T10:30:45.123Z [reassign-v1-to-v1-1] Starting milestone reassignment...
ℹ️ 2024-08-29T10:30:46.234Z [reassign-v1-to-v1-1] Found 45 open issue(s) with milestone #3
✅ 2024-08-29T10:30:47.345Z [reassign-v1-to-v1-1] Reassigned issue #123 to milestone #4
✅ 2024-08-29T10:30:47.456Z [reassign-v1-to-v1-1] Reassignment complete. | Reassigned: 45 | Skipped: 0 | Errors: 0
```

---

### 2. `distribute-unallocated-milestones.js`

AI-enhanced script that distributes issues without milestone assignments across milestones v1.1 to v1.6.

**Purpose**: Intelligently allocate backlog items to upcoming milestones based on related topics/features.

**Features**:
- Fetches all open issues without milestone
- Groups related issues using AI analysis (if Claude API available)
- Falls back to local analysis using labels and keywords
- Distributes groups across 5 milestones (v1.1-v1.6)
- Balances workload while keeping related issues together
- Comprehensive logging and statistics

**AI Analysis**:
When `ANTHROPIC_API_KEY` is set, the script uses Claude API to:
1. Analyze issue titles, descriptions, and labels
2. Identify natural groupings and themes
3. Suggest optimal milestone allocation
4. Consider issue complexity and relationships

Without API key, falls back to local analysis using:
- Label categorization (bug, feature, documentation, etc.)
- Title keyword matching
- Issue content analysis

**Usage**:

```bash
# Preview distribution plan (no changes)
node distribute-unallocated-milestones.js --dry-run

# Preview with AI analysis and verbose logging
ANTHROPIC_API_KEY=sk-... node distribute-unallocated-milestones.js --dry-run --verbose

# Apply distribution (with local analysis)
node distribute-unallocated-milestones.js

# Apply with AI analysis
ANTHROPIC_API_KEY=sk-... node distribute-unallocated-milestones.js --verbose

# Test with limited issue set
node distribute-unallocated-milestones.js --dry-run --limit 10
```

**Options**:
- `--dry-run`: Show what would be changed without making API calls
- `--verbose`: Enable detailed logging of analysis and decisions
- `--limit N`: Limit to processing first N issues (for testing)

**Environment Variables**:
- `GITHUB_TOKEN`: Required. Personal Access Token with 'repo' scope
- `ANTHROPIC_API_KEY`: Optional. Claude API key for intelligent analysis
- `GITHUB_OWNER`: Optional. Repository owner (default: lightspeedwp)
- `GITHUB_REPO`: Optional. Repository name (default: .github)

**Output Example**:
```
✅ 2024-08-29T10:30:45.123Z [distribute-milestones] Starting intelligent milestone distribution...
ℹ️ 2024-08-29T10:30:46.234Z [distribute-milestones] Found 150 target milestone(s): v1.1, v1.2, v1.3, v1.4, v1.5, v1.6
ℹ️ 2024-08-29T10:30:47.345Z [distribute-milestones] Found 87 unallocated issue(s)
ℹ️ 2024-08-29T10:30:48.456Z [distribute-milestones] Analyzing issues with AI...
  → Issues categorized into 5 group(s)
  → Category "Bug Fixes" (18 issue(s)) → Milestone #4
  → Category "Features & Enhancements" (31 issue(s)) → Milestone #5
✅ 2024-08-29T10:30:49.567Z [distribute-milestones] Assigned issue #234 to milestone #4
✅ 2024-08-29T10:30:50.678Z [distribute-milestones] Distribution complete. | Distributed: 87 | Skipped: 0 | Errors: 0
```

---

## Local Analysis Categories

When `ANTHROPIC_API_KEY` is not set, issues are automatically categorized as:

1. **Bug Fixes**: Issues labeled "bug" or with "fix"/"broken" in title
2. **Documentation & Examples**: Issues labeled "documentation" or with "doc"/"example" in title
3. **Testing & Quality**: Issues labeled "test"/"ci" or with "test" in title
4. **Infrastructure & Tooling**: Issues labeled "chore"/"infrastructure" or with "setup"/"config" in title
5. **Features & Enhancements**: All other issues

---

## Distribution Algorithm

### Round-Robin Allocation

Issues are distributed across milestones using a round-robin approach:
- Each category is assigned to the next available milestone in sequence
- This ensures balanced workload distribution
- Related issues within a category stay in the same milestone

Example with 5 categories and 6 milestones:
```
Category 1 → v1.1
Category 2 → v1.2
Category 3 → v1.3
Category 4 → v1.4
Category 5 → v1.5
(Next categories would cycle back to v1.1)
```

---

## Usage Workflows

### Workflow 1: Migrate Completed Milestone

1. **Preview the migration**:
   ```bash
   node reassign-v1-to-v1-1.js --dry-run --verbose
   ```

2. **Execute the migration**:
   ```bash
   node reassign-v1-to-v1-1.js
   ```

3. **Verify results**:
   - Check GitHub milestone page
   - Confirm all v1.0 issues moved to v1.1

### Workflow 2: Plan Next Release with Backlog Issues

1. **Analyze unallocated issues with AI** (optional):
   ```bash
   ANTHROPIC_API_KEY=sk-... node distribute-unallocated-milestones.js --dry-run --verbose
   ```

2. **Review the distribution plan**:
   - Check which issues will be assigned to each milestone
   - Look for logical groupings

3. **Apply the distribution**:
   ```bash
   ANTHROPIC_API_KEY=sk-... node distribute-unallocated-milestones.js --verbose
   ```

4. **Verify and refine**:
   - Check GitHub milestones
   - Move issues manually if needed for priority adjustments

---

## API Reference

### MilestoneReassigner Class

**Constructor**:
```javascript
const reassigner = new MilestoneReassigner({
  owner: 'lightspeedwp',      // GitHub org/user
  repo: '.github',            // Repository name
  dryRun: false,              // Dry-run mode
  verbose: false              // Verbose logging
});
```

**Methods**:
- `reassignMilestone(sourceMilestoneNumber, targetMilestoneNumber)`: Main method
- `findMilestones()`: Fetch all milestones
- `fetchIssuesWithMilestone(milestoneNumber)`: Get issues for a milestone
- `reassignIssue(issueNumber, targetMilestoneNumber)`: Update single issue

### MilestoneDistributor Class

**Constructor**:
```javascript
const distributor = new MilestoneDistributor({
  owner: 'lightspeedwp',      // GitHub org/user
  repo: '.github',            // Repository name
  dryRun: false,              // Dry-run mode
  verbose: false,             // Verbose logging
  limit: null                 // Limit issues (for testing)
});
```

**Methods**:
- `distribute(issues)`: Main method
- `findMilestones()`: Fetch target milestones (v1.1-v1.6)
- `fetchUnallocatedIssues()`: Get issues without milestone
- `analyzeIssuesWithAI(issues)`: AI-powered categorization
- `analyzeIssuesLocally(issues)`: Local categorization
- `distributeToMilestones(categories)`: Round-robin allocation

---

## Error Handling

Both scripts provide robust error handling:

- **Missing GitHub Token**: Script exits with clear error message
- **Missing Milestones**: Logs which milestones couldn't be found
- **API Failures**: Individual issue failures don't stop processing
- **404 Errors**: Gracefully handles deleted issues
- **AI Analysis Failures**: Falls back to local analysis automatically

All errors are collected and reported in the summary statistics.

---

## Performance Considerations

- **GitHub API Rate Limiting**: Default 60 reqs/min; paginated requests handle large issue sets
- **AI Analysis**: Claude API calls add ~2-3 seconds for analysis
- **Bulk Operations**: Processing 100+ issues takes proportional time (typically < 1 min)
- **Dry-Run Mode**: Significantly faster (no API writes), useful for testing

---

## Security & Best Practices

1. **Token Management**:
   - Use GitHub Personal Access Token with 'repo' scope only
   - Never commit tokens to version control
   - Use environment variables or `.env` file

2. **Testing**:
   - Always use `--dry-run` first to preview changes
   - Test with `--limit 5` on small sets first
   - Review GitHub milestone page after execution

3. **Audit Trail**:
   - Script logs all actions to console
   - Consider capturing output to file: `node script.js > audit.log 2>&1`
   - GitHub's issue activity shows who/when changes were made

4. **Idempotency**:
   - Scripts are safe to run multiple times
   - Already-allocated issues are skipped
   - Dry-run mode is truly read-only

---

## Troubleshooting

### "GITHUB_TOKEN environment variable is required"
```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
node script.js
```

### "No open milestones found"
- Check that target milestones exist in repository
- For reassign script: ensure v1.0 and v1.1 milestones exist
- For distribute script: ensure v1.1 through v1.6 milestones exist

### "API error: 403 Forbidden"
- Verify GitHub token has 'repo' scope
- Check rate limiting: 60 requests/minute
- Wait a few minutes before retrying

### AI analysis producing unexpected categories
- Review verbose output: `--verbose` flag shows analysis details
- Check issue labels and titles are descriptive
- Consider providing explicit milestone assignments manually

### Dry-run shows no changes
- Confirm there are actually unallocated issues
- Use `--verbose` to see detailed analysis
- Check milestone names match exactly (case-sensitive)

---

## Integration with CI/CD

### GitHub Actions Workflow Example

```yaml
name: Distribute Milestones
on:
  schedule:
    - cron: '0 9 * * MON' # Weekly on Mondays

jobs:
  distribute:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      
      - run: npm ci
      
      - name: Distribute unallocated issues
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/automation/distribute-unallocated-milestones.js --verbose
```

---

## Support & Contributing

For issues or improvements:
1. Check existing GitHub issues in the `.github` repository
2. Test in dry-run mode first
3. Document any edge cases or special handling needed
4. Keep scripts focused on milestone management

---

## Related Documentation

- [GitHub Milestones API](https://docs.github.com/en/rest/issues/milestones)
- [GitHub Issues API](https://docs.github.com/en/rest/issues)
- [Claude API Documentation](https://docs.anthropic.com/)
- [LightSpeed GitHub Automation](./README.md)
