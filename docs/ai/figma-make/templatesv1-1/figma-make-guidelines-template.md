---
"title": "Figma Make Guidelines Template"
"description": "A structured template for creating a comprehensive guidelines.md for LightSpeed web projects using Figma Make."
"last_updated": "2025-10-17"
"version": "v1.0"
"owners":
  - "LightSpeed Engineering"
"file_type": "documentation"
---

# Purpose & Outcomes

- **Audience**: designers, frontend developers, QA testers and stakeholders.
- **Outcomes**: consistent UI, predictable component structure, content clarity and a shared vocabulary for tokens, spacing and typography.
- **Scope checklist**:
  - Pages and sections defined
  - React component tree and state flows mapped
  - Data/content model (CPTs, taxonomies, fields, relationships)
  - Design tokens (colour, type, spacing)
  - Global CSS architecture
  - Accessibility, performance and SEO considerations
  - Inline documentation standards (JSDoc, CSSdoc)

# Document Structure

Use the following sections to organise your `guidelines.md`. Keep each section skimmable with short bullets, tables and examples.

1. **Project Overview** – Brief description of the project’s goals, target audience and key features.
2. **Brand & Voice** – Summarise the brand identity, tone of voice and personality traits. Include logo usage notes.
3. **Design Tokens** – Define colours (semantic and functional), typography (fonts, sizes, weights), spacing scales, elevations, motion and any other tokens. Explain naming conventions and provide examples.
4. **Layout System** – Describe containers, grids and breakpoints. Provide examples of common layouts (e.g. two‑column, hero + sidebar).
5. **Global CSS Architecture** – Explain how tokens feed into utilities, then into components. Describe CSS organisation (e.g. utility classes, component stylesheets) and naming conventions.
6. **React Component Architecture** – Define naming conventions (PascalCase for components, camelCase for utilities) and folder structure. Differentiate between foundations, primitives, composites, sections and pages.
7. **React Component Diagram** – Include a tree diagram of components and a Mermaid chart showing data flows and state ownership.
8. **Content & Data Model** – Detail custom post types, taxonomies, custom fields and relationships. Provide a data dictionary and diagrams.
9. **Page‑by‑Page Specs** – For each page/template, list sections, components, content requirements and interactions.
10. **Accessibility & Performance** – Specify a11y requirements (contrast ratios, ARIA labels), performance budgets, and optimisation techniques (lazy loading, code splitting).
11. **SEO & Metadata** – Describe the required meta tags, structured data (JSON‑LD), favicon and `llms.txt` usage.
12. **Content Standards** – Define tone, microcopy guidelines and alt text requirements.
13. **Inline Documentation Standards** – Outline JSDoc and CSSdoc requirements. Include examples of documented components and styles.
14. **Acceptance Criteria & Checklists** – Provide checklists for tokens, components, pages, accessibility, performance, SEO and documentation. Use “Do/Done” style lists.
15. **First‑Prompt(s) for AI/Code Generation** – Suggest initial prompts to generate scaffolding or components using AI tools.

# Naming & Conventions

- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities, `kebab-case.css` for styles.
- Components: compose from foundations → primitives → composites → sections → pages. Co‑locate minimal styles; keep tokens global.
- Props: TypeScript interfaces end with `Props`.
- CSS: custom properties use semantic names; group by token set; use BEM for authored classes.

# Tokens Before Pixels

- Define colour, type and spacing tokens before coding any layouts. Use CSS `clamp()` for fluid typography and spacing. Publish a single global CSS file exposing tokens and low‑level utilities.

# Content & Data Model Up‑Front

- Model content early to prevent rework. Specify CPTs, taxonomies, custom fields and editorial rules. Provide a relationship diagram and data dictionary.

# React Component Diagram

- Include both a monospace tree and a Mermaid diagram showing component hierarchy, state ownership and context providers.

# Inline Documentation

- Require JSDoc comments on every public component, prop, hook and util. Document CSS sections using CSSdoc. Enforce via ESLint and Stylelint.

# Acceptance Criteria & Checklists

- Use checklists to track completion of tokens, components, pages and a11y/performance/SEO requirements. Ensure each item has a clear Do/Done state.

# Additional Notes

- Keep each section concise; avoid long prose.
- Provide code snippets, file trees and diagrams where helpful.
- Link to external resources (e.g. WordPress Developer Blog, design system docs) in a references section at the end.

---
