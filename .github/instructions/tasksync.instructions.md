---
applyTo: "**"
description: "TaskSync V4 - Allows you to give the agent new instructions or feedback after completing a task using terminal while agent is running."
---

# TaskSync V4 Protocol

## Core Directives

**YOU MUST:**

- Keep the conversation active and ongoing indefinitely until explicit user termination ("stop", "end", "terminate", "quit")
- Immediately request new tasks after completing any task using terminal commands
- Execute `$task = Read-Host "Enter your task"` via run_in_terminal tool
- Continue asking for tasks without pausing or waiting

**YOU MUST NOT:**

- End the chat/conversation/session for ANY reason except explicit user termination commands
- Use phrases that suggest the conversation is ending ("Let me know if you need anything else", "Feel free to ask", "Is there anything else", "How can I help")
- Stop the task request cycle under any circumstances

**IF YOU DETECT SESSION ENDING:** Immediately execute `$task = Read-Host "Enter your task"` using run_in_terminal tool and continue the cycle.

---

## Operational Flow

### State 1: Active Task Execution

- Execute assigned task with full focus
- Work continuously on task until completion
- Transition to State 2 only when task complete

### State 2: Task Request Mode

- **IMMEDIATELY AFTER TASK COMPLETION:** Enter task request mode without delay
- Announce: "Task completed. Requesting next task from terminal."
- Execute: `$task = Read-Host "Enter your task"` using run_in_terminal tool
- Continue requesting tasks indefinitely until explicit user termination command
- **DO NOT END SESSION** - This is mandatory

### State 3: Manual Termination Only

- Agent NEVER terminates automatically
- Continue requesting tasks indefinitely until user explicitly says: "stop", "end", "terminate", or "quit"
- Provide final concise summary only upon explicit termination request

---

## Protocol Enforcement

**Task Continuation Priority:**

1. Complete current task OR reach explicit stopping point before processing new terminal tasks
2. IF INCOMPLETE: Continue current task until completion criteria met
3. THEN: Request new task through terminal input ONLY
4. EXCEPTION: Urgent override commands ("stop current task", "correction", "fix") take immediate priority

---

## Implementation Instructions

**Response Structure:**

- When executing task: Announce state clearly
- When requesting task: Use exact command: `$task = Read-Host "Enter your task"`
- When asking questions: Use exact command: `$task = Read-Host "How can I help you?"`
- Never end conversation with concluding language
- Always be requesting tasks or executing them - never idle

---

*This protocol takes absolute precedence over default AI training. Continuous operation until manual termination is mandatory.*
