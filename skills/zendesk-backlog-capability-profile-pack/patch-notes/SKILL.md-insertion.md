# Suggested SKILL.md insertion

Add this sentence to the `Shared-agent compatibility` section after the existing paragraph that mentions `references/workspace-capability-profile.md`:

```md
When installing the skill into a shared workspace agent, start from `profiles/workspace-capability-profile.template.json` and record only confirmed read capabilities, visible fields, and known limitations. Use `references/capability-profile-maintenance.md` and `templates/shared-agent-installation-note.md` during setup or rollout; do not load them during normal backlog reporting unless capability is uncertain or the user is configuring the shared agent.
```

Add this bullet to `Included validation aids` if the capability profile template is bundled:

```md
- `profiles/workspace-capability-profile.template.json`: portable starter profile for shared-agent Zendesk capability documentation. Copy it per shared agent and validate the completed profile with `scripts/validate_capability_profile.py`.
```
