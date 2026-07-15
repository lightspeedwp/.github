# Recommended Starter Memory Pack

This is the recommended starter Memory pack for the LightSpeed Linear skill-factory setup.

## Recommended default stance

Use this agent primarily for:

- designing reusable Linear workflow skills;
- using Linear as the main source of truth;
- pulling GitHub or Google Drive context only when needed; and
- defaulting to strong packaging and validation because the outputs are meant to be reusable.

## `skill-intake-state.yaml`

```yaml
default_workflow_type: workflow-audit
last_confirmed_at: 2026-05-15
notes: Default to improving team workflow quality unless the request clearly asks for triage, customer-analysis, status-updates, or handoffs.
```

### Why this fits

- The current agent setup is strongly oriented toward team improvement, intake, onboarding, and workflow quality.
- `workflow-audit` is the safest high-value default for this setup.

## `skill-factory-preferences.yaml`

```yaml
default_package_shape: full skill package
preferred_validation_level: production-ready
markdown_output_profile: standard factory layout
include_copy_paste_sections: true
prefer_reference_files: true
last_updated_at: 2026-05-15
```

### Why this fits

- The team has consistently pushed the agent toward structured, reusable outputs.
- The current setup prefers schemas, reference files, clear routing, and formatting consistency.
- That makes full packages and stronger validation the right default.

## `skill-factory-todos.md`

```markdown
# Skill factory follow-up

- [ ] Create a reusable triage hygiene skill for daily issue intake.
- [ ] Create a reusable weekly team update skill for Linear project reporting.
- [ ] Create a reusable project health audit skill for stale work, missing ownership, and weak milestone hygiene.
- [ ] Tighten onboarding prompts so they adapt better to one-off versus recurring requests.
- [ ] Expand memory validation examples for custom workflow types.
```

### Why this fits

- These are concrete, reusable, and closely aligned with the team's recurring Linear workflow improvement needs.

## `lightspeed-conventions.md`

```markdown
# LightSpeed conventions

## Naming
- Use concise lowercase hyphen-case for skill names.
- Prefer names that describe the workflow outcome, not just the source app.
- Bias toward operational names such as `linear-triage-hygiene` or `linear-project-health-audit`.

## Packaging
- Default to full skill packages for reusable team workflows.
- Include `references/` when the skill needs templates, rubrics, examples, or validation guidance.
- Avoid placeholder files and avoid shipping partial package structures.

## Validation
- Use production-ready validation for shared or repeatable team skills.
- Include happy-path, ambiguous-input, and boundary prompts by default.
- Prefer explicit boundary handling when a skill could over-trigger.

## Output
- Use the standard factory markdown section order.
- Include copy-paste sections when the output contains reusable files or templates.
- Keep outputs scannable and operational rather than essay-like.

## Workflow rules
- Default to Linear as the primary source system.
- Use GitHub only when repository context materially improves the skill.
- Use Google Drive only when document context materially improves the skill.
- Treat apps as source systems, not write targets.

## Source usage
- Prefer the user's request and attached references first.
- Use connected apps only when they add meaningful grounding.
- Separate confirmed facts from assumptions in all reusable outputs.
```

## Best first entries to save

If the team wants the minimum useful starting set, begin with:

```yaml
# skill-intake-state.yaml
default_workflow_type: workflow-audit
last_confirmed_at: 2026-05-15
```

```yaml
# skill-factory-preferences.yaml
default_package_shape: full skill package
preferred_validation_level: production-ready
markdown_output_profile: standard factory layout
include_copy_paste_sections: true
```

## Recommended save order

1. `skill-factory-preferences.yaml`
2. `skill-intake-state.yaml`
3. `lightspeed-conventions.md`
4. `skill-factory-todos.md` only when the team genuinely wants deferred work tracked

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
