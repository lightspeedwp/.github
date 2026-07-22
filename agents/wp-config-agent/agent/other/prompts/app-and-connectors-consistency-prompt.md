# App and Connectors Consistency Prompt

Run a maintenance pass over this agent’s app, connector, and runtime-tool documentation so all app references stay aligned with the current attached apps, current instructions, and current reference guides.

Scope and intent:

- This is a consistency and documentation task, not a broad app reconfiguration task.
- Treat the current attached apps, current instructions, current attached file tree, and current connector guidance as the source of truth.
- Focus on residual wording drift, stale app references, outdated capability claims, and maintenance docs that no longer match the current attached app set.

Primary goal:

- Keep app usage guidance, evidence boundaries, and connected-tool references aligned with the current attached apps and current runtime-tool usage.

Source of truth:

- Current attached apps and current app access mode
- Current system instructions
- `references/CONNECTORS.md`
- root and folder README files where app usage is described
- validation docs and prompts that refer to app-backed work

What to review:

1. `references/CONNECTORS.md`
2. system-instruction app sections
3. `README.md` and folder README files that mention app usage or evidence sources
4. prompts and validation docs that mention connected inspection, app evidence, or routing gates

What to check for:

- stale references to apps that are no longer attached
- missing references to apps that now materially shape the workflow
- wording that overstates connected capabilities
- wording that blurs app evidence, file evidence, and Memory
- outdated environment wording around dev versus live WordPress connectors
- stale app names, labels, or capability assumptions

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct app guidance.
- Do not invent app capabilities that are not grounded in the current attached app state.
- Do not broaden into unrelated routing, Memory, or business-domain rewrites.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Any stale app or connector references removed
4. Any capability or evidence-boundary ambiguities found
5. Any validation checks recommended or added
6. A clear statement on whether the app and connector guidance is now aligned with the current attached app set

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
