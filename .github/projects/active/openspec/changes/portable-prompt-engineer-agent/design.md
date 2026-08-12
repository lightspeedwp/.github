---
title: "Portable Prompt Engineer Agent — Technical Design"
description: "Technical design document with 7 key architectural decisions"
file_type: "openspec"
created_date: "2026-08-12"
last_updated: "2026-08-12"
status: "active"
domain: "agent"
---

# Portable Prompt Engineer Agent — Technical Design

## Context

**Current State:**

- Prompt Engineer Agent exists at `.github/agents/prompt-engineer.agent.md` (control-plane specific, Tier 1 spec-based)
- Single-use implementation; not reusable in other LightSpeed repositories
- Lacks context awareness; no adaptation to WordPress or other repository types
- Limited testing, no standardized validation approach

**Repository Architecture:**

- LightSpeed follows two-tier agent system (CLAUDE.md):
  - **Tier 1:** GitHub-native agents (`.github/agents/`) — control-plane specific
  - **Tier 2:** Portable agents (`agents/` root) — reusable across projects
- Target repositories: `.github` control plane, WordPress block plugins, WordPress block themes
- All three share common prompt engineering needs but have context-specific constraints

**Constraints:**

- Must maintain backward compatibility with existing `.github/` workflows
- Must work with current Claude API (no fine-tuning, no custom models)
- Must integrate with LightSpeed standards (CLAUDE.md, AGENTS.md, coding standards)
- Must support testing in CI/CD (GitHub Actions)
- Must publish to NPM registry (`@lightspeedwp/`)

**Stakeholders:**

- `.github` maintainers (governance, workflows, documentation)
- WordPress plugin developers (block registration, API design)
- WordPress theme developers (design systems, tokens, accessibility)
- Agent ecosystem maintainers (portability standards, Tier 2 agent registry)

## Goals / Non-Goals

**Goals:**

✅ **Portability:** Single agent works across `.github`, plugins, and themes without variants  
✅ **Context-Awareness:** Adapts output and validation based on repository type  
✅ **Quality:** 80%+ code coverage, 30+ integration tests, repository-specific validation  
✅ **Usability:** Works via NPM, Git clone, and GitHub Actions workflow integration  
✅ **Documentation:** Comprehensive with mermaid architecture diagrams, quickstart, examples  
✅ **Maintainability:** Distributed ownership, clear versioning, deprecation policy  
✅ **Extensibility:** Easy to add new repository types in Phase 2+  

**Non-Goals:**

❌ Fine-tuning or custom LLM models (use Claude API as-is)  
❌ Real-time collaborative prompt editing (single-user focus, MVP)  
❌ Prompt marketplace or gallery (Phase 2+)  
❌ IDE plugins or integrations (Phase 3+)  
❌ Multi-language support beyond English (MVP)  
❌ Automated A/B testing of prompts (Phase 2+)  

## Decisions

### D1: Single Universal Agent (Not Multiple Variants)

**Decision:** Build ONE agent with context-aware behavior for all three repository types.

**Rationale:**

- Shared core analysis methodology (clarity, completeness, testability) works universally
- Reduces maintenance burden (one codebase, not three)
- Simpler for users (no confusion about which variant to use)
- Better for ecosystem (single source of truth, easier updates)

**Alternatives Considered:**

- **Multiple variants** (one for .github, one for plugins, one for themes):
  - ❌ Higher maintenance (duplication, sync risk)
  - ❌ Harder to onboard users (which variant to use?)
  - ❌ Feature request chaos (do we add to all three or pick one?)
- **Plugin architecture** (core + optional context plugins):
  - ✅ Flexible, but more complex upfront
  - ⚠️ Deferred to Phase 2 if needed

**Implementation:** Context detection at runtime; load repository-specific examples and rules dynamically based on detected context (presence of `wp-block.json`, `theme.json`, `.github/workflows/`, etc.).

### D2: Location Strategy—Root `agents/` + `.github/` Mirror

**Decision:** Primary source at root `agents/prompt-engineer/` (Tier 2 portable); maintain reference mirror in `.github/agents/` (Tier 1, backward compatibility).

**Rationale:**

- True portability: agents in root can be imported into other LightSpeed repos
- Backward compatibility: existing workflows continue working without changes
- Clear architecture: aligns with CLAUDE.md two-tier system
- Migration path: gradual transition from `.github/` to root over releases

**Alternatives Considered:**

- **Root only** (remove `.github/agents/` copy):
  - ✅ Single source of truth
  - ❌ Breaks existing `.github/` workflows immediately
  - ❌ Forces migration before Phase 2+
- **Dual independent copies** (no sync, maintain separately):
  - ❌ Version divergence risk
  - ❌ Double maintenance burden
  - ❌ Confusing for users (which version is current?)

**Implementation:**

```
agents/prompt-engineer/
├── prompt-engineer.agent.md       (primary source + comprehensive prompt)
├── skills/                         (analysis, improvement, validation)
├── templates/                      (examples, workflows, standards)
├── tests/                          (unit, integration, acceptance)
└── docs/                           (README, API, EXAMPLES, etc.)

.github/agents/prompt-engineer.agent.md  (generated copy, sync'd on each release)
```

### D3: Context Detection via Repository Markers

**Decision:** Auto-detect repository type by checking for specific files/folders.

**Detection Logic:**

```javascript
if (fileExists('wp-block.json') || fileExists('package.json:wordpress.bundle')) {
  context = 'wordpress-plugin'
} else if (fileExists('theme.json') && fileExists('theme.json:wp.settings')) {
  context = 'wordpress-theme'
} else if (fileExists('.github/workflows/')) {
  context = 'github-control-plane'
} else {
  context = 'generic'  // unknown repo type
}
```

**Rationale:**

- Non-intrusive (doesn't require repo configuration)
- Reliable (files are always present in their repo types)
- Graceful fallback (generic mode if no match)
- Easy to extend (add new markers for Phase 2 repo types)

**Alternatives Considered:**

- **Environment variables** (`REPO_TYPE=plugin`):
  - ✅ Explicit
  - ❌ Extra setup required
  - ❌ Defaults to wrong value if not set
- **Package.json field** (`"lightspeedRepoType": "plugin"`):
  - ✅ Explicit, machine-readable
  - ❌ Requires repo configuration
  - ❌ Doesn't work for `.github` (no package.json required)

### D4: Four-Layer Testing Strategy (80% Code Coverage + Use-Case Coverage)

**Decision:** Implement unit tests (80% coverage), integration tests (30+ cases), acceptance tests (expert review), and repository-specific validation (15 real-world cases).

**Test Layers:**

| Layer | Focus | Target | Validation |
|-------|-------|--------|-----------|
| **Unit** | Individual functions | 80% code coverage | Jest/Mocha, coverage tool |
| **Integration** | End-to-end workflows | 30+ test cases (10 per repo type) | Real prompts, format validation |
| **Acceptance** | Output quality | Expert approval | Multi-model consistency, improvement quality |
| **Repository-Specific** | Real-world validation | 15 cases (5 per repo type) | Prompts work in actual workflows |

**Implementation:**

```
tests/
├── unit/                    (jest files, 80% target)
├── integration/             (e2e validation scripts)
├── acceptance/              (expert review docs)
└── fixtures/
    ├── github-control-plane/  (10 prompts each)
    ├── wordpress-plugins/
    ├── wordpress-themes/
    └── edge-cases/          (malformed, ambiguous, multi-context)
```

**Rationale:**

- CLAUDE.md requires "full test coverage"
- Four-layer approach catches issues at different levels
- Fixture corpus enables regression testing
- Expert acceptance prevents bad improvements from shipping

### D5: Semantic Versioning + Quarterly Releases

**Decision:** Follow SemVer (MAJOR.MINOR.PATCH); release quarterly with monthly patches for bugs.

**Versioning:**

- **MAJOR:** Breaking changes (API change, repo type removed, incompatible context detection)
- **MINOR:** Features (new repo types, new analysis capabilities)
- **PATCH:** Bug fixes (incorrect suggestions, format issues)
- **Deprecation:** Announce 2 MAJOR versions ahead; include migration guide

**Release Cycle:**

- Q1, Q2, Q3, Q4: Feature releases (MINOR or MAJOR)
- Monthly: Patch releases for critical bugs
- Roadmap: Published quarterly, reviewed for Phase 2/3 planning

**Rationale:**

- Predictable for users (know when to expect updates)
- Clear for maintainers (don't chase every issue)
- Aligns with WordPress release cycle (quarterly major, monthly patches)

**Alternatives Considered:**

- **Rolling releases** (push every PR):
  - ✅ Fast feedback
  - ❌ Users get updates constantly
  - ❌ No stable baselines
- **Ad-hoc releases** (release when "ready"):
  - ✅ Flexible
  - ❌ Unpredictable for users
  - ❌ Hard to plan maintenance

### D6: Multi-File Agent Structure (Skills, Templates, Tests)

**Decision:** Organize as multi-file agent (Tier 2) with separate skills, templates, and test directories rather than monolithic single file.

**Structure:**

```
agents/prompt-engineer/
├── prompt-engineer.agent.md       (main spec + comprehensive prompt)
├── skills/
│   ├── analyze-prompt.skill.md    (clarity, completeness detection)
│   ├── improve-prompt.skill.md    (suggestion generation)
│   ├── validate-prompt.skill.md   (format, standards validation)
│   └── validate-wordpress.skill.md (WordPress-specific rules)
├── templates/
│   ├── prompt-template.md
│   ├── workflow-examples.md
│   ├── github-examples.md
│   ├── wordpress-plugin-examples.md
│   └── wordpress-theme-examples.md
├── tests/
│   ├── test-analysis.js
│   ├── test-improvement.js
│   ├── test-validation.js
│   ├── test-context-detection.js
│   └── fixtures/
└── docs/
    ├── README.md
    ├── ARCHITECTURE.md
    ├── API.md
    ├── CONTRIBUTING.md
    └── [other docs]
```

**Rationale:**

- Separates concerns (analysis, improvement, validation)
- Easier to extend (add new skills for new repo types)
- Better for documentation (each skill has its own focus)
- Testable (can test each skill independently)

### D7: Distributed Ownership (Lead Maintainer + Sub-Maintainers)

**Decision:** Assign lead maintainer (Ash Shaw) with distributed sub-maintainers for each context.

**Ownership Model:**

- **Lead Maintainer:** Ash Shaw (final approval, versioning, roadmap)
- **Sub-Maintainers:**
  - `.github` control plane: Governance team lead
  - WordPress plugins: Plugin team lead
  - WordPress themes: Theme team lead

**Process:**

1. Any contributor can submit PR
2. Context-specific sub-maintainer reviews + approves
3. Lead maintainer does final review (architecture, tests, docs)
4. Merge to `develop`, then `main` on release

**Rationale:**

- Distributes review load
- Leverages context expertise
- Prevents bottlenecking on one person
- Clear escalation path for conflicts

## Risks / Trade-offs

### Risk 1: Context Detection Failure

**Risk:** Repository doesn't match any detection pattern; agent defaults to `generic` mode, giving poor recommendations.

**Mitigation:**

- ✅ Provide clear error message with repo type detection failure
- ✅ Support manual context override (environment variable fallback)
- ✅ Include troubleshooting guide in docs
- ✅ Test against all three repo types in CI/CD

### Risk 2: WordPress Standards Drift

**Risk:** WordPress coding standards or block schema evolve; agent's validation rules become outdated.

**Mitigation:**

- ✅ Quarterly review of WordPress standards (align with quarterly releases)
- ✅ Sub-maintainers from WordPress teams flag updates
- ✅ Versioned standards library (allow legacy support if needed)
- ✅ Clear deprecation policy for outdated rules

### Risk 3: Prompt Quality Varies by Repository Type

**Risk:** Agent excels at `.github` prompts but gives weaker suggestions for WordPress contexts.

**Mitigation:**

- ✅ Fixture-driven testing (30+ WordPress-specific prompts in test corpus)
- ✅ Expert acceptance testing (WordPress experts review improvements)
- ✅ Sub-maintainer expertise (WordPress teams validate output)
- ✅ Collect user feedback post-release; iterate in Phase 2

### Risk 4: NPM Package Adoption Is Slow

**Risk:** Other repos don't adopt portable agent; effort doesn't pay off.

**Mitigation:**

- ✅ Soft launch: pilot with 2–3 repos before broad announcement
- ✅ Clear documentation (quickstart, examples, benefits)
- ✅ Slack/community promotion
- ✅ Measure adoption (downloads, PRs referencing agent)
- ✅ Iterate based on feedback (Phase 2 improvements)

### Trade-off 1: Single Agent vs. Performance

**Trade-off:** Universal agent may be slower than specialized variants (extra context detection, conditional logic).

**Decision:** Accept small performance cost for simplicity; optimize later if profiling shows issues.

**Metrics:** Target agent response time < 5 seconds for typical prompt (including Claude API latency).

### Trade-off 2: Generic Examples vs. Tailored Examples

**Trade-off:** Example prompts may feel less tailored than WordPress-specific variants would be.

**Decision:** Provide broad examples with clear context labels; Phase 2 can add more specialized variations.

**Mitigation:** Sub-maintainers contribute context-specific examples; docs explain how to add more.

### Trade-off 3: Maintenance Burden of Dual Locations

**Trade-off:** Maintaining both root and `.github/` copies increases maintenance cost.

**Decision:** Automate sync process; `.github/` copy is generated, not hand-edited. Update once in Phase 2 when removing `.github/` version.

## Migration Plan

### Phase 1: Specification (Current)

- ✅ Proposal created and approved (this document)
- ⏳ Design created (in progress)
- ⏳ Specifications created (per-capability specs)
- ⏳ Implementation tasks defined

**Deliverable:** OpenSpec change complete with all artifacts; PR to `develop` with planning docs.

### Phase 2: Core Implementation (3–4 weeks)

- Build prompt analysis engine (clarity, completeness detection)
- Implement context detection
- Create improvement suggestion generator
- Build prompt templates for each repo type
- Write API documentation

**Validation Gate:** 80%+ code coverage, 10+ test cases passing

**Deliverable:** Working agent; passes unit + integration tests; ready for Phase 3

### Phase 3: Testing & Validation (2–3 weeks)

- Build test fixture corpus (30+ real prompts)
- Implement integration test suite
- Implement acceptance tests (expert review)
- Repository-specific validation rules
- Multi-model testing (Sonnet, Haiku)

**Validation Gate:** All tests passing, expert sign-off, zero critical bugs

**Deliverable:** Full test suite; validated improvements; ready for docs + release

### Phase 4: Documentation & Release (2 weeks)

- Write comprehensive documentation (README, API, EXAMPLES, CONTRIBUTING, TROUBLESHOOTING)
- Add mermaid diagrams to all docs
- Set up NPM publishing
- Create installation script
- Test end-to-end (install, use, validation)

**Validation Gate:** Documentation reviewed, quickstart validated, NPM publish successful

**Deliverable:** Production-ready agent; published to NPM; announcement ready

### Rollback Strategy

**If critical issues found after release:**

1. Immediate patch release to `.github` mirror copy (maintain backward compatibility)
2. NPM unpublish (if >= 24h from publish; contact npm support)
3. Create bugfix branch; prioritize resolution in Phase 1 of next release cycle
4. Document issue in CHANGELOG with workaround

**Migration from `.github/` version:**

- Phase 4: Soft launch (NPM available, but no .github/agents/ removal)
- Phase 5+: Gradual migration (add deprecation notice, clear migration guide)
- Phase 6+: Remove .github/ copy (only if Phase 5 shows strong adoption)

## Open Questions

1. **Q:** Should we include a setup script to auto-configure repo for agent usage?
   - **Impact:** Phase 4 (docs/setup)
   - **Decision:** TBD based on Phase 3 feedback

2. **Q:** Should we provide GitHub Actions workflow template for automated prompt review?
   - **Impact:** Phase 4 (docs/examples) or Phase 2 (design/tasks)
   - **Decision:** TBD based on validation needs

3. **Q:** How do we handle breaking changes to WordPress standards (e.g., new block schema)?
   - **Impact:** Maintenance (versioning, deprecation policy)
   - **Decision:** Defer to Phase 2; MVP uses current standards (2026)

4. **Q:** Should sub-maintainers have different approval thresholds (e.g., theme team can approve theme examples without lead maintainer review)?
   - **Impact:** Maintenance (PR process)
   - **Decision:** TBD once distributed ownership is established; default to current model

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
