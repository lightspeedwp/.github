# Code Blocks to HTML

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

## Fenced Code Blocks (No Language)

### Markdown

```
function test() {
  console.log("notice the blank line before this function?");
}
```

### Parsed HTML

```html
<pre><code>
function test() {
  console.log("notice the blank line before this function?");
}
</code></pre>
```

---

## GitHub Tip Callout

### Markdown

```md
> [!TIP]
> To preserve your formatting within a list, make sure to indent non-fenced code blocks by eight spaces.
```

### Parsed HTML (GitHub-specific)

```html
<blockquote class="markdown-alert markdown-alert-tip">
  <p><strong>Tip</strong></p>
  <p>To preserve your formatting within a list, make sure to indent non-fenced code blocks by eight spaces.</p>
</blockquote>
```

---

## Showing Backticks Inside Code Blocks

### Markdown

`````md
    ````
    ```
    Look! You can see my backticks.
    ```
    ````
`````

### Parsed HTML

```html
    <pre><code>
    ```

    Look! You can see my backticks.

    ```
    </code></pre>
```

## Syntax Highlighting (Language Identifier)

### Markdown

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

### Parsed HTML

```html
<pre><code class="language-ruby">
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
</code></pre>
```

> The `language-ruby` class is consumed by GitHub’s syntax highlighter (Linguist + grammar).

### Summary: Syntax-Highlighting Rules (HTML-Level)

| Markdown fence | Parsed `<code>` tag            |
| -------------- | ------------------------------ |
| ```js          | `<code class="language-js">`   |
| ```html        | `<code class="language-html">` |
| ```md          | `<code class="language-md">`   |
| ``` (no lang)  | `<code>`                       |

---

## HTML Comments (Ignored by Renderer)

```md
<!-- Internal documentation comment -->
```

```html
<!-- Internal documentation comment -->
```

---

## Links

```md
[About writing and formatting on GitHub](https://docs.github.com/...)
```

```html
<a href="https://docs.github.com/...">About writing and formatting on GitHub</a>
```

---

## Lists

```md
* [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
```

```html
<ul>
  <li>
    <a href="https://github.github.com/gfm/">GitHub Flavored Markdown Spec</a>
  </li>
</ul>
```

---

## Diagrams (Conceptual Parsing)

### Markdown

````md
```mermaid
graph TD
  A --> B
```
````

### Parsed HTML

```html
<pre><code class="language-mermaid">
graph TD
  A --> B
</code></pre>
```

## Closing Notes

* No `language-*` class appears here because **no language identifier** was provided.
* The inner triple backticks are preserved **as literal text** inside `<code>`.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
