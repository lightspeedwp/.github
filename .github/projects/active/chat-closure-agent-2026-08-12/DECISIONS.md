---
title: "Chat Closure Agent — Design Decisions"
description: "Finalized decisions, best practices, and rationale for the agent implementation"
version: "1.0.0"
created_date: "2026-08-12"
last_updated: "2026-08-12"
file_type: documentation
authors: ["Ash Shaw"]
maintainer: "Ash Shaw"
tags: ["design-decisions", "agent-design", "architecture"]
---

# Chat Closure Agent — Design Decisions & Best Practices

## Decision 1: Memory Handoff Depth

### Question

How detailed should the continuation prompt's context summary be?

### Options Evaluated

1. **Minimal (links only)** — Just active projects, issues, PRs
2. **Moderate (summary + links)** — 1-2 sentence summary + links ✅ CHOSEN
3. **Comprehensive (full recap)** — Full recap of work + links

### Decision: MODERATE (Summary + Links)

**Rationale:**

- **Brevity**: Respects context window constraints for continuation chat
- **Actionability**: 1-2 sentence summary provides enough context to orient the user
- **Leverage existing memory**: Full context is in memory entries and GitHub issues — avoid duplication
- **User control**: User can drill into links for more detail

**Implementation:**

```markdown
## Context Summary
[1-2 sentence summary of chat focus derived from branch name + recent commits]

## Active Projects
- [Project name](link): [Brief scope 1 line]

## Related Issues
| Issue | Type | Status |
|-------|------|--------|
| #1731 | epic | 🟢 Open |

## Related PRs
| PR | Title | Status |
|----|-------|--------|
| #1774 | feat: Phase 2... | 🟡 In Review |
```

**Best Practice:**

- Extract summary from branch scope keyword (e.g., `feat/{scope}-{title}` → scope)
- Use recent commit messages to infer focus
- Provide direct links to projects/issues so user can navigate immediately
- Keep summaries to 1-2 sentences maximum

---

## Decision 2: Worktree Deletion Strategy

### Question

What should happen to the worktree after cleanup?

### Options Evaluated

1. **Document path only** — User deletes manually
2. **Ask before deleting** — Confirmation prompt required ✅ CHOSEN
3. **Auto-delete after commit** — Automatic deletion

### Decision: ASK BEFORE DELETING

**Rationale:**

- **Safety first**: User must explicitly consent before deletion
- **Preserve work**: Prevents accidental loss if user wants to continue
- **Flexibility**: User can manually clean up later if preferred
- **Clear feedback**: Agent documents what will be deleted

**Implementation:**

```javascript
// Pseudocode
if (userConfirms("Delete worktree at " + workTreePath + "?")) {
  deleteWorktree(workTreePath)
  reportSuccess("Worktree deleted")
} else {
  reportPath("Worktree preserved at: " + workTreePath)
  reportStep("Manual cleanup: git worktree remove <path>")
}
```

**Best Practice:**

- Always show worktree path before asking for confirmation
- Provide manual cleanup command in output (`git worktree remove <path>`)
- Don't assume user wants deletion — always ask
- Document the path prominently in output

---

## Decision 3: Memory-Issue Linking Strategy

### Question

Should memory entries link back to GitHub issues?

### Options Evaluated

1. **Bidirectional linking** — Memory→Issue + Issue→Memory comments
2. **One-way (memory→issue)** — Memory links to issues only ✅ CHOSEN
3. **Independent entries** — No cross-linking

### Decision: ONE-WAY (Memory→Issue Only)

**Rationale:**

- **No issue clutter**: Avoids adding bot comments to issue threads
- **Stable links**: Links in memory entries don't become orphaned when branches are deleted
- **Simpler workflow**: No need to add comments to issues (avoids GitHub API friction)
- **User control**: User can manually add references if they want bidirectional linking

**Implementation:**

```yaml
# Memory entry example (.remember/session-id-closure-2026-08-12.md)
---
name: session-closure-2026-08-12
description: Chat closure for chat-closure-agent implementation
metadata:
  type: project
  session_id: "chat-cont-abc123"
  related_issues: ["#1850", "#1851"]  # Links memory→issue
  related_prs: ["#1774"]
---

# Inside memory entry
## Related Issues
- [Epic #1850](../../issues/1850) — Chat Closure Agent Implementation
- [Task #1851](../../issues/1851) — Phase 1: Core Analysis

# NO comment added to the issue itself (unlike bidirectional)
```

**Best Practice:**

- Always extract related issue numbers from commits/branch names
- Format links as `[#XXXX](../../issues/XXXX)` for relative repo navigation
- Use issue key + title for clarity
- Document which issues are related in memory frontmatter (`related_issues`, `related_prs`)
- Let users manually add backlinks to issues if they want full bidirectional tracking

---

## Decision 4: WordPress Repository Support Scope

### Question

Which repo types should the agent support?

### Options Evaluated

1. **Control-plane only (MVP)** — Start with `.github`, WordPress later
2. **Both equally** — All three types from Phase 1 ✅ CHOSEN
3. **WordPress plugins first** — Prioritize plugins over control-plane

### Decision: BOTH EQUALLY (All Three from Phase 1)

**Rationale:**

- **Maximized reusability**: Portable agent serves entire organization immediately
- **Shared logic**: Core analysis, memory, handoff logic is identical across repos
- **Minimal adaptation**: Only project/issue discovery changes by repo type
- **Future-proof**: Foundation ready for additional repo types (block libraries, patterns, etc.)

**Implementation:**

```javascript
// Repo-type detection
function detectRepoType(repoPath) {
  if (isGitHubControlPlane(repoPath)) {
    return "control-plane"
  }
  if (isWordPressPlugin(repoPath)) {
    return "wordpress-plugin"
  }
  if (isWordPressTheme(repoPath)) {
    return "wordpress-theme"
  }
  throw new Error("Unknown repo type")
}

// Adapter pattern for repo-specific project discovery
function findProjects(repoType, repoPath) {
  switch (repoType) {
    case "control-plane":
      return findGitHubProjects(repoPath)  // Look in .github/projects/active/
    case "wordpress-plugin":
      return findWordPressPluginProjects(repoPath)  // Look in plugin metadata
    case "wordpress-theme":
      return findWordPressThemeProjects(repoPath)  // Look in theme metadata
  }
}
```

**Repo Type Indicators:**

| Repo Type | Indicators |
|-----------|-----------|
| **Control-plane** | `.github/projects/active/`, `.github/labels.yml`, `.github/workflows/` |
| **WordPress plugin** | `plugin.php`, `composer.json`, `wp-cli.yml` |
| **WordPress theme** | `style.css`, `theme.json`, `functions.php`, block templates |

**Best Practice:**

- Detect repo type early in core-analysis phase
- Use adapter pattern for repo-specific logic
- Keep core components (git analysis, memory, handoff) repo-agnostic
- Test all three repo types in fixtures and integration tests

---

## Decision 5: Chat Archival Approach

### Question

How should the agent handle chat archival?

### Options Evaluated

1. **Manual only** — Agent documents the archival step
2. **Document step + API integration** — Prepare for future API ✅ CHOSEN
3. **Programmatic (if API exists)** — Not currently possible

### Decision: MANUAL (Documented Step) + Future API Integration Ready

**Rationale:**

- **No API available yet**: Claude Code chat archival API not currently exposed
- **Future-proof**: Design archival step so API integration is straightforward
- **User-friendly**: Clear documentation tells user exactly what to do
- **Reversible**: Manual archival means user has full control

**Implementation:**

```markdown
# Continuation Prompt — [Chat Title]

## Chat Archival Instructions

Your chat session is about to be archived in Claude Code. To complete the session:

1. **Copy the continuation prompt** (above)
2. **Create a new Claude Code chat** (`/new`)
3. **Paste the continuation prompt** as your first message
4. **Reference the previous session:** Mention this session ID: `{SESSION_ID}`
5. **Close/archive this chat** via Claude Code UI (Settings → Archive Chat)

**Previous Session ID:** {SESSION_ID}  
**Archived on:** {DATE}  
**Time limit:** This chat will become read-only in 7 days

---

# Continuation Prompt
[Content follows...]
```

**Best Practice:**

- Document the archival workflow clearly at the top of the continuation prompt
- Include session ID so user can reference previous work
- Provide step-by-step instructions (copy, new chat, paste, archive)
- Note that archival is manual (sets user expectations)
- Design so future API integration just replaces the manual steps

**Future API Integration (Phase 5):**

```javascript
// Pseudocode for future API integration
async function archiveChat(sessionId, continuationPrompt) {
  // When API becomes available:
  const result = await claudeCode.archiveChat({
    sessionId: sessionId,
    continuationPrompt: continuationPrompt,
    archiveDate: new Date().toISOString(),
  })
  return result
}
```

---

## Best Practices Summary

### For Memory Integration

- ✅ Use existing 10-family YAML structure (don't invent new schema)
- ✅ Populate: project_context, decision_log, execution_state, handoff families
- ✅ Link memory→issues via frontmatter + markdown links
- ✅ Validate memory entry structure if schemas available

### For Git Analysis

- ✅ Extract scope from branch name using regex: `{type}/{scope}-{title}`
- ✅ Parse commit messages to find related issues (#1234)
- ✅ Detect repo type by checking for marker files (plugin.php, theme.json, etc.)
- ✅ Handle dirty/clean worktrees gracefully

### For Project Discovery

- ✅ Control-plane: Scan `.github/projects/active/{slug}/README.md` for related issues
- ✅ WordPress: Parse plugin/theme metadata comments for project references
- ✅ Validate projects exist before including in output
- ✅ Format links relative to repo root (e.g., `../../issues/1234`)

### For Continuation Prompts

- ✅ Keep summary to 1-2 sentences (respects context limits)
- ✅ Use Markdown tables for issues/PRs (clean, scannable)
- ✅ Include branch status (commits ahead, staged/uncommitted changes)
- ✅ Provide memory entry summaries (key decisions, blockers, next steps)

### For Testing

- ✅ Unit tests target 90%+ coverage per component
- ✅ Integration tests cover all three repo types
- ✅ Fixtures mock realistic git states (dirty, clean, merge conflicts)
- ✅ Coverage report verified before PR submission

### For Documentation

- ✅ Include 3+ Mermaid diagrams (workflow, components, repo detection)
- ✅ Add accessibility descriptions (accTitle, accDescr) to all diagrams
- ✅ Real-world examples show before/after (git state → closure → output)
- ✅ TESTING_GUIDE explains fixture structure and how to add new ones

---

## Decision Matrix

| Decision | Choice | Rationale | Implementation | Testing |
|----------|--------|-----------|-----------------|---------|
| Memory depth | Moderate | Context limits, leverage existing memory | 1-2 summary + links | Extract summary from commits |
| Worktree delete | Ask first | Safety, flexibility | Confirmation prompt | Mock git state, verify prompt |
| Memory linking | One-way | No issue clutter, stable | Memory→issue links | Verify link format in tests |
| WordPress support | Both equally | Maximize reusability | Adapter pattern | Fixtures for all 3 repo types |
| Chat archival | Manual + future-ready | No API yet, design for future | Step-by-step docs | Document workflow in prompt |

---

## References

- **CLAUDE.md** — Repo governance, branching rules, label strategy
- **AGENTS.md** — Two-tier agent structure, agent standards
- **AGENT_STANDARDS.md** — Agent creation guidelines, Tier 1 patterns
- **SKILLS_STANDARDS.md** — Reusable skill patterns
- **TESTING.md** — Jest setup, coverage targets
- **Memory system** — `.remember/`, `MEMORY.md`, `/.schemas/memory/`
