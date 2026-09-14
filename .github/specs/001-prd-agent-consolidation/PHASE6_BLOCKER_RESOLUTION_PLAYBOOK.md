---
title: Phase 6 Blocker Resolution Playbook
created: 2026-09-14
task: T073, T075
status: Ready for Use
owner: Ash Shaw
---

# Phase 6 Blocker Resolution Playbook

**Purpose**: Quick reference for common blockers identified during team briefings (T073) and ongoing monitoring (T075), with resolution strategies and escalation paths

**Usage**: When a team reports a blocker during T073 briefing or T075 monitoring, consult this playbook for quick resolution guidance

---

## Common Blockers & Resolution Strategies

### Blocker Type 1: Integration with Existing Copilot Setup

**Symptoms**:

- Team has custom Copilot configuration that conflicts with consolidated agent
- Consolidated agent doesn't load alongside existing custom agents
- Prompt initialization fails due to missing context

**Root Causes** (most common):

1. Custom agent uses same tool names as consolidated agent → name collision
2. Team's `.github/agents/` folder structure differs from expected layout
3. Copilot memory registry expects different agent entry format

**Resolution Strategy**:

**Level 1 - Self-Service (Team can resolve)**:

- [ ] Check: Does team have existing custom agents in `.github/agents/`?
  - **Yes** → Suggest renaming existing agents with namespace prefix (e.g., `team-custom-agent.md` instead of `custom-agent.md`)
  - **No** → Proceed to Level 2
- [ ] Identify the custom-agent integration and how it executes (GitHub Actions workflow, provider-native configuration, or another mechanism).
  - **If GitHub Actions is involved** → Document the minimum required `permissions` at job or workflow level and apply only those permissions.
  - **Otherwise** → Configure only the minimum permissions required by the identified integration; do not assume a broader token is needed.
- [ ] Provide: Step-by-step integration guide (`agents/prd-agent/FAQ.md` section "Copilot Integration Troubleshooting")

**Level 2 - Ash Shaw Intervention**:

- [ ] Verify: Agent definition frontmatter matches `contracts/copilot-agent-frontmatter.md`
- [ ] Audit: Scan team's `.github/agents/` for conflicting tool names
- [ ] Solution: Create a "shim" agent that loads consolidated agent + restores team's custom context
- [ ] Document: Update FAQ with team's specific configuration

**Level 3 - Escalation** (if unresolved after Level 2):

- [ ] Create: GitHub issue `[PHASE6-BLOCKER]` with label `area:copilot`
- [ ] Assign: To @ashley (org Copilot authority)
- [ ] Timeline: SLA 2 business days for response

**Prevention** (for future teams):

- Add section to T073 briefing slides: "Copilot Configuration Checklist"
- Pre-distribute integration guide to all teams before briefings

---

### Blocker Type 2: Claude Code Subagent Not Loading

**Symptoms**:

- Claude Code fails to load consolidated agent as subagent
- Error: "Invalid agent definition" or "Missing required fields"
- Agent loads but skill routing fails

**Root Causes** (most common):

1. Agent definition YAML has syntax errors
2. Tool list in frontmatter references non-existent tools
3. Model field has deprecated or unavailable value

**Resolution Strategy**:

**Level 1 - Self-Service**:

- [ ] Check: Agent definition validates with `npm run validate:frontmatter`
  - **Fails** → Provide error output to team; suggest fixing per error message
  - **Passes** → Proceed to Level 2
- [ ] Check: Are all tools in `agents/prd-agent/claude/agent.md` available in calling session?
  - **No** → Team may lack permission to use certain MCP servers; escalate to Level 3
  - **Yes** → Proceed to Level 2

**Level 2 - Ash Shaw Intervention**:

- [ ] Audit: Compare team's loaded agent definition against canonical `agents/prd-agent/claude/agent.md`
- [ ] Validate: Tool list matches all 28 consolidated skills
- [ ] Test: Load agent in Claude Code sandbox session; capture error if any
- [ ] Document: Update FAQ with team's specific error + resolution

**Level 3 - Escalation**:

- [ ] Create: GitHub issue `[PHASE6-BLOCKER]` with label `area:claude-code`
- [ ] Assign: To Claude Code maintainer / Anthropic support
- [ ] Timeline: SLA 3 business days

---

### Blocker Type 3: Skill Routing Failures

**Symptoms**:

- Consolidated agent loads but skill routing doesn't work as documented
- Specific skills are unreachable or fail silently
- Output quality is degraded compared to pre-consolidation version

**Root Causes** (most common):

1. Skill references in routing table are stale (skill name changed or folder moved)
2. Memory registry doesn't have up-to-date skill metadata
3. Prompt instructions contain incorrect skill names or tool references

**Resolution Strategy**:

**Level 1 - Self-Service**:

- [ ] Check: Is the specific skill actually accessible on disk?
  - **No** → Skill folder may have been deleted or moved; check Phase 3 consolidation completeness
  - **Yes** → Proceed to Level 2
- [ ] Check: Does memory registry have entry for the skill?
  - Run: `grep -r "skill-name" workflows/memory/registry/`
  - **No matches** → Skill missing from registry; escalate to Level 2
  - **Matches** → Proceed to Level 2

**Level 2 - Ash Shaw Intervention**:

- [ ] Audit: Compare prompt routing table against actual skill folder contents
- [ ] Verify: Memory registry is up-to-date with Phase 3-5 consolidation
- [ ] Test: Manually invoke failing skill; capture routing and output
- [ ] Document: Add to FAQ if skill routing is counterintuitive or needs clarification

**Level 3 - Escalation**:

- [ ] Create: GitHub issue `[PHASE6-BLOCKER]` with label `area:skill-routing`
- [ ] Assign: To @ashley (PRD agent maintainer)
- [ ] Action: May require Phase 5 prompt re-enhancement (new test case)

---

### Blocker Type 4: Satisfaction with Output Quality

**Symptoms**:

- Team reports consolidated agent output is worse than pre-consolidation version
- Specific output types (e.g., PRD structure, acceptance criteria) are inconsistent
- Satisfaction survey shows low scores on "output quality vs. baseline"

**Root Causes** (most common):

1. Prompt enhancements in Phase 4 changed output structure (intentional, but unexpected to team)
2. Skill routing is not optimal for team's specific use case
3. Team was not trained on consolidated agent's expected output format

**Resolution Strategy**:

**Level 1 - Self-Service**:

- [ ] Provide: TEST_CASES_BASELINE.md (Phase 4 test results) showing output quality improvements
- [ ] Provide: Prompt documentation highlighting new output structure
- [ ] Recommend: Run 3-5 test PRDs with consolidated agent to familiarize with output

**Level 2 - Ash Shaw Intervention**:

- [ ] Review: Team's 2-3 sample PRDs (input + output) to assess quality
- [ ] Compare: Against pre-consolidation baseline from TEST_CASES_BASELINE.md
- [ ] Analysis: Is this regression or expectation mismatch?
  - **Regression** → Check if Phase 4 enhancements introduced a bug
  - **Mismatch** → Provide training on new output format and features
- [ ] Document: Update FAQ with examples of consolidated agent output format

**Level 3 - Escalation** (if true regression):

- [ ] Create: GitHub issue `[PHASE6-QUALITY]` with label `type:bug`
- [ ] Attach: Team's sample PRDs (input + output) + expected vs. actual comparison
- [ ] Action: May require Phase 4 prompt retuning
- [ ] Timeline: SLA 2 business days for triage

---

### Blocker Type 5: Onboarding & Documentation Gaps

**Symptoms**:

- Team struggles to set up consolidated agent (missing integration steps)
- FAQ doesn't cover team's specific scenario
- Documentation is outdated or refers to pre-consolidation version

**Root Causes** (most common):

1. FAQ.md (T076) doesn't cover all provider scenarios
2. Integration guide is generic and doesn't account for custom workflows
3. Team has unique setup (non-standard directory structure, custom tools)

**Resolution Strategy**:

**Level 1 - Self-Service**:

- [ ] Provide: Provider-specific integration guide from FAQ.md
- [ ] Provide: Example `.claude/agents/` or `.github/agents/` setup from quickstart.md
- [ ] Recommend: Team reviews ROLLOUT_PLAN.md context before setup

**Level 2 - Ash Shaw Intervention**:

- [ ] Create: Custom integration guide for team's specific setup
- [ ] Test: Walk through integration with team in real-time (screen share)
- [ ] Document: Update FAQ.md with new scenario for future teams
- [ ] Timeline: 1 business day turnaround

---

## Blocker Escalation Flow

```
Blocker Identified (T073 briefing or T075 monitoring)
    ↓
Consult Playbook → Check Level 1 (Self-Service)
    ↓
Can Team Self-Resolve?
    ├─ YES → Provide guidance; document in FAQ if novel
    └─ NO → Escalate to Level 2 (Ash Shaw)
            ↓
            Is This Ash Shaw's Domain?
            ├─ YES → Resolve with Level 2 guidance; update FAQ
            └─ NO → Escalate to Level 3 (GitHub issue + external team)
                    ↓
                    External Team Resolves → Update FAQ; close GitHub issue
```

---

## Blocker Tracking Template (for T075a interim checkpoint)

**File**: `.github/specs/001-prd-agent-consolidation/PHASE6_BLOCKERS_LOG.md` (to be maintained during rollout)

```markdown
# Phase 6 Blockers Log

**Date**: 2026-09-14 onwards  
**Last Updated**: [Date]  
**Owner**: Ash Shaw

## Active Blockers (Being Worked)

| ID | Team | Type | Severity | Status | Resolution | ETA |
|----|------|------|----------|--------|------------|-----|
| B001 | Product Team A | Copilot Setup | Medium | Level 2 In Progress | Config namespace conflict | 2026-09-19 |
| B002 | Design Team | Skill Routing | High | Level 1 Self-Service | Provided FAQ section | 2026-09-20 |

## Resolved Blockers (Archived)

| ID | Team | Type | Severity | Resolution | Closed Date | FAQ Updated |
|----|------|------|----------|------------|-------------|-------------|
| B003 | Product Team A | Setup | Medium | Namespace shim created | 2026-09-19 | Yes |

## Lessons Learned

- [Blocker patterns for future prevention]
- [FAQ updates needed]
- [Process improvements]

## Next Blocker Review

**Date**: [Next weekly review date]  
**Agenda**: Review active blockers; identify patterns; update prevention strategies
```

---

## FAQ Enhancement Checklist

Every blocker resolved should generate a FAQ update:

- [ ] **Blocker Type**: [Name from playbook]
- [ ] **Root Cause**: [Why it happened]
- [ ] **Self-Service Resolution**: [Can team resolve? How?]
- [ ] **FAQ Section**: Add Q&A with real example from this blocker
- [ ] **Link Back**: Include link to this playbook for Ash Shaw reference
- [ ] **Test**: Verify FAQ solution works on fresh team setup

---

## Prevention Strategies (Per Blocker Type)

### For Copilot Setup Blockers

- Add "Copilot Configuration Checklist" to T073 briefing slides
- Distribute pre-configured template `.github/agents/` folder to teams
- Include in pre-briefing email: "Check your custom agents for naming conflicts"

### For Claude Code Blockers

- Validate agent definition syntax before sending to teams
- Provide `.claude/agents/` template folder (ready-to-copy)
- Include in pre-briefing: "Your Claude Code session must have tools X, Y, Z available"

### For Skill Routing Blockers

- Document each skill's primary use case and routing trigger words
- Create "Skill Cheat Sheet" (1-page PDF with all 28 skills + trigger words)
- Include in post-briefing materials

### For Output Quality Blockers

- Include TEST_CASES_BASELINE.md in briefing materials
- Show before/after PRD examples (pre vs. consolidated agent)
- Manage expectations: "Phase 4 enhancements may change output structure"

### For Onboarding Blockers

- Create per-provider integration videos (Claude Code, Copilot, OpenAI)
- Provide copy-paste ready commands for each setup step
- Include troubleshooting flowchart in FAQ

---

## Support Channel Etiquette (#prd-agent-rollout Slack)

**Response SLAs**:

- Level 1 questions (FAQ lookup): Respond within 4 hours
- Level 2 questions (Ash Shaw review): Respond within 1 business day
- Level 3 escalations (GitHub issues): Create issue same day, acknowledge within 2 business days

**Async-First**:

- Start with FAQ link; only DM if FAQ doesn't cover
- Use threads to keep channel organized
- Archive resolved blockers to thread summary

**Escalation Criteria** (when to create GitHub issue):

- Blocker affects >1 team
- Level 2 intervention reaches Level 3 escalation
- Blocker is novel and not in playbook
- Blocker may indicate Phase 4 or Phase 5 regression

---

**Owner**: Ash Shaw  
**Last Updated**: 2026-09-14  
**Next Review**: 2026-10-12 (T075a day-30 interim checkpoint)
