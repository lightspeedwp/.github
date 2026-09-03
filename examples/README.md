# Agent Specification Examples

This directory contains real-world, annotated agent specification examples demonstrating best practices and various use cases for the agent specification system.

## Overview

Each example in this directory is a complete, valid agent specification that you can use as a reference or starting point for your own agents. The specifications include:

- **Comprehensive Annotations:** Detailed inline comments explaining frontmatter fields and design choices
- **Best Practices:** Demonstrations of correct formatting and validation
- **Real-World Scenarios:** Practical examples with usage patterns and examples
- **Implementation Guidance:** Reference to implementation directories and dependencies
- **Integration Patterns:** Shows how agents integrate with systems and platforms

## The Examples

### 1. Content Moderator (`content-moderator.agent.md`)

**Category:** Governance  
**Status:** Active  
**Purpose:** Content policy enforcement and moderation

A governance-class agent that demonstrates:

- How to structure policy enforcement agents
- Handling multiple content types (text, image, video)
- Validation and approval workflows
- Appeals processing and human review loops
- Integration with multiple platforms (Slack, Discord, web)

**Use this example when:**

- Building policy enforcement agents
- Creating agents that validate and flag content
- Designing approval/review workflows
- Implementing platform integrations

### 2. Data Analyst (`data-analyst.agent.md`)

**Category:** Analysis  
**Status:** Active  
**Version:** 1.2.1 (shows versioning maturity)  
**Purpose:** Data analytics, insights, and reporting

An analysis-class agent that demonstrates:

- Data source connections and integrations
- Statistical analysis and forecasting
- Report generation and visualization
- Real-time streaming data processing
- BI platform integration (Tableau, Power BI)

**Use this example when:**

- Building analytics or data processing agents
- Creating agents that generate insights
- Designing data transformation workflows
- Implementing real-time processing

### 3. Documentation Generator (`documentation-generator.agent.md`)

**Category:** Generation  
**Status:** Active  
**Version:** 1.1.0  
**Purpose:** Automated documentation creation

A generation-class agent that demonstrates:

- Content generation from structured data
- Template-based output rendering
- Multiple output formats (Markdown, HTML, PDF)
- Version control integration
- Publishing and distribution

**Use this example when:**

- Building content generation agents
- Creating documentation automation
- Designing template-based systems
- Implementing publish/distribution workflows

### 4. Security Auditor (`security-auditor.agent.md`)

**Category:** Governance  
**Status:** Active  
**Version:** 2.0.0 (shows major version progression)  
**Purpose:** Security auditing and compliance enforcement

A governance-class agent demonstrating:

- Multi-framework compliance checking (CIS, NIST, PCI-DSS, HIPAA)
- Infrastructure scanning and assessment
- Continuous monitoring and threat detection
- Compliance tracking and remediation management
- SIEM integration and incident management

**Use this example when:**

- Building compliance or security agents
- Creating agents for infrastructure auditing
- Designing continuous monitoring systems
- Implementing compliance frameworks

## Key Patterns Demonstrated

### Frontmatter Completeness

All examples show every required and optional frontmatter field:

- Basic metadata (name, description, category, status)
- Versioning (version, created_date, updated_date)
- Authorship tracking (created_by, last_updated_by, approval_status)
- Platform integration (supported_platforms, required_capabilities)
- Organization (tags, implementation_reference)

### Annotation Styles

Each example demonstrates annotation approaches:

**Field-level annotations** explain purpose and constraints:

```
category: governance
# Category classifies the agent's domain. Valid values:
# - governance: Policy enforcement, compliance, moderation
# - automation: Workflow automation, task execution
```

**Implementation guidance** shows structure and dependencies:

```
### Directory Structure
agents/content-moderator/
├── SKILL.md
├── README.md
├── src/
│   ├── analyzer.js
│   └── policy-matcher.js
```

**Usage examples** demonstrate real-world scenarios:

```
### Example 1: Text Content Moderation
Input: Social media post
Process: [detailed step-by-step]
Output: Moderation decision
```

### Design Patterns

The examples show various design patterns:

- **Policy Enforcement** (Content Moderator): Validation with approval workflows
- **Data Pipeline** (Data Analyst): Source → Transform → Analyze → Report
- **Content Generation** (Documentation Generator): Template + Data → Output
- **Continuous Monitoring** (Security Auditor): Scan → Assess → Report → Track

## Learning Path

Suggested order for learning the agent specification system:

1. **Start with Content Moderator** - Simplest example, clear governance pattern
2. **Review Security Auditor** - More complex governance with frameworks
3. **Study Data Analyst** - Analysis pattern and data handling
4. **Examine Documentation Generator** - Generation pattern and content creation

## Validation

All examples in this directory:

- ✅ Pass frontmatter validation
- ✅ Follow file structure conventions
- ✅ Use correct field types and values
- ✅ Include all required fields
- ✅ Are properly formatted YAML/Markdown

You can validate examples by running:

```bash
npm run validate:frontmatter -- examples/agents/*.agent.md
```

## Using These Examples

### As a Reference

When creating your own agent specification, refer to the example most similar to your use case:

```bash
cp examples/agents/content-moderator.agent.md agents/my-new-agent.agent.md
# Then edit with your specific information
```

### For Learning

Read through the annotations to understand:

- What each frontmatter field means
- Why specific design patterns are used
- How to structure implementation directories
- What capabilities and platforms are typical

### For Documentation

Link to these examples in your own documentation:

```markdown
For a governance-class agent example, see [Content Moderator](examples/agents/content-moderator.agent.md)
```

## Creating Your Own Agents

When creating a new agent specification:

1. **Choose your category** (governance, analysis, generation, automation, etc.)
2. **Find a similar example** to use as a template
3. **Copy the structure** and update the frontmatter
4. **Add your implementation reference** (actual implementation directory)
5. **Document your use cases** with real examples
6. **Validate your specification** before committing
7. **Keep annotations minimal** but explanatory

## Common Mistakes to Avoid

Looking at these examples, notice:

- ❌ **Don't skip frontmatter fields** - All required fields are shown
- ❌ **Don't invent field values** - Use documented enum values (categories, statuses, etc.)
- ❌ **Don't mix annotation styles** - Be consistent in how you document
- ❌ **Don't remove examples** - Real examples help others understand your agent
- ✅ **Do include implementation details** - Directory structure, dependencies, etc.
- ✅ **Do show error cases** - How does your agent handle failures?
- ✅ **Do link to detailed docs** - Point to SKILL.md, README.md, troubleshooting

## Related Documentation

For more information about the agent specification system:

- **[MIGRATION_GUIDE.md](../docs/MIGRATION_GUIDE.md)** - How to migrate existing agents to this format
- **[TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[API_REFERENCE.md](../docs/API_REFERENCE.md)** - Complete specification reference
- **[AGENTS.md](../.github/AGENTS.md)** - Organization-wide AI rules

## Questions?

If you have questions about:

- **Creating an agent specification** - See the most similar example
- **Specific field meanings** - Check [API_REFERENCE.md](../docs/API_REFERENCE.md)
- **Common problems** - See [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)
- **Migrating from older format** - See [MIGRATION_GUIDE.md](../docs/MIGRATION_GUIDE.md)

---

**Last Updated:** 2026-09-03  
**Status:** Active  
**Maintained By:** LightSpeed Team
