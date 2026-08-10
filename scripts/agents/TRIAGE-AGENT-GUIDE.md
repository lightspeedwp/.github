# Phase 2: Triage Agent Guide

**Status:** Phase 2 implementation complete. 4 core modules created with comprehensive test suite (30+ tests).

## Overview

Phase 2 implements the intelligent triage system that analyzes GitHub issues and suggests comprehensive metadata improvements. The system consists of 4 core analysis modules coordinated by a central orchestrator agent.

## Architecture

```
Issue → Analyzer → Validator → Suggester → Orchestrator → Recommendations
         (5 detection modules)  (validate)   (format)      (GitHub payload)
```

### Module Breakdown

#### 1. Issue Analyzer (`issue-analyzer.js`)

**Detects issue characteristics from content**

**Key Functions:**

- `detectIssueType(title, body)` → `{type, confidence}`
  - Recognizes: bug, feature, epic, story, task
  - Confidence: 0-100% based on keyword matching
  
- `detectAreaLabels(title, body)` → `[{label, confidence, matches}]`
  - Detects: frontend, backend, ci, docs, security
  - Returns sorted by confidence (highest first)
  
- `assessPriority(title, body)` → `{level, confidence}`
  - Levels: critical, important, normal
  - Uses keyword-based assessment
  
- `suggestAssignees(body, areaLabels)` → `[{assignee, confidence, reason}]`
  - Extracts @mentions from description
  - Suggests team leads based on area
  
- `detectProjectContext(title, body)` → `{project, milestone}`
  - Extracts version numbers (v1.0, v2.1)
  - Detects phase references and release info
  
- `analyzeIssue(issue)` → Complete analysis object
  - Orchestrates all detection functions
  - Returns comprehensive result with overall confidence

**Example:**

```javascript
const issue = {
  title: 'Bug: API authentication failing',
  body: 'Security issue in auth middleware. Critical for v2.0 release.',
};

const analysis = analyzeIssue(issue);
// Returns:
// {
//   type: { type: 'type:bug', confidence: 95 },
//   areas: [
//     { label: 'area:backend', confidence: 85 },
//     { label: 'area:security', confidence: 80 }
//   ],
//   priority: { level: 'priority:critical', confidence: 90 },
//   assignees: [...],
//   context: { project: 'v2.0 release', milestone: 'v2.0' },
//   confidence: { overall: 87 }
// }
```

#### 2. Template Validator (`template-validator.js`)

**Validates issue descriptions against templates**

**Key Functions:**

- `detectRequiredTemplate(type)` → Template definition
  - Returns required sections by issue type
  - Maps: feature, bug, epic, story, task
  
- `checkRequiredSections(body, type)` → `{present, missing, isComplete, completeness}`
  - Validates DoR (Definition of Ready) section
  - Validates DoD (Definition of Done) section
  - Returns completeness percentage
  
- `checkSectionQuality(body, section)` → `{present, quality, content, issues}`
  - Assesses section content quality
  - Detects: TODO placeholders, empty sections, short content
  - Quality score: 0-100%
  
- `validateTemplate(body, type)` → Complete validation result
  - Orchestrates all section checks
  - Returns detailed recommendations
  
- `generateRecommendations(sections, sectionQuality)` → `[{type, section, action, priority}]`
  - Missing sections → high priority
  - Low-quality sections → medium priority
  
- `generateTemplateFix(type)` → Markdown to append
  - Returns template sections ready to add
  
- `formatValidationComment(validation)` → GitHub markdown
  - Formatted for posting as GitHub comment

**Example:**

```javascript
const body = `## Definition of Ready
- [x] Requirements clear

## Definition of Done
- [ ] TODO: add items`;

const validation = validateTemplate(body, 'type:feature');
// Returns:
// {
//   overview: {
//     isComplete: false,
//     completeness: 100,
//     qualityScore: 65
//   },
//   requiredSections: { present: 2, missing: 0 },
//   recommendations: [
//     {
//       type: 'low-quality-section',
//       issue: 'Contains TODO/FIXME placeholders'
//     }
//   ]
// }
```

#### 3. Relationship Mapper (`relationship-mapper.js`)

**Maps issue dependencies and relationships**

**Key Functions:**

- `parseRelationships(body)` → `{parent, blockedBy, blocking}`
  - Extracts parent issue reference (Epic/parent)
  - Extracts blocked-by relationships (depends on, blocked by)
  - Extracts blocking relationships (blocks, unblocks)
  - Case-insensitive parsing
  
- `validateRelationships(relationships)` → `{isValid, issues}`
  - Detects circular dependencies
  - Flags suspicious patterns (too many blockers)
  - Returns issue severity levels
  
- `suggestRelationships(title, body, type)` → `{parentEpic, relatedIssues}`
  - Suggests parent epic for phase/feature references
  - Recommends related issue search
  
- `formatRelationships(relationships)` → Markdown string
  - Formats for GitHub comment display
  
- `generateRelationshipGraph(issueNumber, relationships)` → Graph object
  - Creates dependency tree structure
  - Calculates relationship depth
  
- `validateRelationships` → Validation result with fixes

**Example:**

```javascript
const body = `Parent: #123
Blocked by: #456
Blocks: #789`;

const relationships = parseRelationships(body);
// Returns:
// {
//   parent: 123,
//   blockedBy: [456],
//   blocking: [789]
// }

const validation = validateRelationships(relationships);
// Returns: { isValid: true, issues: [] }
```

#### 4. Metadata Suggester (`metadata-suggester.js`)

**Generates structured suggestions from analysis**

**Key Functions:**

- `generateSuggestions(analysis, minConfidence=70)` → Suggestions object
  - Filters by confidence threshold
  - Returns: type, areas, priority, assignees, project, milestone
  - Includes reasoning for each suggestion
  
- `formatSuggestionsForComment(suggestions)` → GitHub markdown
  - Ready-to-post GitHub comment format
  - Includes confidence percentages
  - Professional formatting with icons
  
- `formatSuggestionsAsJSON(suggestions)` → JSON string
  - Programmatic use via APIs
  
- `shouldAutoApply(analysis, threshold=85)` → Boolean
  - Determines if suggestions are confident enough
  - Requires: type confidence ≥ threshold
  - Requires: primary area confidence ≥ threshold
  
- `suggestCustomFields(analysis)` → `{domain, team, risk}`
  - Generates domain from primary area
  - Suggests team from assignee
  - Maps priority to risk level
  
- `generateGitHubPayload(suggestions)` → API-ready object
  - Includes labels array
  - Includes assignees without @ symbol
  - Includes milestone
  - Removes undefined fields

**Example:**

```javascript
const analysis = analyzeIssue(issue);
const suggestions = generateSuggestions(analysis, 70);

// Returns:
// {
//   type: { suggestion: 'type:bug', confidence: 95, reason: 'Detected from keywords' },
//   areas: [{ label: 'area:backend', confidence: 85, reason: '...' }],
//   priority: { level: 'priority:critical', confidence: 90, reason: '...' },
//   assignees: [...],
//   project: { suggestion: 'v2.0', confidence: 75, reason: '...' }
// }

const payload = generateGitHubPayload(suggestions);
// {
//   labels: ['type:bug', 'area:backend', 'priority:critical'],
//   assignees: ['john', 'backend-team'],
//   milestone: 'v2.0'
// }
```

#### 5. Main Orchestrator (`issue-triage.agent.js`)

**Coordinates all modules and GitHub API integration**

**Usage:**

```bash
# Triage single issue
node issue-triage.agent.js --issue=1234

# Custom confidence threshold
node issue-triage.agent.js --issue=1234 --min-confidence=80

# JSON output
node issue-triage.agent.js --issue=1234 --output=json

# Dry-run mode
node issue-triage.agent.js --issue=1234 --dry-run
```

**Features:**

- Fetches issue from GitHub API
- Runs all 4 analysis modules
- Generates suggestions
- Validates template compliance
- Checks relationship consistency
- Determines auto-apply eligibility
- Formats results for display/API

## Confidence Scoring

All detection modules return confidence scores (0-100%):

- **90-100%:** High confidence, safe to auto-apply
- **70-89%:** Good confidence, recommend review
- **50-69%:** Moderate confidence, for reference
- **<50%:** Low confidence, discard

**Auto-Apply Threshold:** 85%+ confidence across type + area + priority

## Integration Points

### Phase 1 Audit Script

- Inventory metadata gaps across all issues
- Baseline for improvement tracking

### Phase 3 Label Handlers

- 8 status-specific handlers (needs-triage, needs-template, etc.)
- Apply Phase 2 suggestions automatically
- Orchestrated via central handler

### GitHub API

- Fetch issue details
- Apply labels and assignees
- Post validation comments
- Update issue metadata

## Testing

**Test Suite:** 30+ unit tests

- Issue Analyzer: Type/area/priority detection
- Template Validator: Section validation and fixes
- Relationship Mapper: Dependency parsing and validation
- Metadata Suggester: Suggestion generation and formatting

**Run Tests:**

```bash
npm test -- scripts/agents/__tests__/issue-analyzer.test.js
npm test -- scripts/agents/__tests__/template-validator.test.js
npm test -- scripts/agents/__tests__/relationship-mapper.test.js
npm test -- scripts/agents/__tests__/metadata-suggester.test.js
```

## Next Steps (Phase 3)

1. **Create 8 Label-Specific Handlers**
   - handle-needs-triage.js
   - handle-needs-template-fix.js
   - handle-needs-assignee.js
   - handle-needs-milestone.js
   - handle-needs-project.js
   - handle-needs-relationships.js
   - handle-needs-custom-fields.js
   - handle-needs-labels.js

2. **Create Central Orchestrator**
   - Route issues by status label
   - Apply handler recommendations
   - Track remediation progress

3. **Integration Testing**
   - Test against real 352+ issue dataset
   - Validate auto-apply thresholds
   - Monitor suggestion accuracy

4. **Deployment**
   - Create GitHub Actions workflow
   - Schedule periodic triage runs
   - Generate remediation reports

## References

- **Epic:** [Issue #1679](https://github.com/lightspeedwp/.github/issues/1679)
- **Phase 1 audit:** [Issue #1680](https://github.com/lightspeedwp/.github/issues/1680)
- **Phase 2 planning:** [Issue #1690](https://github.com/lightspeedwp/.github/issues/1690)

---

**Last Updated:** 2026-08-09
**Status:** Phase 2 implementation complete, ready for Phase 3 label handlers
