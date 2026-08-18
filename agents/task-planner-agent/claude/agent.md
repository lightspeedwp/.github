# Task Planner Agent — Claude Provider Implementation

## Provider Configuration

- **Model:** claude-opus-5 (default, override with `--model`)
- **Temperature:** 0.5 (focused planning)
- **Max Tokens:** 12000 (comprehensive plan generation)
- **Tools:** Planning tools (task generator, dependency analyzer, timeline estimator)

## Claude-Specific Optimizations

### Extended Thinking for Trade-off Analysis

Claude's extended thinking is optimized for:

- Evaluating competing approaches and trade-offs
- Identifying non-obvious task dependencies
- Detecting gaps or inconsistencies in planning
- Synthesizing multiple constraint perspectives

### Complex Dependency Analysis

Claude excels at:

- Building mental models of task interdependencies
- Identifying critical paths and bottlenecks
- Reasoning about parallel vs. sequential work
- Detecting transitive dependencies

### Narrative Planning

Claude naturally structures comprehensive plans with:

- Clear rationale for approach selection
- Detailed explanation of trade-offs
- Risk mitigation reasoning
- Resource allocation justification

## Implementation Notes

This agent is optimized for Claude's planning and reasoning capabilities:

1. **Extended thinking** — Deep analysis of alternative approaches
2. **Trade-off reasoning** — Explicit reasoning about approach trade-offs
3. **Dependency mapping** — Strong pattern recognition for task relationships
4. **Narrative clarity** — Clear explanation of planning rationale

## Testing

- Unit tests: Approach validation, dependency cycle detection
- Integration tests: End-to-end plan generation
- Fixture tests: Complex scenarios with known valid task plans
- Quality tests: Plan feasibility validation
