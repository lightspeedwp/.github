I need you to go through all of the links in the references below, and compile in markdown format comprehensive coding standard documents per language, there will be an individual document per language as per the numbering system below.

The attached documentation and wordpress coding standards module should provide all of the information that you require to be able to compile LightSpeed specific coding standards.

I also want you to review the following best practices and coding standards:
<https://github.com/DekodeInteraktiv/coding-standards>
<https://10up.github.io/Engineering-Best-Practices/>
<https://github.com/10up/Engineering-Best-Practices>
<https://gutenberg.10up.com/>
<http://github.com/10up/gutenberg-best-practices/>
<https://github.com/humanmade/coding-standards>
<https://packagist.org/packages/dekode/coding-standards>

The current version is 3.2.0 and was released on the 25th of July. The github repo is here - <http://github.com/wordPress/WordPress-Coding-Standards/>

The development documentation portal can be found here - <https://developer.wordpress.org/coding-standards/>

I would like you to define coding standard instructions to include clear details about the following: 0. Common coding standards topics that should be defined for all languages:
-- Why have coding standards:
--- <https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards.md>
-- Naming Conventions
-- Spacing or indentation
-- Commenting
-- White space
-- Formatting
-- Inline documentation
-- Best Practices
-- Reference links

1. Accessibility Coding Standards:
   -- Applying WCAG Conformance Levels
   -- WCAG 2.2 consists of 4 layers:
   --- Principles
   --- Guidance
   --- Success criteria
   --- Sufficient and advisory techniques
   -- Reference links:
   --- <https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/accessibility.md>
   --- <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/Test_your_skills/CSS_and_JavaScript>
   --- <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/CSS_and_JavaScript>
   --- <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/What_is_accessibility>
   --- <https://developer.wordpress.org/block-editor/how-to-guides/accessibility/>
   --- <https://github.com/WordPress/gutenberg/edit/trunk/docs/how-to-guides/accessibility.md>
2. php:
   -- General
   -- Spacing
   -- Naming Conventions
   -- Whitespace
   -- Declare Statements, Namespace, and Import Statements
   -- Object-Oriented Programming
   -- Singletons
   -- Control Structures
   -- Operators
   -- Database
   -- Recommendations
   -- Comments
   -- Formatting
   -- References:
   --- <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/>
   --- <https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/php.md>
3. html
   -- Validation
   -- Spacing
   -- Naming Conventions
   -- Comments
   -- Self-closing Elements
   -- Attributes and Tags
   -- Quotes
   -- Indentation
   -- Best practices
   -- References:
   --- <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/>
   --- <https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/html.md>
4. JavaScript
   -- Code Refactoring
   -- Spacing
   -- Semicolons
   -- Indentation and Line Breaks
   -- Multi-line Statements
   -- Chained Method Calls
   -- Assignments and Globals
   -- Naming Conventions
   -- Equality
   -- Type Checks
   -- Strings
   -- Switch Statements
   -- JSHint
   -- Best Practices
   -- Reference links
   --- <https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/javascript.md>
5. CSS
   -- Structure
   -- Selectors
   -- Values
   -- Media Queries
   -- Naming connventions
   -- Best Practices
   -- References:
   --- <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/>
   --- <https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/css.md>
   --- <https://github.com/necolas/idiomatic-css/blob/master/README.md>
6. Inline Documentation Standards
   -- Reference links
   --- <https://jjj.blog/2012/06/inline-documentation/>
   6.1 PHP Documentation Standards
   -- What Should Be Documented
   --- Documenting Tips
   --- Formatting Guidelines
   -- DocBlock Formatting
   -- PHPDoc Tags
   -- References:
   --- <https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/>
   --- <https://github.com/WordPress/wpcs-docs/blob/master/inline-documentation-standards/php.md>
   6.2 JavaScript Documentation Standards
   -- What Should Be Documented
   -- Documenting Tips
   -- Formatting Guidelines
   -- Functions
   -- Backbone classes
   -- Local functions
   -- Local ancestors
   -- Class members
   -- Namespaces
   -- Inline Comments
   -- File Headers
   -- Supported JSDoc Tags
   -- Unsupported JSDoc Tags
   -- References:
   --- <https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/>
   --- <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/>
   --- <https://github.com/WordPress/wpcs-docs/blob/master/inline-documentation-standards/javascript.md>
7. Markdown format
   -- Headings (Note: h1 - h4 items will be automatically added to the Table of Contents.)
   -- Emphasis / formatting - italics, bold, strikethrough
   -- Links
   -- Blockquotes
   -- Lists - ordered, unordered & checkboxes
   -- Horizontal Rules
   -- Tables
   -- Example Code
   -- Reference links
   --- <https://github.com/WordPress/wpcs-docs/blob/master/styleguide.md>
8. JSON
   -- Reference links:
   --- <https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/theme-json-reference/styles-versions.md>
   --- <https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/theme-json-reference/theme-json-living.md>
   --- <https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/>
   --- Block.json schema - <https://github.com/WordPress/gutenberg/blob/trunk/schemas/json/block.json>
   --- Theme.json schema - <https://github.com/WordPress/gutenberg/blob/trunk/schemas/json/theme.json>
   --- Font collection schema - <https://github.com/WordPress/gutenberg/blob/trunk/schemas/json/font-collection.json>
9. Fluid spacing & typography
   -- Reference links
   --- Handling block spacing - <https://github.com/10up/gutenberg-best-practices/blob/main/guides/handeling-block-spacing.md>
   --- Different approaches to fluid typography and spacing - <https://crinkles.dev/writing/different-approaches-to-fluid-typography-and-layouts/>
   --- <https://github.com/lightspeedwp/ls-handbooks/blob/main/docs/block-themes/fluid-spacing.md>
   --- <https://github.com/lightspeedwp/ls-handbooks/blob/main/docs/block-themes/fluid-typography.md>
   --- <https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/>
   --- <https://www.reddit.com/r/Wordpress/comments/1eaifh4/best_practices_for_measurements_ie_px_em_rem_vw_vh/>
   --- <https://developer.mozilla.org/en-US/docs/Web/CSS/clamp>
   --- <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units>
   --- <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Values_and_Units>
   --- <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design>
   --- <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Introduction>
   --- <https://developer.mozilla.org/en-US/docs/Web/CSS/length>
   --- <https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Typography>
   --- <https://www.designsystemscollective.com/fluid-typographic-scales-revolutionize-your-responsive-design-0d10ed7f740e>
   --- <https://gutenberg.10up.com/guides/handeling-block-spacing/>
