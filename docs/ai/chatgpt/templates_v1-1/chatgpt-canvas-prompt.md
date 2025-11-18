---
file_type: "documentation"
title: "Canvas Mode Prompt Template"
description: "Template for requesting interactive components or visual documents using the Canvas tool."
last_updated: "2025-10-17"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Purpose

Use this template when you need ChatGPT to generate UI components or documents that render in the Canvas tool. Clear requirements lead to higher‑quality previews.

# Paste or reference instructions

Include the **Canvas Mode Instructions** in your Copilot Space or reference them. They outline coding standards and guardrails.

# User input checklist

- [ ] Describe the desired component or document.
- [ ] List features (e.g. responsive design, charts, animations).
- [ ] Specify design system usage (e.g. shadcn/ui, Tailwind).
- [ ] Provide sample data or content for placeholders.
- [ ] State any constraints (e.g. single file, no external dependencies).

# System constraints

- The code must compile without errors.
- Do not import libraries beyond shadcn/ui, lucide-react icons and Recharts.

# Example first message to Copilot

```
Generate a React dashboard component that displays a line chart of monthly revenue using Recharts. The dashboard should include a card showing total revenue, a card showing average order value, and a responsive chart. Use shadcn/ui cards and Tailwind for layout. Provide sample data for 12 months.
```

# Verification steps

- Ensure the generated code imports the correct components.
- Check that sample data is included and the chart renders.
- Verify that the layout is responsive and matches the design brief.
