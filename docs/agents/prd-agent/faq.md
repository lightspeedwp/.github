---
title: FAQ & Troubleshooting
description: Common questions, setup issues, and solutions for the PRD agent
created: 2026-09-17
---

# FAQ & Troubleshooting

This page answers the most common questions teams have about the PRD agent.

## Getting Started

### Q: Do I have to use the PRD agent, or can I write PRDs manually?

**A**: You don't have to use the agent. The PRD agent is a tool to speed up PRD creation, not a requirement. Many teams write PRDs manually or use other tools.

That said:

- **Use the agent if**: You want guided PRD creation, consistent structure, and faster iteration
- **Skip the agent if**: Your team has an established PRD template and workflow that works well

The playbook in this guide applies whether or not you use the agent.

### Q: Which platform should I choose: Claude Code, Copilot, or OpenAI?

**A**: Choose based on your workflow:

| Platform | Best For | Why |
|----------|----------|-----|
| **Claude Code** | Individual developers, cross-platform teams, maximum flexibility | Works on Mac, Windows, Linux; most features; easiest setup |
| **GitHub Copilot** | Teams with GitHub Copilot licenses, embedded in VS Code/JetBrains | Fast in-editor access; org-wide availability; integrated with GitHub |
| **OpenAI** | Teams already using OpenAI API, custom integrations, scripts | Good for automation and scripting; requires API key management |

**Our recommendation**: Start with Claude Code if you're trying it out; graduate to Copilot if your team uses GitHub Copilot Enterprise.

### Q: Can I use multiple platforms?

**A**: Yes. Many teams use:

- Claude Code for detailed, exploratory PRD work
- Copilot for quick PRD requests during coding
- Both produce compatible output

### Q: Do I need an active internet connection?

**A**: Yes. The PRD agent requires internet access to:

- Send PRD text to Anthropic's API (Claude Code/Copilot) or OpenAI's API
- Generate responses

Your project files stay local; only the PRD text is sent to the API.

---

## Setup & Installation

### Q: I tried to copy the agent but got an error. What went wrong?

**A**: Check:

1. **File path is correct**: The file should be in `.claude/agents/prd-agent.md` (Claude Code) or `.github/agents/prd-agent.md` (Copilot)
2. **File was copied completely**: Make sure you didn't truncate the file (check file size matches original)
3. **YAML frontmatter is valid**: The metadata at the top (between `---` lines) must be properly formatted
4. **No merge conflicts**: If you edited the file, revert and copy the original fresh

**Solution**:

```bash
# Remove the broken file
rm .claude/agents/prd-agent.md  # or .github/agents/prd-agent.md

# Download fresh
curl -s https://raw.githubusercontent.com/lightspeedwp/.github/develop/agents/prd-agent/claude/agent.md \
  -o .claude/agents/prd-agent.md

# Verify (check file size)
ls -lh .claude/agents/prd-agent.md
```

### Q: The agent loads but tools are missing or unavailable

**A**: Most tools are built into Claude Code/Copilot. If you see "Tool unavailable":

1. Restart your IDE or Copilot interface
2. Check your Claude Code or Copilot subscription is active
3. If using custom tools, verify they're installed in your environment

### Q: Agent works on one machine but not another

**A**: This usually means:

- The agent file is not in the same location on both machines
- One machine has the agent, the other doesn't

**Solution**: Make sure `.claude/agents/prd-agent.md` is committed to Git so it's available on all machines.

```bash
git add .claude/agents/prd-agent.md
git commit -m "feat: add PRD agent"
git push
```

---

## PRD Creation & Quality

### Q: My PRDs are getting too long (5000+ words). What's wrong?

**A**: You might be:

- **Including implementation details**: "Use PostgreSQL" and "Create indexes on users.email" are implementation, not requirements. Move to engineering design docs.
- **Writing narrative**: "The user is stressed and frustrated..." is context, not a requirement. Summarize briefly instead.
- **Over-specifying edge cases**: List the 3–5 most critical edge cases; minor ones can be discovered during development.

**Solution**:

- Executive summary: 1–2 sentences
- User stories: 3–5 per feature
- Requirements: 10–20 functional, 5–10 non-functional
- Edge cases: Top 3–5 only

If your PRD is >2000 words, it probably covers multiple features. Split into separate PRDs.

### Q: The agent's PRD is too generic. How do I make it more specific?

**A**: Give the agent more context:

**Before** (generic output):

```
The user wants a dashboard with important metrics.
```

**After** (specific output):

```
Product managers need a dashboard showing 5 KPIs (revenue, churn, MRR, retention, LTV)
with filters for date range and customer segment. They need to see trends week-over-week
and compare against targets. The dashboard must load in <2 seconds and support 1000
concurrent users.
```

**How to prompt better**:

- Be specific about numbers ("5 KPIs", not "important metrics")
- Give examples ("Like Mixpanel's dashboard", "Similar to Notion properties")
- List constraints upfront ("Must load in <2s", "Only 3 engineers available", "Must integrate with Stripe")
- Include context ("Our users are SaaS product managers", "This is a bottleneck causing 2-day delays")

### Q: The agent's output doesn't match my industry/domain

**A**: Tell the agent your domain:

```
I'm building a feature for a healthcare company. Here are relevant constraints:
- HIPAA compliance required (all data must be encrypted at rest)
- User base is doctors and nurses (not tech-savvy, need simple UX)
- Integrates with EHR systems (HL7 protocol)

Create a PRD for [feature] that addresses these constraints.
```

### Q: I don't like the PRD structure the agent produced. Can I reorder sections?

**A**: Yes. The agent's structure is a suggestion. Reorder sections to match your team's template:

**Agent output order**:

1. Executive summary
2. User stories
3. Requirements
4. Data model
5. Success metrics

**Your team's order** (if different):

1. Problem statement
2. Success metrics
3. User stories & acceptance criteria
4. Requirements
5. Risks & mitigations

Reorder and reorganize as needed. The key is consistency — use the same structure for all PRDs.

---

## Estimation & Planning

### Q: How do I know if my estimate is realistic?

**A**: Red flags that suggest your estimate is unrealistic:

- **Wide range** ("Could be 5 days or 20 days"): PRD is ambiguous; refine it
- **Estimate is 3× time budget**: You might be over-scoped; cut MVP
- **Team disagrees widely** ("2 days" vs. "10 days"): Different interpretations; clarify PRD
- **No contingency buffer**: You've estimated 8 days for 10 days of work; add 25% buffer
- **Ignoring dependencies**: "3 days" assumes the database schema is ready; is it?

**How to reality-check**:

1. Have team estimate independently (no discussion first)
2. Compare estimates: if they agree ±20%, you're good
3. If they differ >30%, something in the PRD is ambiguous — revise
4. Add 25–30% contingency for unknowns

### Q: Should I estimate in story points or days?

**A**: Either works. Choose what your team is used to:

- **Story points**: Good for relative sizing ("This is twice as hard as that")
- **Days**: Good for timeline planning ("We have 10 engineer-days available this week")

If you use Agile, use story points. If you track capacity in calendar days, use days.

### Q: The team estimated 10 days but we only have 5. What do I do?

**A**: Options:

1. **Extend timeline**: If possible, move the deadline
2. **Reduce scope**: Cut low-priority features (move to phase 2)
3. **Add resources**: Bring in more engineers (but may create rework)
4. **Accept risk**: Ship with reduced testing or known limitations

**Don't**: Pressure the team to reduce the estimate. If they say 10 days, it probably needs 10 days.

---

## Handoff & Integration

### Q: How do I integrate PRD into Linear/GitHub without creating tons of duplicate work?

**A**: Create issues from PRD structure, not word-for-word:

**Bad** (creates duplicates):

```
Linear Issue:
"From PRD: The user opens a PRD in the UI"
"From PRD: The system displays a Generate Specs button"
"From PRD: The user clicks the button"
```

**Good** (references PRD, avoids duplication):

```
Linear Issue:
Title: "Implement PRD upload & spec generation flow"
Description:
  User Story: [link to PRD section US1]
  Acceptance Criteria:
    1. PRD input field visible and functional
    2. "Generate Specs" button displayed after PRD loaded
    3. Clicking button triggers generation
  
  Related Design: [Figma link]
```

**Rule**: One issue per user story or feature component, not per sentence in the PRD.

### Q: Figma designs don't match the PRD. Whose responsibility is it to fix?

**A**: It depends:

1. **PRD is clear, design doesn't match**: Designer updates Figma
2. **PRD is ambiguous, design interpreted differently**: Update PRD, then update Figma
3. **Design found a better solution**: Update PRD + Figma together; document why change was made

**Best practice**: Have design review the PRD *before* starting design work. Catch mismatches early.

### Q: Can I feed a PRD into a code generation tool?

**A**: Yes, if the tool supports it. Examples:

- **Claude Code**: "Based on this PRD, generate a TypeScript implementation" (works well)
- **Copilot**: "Write code for this PRD" (works okay; less predictable)
- **Custom LLM tools**: Feed PRD as context; results depend on tool
- **No-code tools** (Make, Zapier): Hard to use PRDs directly; hand-write requirements instead

**Best practice**: Use a PRD to brief engineers, then let them write code in their preferred style. Don't try to fully automate code from PRD.

---

## Common Problems

### Q: The agent keeps asking clarifying questions and never produces a draft

**A**: The agent is being thorough, which is good. But if it's asking too many questions:

1. **Your initial prompt was vague**: Provide more upfront context
2. **You're over-explaining**: The agent only needs 3–4 pieces of info; give concise answers
3. **You're changing requirements mid-session**: Lock down requirements before the agent drafts

**How to move forward**:

- Say: "I think we've clarified enough. Can you draft the PRD now?"
- Or: "I'll answer questions 1–3 now; we'll refine the rest after we see the draft"

### Q: The agent's output is nonsensical or doesn't make sense

**A**: This usually means:

1. **Your input was ambiguous or contradictory**: Example: "Must be very fast AND process 1M records" (contradictory)
2. **You asked for something the agent isn't trained for**: Example: "Write a PRD for quantum computing" (outside training domain)
3. **There's a temporary API issue**: Try again in a few minutes

**How to fix**:

1. Review your input for ambiguity or contradictions
2. Try a simpler request to verify the agent works
3. If still broken, file an issue: [lightspeedwp/.github/issues](https://github.com/lightspeedwp/.github/issues)

### Q: I edited the agent prompt and now it's broken

**A**: Restore the original:

```bash
# Download the original
curl -s https://raw.githubusercontent.com/lightspeedwp/.github/develop/agents/prd-agent/claude/agent.md \
  -o .claude/agents/prd-agent.md

# Restart Claude Code or Copilot
```

If you want custom behavior, describe what you changed and we can help you do it safely. Don't edit the agent prompt directly unless you know what you're doing.

---

## Performance & Costs

### Q: How much does it cost to use the PRD agent?

**A**: Costs depend on your platform:

- **Claude Code**: Included in Claude Pro ($20/month) or Claude Code subscription
- **GitHub Copilot**: Included in GitHub Copilot Enterprise or Pro
- **OpenAI API**: Pay per API call (typically $0.001–$0.01 per PRD generation)

A typical PRD takes ~5000 tokens to generate, costing:

- Claude: Included in subscription
- OpenAI: ~$0.015–$0.05 per PRD (GPT-3.5) or ~$0.05–$0.15 per PRD (GPT-4)

### Q: PRD generation is slow. How do I speed it up?

**A**: Generation time depends on:

1. **Platform overhead**: Copilot may be slower than Claude Code if your IDE is busy
2. **API latency**: Temporary API slowness affects all platforms
3. **PRD complexity**: Longer, more detailed PRDs take longer to generate

**Ways to speed up**:

- Use Claude Code instead of Copilot (faster)
- Break large PRDs into smaller ones (less to generate per PRD)
- Use a faster model (if available): GPT-3.5 is faster than GPT-4

### Q: Can I cache or reuse PRDs?

**A**: Yes:

1. **Store approved PRDs in Git** so they're searchable and referenceable
2. **Create PRD templates** for recurring feature types (e.g., "User authentication", "Report dashboard")
3. **Link related PRDs**: "This feature is an extension of [previous PRD]"

**How to organize**:

```
/prd-archive/
  /2026-q3/
    prd-design-spec-generator.md
    prd-figma-integration.md
    prd-linear-sync.md
  /2026-q4/
    prd-copilot-custom-agents.md
```

---

## Still Have Questions?

- **Workflow help**: See [Workflow Guide](./workflow.md)
- **Quality standards**: See [Best Practices](./best-practices.md)
- **Estimation advice**: See [Estimation Strategy](./estimation-strategy.md)
- **Integration questions**: See [Integration Guide](./integration-guide.md)
- **Not answered above?** Open an issue: [lightspeedwp/.github](https://github.com/lightspeedwp/.github/issues) with tag `[PRD-AGENT-SUPPORT]`

---

**Last Updated**: 2026-09-17  
**Most Common**: Setup issues, quality questions, estimation help  
**If All Else Fails**: Reach out on Slack or GitHub Issues
