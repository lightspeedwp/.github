---
title: "Chat Closure Agent — Usage & Customization"
description: "How to invoke the agent, configure parameters, and adapt for different workflows"
version: "1.0.0"
last_updated: "2026-08-12"
---

# Chat Closure Agent — Usage & Customization Guide

## Quick Start

### Basic Invocation

Invoke the Chat Closure Agent when your Claude Code session is approaching context limits:

**Option 1: Via Claude Code Agent (Recommended)**

```bash
# In a Claude Code session:
/agent-name: Chat Closure Agent
```

Or use the Agent tool with the agent descriptor:

```
Agent: agents/chat-closure-agent/AGENT.md
```

**Option 2: Via Skill (When Available)**

```bash
/chat-closure-agent
```

**Option 3: Direct Module Usage**

For programmatic use in other agents:

```javascript
const coreAnalysis = require('./agents/chat-closure-agent/shared/core-analysis.js');
const memoryUpdater = require('./agents/chat-closure-agent/shared/memory-updater.js');
const continuationPrompt = require('./agents/chat-closure-agent/shared/continuation-prompt-builder.js');
const workspaceCleaner = require('./agents/chat-closure-agent/shared/workspace-cleaner.js');
```

## Configuration

### Agent Parameters

The agent accepts the following input parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `repoRoot` | string | No | `.` (current dir) | Repository path to analyze |
| `baselineRef` | string | No | `develop` | Base branch for commit comparison |
| `memoryLocation` | string | No | `.remember/` | Path to memory directory |
| `confirmDelete` | callback | No | `console.confirm()` | Callback for cleanup confirmation |
| `skipCleanup` | boolean | No | `false` | Skip worktree deletion |
| `dryRun` | boolean | No | `false` | Analyze only, don't modify files |

### Example: Basic Invocation

```javascript
const agent = require('./agents/chat-closure-agent/claude/prompt.md');

const closure = await agent({
  repoRoot: process.cwd(),
  baselineRef: 'develop'
});

console.log(closure.report);
```

### Example: With Custom Parameters

```javascript
const closure = await agent({
  repoRoot: '/path/to/repo',
  baselineRef: 'main',
  memoryLocation: '/path/to/.remember',
  skipCleanup: true,  // Don't delete worktree
  dryRun: true        // Test mode only
});
```

### Example: With Custom Confirmation

```javascript
const closure = await agent({
  repoRoot: process.cwd(),
  confirmDelete: async (report) => {
    // Custom confirmation logic (e.g., webhook, Slack notification)
    const approved = await sendSlackApproval(report);
    return approved;
  }
});
```

## Workflow Examples

### Scenario 1: Control-Plane Repository

You're working on the `.github` control-plane repository and hit context limits.

**Invocation:**

```bash
# From .github repository root
/chat-closure-agent --repo-type control-plane --memory .remember
```

**Agent actions:**

1. ✅ Detects `.github/workflows/`, `.github/labels.yml`
2. ✅ Extracts active projects from `.github/projects/active/`
3. ✅ Creates memory entry with project links
4. ✅ Generates handoff prompt with next steps
5. ✅ Offers worktree cleanup (optional)

**Output example:**

```markdown
# Session Closure Report — Control-Plane Repository

## Branch Status
- **Current:** feat/chat-closure-agent-phase-4-documentation
- **Base:** develop
- **Commits ahead:** 8
- **Status:** Clean

## Changes Made
- Added ARCHITECTURE.md (250 lines)
- Added USAGE_GUIDE.md (180 lines)
- Added TESTING_GUIDE.md (150 lines)

## Memory Updated
- Phase 4 progress saved to `.remember/phase-4-progress.md`
- Index updated in MEMORY.md

## Next Steps
1. Continue Phase 4 documentation (TESTING_GUIDE.md)
2. Complete example workflow documentation
3. Run full test coverage audit
4. Submit PR to develop

## Cleanup
- Worktree `feat/chat-closure-agent-phase-4-documentation` ready for cleanup
- All changes committed, safe to delete
- Confirm? (Y/n)
```

### Scenario 2: WordPress Plugin Repository

Working on a WordPress plugin with uncommitted changes.

**Invocation:**

```bash
# From plugin repository root
/chat-closure-agent
```

**Agent actions:**

1. ✅ Detects `plugin.php`, `composer.json`
2. ✅ Identifies uncommitted changes
3. ✅ Offers to auto-stash or auto-commit
4. ✅ Creates memory entry with plugin context
5. ✅ Generates handoff for next session

**Output example:**

```markdown
# Session Closure Report — WordPress Plugin

## Plugin Context
- **Plugin:** Example Plugin v1.5.0
- **File:** example-plugin/example-plugin.php
- **Requires:** WordPress 6.0+, PHP 8.0+

## Workspace Status
- **Branch:** feat/example-plugin-update
- **Commits ahead:** 3
- **Uncommitted changes:** 5 files
  - src/Block/Example.php (modified)
  - tests/test-example.php (modified)
  - README.md (modified)
  - composer.json (modified)
  - .gitignore (added)

## Stash/Commit Options
- Auto-stash uncommitted changes? (Recommended)
- Or auto-commit with message: "WIP: Example plugin updates"

## Memory Updated
- Plugin development session saved to `.remember/plugin-session.md`

## Cleanup
- Worktree cleanup ready
- All changes preserved (stashed/committed)
- Confirm cleanup? (Y/n)
```

### Scenario 3: WordPress Theme Repository

Working on a WordPress theme with clean state.

**Invocation:**

```bash
# From theme repository root
/chat-closure-agent
```

**Agent actions:**

1. ✅ Detects `style.css`, `theme.json`
2. ✅ Confirms worktree is clean
3. ✅ Creates memory entry with theme context
4. ✅ Offers to delete worktree immediately
5. ✅ Generates handoff prompt

**Output example:**

```markdown
# Session Closure Report — WordPress Theme

## Theme Context
- **Theme:** Example Theme v2.0.0
- **File:** example-theme/style.css
- **Requires:** WordPress 6.0+, PHP 8.0+

## Workspace Status
- **Branch:** feat/theme-enhancement
- **Commits ahead:** 7
- **Status:** Clean ✅

## Memory Updated
- Theme development session saved to `.remember/theme-session.md`

## Cleanup
- Worktree is clean and ready for deletion
- Delete worktree `feat/theme-enhancement`? (Y/n)
```

## Customization

### Custom Memory Location

By default, memory is saved to `.remember/` in the repository root. To use a different location:

```javascript
const closure = await agent({
  repoRoot: process.cwd(),
  memoryLocation: '/custom/path/.remember'
});
```

### Custom Confirmation Callback

Implement custom approval logic (Slack, email, webhook, etc.):

```javascript
const closure = await agent({
  repoRoot: process.cwd(),
  confirmDelete: async (cleanupReport) => {
    // Send to Slack for approval
    const response = await slack.reactions.add({
      channel: 'engineering',
      name: 'notify_user',
      message: cleanupReport
    });
    
    // Wait for approval reaction
    return response.approved;
  }
});
```

### Dry Run Mode

Test the agent without modifying files:

```javascript
const closure = await agent({
  repoRoot: process.cwd(),
  dryRun: true  // Analyze only, no modifications
});

// Review what would be done
console.log('Would update memory:', closure.memory.files);
console.log('Would delete worktree:', closure.cleanup.worktree);
console.log('Report:', closure.report);
```

### Skip Cleanup

If you want memory updates without worktree deletion:

```javascript
const closure = await agent({
  repoRoot: process.cwd(),
  skipCleanup: true  // Update memory, but don't delete worktree
});
```

## Integrating into Workflows

### Claude Code Session End (Future Enhancement)

When Claude Code supports session-end hooks:

```bash
# claude/settings.json
{
  "hooks": {
    "session:end": {
      "command": "node agents/chat-closure-agent/claude/prompt.md"
    }
  }
}
```

### GitHub Actions Workflow

Trigger agent at PR closure:

```yaml
name: Auto-Archive Session

on:
  pull_request:
    types: [closed]

jobs:
  archive:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Archive session
        run: |
          node -e "
            const agent = require('./agents/chat-closure-agent');
            agent({ repoRoot: '.' });
          "
```

### Scheduled Cleanup (Daily)

Automatically close idle sessions:

```bash
# crontab
0 18 * * * cd /path/to/repo && node agents/chat-closure-agent/claude/prompt.md --skip-cleanup
```

## Troubleshooting

### Issue: "Cannot find .remember directory"

**Solution:** Ensure `.remember/` exists in your repository root:

```bash
mkdir -p .remember
# Agent will create MEMORY.md on first run
```

### Issue: "Git command failed: detached HEAD"

**Solution:** Agent handles detached HEAD gracefully. If you want a proper branch:

```bash
git checkout -b recover-work
```

Then invoke agent normally.

### Issue: "Permission denied on worktree delete"

**Solution:** Ensure you have write permissions:

```bash
# Check permissions
ls -la .git/worktrees/

# If locked by another session, wait or delete manually
git worktree remove <worktree-path>
```

### Issue: "Memory write failed"

**Solution:** Check write permissions on `.remember/`:

```bash
chmod -R 755 .remember/
```

Agent will continue even if memory write fails, but memory won't be preserved.

### Issue: "No commits ahead of base branch"

This is normal if you haven't committed any changes. Agent will:

1. Report 0 commits ahead
2. Still update memory with session context
3. Generate handoff for next session
4. Offer to delete clean worktree

## Output Formats

### Closure Report (Default)

Human-readable Markdown format:

```markdown
# Session Closure Report

## Summary
[Overview of session work]

## Branch Status
- Current: [branch]
- Base: [base branch]
- Commits ahead: [count]

## Changes Made
- [File changes by type]

## Memory Updated
- [Memory entries created/updated]

## Cleanup Status
- [Worktree cleanup result]

## Next Steps
[Recommendations for continuation]
```

### JSON Output

For programmatic use:

```javascript
const closure = await agent({
  repoRoot: process.cwd(),
  outputFormat: 'json'
});

// Returns:
{
  status: 'success',
  gitMetadata: { /* core-analysis output */ },
  memory: { /* memory-updater output */ },
  prompt: { /* continuation-prompt output */ },
  cleanup: { /* workspace-cleaner output */ },
  report: string,
  timestamp: ISO8601
}
```

## Advanced: Module-Level Usage

Use individual modules directly for fine-grained control:

### Core Analysis Only

```javascript
const { analyzeGitState } = require('./shared/core-analysis.js');

const metadata = await analyzeGitState(
  process.cwd(),
  'develop'
);

console.log('Branch:', metadata.currentBranch);
console.log('Issues:', metadata.issueNumbers);
```

### Memory Update Only

```javascript
const { updateSessionMemory } = require('./shared/memory-updater.js');

const result = await updateSessionMemory(
  { /* closure data */ },
  '.remember'
);

console.log('Files saved:', result.files);
```

### Prompt Generation Only

```javascript
const { buildFullPrompt } = require('./shared/continuation-prompt-builder.js');

const prompt = await buildFullPrompt(
  gitMetadata,
  memoryResult
);

console.log(prompt.fullPrompt);
```

### Cleanup Only

```javascript
const { cleanupWorktree } = require('./shared/workspace-cleaner.js');

const result = await cleanupWorktree(
  process.cwd(),
  async () => true  // confirmation callback
);

console.log('Cleanup:', result.action);
```

## Best Practices

### 1. Run Before Context Limit

Don't wait until you're completely out of context. Run when you have ~10K tokens remaining:

```
Current context: 190K / 200K → Run agent
```

### 2. Review Memory Entries

After closure, verify memory was saved correctly:

```bash
cat .remember/MEMORY.md
ls -la .remember/
```

### 3. Test Handoff Prompt

Copy the generated handoff prompt and use it in your next session:

```
✅ Copy "Next Steps" section from report
✅ Paste into new session's first message
✅ Agent loads memory automatically
```

### 4. Use Dry Run for Testing

Test agent behavior without modifications:

```javascript
const closure = await agent({
  repoRoot: process.cwd(),
  dryRun: true
});
```

### 5. Clean Commits Before Closure

Squash/rebase changes into logical commits:

```bash
git rebase -i origin/develop
```

Then run agent to generate handoff for clean state.

## FAQ

**Q: Will the agent delete my changes?**  
A: No. The agent offers to stash or auto-commit changes before cleanup. Deletion requires explicit user confirmation.

**Q: Can I use this outside Claude Code?**  
A: Yes. The modules are self-contained Node.js code. Use them in any JavaScript context.

**Q: What if I cancel cleanup?**  
A: Agent skips deletion, preserves worktree, and still updates memory. You can delete manually later.

**Q: Does it work with monorepos?**  
A: Yes, agent detects repo type at `repoRoot`. For monorepo workspaces, point `repoRoot` to the specific package.

**Q: How long does closure take?**  
A: Typically <1 second. Depends on git history size and memory write speed.

**Q: Can I integrate with CI/CD?**  
A: Yes. Use the agent in GitHub Actions, GitLab CI, or any CI platform with Node.js support.

---

## Next Steps

1. **Review ARCHITECTURE.md** for technical design
2. **Run TESTING_GUIDE.md** examples to validate coverage
3. **Check examples/sample-closure-workflow.md** for real-world scenario
4. **Customize parameters** for your workflow

---

*Session closure simplified. Continuity preserved. Worktrees cleaned.*
