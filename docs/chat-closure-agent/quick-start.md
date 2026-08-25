---
title: Chat Closure Agent — Quick Start Guide
description: Get started with the Chat Closure Agent in 5 minutes
created_date: 2026-08-13T00:00:00.000Z
last_updated: '2026-08-21'
author: Claude Code
tags:
  - agent
  - quick-start
  - setup
  - tutorial
---

# Chat Closure Agent — Quick Start Guide

**Get your first session closure automated in 5 minutes.**

## Installation

### Prerequisites

- Node.js 18+
- Access to the Chat Closure Agent (agents/chat-closure-agent/)
- Git repository with commits

### Setup

```bash
# 1. Navigate to agent directory
cd agents/chat-closure-agent

# 2. Install dependencies (if not already installed)
npm install

# 3. Verify installation
npm test -- --testNamePattern="analyzeRepository"
```

## Your First Session Closure (5 minutes)

### Step 1: Create a closure script (1 min)

Create `close-session.js`:

```javascript
const coreAnalysis = require('./shared/core-analysis');
const memoryUpdater = require('./shared/memory-updater');
const promptBuilder = require('./shared/continuation-prompt-builder');

async function closeSession() {
  // Analyze your current work
  const analysis = coreAnalysis.analyzeRepository('.');
  
  // Document what you've done
  const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
    sessionId: 'my-first-closure',
    decisions: {
      'main-accomplishment': {
        choice: 'Implemented core feature',
        rationale: 'Required for MVP'
      }
    },
    blockers: [],
    nextSteps: ['Test the feature', 'Create PR']
  });
  
  // Generate resume prompt for next session
  const prompt = promptBuilder.buildContinuationPrompt(analysis, {
    memory: memory.entry.families
  });
  
  console.log('✅ Session closed!\n');
  console.log('📝 Memory saved to:', memory.markdown.split('\n')[0]);
  console.log('📋 Continuation prompt:\n', prompt.markdown.substring(0, 200) + '...');
}

closeSession().catch(console.error);
```

### Step 2: Run it (1 min)

```bash
node close-session.js
```

**Output:**

```
✅ Session closed!

📝 Memory saved to: .remember/my-first-closure.md
📋 Continuation prompt:
## Session Resumption Guide

You were working on: feat/core-implementation
Branch analysis: 3 commits ahead of develop
Recent work: "feat: Implement core module"...
```

### Step 3: Check your memory (1 min)

```bash
cat .remember/my-first-closure.md
```

You'll see a structured memory entry with your decisions, blockers, and next steps.

### Step 4: Share continuation prompt (2 min)

The generated prompt is ready to paste into your next Claude session. It contains:

- What you were working on
- What you decided (and why)
- What's blocking you
- What's next

Perfect for picking up exactly where you left off.

---

## Common First-Time Scenarios

### Scenario A: You have uncommitted work

The agent handles this gracefully:

```javascript
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'work-in-progress',
  decisions: {
    'approach': { choice: 'Add validation layer', rationale: 'Security requirement' }
  },
  blockers: ['Need to finish form validation tests'],
  nextSteps: ['Complete test suite', 'Request code review']
});
```

Memory will capture your uncommitted state so you can resume seamlessly.

### Scenario B: You're mid-feature on a branch

```javascript
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'feature-checkpoint',
  decisions: {
    'architecture': { choice: 'Component-based design', rationale: 'Easier testing' }
  },
  blockers: ['Waiting for API endpoint from backend team'],
  nextSteps: ['Mock the API', 'Build UI components', 'Integration testing']
});
```

The agent will track your branch, commits, and context.

### Scenario C: You're wrapping up for a PR

```javascript
const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
  sessionId: 'pr-ready-checkpoint',
  decisions: {
    'testing': { choice: 'Unit + integration tests', rationale: '87% coverage' }
  },
  blockers: [],
  nextSteps: ['Create PR', 'Request review', 'Address feedback']
});
```

Memory will document your testing approach and readiness.

---

## What Gets Captured

Each session closure captures:

✅ **Repository State**

- Current branch
- Commits ahead of base
- Staged/uncommitted changes
- Recent git history

✅ **Your Decisions**

- What you decided
- Why you decided it
- Trade-offs considered

✅ **Blockers**

- What's stopping you
- What you're waiting for
- Dependencies

✅ **Next Steps**

- Ordered action items
- Estimated effort
- Dependencies

✅ **Continuation Prompt**

- Ready to paste into next session
- Includes all context
- Formatted for Claude

---

## Next Steps

1. **Run your first closure** — Follow the 5-minute setup above
2. **Check the continuation prompt** — Paste it into your next Claude session
3. **Read the Full Guide** — See `integration-guide.md` for advanced scenarios
4. **Configure options** — See `cli-reference.md` for customization

---

## Troubleshooting

**Q: "Repository analysis failed"**  
A: Make sure you're in a git repository with at least one commit.

**Q: "Memory directory doesn't exist"**  
A: The agent creates `.remember/` automatically. Check you have write permissions.

**Q: "Continuation prompt is too long"**  
A: That's okay! Claude can handle up to 200k tokens. The prompt is optimized for clarity.

**Q: "I'm getting test failures"**  
A: Run `npm test` to verify your installation. See `troubleshooting-faq.md` for details.

---

**Ready to close your first session?** Run `node close-session.js` now! 🚀

For more details, see:

- [Full Usage Guide](../agents/chat-closure-agent/docs/USAGE_GUIDE.md) — Detailed API reference
- [Architecture](../agents/chat-closure-agent/docs/ARCHITECTURE.md) — How it works inside
- [Integration Guide](./chat-closure-agent/integration-guide.md) — Using in other projects

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
