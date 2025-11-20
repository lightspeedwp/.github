# ChatGPT Instructions Explainer

This document describes how to create high‑quality instruction files for ChatGPT sessions at LightSpeed. Clear instructions ensure that the model understands the task, applies the right tone and conventions, and produces reproducible results.

## Purpose

Instruction files provide ChatGPT with context about **who** it is acting as, **how** it should communicate, **what** the task is, and **any constraints or best practices** to follow. They act as a reusable briefing that can be referenced by prompt templates or embedded in Copilot Spaces.

## Structure

Each instructions file should:

- Begin with optional **front matter** (YAML) describing metadata such as `title`, `description`, `last_updated`, `version` and `owners`. Use ISO dates and version numbers. This makes the file self‑documenting.
- Use only **H1 headings (`#`)** for sections and **bulleted lists** for details. Avoid bold, italics or other markdown styling unless absolutely necessary. This minimises formatting noise when copied into Copilot Spaces.
- Follow the **standard heading set** listed in the template (see `chatgpt-instructions-template.md`). Headings marked **(required)** must be included; headings marked **(optional)** can be removed if not relevant to a specific task.
- End with a separator (`---`) followed by the three closing lines:
  - `Provide safe defaults; mark optional flags clearly.`
  - `Start by asking about any LightSpeed internal process, documentation, or best practice. This Space is your single source of truth for LightSpeed workflows.`
  - `Aim for small, safe, well‑documented steps that make the Figma → WordPress handoff effortless.`
    These lines remind ChatGPT and users of our safety and quality expectations.

## Customising Instructions

When creating a new instructions file:

1. **Define the role and tone** – Under `# Role` describe who ChatGPT is (e.g. “senior WordPress engineer”, “project researcher”) and reference any frameworks or patterns to follow. Under `# Style` specify the tone (e.g. neutral UK English), target audience and language guidelines.
2. **State the purpose** – Clearly explain what the instructions are for (e.g. deep research, generating images). Use the `# Purpose` section to capture the outcome.
3. **Describe the task type and process** – Use `# Type of Task` and `# Process` to outline the activity (e.g. “conduct competitive analysis”) and high‑level steps.
4. **Include constraints and guardrails** – In `# Constraints`, specify limits like character counts or banned tools. Use `# Guardrails` for safety rules and prohibited outputs.
5. **Provide checklists and outputs** – At the end, include a `# Checklist relevant to instructions` and `# Outputs` sections listing what to verify (e.g. “all sources cited”) and what deliverables are expected (e.g. “report.md”, “image.png”).
6. **Remove irrelevant sections** – If a heading isn’t applicable, remove it. The heading order should remain unchanged.

## Best Practices

- **Be explicit** – Clear instructions lead to better outputs. Specify the audience, desired format and any examples or templates.
- **Emphasise research** – Encourage ChatGPT to search for up‑to‑date information and cite sources. For tasks involving internal data, use connectors (e.g. Google Drive, GitHub) where permitted.
- **Stay concise** – Long instructions can confuse the model. Use short bullet points and avoid repeated information.
- **Align with LightSpeed values** – Use metric units, neutral UK English, and emphasise scalable, clean, and maintainable solutions. Avoid hype and focus on real‑world applications.

By following these guidelines, you can create instruction files that empower ChatGPT to perform complex tasks effectively while staying aligned with LightSpeed’s processes and quality standards.
