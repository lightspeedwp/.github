# Test Case: Import Failure & Recovery

User encounters an import error and needs the skill to guide recovery with a rollback to the backup.

## Scenario
- **Source**: Database export with a corrupted or problematic table
- **Target**: Studio site that was backed up before the attempted import
- **Issue**: Import fails on a specific table (e.g., postmeta corruption)
- **Goal**: Guide user through rollback and retry with that table excluded

## Task
Simulate an import failure scenario:
1. Attempt import and encounter an error partway through
2. Skill detects the failure and offers rollback
3. Rollback restores the backup successfully
4. Skill identifies which table caused the failure
5. Recommend excluding that table in a retry
6. Provide clear next steps

## Success Criteria
- Skill clearly communicates the failure point
- Rollback option is presented and explained
- Backup is restored if rollback is accepted
- User is shown which table failed and why
- Recommendation to retry with problematic table excluded is clear
- Instructions for the retry are actionable
