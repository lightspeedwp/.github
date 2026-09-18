# Requirements Quality Checklist Framework

A specification validation framework that operationalises quality standards across 8 dimensions, helping teams ensure requirements are complete, clear, measurable, and ready for implementation.

## Features

- **8 Quality Dimensions**: Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities
- **4 Audience Variants**: Author Pre-Review, Peer Review, Stakeholder Gate, Cross-Project Integration
- **Format-Agnostic**: Validate Markdown, YAML, and JSON specifications
- **Measurable Results**: Dimension scores (0-100%), overall quality score, specific findings with evidence
- **Fast Validation**: Checklist results generated in <5 seconds

## Installation

```bash
npm install @lightspeedwp/requirements-checklist
```

## Usage

### Programmatic API

```typescript
import { ChecklistEngine } from '@lightspeedwp/requirements-checklist';

const engine = new ChecklistEngine();
const result = await engine.run({
  variant: 'author-pre-review',
  specPath: './spec.md',
  format: 'markdown'
});

console.log(`Overall Score: ${result.overall_score}`);
console.log(`Dimension Scores:`, result.dimension_scores);
console.log(`Issues Found:`, result.findings.length);
```

### CLI

```bash
requirements-checklist validate --variant peer-review --spec ./spec.md
requirements-checklist run --variant stakeholder-gate --spec ./requirements.yaml
```

## Variants

### Author Pre-Review (~50 items, 25–35 minutes)

Self-directed checklist for specification authors before peer review. Catches common quality gaps: ambiguous success criteria, missing acceptance scenarios, inconsistent terminology.

**User Story**: Author completes spec → runs checklist → receives overall score and prioritized fix list → improves spec → submits to peer review.

### Peer Review (~50 items, 40–50 minutes)

Structured checklist for peer reviewers ensuring consistent evaluation across all 8 dimensions. Provides quantitative metrics and qualitative guidance.

**User Story**: Peer reviewer receives spec → runs peer-review variant → generates structured review report → identifies dimension-specific issues → submits findings to author.

### Stakeholder Gate (~25 items, 10–20 minutes)

Lightweight, business-focused checklist for stakeholders/product managers. Validates completeness, scenario coverage, and dependencies without technical jargon.

**User Story**: Stakeholder reviews spec → runs stakeholder-gate variant → validates business alignment → signs off with documented evidence.

### Cross-Project Integration (~30 items, 15–25 minutes)

Dependency-focused checklist for technical leads validating specs from dependent projects. Ensures cross-project contracts and interface clarity.

**User Story**: Tech lead from Project A reviews spec from Project B → runs integration variant → identifies missing/unclear contracts → feeds back to Project B author.

## Dimensions

1. **Completeness** — Required sections present, coverage of all scenarios and edge cases
2. **Clarity** — No vague adjectives without quantifiable thresholds, clear terminology
3. **Consistency** — Consistent naming, no terminology drift, clear definitions
4. **Measurability** — All success criteria quantified, testable outcomes defined
5. **Scenario Coverage** — Primary user journeys, alternative flows, negative cases documented
6. **Edge Cases** — Boundary conditions, error states, and unusual scenarios identified
7. **Dependencies** — Cross-project dependencies, assumptions, and constraints documented
8. **Ambiguities** — No ambiguous requirements, clear acceptance criteria, unresolved decisions flagged

## Results Format

Checklist results are JSON objects with the following structure:

```json
{
  "overall_score": 85,
  "dimension_scores": {
    "completeness": 90,
    "clarity": 80,
    "consistency": 85,
    ...
  },
  "findings": [
    {
      "item_id": "CL-003",
      "dimension": "clarity",
      "status": "fail",
      "message": "Vague adjective 'fast' without quantifiable threshold",
      "evidence": "\"response time should be fast\"",
      "suggestion": "Replace with specific metric: 'response time < 100ms'"
    }
  ],
  "completion_time_ms": 1250,
  "generated_at": "2026-09-17T10:30:00Z"
}
```

## Testing

Run the full test suite:

```bash
npm test
```

With coverage:

```bash
npm run test:coverage
```

Watch mode for development:

```bash
npm run test:watch
```

## Architecture

```
src/
├── lib/
│   ├── index.ts              # Main API entry point
│   ├── types.ts              # TypeScript interfaces
│   ├── checklist-engine.ts   # Core validation loop
│   ├── utils/
│   │   ├── spec-parser.ts    # Parse Markdown/YAML/JSON
│   │   ├── scoring.ts        # Hierarchical scoring
│   │   └── result-formatter.ts
│   ├── dimensions/           # 8 quality dimension implementations
│   └── templates/            # 4 checklist variants
└── cli/
    └── index.ts              # Command-line interface
```

## Contributing

See `../../CLAUDE.md` for contribution guidelines.

## License

MIT
