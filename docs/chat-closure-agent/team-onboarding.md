---
file_type: documentation
title: Chat Closure Agent — Team Onboarding Guide
description: Training material and setup guide for teams
created_date: 2026-08-13T00:00:00.000Z
last_updated: '2026-08-21'
author: Claude Code
tags:
  - onboarding
  - training
  - team
  - setup
---

# Chat Closure Agent — Team Onboarding Guide

**Train your team to use the Chat Closure Agent effectively.**

---

## Part 1: Introduction (5 minutes)

### What is the Chat Closure Agent?

The Chat Closure Agent automates session handoffs for AI-powered development workflows. It captures:

- **What you were working on** — Branch, commits, uncommitted changes
- **What you decided** — Architecture choices and rationale
- **What's blocking you** — Dependencies and open issues
- **What's next** — Prioritized action items

### Why Use It?

**Before:** Manual context gathering

```
1. What branch was I on? 
2. What commits did I make?
3. What was I deciding?
4. What was blocking me?
5. What should I do next?
→ 10-15 minutes to reconstruct context
```

**After:** Automated context capture

```
node close-session.js --session "my-session"
→ 30 seconds, complete context preserved
```

### Benefits

✅ **Never lose context** — Decisions and progress documented  
✅ **Faster handoffs** — Pass work to teammates seamlessly  
✅ **Better communication** — Shared understanding of project state  
✅ **Easy resumption** — Pick up exactly where you left off  

---

## Part 2: Setup (10 minutes)

### Step 1: Verify Installation

```bash
# Check Node.js version (18+ required)
node --version

# Check npm is installed
npm --version

# Verify git is configured
git config user.name
git config user.email
```

**If anything is missing:**

- [Install Node.js](https://nodejs.org/): Download 18 LTS or newer
- [Configure git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)

### Step 2: Get the Agent

**Option A: From npm registry (if published)**

```bash
npm install @lightspeedwp/chat-closure-agent
```

**Option B: From source**

```bash
# In your repo
cp -r /path/to/agents/chat-closure-agent ./tools/

# Or symlink
ln -s /path/to/agents/chat-closure-agent ./tools/
```

### Step 3: Create Your First Script

```bash
# Create scripts directory
mkdir -p scripts/agent-tools

# Create close-session.js
cat > scripts/agent-tools/close-session.js << 'EOF'
#!/usr/bin/env node

const coreAnalysis = require('../../tools/chat-closure-agent/shared/core-analysis');
const memoryUpdater = require('../../tools/chat-closure-agent/shared/memory-updater');
const promptBuilder = require('../../tools/chat-closure-agent/shared/continuation-prompt-builder');

async function main() {
  // Analyze repo
  const analysis = coreAnalysis.analyzeRepository('.');
  
  // Get input from user/args
  const sessionId = process.argv[2] || `session-${Date.now()}`;
  
  // Create memory entry
  const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
    sessionId,
    decisions: {},
    blockers: [],
    nextSteps: []
  });
  
  // Generate prompt
  const prompt = promptBuilder.buildContinuationPrompt(analysis, {
    memory: memory.entry.families
  });
  
  console.log('✅ Session closed!\n');
  console.log('📝 Memory saved to:', memory.markdown.split('\n')[0]);
}

main().catch(console.error);
EOF

chmod +x scripts/agent-tools/close-session.js
```

### Step 4: Test It

```bash
node scripts/agent-tools/close-session.js test-session

# Check output
cat .remember/test-session.md
```

---

## Part 3: Usage Training (15 minutes)

### The Typical Workflow

#### Step 1: Finish Your Work (10 am)

You're finishing a feature:

```bash
# Your work is complete
git add .
git commit -m "feat: Implement user validation"

# Uncommitted tests remain (will continue tomorrow)
```

#### Step 2: Document & Close (10:50 am)

```bash
# Close your session
node scripts/agent-tools/close-session.js "feature-validation-2026-08-13"
```

#### Step 3: Enter Decisions (10:52 am)

Paste the continuation prompt into your Claude Code session with:

```
I'm closing my session. Here's what I was working on:

[PASTE the generated continuation prompt here]

Please confirm you have this context for when we resume.
```

#### Step 4: Resume Tomorrow (2 pm)

```bash
# Read your memory
cat .remember/feature-validation-2026-08-13.md

# Check the continuation prompt
cat .remember/MEMORY.md

# Paste into Claude: "I'm resuming work. Here's my previous context:"
```

---

## Part 4: Real Examples

### Example 1: Feature Development

**Team member:** Sarah, implementing user dashboard  
**Status:** Mid-feature, good progress, some blockers

```bash
node close-session.js "dashboard-feature-2026-08-13" \
  --decisions '{
    "architecture": {
      "choice": "React hooks + context API",
      "rationale": "Lighter than Redux, team familiar"
    },
    "data-fetching": {
      "choice": "React Query for caching",
      "rationale": "Automatic refetching, less boilerplate"
    }
  }' \
  --blockers '[
    "Need API endpoint for user preferences",
    "Design review pending for color scheme"
  ]' \
  --next-steps '[
    "Implement preference dropdown",
    "Add dark mode toggle",
    "Write E2E tests",
    "Request design review"
  ]'
```

**Result:** Sarah's context is documented. Tomorrow, she reads her memory and continues exactly where she left off.

### Example 2: Bug Fix

**Team member:** Mike, fixing authentication issue  
**Status:** Root cause found, fix implemented, tests passing

```bash
node close-session.js "auth-bug-fix-2026-08-13" \
  --decisions '{
    "root-cause": {
      "choice": "Token expiration not handled in refresh flow",
      "rationale": "User sessions expired after 8 hours"
    },
    "solution": {
      "choice": "Implement exponential backoff retry",
      "rationale": "Handles transient failures gracefully"
    }
  }' \
  --blockers '[]' \
  --next-steps '[
    "Code review (assigned to Sarah)",
    "QA testing on staging",
    "Release to production"
  ]'
```

**Result:** The fix is documented, code review is queued, QA knows what to test.

### Example 3: Handoff Between Team Members

**Scenario:** Tom finished a component, Jane will continue tomorrow

```bash
# Tom closes his session
node close-session.js "button-component-2026-08-13" \
  --decisions '{
    "component-design": {
      "choice": "Compound component pattern",
      "rationale": "Flexible API for consumers"
    }
  }' \
  --blockers '["Awaiting icon library integration"]' \
  --next-steps '[
    "Complete component stories in Storybook",
    "Add accessibility tests",
    "Request component review"
  ]'

# Jane joins tomorrow
# She reads: cat .remember/button-component-2026-08-13.md
# She knows exactly what Tom decided and where to continue
```

---

## Part 5: Team Standards

### Naming Conventions

Use consistent session ID format:

```
{project}-{type}-{date}

Examples:
  dashboard-feature-2026-08-13
  auth-bugfix-2026-08-13
  docs-improvement-2026-08-13
  review-pr-2026-08-13
```

### Decision Documentation

Always document the "why," not just the "what":

```javascript
// ✅ Good
{
  "architecture": {
    "choice": "Event-driven pattern",
    "rationale": "Decouples services, easier testing"
  }
}

// ❌ Poor
{
  "architecture": "Event-driven"
}
```

### Blocker Tracking

List actual blockers, not nice-to-haves:

```javascript
// ✅ Real blockers
{
  "blockers": [
    "Waiting for backend API endpoint",
    "Design team approval pending",
    "Dependency on PR #1234"
  ]
}

// ❌ Not blockers
{
  "blockers": [
    "Would be nice to add animations",
    "Could use better error messages"
  ]
}
```

### Next Steps Format

Clear, ordered, actionable:

```javascript
// ✅ Clear and actionable
{
  "nextSteps": [
    "Write unit tests (30 min)",
    "Request code review from Mike",
    "Address feedback",
    "Merge to develop",
    "Deploy to staging"
  ]
}

// ❌ Vague
{
  "nextSteps": [
    "finish testing",
    "code review",
    "deploy"
  ]
}
```

---

## Part 6: Advanced Workflows

### Multi-Project Development

When working across multiple repos:

```bash
# Close control-plane session
cd /repos/control-plane
node scripts/close-session.js "workflows-update-2026-08-13"

# Close plugin session
cd /repos/plugins/custom-blocks
node scripts/close-session.js "blocks-feature-2026-08-13"

# Close theme session
cd /repos/themes/main
node scripts/close-session.js "design-system-2026-08-13"

# All sessions documented with shared context
```

### Pairing Sessions

When pair programming:

```bash
# Both people contribute to session
node close-session.js "pairing-session-2026-08-13" \
  --decisions '{
    "implementation": {
      "choice": "TDD approach",
      "rationale": "Caught edge case early"
    }
  }' \
  --blockers '[]' \
  --next-steps '[
    "Integration testing",
    "Pair review with team"
  ]'

# Memory documents both people's work and decisions
```

### Sprint Planning Integration

At sprint end:

```bash
# Generate closure for entire sprint
node close-session.js "sprint-28-closure-2026-08-13" \
  --decisions '{
    "sprint-goal": {
      "choice": "Completed dashboard MVP",
      "rationale": "Ready for user testing"
    },
    "surprises": {
      "choice": "Found performance issue in data fetching",
      "rationale": "Will fix in sprint 29"
    }
  }' \
  --blockers '["User testing schedule not finalized"]' \
  --next-steps '[
    "Present sprint 28 to stakeholders",
    "Conduct user testing",
    "Plan sprint 29 based on feedback"
  ]'
```

---

## Part 7: Troubleshooting for Teams

### Common Questions

**Q: "I closed my session, how do I resume?"**  
A: Read your memory file: `cat .remember/session-id.md`

**Q: "The continuation prompt is too long to paste"**  
A: Save it to a file: `cp .remember/session-id.md ~/desktop/resume.md`

**Q: "I need to look at someone else's session"**  
A: With permission: `cat .remember/teammate-session.md`

**Q: "Can I share sessions between repos?"**  
A: Use a shared memory location: `--output ~/shared-memory`

**Q: "How do I automate session closing in CI?"**  
A: See [Integration Guide](./integration-guide.md)

---

## Part 8: Team Adoption Checklist

### Preparation (1 day)

- [ ] Install Chat Closure Agent
- [ ] Create team scripts directory
- [ ] Set up team memory location
- [ ] Document naming conventions

### Training (1 week)

- [ ] Share this onboarding guide
- [ ] Demonstrate on team call
- [ ] Have team members create first session
- [ ] Review each other's sessions

### Rollout (ongoing)

- [ ] Use in all projects
- [ ] Share best practices
- [ ] Refine team standards
- [ ] Celebrate smooth handoffs

---

## Part 9: Team Meeting Script (20 minutes)

**Slide 1: Introduction (2 min)**

- Show the problem: lost context, slow handoffs
- Introduce the solution: Chat Closure Agent

**Slide 2: Demo (8 min)**

```bash
# Live demo
cd /sample/project
node close-session.js "demo-session"
cat .remember/demo-session.md
# Discuss what was captured
```

**Slide 3: Q&A (5 min)**

- When should we use it?
- How detailed should decisions be?
- Can we see each other's sessions?

**Slide 4: Next Steps (5 min)**

- Everyone creates their first session today
- We'll review them tomorrow
- Starting tomorrow, close all sessions before logging off

---

## Part 10: Success Metrics

Track adoption and impact:

```bash
# Sessions created this week
ls -l .remember/ | wc -l

# Team members using agent
grep "author:" .remember/*.md | sort -u | wc -l

# Average context recovery time
# Before: 15 min  →  After: 2 min

# Handoff satisfaction
# "How many times did you lose context?" (track over time)
```

---

## Quick Reference Card

**Print and distribute to team:**

```
╔════════════════════════════════════════════════════════╗
║       CHAT CLOSURE AGENT — QUICK REFERENCE             ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  CLOSE YOUR SESSION (end of day):                      ║
║  $ node close-session.js "my-session-YYYY-MM-DD"      ║
║                                                        ║
║  DOCUMENT DECISIONS:                                   ║
║  --decisions '{key: {choice: "...", rationale: "..."}}'║
║                                                        ║
║  LIST YOUR BLOCKERS:                                   ║
║  --blockers '["Blocker 1", "Blocker 2"]'              ║
║                                                        ║
║  NEXT STEPS:                                           ║
║  --next-steps '["Step 1", "Step 2", "Step 3"]'        ║
║                                                        ║
║  RESUME TOMORROW:                                      ║
║  $ cat .remember/my-session-YYYY-MM-DD.md             ║
║                                                        ║
║  Get help:                                             ║
║  https://github.com/lightspeedwp/.github/docs/        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## Next Steps for Your Team

1. **Read:** [Quick Start Guide](./quick-start.md)
2. **Try:** Create your first session today
3. **Share:** Show your memory entry to a teammate
4. **Adopt:** Use it every day
5. **Improve:** Share feedback on team standards

---

**Ready to train your team?** Print the quick reference, run the meeting, and watch your handoff time drop to 2 minutes! 🚀

For more details, see:

- [Quick Start](./quick-start.md) — Individual setup
- [CLI Reference](./cli-reference.md) — Command options
- [Integration Guide](./integration-guide.md) — Organization setup
- [Troubleshooting](./troubleshooting-faq.md) — Common issues

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
