# **Answers to 50 Restructuring Questions**

## *Organised by category*

---

[1\. ORGANIZATIONAL & ACCESS PATTERNS](#1.-organizational-&-access-patterns)

[Q1: Multi-project consumption — Will developers always include .github as a VSCode folder?](#q1:-multi-project-consumption-—-will-developers-always-include-.github-as-a-vscode-folder?)

[Q2: Shared vs. Project-specific assets — Should release/changelog agents have variants?](#q2:-shared-vs.-project-specific-assets-—-should-release/changelog-agents-have-variants?)

[Q3: Cross-project portability — Which folders are reusable vs. .github-only?](#q3:-cross-project-portability-—-which-folders-are-reusable-vs.-.github-only?)

[Q4: Team size & roles — How many team members will configure plugins?](#q4:-team-size-&-roles-—-how-many-team-members-will-configure-plugins?)

[Q5: Read-only vs. Contribute — Should WordPress projects contribute back?](#q5:-read-only-vs.-contribute-—-should-wordpress-projects-contribute-back?)

[Q6: VSCode workspace nesting — Multi-root or separate projects?](#q6:-vscode-workspace-nesting-—-multi-root-or-separate-projects?)

[Q7: Documentation visibility — Should all docs be visible to all projects?](#q7:-documentation-visibility-—-should-all-docs-be-visible-to-all-projects?)

[Q8: Plugin ecosystem — Installed once per developer or per-workspace?](#q8:-plugin-ecosystem-—-installed-once-per-developer-or-per-workspace?)

[2\. AGENTS & SKILLS GOVERNANCE](#2.-agents-&-skills-governance)

[Q9: Agent ownership — Who maintains each agent?](#q9:-agent-ownership-—-who-maintains-each-agent?)

[Q10: Spec-based agents (.agent.md) — Root or .github/agents/?](#q10:-spec-based-agents-\(.agent.md\)-—-root-or-.github/agents/?)

[Q11: Release agent specificity — Generic or .github-only?](#q11:-release-agent-specificity-—-generic-or-.github-only?)

[Q12: Changelog agent — Generic or .github-only?](#q12:-changelog-agent-—-generic-or-.github-only?)

[Q13: Linting agents — Generic or repo-specific variants?](#q13:-linting-agents-—-generic-or-repo-specific-variants?)

[Q14: Skills portability — Root or .github/skills/?](#q14:-skills-portability-—-root-or-.github/skills/?)

[Q15: Agent versioning — Pinned versions or latest-only?](#q15:-agent-versioning-—-pinned-versions-or-latest-only?)

[3\. SCHEMAS & VALIDATION](#3.-schemas-&-validation)

[Q16: Hidden vs. public folder — .schemas/ or schemas/?](#q16:-hidden-vs.-public-folder-—-.schemas/-or-schemas/?)

[Q18: Schema organization — By type, domain, or tool?](#q18:-schema-organization-—-by-type,-domain,-or-tool?)

[Q19: Root schema/ folder — Consolidate with .schemas/?](#q19:-root-schema/-folder-—-consolidate-with-.schemas/?)

[Q20: Schema reference updates — Which files reference schema paths?](#q20:-schema-reference-updates-—-which-files-reference-schema-paths?)

[Q21: AI tool schema consumption — Direct or internal-only?](#q21:-ai-tool-schema-consumption-—-direct-or-internal-only?)

[4\. FOLDER REORGANIZATION — SCOPE & INTENT](#4.-folder-reorganization-—-scope-&-intent)

[Q22: Root cleanup philosophy — What should remain in root?](#q22:-root-cleanup-philosophy-—-what-should-remain-in-root?)

[Q23: Reports & Projects move — Manual moves, then what?](#q23:-reports-&-projects-move-—-manual-moves,-then-what?)

[Q24: Scripts folder — Root or .github/scripts/?](#q24:-scripts-folder-—-root-or-.github/scripts/?)

[Q25: Config folder — Root or .github/config/?](#q25:-config-folder-—-root-or-.github/config/?)

[Q26: Website folder — .github/website/ and reconfigure workflows?](#q26:-website-folder-—-.github/website/-and-reconfigure-workflows?)

[Q27: Hooks folder — Root or .github/hooks/?](#q27:-hooks-folder-—-root-or-.github/hooks/?)

[Q28: Tests folder — tests/ or \_\_tests\_\_/? Root or .github/?](#q28:-tests-folder-—-tests/-or-__tests__/?-root-or-.github/?)

[Q29: Memory & tmp folders — Root, .github/, or gitignored?](#q29:-memory-&-tmp-folders-—-root,-.github/,-or-gitignored?)

[5\. VSCODE WORKSPACE SETUP](#5.-vscode-workspace-setup)

[Q30: Workspace config location — Where should setup docs/sample files live?](#q30:-workspace-config-location-—-where-should-setup-docs/sample-files-live?)

[Q31: Shared VS settings — Which settings are shared?](#q31:-shared-vs-settings-—-which-settings-are-shared?)

[Q32: Extensions & plugins — Recommend, auto-install, or provide scripts?](#q32:-extensions-&-plugins-—-recommend,-auto-install,-or-provide-scripts?)

[Q33: New developer onboarding — Script, checklist, or both?](#q33:-new-developer-onboarding-—-script,-checklist,-or-both?)

[Q34: Plugin configuration — .github/config/plugins/ or plugins/ root?](#q34:-plugin-configuration-—-.github/config/plugins/-or-plugins/-root?)

[Q35: Workspace-level .code-workspace file — Template, generated, or committed?](#q35:-workspace-level-.code-workspace-file-—-template,-generated,-or-committed?)

[Q36: Credential & auth handling — How should setup guide handle tokens?](#q36:-credential-&-auth-handling-—-how-should-setup-guide-handle-tokens?)

[Q37: First-run experience — What should developers do on first run?](#q37:-first-run-experience-—-what-should-developers-do-on-first-run?)

[6\. PLUGINS & EXTERNAL AI TOOLS](#6.-plugins-&-external-ai-tools)

[Q38: Plugin adoption strategy — Phased rollout or all-at-once?](#q38:-plugin-adoption-strategy-—-phased-rollout-or-all-at-once?)

[Q39: Multi-tool strategy — Standardize on one or support all four?](#q39:-multi-tool-strategy-—-standardize-on-one-or-support-all-four?)

[Q40: Plugin registry / discovery — Catalog or checklist?](#q40:-plugin-registry-/-discovery-—-catalog-or-checklist?)

[Q41: Plugin versioning — Pinned versions or auto-update?](#q41:-plugin-versioning-—-pinned-versions-or-auto-update?)

[Q42: Plugin inter-dependencies — Independent or coordinated?](#q42:-plugin-inter-dependencies-—-independent-or-coordinated?)

[Q43: Plugin testing — Manual, CI/CD, or dedicated validation?](#q43:-plugin-testing-—-manual,-ci/cd,-or-dedicated-validation?)

[7\. PACKAGE.JSON & DEPENDENCIES](#7.-package.json-&-dependencies)

[Q44: Package.json scope — What should it include?](#q44:-package.json-scope-—-what-should-it-include?)

[Q45: Scripts reduction — Which custom scripts are actually used?](#q45:-scripts-reduction-—-which-custom-scripts-are-actually-used?)

[Q46: Dependency cleanup — Can we remove unused packages?](#q46:-dependency-cleanup-—-can-we-remove-unused-packages?)

[Q47: Node version pinning — .nvmrc and .npmrc?](#q47:-node-version-pinning-—-.nvmrc-and-.npmrc?)

[Q48: Package-lock strategy — Committed or regenerated?](#q48:-package-lock-strategy-—-committed-or-regenerated?)

[8\. DOCUMENTATION & DISCOVERABILITY](#8.-documentation-&-discoverability)

[Q49: Root README.md scope — High-level or full navigation?](#q49:-root-readme.md-scope-—-high-level-or-full-navigation?)

[Q50: Docs folder organization — By audience or by topic?](#q50:-docs-folder-organization-—-by-audience-or-by-topic?)

[9\. IMPLEMENTATION SEQUENCING](#9.-implementation-sequencing)

[Q51: Migration order — Folder moves first, then updates?](#q51:-migration-order-—-folder-moves-first,-then-updates?)

[Q52: Rollout to team — Auto-update or gradual migration?](#q52:-rollout-to-team-—-auto-update-or-gradual-migration?)

[BONUS: RECOMMENDATIONS I DIDN'T ANSWER YET](#bonus:-recommendations-i-didn't-answer-yet)

[Should we move .schemas/ or keep it hidden?](#should-we-move-.schemas/-or-keep-it-hidden?)

[Should config/ be split?](#should-config/-be-split?)

[Where should \*.agent.md files live?](#where-should-*.agent.md-files-live?)

[Should we create a VSCode setup agent?](#should-we-create-a-vscode-setup-agent?)

[Cookbooks for WordPress projects?](#cookbooks-for-wordpress-projects?)

[Plugins adoption — How do we get there?](#plugins-adoption-—-how-do-we-get-there?)

[SUMMARY TABLE: YOUR DECISIONS NEEDED](#summary-table:-your-decisions-needed)

[NEXT STEPS](#next-steps)

---

## **1\. ORGANIZATIONAL & ACCESS PATTERNS** {#1.-organizational-&-access-patterns}

### **Q1: Multi-project consumption — Will developers always include `.github` as a VSCode folder?** {#q1:-multi-project-consumption-—-will-developers-always-include-.github-as-a-vscode-folder?}

**My answer:** **No, not always—but it should be *easy* to opt-in.**

**Your Context:** You have 2-3 core maintainers, 4-5 contributors, and 8-9 WordPress project developers consuming `.github`.

**Detailed Reasoning:**

- **Core maintainers (2-3 people)**: Will *always* include `.github` (they maintain it)  
- **Contributors (4-5 people)**: Will include `.github` when actively working on agents/skills, but might not for routine fixes  
- **Consumers (8-9 WordPress projects)**: Will mostly *reference* `.github` without opening it, unless they're forking agents/skills for their own project

**Your Vision Applied:** Since you're building a shared workspace model where the `.github` repo is available to all projects, you need to make discovery and integration effortless but optional. Developers should be able to:

1. Work on WordPress project alone (no `.github`)  
2. Add `.github` when they need to reference agents/skills  
3. Have clear documentation for each scenario

**Recommendation:**

- Provide a sample `lightspeed-dev.code-workspace` file that *includes* both `.github` and a WordPress project  
- Document how to remove `.github` if not needed  
- Make onboarding website (github.lightspeedwp.agency) the entry point for "should I include `.github`?"  
- Update the onboarding/getting-started pages to guide developers per role

**Success Criteria:**

- ✅ New developer can decide in \<5 minutes whether they need `.github` in their workspace  
- ✅ Documentation explains the multi-workspace setup clearly  
- ✅ Setup script works with or without `.github`

---

### **Q2: Shared vs. Project-specific assets — Should release/changelog agents have variants?** {#q2:-shared-vs.-project-specific-assets-—-should-release/changelog-agents-have-variants?}

**My answer:** **Yes, create a generic template in `agents/` root, plus `.github`\-specific variants in `.github/agents/`.**

**Your Context:** You're moving toward WordPress-specific agents (plugin release, theme release) in the future, but `.github` has unique needs (changelog recovery from Linear, GitHub releases sync).

**Detailed Reasoning:**

The `.github` release process is **tightly coupled** to:

- Changelog recovery from Linear tickets  
- Version bumping in specific files  
- GitHub release creation  
- PR labeling in `.github` workflows

A WordPress plugin release agent needs to handle:

- WordPress.org plugin deployment  
- Different version numbering (semantic vs. WordPress versioning)  
- Different changelog formats (Keep a Changelog vs. WordPress conventions)

**Your Vision Applied:** You want the `.github` repo to be a shared resource, so the generic release agent should be discoverable in `agents/` root. But since `.github`'s release process is complex and repo-specific, it should also have a dedicated agent in `.github/agents/`.

**Recommendation:**

- Store **generic template** in `agents/release-management.agent.md`  

  - Works for most projects  
  - Documented with examples for plugin/theme customization  
  - Includes placeholders for custom versioning schemes

- Store **`.github`\-specific variant** in `.github/agents/release-agent.github.md`  

  - Tightly tuned for this repo's changelog recovery  
  - Integrates with Linear and GitHub  
  - Documents the specific steps for `.github` releases

- Future: Create `agents/wordpress-plugin-release.agent.md` and `agents/wordpress-theme-release.agent.md` as needed

**Agent Ownership (per your Q9 feedback):**

- `agents/release-management.agent.md` → Owned by Ash Shaw  
- `.github/agents/release-agent.github.md` → Owned by Ash Shaw

**Documentation Location:**

- `agents/README.md` → "Using Release Agents" section explaining both variants  
- `.github/agents/README.md` → Explains `.github`\-specific agents and when to use them

---

### **Q3: Cross-project portability — Which folders are reusable vs. `.github`\-only?** {#q3:-cross-project-portability-—-which-folders-are-reusable-vs.-.github-only?}

**My Answer:** Clear separation of portable vs. repo-specific assets.

**Your Context:** All projects will have the `.github` repo in their workspace, so they need clear signals about what they can use.

**Detailed Table:**

| Folder | Scope | When to Use | Example |
| :---- | :---- | :---- | :---- |
| `agents/` | **Both** (generic \+ variants) | All projects | `release-management.agent.md` for any project |
| `skills/` | **Both** | All projects | `code-review.skill/` applies everywhere |
| `hooks/` | **Both** | All projects | Pre-commit linting works for any project type |
| `instructions/` | **Both** | All projects | Coding standards, a11y, documentation formats |
| `ai/` | **Both** | All projects | Claude, Gemini, RUNNERS configs are org-wide |
| `config/` | **Mixed** | Portable: ESLint, Prettier, TypeScript (root); GitHub-native: labels, issue types (`.github/`) | ESLint rules shared; labels are `.github`\-specific |
| `cookbook/` | **Both** | All projects | WordPress plugin testing, CI/CD recipes |
| `docs/` | **Mixed** | Org-wide: branching, PR process; `.github`\-specific: release automation, workflow architecture | BRANCHING\_STRATEGY.md is org-wide; release-process.md is `.github`\-specific |
| `.github/` | **`.github`\-only** | `.github` maintainers | GitHub templates, workflows, labels |
| `scripts/` (→ `.github/scripts/`) | **`.github`\-only** | `.github` maintainers | Validation scripts tightly coupled to repo structure |
| `plugins/` | **Both** | All projects | Plugin specs for Claude Code, Copilot, Gemini |
| `prompts/` | **Both** | All projects | Reusable prompt templates across projects |
| `website/` (→ `.github/website/`) | **`.github`\-only** | `.github` maintainers | The github.lightspeedwp.agency documentation site |

**Your Vision Applied:** This separation makes it clear to WordPress project developers: "These folders are for you; these are `.github`\-internal." The visual separation also helps maintainers avoid accidentally breaking other projects.

**Success Criteria:**

- ✅ A WordPress project developer can look at the root folder and immediately identify reusable assets  
- ✅ No ambiguity about which agents/skills are project-specific vs. generic

---

### **Q4: Team size & roles — How many team members will configure plugins?** {#q4:-team-size-&-roles-—-how-many-team-members-will-configure-plugins?}

**My Answer (with your clarification):**

**Your Team:**

- **Core Team (2-3 people)**: Ash Shaw \+ 1-2 others  

  - Install & configure all plugins  
  - Contribute new agents/skills  
  - Maintain the `.github` repo

- **Contributors (4-5 people)**:  

  - Use Claude Code \+ GitHub Copilot  
  - Consume agents/skills passively  
  - May add features to existing agents/skills

- **Consumers (8-9 WordPress projects)**:  

  - Use GitHub Copilot (minimum)  
  - Can optionally use Claude Code  
  - Read-only access to agents/skills  
  - Rarely need to configure plugins

**Detailed Reasoning:** Your team structure suggests a three-tier adoption model. Not everyone needs full plugin setup; most benefit from Copilot \+ agents without complex configuration.

**Onboarding Strategy (per your Q38 feedback):** You mentioned the onboarding website (github.lightspeedwp.agency) is the key entry point. This is where you'll:

1. Direct new developers to the right tier  
2. Provide tier-specific setup instructions  
3. Link to the VSCode workspace setup guide  
4. Explain the learning path (onboarding website → learn section → courses & lessons)

**Recommendation:**

- **Tier 1 (Core Maintainers)**: Full setup script \+ all plugins installed  
- **Tier 2 (Contributors)**: Simplified setup script \+ Claude Code \+ Copilot only  
- **Tier 3 (Consumers)**: Minimal setup \+ GitHub Copilot only  
- Document each tier in `docs/vscode-workspace-setup.md` with role-based instructions  
- Update github.lightspeedwp.agency onboarding page to route developers by role

**Website Updates Needed (per your feedback):**

- `/onboarding/` — Add tier-based routing logic  
- `/getting-started/` — Link to workspace setup guide for each tier  
- `/references/` — Link to agents, skills, hooks, workflows, plugins  
- New `/documentation/` page — Render markdown files from `docs/`  
- Update existing pages: Cookbook, Agents, Instructions, Prompts, Skills, Hooks, Workflows, Plugins, Tools

---

### **Q5: Read-only vs. Contribute — Should WordPress projects contribute back?** {#q5:-read-only-vs.-contribute-—-should-wordpress-projects-contribute-back?}

**My Answer (with your clarification):**

**Policy: Yes to Contributions, with Governance**

**Your Vision Applied:** You want WordPress projects to contribute improvements back, but only when working in a **dedicated `.github` workspace**. This prevents accidental changes while in production WordPress project code.

**Detailed Process:**

**Contributing Back to `.github` Repo:**

1. **When** WordPress project finds a bug/improvement in an agent or skill  
2. **Step 1**: Open the `.github` repo in a **dedicated VSCode workspace** (separate from WordPress project)  
3. **Step 2**: Create a feature branch: `feat/improve-code-review-agent` or `fix/linting-agent-rule`  
4. **Step 3**: Make changes and test locally  
5. **Step 4**: Open PR against `.github` repo with justification  
   - Example: "This linting rule helps WordPress block development"  
   - Links to the WordPress project where it was discovered  
6. **Step 5**: `.github` maintainers review and merge (or reject with guidance)

**Read-Only Mode (Typical Usage):**

When a WordPress project developer is in their project workspace:

- They can *reference* and *consume* agents/skills from `.github`  
- They should **not** edit them directly  
- If they need customization, they **fork** the agent/skill locally

**Governance via CODEOWNERS:**

- `.github/CODEOWNERS` file defines who reviews changes to agents, skills, scripts  
- Per your Q9 feedback, initially all agents are owned by Ash Shaw  
- As team grows, ownership can be delegated: `agents/ @ash` → later: `agents/linting @warwick`

**Documentation:** Update `CONTRIBUTING.md` with:

- "How to Contribute to `.github`" section  
- Step-by-step for opening a dedicated workspace  
- Review process and timeline expectations  
- Link from WordPress project docs: "Contributing upstream"

**Success Criteria:**

- ✅ WordPress developers know they should NOT edit `.github` assets directly in production workspace  
- ✅ Clear process exists for contributing improvements  
- ✅ Maintainers can efficiently review contributions

---

### **Q6: VSCode workspace nesting — Multi-root or separate projects?** {#q6:-vscode-workspace-nesting-—-multi-root-or-separate-projects?}

**My Answer (with your confirmation):**

**Decision: Multi-root workspace is optimal for LightSpeed.**

**You Confirmed:** "Multi-root workspace"

**Detailed Reasoning:**

**Why Multi-Root Works for LightSpeed:**

1. **Constant Agent Reference**  

   - Developer is coding WordPress block → needs to reference agent in `.github/agents/`  
   - With multi-root: Click in left sidebar, instant access  
   - With separate windows: Alt-tab, navigate, remember what you saw

2. **Search Across Repos**  

   - Developer wants to find which agent handles "changelog"  
   - Multi-root: Cmd+Shift+F searches both `.github` \+ WordPress project  
   - Separate windows: Search separately in each window

3. **VSCode Settings Consistency**  

   - ESLint, Prettier, formatting rules should be consistent  
   - Multi-root: Workspace file defines shared settings \+ per-folder overrides  
   - Separate windows: Risk of config drift between windows

4. **Discoverability**  

   - New developer opens workspace  
   - Left sidebar shows: `.github` folder \+ WordPress project folder  
   - Immediately discovers agents/skills exist  
   - Separate windows: Less obvious what's available

**Implementation:**

- Sample workspace file: `.github/lightspeed-dev.code-workspace`  
- Includes both `.github` \+ WordPress project example  
- Developer customizes by editing `folders` array with their own project paths

**Settings Strategy:**

- `.github/.vscode/settings.json` → Strict ESLint, Prettier, coding standards (for repo-specific work)  
- WordPress project `<root>/.vscode/settings.json` → May be more permissive (depends on project)  
- Per-folder overrides prevent conflicts: `.github` strictness doesn't block WordPress project work

**Example Workspace File:**

```json
{
  "folders": [
    { "path": ".", "name": ".github (Control Plane)" },
    { "path": "../my-wordpress-plugin", "name": "My Plugin" }
  ],
  "settings": {
    "search.exclude": { "**/node_modules": true, ".github/tmp": true }
  }
}
```

**Success Criteria:**

- ✅ New developer opens one VSCode window and sees both repos  
- ✅ Can search/reference across both repos without switching windows  
- ✅ Settings are consistent yet allow per-folder customization

---

### **Q7: Documentation visibility — Should all docs be visible to all projects?** {#q7:-documentation-visibility-—-should-all-docs-be-visible-to-all-projects?}

**My Answer (with your context):**

**Decision: Yes, but organize by audience. Then publish to website.**

**Your Vision Applied:** You want to render markdown files from `docs/` on the github.lightspeedwp.agency website. This means:

1. Docs should be structured clearly (so they render nicely on web)  
2. Audience labels help website UI (tag docs as "For Everyone", "For Developers", "For Maintainers")  
3. Same docs serve both: repo reference \+ website content

**Detailed Organization:**

```
docs/
  README.md                          ← Index of all docs (with audience tags)
  
  BRANCHING_STRATEGY.md              ← audience: everyone
  PR_CREATION_PROCESS.md             ← audience: contributors, maintainers
  CONTRIBUTING.md                    ← audience: everyone
  
  vscode-workspace-setup.md          ← audience: developers
  faq.md                             ← audience: everyone
  
  agents-and-skills/
    consuming-agents.md              ← audience: developers
    developing-agents.md             ← audience: advanced contributors
    developing-skills.md             ← audience: advanced contributors
  
  ai-ops/
    changelog-automation.md           ← audience: .github maintainers
    release-process.md               ← audience: .github maintainers
    plugin-setup.md                  ← audience: developers, maintainers
  
  architecture/
    repository-structure.md          ← audience: everyone
    workflow-architecture.md         ← audience: advanced contributors
```

**Website Rendering (per your Q38 feedback):**

New pages needed on github.lightspeedwp.agency:

- `/documentation/` → Renders all docs from `docs/` folder  

  - Filter by audience tags  
  - Search across all docs  
  - Direct link from resources mega-menu

- Update existing pages:  

  - `/onboarding/` → Route to workspace setup guide  
  - `/getting-started/` → Link to branching strategy, PR process  
  - `/references/` → Link to agents, skills, hooks, workflows, plugins, instructions, prompts, cookbook, tools  
  - `/cookbook/` → Renders `cookbook/` markdown files  
  - `/agents/` → Renders `agents/README.md` \+ agent specs  
  - `/skills/` → Renders `skills/README.md` \+ skill specs  
  - `/hooks/` → Link to `hooks/README.md`  
  - `/plugins/` → Link to `plugins/README.md`  
  - `/instructions/` → Renders `instructions/` files  
  - `/prompts/` → Renders `prompts/` files  
  - `/tools/` → New page linking to `workflows/`, `scripts/`, external tools

**Documentation Standards:** All docs should follow your existing format in `instructions/documentation-formats.instructions.md`:

- Markdown with YAML frontmatter  
- Audience tags  
- Clear structure with H2/H3 headings  
- Links to related docs

**Success Criteria:**

- ✅ All org-wide docs visible to all projects  
- ✅ Website renders docs with audience filtering  
- ✅ WordPress developers find branching strategy, PR process, coding standards easily  
- ✅ `.github` maintainers find workflow architecture, release process, automation docs easily

---

### **Q8: Plugin ecosystem — Installed once per developer or per-workspace?** {#q8:-plugin-ecosystem-—-installed-once-per-developer-or-per-workspace?}

**My Answer (confirmed by your setup):**

**Decision: Once per developer, across all workspaces.**

**Detailed Explanation:**

**How Plugins Work:**

1. **Claude Code Plugins** (Anthropic's plugin framework)  

   - User-level installation (tied to your Anthropic account)  
   - Once installed, available in Claude Code across all projects  
   - Configuration lives in Claude Code settings (API keys, preferences)  
   - Not workspace-scoped

2. **GitHub Copilot** (GitHub's VSCode extension)  

   - VSCode extension (not workspace-scoped, but per-VSCode-installation)  
   - Once installed, available in all workspaces  
   - Authentication tied to your GitHub account

**Workspace Setup (per-workspace):**

- The `.code-workspace` file defines *workspace settings and folder layout*  
- This is different from plugins  
- Each workspace can have different ESLint, Prettier, editor settings  
- But Claude Code \+ Copilot plugins are shared across all workspaces

**Recommendation:**

**One-Time Setup (per developer):**

1. Install Claude Code extension  
2. Install custom LightSpeed plugins in Claude Code  
3. Install GitHub Copilot in VSCode

**Per-Workspace Setup (each time you create a new workspace):**

1. Create/customize `.code-workspace` file  
2. Set ESLint/Prettier configs for that workspace  
3. Set editor settings per-folder (if needed)

**Documentation Split:**

- `docs/vscode-workspace-setup.md` → Workspace setup (per-project)  
- `.github/WORKSPACE_SETUP.md` → Using the `.code-workspace` file  
- `docs/plugin-setup-claude-code.md` → Claude Code plugin (one-time, per-developer)  
- `docs/plugin-setup-github-copilot.md` → GitHub Copilot (one-time, per-developer)

**Success Criteria:**

- ✅ Developers understand they install plugins once, not per-workspace  
- ✅ Workspace file handles folder \+ settings, not plugins  
- ✅ Setup script doesn't try to reinstall plugins for each workspace

---

## **2\. AGENTS & SKILLS GOVERNANCE** {#2.-agents-&-skills-governance}

### **Q9: Agent ownership — Who maintains each agent?** {#q9:-agent-ownership-—-who-maintains-each-agent?}

**My Answer (with your clarification):**

**CODEOWNERS Strategy:**

**Your Feedback:** "Initially all assigned to Ash Shaw, but future flexibility for Warwick Booth and others."

**File: `.github/CODEOWNERS`**

```
# Agents (portable)
agents/release-management.agent.md @ash-shaw
agents/code-quality.agent.md @ash-shaw
agents/code-review.agent.md @ash-shaw
agents/changelog-management.agent.md @ash-shaw

# .github-specific agents
.github/agents/ @ash-shaw

# Skills
skills/ @ash-shaw

# Workflows
workflows/ @ash-shaw

# Future: As team grows
# agents/linting.agent.md @warwick-booth
# agents/testing-strategy.agent.md @contributor-name
```

**Governance Model:**

**Current (2-3 core team):**

- Ash Shaw reviews all agent PRs  
- Quick turnaround expected (1-2 days)  
- Maintains consistency across agents

**Future (as team grows):**

- Delegate ownership by agent type  
- Warwick Booth: Linting, code-quality agents  
- New contributor: Testing, deployment agents  
- Reduces bottleneck, maintains quality

**What Ownership Means:**

1. **Review**: Responsible for reviewing PRs touching that agent  
2. **Maintain**: Fix bugs, respond to issues  
3. **Document**: Keep agent documentation up-to-date  
4. **Test**: Verify agents work before merge

**Documentation:**

**File: `agents/README.md`** Add section:

```
## Agent Ownership

| Agent | Owner | Focus Area |
| --- | --- | --- |
| release-management.agent.md | Ash Shaw | Release automation, versioning |
| code-review.agent.md | Ash Shaw + Warwick Booth | Code review standards |
| code-quality.agent.md | Ash Shaw | Linting, formatting |

Contact the owner if you need help with an agent.
```

**File: `.github/agents/README.md`**

```
## .github-Specific Agents

These agents are maintained by `.github` core team.
Owned by: @ash-shaw

### Agents in this folder:
- release-agent.github.md — Release automation for .github repo
- changelog-recovery.agent.md — Recover missing changelog entries
- issue-triage.agent.md — Auto-triage GitHub issues
- pr-validator.agent.md — Validate PR structure and content
```

**Success Criteria:**

- ✅ Clear ownership assigned to each major agent  
- ✅ Contributors know who to ask for help  
- ✅ GitHub auto-requests review from owners on PRs  
- ✅ Ownership can scale as team grows

---

### **Q10: Spec-based agents (`.agent.md`) — Root or `.github/agents/`?** {#q10:-spec-based-agents-(.agent.md)-—-root-or-.github/agents/?}

**My Answer (with your context):**

**Decision: Split ownership by portability.**

**Your Context:**

- You have \~8 agents currently  
- Some are tightly `.github`\-coupled (changelog recovery)  
- Some could be useful for WordPress projects (code review, linting)

**Detailed Separation:**

**Root `agents/` (Portable):**

```
agents/
  README.md
  release-management.agent.md      ← Generic template, customizable
  code-review.agent.md             ← Useful for all projects
  code-quality.agent.md            ← Linting patterns for any project
  testing-strategy.agent.md        ← Testing approach guide
  documentation.agent.md           ← Doc generation (portable)
```

**`.github/agents/` (.github-Specific):**

```
.github/agents/
  README.md
  release-agent.github.md          ← Tightly tuned for .github (changelog recovery, Linear integration)
  changelog-recovery.agent.md      ← Specific to .github's history
  issue-triage.agent.md            ← .github issue automation
  pr-validator.agent.md            ← .github PR structure validation
  repo-structure-linter.agent.md   ← Validates .github repo structure
```

**Rationale:**

**Root agents are discoverable**: WordPress project developers see them in root, can adapt for their own use.

**`.github` agents are hidden**: Internal tools, not meant for external consumption.

**Future Expansion**: When WordPress plugin projects need specialized release agents, create:

- `agents/wordpress-plugin-release.agent.md`  
- `agents/wordpress-theme-release.agent.md`

**How Developers Use Them:**

**WordPress Project Developer:**

```
Looking for agents to reuse...
→ Opens agents/ folder
→ Sees release-management, code-review, testing-strategy
→ Can use them directly or fork for customization
```

**`.github` Maintainer:**

```
Need to validate PR structure for .github repo...
→ Uses .github/agents/pr-validator.agent.md
→ Integrated into GitHub workflow
→ WordPress projects never see it (not in their workspace)
```

**Documentation:**

**File: `agents/README.md`**

```
## Portable Agents

These agents are designed to be used by any LightSpeed project.

### Using an Agent
1. Open the agent file (e.g., `release-management.agent.md`)
2. Read the full agent specification
3. In Claude Code, select the agent from the dropdown
4. Describe your task

### Customizing an Agent
If you need to customize an agent for your project:
1. Copy the agent to your project
2. Modify the instructions for your needs
3. Test it locally
4. Consider contributing improvements back (see CONTRIBUTING.md)

### Generic vs. Project-Specific
- **Generic agents** in this folder work for most projects
- **Project-specific variants** may exist in your project folder (e.g., WordPress plugin projects)
- `.github` repo has its own agents in `.github/agents/`
```

**File: `.github/agents/README.md`**

```
## .github-Specific Agents

These agents are designed exclusively for the `.github` repository.
They are not meant for external use.

### Why Separate?
The `.github` repo has unique processes:
- Changelog recovery from Linear
- Complex release automation
- GitHub-native issue/PR validation
- Repository structure enforcement

These agents are tightly coupled to `.github`'s structure and won't work elsewhere.

### Available Agents
- `release-agent.github.md` — Release automation for this repo
- `changelog-recovery.agent.md` — Recover missing changelog entries
- `issue-triage.agent.md` — Auto-categorize and label issues
- `pr-validator.agent.md` — Validate PR structure
- `repo-structure-linter.agent.md` — Validate repo structure compliance
```

**Success Criteria:**

- ✅ WordPress developers can find portable agents easily  
- ✅ `.github` internal tools are clearly separated  
- ✅ Future project-specific agents have a clear pattern to follow

---

### **Q11: Release agent specificity — Generic or `.github`\-only?** {#q11:-release-agent-specificity-—-generic-or-.github-only?}

**My Answer (with your context):**

**Decision: Dual approach with clear separation.**

**Generic Template: `agents/release-management.agent.md`**

This agent works for:

- WordPress plugins (WordPress.org deployment)  
- WordPress themes (Themeforest, WordPress.org)  
- Standalone tools  
- Client projects

**How It Works:**

```
Template includes:
1. Version numbering options (semantic, WordPress, custom)
2. Changelog format examples (Keep a Changelog, Conventional Commits, custom)
3. Release checklist (customizable per project)
4. Deployment steps (links to external guides, not hardcoded)
5. Post-release tasks (announcement, tagging, etc.)
```

**`.github`\-Specific Variant: `.github/agents/release-agent.github.md`**

This agent is custom-built for `.github` repo:

```
Tightly integrated with:
1. Linear integration (fetch tickets, mark done)
2. Changelog recovery (merge missing entries)
3. Version bumping in package.json
4. GitHub releases API
5. CHANGELOG.md formatting (per this repo's standards)
6. PR labeling and milestone updates
7. Slack announcements
```

**Documentation:**

**File: `agents/README.md` — New Section**

```
## Release Agents

### For Most Projects: `release-management.agent.md`

Use this agent to:
- Plan and execute releases
- Generate changelogs from commit history
- Version your project
- Deploy to package registries or hosting

This agent is customizable for:
- Different version numbering schemes
- Different changelog formats
- Different deployment targets

Example: A WordPress plugin can customize this for WordPress.org deployment.

### For `.github` Repo: `.github/agents/release-agent.github.md`

The `.github` repo has a specialized release process involving:
- Changelog recovery from Linear tickets
- Complex version bumping logic
- GitHub releases synchronization
- Internal PR labeling

This agent is tightly coupled to `.github` and won't work for other projects.
If you need to implement a similar workflow for your project, start with
`release-management.agent.md` and customize it.
```

**Success Criteria:**

- ✅ WordPress project can use generic release agent  
- ✅ `.github` maintainer uses specialized agent  
- ✅ Future projects understand the pattern

---

### **Q12: Changelog agent — Generic or `.github`\-only?** {#q12:-changelog-agent-—-generic-or-.github-only?}

**My Answer (with your context):**

**Decision: `.github`\-only agent, generic recipe in cookbook.**

**Why `.github`\-Only:**

The changelog recovery process is **highly specific** to:

1. This repo's history (pre-2026 entries missing)  
2. Linear integration (tickets are the source of truth)  
3. Merge commit format (Ash Shaw's merge patterns)  
4. CHANGELOG.md structure (per this repo's conventions)

**Unlikely to be reusable**: Other projects might:

- Use GitHub PRs as changelog source (not Linear)  
- Use Keep a Changelog format (not custom format)  
- Not have missing entries to recover  
- Use automated tools (not manual recovery)

**File: `.github/agents/changelog-recovery.agent.md`**

Specialized for:

- Querying Linear API  
- Parsing merge commits  
- Filling gaps in CHANGELOG.md  
- Validating recovery completeness

**Generic Recipe: `cookbook/changelog-management.md`**

For other projects, document:

```
# Changelog Management

## Overview
A changelog documents what changed between versions.

## Approaches

### Approach 1: Automated from Commits
- Use Conventional Commits (`feat:`, `fix:`, etc.)
- Tools: standard-version, conventional-changelog
- Pros: Minimal manual work
- Cons: Requires discipline in commit messages

### Approach 2: Automated from PRs
- Tool reads merged PRs
- Creates changelog entries automatically
- Pros: Integrated with GitHub workflow
- Cons: Requires specific PR naming/labeling

### Approach 3: Manual with Template
- Template for each release
- Developers manually fill in changes
- Pros: Complete control, detailed notes
- Cons: Time-consuming, prone to omissions

### Approach 4: Recover Missing Entries (.github Pattern)
- See `.github/agents/changelog-recovery.agent.md` for `.github`'s approach
- Uses Linear integration + git history
- Only viable if you have similar data sources

## Recommendations
- **Small projects**: Approach 1 (Conventional Commits)
- **Teams using Linear**: Consider Approach 4 pattern
- **Mixed sources**: Approach 3 (manual template)
- **GitHub-only**: Approach 2 (PR-based)
```

**Documentation:**

**File: `.github/agents/README.md`**

```
## .github-Specific: Changelog Recovery

This agent recovers missing changelog entries from Linear tickets
and git merge history. It's specific to the `.github` repo.

If you need to recover missing changelogs:
1. See `cookbook/changelog-management.md` for approaches
2. Adapt the `.github` recovery pattern for your data sources
3. Contact @ash-shaw if you want to reuse the Linear integration
```

**Success Criteria:**

- ✅ `.github` has dedicated changelog recovery agent  
- ✅ Other projects know to customize the cookbook recipe  
- ✅ Reusability encouraged but not forced

---

### **Q13: Linting agents — Generic or repo-specific variants?** {#q13:-linting-agents-—-generic-or-repo-specific-variants?}

**My Answer (with your context):**

**Decision: Generic base agent \+ configurable rulesets.**

**Generic Agent: `agents/code-quality.agent.md`**

```
This agent handles:
1. Understanding project's linting setup (ESLint, Prettier, PHPCS, etc.)
2. Running linting checks
3. Proposing fixes
4. Integrating with CI/CD

Works with configurable rulesets (doesn't assume specific rules)
```

**Project-Specific Rulesets in `config/`:**

```
config/
  eslintrc.json                    ← Shared ESLint config
  prettier.json                    ← Shared Prettier config
  tsconfig.json                    ← TypeScript config
  phpcs.xml                        ← PHP Code Sniffer (for WordPress)
  commitlint.config.js             ← Commit message linting
  
.github/config/
  eslintrc-strict.json             ← Stricter rules for .github repo
  prettier-strict.json             ← Stricter Prettier for .github
```

**`.github` Stricter Variant: `.github/agents/repo-structure-linter.agent.md`**

```
Beyond code linting, this agent validates:
1. Folder structure compliance
2. File naming conventions
3. Frontmatter validation
4. Schema compliance
5. Documentation completeness
```

**How Developers Use It:**

**WordPress Plugin Developer:**

```
Running the code-quality agent...
→ Agent reads config/eslintrc.json
→ Runs ESLint with those rules
→ Suggests fixes
```

**`.github` Maintainer:**

```
Validating repo structure...
→ Uses .github/agents/repo-structure-linter.agent.md
→ Checks folders, file naming, schemas, docs
→ Ensures compliance
```

**Documentation:**

**File: `agents/README.md`**

```
## Code Quality Agent

Uses configurable linting rules stored in `config/`:
- JavaScript/TypeScript: `config/eslintrc.json`
- Formatting: `config/prettier.json`
- PHP/WordPress: `config/phpcs.xml`
- Commits: `config/commitlint.config.js`

You can customize the agent to use different rulesets for different projects.
```

**File: `.github/agents/README.md`**

```
## Repo Structure Linter

Validates `.github` repo structure including:
- Folder organization
- File naming conventions
- Frontmatter validation (agents, skills, docs)
- Schema compliance
- Documentation completeness

Not meant for external use; specific to `.github` repo standards.
```

**Success Criteria:**

- ✅ Generic linting agent works for any project with configurable rulesets  
- ✅ `.github` has stricter validation beyond code linting  
- ✅ Clear separation between generic and `.github`\-specific

---

### **Q14: Skills portability — Root or `.github/skills/`?** {#q14:-skills-portability-—-root-or-.github/skills/?}

**My Answer (with your context):**

**Decision: Root `skills/` for portable, `.github/skills/` for repo-specific.**

**Portable Skills in Root:**

```
skills/
  code-review/
    SKILL.md
    [supporting files]
  documentation/
    SKILL.md
  testing-strategy/
    SKILL.md
  deployment-checklist/
    SKILL.md
  wordpress-block-development/
    SKILL.md
  changelog-management/
    SKILL.md
```

**`.github`\-Specific Skills:**

```
.github/skills/
  changelog-entry-creation/
    SKILL.md
    ← Template for .github changelog entries
  issue-template-creation/
    SKILL.md
    ← Create GitHub issue templates
  pr-review-checklist/
    SKILL.md
    ← .github-specific PR review process
  release-readiness-audit/
    SKILL.md
    ← Audit before releasing .github updates
```

**Rationale:**

**Portable Skills** (root):

- Useful for any project  
- Generic guidance (not repo-specific)  
- Can be consumed by WordPress projects

**`.github` Skills**:

- Reference the `.github` repo's specific templates  
- Guide maintainers through `.github` processes  
- Not useful elsewhere

**How They're Used:**

**WordPress Project Developer:**

```
In Claude Code, asks for help with "code review"
→ Claude Code finds skills/code-review/SKILL.md
→ Skill provides generic code review checklist
→ Developer adapts for their project
```

**`.github` Maintainer:**

```
Need to create a changelog entry
→ Uses .github/skills/changelog-entry-creation/SKILL.md
→ Skill walks through the process
→ Creates entry in .github's specific format
```

**Documentation:**

**File: `skills/README.md`**

```
## Portable Skills

These skills are useful for any LightSpeed project.

### Available Skills
- **code-review/** — Checklist for reviewing code
- **documentation/** — Guidelines for writing documentation
- **testing-strategy/** — Approach to testing your project
- **deployment-checklist/** — Preparation for deployment
- **wordpress-block-development/** — Developing WordPress blocks
- **changelog-management/** — Managing your changelog

### Using a Skill
1. In Claude Code, select a skill from the sidebar
2. Follow the SKILL.md guidance
3. The skill will walk you through the process step-by-step

### Customizing a Skill
You can fork any skill for your project by copying it locally
and customizing it for your specific needs.
```

**File: `.github/skills/README.md`**

```
## .github-Specific Skills

These skills guide `.github` repo maintainers.

### Available Skills
- **changelog-entry-creation/** — Create entries in .github's CHANGELOG.md
- **issue-template-creation/** — Create GitHub issue templates
- **pr-review-checklist/** — Review PRs against .github standards
- **release-readiness-audit/** — Audit before releasing .github updates

These are specific to `.github` processes and not meant for external use.
```

**Success Criteria:**

- ✅ Portable skills are easily discoverable in root  
- ✅ WordPress projects can use generic skills  
- ✅ `.github` has specialized skills for maintainers  
- ✅ Clear separation of concerns

---

### **Q15: Agent versioning — Pinned versions or latest-only?** {#q15:-agent-versioning-—-pinned-versions-or-latest-only?}

**My Answer (with your context):**

**Decision: Latest-only with change documentation.**

**Why No Versioning:**

1. **Complexity**: Versioning adds v1/, v2/ directories, migration guides  
2. **Backward Compatibility**: Agents should be stable by default  
3. **Flexibility**: Breaking changes are rare; when they happen, document them  
4. **Scalability**: As team grows, versioning becomes maintenance burden

**Change Documentation:**

**File: `agents/CHANGELOG.md`**

```
# Agent Changelog

## [Unreleased]

### Changed
- release-management.agent.md: Added support for pre-release versions (1.0.0-beta)
- code-review.agent.md: Updated security review checklist for OWASP Top 10 2024

### Added
- code-quality.agent.md: New linting agent for multi-language projects

### Deprecated
- testing-strategy.agent.md: Manual test case writing; see automated-testing.agent.md instead

## [2026-07-24]

### Fixed
- code-review.agent.md: Fixed accessibility checklist link (was broken)

### Added
- changelog-management.agent.md: New agent for changelog management

### Changed
- release-management.agent.md: Simplified version numbering options
```

**Breaking Change Policy:**

When an agent has a **breaking change** (not backward-compatible):

1. **Document in agent's frontmatter:**

```
---
breaking_changes:
  - "2026-07-24: Changed changelog format from CSV to JSON. See migration guide."
migration_guide: "See ./migration-v2.md"
---
```

1. **Create migration file** (`agents/migration-v2.md`):

```
# Migrating from code-review v1 to v2

## What Changed
- Security checklist expanded from 5 to 8 items
- Some checks are now automated (not manual)

## Steps to Migrate
1. ...
2. ...
```

1. **Announce in changelog and docs**  

2. **Give consumers time**: No immediate cutoff; consumers decide when to upgrade

**Documentation:**

**File: `agents/README.md`**

```
## Keeping Up with Agent Changes

Agents are kept up-to-date as best practices evolve.

### How to Stay Current
1. Check `CHANGELOG.md` regularly for updates
2. Most updates are improvements; no action needed
3. If an agent has breaking changes, a migration guide is provided

### No Version Pinning
Agents don't use version numbers (v1.x, v2.x).
You always get the latest version.
If you need stability, fork the agent locally and pin to a specific commit.
```

**Success Criteria:**

- ✅ Agents remain stable without versioning complexity  
- ✅ Changes are documented in CHANGELOG.md  
- ✅ Breaking changes have migration guides  
- ✅ Consumers can find what changed easily

---

## **3\. SCHEMAS & VALIDATION** {#3.-schemas-&-validation}

### **Q16: Hidden vs. public folder — `.schemas/` or `schemas/`?** {#q16:-hidden-vs.-public-folder-—-.schemas/-or-schemas/?}

**My Answer (with your confirmation):**

**Decision: Move `.schemas/` → visible `schemas/` at root.**

**You Confirmed:** "Yes, `schemas/` makes sense for when we reference the .github repo inside WordPress developer workspaces."

**Detailed Reasoning:**

**Discoverability:**

- **Hidden `.schemas/`**: Developers don't see it in VSCode explorer  
- **Visible `schemas/`**: Right there in root, clearly a public asset

**Consistency:**

- Other major folders (`agents/`, `skills/`, `hooks/`) are not hidden  
- Schemas are equally important → should be visible

**Cross-Project Reference:**

- WordPress projects include `.github` in their workspace  
- Developers can directly reference `schemas/frontmatter/agent.schema.json`  
- Signals: "This is for you to use, not internal-only"

**Awesome Copilot Pattern Note:**

- Awesome Copilot uses `.schemas/` to hide implementation details  
- Your use case is different: schemas are reusable reference material  
- Visible folder makes sense

**Implementation:**

**Manual Move (you'll do this):**

```shell
# In .github repo:
mv .schemas/ schemas/

# Verify:
ls -d schemas/
find schemas -type f | head -5
```

**Then I'll:**

1. Update all script references from `.schemas` → `schemas`  
2. Update all documentation links  
3. Verify all validation scripts work

**File Structure After Move:**

```
schemas/
  README.md
  memory/                          (moved from .schemas/)
    memory-example-pack.schema.json
    memory-profile.schema.json
    memory-record.schema.json
    memory-registry.schema.json
    memory-snapshot.schema.json
```

**Documentation:**

**File: `schemas/README.md` (new)**

````
# Schemas

JSON Schema definitions for validating structure across LightSpeed.

## What Are Schemas?

Schemas define the **structure and format** of files:
- Agent specs (`.agent.md` files)
- Skill metadata
- Plugin manifests
- Memory records
- Frontmatter in documentation

## Organization

Schemas organized by **type**:

- `memory/` — Memory and session record schemas
- `frontmatter/` — (when created) Markdown frontmatter schemas
- `agents/` — (when created) Agent spec schemas
- `plugins/` — (when created) Plugin manifest schemas

## Using Schemas

### For Validation Scripts
Validation scripts use schemas to check file compliance:

```bash
node .github/scripts/validation/validate-frontmatter.js  # Uses schemas/
````

#### **For Developers**

If you're creating a new document type:

1. Check `schemas/` for existing definitions  
2. Follow the same format as similar files  
3. Update validation scripts if needed

#### **For Tools**

AI tools reference schemas in instructions:

- `.github/custom-instructions.md` → Links to schema definitions  
- `instructions/*.instructions.md` → References schemas for format guidance

#### **Schema Consolidation History**

**Date**: 2026-07-25  
**What changed**: Moved from `.schemas/` (hidden) to `schemas/` (visible)  
**Why**: Better discoverability for projects using `.github` as shared resource  
**Impact**: No functional change; all validation scripts updated to reference new location

See [Migration Guide](http://../docs/MIGRATION.md) for details.

```

**Success Criteria:**
- ✅ Schemas are visible and discoverable
- ✅ Developers can reference `schemas/` from WordPress projects
- ✅ Validation scripts all work correctly
- ✅ Documentation explains purpose and organization

---

### Q17: Schema scope — Used by `.github` only or all projects?

**My Answer (with your context):**

**Decision: Used by `.github` workflows + available for all projects.**

**Detailed Usage:**

**`.github` Workflows Use Schemas:**
1. `.github/workflows/template-enforcement.yml` → Validates issue/PR templates
2. `.github/workflows/frontmatter-validation.yml` → Validates doc frontmatter
3. `npm run validate:*` scripts → Validate agents, skills, plugins
4. Validation scripts in `.github/scripts/validation/` → Check structure

**WordPress Projects Can Use Schemas:**
1. Reference for understanding format requirements
2. Extend for their own custom schemas
3. Run validation locally (using LightSpeed's validation scripts or their own)

**Recommendation:**

Make schemas **visible and documented** so WordPress projects can:
- Understand what `.agent.md` files should look like
- See memory schema format (if they use memory module)
- Create their own document types following the pattern

**File Organization:**

schemas/ README.md                        ← Navigation and usage

memory/                          ← Memory schemas (current content) memory-example-pack.schema.json memory-profile.schema.json memory-record.schema.json memory-registry.schema.json memory-snapshot.schema.json

(Future: as more schema types are needed) frontmatter/                     ← (to create) Markdown frontmatter agent.schema.json documentation.schema.json plugin.schema.json

github/                          ← (to create) GitHub-native issue.schema.json pr.schema.json label.schema.json

```

#### **If You Want to Understand the Format**

Look at the relevant schema file:

- Creating a new `.agent.md`? See `frontmatter/agent.schema.json` (when available)  
- Creating memory modules? See `memory/memory-record.schema.json`  
- Creating a plugin? See `plugins/plugin.schema.json` (when available)

#### **If You Want to Validate Your Own Files**

You can use JSON Schema validators:

- VS Code extension: JSON Schema Validator  
- Command line: `ajv-cli`  
- Online: `jsonschemavalidator.net`

Link to your schemas:

```

```

**Success Criteria:**

- ✅ Schemas are stored in visible location  
- ✅ Both `.github` and WordPress projects can reference them  
- ✅ Documentation explains how to use schemas  
- ✅ Validation scripts work for both `.github` and external users

---

### **Q18: Schema organization — By type, domain, or tool?** {#q18:-schema-organization-—-by-type,-domain,-or-tool?}

**My Answer (with your context):**

**Decision: By type (primary), with domain notes in each schema's comment.**

**Rationale:**

**By Type is Clearer:**

- Developer searching: "I need the frontmatter schema" → Look in `frontmatter/`  
- Developer searching: "I need the agent schema" → Look in `agents/`  
- Natural file explorer navigation

**Domain Notes Keep Context:**

- Each schema file can document its scope in comments  
- Example: agent.schema.json header explains it's used by both `.github` and WordPress projects

**Avoids Duplication:**

- No separate `schemas/github/` and `schemas/wordpress/` copies  
- Single source of truth  
- Easier to maintain

**Proposed Structure:**

```
schemas/
  README.md
  
  memory/                          ← Type: Memory records
    memory-example-pack.schema.json
    memory-profile.schema.json
    memory-record.schema.json
    memory-registry.schema.json
    memory-snapshot.schema.json
  
  frontmatter/                     ← Type: Document frontmatter
    (future) agent.schema.json
    (future) documentation.schema.json
    (future) plugin.schema.json
    (future) skill.schema.json
  
  github/                          ← Type: GitHub-native assets
    (future) issue.schema.json     ← .github-only
    (future) pr.schema.json        ← .github-only
    (future) label.schema.json     ← .github-only
  
  plugins/                         ← Type: Plugin manifests
    (future) plugin.schema.json    ← Shared by GitHub + WordPress plugins
  
  workflows/                       ← Type: Workflow definitions
    (future) agentic-workflow.schema.json  ← Portable
```

**Each Schema File Includes Domain Notes:**

**Example: `schemas/frontmatter/agent.schema.json` header**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent Spec Schema",
  "description": "Schema for .agent.md files. Used by both .github repo and WordPress projects.",
  "scope": "Shared across all projects",
  "examples": [
    "agents/code-review.agent.md",
    ".github/agents/release-agent.github.md"
  ],
  // ... rest of schema
}
```

**Example: `schemas/github/issue.schema.json` header**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GitHub Issue Template Schema",
  "description": "Schema for .github/ISSUE_TEMPLATE/*.md files.",
  "scope": ".github-only",
  "examples": [
    ".github/ISSUE_TEMPLATE/01-bug.md"
  ],
  // ... rest of schema
}
```

**Documentation:**

**File: `schemas/README.md` — Organization Section**

```
## How Schemas Are Organized

Schemas are organized by **type** (what they validate), with domain notes:

| Folder | Type | Scope | Used By |
| --- | --- | --- | --- |
| `memory/` | Memory records | Shared | All projects with memory modules |
| `frontmatter/` | Markdown frontmatter | Shared | `.github` + WordPress projects |
| `github/` | GitHub-native files | `.github`-only | `.github` workflows |
| `plugins/` | Plugin manifests | Shared | All plugin definitions |
| `workflows/` | Workflow definitions | Shared | Agentic workflow files |

Each schema file includes:
- `title` — Human-readable name
- `description` — What it validates
- `scope` — Is it shared or project-specific?
- `examples` — Where it's used

This approach makes it easy to find the schema you need while keeping shared
and project-specific definitions in one location (avoiding duplication).
```

**Success Criteria:**

- ✅ Organization by type is intuitive and discoverable  
- ✅ Domain notes in each schema clarify scope  
- ✅ No schema duplication  
- ✅ Easy to locate schemas by file type

---

### **Q19: Root `schema/` folder — Consolidate with `.schemas/`?** {#q19:-root-schema/-folder-—-consolidate-with-.schemas/?}

**My Answer (with your clarification):**

**Your Data:**

- `.schemas/` contains: 6 files (memory schemas only)  
- `schema/` contains: 25+ files (comprehensive schema collection)  
- They are **NOT duplicates** — `schema/` is more complete

**Decision: Consolidate into single `schemas/` folder, archive old locations.**

**Consolidation Strategy:**

**Step 1: Inventory (You'll Do)**

Current state:

```
.schemas/memory/
  ├── memory-example-pack.schema.json
  ├── memory-profile.schema.json
  ├── memory-record.schema.json
  ├── memory-registry.schema.json
  └── memory-snapshot.schema.json

schema/
  ├── agent-capability-manifest.schema.json
  ├── agent-config.schema.json
  ├── agent-plugin-binding.schema.json
  ├── branding-schema.json
  ├── changelog.schema.json
  ├── coderabbit-overrides.v2.json
  ├── examples/
  ├── footer-config.schema.json
  ├── frontmatter.schema.json
  ├── memory/ (duplicates .schemas/memory/)
  ├── multi-provider-agent.schema.json
  ├── plugin-manifest.schema.json
  ├── project-fields.schema.json
  ├── provider-config.schema.json
  ├── quirky-footers.schema.json
  ├── schema-registry.json
  ├── skill-agent-config.schema.json
  ├── skill-metadata.schema.json
  └── version.schema.json
```

**Step 2: Consolidate Into `schemas/` (You'll Do Manually)**

Since `.schemas/memory/` and `schema/memory/` contain the same files, we just need to move everything from `schema/` to `schemas/`:

```shell
# The files in .schemas/memory/ and schema/memory/ are the same, so we can just move everything from schema/

# Move non-memory files from schema/ to schemas/
mv schema/agent-*.json schemas/
mv schema/branding-schema.json schemas/
mv schema/changelog.schema.json schemas/
mv schema/coderabbit-overrides.v2.json schemas/
mv schema/examples/ schemas/
mv schema/footer-config.schema.json schemas/
mv schema/frontmatter.schema.json schemas/
mv schema/multi-provider-agent.schema.json schemas/
mv schema/plugin-manifest.schema.json schemas/
mv schema/project-fields.schema.json schemas/
mv schema/provider-config.schema.json schemas/
mv schema/quirky-footers.schema.json schemas/
mv schema/schema-registry.json schemas/
mv schema/skill-*.json schemas/
mv schema/version.schema.json schemas/
mv schema/README.md schemas/  # Move the README too

# Memory/ is already in .schemas/memory/, and the files are identical
# So we can leave the schema/memory/ duplicate for now
# (we'll archive the old schema/ folder after)

# Verify the moves
ls schemas/ | wc -l  # Should show all non-memory files
ls -la schemas/memory/ | head -5  # Should show memory files

# Now remove the old schema/ folder
rm -rf schema/
```

**Step 3: Archive `.schemas/` (You'll Do Manually)**

Once `schemas/` has everything, archive the old `.schemas/`:

```shell
# Move .schemas/ to archive location
mkdir -p .github/tmp/schema-archive
mv .schemas/ .github/tmp/schema-archive/dot-schemas-backup

# Verify archives exist
ls -la .github/tmp/schema-archive/
```

**Step 4: Update References (I'll Do)**

I'll then:

1. Grep for all references to `schema/` and `.schemas/`  
2. Update them to `schemas/`  
3. Update validation scripts  
4. Update documentation  
5. Run validation to confirm everything works

**Documentation:**

**File: `.github/projects/active/repo-restructuring-2026-07-25/SCHEMA_CONSOLIDATION_PLAN.md`**

```
# Schema Consolidation Plan

## Consolidation Decision

**Original state:**
- `.schemas/` (hidden): 6 files (memory schemas)
- `schema/` (root): 25+ files (comprehensive collection)
- `schema/memory/` (duplicate): Same files as `.schemas/memory/`

**Action:**
1. Move all files from `schema/` to `schemas/`
2. Keep memory schemas (from either source, they're identical)
3. Remove `.schemas/` (hidden)
4. Remove `schema/` (root)
5. Keep only `schemas/` (visible root folder)

## Result

All schemas in one location:
```

schemas/ memory/ (all memory schemas) agent-\*.json frontmatter.schema.json plugin-manifest.schema.json etc.

```

## Validation

After consolidation:
- `npm run validate:*` — All validation scripts pass
- `npm run validate:memory` — Memory schemas work
- `npm run validate:agents` — Agent schemas work
```

**Success Criteria:**

- ✅ All schema files consolidated into single `schemas/` folder  
- ✅ No duplicates  
- ✅ Old folders archived safely (not deleted)  
- ✅ All validation scripts updated and working  
- ✅ All documentation updated with new path

---

### **Q20: Schema reference updates — Which files reference schema paths?** {#q20:-schema-reference-updates-—-which-files-reference-schema-paths?}

**My Answer (with your data):**

**Files That Reference Schemas:**

Based on your `npm run` output, these scripts reference schemas:

1. **`scripts/validation/validate-json.js`** (now `.github/scripts/validation/validate-json.js`)  

   - Likely references `schema/**/*.json`  
   - Will need to update to `schemas/**/*.json`

2. **`scripts/validation/validate-frontmatter.js`** (now `.github/scripts/validation/validate-frontmatter.js`)  

   - References `../../schema/frontmatter.schema.json`  
   - Will need to update to `../../../schemas/frontmatter.schema.json`

3. **`package.json` npm scripts**  

   - Uses glob patterns like `schema/**/*.json`  
   - Will update to `schemas/**/*.json`

4. **`.github/workflows/*.yml`** (any workflows)  

   - May reference schema paths in validation steps  
   - Will audit and update

5. **`docs/**/*.md`** (documentation files)  

   - May link to schema files  
   - Will update all links to point to `schemas/`

6. **`agents/**/*.md` and `skills/**/*.md`** (if they reference schemas)  

   - Will check and update

**Audit Process (I'll Do):**

```shell
# Find all references to old paths
echo "=== References to 'schema/' ===" && \
  grep -r "schema/" . --include="*.js" --include="*.json" --include="*.yml" --include="*.yaml" --include="*.md" \
    --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.github/tmp | head -50

echo "=== References to '.schemas' ===" && \
  grep -r "\.schemas" . --include="*.js" --include="*.json" --include="*.yml" --include="*.yaml" --include="*.md" \
    --exclude-dir=.git --exclude-dir=node_modules

echo "=== Schema glob patterns in package.json ===" && \
  grep -E "schema/\*\*|\.schemas/\*\*" package.json
```

**Update Plan (I'll Execute):**

For each file found:

1. Determine correct new path  
2. Update in-place  
3. Re-run validation scripts to confirm  
4. Update documentation links

**Success Criteria:**

- ✅ All script references updated  
- ✅ All documentation links updated  
- ✅ All npm scripts updated  
- ✅ All validation scripts pass with new paths  
- ✅ No broken references remain

---

### **Q21: AI tool schema consumption — Direct or internal-only?** {#q21:-ai-tool-schema-consumption-—-direct-or-internal-only?}

**My Answer (confirmed by context):**

**Decision: Internal-only (validation scripts \+ documentation reference)**

**How AI Tools Actually Use Schemas:**

1. **Validation Scripts** (Internal)  

   - `.github/scripts/validation/*.js` read JSON schemas  
   - Check file compliance against schemas  
   - Report validation errors

2. **Documentation Reference** (For Humans)  

   - Instructions in `.github/custom-instructions.md` reference schemas  
   - Links to schema files help developers understand expected format  
   - AI reads these links but doesn't directly consume the schema JSON

3. **AI Tools DON'T**  

   - Directly parse JSON Schema  
   - Auto-validate based on schema  
   - Infer structure from schema definitions

**Example: How Claude Code Uses Schemas**

```
Developer: "Create a new agent"

Claude Code:
1. Reads .github/custom-instructions.md
2. Sees: "Agent specs must follow schemas/frontmatter/agent.schema.json"
3. Opens schema file as reference
4. Generates agent with matching structure
5. Human then runs `npm run validate:agents` to check compliance
```

**Schema in `.github/custom-instructions.md`:**

```
## Creating Agents

Agent specs must follow the structure defined in `schemas/frontmatter/agent.schema.json`.

Key fields:
- `title` — Agent name
- `description` — What the agent does
- `scope` — "shared" or ".github-only"
- `instructions` — Detailed instructions

See existing agents in `agents/` for examples.
```

**No Direct Schema Consumption:**

We don't:

- Upload schema files to Claude Code as "validated types"  
- Configure Anthropic API to enforce schemas  
- Pass schemas to AI models for format validation

Instead:

- Documentation links to schemas for reference  
- Validation happens post-generation (npm scripts)  
- Human verifies compliance before committing

**Documentation:**

**File: `docs/schema-validation.md` (new)**

````
# Schema Validation

## What Are Schemas Used For?

Schemas define the structure of files in the LightSpeed ecosystem.
They're used by:

1. **Validation Scripts** — Check that files match expected structure
2. **Documentation** — Help developers understand expected format
3. **IDE Extensions** — (Future) May provide autocomplete based on schemas

Schemas are NOT directly consumed by Claude Code or GitHub Copilot.

## How Validation Works

After you create a file (agent, skill, etc.):

```bash
npm run validate:agents        # Check agent specs
npm run validate:skills        # Check skill specs
npm run validate:plugins       # Check plugin manifests
npm run validate:memory        # Check memory records
````

Validation scripts read schemas and compare your files against them.

#### **If Validation Fails**

Validation output tells you what's wrong:

```
❌ Field 'title' is required in agents/my-agent.agent.md
✅ Field 'scope' is valid
❌ Field 'instructions' exceeds maximum length (5000 chars)
```

Fix the issues and re-run validation.

#### **Creating Your Own Schema**

If you need to validate custom files:

1. Create a schema file in `schemas/yourtype/yourschema.schema.json`  
2. Create a validation script in `.github/scripts/validation/validate-yourtype.js`  
3. Reference the schema in npm scripts  
4. Document in `schemas/README.md`

See existing schemas for examples.

```

**Success Criteria:**
- ✅ Schemas are clearly for internal validation, not AI consumption
- ✅ Documentation explains how validation works
- ✅ Developers understand the validation process
- ✅ No false expectations about AI using schemas directly

---

## 4. FOLDER REORGANIZATION — SCOPE & INTENT

[Continuing in part 2 due to length...]

---

**Note:** This document is intentionally long and detailed. It has been split across multiple files for readability. See the accompanying "DETAILED-RESTRUCTURING-PLAN.md" for the comprehensive implementation plan covering all phases.
```

---

## **4\. FOLDER REORGANIZATION — SCOPE & INTENT** {#4.-folder-reorganization-—-scope-&-intent}

### **Q22: Root cleanup philosophy — What should remain in root?** {#q22:-root-cleanup-philosophy-—-what-should-remain-in-root?}

**My answer:** **Only reusable assets \+ high-level project files.**

**Proposed root structure:**

```
.github/                           # GitHub-native: templates, workflows, labels
agents/                            # Portable, multi-file agent specs
skills/                            # Portable, self-contained skills
hooks/                             # Portable pre-commit, commit, test hooks
instructions/                      # Org-wide standards (coding, a11y, docs)
ai/                                # AI tool configs (Claude, Gemini, RUNNERS)
config/                            # Shared configs (ESLint, Prettier, etc.)
cookbook/                          # Recipes, playbooks, implementation guides
docs/                              # Human-readable docs (org-wide + `.github` refs)
plugins/                           # Plugin specs (for Claude Code, Copilot, etc.)
prompts/                           # Reusable prompts across projects
schemas/                           # JSON schemas for validation
workflows/                         # Portable agentic workflows (not GitHub Actions)

.gitignore, .gitattributes, ...    # Root config files
CLAUDE.md, README.md, LICENSE.md    # Root documentation

# NOT in root (move to .github/):
scripts/                           → .github/scripts/
tmp/                               → .github/tmp/
memory/                            → .github/memory/
website/                           → .github/website/
config/ (repo-specific)            → .github/config/ (GitHub labels, issue types)
reports/                           → .github/reports/
projects/                          → .github/projects/
tests/                             → .github/__tests__/ or __tests__/ per-folder
```

**Rationale:**

- **Root** \= what WordPress projects consume (agents, skills, hooks, instructions, config, docs).  
- **`.github/`** \= what's internal to this repo (workflows, scripts, reports, temporary files).

---

### **Q23: Reports & Projects move — Manual moves, then what?** {#q23:-reports-&-projects-move-—-manual-moves,-then-what?}

**My answer:** **Yes, move manually. I'll update indexes and cross-links after.**

**Recommendation:**

1. **Manual moves** (you do these):

```shell
mv reports/ .github/reports/mv projects/ .github/projects/
```

1. **I'll update**:  
   - `.github/reports/README.md` (if it exists, or create one)  
   - `.github/projects/README.md` (catalog of active projects)  
   - Root `README.md` (remove links to `reports/` and `projects/`, link to `.github/` versions instead)  
   - Any scripts/workflows that reference the old paths

---

### **Q24: Scripts folder — Root or `.github/scripts/`?** {#q24:-scripts-folder-—-root-or-.github/scripts/?}

**My answer:** **Move to `.github/scripts/`.**

**Reasoning:**

- Scripts in this repo are *tooling for the `.github` repo* (validation, formatting, automation).  
- WordPress projects don't run these scripts (they have their own).  
- Hiding them under `.github/` reduces clutter in root, makes intent clearer.

**Recommendation:**

1. **Manual move**:

```shell
mv scripts/ .github/scripts/
```

1. **I'll update**:  
   - `package.json` scripts (paths like `npm run validate:frontmatter` → `.github/scripts/validation/validate-frontmatter.js`)  
   - `.github/workflows/` (path references to scripts)  
   - `docs/` files that reference script locations  
   - Root `README.md` (link to `.github/scripts/README.md` for technical maintainers)

---

### **Q25: Config folder — Root or `.github/config/`?** {#q25:-config-folder-—-root-or-.github/config/?}

**My answer:** **Split it:**

- **Portable configs** (ESLint, Prettier, TypeScript) → root `config/`  
- **GitHub-native configs** (labels, issue types) → `.github/config/`

**Reasoning:**

- WordPress projects benefit from shared ESLint/Prettier configs.  
- GitHub labels and issue types are `.github`\-specific (other repos have different labels).

**Recommendation:**

```
config/                           # Portable configs
  eslintrc.json
  prettier.json
  tsconfig.json
  commitlint.config.js

.github/config/                   # GitHub-native configs
  labels.yml
  issue-types.yml
  auto-labeler.yml
```

---

### **Q26: Website folder — `.github/website/` and reconfigure workflows?** {#q26:-website-folder-—-.github/website/-and-reconfigure-workflows?}

**My answer:** **Yes, move to `.github/website/`, reconfigure workflows.**

**Reasoning:**

- The website documents *this repo* (not shared across projects).  
- It's built by `.github` workflows (likely GitHub Pages or Netlify).  
- Hiding it under `.github/` clarifies scope.

**Recommendation:**

1. **Manual move**:

```shell
mv website/ .github/website/
```

1. **I'll update**:  
   - `.github/workflows/` (paths to website source files, build output)  
   - Root `README.md` (remove link to `website/`, add "See the [documentation site](https://claude.ai/epitaxy/link)")  
   - `.github/website/README.md` (if it exists) or create one explaining the website architecture

---

### **Q27: Hooks folder — Root or `.github/hooks/`?** {#q27:-hooks-folder-—-root-or-.github/hooks/?}

**My answer:** **Keep in root `hooks/`.**

**Reasoning:**

- Hooks are *reusable across all projects* (pre-commit, commit-msg, post-checkout).  
- WordPress projects will reference `.github/hooks/` via the workspace setup.  
- Hiding under `.github/` would make them harder to discover.

**Recommendation:**

- Keep `hooks/` at root.  
- Document in `hooks/README.md`:

   These hooks are portable and can be used by any LightSpeedWP project. See [VSCode Workspace Setup](https://claude.ai/docs/vscode-workspace-setup.md) for installation instructions.

---

### **Q28: Tests folder — `tests/` or `__tests__/`? Root or `.github/`?** {#q28:-tests-folder-—-tests/-or-**tests**/?-root-or-.github/?}

**My answer:** **Dual structure:**

- **Root `__tests__/`** for repo-wide unit tests (validation scripts, shared utilities).  
- **`.github/__tests__/`** for `.github`\-specific integration tests (workflow behavior, agent output validation).  
- **Jest standard**: Use `__tests__/` for unit tests near source; keep `tests/` for integration/e2e (if separate).

**Reasoning:**

- Jest convention is `__tests__/` (discoverable by IDE, clear intent).  
- Splitting by scope (root vs. `.github/`) mirrors folder organization.  
- Bash tests can be in `__tests__/` or `tests/e2e/` (jest-cli doesn't run bash by default, but you can add a script).

**Recommendation:**

```
__tests__/                    # Unit tests (run via jest/npm test)
  validation/
    frontmatter.test.js
    agents.test.js
  utils/
    path-helpers.test.js

.github/__tests__/            # Integration tests for .github workflows
  agents/
    release-agent.test.js
  workflows/
    labeler.test.js

scripts/bash-tests/ (or .github/tests/bash/) # Bash tests (run separately)
  validate-branch-name.sh
  test-script.sh
```

---

### **Q29: Memory & tmp folders — Root, `.github/`, or gitignored?** {#q29:-memory-&-tmp-folders-—-root,-.github/,-or-gitignored?}

**My answer:** **Move to `.github/`, and both should be `.gitignore`d (local-only).**

**Reasoning:**

- `memory/` and `tmp/` are *session-specific*, *user-specific*, and *not sharable*.  
- They pollute git history if not ignored.  
- Moving to `.github/` clarifies they're internal to this repo.

**Recommendation:**

1. **Manual moves**:

```shell
mkdir -p .github/mv memory/ .github/memory/mv tmp/ .github/tmp/
```

1. **`.gitignore` updates**:

```
.github/memory/.github/tmp/
```

1. **Create templates** (so the folders exist in git):

```
.github/memory/.gitkeep.github/tmp/.gitkeep
```

1. **Update docs** to reference `.github/memory/` and `.github/tmp/` instead of root.

---

## **5\. VSCODE WORKSPACE SETUP** {#5.-vscode-workspace-setup}

### **Q30: Workspace config location — Where should setup docs/sample files live?** {#q30:-workspace-config-location-—-where-should-setup-docs/sample-files-live?}

**My answer:** **Three-part structure:**

1. **Docs**: `docs/vscode-workspace-setup.md` (step-by-step guide for all developers)  
2. **Sample workspace file**: `.github/lightspeed-dev.code-workspace` (template to copy/customize)  
3. **Setup script**: `.github/scripts/setup-vscode-workspace.sh` (automated setup for new developers)

**Reasoning:**

- Docs in `docs/` are easily discoverable.  
- Sample `.code-workspace` in `.github/` clarifies it's repo-specific.  
- Setup script automates repetitive steps (install extensions, clone repos, configure git).

**Recommendation:**

- Create `docs/vscode-workspace-setup.md` with:

````
# VSCode Workspace Setup Guide

## Quick Start (Automated)
```bash
cd .github
./scripts/setup-vscode-workspace.sh
````

-
  **Manual Setup**

  1. Clone this repo and your WordPress project(s)  
  2. Copy `.github/lightspeed-dev.code-workspace` to your workspace directory  
  3. Open the `.code-workspace` file in VSCode  
  4. Install Claude Code plugin (if desired)  
  5. Run `npm ci` in this `.github` repo ...

```

```

---

### **Q31: Shared VS settings — Which settings are shared?** {#q31:-shared-vs-settings-—-which-settings-are-shared?}

**My answer:** **Share recommended settings in `.github/.vscode/settings.json`, document in `.github/.vscode/README.md`.**

**Shared settings** (checked in, apply to all developers on this repo):

- ESLint formatting rules  
- Prettier config  
- File association (e.g., `*.md` → Markdown, `*.agent.md` → YAML with custom syntax)  
- Search exclude patterns (ignore `node_modules`, `.git`, `tmp/`)  
- Tab size, line endings (LF), charset (UTF-8)

**Personal settings** (`.gitignore`d, per-developer):

- Theme (light/dark)  
- Font size, font family  
- Cursor style  
- Extension settings (Claude Code, GitHub Copilot API keys, etc.)

**Recommendation:**

```
.github/.vscode/
  settings.json (shared, checked in)
  extensions.json (recommended extensions)
  launch.json (debug configs, checked in)
  README.md (explanation of settings and what to customize)
```

Create `.github/.vscode/settings.local.json` in `.gitignore` for personal overrides:

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "Menlo",
  "workbench.colorTheme": "One Dark Pro"
}
```

---

### **Q32: Extensions & plugins — Recommend, auto-install, or provide scripts?** {#q32:-extensions-&-plugins-—-recommend,-auto-install,-or-provide-scripts?}

**My answer:** **Recommend in `extensions.json`, provide install script for automated setup.**

**Reasoning:**

- VSCode doesn't auto-install extensions (privacy/security).  
- But `extensions.json` shows a banner suggesting recommended extensions.  
- Install scripts make onboarding faster.

**Recommendation:**

1. **`.github/.vscode/extensions.json`**:

```json
{
  "recommendations": [
    "anthropic.claude",
    "GitHub.Copilot",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.makefile-tools"
  ]
}
```

1.
   **`.github/scripts/install-extensions.sh`**:

```shell
#!/bin/bash

EXTENSIONS=(
  "anthropic.claude"
  "GitHub.Copilot"
  "esbenp.prettier-vscode"
  "dbaeumer.vscode-eslint"
  "ms-vscode.makefile-tools"
)

for ext in "${EXTENSIONS[@]}"; do
  code --install-extension "$ext"
done
```

1.
   **`.github/scripts/setup-vscode-workspace.sh`** calls this script as part of setup.

---

### **Q33: New developer onboarding — Script, checklist, or both?** {#q33:-new-developer-onboarding-—-script,-checklist,-or-both?}

**My answer:** **Both: Comprehensive script \+ manual checklist for clarity.**

**Reasoning:**

- Scripts reduce human error (typos, missed steps).  
- Checklists help developers understand *what's happening* and *why*.

**Recommendation:**

**.github/scripts/setup-vscode-workspace.sh** (automated):

```shell
#!/bin/bash
set -e

echo "🚀 LightSpeed VSCode Workspace Setup"

# 1. Check prerequisites
echo "✓ Checking Node.js..."
node -v

# 2. Install npm dependencies
echo "✓ Installing npm dependencies..."
npm ci

# 3. Install VSCode extensions
echo "✓ Installing recommended VSCode extensions..."
code --install-extension anthropic.claude
code --install-extension GitHub.Copilot
# ... other extensions

# 4. Create symbolic links (if needed)
# ... link shared configs from root to project

# 5. Setup git hooks
echo "✓ Setting up git hooks..."
npm run setup:hooks

# 6. Validate setup
echo "✓ Running validation..."
npm run validate:frontmatter

echo "✅ Setup complete! Open lightspeed-dev.code-workspace in VSCode."
```

**docs/vscode-workspace-setup.md** (manual checklist):

```
## VSCode Workspace Setup Checklist

- [ ] Prerequisites: Node.js v18+, VSCode, git
- [ ] Clone `.github` repo and WordPress project(s)
- [ ] Run `.github/scripts/setup-vscode-workspace.sh` OR follow manual steps below
- [ ] Open `.github/lightspeed-dev.code-workspace` in VSCode
- [ ] Install Claude Code plugin (if desired for AI features)
- [ ] Configure GitHub token (Settings > GitHub > Token)
- [ ] Run `npm run validate:*` to test setup

### If script fails:
1. Check error message (printed to console)
2. Manually install dependencies: `npm ci`
3. Install extensions individually: `code --install-extension <name>`
4. Rerun script: `.github/scripts/setup-vscode-workspace.sh`
```

---

### **Q34: Plugin configuration — `.github/config/plugins/` or `plugins/` root?** {#q34:-plugin-configuration-—-.github/config/plugins/-or-plugins/-root?}

**My answer:** **Split:**

- **Plugin specs** (definitions, metadata) → `plugins/` root (portable across projects)  
- **Plugin configs** (Claude Code API keys, settings) → `.github/config/plugins/` (`.github`\-specific, can be templated)

**Reasoning:**

- A plugin spec is *reusable* (e.g., "here's how to set up the linting plugin").  
- A plugin config is *instance-specific* (e.g., "here's the Claude Code API key for this repo's setup").

**Recommendation:**

```
plugins/                           # Plugin specs (portable)
  README.md
  claude-code-linting-plugin.yml
  github-copilot-config-plugin.yml

.github/config/plugins/            # Plugin configs (`.github`-specific)
  claude-code-setup.sh (install script)
  copilot-config.json (example config)
  setup-plugins.md (instructions)
```

---

### **Q35: Workspace-level `.code-workspace` file — Template, generated, or committed?** {#q35:-workspace-level-.code-workspace-file-—-template,-generated,-or-committed?}

**My answer:** **Committed template, customized per developer.**

**Reasoning:**

- Template in git helps new developers get started (copy and customize).  
- Not auto-generated (too complex, dependency on local filesystem paths).  
- Each developer customizes for their own projects.

**Recommendation:**

- **`.github/lightspeed-dev.code-workspace`** (committed):

```json
{  "folders": [    {      "path": ".",      "name": ".github (LightSpeed Control Plane)"    },    {      "path": "../wordpress-plugin-example",      "name": "WordPress Plugin Example"    }  ],  "settings": {    "search.exclude": { "**/node_modules": true },    "files.exclude": { "**/.git": true }  }}
```

- Developers copy this to their local workspace directory (e.g., `~/dev/lightspeed-workspace.code-workspace`) and customize folder paths.

---

### **Q36: Credential & auth handling — How should setup guide handle tokens?** {#q36:-credential-&-auth-handling-—-how-should-setup-guide-handle-tokens?}

**My answer:** **Document token setup, don't commit secrets.**

**Recommendation:**

In `docs/vscode-workspace-setup.md`:

```
## Credentials & Authentication

### GitHub Personal Access Token (PAT)
1. Go to https://github.com/settings/tokens
2. Create a new token with `repo` and `read:user` scopes
3. Copy the token
4. In VSCode: Settings > GitHub > Token, paste your token

### Anthropic API Key (for Claude Code)
1. Get your key from https://console.anthropic.com
2. In Claude Code: Settings > API Key, paste your key
3. (Or set `ANTHROPIC_API_KEY` environment variable)

### Linear API Key (for Linear integration)
1. Get your key from https://linear.app/settings/api
2. In VSCode: Create `.github/.env.local` (ignored by git)
3. Add: `LINEAR_API_KEY=<your-key>`

⚠️ **NEVER commit `.env.local` or API keys to git!**
```

Create `.github/.env.example`:

```
ANTHROPIC_API_KEY=sk-xxx...
LINEAR_API_KEY=lin_xxx...
GITHUB_TOKEN=ghp_xxx...
```

---

### **Q37: First-run experience — What should developers do on first run?** {#q37:-first-run-experience-—-what-should-developers-do-on-first-run?}

**My answer:** **Install dependencies, run validation, configure optional tools.**

**Recommendation:**

`.github/scripts/setup-vscode-workspace.sh` automates:

1. ✅ Check prerequisites (`node -v`, `git --version`)  
2. ✅ Install dependencies (`npm ci`)  
3. ✅ Install VSCode extensions  
4. ✅ Setup git hooks (`npx husky install` or equivalent)  
5. ✅ Run validation (`npm run validate:frontmatter`, `npm run lint:md`)  
6. ⚠️ *Prompt* for optional tokens (GitHub PAT, Anthropic key) but don't require them  
7. ✅ Create `.env.local` template if needed

Manual steps (documented but not automated):

- Open `.code-workspace` in VSCode  
- Configure GitHub Copilot (if desired)  
- Clone required submodules (if any)

---

## **6\. PLUGINS & EXTERNAL AI TOOLS** {#6.-plugins-&-external-ai-tools}

### **Q38: Plugin adoption strategy — Phased rollout or all-at-once?** {#q38:-plugin-adoption-strategy-—-phased-rollout-or-all-at-once?}

**My answer:** **Phased approach:**

**Phase 1 (Aug 2026\)**: Early adopters (core maintainers)

- You \+ 1-2 core maintainers install plugins manually.  
- Provide setup docs and troubleshooting guide.  
- Gather feedback on plugin UX, missing features.

**Phase 2 (Sept 2026\)**: Contributor tier

- Provide automated setup script (`.github/scripts/setup-plugins.sh`).  
- Publish blog post or Slack announcement explaining benefits.  
- Host optional "plugin setup office hours" to help contributors install.

**Phase 3 (Oct 2026\)**: Full rollout

- Plugins are default recommendation in `docs/vscode-workspace-setup.md`.  
- New developers see plugin setup as part of onboarding.

**Reasoning:**

- Early feedback prevents bad defaults.  
- Contributors get time to adapt before full rollout.  
- Documentation improves as you discover pain points.

---

### **Q39: Multi-tool strategy — Standardize on one or support all four?** {#q39:-multi-tool-strategy-—-standardize-on-one-or-support-all-four?}

**My answer:** **Support all four, but tier by complexity.**

**Tier 1 (Recommended)**: Claude Code \+ GitHub Copilot

- Most powerful, best for LightSpeed's custom agents and skills.  
- Documented as the default.

**Tier 2 (Optional)**: Codex (OpenAI's plugin framework)

- Useful for teams already in OpenAI ecosystem.  
- Less documentation initially (can add later).

**Tier 3 (Emerging)**: Gemini

- Google's AI platform (less mature for plugins).  
- Monitor for future adoption.

**Recommendation:**

- Document Tier 1 fully in `docs/vscode-workspace-setup.md`.  
- Create reference docs for Tier 2 and 3 in `docs/plugin-setup-advanced.md`.  
- Link to official docs for each tool (avoid duplicating maintenance burden).

---

### **Q40: Plugin registry / discovery — Catalog or checklist?** {#q40:-plugin-registry-/-discovery-—-catalog-or-checklist?}

**My answer:** **Catalog \+ role-based checklist.**

**Recommendation:**

**`plugins/README.md`** (catalog of all plugins):

```
# LightSpeed Plugins

## Claude Code Plugins
| Plugin | Purpose | Install |
| --- | --- | --- |
| Linting Plugin | Real-time code quality checks | [Install](claude-code-linting-plugin.yml) |
| Agent Runner | Execute custom agents in Claude Code | [Install](claude-code-agent-runner.yml) |

## GitHub Copilot Extensions
| Extension | Purpose | Install |
| --- | --- | --- |
| Issue Template Helper | Auto-fill issue templates | [Install](github-copilot-issue-helper.yml) |
| PR Review Assistant | Suggest PR improvements | [Install](github-copilot-pr-reviewer.yml) |
```

**`docs/plugin-setup-by-role.md`** (checklist per role):

```
# Plugin Setup by Role

## .github Maintainer
- [ ] Claude Code Linting Plugin
- [ ] Claude Code Agent Runner
- [ ] GitHub Copilot
- [ ] (All Tier 1 plugins)

## WordPress Plugin Developer
- [ ] GitHub Copilot
- [ ] Claude Code (optional, for code generation)
- [ ] (Subset of Tier 1)

## Front-End Developer
- [ ] GitHub Copilot
- [ ] (Minimal plugin setup)
```

---

### **Q41: Plugin versioning — Pinned versions or auto-update?** {#q41:-plugin-versioning-—-pinned-versions-or-auto-update?}

**My answer:** **Pinned major versions, auto-update within major.**

**Reasoning:**

- Pinning major versions prevents breaking changes (e.g., v1.x.x to v2.x.x).  
- Auto-updating patches and minors keeps security fixes.

**Recommendation:**

- In `plugins/*.yml`:

```
name: Linting Pluginversion: "^1.5.0"  # Auto-update within v1.x, but not to v2.x
```

- In `.github/config/plugins/plugin-versions.json`:

```json
{  "claude-code-linting-plugin": "^1.5.0",  "github-copilot": "latest"}
```

- Quarterly: Review new versions, decide on upgrades.

---

### **Q42: Plugin inter-dependencies — Independent or coordinated?** {#q42:-plugin-inter-dependencies-—-independent-or-coordinated?}

**My answer:** **Independent, with light coordination.**

**Reasoning:**

- Each plugin should work standalone (a developer might only install Claude Code, not Copilot).  
- But plugins can reference each other (e.g., "Linting Plugin integrates with Code Quality Agent").

**Recommendation:**

- In `plugins/*.yml`, document:

```
name: Linting Pluginintegrations:  - agent: agents/code-quality.agent.md  - hook: hooks/pre-commit-lint.sh
```

- This helps developers understand which agent/hook a plugin uses.  
- No hard dependencies (pluginsdon't fail if related agent is missing).

---

### **Q43: Plugin testing — Manual, CI/CD, or dedicated validation?** {#q43:-plugin-testing-—-manual,-ci/cd,-or-dedicated-validation?}

**My answer:** **All three:**

1. **Manual**: Developers test locally (checklist in `docs/plugin-testing.md`).  
2. **CI/CD**: `.github/workflows/plugin-validation.yml` validates plugin specs (YAML syntax, required fields).  
3. **Dedicated**: Optional "plugin integration tests" (test that Claude Code plugin actually loads agents correctly).

**Recommendation:**

**`.github/workflows/plugin-validation.yml`**:

```
name: Validate Plugins
on: [pull_request, push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run validate:plugins
      - run: npm run test:plugins
```

**`docs/plugin-testing.md`** (manual checklist):

```
## Plugin Testing Checklist

- [ ] Plugin installs without errors
- [ ] Plugin appears in tool panel
- [ ] Agent executes successfully
- [ ] Output is formatted correctly
- [ ] Plugin settings are accessible
```

---

## **7\. PACKAGE.JSON & DEPENDENCIES** {#7.-package.json-&-dependencies}

### **Q44: Package.json scope — What should it include?** {#q44:-package.json-scope-—-what-should-it-include?}

**My answer:** **Only repo-level dev dependencies and scripts. No runtime deps.**

**Recommendation:**

**Keep**:

```json
{
  "scripts": {
    "test": "jest",
    "validate:frontmatter": "node scripts/validation/validate-frontmatter.js",
    "validate:agents": "node scripts/validation/validate-agents.js",
    "lint:md": "markdownlint '**/*.md'",
    "lint:js": "eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "markdownlint-cli": "^0.35.0",
    "ajv": "^8.0.0"
  }
}
```

**Remove** (if unused):

- Any package you don't actively use  
- Runtime dependencies (this repo doesn't have any executable code)

---

### **Q45: Scripts reduction — Which custom scripts are actually used?** {#q45:-scripts-reduction-—-which-custom-scripts-are-actually-used?}

**My answer:** **I need you to run:**

```shell
npm run
```

And paste the output. Then I'll audit which are used vs. dead code.

**Preliminary guess** (based on repo structure):

- ✅ `test`, `validate:*`, `lint:*`, `format` — used  
- ❓ Any scripts related to old tooling or deprecated workflows — unused

**Recommendation**: Once you run `npm run`, I'll create a spreadsheet showing:

| Script | Status | Used By | Keep? | Notes |
| ----- | ----- | ----- | ----- | ----- |
| `test` | ✅ | Jest | YES |  |
| `validate:branch-name` | ✅ | Pre-push hook | YES |  |
| ... |  |  |  |  |

---

### **Q46: Dependency cleanup — Can we remove unused packages?** {#q46:-dependency-cleanup-—-can-we-remove-unused-packages?}

**My answer:** **Likely yes, but I need to audit.**

**Recommendation**: Run:

```shell
npm list --depth=0
npx depcheck
```

This shows:

- Direct dependencies (you might be able to remove unused ones).  
- Unused dependencies (depcheck flags packages not imported anywhere).

Then I'll recommend:

- Remove truly unused packages (save install time, reduce attack surface).  
- Keep utilities that are imported by scripts or tests.

---

### **Q47: Node version pinning — `.nvmrc` and `.npmrc`?** {#q47:-node-version-pinning-—-.nvmrc-and-.npmrc?}

**My answer:** **Yes, add both.**

**Recommendation:**

**.nvmrc** (file in root):

```
18.17.0
```

Developers run `nvm use` to switch to the correct Node version.

**.npmrc** (file in root):

```
engine-strict=true
legacy-peer-deps=false
```

**package.json**:

```json
{
  "engines": {
    "node": "^18.17.0",
    "npm": "^9.0.0"
  }
}
```

---

### **Q48: Package-lock strategy — Committed or regenerated?** {#q48:-package-lock-strategy-—-committed-or-regenerated?}

**My answer:** **Committed (current state is correct).**

**Reasoning:**

- Committed `package-lock.json` ensures all developers install the same versions.  
- Regenerating per developer causes inconsistencies.

**Recommendation**:

- Keep `package-lock.json` in git.  
- In CI/CD, use `npm ci` (installs exact versions from lock file), not `npm install` (updates lock file).  
- If you upgrade a dependency, the lock file updates automatically.

---

## **8\. DOCUMENTATION & DISCOVERABILITY** {#8.-documentation-&-discoverability}

### **Q49: Root `README.md` scope — High-level or full navigation?** {#q49:-root-readme.md-scope-—-high-level-or-full-navigation?}

**My answer:** **High-level overview \+ navigation hub.**

**Recommendation:**

Root `README.md` structure:

```
# LightSpeed `.github` Control Plane

## Quick Links
- [Contributing Guide](CONTRIBUTING.md)
- [Branching Strategy](docs/BRANCHING_STRATEGY.md)
- [VSCode Workspace Setup](docs/vscode-workspace-setup.md)
- [AI Agents & Skills](agents/README.md)

## What This Repo Contains

| Folder | Purpose | For Whom |
| --- | --- | --- |
| `agents/`, `skills/` | Reusable AI automation tools | All projects |
| `instructions/` | Org-wide coding standards | All projects |
| `ai/`, `config/`, `plugins/` | Tool configurations | All projects |
| `.github/` | GitHub-native assets (workflows, labels) | `.github` maintainers |
| `docs/` | Documentation | Everyone |

## Getting Started

### I'm a Developer on a WordPress Project
1. Read [Branching Strategy](docs/BRANCHING_STRATEGY.md)
2. Set up VSCode workspace: [Setup Guide](docs/vscode-workspace-setup.md)
3. Explore [agents](agents/README.md) and [skills](skills/README.md)

### I'm Contributing to `.github` Repo
1. Read [CLAUDE.md](CLAUDE.md) (AI rules)
2. Read [CONTRIBUTING.md](CONTRIBUTING.md) (contribution process)
3. Set up VSCode workspace (above)
4. Run `npm run validate:*` before pushing

## Repository Structure
See [REPOSITORY_STRUCTURE.md](docs/repository-structure.md) for detailed folder descriptions.
```

---

### **Q50: Docs folder organization — By audience or by topic?** {#q50:-docs-folder-organization-—-by-audience-or-by-topic?}

**My answer:** **By topic (primary), with audience notes in frontmatter.**

**Reasoning:**

- Developers search by topic (e.g., "branching strategy", "agent development", "plugin setup").  
- Audience tags (frontmatter) help people find docs relevant to their role.

**Recommendation:**

```
docs/
  README.md (index of all docs, with audience tags)
  
  BRANCHING_STRATEGY.md
    audience: everyone
  
  PR_CREATION_PROCESS.md
    audience: contributors, .github maintainers
  
  vscode-workspace-setup.md
    audience: developers
  
  agents-and-skills/
    developing-agents.md
      audience: advanced contributors
    developing-skills.md
      audience: advanced contributors
    consuming-agents.md
      audience: developers
  
  ai-ops/ (or ai-operations/)
    changelog-automation.md
      audience: .github maintainers
    issue-triage-automation.md
      audience: .github maintainers
    plugin-setup.md
      audience: developers, .github maintainers
  
  .github-specific/ (or architecture/)
    release-process.md
      audience: .github maintainers
    workflow-architecture.md
      audience: advanced contributors
```

**`docs/README.md`** (searchable index):

```
# Documentation Index

## For Everyone
- [Branching Strategy](BRANCHING_STRATEGY.md)
- [PR Creation Process](PR_CREATION_PROCESS.md)
- [Repository Structure](repository-structure.md)

## For Developers
- [VSCode Workspace Setup](vscode-workspace-setup.md)
- [Using Agents & Skills](agents-and-skills/consuming-agents.md)

## For Contributors
- [Developing Agents](agents-and-skills/developing-agents.md)
- [Developing Skills](agents-and-skills/developing-skills.md)

## For .github Maintainers
- [Release Process](architecture/release-process.md)
- [Workflow Architecture](architecture/workflow-architecture.md)
- [Changelog Automation](ai-ops/changelog-automation.md)
```

---

## **9\. IMPLEMENTATION SEQUENCING** {#9.-implementation-sequencing}

### **Q51: Migration order — Folder moves first, then updates?** {#q51:-migration-order-—-folder-moves-first,-then-updates?}

**My answer:** **Option A: Folder moves first (manual), then file updates (systematic).**

**Sequencing**:

1. **You do** (manual folder moves):

```shell
# Day 1: Structural moves
mv scripts/ .github/scripts/
mv tmp/ .github/tmp/
mv memory/ .github/memory/
mv reports/ .github/reports/
mv projects/ .github/projects/
mv website/ .github/website/
mv .schemas/ schemas/ (or keep as-is if you decide)
```

1.
   **I do** (systematic updates):

   - Grep all references to old paths in:  
     - `package.json` scripts  
     - `.github/workflows/*.yml`  
     - `docs/` files  
     - `scripts/` (now `.github/scripts/`) references  
     - Any hardcoded paths in agents, skills, etc.  
   - Update systematically  
   - Test validation scripts  
2. **You validate**:

   - Run `npm run validate:*` to confirm everything works  
   - Test a workflow (if possible)  
   - Check that file paths in documentation make sense  
3. **Create PR** with all changes, reviewable in one go.

---

### **Q52: Rollout to team — Auto-update or gradual migration?** {#q52:-rollout-to-team-—-auto-update-or-gradual-migration?}

**My answer:** **Gradual migration with 3-week grace period.**

**Recommendation**:

**Week 1**: Merge restructuring PR to `develop`

- Announce in Slack: "Major repo restructuring—docs moved, please re-read setup guide"  
- Both old paths and new paths work (symlinks, or warnings in old-path files)

**Weeks 2–3**: Grace period

- Old paths still work (with deprecation warnings)  
- New developers get setup guide with new paths  
- Existing developers can continue with old paths

**Week 4**: Hard cutover

- Remove old paths  
- Anyone who didn't migrate gets a build failure (forces update)

**Git message**:

```
refactor: Restructure .github repo — move scripts, reports, projects to .github/

This is a major restructuring. See [Migration Guide](docs/MIGRATION.md) for details.

- Move scripts/ → .github/scripts/
- Move reports/ → .github/reports/
- Move projects/ → .github/projects/
- Move schemas/ → schemas/ (or kept as .schemas/)
- Move website/ → .github/website/

Old paths will work until [DATE]. After that, update your scripts and documentation.

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

---

## **BONUS: RECOMMENDATIONS I DIDN'T ANSWER YET** {#bonus:-recommendations-i-didn't-answer-yet}

These are from your longer prompt, that I'll briefly address:

### **Should we move `.schemas/` or keep it hidden?** {#should-we-move-.schemas/-or-keep-it-hidden?}

**My recommendation: Move to visible `schemas/` (answer in Q16, but repeated for clarity).**

- Makes it discoverable.  
- Consistent with other folders.  
- Team can reference schema definitions easily.

### **Should `config/` be split?** {#should-config/-be-split?}

**My recommendation: Yes (answer in Q25).**

- Portable configs (`eslintrc.json`, `prettier.json`) → root `config/`  
- GitHub-specific (`labels.yml`, `issue-types.yml`) → `.github/config/`

### **Where should `*.agent.md` files live?** {#where-should-*.agent.md-files-live?}

**My recommendation: Split ownership (answer in Q10).**

- Generic agents → `agents/` root  
- `.github`\-specific agents → `.github/agents/`

### **Should we create a VSCode setup agent?** {#should-we-create-a-vscode-setup-agent?}

**My recommendation: Yes, eventually (Phase 2–3).**

- Create `.github/agents/vscode-workspace-setup.agent.md` that:  
  - Reads the developer's system (OS, installed tools, repos)  
  - Suggests folder structure for workspace  
  - Generates a customized `.code-workspace` file  
  - Installs recommended extensions  
- This is an advanced agent (depends on CLI tools, file system access), so start with the script first, then agent second.

### **Cookbooks for WordPress projects?** {#cookbooks-for-wordpress-projects?}

**My recommendation: Add these to `cookbook/`:**

- `wordpress-plugin-testing.md` (how to set up Jest for plugin tests)  
- `wordpress-theme-release.md` (release process for themes)  
- `wordpress-block-development.md` (developing custom blocks)  
- `wordpress-ci-cd-pipelines.md` (GitHub Actions for WordPress)  
- `database-migration-patterns.md` (safe schema updates)

### **Plugins adoption — How do we get there?** {#plugins-adoption-—-how-do-we-get-there?}

**My recommendation: Follow phased rollout (answer in Q38).**

1. **Phase 1**: Document \+ early adopters → gather feedback  
2. **Phase 2**: Automate setup → easier adoption  
3. **Phase 3**: Full rollout → default recommendation

---

## **SUMMARY TABLE: YOUR DECISIONS NEEDED** {#summary-table:-your-decisions-needed}

Here's what I need you to clarify/confirm:

| Decision | My Recommendation | Confident? | Notes |
| ----- | ----- | ----- | ----- |
| **Root structure** | Keep portable assets at root, move `.github` internals to `.github/` | 90% | Depends on multi-project consumption intent |
| **`.schemas/` visibility** | Move to visible `schemas/` | 85% | Trade-off: discoverability vs. awesome-copilot pattern |
| **Agent location** | Generic → `agents/`, `.github`\-specific → `.github/agents/` | 80% | Need your confirmation on "generic" threshold |
| **Config split** | Portable → `config/`, GitHub → `.github/config/` | 85% | Depends on WordPress project usage |
| **Scripts folder** | Move to `.github/scripts/` | 90% | Clear intent, minimal backward-compat issues |
| **Plugin strategy** | Support all 4 tools, Tier 1 (Claude Code \+ Copilot) by default | 70% | Depends on team's AI tool preferences |
| **VSCode setup** | Automated script \+ docs \+ sample `.code-workspace` | 95% | Straightforward, multiple adoption paths |
| **Tests structure** | Unit tests in `__tests__/` (Jest standard), integration tests in `.github/__tests__/` | 80% | Need your confirmation on bash tests approach |
| **Memory/tmp folders** | Move to `.github/`, both gitignored | 95% | Clear intent, no backward-compat issues |
| **package.json cleanup** | Audit after you run `npm run` | 50% | Need output from your system |
| **Rollout to team** | Gradual (3-week grace period) | 75% | Depends on team size and pain tolerance |

---

## **NEXT STEPS** {#next-steps}

1. **Review my answers** above. For each, tell me:

   - ✅ "I agree"  
   - ❌ "I disagree, here's why..."  
   - ❓ "I'm unsure, can you clarify..."  
2. **Provide missing info**:

   - Run `npm run` and share output (for Q44–48)  
   - Run `ls -la schema/` and share what's in that folder (for Q19)  
   - Confirm team size and roles (for Q4)  
3. **Once I have clarifications**, I'll create:

   - **Active project plan** (with detailed steps)  
   - **Migration checklist** (what you do vs. what I do)  
   - **Updated documentation** (ROOT README, index files, etc.)  
   - **Script updates** (path references)

---

Ready to review and refine?
