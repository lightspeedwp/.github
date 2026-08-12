---
mode: "agent"
description: "Create a formal specification for an existing GitHub Actions CI/CD workflow, optimized for AI consumption and workflow maintenance."
tools:
  [
    "changes",
    "search/codebase",
    "edit/editFiles",
    "extensions",
    "fetch",
    "findTestFiles",
    "githubRepo",
    "new",
    "openSimpleBrowser",
    "problems",
    "runCommands",
    "runInTerminal2",
    "runNotebooks",
    "runTasks",
    "runTests",
    "search",
    "search/searchResults",
    "runCommands/terminalLastCommand",
    "runCommands/terminalSelection",
    "testFailure",
    "usages",
    "vscodeAPI",
    "microsoft.docs.mcp",
    "github",
    "Microsoft Docs",
  ]
---

# Create GitHub Actions Workflow Specification

Create a comprehensive specification for the GitHub Actions workflow: `${input:WorkflowFile}`.

This specification serves as a specification for the workflow's behavior, requirements, and constraints. It must be implementation-agnostic, focusing on **what** the workflow accomplishes rather than **how** it's implemented.

## AI-Optimized Requirements

- **Token Efficiency**: Use concise language without sacrificing clarity
- **Structured Data**: Leverage tables, lists, and diagrams for dense information
- **Semantic Clarity**: Use precise terminology consistently throughout
- **Implementation Abstraction**: Avoid specific syntax, commands, or tool versions
- **Maintainability**: Design for easy updates as workflow evolves

## Specification Template

Save as: `/spec/spec-process-cicd-[workflow-name].md`

````md
---
title: CI/CD Workflow Specification - [Workflow Name]
version: 1.0
date_created: [YYYY-MM-DD]
last_updated: [YYYY-MM-DD]
owner: DevOps Team
tags: [process, cicd, github-actions, automation, [domain-specific-tags]]
---
