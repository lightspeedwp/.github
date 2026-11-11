# Test Case: Custom Table Exclusions

User has a production database backup but wants to exclude specific tables (like search indexes and logs) to speed up the import process.

## Scenario
- **Source**: Production backup (2 GB SQL export with large search index + logs)
- **Target**: New Studio site at `/Users/ash/Studio/prod-testing`
- **Custom request**: Exclude all SearchWP, actionscheduler, and redirection tables
- **Goal**: Import production data efficiently without diagnostics/search overhead

## Task
Migrate the production database with user-specified table exclusions:
1. Analyze the export
2. User specifies which tables to exclude (SearchWP, actionscheduler_logs, redirection tables)
3. Skill confirms the exclusions will reduce import size significantly
4. Create backup of the target site
5. Import with exclusions
6. Show URL replacement dry-run (production.com → prod-testing.local)
7. User approves URL replacement
8. Verify import success

## Success Criteria
- Skill accepts user-specified exclusion list
- Shows impact (how much data is being excluded)
- Import completes without the excluded tables
- Row counts for non-excluded tables match original
- Site loads and is functional despite excluded tables
