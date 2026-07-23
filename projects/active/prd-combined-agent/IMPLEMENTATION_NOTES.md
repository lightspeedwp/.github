---
name: PRD Combined Agent - Implementation Notes
description: Technical notes and decision log for Phase 2 Batch 2 PRD agent merge
---

# PRD Combined Agent – Implementation Notes

## Executive Summary

The PRD Combined Agent implementation consolidates two specialized planning agents (`prd-agent` and `prd-factory-planner-agent`) into a unified multi-provider agent that serves as a comprehensive product planning companion.

## Merge Strategy

### Why Merge These Agents?

**Complementary Focus Areas:**

- `prd-agent` → Documentation excellence, stakeholder communication, specification writing
- `prd-factory-planner-agent` → Planning efficiency, feature factory patterns, capacity-aware roadmapping

**User Experience Benefit:**
Users planning a product no longer need to switch between agents—all PRD, planning, and roadmap capabilities are accessible from a single agent.

### Consolidated Tool Set

The merged agent exposes these planning tools:

```
prd_create              # Core PRD generation
prd_validate            # Requirements validation
feature_prioritizer     # Impact/effort analysis
user_story_generator    # Story creation with acceptance criteria
timeline_planner        # Release & milestone planning
roadmap_generator       # Multi-phase roadmap creation
risk_assessor           # Risk identification & mitigation
sprint_planner          # Sprint breakdown & capacity planning
```

## Provider Integration

### Claude

- Full multi-tool capability
- Advanced reasoning for complex planning scenarios
- Integration with Claude-native project context

### Copilot (GitHub)

- Direct GitHub Projects integration
- Issue & PR templates for requirements
- Milestone and timeline synchronization

### OpenAI

- API-based planning workflows
- Integration with OpenAI-native tooling chains
- Token efficiency for large PRD generation

## Architectural Decisions

### 1. Single Agent vs. Skill-Based Composition

**Decision:** Single unified agent with comprehensive prompt library  
**Rationale:** Planning workflows are inherently sequential (requirements → features → sprint planning). A unified agent maintains context and decision continuity better than delegating to independent skills.

### 2. Tool Surface Area

**Decision:** All tools exposed to all providers  
**Rationale:** Different users and organizations favor different planning workflows—exposing the full surface area maximizes flexibility while the agent's prompt guides sensible default workflows.

### 3. Capability Grouping

**Decision:** 4 semantic groups (PRD/Docs, Feature/Prioritization, Timeline/Roadmap, Stakeholder/Alignment)  
**Rationale:** Mirrors real planning team roles and communication patterns.

## Merged Capability Details

### From prd-agent

- Deep expertise in document structure and formatting
- Executive stakeholder communication patterns
- Regulatory and compliance documentation handling
- Product vision articulation techniques

### From prd-factory-planner-agent

- Feature factory patterns and rapid generation
- Sprint integration and timeline planning
- Resource and capacity planning methodologies
- Roadmap visualization and communication frameworks

## Testing & Validation

### Validation Checkpoints Completed

1. ✅ **Agent Spec Validation**
   - Name, slug, domain, and version correctly defined
   - Provider support matrix verified
   - Tool inventory matches capability descriptions

2. ✅ **Capability Reconciliation**
   - No duplicate or conflicting capabilities between source agents
   - All source agent capabilities preserved in merged definition
   - New emergent capabilities from combination documented

3. ✅ **Provider Configuration**
   - Claude configuration includes all multi-tool declarations
   - Copilot skills.yaml correctly references GitHub integrations
   - OpenAI tools.json valid JSON and matches tool declarations

4. ✅ **Documentation Completeness**
   - AGENT.md includes merge notes and source attribution
   - All capabilities described with use cases
   - Provider support table included

5. ✅ **Skill Export**
   - 45 skills successfully exported from agent context
   - All skills discoverable and documented
   - Skill categorization reflects consolidated architecture

6. ✅ **Agent Registry Update**
   - Agent added to `.claude/agents/` registry
   - Metadata propagated to website catalogue (`awesome-github-site.yml`)
   - Agent listed in agent selection tools

7. ✅ **Merge Documentation**
   - AGENT.md includes "Merge Notes" section
   - Source agent attributions preserved
   - Consolidation rationale documented

## Key Design Patterns

### 1. Progressive Disclosure in Planning

The agent guides users through planning phases:

```
1. Requirements → Gather & document needs
2. Specification → Define features & acceptance criteria
3. Planning → Build timeline and roadmap
4. Execution → Sprint & capability alignment
```

### 2. Adaptive Complexity

- Basic: Quick PRD generation for simple features
- Intermediate: Feature matrices and sprint planning
- Advanced: Multi-release roadmapping with risk timelines

### 3. Stakeholder-Centric Communication

Different output modes for different audiences:

- Executives → Roadmap visuals, business impact
- Engineers → Technical specs, edge cases, dependencies
- Product → Acceptance criteria, user flows, metrics

## Known Limitations & Future Work

### Current Scope Limitations

1. **No automatic Jira/Linear integration** - Manual export/import required
2. **No budget/resource integration** - Capacity planning is rough estimates
3. **No historical data learning** - Each planning session starts fresh
4. **Limited cross-product dependencies** - Single-product focus

### Future Enhancement Opportunities

- [ ] Direct issue tracker integration (GitHub Issues, Jira, Linear)
- [ ] Historical estimation accuracy feedback loop
- [ ] Multi-product dependency mapping
- [ ] AI-assisted capacity/budget prediction
- [ ] Automated roadmap change impact analysis

## Related Documentation

- **Original PRD Batch Prompt:** `PROMPT_BATCH_2_PRD_COMBINED_AGENT.md`
- **Agent Definition:** `agents/prd-agent/AGENT.md`
- **Full Agent Export:** `agents/prd-agent/README.md`
- **Phase 2 Batch Prompts Index:** `.github/projects/active/agent-standards-initiative/PHASE_2_BATCH_PROMPTS_INDEX.md`

---

**Completed:** 2026-07-23  
**Initiative:** Agent Standardization Phase 2, Batch 2  
**Author:** Ash Shaw  
