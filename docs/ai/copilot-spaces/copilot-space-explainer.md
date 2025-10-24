# Copilot Space Explainer

**Copilot Spaces** are interactive contexts in GitHub or VS Code where AI assistance is scoped to a specific task or project. Each Space contains a **Title**, **Description**, **Instructions**, and optional **attachments** (files, issues, pull requests, or free‑form text). Defining these elements clearly helps Copilot provide accurate and relevant assistance.

## Title
- Keep the title between 5–8 words.
- Use plain language to describe the purpose of the Space (e.g. “Tour Operator API Planning”).
- Avoid internal acronyms or ambiguous terms.

## Description
- Limit to 350 characters.
- First sentence: summarise what the Space is about and its objective.
- Second sentence: instruct the user on what they can ask Copilot within the Space (e.g. “Ask me to generate API endpoints or review data models.”).
- Use neutral UK English and avoid jargon.

## Instructions
- Limit to 4,000 characters. Use a `Character Count` line at the end to enforce the limit.
- Start with the required header:
  ```md
  # Role
  `You are a [role]. Follow our [framework/patterns] to [type of task]. Avoid [practices or tools] unless specified.`
  ```
- Use only H1 headings (`#`) and bullets (`-`)—no bold, italics or nested headings.
- Include the standard heading set (Role, Style, Purpose, etc.) but remove optional sections that don’t apply.
- End with a separator (`---`) followed by the three closing lines that remind the user of safe defaults and internal processes.
- Include a `Character Count: N` line to indicate the length. If the instructions exceed 4,000 characters, truncate the final section and append an ellipsis (`…`).

## Attachments (Files, Issues & PRs)
- **Files**: Attach relevant documents from your computer or repositories (e.g. design files, specifications). Use them to provide context. Avoid attaching large binary files unless necessary.
- **Issues & PRs**: Link to GitHub issues or pull requests related to the Space. This helps Copilot understand the current state of work and conversation history.
- **Text snippets**: You can also attach plain text containing context or requirements that doesn’t fit into the Description or Instructions fields.
- **Best Practices**:
  - Include only what’s necessary to accomplish the task. Too many attachments can confuse the model.
  - Prefer authoritative sources (internal docs, official guides) over loosely related files.
  - Update attachments as the project evolves.

## Creating a Copilot Space
When setting up a new Space:

1. **Write the Title** – Use 5–8 words describing the task.
2. **Draft the Description** – Two sentences: one about the Space, one instructing the user what to ask. Keep under 350 characters.
3. **Prepare Instructions** – Copy the relevant instruction template and customise it. Make sure to include required headings and the closing lines. Enforce the 4,000 character limit.
4. **Attach Files/Issues** – Select files from your computer or repositories, plus any relevant GitHub issues or PRs. Add free‑form text if needed.
5. **Review and Save** – Read through the fields to ensure clarity and completeness. Save the Space and test it by asking a sample question.

With well‑structured Spaces, Copilot can deliver more accurate and contextually aware assistance, improving productivity and reducing misunderstandings.
