# Test Case: Sync Staging to Local Studio

User wants to bring a staging WordPress database into their local Studio site for testing new features before pushing to production.

## Scenario
- **Source**: Staging backup exported as SQL (1.2 GB, 200k posts, typical logging overhead)
- **Target**: Local Studio site at `/Users/ash/Studio/my-project-local`
- **Goal**: Mirror staging data locally with smart exclusions to reduce import time

## Task
Migrate the staging database to the local Studio site. Use the skill to:
1. Analyze the export (what tables are included, suggested exclusions)
2. Suggest table exclusions based on size analysis
3. Create a backup of the target site before importing
4. Import the sanitized database
5. Show URL replacement dry-run (staging.dev → my-project.local)
6. Apply the replacements
7. Verify the import (site loads, row counts match)

## Success Criteria
- All steps complete without errors
- User is presented with clear choices at each gate (backup, exclusions, URL replacement)
- Final report shows:
  - Row counts for core tables match the original export
  - Site loads and is accessible
  - URL replacements applied correctly
  - No data corruption detected
