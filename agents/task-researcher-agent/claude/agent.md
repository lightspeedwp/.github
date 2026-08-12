# Task Researcher Agent — Claude Provider Implementation

## Provider Configuration

- **Model:** claude-opus-5 (default, override with `--model`)
- **Temperature:** 0.7 (balanced analysis and creativity)
- **Max Tokens:** 8000 (allow comprehensive research output)
- **Tools:** Research tools (requirement extractor, constraint analyzer, context mapper)

## Claude-Specific Optimizations

### Extended Thinking

Claude's extended thinking capability is enabled for deep analysis:

- Analyzes implicit requirements by reasoning through context
- Cross-references constraints to identify conflicts
- Maps complex stakeholder interactions
- Identifies non-obvious dependencies

### Research Synthesis

Claude naturally structures research output as JSON with clear reasoning:

- Explains the logic behind each constraint identification
- Highlights surprising findings or conflicts
- Provides confident assessments with appropriate caveats

### Tool Use Integration

Claude's tool calling integrates with:

- `requirement_discovery` — Extract requirements from text
- `constraint_extractor` — Identify technical/business constraints
- `context_mapper` — Build stakeholder and dependency graphs
- `research_synthesizer` — Compile into structured output

## Implementation Notes

This agent is optimized for Claude's reasoning capabilities. Key implementation details:

1. **Structured thinking** — Uses extended thinking for complex constraint analysis
2. **Implicit requirement discovery** — Reads between the lines based on context
3. **Conflict detection** — Automatically flags competing constraints
4. **Dependency mapping** — Identifies transitive dependencies

## Testing

- Unit tests: Metadata validation, prompt structure
- Integration tests: End-to-end research report generation
- Fixture tests: Known research scenarios with expected outputs
