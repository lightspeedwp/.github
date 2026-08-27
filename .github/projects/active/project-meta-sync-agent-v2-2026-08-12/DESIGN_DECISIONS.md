---
file_type: design-document
title: "Project Meta Sync Agent v2 — Design Decisions & Rationale"
description: ""Architecture decisions, trade-offs, and rationale for agent v2 modernization""
created_date: 2026-08-12
last_updated: "2026-08-25"
status: active
---

# Design Decisions & Rationale

## Decision 1: Agent as Orchestrator vs. Direct Executor

### Decision

**Agent is a thin orchestrator layer, NOT a direct executor.**

Agent explains workflows, scripts, and when to use each. Agent calls label-orchestrator.js for heavy lifting, not GitHub API directly.

### Options Considered

1. **Thin orchestrator** (✅ CHOSEN)
   - Agent explains workflows/scripts
   - Agent uses label-orchestrator.js as entry point
   - Agent provides guidance, not execution
   - Pros: Safe, reusable, testable, auditable
   - Cons: Slower (requires user to run commands)

2. Active executor
   - Agent directly calls GitHub API
   - Agent makes label decisions
   - Agent bypasses orchestrator
   - Pros: Faster, more autonomous
   - Cons: Unsafe, less auditable, duplicates orchestrator logic

3. Hybrid approach
   - Agent uses orchestrator for complex ops
   - Agent calls API for simple ops
   - Pros: Best of both worlds
   - Cons: Complex to maintain, inconsistent behavior

### Rationale

**Why thin orchestrator:**

1. **Phase 3-4 investment** — label-orchestrator.js was built specifically for this purpose; we should use it
2. **Safety** — All changes preview-able via --dry-run; user approves before applying
3. **Auditability** — Commands logged in shell history and workflow logs; not hidden in agent reasoning
4. **Maintainability** — Changes to orchestrator logic don't require updating agent prompt
5. **Testability** — Orchestrator has unit tests; agent doesn't
6. **Phase 5A readiness** — Release Agent can call Metadata Agent, which calls orchestrator—clean hierarchy

### Trade-offs

- **Pro:** Safe and auditable
- **Con:** Requires user to run CLI commands (slower interaction)
- **Mitigation:** Agent guides users through each step; provides exact commands to copy/paste

### Related Decisions

- [[Decision 3: Workflow Integration]]

---

## Decision 2: Label Taxonomy Presentation

### Decision

**Use tiered approach (Tier 1/2/3/4) + delegated reference to canonical source.**

Agent teaches Tier 1 (essential) labels explicitly, then points to `.github/labels.yml` and docs for comprehensive reference.

### Options Considered

1. **Full taxonomy in agent prompt** (rejected)
   - Include all 50+ labels with descriptions
   - Pros: Complete reference in one place
   - Cons: 200+ lines just for taxonomy; overwhelming; outdated quickly

2. **Contextual recommendation** (rejected)
   - Agent learns issue context, recommends relevant labels
   - Pros: Personalized, not overwhelming
   - Cons: Requires complex heuristics; may miss relevant labels; single recommendation bias

3. **Tiered + delegated reference** (✅ CHOSEN)
   - Tier 1: Essential (3-5 labels every issue needs)
   - Tier 2: Common (5-10 labels based on context)
   - Tier 3: Advanced (meta:* labels for specific workflows)
   - Tier 4: Canonical reference (`.github/labels.yml`)
   - Pros: Progressive disclosure, scalable, maintains single source of truth
   - Cons: Requires users to learn navigation strategy

### Rationale

1. **Progressive disclosure** — New users learn Tier 1, advanced users discover Tier 2/3
2. **Scalability** — Taxonomy can grow to 100+ labels without making agent unwieldy
3. **Maintainability** — Canonical source is `.github/labels.yml`, not agent prompt
4. **User empowerment** — Users learn to navigate taxonomy themselves
5. **Integration** — Phase 4 delivered label search; agent teaches its use

### Trade-offs

- **Pro:** Scalable and maintainable
- **Con:** Users must learn multi-tier system
- **Mitigation:** Agent progressively teaches tiers as conversation progresses

### Related Decisions

- [[Decision 1: Orchestrator]]
- [[Decision 3: Workflow Integration]]

---

## Decision 3: Workflow Invocation Strategy

### Decision

**Prefer label-orchestrator.js for all user-facing operations. Explain (don't invoke) workflows.**

Agent teaches users to run `label-orchestrator.js audit`, `sync`, `--interactive`, etc. Agent doesn't call workflows directly.

### Options Considered

1. **Direct API invocation** (rejected)
   - Agent calls GitHub Actions API to run workflows
   - Pros: Faster, more automation
   - Cons: Requires extra permissions; less transparent

2. **Manual workflow triggering** (rejected)
   - Agent explains how to trigger via GitHub UI
   - Pros: No extra permissions needed
   - Cons: User experience is slow/clicky; easy to make mistakes

3. **Prefer label-orchestrator.js** (✅ CHOSEN)
   - Agent teaches users to use orchestrator CLI
   - Agent provides exact commands to copy/paste
   - Cons: User must run command (not automatic)
   - Pros: Transparent, auditable, single entry point, well-tested

### Rationale

1. **Consistency** — Single entry point (orchestrator) for all operations
2. **Transparency** — Users see exactly what commands are run
3. **Testability** — Orchestrator has 80%+ code coverage; agent doesn't
4. **Maintainability** — Changes to orchestrator don't require agent changes
5. **Safety** — All orchestrator commands support --dry-run

### Trade-offs

- **Pro:** Transparent and maintainable
- **Con:** Requires user to run CLI commands (not fully automatic)
- **Mitigation:** Agent provides command; user can copy/paste or run directly

### Scheduled Workflows (Separate)

Workflows still run on schedule (no user action needed):

- `metadata-governance.yml` — On issue/PR events (automatic)
- `meta-labels-sync.yml` — Daily (automatic)
- `label-audit-report.yml` — Monthly (automatic)

Agent explains what these do but doesn't try to invoke them.

### Related Decisions

- [[Decision 1: Orchestrator]]

---

## Decision 4: Error Handling Philosophy

### Decision

**Graceful degradation for all error scenarios. Every error has a recovery path.**

Agent detects errors, explains them clearly, suggests fix, and resumes or asks user.

### Error Handling Matrix

| Error | Detection | Recovery | Agent Says |
|-------|-----------|----------|---|
| API rate limit | HTTP 403 | Wait 60s, retry | "Quota exceeded. Waiting…" |
| Missing label | Not in labels.yml | Suggest alternatives | "Did you mean `area:ci`?" |
| Missing field | GraphQL fail | Regenerate | "Running field regeneration…" |
| Ambiguous input | Multiple matches | Ask user | "Which did you mean?" |
| Out of scope | Request type | Handoff | "That's Label Strategy. Calling specialist…" |
| Conflict | User disagrees | Pivot | "What would you prefer instead?" |

### Rationale

1. **User trust** — Clear error messages build confidence
2. **Resilience** — No silent failures or partial states
3. **Empowerment** — Users understand what went wrong and how to fix it
4. **Phase 5A readiness** — Release Agent depends on clear error reporting

### Trade-offs

- **Pro:** Robust and user-friendly
- **Con:** Agent responses are longer (includes recovery steps)
- **Mitigation:** Structured responses with clear sections (problem, recovery, next steps)

---

## Decision 5: Phase 5A Integration Contract

### Decision

**Metadata Agent returns structured validation result (tiers, blockers, warnings, recommendation) that Release Agent consumes.**

Not a simple yes/no, but a detailed report Release Agent can use to make release decision.

### Validation Tiers

**Tier 1: Blockers** (Release fails if any fail)

- All issues in milestone have type:* label
- No conflicting labels
- All PRs have changelog status
- No issues in needs-triage

**Tier 2: Warnings** (Release can proceed with warning)

- 95%+ of issues have priority:*
- All issues have area:*
- No stale meta:* labels

**Tier 3: Info** (For reference)

- Any deprecated labels
- Field sync status
- Stale issues

### Response Format

```json
{
  "status": "pass" | "fail" | "warn",
  "tier_1_blockers": { "status": "pass" | "fail", "failures": [...] },
  "tier_2_warnings": { "status": "pass" | "warn", "warnings": [...] },
  "tier_3_info": { "info": [...] },
  "recommendation": "proceed" | "fix_first" | "user_review",
  "summary": "Human-readable summary"
}
```

### Rationale

1. **Clear semantics** — Release Agent knows exactly what passed/failed
2. **Granular control** — Different release types (patch/minor/major) have different requirements
3. **Actionable** — Each failure includes specific fix recommendation
4. **Human-friendly** — Release Agent can present findings to maintainer

### Trade-offs

- **Pro:** Clear contract; Release Agent can be smart
- **Con:** More complex response format
- **Mitigation:** Schema documented; examples provided

### Related Decisions

- [[Decision 1: Orchestrator]]
- [[Decision 4: Error Handling]]

---

## Decision 6: Handoff Triggers & Escalation

### Decision

**Agent detects out-of-scope requests and hands off to specialized agents with context.**

Agent focuses on metadata sync/audit. Hands off to Label Strategy, Release, or Template agents for their domains.

### Handoff Triggers

| Request | Handoff Agent | Reason |
|---------|--------------|--------|
| "I want to redesign labels" | Label Strategy | Architecture design, not sync |
| "How do I release?" | Release Agent | Release orchestration, not metadata |
| "Help with issue template" | Template Agent | Template validation, not metadata |
| "Large-scale label migration" | Migration Agent | Bulk changes, not sync |

### Handoff Protocol

1. Agent recognizes request is out-of-scope
2. Agent explains why (not in my domain)
3. Agent offers handoff (let me call the specialist)
4. Agent provides context for handoff (what they need to know)
5. User approves or declines

### Rationale

1. **Focused expertise** — Each agent is specialist in its domain
2. **Clear boundaries** — Users know who to ask what
3. **No silos** — Agents can work together via handoffs
4. **Scalability** — Easy to add new agents without overloading existing ones

### Trade-offs

- **Pro:** Clean separation of concerns
- **Con:** User must switch context for cross-domain problems
- **Mitigation:** Handoff is seamless; context is passed; user can continue in new agent

### Related Decisions

- [[Decision 1: Orchestrator]]

---

## Decision 7: Discovery & Documentation Strategy

### Decision

**Multiple discovery channels: self-discovery (Copilot), guided (docs links), active (workflow output), integration (CLI hints).**

Not relying on any single discovery channel.

### Discovery Channels

1. **Self-discovery** — Agent is in Copilot; users find it organically
2. **Guided discovery** — Links in README, CONTRIBUTING, docs
3. **Active discovery** — Hints in workflow output, CLI commands
4. **Integration discovery** — `label-orchestrator.js` output suggests agent

### Supporting Documentation

- `.github/agents/project-meta-sync-README.md` — What agent does, example uses
- `.github/agents/project-meta-sync-prompt.md` — Full LLM prompt
- `docs/ISSUE_MAINTENANCE_SCRIPTS.md` — System overview (links to agent)
- `docs/LABEL_MANAGEMENT_CLI.md` — CLI reference (links to agent)
- Workflow outputs — "Need guidance? Ask the Metadata Agent"

### Rationale

1. **Redundancy** — If users miss one channel, they find the agent elsewhere
2. **Context-aware** — Users discover agent when they need it (not before)
3. **Low friction** — No force-feeding; organic discovery preferred
4. **Documentation links** — Users see agent mentioned where they're already looking

### Trade-offs

- **Pro:** Users find agent naturally
- **Con:** Requires documentation maintenance in multiple places
- **Mitigation:** Central QUESTIONS.md lists all discovery channels; easy to update

---

## Summary Table: Key Decisions

| Decision | Choice | Rationale | Trade-off |
|----------|--------|-----------|-----------|
| **Execution model** | Thin orchestrator | Safe, reusable, testable | Slower (CLI commands) |
| **Label presentation** | Tiered + delegated | Scalable, maintainable | Users learn multi-tier system |
| **Workflow invocation** | Prefer orchestrator | Consistent, transparent | User must run CLI |
| **Error handling** | Graceful + recovery | Robust, user-friendly | Longer responses |
| **Phase 5A contract** | Structured result | Clear semantics, actionable | More complex format |
| **Escalation** | Handoff to specialists | Focused expertise | Context switching |
| **Discovery** | Multi-channel | Organic, low-friction | Documentation overhead |

---

## Anti-patterns Avoided

### ❌ Not: Agent Directly Modifies GitHub

**Why:** Less safe, harder to audit, duplicates orchestrator logic, Phase 5A doesn't work

**Instead:** Agent uses orchestrator; all changes preview-able via --dry-run

### ❌ Not: Agent Memorizes All 50+ Labels

**Why:** Outdated quickly, overwhelming, unmaintainable

**Instead:** Agent teaches tiers; points to canonical source for full reference

### ❌ Not: Agent Triggers Workflows Directly

**Why:** Requires extra permissions, less transparent, users don't see what's happening

**Instead:** Agent teaches users to run orchestrator CLI; transparent and auditable

### ❌ Not: Ignoring Errors Silently

**Why:** Breaks user trust, leaves system in inconsistent state

**Instead:** All errors caught, explained, and have recovery path

### ❌ Not: Refusing Out-of-Scope Requests

**Why:** Poor user experience, artificial boundaries

**Instead:** Agent recognizes scope, explains why, offers handoff to specialist

---

## Future Evolution

### Potential Improvements (Phase 5C+)

1. **Batch operations** — Apply changes to multiple issues simultaneously
2. **Custom validation rules** — Teams can define their own metadata requirements
3. **Predictive heuristics** — Agent suggests labels based on issue title/description
4. **Webhook integration** — Direct triggering from PR merge, issue creation
5. **Advanced metrics** — Trending, compliance scores, label health
6. **Multi-repo support** — Agent works across organization repos

### Constraints for Phase 5B

- Stay focused on metadata governance (sync/audit)
- Don't add new infrastructure dependencies
- Reuse Phase 3-4 deliverables (orchestrator, scripts, workflows)
- Keep agent prompt under 300 lines

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
