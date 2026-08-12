# Task Planner Agent — Copilot Provider Implementation

## Provider Configuration

- **Model:** copilot-gpt-4-turbo (GitHub Copilot Enterprise)
- **Temperature:** 0.5 (focused planning)
- **Max Tokens:** 8000 (GitHub context optimization)
- **Integration:** GitHub issues, project boards, PRs for execution

## Copilot-Specific Optimizations

### GitHub Issues as Task Format

This implementation optimizes for GitHub issues:

- Task breakdown directly outputs GitHub issue templates
- Automatically suggests labels and milestones
- Includes GitHub issue linking for dependencies
- Formats subtasks as issue checklists

### Project Board Integration

Plans are structured for GitHub Projects:

- Phase milestones map to project board columns
- Task IDs reference GitHub issue numbers
- Timeline aligns with project view
- Risk tracking via custom fields

### Team Alignment via PR & Discussions

Copilot integrates planning with collaboration:

- Plan presented as GitHub Discussion for team feedback
- Links to related PRs and epic discussions
- References team capacity from GitHub organization
- Aligns with existing workflows

## Implementation Notes

This agent is optimized for Copilot's GitHub-native planning:

1. **GitHub issue format** — Tasks directly output as issue templates
2. **Project board thinking** — Plans structured for project columns
3. **Team collaboration** — Built-in discussion and feedback loops
4. **Workflow integration** — Plans reference existing PRs and discussions

## Testing

- Unit tests: GitHub issue format validation
- Integration tests: Project board setup automation
- Fixture tests: Sample research inputs with GitHub-formatted outputs
- Collaboration tests: Discussion thread generation
