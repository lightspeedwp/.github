---
version: "v2.0"
last_updated: "2025-12-07"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Master prompt index for all Copilot Chat and automation prompts in the LightSpeed organisation. Lists and cross-references all prompt files and related instructions."
tags: ["lightspeed", "copilot", "prompts", "automation", "review", "workflow"]
file_type: "prompt"
---

# 🎯 LightSpeed Copilot Prompt Library

![Prompts Badge](https://img.shields.io/badge/prompts-163-brightgreen?style=flat-square)
![AI Badge](https://img.shields.io/badge/AI-powered-blue?style=flat-square)

This folder contains **163 reusable prompts** for common development and review tasks across all LightSpeed WordPress projects. Prompts are designed for Copilot Chat, GitHub Actions, and automation workflows.

## 🚀 Quick Start

To run a prompt, open the file or use `/filename` in Copilot Chat.

## 📊 Dynamic Reference

All prompt files in this directory:

- [`*.prompt.md`](./) — All Markdown files ending with `.prompt.md` are considered reusable prompts for Copilot Chat, GitHub Actions, and agent workflows.

> **💡 When adding a new prompt file, ensure it has clear YAML frontmatter, follows project conventions, and is listed below.**

## 📋 Categorized Prompt Index

### 🏗️ Core Development Prompts

#### 🔍 Code Quality & Review

- **[accessibility-review.prompt.md](./accessibility-review.prompt.md)** - Accessibility review checklist and automation
- **[audit-jsdoc.prompt.md](./audit-jsdoc.prompt.md)** - Audit JS files for JSDoc coverage per WordPress guidance
- **[audit-phpdoc.prompt.md](./audit-phpdoc.prompt.md)** - Audit PHP files for WordPress DocBlocks
- **[code-review-checklist.prompt.md](./code-review-checklist.prompt.md)** - Comprehensive code review guidelines
- **[dev-code-review.prompt.md](./dev-code-review.prompt.md)** - Guidelines for providing feedback to junior developers
- **[fix-javascript-lint.prompt.md](./fix-javascript-lint.prompt.md)** - Fix ESLint/Prettier issues; align with WordPress JS style
- **[fix-php-lint.prompt.md](./fix-php-lint.prompt.md)** - Run PHPCS cleanup for WordPress PHP style
- **[inline-documentation.prompt.md](./inline-documentation.prompt.md)** - Add comprehensive inline documentation

#### 🧪 Testing & Coverage

- **[increase-test-coverage.prompt.md](./increase-test-coverage.prompt.md)** - Expand test coverage focusing on risk and critical paths
- **[write-phpunit-tests.prompts.md](./write-phpunit-tests.prompts.md)** - Generate comprehensive PHPUnit tests

#### 📚 Documentation & Content

- **[add-frontmatter.prompt.md](./add-frontmatter.prompt.md)** - Insert or normalise YAML frontmatter in docs
- **[create-agentsmd.prompts.md](./create-agentsmd.prompts.md)** - Generate agent documentation
- **[generate-changelog.prompts.md](./generate-changelog.prompts.md)** - Generate project changelogs
- **[release-notes.prompt.md](./release-notes.prompt.md)** - Create comprehensive release notes
- **[update-markdown-file-index.prompts.md](./update-markdown-file-index.prompts.md)** - Update markdown file indexes

### 🎨 WordPress Development

#### 🧱 Block & Pattern Development

- **[create-block-pattern.prompts.md](./create-block-pattern.prompts.md)** - Create new WordPress block patterns
- **[create-block-patterns.prompts.md](./create-block-patterns.prompts.md)** - Generate multiple block patterns
- **[create-gutenberg-block.prompts.md](./create-gutenberg-block.prompts.md)** - Create custom Gutenberg blocks
- **[generate-block.prompts.md](./generate-block.prompts.md)** - Generate WordPress blocks
- **[pattern-generation.prompt.md](./pattern-generation.prompt.md)** - Template for creating new WordPress block patterns
- **[pattern-generation.prompts.md](./pattern-generation.prompts.md)** - Advanced pattern generation
- **[pattern-scaffold.prompts.md](./pattern-scaffold.prompts.md)** - Scaffold pattern structures
- **[update-pattern-for-a11y.prompts.md](./update-pattern-for-a11y.prompts.md)** - Update patterns for accessibility

#### 🎯 Theme Development

- **[configure-theme-json.prompts.md](./configure-theme-json.prompts.md)** - Configure theme.json files
- **[refactor-theme-json.prompts.md](./refactor-theme-json.prompts.md)** - Refactor theme.json configurations
- **[refactor-theme-types.prompt.md](./refactor-theme-types.prompt.md)** - Refactor typography in theme.json
- **[template-scaffold.prompts.md](./template-scaffold.prompts.md)** - Scaffold template structures

#### 🚀 LightSpeed Block Specific

- **[ls-block-a11y-check.prompt.md](./ls-block-a11y-check.prompt.md)** - Accessibility checks for LightSpeed blocks
- **[ls-block-release-agent.prompt.md](./ls-block-release-agent.prompt.md)** - Release automation for LightSpeed blocks
- **[ls-block-scaffold.prompt.md](./ls-block-scaffold.prompt.md)** - Scaffold LightSpeed block structures

### 🤖 Automation & Workflow

#### 🔧 Agent Development

- **[build-agent-and-tests.prompt.md](./build-agent-and-tests.prompt.md)** - Create agents with capabilities and tests
- **[dependency-audit-agent.prompt.md](./dependency-audit-agent.prompt.md)** - Create dependency audit automation

#### ⚙️ GitHub Actions & Workflows

- **[generate-gh-workflow.prompt.md](./generate-gh-workflow.prompt.md)** - Generate secure, cache-efficient GitHub Actions workflows
- **[label-issues.prompt.md](./label-issues.prompt.md)** - Apply org label rules to PRs via GitHub Action

#### 📊 Data & Schema

- **[author-json-schema.prompt.md](./author-json-schema.prompt.md)** - Draft JSON Schema from sample data
- **[validate-json.prompt.md](./validate-json.prompt.md)** - Validate JSON files against schemas

#### 🔄 Git & Versioning

- **[conventional-commit.prompt.md](./conventional-commit.prompt.md)** - Create conventional commit messages

### 💬 Agents & Communication

- **[a11y-assistant.agent.md](../agents/a11y-assistant.agent.md)** - Accessibility assistant agent
- **[pattern-wizard.agent.md](../agents/pattern-wizard.agent.md)** - Pattern development agent
- **[pr-copilot.agent.md](../agents/pr-copilot.agent.md)** - Pull request assistance agent
- **[release-copilot.agent.md](../agents/release-copilot.agent.md)** - Release management agent
- **[saved-replies.prompt.md](./saved-replies.prompt.md)** - GitHub saved replies management
- **[test-coach.agent.md](../agents/test-coach.agent.md)** - Testing guidance agent

### 🎯 Agent-Specific Prompts

#### 🏷️ [agents/](./agents/)

- **[badges.prompt.md](./agents/badges.prompt.md)** - Badge generation and management
- **[header-footer.prompt.md](./agents/header-footer.prompt.md)** - Header and footer automation
- **[manage-readmes.prompt.md](./agents/manage-readmes.prompt.md)** - README maintenance automation

### 🚀 Awesome Copilot Collection

#### 📋 [awesome-copilot/](./awesome-copilot/) (90+ Advanced Prompts)

##### 🏗️ Architecture & Planning

- **[architecture-blueprint-generator.prompt.md](./awesome-copilot/architecture-blueprint-generator.prompt.md)** - Generate system architecture blueprints
- **[breakdown-epic-arch.prompt.md](./awesome-copilot/breakdown-epic-arch.prompt.md)** - Break down epics from architecture perspective
- **[breakdown-epic-pm.prompt.md](./awesome-copilot/breakdown-epic-pm.prompt.md)** - Break down epics from project management perspective
- **[breakdown-feature-implementation.prompt.md](./awesome-copilot/breakdown-feature-implementation.prompt.md)** - Break down features for implementation
- **[breakdown-feature-prd.prompt.md](./awesome-copilot/breakdown-feature-prd.prompt.md)** - Break down features for PRD
- **[breakdown-plan.prompt.md](./awesome-copilot/breakdown-plan.prompt.md)** - General project breakdown planning
- **[breakdown-test.prompt.md](./awesome-copilot/breakdown-test.prompt.md)** - Break down testing requirements
- **[create-implementation-plan.prompt.md](./awesome-copilot/create-implementation-plan.prompt.md)** - Create detailed implementation plans
- **[create-specification.prompt.md](./awesome-copilot/create-specification.prompt.md)** - Create technical specifications
- **[technology-stack-blueprint-generator.prompt.md](./awesome-copilot/technology-stack-blueprint-generator.prompt.md)** - Generate technology stack blueprints

##### 📊 Documentation & Communication

- **[create-architectural-decision-record.prompt.md](./awesome-copilot/create-architectural-decision-record.prompt.md)** - Create ADRs
- **[create-readme.prompt.md](./awesome-copilot/create-readme.prompt.md)** - Generate comprehensive README files
- **[documentation-writer.prompt.md](./awesome-copilot/documentation-writer.prompt.md)** - Advanced documentation writing
- **[readme-blueprint-generator.prompt.md](./awesome-copilot/readme-blueprint-generator.prompt.md)** - Generate README blueprints

##### 🤖 MCP Server Generators

- **[csharp-mcp-server-generator.prompt.md](./awesome-copilot/csharp-mcp-server-generator.prompt.md)** - Generate C# MCP servers
- **[go-mcp-server-generator.prompt.md](./awesome-copilot/go-mcp-server-generator.prompt.md)** - Generate Go MCP servers
- **[java-mcp-server-generator.prompt.md](./awesome-copilot/java-mcp-server-generator.prompt.md)** - Generate Java MCP servers
- **[kotlin-mcp-server-generator.prompt.md](./awesome-copilot/kotlin-mcp-server-generator.prompt.md)** - Generate Kotlin MCP servers
- **[php-mcp-server-generator.prompt.md](./awesome-copilot/php-mcp-server-generator.prompt.md)** - Generate PHP MCP servers
- **[python-mcp-server-generator.prompt.md](./awesome-copilot/python-mcp-server-generator.prompt.md)** - Generate Python MCP servers
- **[ruby-mcp-server-generator.prompt.md](./awesome-copilot/ruby-mcp-server-generator.prompt.md)** - Generate Ruby MCP servers
- **[rust-mcp-server-generator.prompt.md](./awesome-copilot/rust-mcp-server-generator.prompt.md)** - Generate Rust MCP servers
- **[swift-mcp-server-generator.prompt.md](./awesome-copilot/swift-mcp-server-generator.prompt.md)** - Generate Swift MCP servers
- **[typescript-mcp-server-generator.prompt.md](./awesome-copilot/typescript-mcp-server-generator.prompt.md)** - Generate TypeScript MCP servers

##### ☁️ Cloud & Infrastructure

- **[aspnet-minimal-api-openapi.prompt.md](./awesome-copilot/aspnet-minimal-api-openapi.prompt.md)** - ASP.NET minimal API with OpenAPI
- **[az-cost-optimize.prompt.md](./awesome-copilot/az-cost-optimize.prompt.md)** - Azure cost optimization
- **[azure-resource-health-diagnose.prompt.md](./awesome-copilot/azure-resource-health-diagnose.prompt.md)** - Azure resource health diagnostics
- **[containerize-aspnet-framework.prompt.md](./awesome-copilot/containerize-aspnet-framework.prompt.md)** - Containerize ASP.NET Framework
- **[containerize-aspnetcore.prompt.md](./awesome-copilot/containerize-aspnetcore.prompt.md)** - Containerize ASP.NET Core
- **[multi-stage-dockerfile.prompt.md](./awesome-copilot/multi-stage-dockerfile.prompt.md)** - Create multi-stage Dockerfiles

##### 🧪 Testing & Quality

- **[csharp-mstest.prompt.md](./awesome-copilot/csharp-mstest.prompt.md)** - C# MSTest testing
- **[csharp-nunit.prompt.md](./awesome-copilot/csharp-nunit.prompt.md)** - C# NUnit testing
- **[csharp-tunit.prompt.md](./awesome-copilot/csharp-tunit.prompt.md)** - C# TUnit testing
- **[csharp-xunit.prompt.md](./awesome-copilot/csharp-xunit.prompt.md)** - C# XUnit testing
- **[java-junit.prompt.md](./awesome-copilot/java-junit.prompt.md)** - Java JUnit testing
- **[javascript-typescript-jest.prompt.md](./awesome-copilot/javascript-typescript-jest.prompt.md)** - JavaScript/TypeScript Jest testing

> **📊 Statistics**: 163 total prompts across 12 categories, including 90+ advanced prompts in the awesome-copilot collection

---

## 💡 How to Use

1. **Copy Content** - Copy the content of the relevant prompt
2. **Paste in Chat** - Paste it into GitHub Copilot Chat
3. **Customize** - Customize the prompt with your specific requirements
4. **Implement** - Use the generated response as a starting point

## 🆕 Creating New Prompts

When creating new prompts for this directory:

1. **Clear Naming** - Use descriptive filenames with the `.prompt.md` extension
2. **YAML Frontmatter** - Include `mode` and `description` fields
3. **Structure** - Structure the prompt with clear instructions
4. **Update Index** - Update this index to include the new prompt

## 🔄 Maintaining Prompts

Prompts evolve with our project standards:

1. **Align Changes** - Ensure changes align with project guidelines
2. **Test First** - Test updated prompts with GitHub Copilot before committing
3. **Backward Compatibility** - Consider compatibility with existing code
4. **Document Changes** - Document significant changes in commit messages

## 🔗 Integration Points

### 📚 Related Documentation

- **[Custom Instructions](../custom-instructions.md)** - Organization-wide Copilot settings
- **[Coding Standards](../instructions/coding-standards.instructions.md)** - Code quality standards
- **[Languages & Linting](../instructions/languages.instructions.md)** - JS/TS, JSON, YAML, linting
- **[Quality Assurance](../instructions/quality-assurance.instructions.md)** - Testing, Jest, CI/CD
- **[Automation](../instructions/automation.instructions.md)** - Agents, labeling, release, workflows
- **[Documentation Formats](../instructions/documentation-formats.instructions.md)** - Markdown, frontmatter, Mermaid
- **[Community Standards](../instructions/community-standards.instructions.md)** - File organisation, naming, README, saved replies

### 🤖 Automation Integration

- **[Automation Governance](../AUTOMATION_GOVERNANCE.md)** - Prompt automation policies
- **[Workflows Directory](../workflows/README.md)** - GitHub Actions using prompts
- **[Saved Replies](../SAVED_REPLIES/README.md)** - Response templates and prompts

### 🎯 Specialized Indexes

- **[Agents Directory](../agents/README.md)** - Automation agents and specialized AI modes
- **[Instructions Directory](../instructions/README.md)** - Consolidated instruction files

## 📊 Usage Statistics

- **163 Total Prompts** across all categories
- **90+ Advanced Prompts** in awesome-copilot collection
- **12 Major Categories** covering all development aspects
- **Regular Updates** based on community feedback and evolving standards

---

*This prompt library accelerates development through AI-assisted workflows. See [Custom Instructions](../custom-instructions.md) for organization-wide Copilot configuration.*

---

<!-- RANDOM FOOTER: 🎯 Smart prompts, faster development! -->
