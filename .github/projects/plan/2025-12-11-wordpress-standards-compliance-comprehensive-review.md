# WordPress Standards Compliance & Comprehensive Codebase Review

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure the multi-block plugin scaffold follows WordPress coding standards, best practices, and properly integrates WordPress core functions and Secure Custom Fields (SCF) plugin functionality.

**Architecture:** Systematic review and enhancement of all scaffold components: documentation (markdown standards, WordPress/SCF links), PHP class files (WordPress standards, PHPDoc), JavaScript files (WPCS, JSDoc), blocks (block editor standards), patterns/templates (proper registration), and instruction files (accuracy and consistency).

**Tech Stack:** WordPress 6.5+, PHP 8.0+, Secure Custom Fields (SCF), Node.js 18+, wp-scripts, Mustache templating, JSON Schema validation, CommonMark markdown

---

## PHASE 0: Documentation Foundation & Markdown Standards

### Task 0.1: Expand and Refine Markdown Instructions File

**Files:**
- Modify: `.github/instructions/markdown.instructions.md`
- Reference: https://spec.commonmark.org/
- Reference: https://github.github.com/gfm/ (GitHub Flavored Markdown)

**Step 1: Read current markdown instructions**

```bash
cat .github/instructions/markdown.instructions.md
```

**Step 2: Research CommonMark specification**

Review the CommonMark specification for:
- Proper heading hierarchy (only one H1 per document)
- List formatting (consistent markers, proper indentation)
- Code block syntax (fenced vs indented)
- Link reference formats
- Emphasis and strong emphasis rules

**Step 3: Add linting rules section**

Add after current content:

```markdown
## Linting Rules

### Markdownlint Configuration

This project uses markdownlint to enforce consistent markdown style. Key rules:

**MD001** - Heading levels increment by one
- ❌ `# H1` followed by `### H3`
- ✅ `# H1` followed by `## H2`

**MD003** - Heading style (ATX)
- ✅ `## Heading` (ATX style)
- ❌ `Heading\n-------` (Setext style)

**MD004** - Unordered list style (dash)
- ✅ `- Item`
- ❌ `* Item` or `+ Item`

**MD007** - Unordered list indentation (2 spaces)
```markdown
- Parent
  - Child (2 spaces)
    - Grandchild (4 spaces)
```

**MD009** - No trailing spaces
**MD010** - No hard tabs (use spaces)
**MD012** - No multiple consecutive blank lines
**MD013** - Line length limit (120 characters for readability)
**MD022** - Headings surrounded by blank lines
**MD023** - Headings start at beginning of line
**MD025** - Single H1 per document
**MD026** - No trailing punctuation in headings
**MD029** - Ordered list prefix (ordered)
**MD030** - Spaces after list markers (1 space)
**MD031** - Fenced code blocks surrounded by blank lines
**MD032** - Lists surrounded by blank lines
**MD034** - No bare URLs (use link syntax)
**MD040** - Fenced code blocks have language
**MD041** - First line is top-level heading
**MD046** - Code block style (fenced)
**MD047** - Files end with single newline

### Mustache Placeholder Documentation

When documenting scaffold files with `{{mustache}}` placeholders:

**DO:**
- Explain what each placeholder represents
- Provide examples with realistic values
- Document placeholder transformations (e.g., `{{namespace|lowerCase}}`)
- Link to schema definitions

**DON'T:**
- Remove or replace placeholders in documentation
- Use literal values instead of placeholders in examples
- Document placeholders without context

**Example:**

```markdown
### Plugin Namespace Placeholders

- `{{namespace}}` - PHP namespace in snake_case (e.g., `Tour_Operator`)
- `{{namespace|lowerCase}}` - Lowercase namespace for use in paths (e.g., `tour_operator`)
- `{{namespace|upper}}` - Uppercase for constants (e.g., `TOUR_OPERATOR`)

**Usage in PHP:**

\```php
namespace {{namespace|lowerCase}}\classes;

define( '{{namespace|upper}}_VERSION', '{{version}}' );
\```
```

### File Structure Requirements

**Front Matter (for documentation files):**

```yaml
---
title: Document Title
description: Brief description
audience: Developers|Users|Both
date: YYYY-MM-DD
---
```

**Required Sections (for instruction files):**

1. **Title** (H1) - One per document
2. **Overview** (H2) - Brief introduction
3. **Reference Links** (H2) - External documentation
4. **Instructions** (H2+) - Step-by-step guidance
5. **Examples** (H2+) - Code samples
6. **Common Issues** (H2+) - Troubleshooting

### Code Block Best Practices

**Always specify language:**

````markdown
```php
// Good - language specified
<?php echo 'Hello'; ?>
```

```
// Bad - no language
code here
```
````

**Use syntax highlighting for:**
- `php` - PHP code
- `javascript` or `js` - JavaScript
- `json` - JSON configuration
- `bash` or `sh` - Shell commands
- `html` - HTML markup
- `css` - Stylesheets
- `scss` - Sass/SCSS
- `markdown` or `md` - Markdown examples
- `text` - Plain text output

**Command examples:**

```markdown
**Run build:**

\```bash
npm run build
\```

**Expected output:**

\```text
> @wordpress/scripts build

Creating optimized production build...
Compiled successfully.
\```
```

### Link Best Practices

**Internal documentation links:**

```markdown
See [ARCHITECTURE.md](../ARCHITECTURE.md) for system design.
See [Block Development](blocks-development.instructions.md) for block guidelines.
```

**External reference links:**

```markdown
**WordPress Developer Resources:**
- [Plugin Basics](https://developer.wordpress.org/plugins/plugin-basics/)
- [Custom Post Types](https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/)

**Secure Custom Fields Documentation:**
- [First Custom Field](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-custom-field.md)
- [SCF API Reference](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/code-reference)
```

**Anchor links:**

```markdown
Jump to [Installation](#installation) section.
```

### Table Formatting

**Alignment:**

```markdown
| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left         | Center         | Right         |
```

**Complex tables (use HTML):**

```html
<table>
<thead>
  <tr>
    <th>Column 1</th>
    <th>Column 2</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </td>
    <td>Value</td>
  </tr>
</tbody>
</table>
```

### Admonitions (Callouts)

**WordPress.org style (blockquotes with emoji):**

```markdown
> ⚠️ **Warning:** This will delete all data.

> ℹ️ **Note:** Remember to flush rewrite rules.

> ✅ **Best Practice:** Always sanitize user input.

> ❌ **Avoid:** Never use `extract()` on user data.
```

### File-Specific Guidelines

**README.md:**
- Must have single H1 title
- Include badges (version, license, build status)
- Quick start section
- Installation instructions
- Link to full documentation

**CHANGELOG.md:**
- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Use [Semantic Versioning](https://semver.org/)
- Categories: Added, Changed, Deprecated, Removed, Fixed, Security

**CONTRIBUTING.md:**
- Code of conduct reference
- Development setup
- Pull request process
- Coding standards links

**Instruction files (.instructions.md):**
- Focused, single-purpose guidance
- Step-by-step format
- Code examples with explanations
- Link to official WordPress/SCF docs
- Troubleshooting section
```

**Step 4: Add scaffold-specific section**

```markdown
## Scaffold Repository Guidelines

### Placeholder Preservation

**Critical:** Never remove or replace mustache placeholders in scaffold files.

**Placeholders must remain intact in:**
- All `.php` files in scaffold
- All `.js` files using template strings
- All `block.json` files
- All `.html` template files
- Pattern files in `patterns/`
- Example files

**Exception:** Documentation can show "before/after" with actual values for clarity, but must explain the placeholder mapping.

### Documentation of Mustache Values

**Every instruction file that references scaffold code MUST include a Mustache Placeholder Reference section.**

**Template:**

```markdown
## Mustache Placeholder Reference

### Plugin-Level Placeholders

| Placeholder | Description | Example Value | Used In |
|-------------|-------------|---------------|---------|
| `{{slug}}` | Plugin slug (kebab-case) | `tour-operator` | File names, CSS classes, block namespaces |
| `{{name}}` | Plugin display name | `Tour Operator` | Plugin header, admin labels |
| `{{textdomain}}` | i18n text domain | `tour-operator` | `__()`, `_e()`, `esc_html__()` |
| `{{namespace}}` | PHP namespace | `Tour_Operator` | `namespace` declarations |
| `{{namespace\|lowerCase}}` | Lowercase namespace | `tour_operator` | Directory paths, function prefixes |
| `{{namespace\|upper}}` | Uppercase namespace | `TOUR_OPERATOR` | Constants |

### Post Type Placeholders

| Placeholder | Description | Example Value | Used In |
|-------------|-------------|---------------|---------|
| `{{cpt_slug}}` | Custom post type slug | `tour` | `register_post_type()`, file names |
| `{{cpt_name_singular}}` | Singular CPT name | `Tour` | Labels, admin UI |
| `{{cpt_name_plural}}` | Plural CPT name | `Tours` | Labels, admin UI |
| `{{cpt_supports}}` | Supported features | `'title', 'editor', 'thumbnail'` | CPT registration |

[Add complete table for all placeholder categories]
```

### Examples Must Be Runnable

All code examples should:
1. Be syntactically valid
2. Show complete context (not fragments)
3. Include required imports/includes
4. Use proper escaping and sanitization
5. Follow WordPress coding standards

**Bad example:**

```markdown
Update the field:
\```php
update_field('title', $value);
\```
```

**Good example:**

```markdown
Update a custom field value with proper sanitization:

\```php
<?php
// Sanitize user input before saving
$sanitized_title = sanitize_text_field( $_POST['movie_title'] );

// Update the field value
update_field( 'movie_title', $sanitized_title, $post_id );

// Verify update succeeded
if ( get_field( 'movie_title', $post_id ) === $sanitized_title ) {
    // Success
    add_action( 'admin_notices', function() {
        echo '<div class="notice notice-success"><p>' .
             esc_html__( 'Title updated successfully.', '{{textdomain}}' ) .
             '</p></div>';
    } );
}
\```
```
```

**Step 5: Commit**

```bash
git add .github/instructions/markdown.instructions.md
git commit -m "docs: expand markdown instructions with linting rules and scaffold guidelines"
```

---

### Task 0.2: Review and Update docs/ Folder README

**Files:**
- Modify: `docs/README.md`
- Cross-reference: All files in `docs/` directory

**Step 1: List all current documentation files**

```bash
ls -1 docs/*.md | sed 's|docs/||' | sort
```

**Step 2: Verify all files are referenced in README**

Read current `docs/README.md` and compare with actual files.

**Step 3: Update documentation index**

Ensure README includes:
- Current, accurate descriptions
- Proper categorization
- Mermaid flowchart reflecting actual docs
- Links work correctly
- No references to deleted files
- All new files added

**Step 4: Add missing documentation references**

If documentation exists but isn't linked, add to appropriate category:
- Getting Started
- Architecture & Development
- Quality & Risk
- Operations & Governance

**Step 5: Update Mermaid diagram**

Ensure flowchart accurately represents:
- Current documentation structure
- Logical documentation flow
- Dependencies between documents

**Step 6: Commit**

```bash
git add docs/README.md
git commit -m "docs: update docs index to reflect current documentation structure"
```

---

## PHASE 1: WordPress Coding Standards Compliance

### Task 1.1: Review and Update PHP Coding Standards Instructions

**Files:**
- Modify: `.github/instructions/wpcs-php.instructions.md`
- Reference: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/

**Step 1: Fetch WordPress PHP coding standards**

Read the complete WordPress PHP coding standards documentation.

**Step 2: Review current instruction file**

```bash
cat .github/instructions/wpcs-php.instructions.md
```

**Step 3: Update with comprehensive standards**

Ensure file includes all sections from WordPress documentation:

**Required sections:**

1. **Single and Double Quotes**
   - Use single quotes for strings
   - Use double quotes only for interpolation
   ```php
   // Good
   echo '<a href="/static/link">Link</a>';
   $greeting = "Hello {$name}";

   // Bad
   echo "<a href='/static/link'>Link</a>";
   ```

2. **Indentation**
   - Use real tabs, not spaces
   - Use spaces for mid-line alignment only
   ```php
   // Good
   function my_function( $param1, $param2 ) {
   →   $var = array(
   →   →   'key1' => 'value1',
   →   →   'key2' => 'value2',
   →   );
   }
   ```

3. **Brace Style**
   - Opening braces on same line as declaration
   - Closing braces on own line
   - Always use braces, even for single statements
   ```php
   // Good
   if ( condition ) {
   →   action();
   }

   // Bad - missing braces
   if ( condition )
   →   action();
   ```

4. **Array Syntax**
   - Use long array syntax `array()` not short `[]`
   - Multi-item associative arrays: one item per line
   - Include trailing comma after last item
   ```php
   // Good
   $array = array(
   →   'key1' => 'value1',
   →   'key2' => 'value2',
   →   'key3' => 'value3',
   );

   // Bad
   $array = [
   →   'key1' => 'value1',
   →   'key2' => 'value2'
   ];
   ```

5. **Naming Conventions**
   - Functions/variables: lowercase with underscores
   - Classes/Interfaces/Traits: Capitalized_Words_With_Underscores
   - Constants: UPPERCASE_WITH_UNDERSCORES
   - Files: lowercase-with-hyphens.php
   - Class files: class-classname.php
   ```php
   // Good
   function my_plugin_function() {}
   class My_Plugin_Class {}
   const MY_CONSTANT = 'value';

   // Bad
   function myPluginFunction() {}
   class myPluginClass {}
   ```

6. **Interpolation**
   - Prefer concatenation for simple variables
   - Use braces for complex variables
   ```php
   // Good
   echo 'Hello ' . $name;
   echo "Hello {$user->name}";

   // Avoid
   echo "Hello $name";
   ```

7. **Control Structures**
   - Space after keyword, before opening parenthesis
   - Space after opening parenthesis, before closing
   - Use `elseif` not `else if`
   ```php
   // Good
   if ( condition ) {
   →   action();
   } elseif ( other_condition ) {
   →   other_action();
   } else {
   →   default_action();
   }
   ```

8. **Yoda Conditions**
   - Place constant or literal on left side
   ```php
   // Good
   if ( true === $the_force ) {}
   if ( 'red' === $lightsaber_color ) {}

   // Bad
   if ( $the_force === true ) {}
   if ( $lightsaber_color === 'red' ) {}
   ```

9. **Type Declarations**
   - One space before and after type keyword
   - No space between nullability operator and type
   ```php
   // Good
   function my_function( string $param ): void {}
   function nullable_param( ?int $id ): ?string {}

   // Bad
   function my_function(string $param):void {}
   function nullable_param( ? int $id ): ?string {}
   ```

10. **Clever Code**
    - Favor readability over brevity
    - Avoid ternaries nested more than once
    ```php
    // Good
    if ( isset( $_POST['value'] ) ) {
    →   $value = $_POST['value'];
    } else {
    →   $value = 'default';
    }

    // Acceptable
    $value = isset( $_POST['value'] ) ? $_POST['value'] : 'default';

    // Bad - nested ternary
    $value = isset( $_POST['value'] ) ? $_POST['value'] : ( isset( $_GET['value'] ) ? $_GET['value'] : 'default' );
    ```

**Step 4: Add scaffold-specific guidance**

```markdown
## Scaffold-Specific Requirements

### Mustache Placeholders in PHP

When using mustache placeholders in PHP code:

```php
<?php
namespace {{namespace|lowerCase}}\classes;

/**
 * {{name}} Core Class
 *
 * @package {{namespace}}
 * @since   {{version}}
 */

if ( ! defined( 'ABSPATH' ) ) {
→   exit;
}

class Core {
→   /**
→    * Plugin version.
→    *
→    * @var string
→    */
→   const VERSION = '{{version}}';
}
```

### Defensive Coding for SCF Dependency

Always check for SCF functions before using:

```php
// Good - defensive check
if ( function_exists( 'acf_add_local_field_group' ) ) {
→   acf_add_local_field_group( $field_group );
}

// Good - early return pattern
if ( ! function_exists( 'acf_add_local_field_group' ) ) {
→   return;
}

// Bad - assumes SCF is active
acf_add_local_field_group( $field_group );
```

### ABSPATH Check

Every PHP file must include direct access prevention:

```php
<?php
/**
 * File description
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
→   exit;
}

// File contents...
```
```

**Step 5: Commit**

```bash
git add .github/instructions/wpcs-php.instructions.md
git commit -m "docs: update PHP coding standards with complete WordPress guidelines"
```

---

### Task 1.2: Review and Update JavaScript Coding Standards Instructions

**Files:**
- Modify: `.github/instructions/wpcs-javascript.instructions.md`
- Reference: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/

**Step 1: Fetch WordPress JavaScript coding standards**

Read complete WordPress JavaScript coding standards documentation.

**Step 2: Update instruction file with comprehensive standards**

Ensure file includes:

1. **Spacing and Indentation**
   - Tabs for indentation (not spaces)
   - No trailing whitespace
   - 80-character line soft limit, 100-character hard limit
   ```javascript
   // Good
   function myFunction() {
   →   const value = 'string';
   →   return value;
   }
   ```

2. **Semicolons**
   - Required after statements
   - Never rely on ASI (Automatic Semicolon Insertion)
   ```javascript
   // Good
   const value = getValue();
   myFunction();

   // Bad
   const value = getValue()
   myFunction()
   ```

3. **Quotes**
   - Use single quotes exclusively
   ```javascript
   // Good
   const message = 'Hello World';

   // Bad
   const message = "Hello World";
   ```

4. **Variable Declaration**
   - Prefer `const` and `let` over `var`
   - One declaration per line
   ```javascript
   // Good
   const firstName = 'John';
   const lastName = 'Doe';
   let age = 30;

   // Bad
   var firstName = "John", lastName = "Doe";
   ```

5. **Naming Conventions**
   - Variables/Functions: camelCase
   - Classes: UpperCamelCase
   - Constants: SCREAMING_SNAKE_CASE
   ```javascript
   // Good
   const myVariable = 'value';
   function myFunction() {}
   class MyClass {}
   const MY_CONSTANT = 'value';

   // Bad
   const my_variable = 'value';
   function MyFunction() {}
   class myClass {}
   ```

6. **Equality**
   - Always use strict equality (`===`, `!==`)
   - Never use loose equality (`==`, `!=`)
   ```javascript
   // Good
   if ( value === 5 ) {}
   if ( result !== false ) {}

   // Bad
   if ( value == 5 ) {}
   if ( result != false ) {}
   ```

7. **Type Checks**
   ```javascript
   // Strings
   typeof object === 'string'

   // Numbers
   typeof object === 'number'

   // Undefined
   typeof object === 'undefined'
   variable === undefined

   // Objects
   typeof object === 'object'

   // Arrays
   Array.isArray( myArray )

   // null
   variable === null

   // Element node
   element.nodeType === 1
   ```

8. **Comments**
   - Block comments above code
   - Inline comments for complex logic
   - Use JSDoc for functions
   ```javascript
   /**
    * Block comment for complex sections.
    * Explain the "why" not the "what".
    */
   const value = calculate();

   // Inline comment for single lines
   const adjusted = value * 1.15; // Apply 15% tax
   ```

9. **Objects and Arrays**
   - Use object/array shorthand
   - Trailing commas for multi-line
   ```javascript
   // Good
   const obj = {
   →   name: 'John',
   →   age: 30,
   →   active: true,
   };

   const arr = [
   →   'item1',
   →   'item2',
   →   'item3',
   ];

   // Bad
   const obj = {
   →   name: 'John',
   →   age: 30,
   →   active: true
   };
   ```

10. **jQuery Integration**
    ```javascript
    ( function( $ ) {
    →   'use strict';
    →
    →   // jQuery code using $
    →   $( '.selector' ).on( 'click', function() {
    →   →   // Handle click
    →   } );
    } )( jQuery );
    ```

**Step 3: Add block editor specific guidance**

```markdown
## Block Editor (Gutenberg) Standards

### Imports and Dependencies

```javascript
/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import './style.scss';
```

### Block Registration

```javascript
registerBlockType( metadata.name, {
→   edit: Edit,
→   save,
} );
```

### Edit Component

```javascript
function Edit( { attributes, setAttributes } ) {
→   const { content } = attributes;
→   const blockProps = useBlockProps();
→
→   return (
→   →   <>
→   →   →   <InspectorControls>
→   →   →   →   <PanelBody title={ __( 'Settings', '{{textdomain}}' ) }>
→   →   →   →   →   <TextControl
→   →   →   →   →   →   label={ __( 'Content', '{{textdomain}}' ) }
→   →   →   →   →   →   value={ content }
→   →   →   →   →   →   onChange={ ( value ) => setAttributes( { content: value } ) }
→   →   →   →   →   />
→   →   →   →   </PanelBody>
→   →   →   </InspectorControls>
→   →   →   <div { ...blockProps }>
→   →   →   →   { content }
→   →   →   </div>
→   →   </>
→   );
}
```

### Save Component

```javascript
function save( { attributes } ) {
→   const { content } = attributes;
→   const blockProps = useBlockProps.save();
→
→   return (
→   →   <div { ...blockProps }>
→   →   →   { content }
→   →   </div>
→   );
}
```

### Mustache Placeholders in JavaScript

```javascript
/**
 * {{name}} Block
 *
 * @package {{namespace}}
 */

import { __ } from '@wordpress/i18n';

// Use textdomain placeholder
const title = __( 'Block Title', '{{textdomain}}' );

// Block namespace from slug
registerBlockType( '{{slug}}/{{cpt_slug}}-card', {
→   // Block configuration
} );
```
```

**Step 4: Commit**

```bash
git add .github/instructions/wpcs-javascript.instructions.md
git commit -m "docs: update JavaScript coding standards with WordPress and block editor guidelines"
```

---

### Task 1.3: Review and Update CSS Coding Standards Instructions

**Files:**
- Modify: `.github/instructions/wpcs-css.instructions.md`
- Reference: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/

**Step 1: Update with comprehensive CSS standards**

```markdown
# CSS Coding Standards

Reference: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/

## Structure

### Spacing and Indentation

- Use tabs for indentation (not spaces)
- No trailing whitespace
- Two blank lines between sections
- One blank line between rule sets

```css
/* Section 1 */
.class-1 {
→   property: value;
}

.class-2 {
→   property: value;
}


/* Section 2 */
.class-3 {
→   property: value;
}
```

### Selector Formatting

- One selector per line in grouped selectors
- Space before opening brace
- Properties on separate lines
- Space after colon
- Semicolon after every declaration
- Closing brace on own line

```css
/* Good */
.selector-1,
.selector-2,
.selector-3 {
→   property: value;
→   property: value;
}

/* Bad */
.selector-1, .selector-2 {property: value; property: value;}
```

## Property Ordering

Group properties logically:

1. Display & Box Model
2. Positioning
3. Typography
4. Visual (colors, backgrounds)
5. Other

```css
.selector {
→   /* Display & Box Model */
→   display: block;
→   width: 100%;
→   height: auto;
→   margin: 0;
→   padding: 1em;
→   border: 1px solid #ccc;
→
→   /* Positioning */
→   position: relative;
→   top: 0;
→   left: 0;
→
→   /* Typography */
→   font-family: sans-serif;
→   font-size: 1rem;
→   line-height: 1.5;
→
→   /* Visual */
→   color: #333;
→   background: #fff;
→
→   /* Other */
→   cursor: pointer;
}
```

## Naming Conventions

### Class Names

- Lowercase with hyphens (kebab-case)
- Use semantic names
- Avoid presentational names

```css
/* Good */
.navigation-menu {}
.site-header {}
.post-content {}

/* Bad */
.navigationMenu {}
.red-text {}
.float-left {}
```

### BEM Methodology (Recommended)

```css
/* Block */
.card {}

/* Element */
.card__title {}
.card__content {}

/* Modifier */
.card--featured {}
.card--large {}

/* Combined */
.card--featured .card__title {}
```

## Values and Units

### Colors

- Use hex codes for colors: `#fff` or `#ffffff`
- Use `rgba()` for transparency
- Lowercase hex values
- Use 3-character hex when possible

```css
/* Good */
color: #f00;
color: #ff0000;
background: rgba( 0, 0, 0, 0.5 );

/* Bad */
color: #FF0000;
color: red;
```

### Zero Values

- Omit units for zero values (except `transition-duration`)
- Include leading zero for decimals < 1

```css
/* Good */
margin: 0;
opacity: 0.5;
transition: all 0.3s ease;

/* Bad */
margin: 0px;
opacity: .5;
transition: all 0s ease;
```

### Shorthand

Use shorthand properties when possible:

```css
/* Good */
padding: 1em 2em;
background: #fff url( 'image.png' ) no-repeat center;
border: 1px solid #ccc;

/* Avoid */
padding-top: 1em;
padding-right: 2em;
padding-bottom: 1em;
padding-left: 2em;
```

## Media Queries

### Placement

Group media queries at bottom of stylesheet, organized by breakpoint.

```css
/* Base styles */
.header {
→   padding: 1em;
}

.nav {
→   display: none;
}


/* Media Queries */
@media ( min-width: 768px ) {
→   .header {
→   →   padding: 2em;
→   }
→
→   .nav {
→   →   display: block;
→   }
}

@media ( min-width: 1024px ) {
→   .header {
→   →   padding: 3em;
→   }
}
```

### Breakpoint Format

- Use `min-width` for mobile-first approach
- Define breakpoints in pixels or ems
- Use meaningful breakpoint names

```css
/* Small devices (tablets, 768px and up) */
@media ( min-width: 768px ) {}

/* Medium devices (desktops, 1024px and up) */
@media ( min-width: 1024px ) {}

/* Large devices (large desktops, 1280px and up) */
@media ( min-width: 1280px ) {}
```

## Block Editor Specific

### Block Wrapper Classes

```css
/* Block wrapper */
.wp-block-{{slug}}-{{cpt_slug}}-card {
→   margin: 1em 0;
→   padding: 1em;
}

/* Block styles (registered via register_block_style) */
.wp-block-{{slug}}-{{cpt_slug}}-card.is-style-bordered {
→   border: 2px solid currentColor;
}

/* Editor-specific styles (editor.scss) */
.wp-block-{{slug}}-{{cpt_slug}}-card {
→   outline: 1px dashed rgba( 0, 0, 0, 0.1 );
}
```

### Layout Classes

```css
/* Alignment classes */
.alignwide {}
.alignfull {}
.alignleft {}
.alignright {}
.aligncenter {}

/* Block supports */
.has-text-color {}
.has-background {}
.has-{color}-color {}
.has-{color}-background-color {}
```

## Variables and Custom Properties

### CSS Custom Properties

```css
:root {
→   --wp--preset--color--primary: #0073aa;
→   --wp--preset--spacing--small: 1rem;
→   --wp--preset--font-size--medium: 1.125rem;
}

.selector {
→   color: var( --wp--preset--color--primary );
→   padding: var( --wp--preset--spacing--small );
}
```

### Sass Variables (if using)

```scss
// Colors
$color-primary: #0073aa;
$color-secondary: #005177;

// Spacing
$spacing-small: 1rem;
$spacing-medium: 2rem;

// Breakpoints
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;

.selector {
→   color: $color-primary;
→   padding: $spacing-small;
→
→   @media ( min-width: $breakpoint-tablet ) {
→   →   padding: $spacing-medium;
→   }
}
```

## Comments

```css
/**
 * Section Header
 *
 * Description of section.
 */

/* Sub-section or block comment */

/* Inline comment for specific property */
.selector {
→   property: value; /* Reason for specific value */
}
```

## Vendor Prefixes

Order: longest to shortest, standard last.

```css
.selector {
→   -webkit-transition: all 0.3s ease;
→   -moz-transition: all 0.3s ease;
→   transition: all 0.3s ease;
}
```

**Note:** Use autoprefixer in build process instead of manual prefixes.

## Mustache Placeholders in CSS

```css
/**
 * {{name}} Block Styles
 *
 * @package {{namespace}}
 */

.wp-block-{{slug}}-{{cpt_slug}}-card {
→   /* Block styles */
}

/* Pattern-specific styles */
.{{slug}}-pattern {
→   /* Pattern styles */
}
```

## Performance Best Practices

- Minimize use of universal selector (`*`)
- Avoid overly specific selectors
- Limit selector nesting (max 3 levels)
- Use efficient selectors (class > attribute > tag)

```css
/* Good - low specificity */
.card-title {}

/* Bad - too specific */
div.container section.content div.card h2.card-title {}

/* Bad - universal selector */
* {
→   box-sizing: border-box;
}

/* Good - targeted */
.site-content * {
→   box-sizing: border-box;
}
```
```

**Step 2: Commit**

```bash
git add .github/instructions/wpcs-css.instructions.md
git commit -m "docs: update CSS coding standards with comprehensive WordPress guidelines"
```

---

Due to length constraints, I'll continue this plan in the next section. The plan continues with:

- Task 1.4: HTML Coding Standards
- Task 1.5: PHPDoc Standards
- Task 1.6: JSDoc Standards
- Task 1.7: Accessibility Standards
- PHASE 2: Plugin Basics & Core Files Review
- PHASE 3: Custom Post Types, Taxonomies, and Fields
- PHASE 4: Blocks, Patterns, and Templates
- PHASE 5: Instruction Files Review and Update
- PHASE 6: Final Validation and Testing

Would you like me to continue writing the complete plan?
