# Getting the Most out of AI at LightSpeed

## Introduction

Artificial intelligence tools such as **ChatGPT**, **GitHub Copilot** and **Figma Make** can accelerate design, engineering and content workflows when used thoughtfully. The LightSpeed “AI‑Augmented Web Project Pipeline” roadmap emphasises integrating AI across discovery, planning, design, development and deployment phases【818080548084928†L0-L2034】. This explainer summarises how to harness these tools effectively while staying aligned with LightSpeed’s processes, standards and values.

## Key Principles

- **Purpose‑driven usage** – Always start with a clear goal: define what you need from the AI (e.g. generate wireframes, review code, create a content model). Framing the task precisely improves output quality and reduces iteration time【818080548084928†L0-L2034】.
- **Human‑in‑the‑loop** – AI suggestions are aids, not final answers. Review and refine all outputs. Maintain accountability for design decisions, code quality and copy tone. Prompt the AI to cite authoritative sources where possible and verify the results【818080548084928†L0-L2034】.
- **Minimal, modular toolchains** – Favour lightweight tools and frameworks. Only introduce heavier dependencies (e.g. complex build pipelines) when justified by project size or requirements. This aligns with LightSpeed’s preference for scalable, maintainable solutions【818080548084928†L0-L2034】.
- **Safety and ethics** – Follow safe AI practices: avoid including sensitive credentials or data in prompts, respect copyright/licensing, and ensure generated content meets accessibility and performance standards. Use GitHub Copilot’s safety settings and ChatGPT’s guardrails to reduce bias and harmful outputs【818080548084928†L0-L2034】.

## Figma Make and AI

Figma Make is LightSpeed’s preferred low‑code platform for prototyping and building WordPress sites. AI can assist with:

- **Guidelines creation** – Use ChatGPT to draft a `guidelines.md` document covering project overview, design tokens, layout system, component architecture, data models, accessibility and performance checklists. The Figma Make guidelines playbook emphasises documenting naming conventions, tokens before pixels, content models, diagrams and checklists【818080548084928†L0-L2034】.
- **Component scaffolding** – Generate React component trees and Mermaid diagrams from content models. AI can suggest component hierarchy and state flows based on CPTs (custom post types) and taxonomies.
- **Design tokens** – Let the model propose colour palettes, typography scales and spacing values. Ensure fluid typography (`clamp()`) and spacing tokens are defined before creating components【818080548084928†L0-L2034】.
- **Content generation** – For initial copy and microcopy, prompts can instruct ChatGPT to match the brand voice and tone defined in your guidelines. Always review and localise the results.

## GitHub Copilot and Repository Instructions

GitHub Copilot extends AI assistance to your codebase. To get the best results:

- **Add repository‑level instructions** – Create a `.github/copilot-instructions.md` file describing the project architecture, coding standards, build/test commands, and restrictions (e.g. no direct DB access). Task‑specific instructions can live under `.github/instructions/` and are automatically applied by Copilot【818080548084928†L0-L2034】.
- **Use prompt files** – Place reusable task prompts in `.github/prompts/` (e.g. `generate-model.prompt.md`). These provide context and ensure consistency across sessions. The *Awesome Copilot* repository demonstrates this structure【818080548084928†L0-L2034】.
- **Leverage chat modes and agents** – Custom chat modes tailor the tone (e.g. “strict reviewer” or “tutorial coach”). Agents can orchestrate a sequence of tasks (e.g. lint → test → build → deploy) by calling GitHub workflows via the Model Context Protocol. Use them sparingly and document their responsibilities clearly.
- **Guardrails and testing** – Configure GitHub Actions to run linting, tests, and build steps on every PR. Copilot will reference these checks and can assist in fixing issues. Provide minimal reproducible examples and one‑line verification commands【818080548084928†L0-L2034】.

## ChatGPT Modes and Use Cases

ChatGPT offers several modes and models tailored to different tasks. LightSpeed uses these modes to assist with research, analysis and creative tasks:

- **Deep Research** – For thorough investigations, use ChatGPT’s reasoning‑heavy model (e.g. “Thinking” or “Pro”). Provide a detailed goal, context, a desired structure (e.g. outline, table) and request citations. Use connectors (Google Drive, GitHub) to pull internal documents when permitted.
- **Agent Mode** – Involves planning and executing multi‑step tasks (e.g. building a new repository). An agent uses tools like GitHub, Google Drive and Gmail to gather data, generate code and produce deliverables. Define the agent’s role, allowed tools, inputs/outputs, guardrails and checkpoints.
- **Web Search** – Use when you need up‑to‑date information. Clearly specify the query, desired sources and recency. The model will search the internet and cite results.
- **Create Image** – For decorative assets (e.g. hero backgrounds), ask ChatGPT to generate images via the image generation tool. For real objects or people, search and use licensed photos instead.
- **Canvas** – For interactive documents or React components, the canvas tool can render previewable code. Use it when you need visual output (e.g. dashboards or slides) and ensure the code adheres to Tailwind/shadcn/ui guidelines.
- **Study and Learn** – For learning new topics, instruct ChatGPT to teach step‑by‑step, include examples and quizzes, and reference authoritative sources. Summarise information into cheat sheets or flashcards.
- **Use Connectors** – When referencing internal data, specify which connector (e.g. Google Drive, GitHub) to search. Respect privacy: only access data within your permission scope and avoid unnecessary queries.

## Best Practices and Safety

- **Define success up front** – Always include checklists and acceptance criteria in your instructions. For example, specify that generated code should pass linting and unit tests, or that a page must meet accessibility standards.
- **Respect length limits** – Copilot Spaces require descriptions ≤350 characters and instructions ≤4,000 characters. Enforce these limits by adding a `Character Count` line and truncating if necessary.
- **Cite sources** – When using research mode, request inline citations and include a final references section. This enhances trust and allows fact‑checking.
- **Use metrics** – Express dimensions in metric units and temperatures in Celsius. Provide timelines using ISO‑dates (YYYY‑MM‑DD) for clarity.
- **Iterate and refine** – AI outputs are a starting point. Review, tweak and improve them. Encourage team members to provide feedback and update templates over time.

## Conclusion

Integrating AI into LightSpeed’s workflows requires clear goals, robust instructions, and human oversight. By using ChatGPT for research and content, GitHub Copilot for coding assistance, and Figma Make for visual and structural scaffolding, teams can accelerate delivery while maintaining quality and consistency. Always pair AI assistance with rigorous review, adherence to guidelines, and a focus on customer outcomes.

---
