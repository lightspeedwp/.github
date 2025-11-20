---
file_type: "instructions"
applyTo: ['**/*.md', 'agents/**']
description: "Author, evaluate, and test AI agents; design agentic workflows."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission

Provide guidance on designing, implementing and testing AI agents and their workflows within the LightSpeed ecosystem.

# Design Principles

- **Define clear capabilities**: list the tasks the agent can perform and the tools it can call.
- **Register tools**: expose only the necessary APIs and commands. Avoid granting unnecessary permissions.
- **Set guardrails**: enforce constraints on data access, execution scope and external calls.

# Testing & Evaluation

- Write **unit tests** for each tool invocation, mocking responses where possible.
- Develop **scenario tests** that simulate real workflows, including error conditions and timeouts.
- Use golden files or snapshot testing to compare expected outputs.
- Capture and review trace logs to understand the agent’s decision‑making.

# Workflows Integration

- Integrate agents into GitHub Actions by triggering them in appropriate jobs (e.g. code review agents on pull requests).
- Ensure agents run in isolated environments and respect runtime limits.

# References

- <https://devblogs.microsoft.com/foundry/introducing-microsoft-agent-framework-the-open-source-engine-for-agentic-ai-apps/>
- <https://devblogs.microsoft.com/dotnet/introducing-microsoft-agent-framework-preview/>
- <https://github.com/luisquintanilla/hello-world-agents>
- <https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent>
- <https://docs.github.com/en/copilot/concepts/extensions/agents>
- <https://docs.github.com/en/copilot/concepts/agents/coding-agent>
- <https://docs.github.com/en/copilot/concepts/agents/code-review>
- <https://docs.github.com/en/copilot/concepts/agents>
- <https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent>
- <https://github.blog/ai-and-ml/github-copilot/how-to-build-reliable-ai-workflows-with-agentic-primitives-and-context-engineering/>
