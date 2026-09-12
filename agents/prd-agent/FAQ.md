---
description: "FAQs and Troubleshooting Guide for Consolidated PRD Agent"
phase: "Phase 6 Rollout & Adoption"
last_updated: "2026-09-12"
---

# FAQ & Troubleshooting Guide — Consolidated PRD Agent (v2.3.0)

## Quick Navigation

- [Getting Started](#getting-started)
- [Installation & Setup](#installation--setup)
- [Using the Agent](#using-the-agent)
- [Provider-Specific Questions](#provider-specific-questions)
- [Troubleshooting](#troubleshooting)
- [Feedback & Support](#feedback--support)

---

## Getting Started

### What is the Consolidated PRD Agent?

The consolidated PRD Agent is a unified, production-ready tool for product requirement definition (PRD) and project planning. It consolidates 28 canonical skills into a single, maintainable agent that works seamlessly across three providers:

- **Claude Code** (native integration)
- **GitHub Copilot** (custom agent)
- **OpenAI API** (provider-agnostic definition)

**Key Improvement**: Single source of truth. Previously, PRD-related skills were scattered across 45+ folders with duplicated content. Now, all skills are in one canonical location with no redundancy.

**Version**: v2.3.0 (released 2026-09-12)  
**Test Status**: ✅ 100% pass rate across all providers (14/14 tests per provider = 42/42 total)

---

### Why should I use the consolidated agent instead of the old version?

**Consolidated Benefits**:

1. **Single Source of Truth**: No confusion about which version to use. One canonical agent in `agents/prd-agent/`.
2. **Better Documentation**: All 28 skills documented in one place with clear routing logic.
3. **Higher Quality**: Extensively tested (100% test coverage, 3 providers, 14 tests each).
4. **Easier Maintenance**: Bug fixes and improvements apply to all users automatically.
5. **Consistent Behavior**: No version drift or hidden duplicate skills causing unexpected behavior.

**Migration Path**: Copy the appropriate agent definition to your repository:
- Claude Code users: Copy `agents/prd-agent/claude/agent.md`
- Copilot users: Copy `agents/prd-agent/copilot/agent.md`
- OpenAI API users: Use `agents/prd-agent/openai/agent.md`

See [Installation & Setup](#installation--setup) for step-by-step instructions.

---

### What are the 28 consolidated skills?

The agent combines skills from five functional clusters:

**1. Drafting & Requirements** (4 skills)
- `prd-writer` — Core PRD document creation
- `acceptance-test-planner` — Acceptance criteria and testing
- `project-intake` — Project scoping and intake structuring
- `project-researcher` — Research and context gathering

**2. Planning & Strategy** (6 skills)
- `implementation-plan-generator` — Technical implementation roadmaps
- `delivery-planner` — Timeline and task breakdown
- `project-status-reporter` — Status reporting and metrics
- `memory-management` — Knowledge and decision tracking
- `approval-gate-manager` — Gate and checkpoint management
- `prd-agent-orchestrator` — Multi-step workflow routing

**3. Quality & Validation** (5 skills)
- `prd-task-reviewer` — PRD quality review and feedback
- `qa-findings-router` — QA issue routing and triage
- `validation-support` — General validation and verification
- `markdown-content-validator` — Document format validation
- `evidence-locker` — Evidence and artifact management

**4. Coordination & Execution** (5 skills)
- `change-request-router` — Change management and routing
- `launch-task-router` — Launch readiness and handoff
- `release-handoff-generator` — Release coordination
- `project-memory-manager` — Team memory and context
- `prd-task-pack-exporter` — Project export and packaging

**5. Integration & Specialization** (8 skills)
- `github-issue-drafter` — GitHub issue integration
- `github-pr-workflow-guide` — Pull request workflows
- `github-release-notes-generator` — Release note automation
- `github-milestone-tracker` — Milestone management
- `linear-issue-integration` — Linear platform integration
- `google-workspace-connector` — Google Workspace collaboration
- `plugin-architecture-guide` — Plugin integration guidance
- (Additional specialization skills as needed)

For detailed information on each skill, see `instructions/AGENTS.md`.

---

## Installation & Setup

### How do I load the consolidated agent into my repository?

#### Claude Code Users

1. Clone or download the `agents/prd-agent/` folder from the LightSpeed `.github` repository
2. Copy `agents/prd-agent/claude/agent.md` into your repository's `.claude/agents/` directory:
   ```bash
   mkdir -p .claude/agents
   cp agents/prd-agent/claude/agent.md .claude/agents/prd-agent.md
   ```
3. Restart Claude Code (if running)
4. In Claude Code, select "PRD Agent" from the agent dropdown menu
5. Start using the agent with your PRD workflows

**Expected Behavior**: Claude Code should recognize the YAML frontmatter and load the agent with correct name ("PRD Agent"), description, tools, and model.

#### GitHub Copilot Users

1. Copy `agents/prd-agent/copilot/agent.md` into your repository's `.github/agents/` directory:
   ```bash
   mkdir -p .github/agents
   cp agents/prd-agent/copilot/agent.md .github/agents/prd-agent.md
   ```
2. Commit and push the change
3. In GitHub Copilot settings, refresh the custom agents list
4. Select "PRD Agent" from the available custom agents
5. Start using the agent in Copilot chat or code generation workflows

**Expected Behavior**: Copilot should recognize the YAML frontmatter and load the agent with correct name, description, tools, and MCP servers.

#### OpenAI API Users

1. Use the agent definition at `agents/prd-agent/openai/agent.md` as a reference for your API calls
2. Extract the system prompt and integrate it into your OpenAI API client (e.g., `gpt-4-turbo`)
3. Configure the 28 skills as tool definitions in your OpenAI function calling setup
4. Call the OpenAI API with your custom system prompt and skill tools

**Expected Behavior**: API calls should work with the provided prompt and skill routing logic.

---

### What if the agent doesn't load?

See [Troubleshooting: Agent Won't Load](#agent-wont-load).

---

### Do I need to update my existing workflows?

**Short Answer**: Not necessarily. If you're already using the pre-consolidation PRD agent, the consolidated version is backward-compatible with the same workflow patterns.

**Changes to Expect**:
- Identical skill capabilities (28 consolidated skills provide all previous functionality)
- Same agent interface (Claude Code, Copilot, OpenAI remain unchanged)
- Improved response quality (100% test coverage means higher reliability)
- Better error handling (consolidated skills route more intelligently)

**No Migration Required**: Existing PRD workflows will continue to work. The consolidated agent is a drop-in replacement with better quality and maintenance.

---

## Using the Agent

### What kinds of PRD work can the agent help with?

The consolidated agent supports the full PRD lifecycle:

**1. PRD Creation**
- Draft new PRDs from project scope and requirements
- Generate acceptance criteria and testing strategies
- Create implementation roadmaps and timelines

**2. PRD Review & Quality**
- Review PRDs for clarity, completeness, and feasibility
- Identify gaps and suggest improvements
- Validate against quality standards

**3. Change Management**
- Route and manage PRD changes and updates
- Track change history and impact analysis
- Update related workflows (timelines, implementation plans)

**4. Coordination & Handoff**
- Generate launch readiness checklists
- Create release notes and deployment guides
- Manage team approval gates and sign-offs

**5. Integration & Reporting**
- Export projects as packaged deliverables
- Generate status reports and metrics
- Integrate with GitHub, Linear, Google Workspace

See `instructions/AGENTS.md` for detailed skill routing and workflow examples.

---

### How do I know which skill to use for my task?

The agent's orchestrator skill (prd-agent-orchestrator) automatically routes requests to the appropriate skill. **You generally don't need to specify a skill explicitly.**

**Examples of Automatic Routing**:

- **"Write a PRD for a user preferences panel"**
  → Routes to `prd-writer` (drafting cluster)

- **"Review this PRD for clarity and completeness"**
  → Routes to `prd-task-reviewer` (quality cluster)

- **"Generate a launch checklist for this project"**
  → Routes to `launch-task-router` (coordination cluster)

- **"Create GitHub issues from this PRD"**
  → Routes to `github-issue-drafter` (integration cluster)

**If You Need Specific Skill Help**: You can explicitly mention a skill name in your request. The agent will recognize it and route accordingly. See `instructions/AGENTS.md` for the full routing table.

---

### How long does it take to generate a PRD?

**Typical Duration**: 3-10 minutes depending on project complexity and amount of research required.

**Factors**:
- **Project Complexity**: Simple projects (feature tweaks) = 3-5 min. Complex projects (new platform) = 10-20 min.
- **Input Quality**: Well-scoped requirements = faster. Vague or incomplete input = slower (agent may ask clarifying questions).
- **Research Needed**: Projects requiring external research (competitor analysis, technical specs) = longer.

**Optimization Tips**:
1. Provide clear, detailed project scope upfront
2. Include acceptance criteria or user stories if available
3. Specify any constraints (timeline, technical limitations, dependencies)
4. Ask for structured output (JSON, YAML, markdown) to reduce formatting time

---

## Provider-Specific Questions

### Should I use Claude Code or Copilot for PRD work?

**Claude Code** (Recommended for PRD Work)
- ✅ Better at long-form content generation (PRDs are typically 1000+ words)
- ✅ Stronger context management (handles complex project scopes)
- ✅ Preferred for deep PRD work (design, validation, iteration)
- ✅ Direct integration: Copy agent file, use immediately

**GitHub Copilot**
- ✅ Better integration with GitHub workflows (issues, PRs, discussions)
- ✅ Lighter weight: Good for quick PRD sketches or outlines
- ✅ Seamless in GitHub web UI
- ⚠️ May truncate very long PRD documents (edge case)

**Recommendation**: Use Claude Code for primary PRD work; use Copilot for GitHub-specific integration tasks (creating issues, drafting release notes).

---

### Can I use the agent with other tools (Linear, Jira, Asana)?

**Native Integrations** (via skills):
- ✅ **GitHub**: Issue creation, PR workflows, release notes, milestones
- ✅ **Linear**: Issue creation, project linking, status updates
- ✅ **Google Workspace**: Doc sharing, calendar integration, meeting notes

**Indirect Support** (via manual export):
- ⚠️ **Jira**: Export PRD as JSON/YAML, import manually into Jira
- ⚠️ **Asana**: Export PRD as structured data, import as Asana tasks
- ⚠️ **Slack**: Export PRD, share in Slack (no direct bot integration)

**To Request New Integrations**: Open a GitHub issue tagged `[INTEGRATION-REQUEST]` with details on the tool and integration use case.

---

### What's the difference between the consolidated agent and the spec-based agent (mode-prd.agent.md)?

**Consolidated Agent** (`agents/prd-agent/`)
- ✅ Portable: Works in any LightSpeedWP repository
- ✅ Well-tested: 100% test pass rate, 3 providers
- ✅ Actively maintained: Phase 6+ updates
- ✅ Recommended: Use this going forward

**Spec-Based Agent** (`agents/mode-prd.agent.md` in .github control plane)
- ⚠️ GitHub-specific: Only works in `.github` repository
- ⚠️ Legacy: May become archived after Phase 7 decision
- ❌ Not recommended for new projects

**Recommendation**: Use the consolidated agent. The spec-based agent will be archived or synced to consolidated version after Phase 6 adoption metrics are collected (Phase 7 decision).

---

## Troubleshooting

### Agent Won't Load

**Problem**: Agent file copied, but Claude Code/Copilot doesn't recognize it.

**Diagnosis**:
1. Check file location:
   - Claude Code: `.claude/agents/prd-agent.md` ✅
   - Copilot: `.github/agents/prd-agent.md` ✅
   - Other: Verify path matches your provider's agent directory

2. Check YAML frontmatter:
   - Confirm file starts with `---` followed by valid YAML (no syntax errors)
   - Required fields: `name`, `description`, `model` (Claude) or `mcp-servers` (Copilot)

3. Restart IDE:
   - Close and reopen your editor
   - In VS Code: Reload window (`Ctrl+Shift+P` → "Reload Window")

**Solution Steps**:
1. Verify file location and YAML syntax
2. Restart IDE
3. Check provider logs (Claude Code: `.claude/logs/`; Copilot: Extension output panel)
4. If still failing, share the error message in `#product-planning` Slack or open a GitHub issue

---

### Agent Loads But Doesn't Respond Correctly

**Problem**: Agent loads, but responses are off-topic or incomplete.

**Diagnosis**:
1. Check your request clarity:
   - Vague: "Write a PRD" → Too open-ended
   - Clear: "Write a PRD for a user preferences panel (3-5 pages, includes acceptance criteria)"

2. Check prompt version:
   - Ensure you're using v2.3.0 (check agent file creation date: 2026-09-12 or later)
   - Old versions (v2.0.0, v2.1.0) have weaker skill routing

3. Check for provider limitations:
   - Claude Code: Should handle any PRD task
   - Copilot: May truncate very long outputs (>4000 tokens)
   - OpenAI API: Depends on your model (use gpt-4-turbo or newer)

**Solution Steps**:
1. Provide clear, detailed project scope
2. Update to v2.3.0 if using older version
3. Try Claude Code if using Copilot (rule out provider limitation)
4. If issue persists, open GitHub issue with example request and response

---

### Agent Runs Slowly

**Problem**: Agent takes >10 minutes to generate a PRD.

**Diagnosis**:
1. Check request complexity:
   - Complex projects (enterprise platform, lots of research needed) = slower
   - Simple projects (feature tweak) = should be <5 min

2. Check provider load:
   - Claude Code: Usually fast; check if running many concurrent tasks
   - Copilot: May be slower during peak GitHub usage
   - OpenAI API: Depends on API queue and rate limits

3. Check for infinite loops:
   - Agent asking clarifying questions → Answering incompletely → Asking again
   - Should terminate after 2-3 clarification rounds

**Solution Steps**:
1. Provide complete input upfront (reduce clarification rounds)
2. Break large projects into smaller PRDs (1 skill area per PRD)
3. Check provider status/docs for known slowdowns
4. If stuck in loop: Interrupt and restart with clearer scope

---

### Skill Routing Is Wrong

**Problem**: Agent routes to wrong skill (e.g., asks for PRD when you asked for review).

**Diagnosis**:
1. Check request clarity:
   - Request should explicitly mention the task type (draft, review, plan, etc.)
   - Example: "Review this PRD for clarity" vs. ambiguous "Improve this PRD"

2. Check if skill exists:
   - Not all 28 skills are equally active in all versions
   - Some skills may be in beta or limited availability

3. Check for ambiguous requests:
   - Multi-step requests may be broken down incorrectly
   - Example: "Write and review this PRD" → Single step preferred

**Solution Steps**:
1. Rephrase request to be clearer about task type
2. Break multi-step requests into separate agent invocations
3. Explicitly mention skill name if known (e.g., "Use the prd-task-reviewer skill to review this")
4. Open GitHub issue if routing consistently wrong for a specific task type

---

### Output Format Is Wrong

**Problem**: Agent outputs JSON when you asked for Markdown, or format doesn't match your needs.

**Diagnosis**:
1. Check output request:
   - Did you specify format? ("as markdown", "as JSON", "as a table")
   - Agent defaults to markdown for PRDs, JSON for data exports

2. Check for parsing issues:
   - If output looks corrupted, may be truncation or encoding issue
   - Try requesting specific section instead of full output

**Solution Steps**:
1. Specify output format explicitly: "Output this as [format]"
2. Request smaller chunks if truncation suspected
3. Copy/paste output and share in issue if format corrupted

---

### Agent Says a Skill Doesn't Exist

**Problem**: Agent claims a skill is unavailable, but you see it in documentation.

**Diagnosis**:
1. Check skill name spelling:
   - Skill names use hyphens, not underscores (e.g., `prd-writer`, not `prd_writer`)
   - Check `instructions/AGENTS.md` for exact names

2. Check agent version:
   - Older agent versions (v2.0.0, v2.1.0) have fewer skills
   - Ensure using v2.3.0 (all 28 skills available)

3. Check provider availability:
   - Some skills may be provider-specific (e.g., GitHub integration only in Copilot)

**Solution Steps**:
1. Verify skill name spelling against `instructions/AGENTS.md`
2. Update to v2.3.0 if using older version
3. Try a different provider if skill unavailable
4. Open issue if skill should be available but isn't

---

### I Found a Bug

**How to Report**:
1. Document the issue:
   - What you asked the agent to do
   - What it should have done (expected behavior)
   - What it actually did (actual behavior)
   - Any error messages or logs

2. Open a GitHub issue with label `[ROLLOUT-FEEDBACK]`:
   - Title: Brief description of bug
   - Body: Include steps to reproduce, expected vs. actual behavior
   - Severity: `critical` / `high` / `medium` / `low`

3. If critical (blocks usage):
   - Post in `#product-planning` Slack immediately
   - Contact Ash Shaw for urgent escalation

**Examples of What to Include**:
```
Title: PRD writer skill truncates long acceptance criteria

Steps to reproduce:
1. Ask agent: "Write a PRD with 20+ acceptance criteria"
2. Agent generates PRD with only first 10 criteria

Expected: All 20+ criteria included in output
Actual: Only 10 criteria shown; rest are truncated

Provider: Claude Code v2.3.0
Request: [paste your exact request]
Output: [paste the generated PRD - redact sensitive data]
```

---

## Feedback & Support

### How do I report issues or request improvements?

**For Bugs or Critical Issues**:
- Slack: `#product-planning` channel or DM Ash Shaw
- GitHub: Open issue with label `[ROLLOUT-FEEDBACK]` + severity label

**For Feature Requests**:
- GitHub: Open issue with label `[FEATURE-REQUEST]`
- Include: What feature, why needed, example use case

**For Questions or Help**:
- Slack: Ask in `#product-planning`
- Email: Contact Ash Shaw (ash@lightspeedwp.agency)
- This FAQ: Check if your question is covered above

---

### Where can I find more detailed documentation?

| Document | Purpose |
|----------|---------|
| **README.md** | Overview of agent and quick-start |
| **instructions/AGENTS.md** | Detailed skill routing and workflow examples |
| **ROLLOUT_PLAN.md** | Rollout strategy and timeline |
| **ADOPTION_METRICS.md** | Metrics framework for measuring success |
| **TEST_RESULTS.md** | Phase 5 testing results (100% pass rate baseline) |
| **CHANGELOG.md** | Version history and release notes |

All documents are located in `agents/prd-agent/` folder.

---

### Can I contribute improvements to the agent?

**Yes!** The consolidated PRD agent is maintained and improved based on team feedback.

**How to Contribute**:
1. Report issues or feature requests (see above)
2. Suggest improvements for skill routing or documentation
3. Share success stories or use cases (helps with adoption)
4. Participate in Phase 6 feedback (surveys, team briefings)

**Process**:
- Feature requests → Evaluated for Phase 6+ roadmap
- Bug reports → Triaged by severity; critical bugs fixed immediately
- Documentation improvements → Accepted via PR to agents/prd-agent/

**Contact**: Ash Shaw (ash@lightspeedwp.agency) or open GitHub issue

---

## Quick Reference

### Agent Files by Provider

| Provider | File Path | Load Via |
|----------|-----------|----------|
| Claude Code | `agents/prd-agent/claude/agent.md` | `.claude/agents/` directory |
| Copilot | `agents/prd-agent/copilot/agent.md` | `.github/agents/` directory |
| OpenAI API | `agents/prd-agent/openai/agent.md` | System prompt + function calls |

### Key Slack Channels

| Channel | Purpose |
|---------|---------|
| `#product-planning` | Agent discussions, feedback, support |
| `#engineering` | Technical integration questions |
| `#general` | Announcements and org-wide updates |

### Important Links

- **Consolidated Agent**: `agents/prd-agent/` (LightSpeed `.github` repository)
- **Issue Tracker**: GitHub Issues (label: `[ROLLOUT-FEEDBACK]`)
- **Feedback Form** (Phase 6): Google Form link (distributed Week 4)
- **Adoption Metrics**: `agents/prd-agent/ADOPTION_METRICS.md`

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-09-12 | Claude Haiku 4.5 | Initial FAQ created; Phase 6 FR-605 implemented |

---

**Still have questions?** Open a GitHub issue or post in `#product-planning` Slack. We're here to help! 🚀
