---
"title": "Agent Mode Prompt Template"
"description": "Template for requesting ChatGPT to act as an agent to plan and execute multi‑step tasks."
"last_updated": "2025-10-17"
"version": "v1.0"
"owners":
  - "LightSpeed Engineering"
"file_type": "documentation"
---

# Purpose

Use this template when you need ChatGPT to orchestrate a workflow that spans multiple steps and tools. Providing clear objectives and constraints will help the agent plan effectively.

# Paste or reference instructions

Ensure the **Agent Mode Instructions** document is loaded or paste it into your Copilot Space. This equips the model with the role, processes and guardrails necessary for agent behaviour.

# User input checklist

- [ ] Define the overarching objective of the task.
- [ ] List any known sub‑steps or desired outputs.
- [ ] Identify which connectors/tools to employ (e.g. GitHub, Google Drive).
- [ ] Specify any confirmation points (e.g. before creating a repo).
- [ ] Mention any deadlines or time constraints.

# System constraints

- The agent must not perform irreversible actions without confirmation.
- All actions should comply with LightSpeed security policies.
- Logging and status updates are required after each step.

# Example first message to Copilot

```
Act as an agent to set up a new GitHub repository named `tour-operator-api`. Plan the steps, including creating the repo under the `lightspeedwp` organisation, adding a README, applying the WordPress Copilot instructions, and creating an issue titled “Initial setup tasks”. Ask me to confirm before creating the repository.
```

# Verification steps

- Verify that the plan covers all required steps and tools.
- Check that confirmation points are included.
- Ensure the final summary matches the actions taken and lists any next steps.
