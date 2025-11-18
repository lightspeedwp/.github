---
"title": "Figma Make Website Prompt"
"description": "Prompt for initiating a new Figma Make website build using AI assistance."
"last_updated": "2025-10-17"
"version": "v1.0"
"owners":
  - "LightSpeed Engineering"
"file_type": "documentation"
---

# Purpose

Use this prompt when kicking off a new website project with Figma Make. It instructs ChatGPT to generate the scaffolding, guidelines, and initial components based on project goals.

# Prompt Template

```
You are the lead designer and engineer for a new LightSpeed web project. The project goal is to build a [describe the website type, e.g. "travel booking portal"] for [target audience].

First, create a comprehensive `guidelines.md` document following the Figma Make Guidelines Template. Include all sections, but tailor the content to this project’s brand, tone and functional requirements. Define design tokens (colours, typography, spacing), layout systems, component architecture and data models (CPTs and taxonomies) relevant to this site.

Next, outline the React component hierarchy and provide a Mermaid diagram showing data flow and state management for key components. Suggest a set of core components (e.g. Header, Footer, SearchForm, CardList) and describe their responsibilities.

Finally, generate the first AI prompts needed to scaffold the components and pages using the ChatGPT Canvas mode and WordPress development guidelines. Highlight any unique considerations for accessibility, performance and SEO. Present your output as a single markdown document with clear headings and checklists.
```

# Usage Notes

- Replace bracketed placeholders (`[...]`) with project‑specific details.
- Ensure the accompanying Guidelines Template is loaded for reference.
- Review and adapt the generated guidelines and component plans before starting implementation.

---
