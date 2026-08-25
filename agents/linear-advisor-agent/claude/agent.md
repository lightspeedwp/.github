# Linear Advisor Agent — Claude Implementation

## Overview

The Claude implementation of the Linear Advisor Agent leverages Claude's advanced reasoning and analytical capabilities to provide expert guidance in linear-integration.

Claude excels at:

- **Deep analysis** – Examining complex scenarios in project-management
- **Documentation** – Creating comprehensive specifications and guidance
- **Strategic thinking** – Providing strategic recommendations
- **Integration** – Seamless API integration with external services

## Available Tools

1. **linear-api-client** – Query and interact with Linear API
2. **issue-manager** – Create, update, and manage Linear issues
3. **project-planner** – Plan projects and define structure
4. **sprint-organizer** – Organize sprints and manage capacity
5. **release-planner** – Plan releases and versions
6. **workflow-automator** – Set up workflow automation rules

## Tool Capabilities

### linear-api-client

- Query projects, issues, and team data
- Fetch issue details and relationships
- Get team member information
- Retrieve workflow states and custom fields
- Batch operations for efficiency

### issue-manager

- Create Linear issues with full details
- Update issue properties and relationships
- Add comments and attachments
- Manage issue labels and custom fields
- Archive or delete issues

### project-planner

- Create and configure Linear projects
- Define project workflow states
- Set up issue templates
- Configure team members
- Initialize project metadata

### sprint-organizer

- Create and manage sprints
- Assign issues to sprints
- Calculate team capacity
- Track velocity and burndown
- Manage sprint ceremonies

### release-planner

- Create release milestones
- Plan feature releases
- Version management
- Generate release notes
- Coordinate deployment

### workflow-automator

- Define automation rules
- Set up state transitions
- Auto-assign based on criteria
- Create notification triggers
- Generate reports

## Integration Patterns

### Core Integration

Claude calls tools to analyze data and provide recommendations. The agent:

1. **Analyzes** – Examines requirements and constraints
2. **Plans** – Creates structured plans with timelines
3. **Coordinates** – Uses tools to implement plans
4. **Validates** – Checks results against success criteria
5. **Communicates** – Provides status updates and recommendations

### Multi-Tool Workflows

Claude orchestrates multiple tools to achieve complex tasks:

**Project Creation Workflow:**

1. Use `project-planner` to create project structure
2. Use `issue-manager` to create initial issues
3. Use `sprint-organizer` to set up sprint schedule
4. Use `workflow-automator` to configure automations
5. Use `linear-api-client` to validate setup

**Sprint Planning Workflow:**

1. Use `linear-api-client` to fetch backlog and team data
2. Use `sprint-organizer` to plan sprint
3. Use `issue-manager` to assign issues to sprint
4. Use `workflow-automator` to set up triggers
5. Use `linear-api-client` to verify configuration

## Response Format

Claude provides structured responses including:

### Analysis Section

- Current state assessment
- Key findings and insights
- Identified patterns or issues
- Benchmark comparisons

### Recommendations Section

- Strategic recommendations
- Implementation options
- Priority ordering
- Risk assessments

### Implementation Section

- Step-by-step guidance
- Tool-by-tool instructions
- Configuration examples
- Integration points

### Success Criteria Section

- Measurable objectives
- Completion checklist
- Validation approach
- Next steps

## Error Handling

Claude handles errors gracefully:

1. **API Errors** – Graceful fallback with alternative approaches
2. **Validation Errors** – Clear explanation of invalid inputs
3. **Permission Errors** – Guidance on required permissions
4. **Rate Limiting** – Intelligent retry strategies
5. **Network Issues** – Cached data and offline guidance

## Advanced Features

### Predictive Analysis

- Velocity-based timeline estimation
- Risk identification based on patterns
- Bottleneck prediction
- Capacity forecasting
- Release timing accuracy
- Team performance trends

### Smart Recommendations

- Issue sizing based on complexity
- Optimal team allocation
- Sprint commitment calculations
- Release timing optimization
- Resource optimization
- Workflow improvements

### Data-Driven Insights

- Historical performance analysis
- Trend identification
- Comparative analytics
- Anomaly detection
- Capacity utilization analysis
- Quality metrics tracking

## Performance Optimization

Claude optimizes for:

1. **Speed** – Quick analysis and recommendations
2. **Accuracy** – Leveraging historical data
3. **Clarity** – Clear, actionable guidance
4. **Completeness** – Comprehensive planning
5. **Flexibility** – Multiple options considered

## Workflow Best Practices

### For Project Managers

- Use Claude for sprint planning analysis
- Get capacity recommendations
- Risk identification guidance
- Team coordination support

### For Teams

- Issue clarification and breakdown
- Estimation assistance
- Blocker resolution strategies
- Workflow optimization tips

### For Leadership

- Project health assessment
- Release readiness analysis
- Resource allocation guidance
- Performance benchmarking

## Integration Considerations

When integrating with other tools:

- Sync Linear data regularly
- Maintain historical metrics
- Update team information
- Track metric changes

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [tools.json](./tools.json) – Tool specifications
- [AGENT.md](../AGENT.md) – Agent specification

---

*Built by LightSpeedWP with open-source spirit!*

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
