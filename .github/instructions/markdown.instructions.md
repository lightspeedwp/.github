---
"description": "Documentation and content creation standards"
"applyTo": "**/*.md"
"license": "GPL-3.0"
"file_type": "instructions"
---

# 📝 Markdown Instructions

![Documentation Badge](https://img.shields.io/badge/type-documentation-blue?style=flat-square)
![Markdown Badge](https://img.shields.io/badge/format-markdown-00bcd4?style=flat-square)
![Status Badge](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)

Canonical markdown standard for all LightSpeedWP documentation and content.

## Role

You are the canonical Markdown documentation standards enforcer for LightSpeedWP projects. Follow the LightSpeedWP documentation framework and accessibility patterns to author, validate, and maintain all Markdown files. Avoid non-standard formatting, inaccessible content, or undocumented practices unless explicitly specified in project requirements.

## Scope & Canonical Statement

This file is the canonical markdown standard for all LightSpeedWP documentation and content. It supersedes any previous markdown style guides and integrates both style and content rules. For inline documentation, see [inline-docs/inline-markdown.instructions.md](./inline-docs/inline-markdown.instructions.md). For documentation structure, see [docs.instructions.md](./docs.instructions.md).

## Related Markdown Instructions

| File | Purpose |
|------|---------|
| [markdown.instructions.md](./markdown.instructions.md) | Canonical markdown standard (this file) |
| [inline-docs/inline-markdown.instructions.md](./inline-docs/inline-markdown.instructions.md) | Inline documentation standards |
| [docs.instructions.md](./docs.instructions.md) | Universal documentation structure |

## Accessibility

All markdown documentation must meet [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) and follow [a11y.instructions.md](./a11y.instructions.md) for accessibility. Always provide alt text for images and diagrams, use semantic headings, and ensure keyboard/screen reader compatibility.

## Markdown Content Rules

The following markdown content rules are enforced in the validators:

1. **Headings**: Use appropriate heading levels (H2, H3, etc.) to structure your content. Do not use an H1 heading, as this will be generated based on the title.
2. **Lists**: Use bullet points or numbered lists for lists. Ensure proper indentation and spacing.
3. **Code Blocks**: Use fenced code blocks for code snippets. Specify the language for syntax highlighting.
4. **Links**: Use proper markdown syntax for links. Ensure that links are valid and accessible.
5. **Images**: Use proper markdown syntax for images. Include alt text for accessibility.
6. **Tables**: Use markdown tables for tabular data. Ensure proper formatting and alignment.
7. **Line Length**: Limit line length to 400 characters for readability.
8. **Whitespace**: Use appropriate whitespace to separate sections and improve readability.
9. **Front Matter**: Include YAML front matter at the beginning of the file with required metadata fields.

## Formatting and Structure

## Examples

### Headings

```md
## Section Title
### Subsection Title
```

### Lists

```md
- Item 1
- Item 2
  - Subitem
```

### Code Blocks

```md
```js
console.log('Hello, world!');
```

```

### Links
```md
[LightSpeedWP](https://lightspeedwp.com)
```

### Images

```md
![Logo: LightSpeedWP](https://lightspeedwp.com/logo.png)
```

### Tables

```md
| Name | Value |
|------|-------|
| Foo  | Bar   |
```

Follow these guidelines for formatting and structuring your markdown content:

- **Headings**: Use `##` for H2 and `###` for H3. Ensure that headings are used in a hierarchical manner. Recommend restructuring if content includes H4, and more strongly recommend for H5.
- **Lists**: Use `-` for bullet points and `1.` for numbered lists. Indent nested lists with two spaces.
- **Code Blocks**: Use triple backticks (`) to create fenced code blocks. Specify the language after the opening backticks for syntax highlighting (e.g.,`csharp).
- **Links**: Use `[link text](URL)` for links. Ensure that the link text is descriptive and the URL is valid.
- **Images**: Use `![alt text](image URL)` for images. Include a brief description of the image in the alt text.
- **Tables**: Use `|` to create tables. Ensure that columns are properly aligned and headers are included.
- **Line Length**: Break lines at 80 characters to improve readability. Use soft line breaks for long paragraphs.
- **Whitespace**: Use blank lines to separate sections and improve readability. Avoid excessive whitespace.

## Contribution & Review

To propose changes or report issues with these markdown standards:

- Open a pull request referencing this file and describe your proposed change.
- For questions or feedback, open an issue in the repository.
- All changes are reviewed by the documentation maintainers and must pass markdownlint and accessibility checks.

**License:** GPL-3.0

## Validation Requirements

Ensure compliance with the following validation requirements:

- **Front Matter**: Include the following fields in the YAML front matter:

  - `post_title`: The title of the post.
  - `author1`: The primary author of the post.
  - `post_slug`: The URL slug for the post.
  - `microsoft_alias`: The Microsoft alias of the author.
  - `featured_image`: The URL of the featured image.
  - `categories`: The categories for the post. These categories must be from the list in /categories.txt.
  - `tags`: The tags for the post.
  - `ai_note`: Indicate if AI was used in the creation of the post.
  - `summary`: A brief summary of the post. Recommend a summary based on the content when possible.
  - `post_date`: The publication date of the post.

- **Content Rules**: Ensure that the content follows the markdown content rules specified above.
- **Formatting**: Ensure that the content is properly formatted and structured according to the guidelines.
- **Validation**: Run the validation tools to check for compliance with the rules and guidelines.

## Markdown Style Guide

### Headings

```md
# Heading h1
## Heading h2
### Heading h3
#### Heading h4
##### Heading h5
###### Heading h6
```

Note: h1 - h4 items will be automatically added to the Table of Contents.

### Emphasis

#### Italics

Wrap text with a single `_` for _Italic_ text:

```md
This is _italic text_.
```

#### Bold

Wrap text with double `**` for **Bold** text:

```md
This is **bold text**.
```

#### Strikethrough

Wrap text with double `~~` for ~~strikethrough~~ text:

```md
This is ~~strikethrough~~ text.
```

### Links

Wrap the title in square brackets `[title]` immediately followed by the URL in `(https://example.com)`:

```md
[WordPress](https://wordpress.org/)
```

##### Universal Link Guidance

When linking to files in the same repository, always use `/blob/HEAD/` in the URL instead of a branch name. This ensures links remain valid after merges or branch changes.

### Blockquotes

Use `>` for blockquotes, double `>>` to further indent:

```md
> Blockquote
>> Indented Blockquote
```

### Lists

#### Unordered Lists

Use `-` for unordered lists, and intent two spaces for list subitems:

```md

#### Universal Link Guidance

- List
  - List
- List
- List
```

#### Ordered Lists

Use numbered items followed by a `.:

```md
1. One
2. Two
3. Three
```

### Horizontal Rules

Use `---` for a horizontal rules:

```md
---
```

### Tables

```md
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

### Example Code

#### Inline Code

Wrap inline code with single <code>`\``</code> backticks:

````md
```
This is `inline code` wrapped with backticks
```
````

When documenting an example, use the markdown <code>`\``</code> code block to demarcate the beginning and end of the code sample:

#### Fenced Code Blocks

##### Javascript

````md
```javascript
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```
````

##### JSON

````md
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "address": {
    "streetAddress": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10021-3100"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "212 555-1234"
    },
    {
      "type": "office",
      "number": "646 555-4567"
    }
  ],
  "children": [],
  "spouse": null
}
```
````

##### CSS

````md
```css
foo {
  padding: 5px;
  margin-right: 3px;
}

.bar {
  background-color: #f00;
}
```
````

##### SCSS

````md
```scss
foo {
  padding: 5px;
  margin-right: 3px;
}

.bar {
  background-color: #f00;
}
```
````

##### HTML

````md
```html
<span class="my-class">Example</span>
```
````

##### PHP

````md
```php
$array = array(
    "foo" => "bar",
    "bar" => "foo",
);
```
````

##### Markdown

````md
```md
This is _italic text_. This is **bold text**.
```
````

---

### References

- [docs.instructions.md](./docs.instructions.md)
- [inline-docs/inline-markdown.instructions.md](./inline-docs/inline-markdown.instructions.md)
- [a11y.instructions.md](./a11y.instructions.md)

**Contact:** <docs@lightspeedwp.com>
**License:** GPL-3.0
