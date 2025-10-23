# YAML Frontmatter Files Types with Schema

A minimal, **WordPress-friendly** Copilot Space that teaches and enforces correct use of YAML frontmatter across GitHub templates and AI files. Includes docs, schemas, reusable prompts, custom chat modes, and example Claude subagents. Built to standardise WP plugin/theme workflows.

Always show details.

## Create a WordPress-focused Copilot Space with frontmatter docs, prompts, chat modes, and agents, then zip it

```python
import os
import zipfile
import json
import textwrap
import pathlib

root = "/mnt/data/copilot-space-wp"
os.makedirs(root, exist_ok=True)

# Folders
dirs = [
    ".github",
    ".github/instructions",
    ".github/prompts",
    ".github/chatmodes",
    ".github/agents",
    ".github/ISSUE_TEMPLATE",
    ".github/PULL_REQUEST_TEMPLATE",
    "docs/copilot-space",
    "docs/copilot-space/schemas",
    "docs/wp-guides",
    ".vscode"
]
for d in dirs:
    os.makedirs(os.path.join(root, d), exist_ok=True)
```

---

### Root docs

# Copilot Space (WordPress Edition)

A minimal, **WordPress-friendly** Copilot Space that teaches and enforces correct use of YAML frontmatter across GitHub templates and AI files. Includes docs, schemas, reusable prompts, custom chat modes, and example Claude subagents. Built to standardise WP plugin/theme workflows.

Start here: `docs/copilot-space/INDEX.md`

---

### AGENTS.md — Universal AI Rules (WordPress)

- Follow **WordPress Coding Standards** (PHPCS: WordPress, WordPress-Docs, WordPress-Extra).
- PHP versions: prefer compatibility with current WP supported PHP (adjust per project).
- Escape, sanitise, and validate all inputs; use nonces for forms; respect capabilities/roles.
- I18n: wrap user-facing text in translation functions; provide text domain.
- Keep changes minimal and reversible; propose diffs and tests.
- Never output secrets; redact credentials and keys.

---

### CLAUDE.md — Project Instructions (WordPress)

Claude should:
- Prefer WordPress core APIs (Options, Settings API, REST API, Transients, WP_Filesystem).
- Use hooks/filters where appropriate; avoid monkey-patching core.
- Generate **PHPCS-compliant** PHP and add PHPDoc for public APIs.
- For JS (blocks), use @wordpress/* packages; register blocks via block.json where sensible.

---

### GEMINI.md — Project Instructions (WordPress)

Gemini should follow: WordPress coding standards, security best practices (escaping/sanitising), and internationalisation. Prefer minimal dependencies and progressive enhancement.

---

### .editorconfig

```ini
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
trim_trailing_whitespace = true

[*.php]
indent_style = tab
indent_size = 4

[*.{js,jsx,ts,tsx,json}]
indent_style = space
indent_size = 2

[*.{css,scss,sass}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

---

### .gitignore

```
# OS
.DS_Store
Thumbs.db

# Node/Yarn
node_modules/
npm-debug.log*
yarn-error.log*
dist/
build/
coverage/

# Composer
vendor/
composer.lock

# IDE
.vscode/
.idea/

# PHP unit caches
.phpunit.result.cache
```

---

### .gitattributes

```
* text=auto eol=lf
docs/* linguist-documentation
```

---

### Docs (Copilot Space Guides)

#### Copilot Space Index — WordPress Frontmatter Playbook

This space blends **GitHub templates** and **AI instruction files** with a WordPress focus.

#### GitHub Templates
- [Issue Templates (Issue Forms)](issue-templates.md)
- [Pull Request Templates](pr-templates.md)
- [Saved Replies (overview)](saved-replies.md)

#### Copilot Customisation
- [Repo & Path Instructions](copilot-instructions.md)
- [Reusable Prompt Files](prompt-files.md)
- [Custom Chat Modes](chatmodes.md)
- [AGENTS.md (universal rules)](agents-md.md)

#### Claude & Gemini
- [Claude: CLAUDE.md & Subagents](claude-agents.md)
- [Gemini: GEMINI.md (convention)](gemini-md.md)

#### Schemas
- [Issue Form schema](schemas/issue-form-schema.md)
- [Prompt frontmatter schema](schemas/prompt-frontmatter-schema.md)
- [Chat Mode frontmatter schema](schemas/chatmode-frontmatter-schema.md)
- [Claude Subagent schema](schemas/claude-subagent-schema.md)
- [Prompt Collection schema (experimental)](schemas/prompt-collection-schema.md)

#### WordPress Guides
- [WordPress Coding Standards quickstart](../wp-guides/wp-coding-standards.md)
- [Security checklist for WP](../wp-guides/wp-security-checklist.md)
- [Block development checklist](../wp-guides/block-dev-checklist.md)

---

*(Additional sections such as schema examples, issue/pr templates, and instructions can be formatted similarly with proper Markdown headings and code fencing as above.)*

---