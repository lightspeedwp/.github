---
name: Documentation Generator
# Generation-class agents create content like docs, reports, summaries, etc.

description: >
  Automated documentation generation agent that creates comprehensive technical
  and user documentation from code, specifications, and templates. Generates
  API documentation, user guides, troubleshooting guides, migration guides, and
  release notes. Supports multiple output formats (Markdown, HTML, PDF) and
  integrates with version control systems for automatic documentation updates.
# This agent demonstrates content creation and templating capabilities

file_type: .agent.md

category: generation
# Generation agents focus on creating new content (docs, code, reports)
# They typically integrate with version control and publishing systems

status: active

version: 1.1.0

created_date: 2026-08-20

updated_date: 2026-09-03

created_by: claude@lightspeedwp.agency

last_updated_by: claude@lightspeedwp.agency

approval_status: approved

implementation_reference: agents/documentation-generator/
# Generation agents often have template libraries and output formatters

supported_platforms: [github, gitlab, web, api, slack]
# Documentation generators integrate with version control platforms
# They publish to multiple channels (docs sites, PDF, Slack)

required_capabilities: [code_parsing, template_rendering, markdown_processing, pdf_generation]
# Content generation requires specialized libraries for rendering and formatting

tags: [documentation, content-generation, auto-docs, api-docs, release-notes]

---

## Overview

The Documentation Generator agent is a generation-class agent designed to create comprehensive documentation automatically from code, specifications, and content templates. It reduces manual documentation work by extracting information from source code, generating structured documentation, and publishing it to multiple platforms.

### Key Capabilities

- **API Documentation:** Auto-generates API reference from code annotations and schemas
- **User Guide Generation:** Creates step-by-step guides from specifications and examples
- **Troubleshooting Guide:** Generates common issues and solutions from error logs and support tickets
- **Release Notes:** Automatically creates release notes from commits and PRs
- **Architecture Documentation:** Generates system architecture diagrams from code structure
- **Migration Guide:** Creates migration guides when APIs or systems change
- **Changelog Management:** Maintains structured changelogs in multiple formats

### Supported Content Types

- API reference documentation (REST, GraphQL, gRPC)
- User guides and tutorials
- Architecture documentation
- Troubleshooting guides
- Release notes and changelogs
- SDK/library documentation
- Configuration reference
- Security documentation

## Implementation Requirements

### Directory Structure

```
agents/documentation-generator/
├── SKILL.md                        # Technical documentation
├── README.md                       # User-facing documentation
├── src/
│   ├── code-parser.js            # Extract documentation from code
│   ├── template-engine.js        # Process documentation templates
│   ├── schema-analyzer.js        # Analyze API/data schemas
│   ├── markdown-renderer.js      # Generate Markdown output
│   ├── html-renderer.js          # Generate HTML output
│   ├── pdf-generator.js          # Generate PDF output
│   └── git-integration.js        # Version control integration
├── templates/
│   ├── api-reference.hbs
│   ├── user-guide.hbs
│   ├── troubleshooting.hbs
│   ├── release-notes.hbs
│   └── migration-guide.hbs
└── tests/
    ├── code-parser.test.js
    ├── template-engine.test.js
    ├── renderer.test.js
    └── git-integration.test.js
```

### Dependencies

- Code parsing libraries (AST parsers for multiple languages)
- Template engines (Handlebars, Jinja2)
- Markdown processors (unified, remark)
- PDF generation (wkhtmltopdf, Puppeteer)
- Schema validators (JSON Schema, OpenAPI)
- Git libraries (nodegit, pygit2)
- Static site generators (Hugo, Jekyll, Docusaurus)

### Configuration Example

```yaml
# Documentation Configuration
documentation:
  output_formats: [markdown, html, pdf]
  default_language: english
  license: mit
  
  # API Documentation
  api_docs:
    include_examples: true
    include_schemas: true
    group_by_tag: true
    
  # User Guides
  user_guides:
    include_screenshots: true
    include_video_links: true
    toc_depth: 3
    
  # Release Notes
  release_notes:
    group_by_type: true
    include_authors: true
    include_commit_links: true

  # Publishing
  publishing:
    platform: github_pages
    branch: docs-output
    auto_commit: true
    commit_message: "docs: Auto-generated documentation"
```

## Usage Examples

### Example 1: API Documentation from Code

```
Input: REST API with JSDoc comments and OpenAPI schema
Process:
  1. Parse code for JSDoc comments and function signatures
  2. Load OpenAPI schema for endpoint definitions
  3. Extract request/response examples from tests
  4. Generate API reference from parsed information
  5. Create endpoint grouping by tag
  6. Generate Markdown and HTML output
  7. Commit changes to docs branch
Output: Complete API documentation with 50+ endpoint references
```

### Example 2: User Guide Generation

```
Input: Agent specification and tutorial template
Process:
  1. Parse agent specification for key features
  2. Load user guide template with sections
  3. Extract examples from specification
  4. Generate step-by-step instructions
  5. Create screenshots placeholders with guidance
  6. Render to Markdown format
  7. Publish to documentation site
Output: Comprehensive user guide with setup, features, and troubleshooting
```

### Example 3: Changelog Generation with Release Notes

```
Input: Git commits from last release tag to current
Process:
  1. Fetch commits since last release tag
  2. Parse commit messages for type and scope
  3. Group changes by type (feat, fix, docs, perf, etc.)
  4. Extract related PRs and issues
  5. Generate summary for each change group
  6. Create release notes with highlights
  7. Generate changelog entry
Output: Release notes and changelog entry ready for publication
```

### Example 4: Migration Guide Generation

```
Input: API schema changes from v1 to v2
Process:
  1. Compare v1 and v2 API schemas
  2. Identify breaking changes
  3. Identify deprecated endpoints/fields
  4. Generate before/after examples
  5. Create step-by-step migration instructions
  6. List common migration issues
  7. Add troubleshooting tips
Output: Complete migration guide with examples and solutions
```

## Validation Rules

- **Template Format:** Must be valid Handlebars/Jinja2 template
- **Output Format:** Must be one of: markdown, html, pdf, json
- **Language:** Must be one of: english, spanish, french, german, etc.
- **Input Source:** Must reference valid code repository or specification
- **License:** Must be one of: mit, apache2, gpl3, proprietary

## Error Handling

The agent must handle:

- Missing or invalid documentation source code
- Malformed templates or configuration
- Broken internal links in generated documentation
- Missing assets (images, diagrams)
- Character encoding issues
- File system errors during output generation
- Publishing failures (Git, HTTP, etc.)

## Performance Considerations

- Large API specs: Process in parallel (50+ endpoints in < 30 seconds)
- PDF generation: Stream output for large documents
- Git operations: Batch commits for multiple files
- Template processing: Cache compiled templates
- Output caching: Serve cached docs if source unchanged

## Quality Assurance

- Validate all links (internal and external)
- Check for broken references
- Spell check documentation
- Verify code examples compile/run
- Validate Markdown and HTML syntax
- Test PDF rendering across platforms

## Documentation Standards

- Uses UK English spelling conventions
- Follows semantic Markdown structure
- Includes accessibility guidelines
- Provides semantic HTML markup
- Uses consistent code syntax highlighting

## Customization

Supports custom templates for:

- Organization-specific branding
- Custom section structures
- Unique output formats
- Integration with external systems
- Custom metadata and frontmatter

## Integration Points

- Integrates with GitHub for commits and PRs
- Pulls data from CI/CD systems for release info
- Connects to API schema registries
- Feeds documentation to CMS systems
- Publishes to static site generators

## Related Specifications

- **Content Moderator:** May use this agent to generate policy documentation
- **Data Analyst:** Uses this agent to generate analytics reports
- **Security Auditor:** Generates security audit documentation

## Monitoring

- Track documentation build times
- Monitor broken links in generated docs
- Alert on template rendering failures
- Log all publishing operations
- Generate documentation quality metrics

---

For technical implementation details, see [SKILL.md](agents/documentation-generator/SKILL.md)  
For usage examples and templates, see [README.md](agents/documentation-generator/README.md)  
For troubleshooting and common issues, see [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
