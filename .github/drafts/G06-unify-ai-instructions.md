---
name: "📚 Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Docs/Agents] Unify AI instructions/prompts/chat modes + override pattern"
labels: [type:documentation, status:needs-triage, priority:normal, area:documentation, area:agents]
assignees: []
projects: []
milestone: ''
file_type: documentation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - ../AGENTS.md
  - .github/custom-instructions.md
---

## What documentation is needed?

We need to clarify the scope and precedence hierarchy between global AI instructions, repository-level `custom-instructions.md`, agent-specific specs, and chat modes. Currently, the relationship and override patterns are unclear, leading to conflicting guidance and unpredictable AI agent behaviour.

**Current state:**
- Multiple instruction surfaces without clear hierarchy
- Unclear scope for each instruction level
- No documented override/precedence pattern
- Missing cross-links between AGENTS.md, agent specs, and chat modes
- Conflicting or redundant guidance across files

**Desired state:**
- Clear headers in each instruction file defining scope and precedence
- Documented override pattern (global → repo → agent → chat mode)
- `docs/CHATMODES.md` created with examples and use cases
- AGENTS.md index lists all active agents with links
- Cross-references enable easy navigation
- Predictable, understandable AI behaviour

## Why is this documentation important?

**For contributors:**
- Clear precedence enables confident customisation
- Understanding scope prevents conflicting instructions
- Examples and chat modes accelerate effective AI use
- Predictable behaviour improves trust and productivity

**For maintainers:**
- Reduced debugging of unexpected AI behaviour
- Easier maintenance of instruction hierarchy
- Better onboarding for teams using AI tools

**Impact:**
- **High** - Conflicting guidance causes unpredictable AI behaviour
- **Medium** - Contributors waste time debugging instruction conflicts
- **Medium** - Reduces effectiveness of AI-assisted development

## Acceptance Criteria

- [ ] Each instruction file has clear header defining:
  - Scope (what it applies to)
  - Precedence level (global/repo/agent/mode)
  - Override behaviour (what it can override and what can override it)
- [ ] `docs/CHATMODES.md` created with:
  - Purpose and use cases
  - Available chat modes (e.g., code review, documentation, testing)
  - Examples for each mode
  - How to invoke and customise modes
- [ ] `AGENTS.md` index updated to list all active agents with:
  - Agent name and purpose
  - Link to agent spec file
  - Status (active, experimental, deprecated)
- [ ] Cross-links added between:
  - AGENTS.md ↔ custom-instructions.md
  - AGENTS.md ↔ CHATMODES.md
  - Agent specs ↔ relevant chat modes
- [ ] Override pattern documented with examples
- [ ] No conflicting or redundant guidance remains
- [ ] Follows [WordPress documentation standards](https://developer.wordpress.org/coding-standards/inline-documentation/)
- [ ] Changelog entry prepared for PR

## Additional Context

**Suggested precedence hierarchy (lowest to highest):**
1. **global-defaults** - Built-in Claude/AI model defaults
2. **organisation-level** - LightSpeed general instructions
3. **repository-level** - `.github/custom-instructions.md`
4. **agent-level** - Specific agent specs (e.g., `agents/code-review.md`)
5. **chat-mode** - Active mode for current session (e.g., "accessibility audit mode")

**Example header template:**
```markdown
---
title: Repository Custom Instructions
scope: repository
precedence: repository-level
overrides: [global-defaults, organisation-level]
overridden_by: [agent-level, chat-mode]
---

# Custom Instructions

These instructions apply to all AI interactions within this repository.
They override global and organisation-level defaults.
Agent-specific and chat mode instructions take precedence over these.
```

**Example `docs/CHATMODES.md` structure:**
```markdown
# Chat Modes

## Available Modes

### Code Review Mode
**Purpose:** Thorough code review with security and accessibility focus
**Invoke:** `/mode code-review` or similar
**Example:**
[examples]

### Documentation Mode
**Purpose:** Writing and reviewing documentation
**Invoke:** `/mode docs`
**Example:**
[examples]
```

**Files to update:**
- `.github/custom-instructions.md` (add header)
- `AGENTS.md` (complete agent index)
- `docs/CHATMODES.md` (create)
- All agent spec files (add headers)
- CONTRIBUTING.md (link to new docs)

**Cross-linking strategy:**
Add "Related Documentation" sections in each file pointing to the others.

**Telemetry (post-merge):**
- Contributors can discover all instruction surfaces from AGENTS.md
- Doc lints pass with no broken cross-links
- Reduced questions about AI behaviour conflicts

## References

- [AGENTS.md](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md)
- [custom-instructions.md](https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md)
- [CLAUDE.md](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)

---

### Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined
- [ ] Related docs/issues or files linked
- [ ] Acceptance criteria listed
- [ ] Estimate added: **Medium-Large** (3-5 hours: headers, CHATMODES, index, cross-links)
- [ ] Agreement on precedence hierarchy

### Definition of Done (DoD)

- [ ] All instruction files have scope/precedence headers
- [ ] CHATMODES.md created with examples
- [ ] AGENTS.md index complete and accurate
- [ ] Cross-links added and verified
- [ ] Override pattern documented and clear
- [ ] Documentation meets org standards and guidelines
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation reviewed for clarity and accessibility
- [ ] PR uses correct branch prefix (`docs/unify-ai-instructions`)

---

## Directions & Next Steps

1. Create feature branch: `docs/unify-ai-instructions`
2. Define and document precedence hierarchy
3. Add scope/precedence headers to all instruction files
4. Create `docs/CHATMODES.md` with examples
5. Update AGENTS.md with complete agent index
6. Add cross-links between all related docs
7. Review for conflicting guidance and remove redundancies
8. Update CHANGELOG.md
9. Submit PR with reference: `fixes #<issue_number>`
10. Tag @docs-team and @agents-team for review

**Branch prefix:** `docs/`

**Files to modify:**
- `.github/custom-instructions.md`
- `AGENTS.md`
- `docs/CHATMODES.md` (create)
- All agent spec files in `agents/`
- `CONTRIBUTING.md` (add references)

See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
