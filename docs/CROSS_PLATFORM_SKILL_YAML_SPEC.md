---
version: v0.1.1
last_updated: '2026-08-21'
title: Cross-Platform Skill YAML Spec
owners:
  - lightspeedwp
file_type: documentation
description: YAML specification for cross-platform skill manifests
---

# Cross-Platform Skill YAML Specification

## Overview

Skill manifests define reusable, portable capabilities that can be used across platforms (Figma, VS Code, GitHub, etc.).

## Manifest Structure

```yaml
---
# Metadata
id: skill-unique-id
name: "Skill Display Name"
version: "1.0.0"
description: "Brief description of what the skill does"
author: "Team Name"
maintainer: "Maintainer Name"
license: "MIT"

# Categorization
category: "productivity"
tags: ["tag1", "tag2"]
platform: ["github", "vscode", "figma"]

# Capabilities
capabilities:
  - name: "capability-name"
    trigger: "command" | "webhook" | "event"

# Dependencies
dependencies:
  - package: "dependency-name"
    version: "^1.0.0"
    optional: false

# Configuration
config:
  required:
    - setting_name
  optional:
    - optional_setting

# Permissions
permissions:
  - "read:repo"
  - "write:issues"

# Examples
examples:
  - title: "Example 1"
    code: "..."
---
```

## Field Reference

### Required Fields

- `id`: Unique identifier (kebab-case)
- `name`: Human-readable name
- `version`: Semantic version
- `description`: Brief description
- `author`: Original creator

### Metadata Fields

- `maintainer`: Current maintainer
- `license`: License type (MIT, Apache-2.0, etc.)
- `category`: Skill category
- `tags`: Searchable tags
- `platform`: Supported platforms

### Capabilities

Define what the skill can do with:

- `name`: Capability identifier
- `description`: What it does
- `trigger`: How it's invoked
- `inputs`: Required parameters
- `outputs`: Return values

### Dependencies

External packages the skill requires:

- `package`: Package name
- `version`: Version constraint
- `optional`: Whether required

### Configuration

Setup requirements:

- `required`: Must be configured
- `optional`: Nice-to-have settings
- Validation rules

### Permissions

Access requirements:

- Repository access levels
- API scopes
- User permissions

## Example: Comment Generation Skill

```yaml
---
id: github-pr-comment-generator
name: "PR Comment Generator"
version: "1.0.0"
description: "Automatically generates thoughtful PR comments based on code changes"
author: "LightSpeed Team"
category: "code-review"
tags: ["github", "automation", "code-review"]
platform: ["github"]

capabilities:
  - name: "analyze-diff"
    trigger: "webhook"
    inputs:
      - name: "prNumber"
        type: "number"
      - name: "owner"
        type: "string"
      - name: "repo"
        type: "string"
    outputs:
      - name: "comments"
        type: "array"

permissions:
  - "read:repo"
  - "write:issues"

config:
  required:
    - github_token
  optional:
    - enable_security_checks
    - comment_style

examples:
  - title: "Analyze PR"
    code: |
      const skill = new GitHubPRCommentGenerator(config);
      const comments = await skill.analyzeAndComment({
        prNumber: 123,
        owner: "lightspeedwp",
        repo: "github"
      });

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
