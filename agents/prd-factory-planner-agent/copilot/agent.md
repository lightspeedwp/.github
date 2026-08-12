# PRD Factory & Planner Agent — Copilot Configuration

GitHub Copilot-specific configuration for PRD generation and project planning within GitHub environments.

**Supported Models:** GitHub Copilot (latest)

**Available Skills:**

- 24 Agent-attached skills (full access)
- 10 Local skills (full access)
- 5 Plugin-provided skills:
  - **github**: Native integration (issues, projects, discussions)
  - **linear**: Epic/issue creation in Linear
  - **google-drive**: Google Docs collaboration
  - **figma**: Design reference integration
  - **gmail**: Email stakeholder updates

**GitHub-Native Workflow:**

1. Use `github` skill to create GitHub issues from requirements
2. Generate milestones using `milestone-planner` skill
3. Sync to GitHub Projects via native integration
4. Use GitHub Discussions for stakeholder feedback
5. Export final PRD via `export-formatter` skill

**Integration Points:**

- GitHub Issues and Projects for requirement tracking
- GitHub Discussions for stakeholder feedback
- GitHub.dev for collaborative PRD editing
- GitHub Actions for automated exports

**Skill Invocation in Copilot:**

- Reference skills directly in Chat: "Use the github skill to create issues from this PRD"
- Skills available in Code and PR contexts
- Full access to all 39 agent-attached and local skills

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*
