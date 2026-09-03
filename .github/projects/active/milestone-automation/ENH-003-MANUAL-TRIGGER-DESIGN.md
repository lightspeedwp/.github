---
title: Manual Trigger System Design
description: Design specification for Phase 3 manual workflow triggering
type: documentation
file_type: documentation
status: draft
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags: []
---

# ENH-003: Manual Trigger System Design

**Issue:** [#2572](https://github.com/lightspeedwp/.github/issues/2572)  
**Created:** 2026-09-02  
**Status:** 📋 Design Phase

---

## Overview

A system to allow team members to manually trigger milestone distribution workflows via GitHub issue labels or comments.

**Scope:** Phase 3+ (Design in Phase 2)

**Objectives:**
- Enable on-demand milestone assignments
- No direct script/API access needed
- Audit trail via GitHub
- Controlled access via labels/permissions
- Self-service for team members

---

## User Personas & Use Cases

### Persona 1: Release Manager

**Goal:** Trigger milestone assignment for new release

**Current Workflow:**
1. Manually coordinate with platform team
2. Wait for scheduled workflow
3. Check GitHub Actions logs

**Desired Workflow:**
1. Comment `/distribute-milestones v2.0` on an issue
2. Workflow executes immediately
3. Get notification when complete

### Persona 2: Issue Triage Lead

**Goal:** Bulk-assign milestones to recently imported issues

**Current Workflow:**
1. Use GitHub API directly (requires access)
2. Or wait for next scheduled run

**Desired Workflow:**
1. Add `trigger:milestone-distribution` label to any issue
2. Workflow executes within minutes
3. Auto-remove label when done

### Persona 3: QA/Testing

**Goal:** Test workflow with specific parameters

**Current Workflow:**
1. Ask platform team to run with special config
2. Manual back-and-forth communication

**Desired Workflow:**
1. Comment `/distribute-milestones --dry-run v1.1`
2. Get dry-run results immediately
3. Review output before production run

---

## Trigger Methods

### Method 1: Issue Labels (Most Accessible)

**Label:** `trigger:milestone-distribution`

**Trigger Conditions:**
- Label added to ANY issue
- Must have write permissions to repo
- Automatically removed after execution

**Workflow:**
```
User adds label → Webhook detected → Workflow starts → Executes → Label removed
```

**Implementation:**
```yaml
# Workflow trigger
on:
  issues:
    types: [labeled]

jobs:
  distribute:
    if: contains(github.event.issue.labels.*.name, 'trigger:milestone-distribution')
    runs-on: ubuntu-latest
    steps:
      # ... distribution logic
      - name: Remove trigger label
        if: success()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.removeLabel({
              issue_number: context.issue.number,
              name: 'trigger:milestone-distribution'
            })
```

**Pros:**
- Visual in issue UI
- Easy to understand for all users
- Asynchronous (non-blocking)
- Safe (permissions-based)

**Cons:**
- No parameters (just yes/no)
- Label clutter if many issues
- Can't specify milestone

---

### Method 2: Issue Comments (Most Flexible)

**Command:** `/distribute-milestones [OPTIONS]`

**Examples:**
```
/distribute-milestones                    # Default (current milestone)
/distribute-milestones v1.1              # Specific milestone
/distribute-milestones --dry-run v1.1    # Dry-run mode
/distribute-milestones --force v2.0      # Force reassign existing
```

**Permissions:**
- Repo write access required
- Rate-limited to 5 commands per hour per user
- Logged to issue for audit

**Implementation:**
```javascript
// GitHub Actions job + script
const comment = github.context.payload.comment.body;
const isCommand = comment.includes('/distribute-milestones');

if (isCommand) {
  const params = parseCommand(comment);
  await executeDistribution(params);
  
  // Post result as reply
  github.rest.issues.createComment({
    issue_number: context.issue.number,
    body: `✅ Distribution completed: ${params.milestone}`
  });
}
```

**Pros:**
- Flexible with options/parameters
- Clear history in comments
- Easy to explain to users
- Can pass configuration

**Cons:**
- Requires parsing/validation
- More complex implementation
- Potential for command errors

**Syntax Reference:**
```markdown
/distribute-milestones [MILESTONE] [OPTIONS]

Arguments:
  MILESTONE     Target milestone (default: current auto-detected)

Options:
  --dry-run     Simulate without updating
  --force       Reassign issues already with milestones
  --batch SIZE  Process in batches of SIZE (default: 25)
  --limit N     Limit to first N issues (for testing)

Examples:
  /distribute-milestones
  /distribute-milestones v1.1
  /distribute-milestones v2.0 --dry-run
  /distribute-milestones --force v1.1
  /distribute-milestones --dry-run --batch 10 v1.1
```

---

### Method 3: Pull Request Comments (Context-Aware)

**Trigger:** `/distribute-milestones` comment on PR

**Context:** Auto-detect linked issues

**Workflow:**
1. PR comment triggers workflow
2. Extract linked issues from PR description
3. Assign milestones to those issues only
4. Reply with summary

**Implementation:**
```javascript
// In PR context, extract linked issues
const prBody = github.context.payload.pull_request.body;
const linkedIssues = extractIssueNumbers(prBody);

if (linkedIssues.length > 0) {
  // Process only linked issues
  const results = await distributeToIssues(linkedIssues, milestone);
}
```

**Pros:**
- Context-aware (PR-specific issues)
- Useful for batch PRs
- Clear connection to source

**Cons:**
- Requires issue linking in PR
- More complex extraction logic

---

## Recommended Approach: Method 2 (Comments)

**Why Comments?**

1. **Most Flexible** — Can pass parameters
2. **Familiar Pattern** — Like `/cc @person`
3. **Audit Trail** — Clear history in issue
4. **Discoverable** — Easy to document in tips/examples
5. **Safe** — Requires write permissions, rate-limited

---

## Parameter Details

### Milestone Parameter

```
/distribute-milestones v1.1

Options:
  {milestone}    — Must exist in repository
  auto           — Auto-detect from recent milestones (default)
  current        — Current active milestone (if defined)
```

### Dry-Run Mode

```
/distribute-milestones --dry-run v1.1

Result:
• Shows what WOULD be updated
• No actual changes made
• Helpful for validation before production
```

### Force Reassign

```
/distribute-milestones --force v1.1

Result:
• Also reassigns issues already with milestones
• Default: Only assign unallocated issues
• Useful during major version transitions
```

### Batch Size

```
/distribute-milestones --batch 10 v1.1

Result:
• Process in smaller batches (default: 25)
• Useful for rate limit concerns
• Trade-off: Slower execution
```

---

## Workflow Configuration

### GitHub Actions Setup

```yaml
name: Distribution — Manual Trigger

on:
  issue_comment:
    types: [created]

permissions:
  issues: write
  contents: read

jobs:
  handle-command:
    if: github.event.issue.pull_request == null
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Check Permissions
        uses: actions/github-script@v7
        with:
          script: |
            const permission = await github.rest.repos.getCollaboratorPermissionLevel({
              owner: context.repo.owner,
              repo: context.repo.repo,
              username: context.actor
            });
            
            if (permission.data.permission !== 'write' && permission.data.permission !== 'admin') {
              core.setFailed('Insufficient permissions. Write access required.');
            }
      
      - name: Validate Command
        id: validate
        uses: actions/github-script@v7
        with:
          script: |
            const comment = context.payload.comment.body;
            const matches = comment.match(/^\/distribute-milestones(\s|$)/m);
            
            if (!matches) {
              core.notice('Not a milestone distribution command. Exiting.');
              return;
            }
            core.setOutput('isCommand', 'true');
      
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Parse Command
        id: parse
        if: steps.validate.outputs.isCommand == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const comment = context.payload.comment.body;
            const matches = comment.match(/^\/distribute-milestones\s*(.*)/m);
            
            if (!matches) return;
            
            const args = matches[1].split(/\s+/).filter(Boolean);
            const params = {
              milestone: 'auto',
              dryRun: true,
              force: false,
              batchSize: 25
            };
            
            // Parse arguments with proper option consumption
            for (let i = 0; i < args.length; i++) {
              const arg = args[i];
              if (arg === '--dry-run') params.dryRun = true;
              else if (arg === '--force') params.force = true;
              else if (arg === '--batch' && i + 1 < args.length) {
                params.batchSize = parseInt(args[++i], 10);
              }
              else if (!arg.startsWith('--')) params.milestone = arg;
            }
            
            core.setOutput('milestone', params.milestone);
            core.setOutput('dryRun', params.dryRun);
            core.setOutput('force', params.force);
            core.setOutput('batchSize', params.batchSize);
      
      - name: Distribute Milestones
        if: steps.validate.outputs.isCommand == 'true'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          MILESTONE: ${{ steps.parse.outputs.milestone }}
          DRY_RUN: ${{ steps.parse.outputs.dryRun }}
          FORCE: ${{ steps.parse.outputs.force }}
          BATCH_SIZE: ${{ steps.parse.outputs.batchSize }}
        run: |
          node scripts/automation/distribute-unallocated-milestones.js \
            --milestone "$MILESTONE" \
            --dry-run "$DRY_RUN" \
            --force "$FORCE" \
            --batch-size "$BATCH_SIZE"
      
      - name: Reply with Results
        if: steps.validate.outputs.isCommand == 'true' && always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            
            let body = '';
            if (fs.existsSync('distribution-results.json')) {
              const results = JSON.parse(fs.readFileSync('distribution-results.json', 'utf8'));
              body = `
✅ **Distribution Complete**

Milestone: ${{ steps.parse.outputs.milestone }}
Issues Processed: ${results.processedCount}
Successful: ${results.successCount}
Failed: ${results.failureCount}
Duration: ${results.duration}ms
Mode: ${{ steps.parse.outputs.dryRun == 'true' ? '🔒 Dry-Run' : '⚡ Production' }}

[View Run →](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
              `;
            } else if (context.payload.pull_request === null) {
              body = `
⚠️ **Distribution Failed**

No results file generated. Check workflow logs for details.

[View Run →](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
              `;
            }
            
            if (body) {
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                body: body.trim()
              });
            }
```

---

## Access Control

### Permission Levels

**Level 1: Read-Only (Public)**
- View distribution status via GitHub Actions

**Level 2: Trigger with Defaults (Write)**
- Comment `/distribute-milestones` (uses current/auto)
- Uses safe defaults (dry-run recommended first)

**Level 3: Trigger with Parameters (Write + Elevated)**
- Comment `/distribute-milestones v2.0 --force`
- Requires explicit milestone parameter
- Force reassign requires explicit opt-in

**Level 4: Admin (Admin)**
- Modify workflow configuration
- Change rate limits
- Change parameters

### Implementation

Permission checking is enforced at the **start of the workflow** (before command parsing). The "Check Permissions" step:

1. Queries GitHub API for user's permission level on the repository
2. Fails the workflow if user has less than write access
3. Prevents read-only users from triggering distribution
4. Logs the failure with clear error message

This fail-closed approach ensures that only authorized users (with write access) can execute distribution commands, regardless of the milestone parameter or options used.

---

## Rate Limiting & Safety

### Per-User Rate Limits

- Max 5 commands per hour
- Max 1 concurrent execution per user
- Max 50 issues per command (without --limit)

### Execution Safeguards

- Dry-run is default for first-time users
- Large batches (>50) require explicit acknowledgment
- Force reassign requires explicit flag
- Timeout: 30 minutes max per execution

### Audit & Logging

```json
{
  "timestamp": "2026-09-02T15:43:32Z",
  "user": "ashley",
  "command": "/distribute-milestones v1.1",
  "parameters": {
    "milestone": "v1.1",
    "dryRun": false,
    "force": false,
    "batchSize": 25
  },
  "result": {
    "status": "success",
    "issuesProcessed": 8,
    "duration": 3200
  }
}
```

---

## Documentation & Discovery

### In-App Help

```
/distribute-milestones help

🤖 Milestone Distribution Manual Trigger

Usage: /distribute-milestones [MILESTONE] [OPTIONS]

Options:
  --dry-run     Preview without changes
  --force       Reassign existing milestones
  --batch N     Batch size (default: 25)
  --limit N     Limit to N issues (for testing)

Examples:
  /distribute-milestones v1.1
  /distribute-milestones --dry-run v2.0
  /distribute-milestones --force v1.1

For more info: https://github.com/lightspeedwp/.github/wiki/milestone-distribution
```

### Tips in Issue Templates

```markdown
💡 **Did you know?**
You can manually trigger milestone distribution!
Just comment `/distribute-milestones` on any open issue.

```

### Documentation Page

- Location: `.github/TRIGGER_MANUAL_DISTRIBUTION.md`
- Content: Command reference, examples, troubleshooting
- Linked from: README, wiki, issue templates

---

## Rollout Plan

### Phase 3A: MVP (Week 1)
- [ ] Implement issue comment parsing
- [ ] Basic `/distribute-milestones` command
- [ ] Dry-run mode
- [ ] Result reply comment

### Phase 3B: Enhancement (Week 2)
- [ ] Add `--force` option
- [ ] Add milestone parameter
- [ ] Rate limiting
- [ ] Help command

### Phase 3C: Polish (Week 3)
- [ ] Batch size parameter
- [ ] Issue limit parameter
- [ ] Better error messages
- [ ] Documentation

### Phase 3D: Optional (Week 4)
- [ ] Label-based trigger
- [ ] Scheduled commands (e.g., "/distribute daily at 6pm")
- [ ] Interactive slash command UI

---

## Success Metrics

### Adoption
- [ ] Team uses manual triggers ≥2x per week
- [ ] Documentation viewed ≥50 times
- [ ] Help command used ≥10 times

### Usability
- [ ] Command parsing 99%+ successful
- [ ] User satisfaction ≥4/5
- [ ] Support requests ≤1 per week

### Safety
- [ ] Zero unintended changes
- [ ] Rate limit enforcement working
- [ ] Audit trail complete

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Accidental force reassign | Medium | High | Require explicit --force flag |
| Rate limit abuse | Low | Medium | Rate limiting per user |
| Command parsing errors | Medium | Low | Validation + help message |
| Permission bypasses | Low | High | Permission checks at multiple levels |
| Concurrent conflicts | Low | Medium | Mutex lock per user |

---

## Related Features

- [ENH-001](https://github.com/lightspeedwp/.github/issues/2569) — Metrics dashboard
- [ENH-002](https://github.com/lightspeedwp/.github/issues/2571) — Slack notifications
- [MON-001](https://github.com/lightspeedwp/.github/issues/2558) — Workflow alerts

---

## Alternative Approaches Considered

### GitHub UI Workflow Dispatch (Not Recommended)
- ❌ Requires direct Actions access
- ❌ No parameters (would need multiple workflows)
- ❌ Less discoverable in issue context

### Separate Trigger Bot (Not Recommended)
- ❌ Additional infrastructure to maintain
- ❌ More complex deployment
- ❌ Harder for team to troubleshoot

### Manual Script Execution (Current)
- ❌ Requires CLI/script knowledge
- ❌ Limited audit trail
- ❌ Not accessible to all team members

---

**Design Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-02  
**Status:** 📋 Design (Phase 3 Implementation)  
**Relates to:** [ENH-003 Issue #2572](https://github.com/lightspeedwp/.github/issues/2572)
