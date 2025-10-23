---
$schema: "../frontmatter.schema.json"
file_type: "agent"
name: "wp-security-review"
description: "Performs security reviews on WordPress codebases to ensure best practices and compliance with LightSpeed security standards."
title: "WP Security Review Agent"
version: "1.0.0"
last_updated: "2025-10-22"
owners: ["lightspeedwp/maintainers"]
category: "security"
labels: ["ai-ops:agents", "type:security", "category:security"]
references:
  - "./wp-security-review-agent.js"
status: "active"
visibility: "public"
tools: ["Read"]
---

# WP Security Review Agent

This agent uses [wp-security-review-agent.js](./wp-security-review-agent.js) to perform security audits for WordPress projects.