---
# FRONTMATTER EXPLANATION
# This frontmatter section defines the agent's metadata and validation rules.
# All fields below are required and must follow the specified formats.

name: Content Moderator
# The name field identifies this agent uniquely. Keep it descriptive but concise.
# Naming convention: Use title case with spaces (e.g., "Content Moderator", "Data Analyst")
# Used for: Documentation, navigation, agent discovery in the platform

description: >
  Automated content moderation agent that analyzes user-generated content,
  detects policy violations, and applies appropriate enforcement actions.
  Supports text, image, and video content moderation with customizable
  policy rules and severity thresholds.
# The description provides a comprehensive overview of the agent's purpose
# Use this space to explain: what the agent does, who uses it, and key capabilities
# Format: Multi-line string (use > for folding) or single line
# Length: Typically 2-5 sentences covering the core function

file_type: .agent.md
# File type must always be '.agent.md' for agent specifications
# This field is required and must match the actual file extension

category: governance
# Category classifies the agent's domain. Valid values:
# - governance: Policy enforcement, compliance, moderation
# - automation: Workflow automation, task execution
# - analysis: Data analysis, insights, reporting
# - integration: External system integration, API management
# - generation: Content creation, document generation
# - security: Security operations, threat detection
# - documentation: Documentation generation and maintenance
# This agent is a 'governance' agent because it enforces content policies

status: active
# Status indicates the agent's availability. Valid values:
# - active: Ready for production use
# - draft: Under development, not ready for use
# - deprecated: Superseded by newer version
# - archived: Historical reference only
# Use 'draft' during development, 'active' when production-ready

version: 1.0.0
# Semantic versioning (MAJOR.MINOR.PATCH) indicates compatibility
# Increment: MAJOR for breaking changes, MINOR for new features, PATCH for bugfixes
# Used for: Version tracking, migration planning, compatibility checks

created_date: 2026-09-01
# Date format: YYYY-MM-DD (ISO 8601)
# Represents when this specification was first created
# Used for: Timeline tracking, deprecation schedules, historical reference

updated_date: 2026-09-03
# Date format: YYYY-MM-DD (ISO 8601)
# Represents when this specification was last updated
# Used for: Change tracking, documentation currency verification

created_by: claude@lightspeedwp.agency
# Creator identifier (email or username)
# Used for: Attribution, contact information, audit trails

last_updated_by: claude@lightspeedwp.agency
# Last updater identifier (email or username)
# Used for: Change tracking, responsibility assignment

approval_status: approved
# Approval workflow status. Valid values:
# - approved: All stakeholders have reviewed and approved
# - pending: Awaiting approval from required stakeholders
# - rejected: Not approved, requires revisions
# - superseded: Replaced by newer version

implementation_reference: agents/content-moderator/
# Path to the agent's implementation directory (relative to repository root)
# This directory should contain:
#   - SKILL.md: Technical documentation and skill definition
#   - README.md: User-facing documentation
#   - src/: Implementation code (if applicable)
#   - tests/: Test suites for the agent
# The agent framework will use this to locate the agent's code

supported_platforms: [slack, web, api, discord]
# Platforms where this agent operates
# Examples: slack, web, api, discord, email, webhook
# Used for: Integration planning, deployment configuration, feature availability

required_capabilities: [text_analysis, image_analysis, policy_matching]
# Capabilities required to run this agent
# These capabilities must be available in the deployment environment
# Used for: Dependency checking, deployment validation

tags: [moderation, safety, content-control, enforcement, policy]
# Searchable tags for agent discovery
# Use lowercase, hyphenated keywords
# Examples: moderation, automation, ai-powered, real-time, async

---

## Overview

The Content Moderator agent is a governance-class agent designed to enforce content policies across multiple platforms and content types. It analyzes user submissions against configurable policy rules, detects violations, and applies enforcement actions automatically or with human review.

### Key Capabilities

- **Text Analysis:** Analyzes text content for prohibited terms, hate speech, misinformation, and spam
- **Image Analysis:** Detects inappropriate images, violent content, and policy violations
- **Video Analysis:** Processes video content with scene detection and transcript analysis
- **Policy Enforcement:** Applies configurable enforcement actions (remove, flag, warn, suspend)
- **Appeal Handling:** Manages appeals from users and forwards to human review
- **Reporting:** Generates compliance reports and violation statistics

### Supported Content Types

- Text (posts, comments, messages, articles)
- Images (photos, artwork, screenshots)
- Video (clips, streams, uploads)
- Audio (transcribed speech, podcasts)

## Implementation Requirements

### Directory Structure

```
agents/content-moderator/
├── SKILL.md                    # Skill documentation and technical reference
├── README.md                   # User-facing documentation
├── src/
│   ├── analyzer.js            # Core content analysis logic
│   ├── policy-matcher.js       # Policy rule matching engine
│   ├── enforcement.js          # Enforcement action execution
│   └── appeals-handler.js      # Appeal processing logic
└── tests/
    ├── analyzer.test.js
    ├── policy-matcher.test.js
    ├── enforcement.test.js
    └── appeals-handler.test.js
```

### Dependencies

- Content analysis libraries (for text, image, video processing)
- Policy rule engine
- Workflow management system
- Database for policy rules and violation history
- Notification system for user appeals

### Configuration

```yaml
# Policy Configuration
policies:
  hate_speech:
    severity: high
    action: remove
    notify_user: true
  spam:
    severity: low
    action: flag
    notify_moderator: true
  misinformation:
    severity: medium
    action: review
    requires_approval: true
```

## Usage Examples

### Example 1: Text Content Moderation

```
Input: Social media post containing prohibited terms
Process:
  1. Receive content submission
  2. Parse text and extract key entities
  3. Match against policy rules
  4. Calculate violation severity
  5. Apply enforcement action
Output: Violation detected, content removed, user notified
```

### Example 2: Image Content Moderation with Appeal

```
Input: User uploads image flagged as inappropriate
Process:
  1. Receive image submission
  2. Analyze image for prohibited content
  3. Flag for human review (confidence < 90%)
  4. Queue for moderator action
  5. User appeals decision
  6. Review decision with new input
  7. Confirm or reverse action
Output: Appeal processed, action confirmed
```

## Validation Rules

- **Policy Configuration:** Must reference valid policy categories
- **Severity Levels:** Must be one of: low, medium, high, critical
- **Action Types:** Must be one of: remove, flag, review, warn, suspend
- **Content Types:** Must be one of: text, image, video, audio

## Error Handling

The agent must gracefully handle:

- Invalid content formats
- Missing policy definitions
- System unavailability
- Large content processing
- Concurrent moderation requests

## Performance Considerations

- Text analysis: < 1 second per item
- Image analysis: < 5 seconds per item
- Video analysis: Real-time streaming or batch processing
- Policy matching: Configurable caching for frequently used rules

## Security Considerations

- All content analysis happens in isolated sandboxes
- User data is never permanently retained without consent
- Policy rules are audit-logged for compliance
- Appeals process has proper authorization checks
- Moderator actions are audited and can be reviewed

## Monitoring & Logging

- Track moderation accuracy metrics
- Monitor false positive/negative rates
- Log all enforcement actions with timestamps
- Alert on unusual patterns or attacks
- Generate compliance reports for legal requirements

## Migration Notes

If migrating from a previous content moderation system:

1. Export existing policy rules to new format
2. Validate all rules in new system before enabling
3. Run in shadow mode (flag only, don't enforce) for 2 weeks
4. Compare decisions with previous system
5. Gradually shift enforcement as confidence increases

---

## Related Specifications

- **Security Auditor:** Sister agent for security policy enforcement
- **Documentation Generator:** For generating compliance reports
- **Data Analyst:** For analyzing moderation metrics and trends

## Questions or Feedback?

For questions about this agent specification:

1. Check the [SKILL.md](agents/content-moderator/SKILL.md) technical documentation
2. Review [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for common issues
3. See [MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) if upgrading from previous versions
4. Open an issue with the `type:documentation` label for specification improvements
