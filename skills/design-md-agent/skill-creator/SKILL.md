---
name: skill-creator
description: Guide for creating and updating high-quality skills by translating workflows, conventions, and reusable processes into well-structured skills. Includes context, use case examples and spec for skills. Use this skill whenever a user asks to create, update, edit, improve, package, or troubleshoot a skill, and also for conversational questions about skills in ChatGPT (e.g., "What are skills?", "What can I use skills for?", "What are the best skill use cases for me?", "Where can I find my skills?").
---

# Overview

## What are Skills?

Skills are small, reusable bundles of instructions and optional files or code that teach ChatGPT how to perform specific tasks or follow precise conventions consistently. Building a skill is like putting together a training manual for a new hire.

This skill is used for both creating new skills and updating existing skills.

When the user is asking what Skills are, how they help, where to start, or what they can use Skills for, answer that question first instead of jumping into the creation workflow.

## Skill Structure and Components

- **Overall structure**
  A Skill is packaged as a directory (or zip archive) that contains instructions and any supporting assets needed to perform a task. This folder is exposed to ChatGPT as a filesystem that it can navigate.
- **SKILL.md (entrypoint)**
  Every Skill must include a `SKILL.md` file. This file contains YAML frontmatter with the Skill’s name and description, followed by markdown instructions that define when the Skill should be used and exactly how ChatGPT should behave.
- **Resources and scripts**
  A Skill can include additional files and folders such as more markdown instructions, datasets, templates, or executable scripts (e.g., Python or shell). These are casually referenced from `SKILL.md` and are loaded or executed only when relevant to the specific task or step being performed.

## Skill Use Cases

- **Reusable tasks**
  Skills can bundle repeatable logic and instructions into a reliable macro, such as building a financial model, parsing documents, generating reports, or running standardized analyses.
- **Tool and connector guidance**
  Skills can encode best practices for using tools, connectors, or data sources, including which tables to query, how to structure requests, and how to format or validate outputs.
- **Conventions and standards**
  Skills are well-suited for capturing organizational conventions like brand voice, writing style, formatting rules, compliance language, or review checklists, ensuring consistency across all relevant conversations.
- **Multi-step workflows**
  Skills can support more complex workflows by coordinating instructions, scripts, and resources, and by composing with other Skills to complete end-to-end tasks across domains such as finance, legal, GTM, and operations.

## Writing Effective Skill Instructions

- **Be concise**: Skill instructions should be as lightweight as possible while still being precise. Skills share ChatGPT's context window with the system prompt, conversation history, and other active Skills. Do not include general concepts and or obvious guidance in Skill instructions - Skill content must focus on specific, opinionated, and non-obvious content. Favor short examples and concrete guidance over long explanations.
- **Constraint vs flexibility**: Choose the right level of constraint for the task at hand. For more open ended tasks or steps, feel free to use high-level but specific written guidance. For highly deterministic tasks or steps, you can include scripts and require that ChatGPT executes them directly. For anything in between, consider including template examples to guide output, pseudo-code or scripts with several parameters.

## Uploaded ZIP Intake

When the user uploads a `.zip` file and asks to install, validate, or prepare a skill from that archive, handle that request as a special intake flow before the normal skill-creation workflow.

1. Inspect the uploaded archive and determine how many skills it contains by locating `SKILL.md` entrypoints.
2. If the archive contains multiple skills, do not continue with validation or repackaging in this flow. Tell the user that uploading multiple skills is not supported here and direct them to the plugins homepage to upload the skill there.
3. If the archive contains exactly one skill, unpack it and run the skill validators against that single skill.
4. If validation fails, tell the user the validation errors and stop. Do not return a packaged skill.
5. If validation passes, package the validated skill as `skill.zip` and return that `skill.zip` to the end user.

For this uploaded-zip flow:

- Do not ask the usual skill-definition clarifying questions before inspecting the archive.
- Use the existing validator and packaging scripts when possible instead of inventing a parallel flow.
- Always return the packaged archive with the exact filename `skill.zip`.

## Skill Layout and File Organization

skill-name/
├── SKILL.md        # required
├── agents/
│   └── openai.yaml # required UI metadata (display name, icon, etc.)
├── scripts/        # optional, executable code (Python/Bash/etc.)
├── references/     # optional, documentation intended to be loaded into context as needed
└── assets/         # optional, files used in output (templates, icons, fonts, etc.)

### SKILL.md (required)

`SKILL.md` is a required file and the primary interface between ChatGPT and the skill.

- **Frontmatter (YAML)**
  Defines the Skill’s `name` and `description` and is the initial level of detail available to ChatGPT. These fields determine *when* the full Skill is discovered and auto-invoked, so they should clearly describe the task, scope, and triggering conditions. Keep name lowercase.
- **Instructions (Markdown)**
  The body contains behavioral guidance, examples, and references to other files. This content is loaded only after the Skill is selected and should focus on what ChatGPT must do precisely.

### Supporting Resources (optional)

Supporting files should exist only when they materially improve reliability, clarity, or output quality. Many skills do not require these.

- **Agent metadata (`agents/openai.yaml`)**: Required ChatGPT UI metadata.
  - Supports fields like `interface.display_name`, `interface.short_description`, icons, and brand color.
  - Prefer setting `interface.display_name` to a human-readable label (spaces, no hyphens), e.g. `"Customer Research Summarizer"` instead of `"customer-research-summarizer"`.
- **Scripts (`scripts/`)**: Deterministic code (Python, Bash, etc.) for fragile or repeatable operations.
  - Use when consistency or correctness matters
  - Prefer scripts over long procedural instructions
- **References (`references/`)**: Background material ChatGPT may need to consult while working.
  - Examples: schemas, API docs, policies, domain rules
  - Intended to be loaded into context if relevant to the current step
  - Keep large or detailed information here and reference in `SKILL.md`
- **Assets (`assets/`)**: Files used in the final output, not for reasoning.
  - Examples: slide/excel/document templates, brand assets/logos, images, fonts, boilerplate code
  - Not intended to be loaded into context, but rather used, modified or copied
  - Enables reuse without consuming context tokens
  - If requested assets/artifacts would cause the packaged skill ZIP to exceed the 25 MB limit, tell the user the artifacts are too large to upload in the skill and ask them to reduce/split/compress the assets.

## Progressive Loading and Context Efficiency

ChatGPT automatically explores Skills and their information incrementally as it becomes relevant to minimize context usage.

### How Content Is Loaded

1. **Skill metadata**
   The Skill’s name and description are always available to ChatGPT and are used solely to decide *whether* the Skill should be applied. It's crucial to explicitly explain when the Skill should be triggrered here. Aim for about 100 words.
2. **Core instructions (`SKILL.md`)**
   When a Skill is selected, ChatGPT loads the body of `SKILL.md`, which contains the essential workflow, rules, and references needed to get started. Aim for less than 500 lines.
3. **Supporting resources**
   Additional files (scripts, references, assets) are read, loaded or executed only when explicitly needed for the current step, keeping the context window lean. No limit on additional resources.

### Design Guidelines

Keep `SKILL.md` focused and compact. Treat it as a control plane, not a knowledge dump. When its content grows large (>500 lines) or branches into variants, move details into separate instruction files and clearly link to them from `SKILL.md`, explaining when they should be consulted.

### Common Organization Patterns

**Pattern 1: High-level guide with references**

```markdown
# PDF Processing
## Quick start
Extract text with pdfplumber:
[code example]

## Advanced features
- **Form filling**: See [FORMS.md](FORMS.md) for complete guide
- **API reference**: See [REFERENCE.md](REFERENCE.md) for all methods
- **Examples**: See [EXAMPLES.md](EXAMPLES.md) for common patterns
```

ChatGPT loads FORMS.md, REFERENCE.md, or EXAMPLES.md only when needed.

**Pattern 2: Domain-specific organization**
For Skills with multiple domains, organize content by domain to avoid loading irrelevant context:

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── reference/
    ├── finance.md (revenue, billing metrics)
    ├── sales.md (opportunities, pipeline)
    ├── product.md (API usage, features)
    └── marketing.md (campaigns, attribution)
```

When a user asks about sales metrics, ChatGPT only reads sales.md.

Similarly, for skills supporting multiple frameworks or variants, organize by variant:

```
cloud-deploy/
├── SKILL.md (workflow + provider selection)
└── references/
    ├── aws.md (AWS deployment patterns)
    ├── gcp.md (GCP deployment patterns)
    └── azure.md (Azure deployment patterns)
```

When the user chooses AWS, ChatGPT only reads aws.md.

**Pattern 3: Conditional details**
Show basic content, link to advanced content:

```markdown
# DOCX Processing

## Creating documents
Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents
For simple edits, modify the XML directly.
**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

ChatGPT reads REDLINING.md or OOXML.md only when the user needs those features.

**Important guidelines:**

- **Avoid deeply nested references** - Keep references one level deep from SKILL.md. All reference files should link directly from SKILL.md.
- **Structure longer reference files** - For files longer than 100 lines, include a table of contents at the top so ChatGPT can see the full scope when previewing.

## Skill Creation Process

Skill creation involves these steps:

1. Understanding the Skill with Concrete Examples by Asking Questions
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (run init_skill.py)
4. Edit the skill (implement resources and write SKILL.md)
5. Package the skill (run package_skill.py) and share with user
6. Iterate based on real usage

Follow these steps in order, skipping only if there is a clear reason why they are not applicable.

If the user uploaded a skill archive and wants it installed, validated, or prepared for upload, follow the Uploaded ZIP Intake flow above first. Resume the normal steps below only if the request is actually about creating or editing the skill contents.

When the user asks for an update to an existing skill, make the requested edits in the skill contents, then package and return the complete updated skill as `skill.zip`. Do not return only a patch, a partial folder, or a list of changed files when the user is expecting the updated skill deliverable.

### **Step 1: Understanding the Skill with Concrete Examples by Asking Questions**

You must pause here and ask the user clarifying questions before continuing. Ensure you clearly understand concrete examples of how the skill will be used. At the very least, you must clarify (1) expected input, (2) expected output, and (3) any connectors to be used (if any). The user's initial request to create or update a Skill was likely short and ambiguous. You need to ask several specific follow-up questions to fully understand the user's intent before starting to create or update the skill. Only skip this step when the skill's usage patterns are already clearly understood. If the user asked you general questions about Skills, answer conversationally and clearly, then suggest a few practical next steps.

If the user is asking about Skills conversationally (not requesting an immediate build), respond with:

Follow this order:

1. Start with a simple explanation of what a Skill is in plain language.
2. Give a few concrete examples of where Skills are useful, tailored to the user's context when possible.
3. Mention that users can view their Skill library at `/skills`.
4. Mention that a Skill can be created directly in conversation just by asking, for example: "Create a skill that summarizes customer interview notes into product insights."
5. End with a direct next-step question.

Use language close to this when helpful:

- Skills are small add-ons that teach ChatGPT how to do a specific task or follow a repeatable workflow.
- A Skill can turn something multi-step into one reusable flow.

Good example use cases:

- Automating repeat work such as weekly reports, recurring summaries, or status updates.
- Working inside tools or connected systems with a standard process.
- Following team conventions like templates, checklists, formatting rules, or review steps.

Close with a direct prompt such as:

"Let's get started: would you like me to suggest some Skills based on what you do most often?"

Example: image-editor skill

- "What functionality should the image-editor skill support? Editing, rotating, anything else?"
- "Can you give some examples of how this skill would be used?"

Example: customer-account-update skill

- "Where should I search for or retrieve the customer updates from? (e.g., which specific Slack channels)"
- "What format should the customer account update have? Feel free to share an example and I will convert it into a template."

To avoid overwhelming users, avoid asking too many questions in a single message. Start with the most important questions and follow up as needed for better effectiveness. Conclude this step when there is a clear sense of the functionality the skill should support.

### **Step 2: Planning the Reusable Skill Contents**

To turn concrete examples into an effective skill, analyze each example by:

1. Considering how to execute on the example from scratch
2. Identifying what scripts, references, and assets would be helpful when executing these workflows repeatedly

Example: When building a `pdf-editor` skill to handle queries like "Help me rotate this PDF," the analysis shows:

1. Rotating a PDF requires re-writing the same code each time
2. A `scripts/rotate_pdf.py` script would be helpful to store in the skill

Example: When building a `big-query` skill to handle queries like "How many users have logged in today?" the analysis shows:

1. Querying BigQuery requires re-discovering the table schemas and relationships each time
2. A `references/schema.md` file documenting the table schemas would be helpful to store in the skill

To establish the skill's contents, analyze each concrete example to create a list of the reusable resources to include: scripts, references, and assets. Remember, you do not need to use scripts or complex libraries for text analysis, as ChatGPT itself excels at analyzing, transforming, or processing text—simply add an instruction for ChatGPT to perform the required text operation directly when appropriate.

### **Step 3: Initializing the Skill**

At this point, it is time to actually create the skill.

Skip this step only if the skill being developed already exists, and iteration or packaging is needed. In this case, continue to the next step. This skill should be used in that update path too. For existing-skill updates, preserve the full skill structure, apply the requested edits, and still finish by packaging the entire updated skill into `skill.zip`.

When creating a new skill from scratch, always run the `init_skill.py` script. The script conveniently generates a new template skill directory that automatically includes everything a skill requires, making the skill creation process much more efficient and reliable. Skill names should be descriptive, short, lower case, with words separated by a hyphen and not include the term 'skill' (e.g., slack-gif-creator, pdf-invoice-parser, image-editor).
Frontmatter descriptions should also be lowercase.

Usage:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

The script:

- Creates the skill directory at the specified path
- Generates a SKILL.md template with proper frontmatter and TODO placeholders
- Creates example resource directories: `scripts/`, `references/`, and `assets/`
- Adds example files in each directory that can be customized or deleted

Packaging limit: the final skill ZIP must be 25 MB or smaller.
If user-provided artifacts (especially files in `assets/`) would push the package over 25 MB, explicitly tell the user the artifacts are too large to upload in the skill.

After initialization, customize or remove the generated SKILL.md and example files as needed.

### **Step 4: Edit the Skill**

When editing the (newly-generated or existing) skill, remember that the skill is being created for another instance of ChatGPT to use. Include information that would be beneficial and non-obvious to ChatGPT. Consider what procedural knowledge, domain-specific details, or reusable assets would help another ChatGPT instance execute these tasks more effectively.

#### Learn Proven Design Patterns

Consult these helpful guides based on your skill's needs:

- **Multi-step processes**: See references/workflows.md for sequential workflows and conditional logic
- **Specific output formats or quality standards**: See references/output-patterns.md for template and example patterns

These files contain established best practices for effective skill design.

#### Start with Reusable Skill Contents

To begin implementation, start with the reusable resources identified above: `scripts/`, `references/`, and `assets/` files. Note that this step may require user input. For example, when implementing a `brand-guidelines` skill, the user may need to provide brand assets or templates to store in `assets/`, or documentation to store in `references/`.

Added scripts must be tested by actually running them to ensure there are no bugs and that the output matches what is expected. If there are many similar scripts, only a representative sample needs to be tested to ensure confidence that they all work while balancing time to completion.

It is crucial to scan the Skill directory after you're done and remove all example files and directories that are not needed for the skill. The initialization script creates example files in `scripts/`, `references/`, and `assets/` to demonstrate structure, but most skills won't need all of them.

Before packaging or sharing the skill, check whether bundled artifacts are likely to exceed the 25 MB skill upload limit. If they do, tell the user the artifacts are too large to upload in the skill and propose alternatives (reduce file size, split assets, or host externally if allowed by their workflow).

#### Update SKILL.md

Ensure the frontmatter `name` and `description` remain lowercase before packaging.

**Writing Guidelines:** Always use imperative/infinitive form.

##### Frontmatter

Write the YAML frontmatter with `name` and `description`:

- `name`: The skill name
- `description`: This is the primary triggering mechanism for your skill, and helps ChatGPT understand when to use the skill.
  - Include both what the Skill does and specific triggers/contexts for when to use it.
  - Include all "when to use" information here - Not in the body. The body is only loaded after triggering, so "When to Use This Skill" sections in the body are not helpful to ChatGPT.
  - Example description for a `docx` skill: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. Use when ChatGPT needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"

Do not include any other fields in YAML frontmatter.

##### Body

Write instructions for using the skill and its bundled resources.

### **Step 5: Package the skill (run package_skill.py) and share with user**

Once development of the skill is complete, it must be packaged into a distributable .zip file named exactly `skill.zip` that gets shared with the user. This naming is mandatory for both brand new skills and updates to existing skills. The packaging process automatically validates the skill first to ensure it meets all requirements:

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Optional output directory specification:

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

The packaging script will:

1. **Validate** the skill automatically, checking:

   - YAML frontmatter format and required fields
   - Skill naming conventions and directory structure
   - Description completeness and quality
   - File organization and resource references

2. **Package** the skill if validation passes, creating a .zip file named `skill.zip` that includes all files and maintains the proper directory structure for distribution.
   - Always keep the output filename as `skill.zip` (do not version or rename it).

If validation fails, the script will report the errors and exit without creating a package. Fix any validation errors and run the packaging command again.

After validation is complete, share the packaged `skill.zip` with the user. For update requests, always return the fully repackaged skill bundle, not just the modified files.

### **Step 6: Iterate**

After testing the skill, users may request improvements. Often this happens right after using the skill, with fresh context of how the skill performed.

**Iteration workflow:**

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again
5. Re-package the full skill and share an updated `skill.zip` (same filename)
