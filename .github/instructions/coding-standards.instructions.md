---
title: "WordPress Coding Standards Instructions"
description: "Comprehensive coding standards and best practices for all LightSpeed WordPress projects."
author: "LightSpeedWP Team"
contributors:
  - name: "Ash Shaw"
    github: "ashleyshaw"
  - name: "LightSpeedWP"
    github: "lightspeedwp"
tags:
  - wordpress
  - coding-standards
  - php
  - javascript
  - css
  - best-practices
categories:
  - documentation
  - instructions
  - guides
version: "1.0.0"
permalink: "/instructions/coding-standards"
license: "GPL-3.0"
type: "instructions"
mode: "agent"
---

# Coding Standards Instructions

These guidelines apply to all WordPress projects maintained by LightSpeed.

## PHP
- Follow [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- Use 4 spaces for indentation, no tabs
- Escape and sanitize all dynamic output
- Use meaningful, descriptive function and variable names
- Add inline documentation using phpdoc

## JavaScript
- Follow [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Use ES6+ features where supported
- Prefer core WordPress scripts and libraries
- Document functions and modules with jsdoc

## CSS
- Follow [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- Use semantic class names (BEM or utility-first)
- Avoid inline styles; use theme.json or stylesheet files

## General
- Write accessible, semantic markup
- Use comments to explain complex logic
- Keep code modular and reusable

Refer to the `.github/.github/instructions/` directory for more specific instructions by file type.

