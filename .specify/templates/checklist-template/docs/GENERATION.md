---
title: Checklist Generation Guide
description: How to generate Requirements Quality Checklists programmatically
file_type: documentation
created_date: 2026-09-17
last_updated: 2026-09-17
status: active
---

# Checklist Generation Guide

This guide covers how to generate Requirements Quality Checklists for specifications, including custom items, domain-specific variants, and audience-specific rendering.

## Quick Start

### Generate a Base Checklist

```bash
node bin/generate-checklist.js --output my-checklist.md
```

This generates a checklist with the base 24 requirements quality items across all 8 dimensions.

### Generate for a Specific Audience

```bash
node bin/generate-checklist.js \
  --audience author \
  --output author-checklist.md
```

Audiences: `author`, `peer`, `stakeholder`, `integration`

### Add Custom Items

Create a JSON file with custom items (e.g., `custom-items.json`):

```json
[
  {
    "id": "CHK-101-Custom-Completeness",
    "question": "Are API rate limits documented?",
    "dimension": "Completeness",
    "guidance": "Include rate limiting strategy"
  },
  {
    "id": "CHK-102-Custom-Clarity",
    "question": "Are authentication flows clear?",
    "dimension": "Clarity",
    "guidance": "Document auth mechanism"
  }
]
```

Then generate:

```bash
node bin/generate-checklist.js \
  --custom custom-items.json \
  --output full-checklist.md
```

## Programmatic Usage

### JavaScript API

```javascript
const { generateChecklist, generateFromBase } = require('./lib/generator.cjs');
const { mergeCustomItems } = require('./lib/custom-merger.cjs');
const { sequenceIds, validateIdSequence } = require('./lib/id-sequencer.cjs');
const { renderAudienceChecklist } = require('./lib/audience-generator');
const { checklistValidator } = require('./lib/checklist-validator.cjs');

// Step 1: Generate base checklist
const base = generateFromBase();

// Step 2: Add custom items
const customItems = [...];
const merged = mergeCustomItems(base, customItems);

// Step 3: Sequence IDs
const sequenced = sequenceIds(merged.items);

// Step 4: Validate
const validation = validateIdSequence(sequenced);
if (!validation.isValid) {
  console.error('Validation failed:', validation.errors);
}

// Step 5: Render for audience
const checklist = { ...merged, items: sequenced };
const forAuthor = renderAudienceChecklist(checklist, 'author');
```

## Checklist Structure

Each checklist contains:

- **Items**: Array of requirement quality checks
- **Metadata**: Title, version, generation timestamp, audience context
- **Dimensions**: 8 quality dimensions (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities)

### Item Format

```javascript
{
  id: 'CHK-001-Completeness',           // Required: CHK-###-Dimension format
  question: 'Are requirements complete?',  // Required: What to check
  dimension: 'Completeness',              // Required: One of 8 dimensions
  guidance: 'Include all acceptance criteria',  // Optional: How to verify
  isCustom: false                         // Optional: True if user-provided
}
```

## Dimensions

| Dimension | Focus | Example Items |
|-----------|-------|----------------|
| **Completeness** | All requirements documented | Error handling, edge cases, non-functional requirements |
| **Clarity** | Requirements are unambiguous | Vague terms, measurable criteria, consistency |
| **Consistency** | Requirements align across domains | Cross-section alignment, terminology drift |
| **Measurability** | Requirements are testable | Acceptance criteria, objective verification, metrics |
| **Scenario Coverage** | User flows documented | Happy path, errors, concurrent interactions |
| **Edge Cases** | Boundary conditions handled | Null values, partial failures, recovery flows |
| **Dependencies** | External dependencies clear | APIs, assumptions, integration points |
| **Ambiguities** | Unclear areas identified | Unresolved assumptions, missing definitions |

## Audiences

Each audience has specific guidance and time expectations:

| Audience | Time | Purpose | Focus |
|----------|------|---------|-------|
| **Author** | ~30 min | Self-check before peer review | Identifies gaps, helps author improve spec |
| **Peer** | ~45 min | Quality review | Prioritizes failures, provides feedback |
| **Stakeholder** | ~15 min | Go/no-go decision | Executive summary, decision gate |
| **Integration** | ~30 min | Dependency verification | Cross-team alignment, parallel work |

## Custom Items

Custom items let you extend the base checklist with domain-specific or organization-specific requirements.

### Best Practices for Custom Items

1. **Use proper IDs**: Start at CHK-101+ to avoid conflicts with base items (CHK-001-CHK-100)
2. **Match dimensions**: Map custom items to one of the 8 standard dimensions
3. **Be specific**: Questions should be clear and actionable
4. **Add guidance**: Include tips for how to verify each item
5. **Avoid duplicates**: Merge script automatically deduplicates by ID

### Example: API-Specific Items

```json
[
  {
    "id": "CHK-101-Custom-Completeness",
    "question": "Are all endpoints documented?",
    "dimension": "Completeness",
    "guidance": "Include request/response schemas, error codes"
  },
  {
    "id": "CHK-102-Custom-Completeness",
    "question": "Is rate limiting documented?",
    "dimension": "Completeness",
    "guidance": "Specify limits per endpoint, backoff strategy"
  }
]
```

## Validation

The generation pipeline includes three validation steps:

1. **ID Sequence Validation** (`validateIdSequence`)
   - Checks IDs are sequential (CHK-001, CHK-002, ...)
   - No gaps or duplicates
   - Format compliance

2. **Custom Item Validation** (`validateCustomItems`)
   - Required fields (id, question, dimension) present
   - Valid dimensions
   - Warnings for ID conflicts with base items

3. **Final Checklist Validation** (`checklistValidator`)
   - All 8 dimensions present
   - All items follow format
   - No duplicates

## Integration with Spec Workflow

When used as part of the spec quality workflow:

1. **Author creates spec** → runs `/speckit-checklist --audience author`
2. **Author reviews checklist** → marks gaps/ambiguities
3. **Submits for peer review** → PR includes generated checklist
4. **Peer reviewer** → uses `--audience peer` version with prioritization
5. **Stakeholder approval** → uses `--audience stakeholder` for go/no-go decision

## Checklist Files

Generated checklists are markdown files with:

- **Header**: Title and metadata
- **Dimensions as sections**: Items grouped by dimension
- **Checkboxes**: `- [ ]` for each item (unchecked by default)
- **Guidance**: Indented notes under each item

Example:

```markdown
# Requirements Quality Checklist

**Title**: Widget API Specification
**Audience**: peer

## Completeness

- [ ] CHK-001-Completeness — Are all requirements documented?
  *Guidance: Include all acceptance criteria*
- [ ] CHK-002-Completeness — Are error scenarios covered?
  *Guidance: Document error cases and handling*

## Clarity

- [ ] CHK-003-Clarity — Are vague terms defined?
  *Guidance: Replace ambiguous wording*
```

## Performance

Generation time depends on checklist complexity:

- **Base checklist** (24 items): <100ms
- **With 50 custom items**: ~200ms
- **With audience rendering**: ~300ms
- **Full pipeline** (base + variants + customs + audience): <500ms

Target: Generate checklist in <5 minutes for any spec size.

## Troubleshooting

### Issue: Duplicate IDs in generated checklist

**Cause**: Custom items use same IDs as base items  
**Solution**: Use CHK-101+ for custom items to avoid conflicts

### Issue: Validation errors for custom items

**Cause**: Missing required fields (id, question, dimension)  
**Solution**: Ensure all custom items have all required fields

### Issue: Dimension mismatch warnings

**Cause**: Item dimension doesn't match ID suffix  
**Solution**: Update ID to match dimension or fix dimension field

## See Also

- [AUDIENCE_GUIDE.md](../AUDIENCE_GUIDE.md) — How to choose audiences
- [MARKER_SYNTAX.md](../MARKER_SYNTAX.md) — Gap/ambiguity marking syntax
- [lib/generator.cjs](../lib/generator.cjs) — Core generation logic
- [lib/audience-generator.js](../lib/audience-generator.js) — Audience rendering

---

*Last updated: 2026-09-17*
