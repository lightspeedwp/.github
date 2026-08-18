# Strategic Planning Questions — Portable Prompt Engineer Agent

**Purpose:** Guide the planning and design phase for converting the Prompt Engineer Agent into a portable, reusable asset across LightSpeed repositories.

**Format:** Each question includes context, decision impact, and criteria for the answer.

---

## 1. Architecture & Portability

### Q1.1: Single Agent vs. Repository-Specific Variants?

**Context:**  
The current agent lives in `.github/agents/` (GitHub-control-plane specific). To make it portable, we must decide: do we build ONE universal agent that adapts to context, or MULTIPLE specialized agents (one for `.github`, one for WordPress plugins, one for WordPress themes)?

**Decision Impact:**

- **Single universal agent:** Simpler maintenance, shared logic, context-aware behaviour
- **Multiple variants:** Optimized for each context, but fragmented maintenance, duplication risk

**Questions to Answer:**

- What are the core differences in how prompt engineering is used across `.github`, WordPress plugins, and WordPress themes?
- Are there repository-specific constraints or workflows that would break a universal agent?
- What's the maintenance burden of each approach?

**Success Criteria:**

- Clear decision documented with trade-off analysis
- If variants chosen: naming convention, folder structure defined
- If universal chosen: context detection mechanism defined

---

### Q1.2: Where Should the Portable Agent Live?

**Context:**  
Currently at `.github/agents/prompt-engineer.agent.md` (control-plane, non-portable). Per CLAUDE.md, portable agents should live at repo root in `agents/` folder (Tier 2: multi-file agents).

**Decision Impact:**

- **Root `agents/` folder:** Makes it truly portable, installable in other projects
- **`.github/agents/`:** Keeps it control-plane-only, with a reference copy in `agents/`
- **Dual location:** Maintain both (primary source at root, mirror in `.github/` for backward compatibility)

**Questions to Answer:**

- Do we need the agent in `.github` for immediate availability to this repo's workflows?
- Should we maintain a single source of truth or allow dual copies?
- What's the sync/versioning strategy if dual copies exist?

**Success Criteria:**

- Clear location decision
- If dual: versioning and sync strategy documented
- Migration plan defined (if moving from `.github/`)

---

## 2. Scope & Constraints

### Q2.1: What Repositories Will Use This Agent?

**Context:**  
We've identified `.github`, WordPress plugins, and WordPress themes. Are there others? What's the full scope?

**Decision Impact:**

- Narrow scope (3–5 repos): Easier to design, test, maintain
- Broad scope (10+ repos): More testing needed, more edge cases to handle
- Undefined scope: Risk of building for wrong audience

**Questions to Answer:**

- Are there other repo types beyond `.github`, plugins, themes?
- Will external organisations (outside LightSpeed) use this?
- What's the priority ranking of the target repos?

**Success Criteria:**

- Definitive list of target repositories
- Priority ranking (MVP repos vs. nice-to-have)
- Scope boundaries documented (what's IN, what's OUT)

---

### Q2.2: Are There Repository-Specific Differences in Prompt Engineering Workflows?

**Context:**  
`.github` control plane might need different prompts than WordPress plugins. Do repositories have sufficiently different needs to warrant variants, or is the agent universally useful?

**Examples to Consider:**

- **`.github`:** Labels, workflows, governance, release notes, documentation (meta-focused)
- **WordPress plugins:** Block registration, deprecation, hooks, versioning (product-focused)
- **WordPress themes:** Block theming, design tokens, patterns, CSS (design-focused)

**Questions to Answer:**

- What is prompt engineering used for in each repository type?
- Are the input/output formats different?
- Do constraint sets differ (file structures, naming conventions, etc.)?
- Is there sufficient overlap to justify a single agent?

**Success Criteria:**

- Workflow matrix created (repo type → use cases)
- Identified differences documented
- Decision on universal vs. specialized captured

---

## 3. Quality & Testing

### Q3.1: What Is the Minimum Test Coverage for the Agent?

**Context:**  
CLAUDE.md says "full test coverage" must be included. We need to define what that means for a prompt engineer agent.

**Testing Dimensions:**

- **Prompt analysis accuracy:** Does it correctly identify weaknesses?
- **Improvement quality:** Are the suggestions actually better?
- **Output consistency:** Do outputs follow the promised format?
- **Edge cases:** Handles malformed input, ambiguous prompts, etc.?
- **Repository compatibility:** Works across `.github`, plugins, themes?

**Questions to Answer:**

- Should we test against a corpus of real prompts from each repo type?
- What's the acceptable error rate?
- Do we need LLM-level testing (multi-model evaluation) or script-level testing?
- How do we validate subjective improvements (is a suggestion "better")?

**Success Criteria:**

- Test strategy document with coverage goals
- Test categories defined (unit, integration, acceptance)
- Coverage targets set (e.g., 80%+ code coverage, 100% use-case coverage)
- Test repository/fixtures defined

---

### Q3.2: Should the Agent Include Example Prompts & Test Fixtures?

**Context:**  
A portable agent should ship with examples for each supported repository type. Do we include test fixtures and example prompt sets?

**Decision Impact:**

- **Include examples:** More comprehensive, easier to validate, bigger package size
- **Minimal examples:** Lighter weight, users provide their own examples
- **Dynamic examples:** Link to examples in each target repo (requires maintenance)

**Questions to Answer:**

- Should examples cover all supported repository types?
- Should we include "before/after" prompt pairs for learning?
- Do we need edge case examples?

**Success Criteria:**

- Decision on examples scope documented
- Example format defined (if included)
- Link structure for dynamic examples (if used)

---

## 4. Documentation & Usability

### Q4.1: What Documentation Should Ship With the Portable Agent?

**Context:**  
The agent must be usable by developers who aren't familiar with `.github` structure. What documentation is essential?

**Documentation Categories:**

- **Quickstart:** Get the agent working in 5 minutes
- **Architecture:** How the agent works internally
- **API/Interface:** How to invoke the agent, what it expects
- **Examples:** Real-world usage in each repository type
- **Troubleshooting:** Common issues and fixes
- **Contributing:** How to extend or improve the agent

**Questions to Answer:**

- Which documentation is mandatory vs. nice-to-have?
- Should documentation include mermaid diagrams (workflow, architecture, decision trees)?
- Should we auto-generate documentation from code/specs?
- How do we keep documentation in sync with agent updates?

**Success Criteria:**

- Documentation audit completed
- Mandatory sections identified
- Diagram types and locations planned
- Update/sync strategy defined

---

### Q4.2: How Should the Agent Be Discovered and Installed?

**Context:**  
If it's portable and lives in `agents/`, how will developers in other repos know about it and install it?

**Questions to Answer:**

- Is there a LightSpeed agent registry or marketplace?
- Should we document installation in the agent's README?
- Do we need a schema definition for agent portability?
- Should we include a setup/installation script?

**Success Criteria:**

- Installation method documented
- Discovery mechanism defined
- Installation validation process created

---

## 5. Implementation Planning

### Q5.1: What Are the Implementation Phases?

**Context:**  
Converting to a portable agent likely involves phases: spec → build → test → document → release.

**Questions to Answer:**

- What's the MVP (minimum viable portable agent)?
- Are there natural phase boundaries (e.g., basic version → multi-repo support → advanced features)?
- What's the timeline for each phase?
- Do we do a soft launch (internal repos only) before public release?

**Success Criteria:**

- Phase roadmap created (Phase 1, 2, 3…)
- MVP definition clear
- Deliverables per phase defined
- Timeline estimated

---

### Q5.2: Are There WordPress-Specific Modifications Needed?

**Context:**  
The user asked: "If the agent needs to be modified for WordPress block plugins/themes, define this in the plan."

**Questions to Answer:**

- Should the agent understand WordPress block structure and conventions?
- Do we need WordPress-specific prompt templates or examples?
- Should the agent validate prompts against WordPress standards (e.g., naming conventions for hooks, deprecation patterns)?
- Do we need separate skills/tools for WordPress contexts?

**Success Criteria:**

- WordPress-specific needs documented
- Identified modifications listed
- Decision on implementation approach (extensions vs. variants)
- WordPress-specific test cases defined

---

## 6. Maintenance & Evolution

### Q6.1: Who Owns the Portable Agent Long-Term?

**Context:**  
If multiple repos use it, who's responsible for updates, bug fixes, feature requests, and maintenance?

**Questions to Answer:**

- Is there a primary maintainer or a maintenance team?
- What's the process for accepting contributions from other repos?
- How do we handle breaking changes?
- What's the versioning strategy?

**Success Criteria:**

- Maintainers assigned
- Contribution guidelines documented
- Change management policy defined
- Versioning scheme chosen

---

### Q6.2: How Do We Handle Repository-Specific Feedback?

**Context:**  
Once in multiple repos, users may request features for their specific repo. How do we manage divergent needs?

**Questions to Answer:**

- Do we add features to core agent or create extensions?
- What's the feedback collection process?
- How often do we release updates?
- Do we deprecate features used by only one repo?

**Success Criteria:**

- Feedback process documented
- Extension/feature request policy defined
- Release cadence chosen
- Deprecation policy defined

---

## Answer Format

Each question should be answered with:

1. **Decision:** Clear yes/no or chosen option
2. **Rationale:** Why this decision?
3. **Trade-offs:** What are we giving up?
4. **Implementation Notes:** How do we execute this decision?
5. **Related Decisions:** Which other Q&As does this affect?

See [ANSWERS.md](./ANSWERS.md) for populated answers.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
