# Create Code Blocks

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

> Part of the [figma-use-figjam skill](../SKILL.md). Creating and configuring FigJam code block nodes.

**Scope:** Code blocks are FigJam-specific nodes created with `figma.createCodeBlock()`. They render code content with syntax highlighting and a monospace font. `CODE_BLOCK` is a first-class node type — not a shape or text node.

## Creating a Code Block

```javascript
// Snapshot existing children before creating the node — createCodeBlock() auto-appends to the page
const existingNodes = figma.currentPage.children.slice()

const cb = figma.createCodeBlock()
cb.code = 'const greeting = "Hello, FigJam!"'
cb.codeLanguage = 'JAVASCRIPT'

// Position away from (0,0) — find clear space to the right of existing content
const rightEdge = existingNodes.length > 0 ? Math.max(...existingNodes.map((n) => n.x + n.width)) : 0
cb.x = rightEdge + 100
cb.y = 100

return { id: cb.id, x: cb.x, y: cb.y }
```

## Supported Languages (`codeLanguage`)

Pass one of these exact uppercase string values. Omitting `codeLanguage` defaults to `PLAINTEXT`.

| Value | Language |
|---|---|
| `TYPESCRIPT` | TypeScript |
| `JAVASCRIPT` | JavaScript |
| `PYTHON` | Python |
| `GO` | Go |
| `RUST` | Rust |
| `RUBY` | Ruby |
| `CSS` | CSS |
| `HTML` | HTML |
| `JSON` | JSON |
| `GRAPHQL` | GraphQL |
| `SQL` | SQL |
| `SWIFT` | Swift |
| `KOTLIN` | Kotlin |
| `CPP` | C++ |
| `BASH` | Bash / Shell |
| `PLAINTEXT` | Plain text (no highlighting) |

If the user specifies a language not in this list, use `PLAINTEXT`.

## Setting Code Content

The `code` property maps to the node's text sublayer — set it after creating the node:

```javascript
const cb = figma.createCodeBlock()
cb.code = `function add(a, b) {
  return a + b
}`
cb.codeLanguage = 'TYPESCRIPT'
return { id: cb.id }
```

## Positioning Within a Section

To place a code block inside a FigJam section, append it to the section instead of the page:

```javascript
// Use the type-indexed criteria for the type filter, then narrow by name.
const section = figma.currentPage
  .findAllWithCriteria({ types: ['SECTION'] })
  .find((n) => n.name === 'My Section')
if (!section) throw new Error('Section not found')

const cb = figma.createCodeBlock()
cb.code = 'SELECT * FROM users WHERE active = true'
cb.codeLanguage = 'SQL'

section.appendChild(cb)

// Position relative to section origin
cb.x = 40
cb.y = 40

return { id: cb.id }
```

## Important Notes

- `CODE_BLOCK` is **FigJam-only** — this will throw in Figma design files.
- There is no theme/color API for code blocks; FigJam handles the visual styling automatically.
- Always `return` the created node's `id` for reference in follow-up calls (see figma-use rule #15).
- No font loading is required — code blocks handle their own monospace rendering.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
