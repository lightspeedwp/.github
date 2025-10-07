---
mode: 'agent'
description: 'Organization-wide Copilot instructions for all LightSpeed WordPress projects.'
---

# GitHub Copilot Custom Instructions for LightSpeed Projects

## Overview

This repository provides organization-wide Copilot instructions and prompt templates for all LightSpeed WordPress projects. These resources help ensure code quality, consistency, and best practices across all repositories.

## Coding & Styling Guidelines

-   Follow WordPress coding standards for PHP, JavaScript, and CSS
-   Use comprehensive inline documentation following WordPress standards:
    -   [WordPress PHP Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/)
    -   [WordPress JavaScript Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/)
    -   [Inline Documentation Standards (Overview)](https://developer.wordpress.org/coding-standards/inline-documentation-standards/)
    -   [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
-   Use `theme.json` for color palettes, typography, spacing, and layout settings
-   Prefer native WordPress block patterns and core blocks
-   Maintain accessibility: semantic HTML, ARIA roles, alt text, and correct heading hierarchy
-   Use semantic CSS naming (BEM or utility-first), avoid inline styles, and optimize assets

## Workflow Expectations

-   Use GitHub Issues to track tasks, feature branches, and Pull Requests for code review
-   Log time and reference issues in commit messages (e.g. `Closes #5`)
-   Keep documentation up to date (README, learning journal, new patterns/templates)
-   Use Playwright or similar tools for accessibility and end-to-end testing

## Using Instructions & Prompts

-   `.github/.github/instructions/` contains `.instructions.md` files for file-type-specific Copilot guidance
-   `.github/.github/prompts/` contains reusable prompt templates for code review, accessibility, and pattern generation
-   Reference these files in your workflow for consistent standards across all LightSpeed projects

## Maintaining These Resources

-   Keep instructions and prompts generic and reusable for any LightSpeed WordPress project
-   Update as standards evolve or new best practices emerge
-   Document significant changes in commit messages

For more details, see the README files in the `instructions` and `prompts` folders.
