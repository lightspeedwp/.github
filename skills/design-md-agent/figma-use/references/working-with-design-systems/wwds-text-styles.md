# Working with design systems: Text Styles

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Text styles in Figma are named, reusable typography definitions. They are the closest equivalent to a type ramp in a design token library. A text style bundles font family, size, weight, line height, letter spacing, and other typographic properties into a single named entity that can be applied to text nodes.

Text styles are distinct from variables. You cannot put typography into a single variable — there is no composite variable type. However, individual properties on a text style *can* be bound to variables (e.g. binding `fontSize` to a size variable, or `fontFamily` to a string variable), which allows the style to participate in a token system.

## Model

A `TextStyle` has the following writable properties:

| Property           | Type             | Notes                                                                        |
| ------------------ | ---------------- | ---------------------------------------------------------------------------- |
| `name`             | `string`         | Slash-delimited for grouping (e.g. `"Heading/XL"`)                           |
| `fontSize`         | `number`         | In pixels                                                                    |
| `fontName`         | `FontName`       | `{ family: string, style: string }` — **font must be loaded before setting** |
| `letterSpacing`    | `LetterSpacing`  | `{ value: number, unit: 'PIXELS' \| 'PERCENT' }`                             |
| `lineHeight`       | `LineHeight`     | `{ value: number, unit: 'PIXELS' \| 'PERCENT' }` or `{ unit: 'AUTO' }`       |
| `textCase`         | `TextCase`       | `'ORIGINAL' \| 'UPPER' \| 'LOWER' \| 'TITLE' \| 'SMALL_CAPS'`                |
| `textDecoration`   | `TextDecoration` | `'NONE' \| 'UNDERLINE' \| 'STRIKETHROUGH'`                                   |
| `paragraphSpacing` | `number`         |                                                                              |
| `paragraphIndent`  | `number`         |                                                                              |
| `description`      | `string`         | Inherited from `BaseStyleMixin`                                              |

### lineHeight and letterSpacing format

These properties must be objects — not bare numbers:

```js
// WRONG — bare number throws
style.lineHeight = 1.5;
style.letterSpacing = 0;

// CORRECT
style.lineHeight = { unit: "AUTO" }; // auto line height
style.lineHeight = { value: 24, unit: "PIXELS" }; // fixed pixel height
style.lineHeight = { value: 150, unit: "PERCENT" }; // 150% line height

style.letterSpacing = { value: 0, unit: "PIXELS" }; // zero tracking
style.letterSpacing = { value: -2, unit: "PIXELS" }; // tight tracking
style.letterSpacing = { value: 5, unit: "PERCENT" }; // percent-based tracking
```

When reading a `lineHeight` back, always check `unit` first — `{ unit: 'AUTO' }` has no `value` key.

### Variable bindings on text styles

The following fields can be bound to variables via `style.setBoundVariable(field, variable)`:

`fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `letterSpacing`, `lineHeight`, `paragraphSpacing`, `paragraphIndent`

To unbind: `style.setBoundVariable(field, null)`

**Important: where possible, use `setBoundVariable` instead of raw values**

```js
const ts = figma.createTextStyle();
ts.fontSize = 24; // set directly; not bound to a variable

const ts = figma.createTextStyle();
ts.setBoundVariable("fontSize", fontSizeVariable); // preferred if the variable exists.
```

### Applying a text style to a node

Once you have a `TextStyle`, apply it to a `TextNode` by assigning its `id` to the node's `textStyleId` property. You can also use the async setter `setTextStyleIdAsync(id)`. Setting `textStyleId` on a node does **not** require the font to be loaded — only editing the text content or font properties directly does.

## Common gotchas

- **Font must be loaded before setting `fontName`**: Call `await figma.loadFontAsync({ family, style })` before creating or modifying a text style's font.
- **Font style names are file-dependent**: Font style names vary by font provider and Figma file. Always call `await figma.listAvailableFontsAsync()` to discover exact style strings before loading — never guess or probe with try/catch.
- **Styles are not automatically applied**: Creating a `TextStyle` has no effect on any node until you assign its ID to a text node.
- **`getLocalTextStyles()` is deprecated**: Always use `getLocalTextStylesAsync()`.
- **Names are not unique**: Two text styles can share the same name. Match by ID or `key` when looking up a known style, not by name alone.
- **Slash grouping is visual only**: `"Heading/XL"` and `"HeadingXL"` are different names; the slash is just a UI affordance.
- **`lineHeight` and `letterSpacing` must be objects**: `style.lineHeight = 1.5` throws. Always use `{ value, unit }` format or `{ unit: 'AUTO' }`.

## Code patterns

For runnable code examples (listing, creating, discovering available fonts, type ramps, applying styles), see [text-style-patterns.md](../text-style-patterns.md).

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
