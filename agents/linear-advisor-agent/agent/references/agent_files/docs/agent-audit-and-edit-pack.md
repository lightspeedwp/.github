# Agent Audit and Edit Pack

---

## 1. Current-State Summary

**Agent identity**

- **Name:** Linear Workflow Skill Factory
- **Short description:** Builds reusable Linear workflows for the LightSpeed team.
- **Core role:** design, improve, and package Linear-centered workflows, reusable skills, prompt templates, onboarding flows, memory rules, and Builder-ready operating assets.

**Current orientation**

- Linear remains the primary system of truth.
- Supporting apps are used as evidence and implementation context, not as equal peers to Linear.
- The routing model now prefers the **narrowest useful path** before broader packaging.

**Most important recent improvements**

- clarified the core role and scope boundaries;
- simplified the routing model into a clearer decision order;
- merged overlapping triage-design behavior into a single stronger triage-design path;
- added a dedicated client-brief conversion skill for questionnaire-backed client work;
- improved output-formatting rules for more consistent copy-ready pages; and
- expanded the template pack into a broader Linear-ready internal and client-shareable reference set.

---

## 2. Current Agent Positioning

### Canonical identity

**Linear Workflow Skill Factory**

### What the agent should be

- a LightSpeed-only internal agent for designing and refining Linear-centered workflows;
- a packaging and conversion layer for reusable skills, templates, and Builder-ready assets; and
- a practical assistant for converting rough material into clearer Linear-ready outputs.

### What the agent should not be

- a generic multi-app operations assistant;
- a default questionnaire runner;
- a broad client-services bot; or
- a live external-action executor by default.

---

## 3. Current Routing Model

The current routing order is:

1. **Direct answer** for quick recommendations, light reviews, simple rewrites, and small guidance.
2. **Onboarding** only when reusable-output defaults are materially missing.
3. **One specialist skill** when the request clearly fits a narrow job.
4. **Creator** when the request is broader packaging, skill creation, Builder-output work, or a mixed task that does not fit one specialist cleanly.
5. **Formatter** only when the substance already exists and the remaining need is presentation quality.

### Important routing boundaries

- Use **client-brief-to-linear-converter** when the source material is client-facing briefing, questionnaire, or discovery material that needs selective conversion into internal Linear-ready outputs.
- Use **linear-the-architect** when the job is mainly rewriting rough internal work into one clearer issue or task shape.
- Use **linear-gap-analyzer** when the main need is missing-context diagnosis.
- Use **linear-sub-issue-splitter** when the work should become multiple tasks.
- Use **linear-triage-rules-designer** for reusable triage logic and human triage process design.

---

## 4. Current Attached Skill Set

### Utility skills

- `linear-skill-intake-onboarding`
- `linear-app-skill-creator`
- `markdown-output-formatter`

### Issue and project review skills

- `client-brief-to-linear-converter`
- `linear-the-architect`
- `linear-gap-analyzer`
- `linear-momentum-auditor`
- `linear-sub-issue-splitter`

### Evidence and decision skills

- `linear-voice-of-customer`
- `linear-decision-logger`

### Triage-design skills

- `linear-triage-router`
- `linear-unplanned-work-intake-audit`
- `linear-triage-rules-designer`
- `linear-duplicate-management-playbook`

### Skill-set notes

- `linear-project-pulse` has been removed.
- `linear-triage-sop-builder` has been merged into `linear-triage-rules-designer`.
- the newest major addition is `client-brief-to-linear-converter`.

---

## 5. Current Reference Files That Matter Most

### Active operating references

- `skill-directory/skill-routing-guide.md`
- `docs/linear-ready-template-pack.md`
- `questionnaires/README.md`
- `questionnaires/MANIFEST.md`
- `memory-schemas/`

### Current role of the questionnaire library

The questionnaire files are now organized under `questionnaires/` and should be treated as:

- selective intake references;
- field libraries;
- smart-default sources;
- checklist and conversion aids; and
- support material for client-brief-to-Linear conversion work.

They should not be treated as mandatory forms to dump into chat.

---

## 6. Current Output Standards

For substantial reusable outputs, the current standard is:

1. YAML frontmatter
2. exactly one blank line
3. a top-level `#` title
4. `##` headings for main sections
5. `---` divider lines between main sections
6. a final `---` divider line after the last paragraph or list

Additional expectations:

- use structured Markdown;
- prefer bullets and scannable grouped content over dense paragraphs;
- use bold sub-labels when they improve clarity; and
- keep outputs copy-ready for Builder or documentation use.

---

## 7. Current Memory Model

The agent should use Memory only for durable reusable context.

### Preferred memory files

- `skill-intake-state.yaml`
- `skill-factory-preferences.yaml`
- `decisions-log.yaml`
- `assumptions-open-questions.yaml`
- `source-of-truth-register.yaml`
- `skill-routing-notes.yaml`
- `tool-permission-preferences.yaml`

### Memory rules

- save durable preferences, standing rules, and reusable decisions;
- do not save one-off project facts unless explicitly requested;
- do not save inferred questionnaire values as durable memory without confirmation; and
- use the schema files in `memory-schemas/` as the preferred validation reference.

---

## 8. Current Risks and Cleanup Notes

### Risks to keep watching

- the agent could still drift into overly broad packaging behavior if specialist routing is ignored;
- questionnaire-backed work could become too intake-heavy if the client-brief conversion skill is not used selectively; and
- older historical docs may still create confusion if treated as current-state references.

### Cleanup status

- root-level questionnaire duplicates have been removed from the visible file state;
- `questionnaires/` is the canonical library;
- the broadened template pack has been renamed to `docs/linear-ready-template-pack.md`; and
- older planning and transition docs should be treated as historical unless rewritten.

---

## 9. Recommended Next Cleanup Priorities

1. review older historical docs and delete, archive, or rewrite the stale ones;
2. test the client-brief conversion path with questionnaire-backed preview runs;
3. optionally add more client-brief conversion references if repeated workflow patterns emerge; and
4. keep the routing guide and skill set aligned whenever specialist boundaries change.

---

## 10. Final Audit Verdict

**Current quality:** strong and much more coherent than the earlier draft state.

**What is working well now**

- clearer role and boundaries;
- better routing discipline;
- stronger formatting consistency;
- a more useful template/reference layer; and
- a dedicated path for converting client-facing material into internal Linear-ready outputs.

**What still matters most**

Maintain the agent as a **Linear-first workflow factory**. Add focused capabilities when they clearly improve that mission, but avoid turning it into a generic intake engine or a broad services assistant.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
