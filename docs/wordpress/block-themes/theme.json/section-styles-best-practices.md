# **Gutenberg Section Styles Guide (WordPress 6.6)**

## **Introduction to Section Styles**

**Section Styles** are an extension of WordPress **block style variations** that let you apply a single, reusable design to an entire section of content. In practice, these are custom style variations (e.g. “Hero”, “CTA”, “Card Grid”) registered for container blocks like **Group**, **Columns**, or **Cover**. By toggling a Section Style in the editor, you instantly apply a curated set of colors, typography, spacing, etc., to that container *and its inner blocks*, rather than manually styling each block. This provides a one-click way to restyle a whole section and ensures consistency across repeated layouts[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=Section%20Styles).

Under the hood, Section Styles are powered by the **theme.json** system introduced in Full Site Editing. WordPress 6.6 massively expanded this system to support nested styling of inner elements and child blocks within a block style variation[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=discovery%20into%20a%20single%20consistent,6). Theme authors can now move many design rules from ad-hoc CSS into a unified JSON schema. In fact, developers have reported cutting “hundreds of lines” of custom CSS by migrating to theme.json for section designs[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=I%20have%20already%20cut%20100s,standardized%20system%20cannot%20be%20understated). Section Styles are most beneficial for **reusable “bands” of content** that appear throughout a site – for example, a hero banner, a features/info row, a card grid of posts, or a call-to-action strip. Defining these as Section Styles means editors can apply a tested, accessible design in one step, and any global updates to that style (in code) will propagate everywhere it’s used.

## **Naming and Structure Guidelines**

Section Styles are defined as **theme.json partial files** in your theme, usually placed under a `/styles` directory. In WordPress 6.6, you can organize this folder by variation type. For example[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=In%20the%20past%2C%20you%20could,typography%20variations%20to%20this%20folder):

`/styles/`
`├── block/        ← Section or block-specific style variations`
`├── color/        ← Color palette variations (new in 6.6)`
`├── global/       ← Whole-theme style variations`
`└── typography/   ← Font or typeset variations`

Section Style files reside in the `block/` (or `section/`) subfolder. Each file defines one variation using a JSON structure. A **recommended naming convention** is to use a clear, purposeful slug for the filename and variation slug. For example, a hero banner style might live in `styles/block/section-hero.json` with slug `"section-hero"`. Use lowercase kebab-case for slugs, and include a concise descriptor of the section’s purpose or context (e.g. `section-hero-dark`, `section-cards-grid`). This makes it easy to identify what each style is for. The JSON file also supports a human-friendly **title** (shown in the editor’s style picker) – by convention, include a word like “Section” or an icon for clarity (e.g. title `"Section · Cards"`).

Inside the variation JSON, you must specify a `blockTypes` array to declare which block(s) this style variation can be applied to. This is usually one or more container blocks such as `"core/group"`, `"core/columns"`, or `"core/cover"`[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=%22version%22%3A%203%2C%20%22slug%22%3A%20%22section,)[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=is%20used%20to%20automatically%20register,to%20a%20single%20block%20type). A Section Style can target **multiple block types at once**, a new capability in WP 6.6[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=In%20addition%20block%20style%20variations,can%20now%20be). For instance, you might want the same “Cards” style to be usable on a Group or Columns block. When WordPress registers the style variation, it will attach it to all those block types.

**File structure tips:** Keep each Section Style in its own JSON file for modularity. Ensure each file includes the required top-level fields:

- **`$schema`** – points to the WP theme.json schema (matching the WP version, see below).

- **`version`** – theme.json format version (e.g. `3` for WP 6.6+).

- **`slug`** – unique slug for this style (no spaces, used in class name).

- **`title`** – readable title for UI.

- **`blockTypes`** – array of block names that can use this style.

- **`styles`** – the actual style rules (same structure as in theme.json).

Section Style JSON files are automatically loaded by WordPress at theme init – you do *not* need to manually `register_block_style()` for JSON files placed in `/styles/block/` (WP will auto-register any unregistered style variations found in these partials)[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=The%20block%20style%20variations%20that,it%20will%20be%20stripped%20out). However, you can still register styles via PHP if needed – WP 6.6 updated the API so that `register_block_style()` can accept an **array of block types** and a `style_data` array parallel to the JSON structure[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=The%20third%20option%20for%20registering,function%20that%20make%20this%20possible)[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=register_block_style%28%20,%27var%3Apreset%7Ccolor%7Cbase). In general, using JSON files is preferable for clarity and ease of maintenance, keeping all style definitions in theme config.

## **Schema and Tokens in Theme.JSON**

When creating Section Styles, use the **theme.json Version 3 schema** (introduced in WP 6.6). At the top of each file, set the `$schema` URL to the latest schema – for example:

`{`  
 `"$schema": "https://schemas.wp.org/wp/6.6/theme.json",`  
 `"version": 3,`  
 `…`
`}`

This ensures your editor or validator knows about the new properties available. Version 3 supports nested styling of elements and blocks, which is critical for Section Styles. Under the `"styles"` object, you can include keys like `"elements"` or `"blocks"` to target inner content. For instance, you might style all links inside the section, or tweak specific blocks (headings, buttons, etc.) when they appear within the styled container. We’ll see examples of this in the next section.

It’s best practice to rely on **Global Style tokens** (presets) for all values instead of hard-coding colors, font sizes, etc. Theme.json provides a special syntax to reference preset values: **`var:preset|category|slug`](<https://developer.wordpress.org/themes/global-settings-and-styles/styles/using-presets/#:~:text=To%20reference%20presets%20in%20,base)**[[developer.wordpress.org>](<https://developer.wordpress.org/themes/global-settings-and-styles/styles/using-presets/#:~:text=To%20reference%20presets%20in%20,base>). For example, to apply the theme’s primary color you’d use `"color": "var:preset|color|primary"` in JSON, or for a spacing size token `"padding": "var:preset|spacing|60"`[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=,right). These tokens resolve to the CSS custom properties (`--wp--preset--<category>--<slug>`) output by WordPress[developer.wordpress.org](https://developer.wordpress.org/themes/global-settings-and-styles/styles/using-presets/#:~:text=For%20example%2C%20when%20you%20learned,size%E2%80%93%7B%24slug)[developer.wordpress.org](https://developer.wordpress.org/themes/global-settings-and-styles/styles/using-presets/#:~:text=body%20%7B%20,primary%3A%20%2389cff0%3B). By using `var:preset|*` references, your Section Styles will automatically reflect any changes to the preset palettes and will match what users see in design tools. In short, *avoid raw hex codes or pixel values* in theme.json – use your theme’s design tokens instead. The only time you might use a raw value is if a very unique design element isn’t covered by a token, but even then consider adding a custom preset.

The theme.json v3 schema supports nested targets like pseudo-classes on links. For example, you can define styles for `elements.link:hover` or `elements.link:focus` within your variation[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=,%7D). These let you customise link hover/focus states purely in JSON. (Currently only links have pseudo-class support in theme.json; for other hover effects, see limitations below.) You can also target specific inner blocks by name under `styles.blocks`. For example, you could adjust the heading block:

`"blocks": {`  
 `"core/heading": { "...": "..." }`  
`}`

inside your Section Style to fine-tune headings when used in that section[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=%22blocks%22%3A%20%7B%20%22core%2Fpost,%7D%20%7D). This nested schema approach is powerful – it means your JSON can mimic CSS selectors like `.is-style-mysection h2 { ... }` without writing actual CSS. The theme.json processor will merge these styles into the generated stylesheet with proper specificity.

**Important:** Theme.json v3 is only supported in WordPress 6.6+ (or Gutenberg plugin 16.2+). If your theme needs backward compatibility, you should stick to version 2 schema. Otherwise, to use Section Styles and new features, you’ll want to bump your theme’s required WP version to 6.6 and update `theme.json` to `"version": 3`[make.wordpress.org](https://make.wordpress.org/themes/2024/06/21/theme-json-version-3-frequently-asked-questions/#:~:text=Should%20I%20update%20my%20theme,to%20use%20version%203). Also, keep in mind that theme.json only covers certain CSS properties (the “design tokens” and block support flags). You cannot insert arbitrary CSS selectors or script logic into theme.json – those must still go in traditional CSS/JS files if needed.

## **WordPress 6.6 Limitations and Caveats**

While Section Styles greatly expand what’s possible in theme.json, there are some **known limitations in WordPress 6.6** to be aware of[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=The%20following%20limitations%20for%20block,6%20should%20be%20noted):

- **Global Styles UI:** Only *root-level* style properties of a variation can be tweaked through the Site Editor’s Styles panel[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=1,previewed%20within%20the%20Style%20Book). If your Section Style sets an inner block rule (e.g. a heading color), that inner style won’t appear as an adjustable option in Global Styles – those controls only reflect the global defaults. In short, Section Styles can be *applied* by editors, but not finely edited via UI in 6.6. The entire variation is treated as a predefined package of styles.

- **Style Book Preview:** Currently, custom block style variations do **not show in the Style Book**[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=%28yet%29,previewed%20within%20the%20Style%20Book). The Style Book (which previews blocks with global styles) doesn’t render your Section Styles for inspection. Users must apply the style on a real page/post to see its effect. This is planned to improve in future releases[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=What%E2%80%99s%20Next%3F)[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=The%20Global%20Styles%20UI%20UI,to%20support%20block%20style%20variations).

- **No Variation-Specific Settings:** Section Styles cannot define their own `settings` (e.g. custom presets unique to that style) – only `styles`. The theme.json `settings` are global for the theme or per-block, not per style variation[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=2,values%20%28yet). For example, you can’t have a variation that introduces a new color palette just for that style.

- **No Inheritance of Inner Variations:** A Section Style can style inner blocks, but it **cannot activate a style variation on a child block**. For instance, you could not make a Section Style that automatically applies a Button block’s “outline” style to inner buttons – style variations don’t nest within each other. You also can’t create a Section Style that *conditionally* applies different styles to different inner blocks beyond what you declare in JSON. Each variation is a fixed JSON bundle.

- **CSS Specificity and Overrides:** WordPress 6.6 introduced a **uniform specificity** for global styles (selectors now typically carry a specificity of 0-1-0)[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=discovery%20into%20a%20single%20consistent,6). This means a Section Style and a regular block style rule often have the same weight, so the cascade order or last-in stylesheet order determines which wins when nested. Notably, if an editor manually customizes a block’s style (through block settings), those inline styles or additional classes will override the Section Style in most cases – this is by design[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=This%20is%20the%20intended%20behaviour). For example, if a user sets a heading to have a blue color via the editor, and your Section Style makes headings green, the user’s choice will prevail because it’s a more specific or later-loaded rule. Section Styles are meant to provide smart defaults, but **user adjustments override them** (just as Global Styles do).

- **No Media Queries or Conditional Logic:** Theme.json (and thus Section Styles) cannot handle responsive breakpoints or stateful logic. You can use CSS tricks like fluid units (and WP’s fluid presets for font/spacing) for responsiveness, but you can’t, for instance, change a layout at a specific breakpoint via theme.json alone. Likewise, you can’t target states like `:first-child` or parent selectors – the JSON schema doesn’t allow those. Any such needs require custom CSS (possibly inserted via the `styles.css` hook in theme.json – see next section – or a stylesheet).

- **Limited Hover and Interactivity:** Aside from link hover/focus styling, theme.json currently doesn’t support most pseudo-classes. For example, you can’t define how a button’s background should change on hover using theme.json alone. Similarly, any design that relies on dynamic behavior (e.g. toggling classes with JS) is outside theme.json’s static scope. This means some interactive styling (menus on hover, etc.) still needs CSS in your theme. WordPress is working on exposing more in JSON, but for now these are constraints.

- **Block Support Gaps:** Not all blocks expose all their styling via Global Styles yet. A notable example discussed is the **Pagination** block – it had limited support for styling its elements in 6.6. If your Section Style involves a block that isn’t fully supported (e.g. styling the appearance of the page number links or hover state in Pagination), you may need to supplement with custom CSS. Always test your Section Styles with the blocks in question to see if any part of the design isn’t applied, and check Gutenberg release notes for ongoing improvements.

Keep these limitations in mind when designing Section Styles, so you don’t get caught off guard. Most are expected to be addressed in upcoming WordPress versions[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=What%E2%80%99s%20Next%3F). For now, design within these boundaries to ensure consistent results.

## **Conflict Management Strategies**

With multiple Section Styles and global styles at play, you may occasionally hit conflicts or specificity issues. Here’s how to manage and avoid them:

- **Understand Cascade Priority:** As noted, a user’s direct block style settings override Section Styles, and Section Styles override global defaults. This is the intended hierarchy[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=This%20is%20the%20intended%20behaviour). So if a Section Style isn’t “working,” first check if an inline style or class from the editor is taking precedence. For example, if the user set a different font size on a heading block, that will override your variation’s typography for that heading.

- **Avoid Nesting Section Styles if Possible:** Technically you can nest a styled Group within another styled Group (each with different Section Styles). Thanks to the reduced specificity in 6.6, this *can* work, but if both variations target some of the same inner elements, you might see cascade conflicts (whichever style is applied to the inner block last in the stylesheet will win). If you must nest, ensure your inner variation redefines any crucial styles. For instance, if a parent section makes all headings blue, and an inner section style wants them red, you should explicitly set the inner heading color in the inner variation’s JSON (under `styles.blocks.core/heading`) to override the inherited blue. In general, **don’t stack section variations on the same block** – use them on distinct containers.

- **Scope Styles to Specific Elements:** A good practice is to keep broad styles (background, overall text color) at the root of the Section Style, but move more granular typography or spacing rules into targeted inner selectors. For example, instead of making *all* text in a section 18px, perhaps target just headings or paragraphs specifically. This way, if another section is nested, you have more control. It also prevents unintended inheritance. In other words, **target what you mean to style** as deeply as needed, rather than applying one size/color to all elements globally and then fighting to override it in sub-sections.

- **Use the CSS Escape Hatch Sparingly:** WordPress allows adding custom CSS in theme.json via a `"css"` property (per block or per section)[developer.wordpress.org](https://developer.wordpress.org/news/2023/04/per-block-css-with-theme-json/#:~:text=You%20add%20custom%20styles%20by,generate%20that%20for%20the%20block)[developer.wordpress.org](https://developer.wordpress.org/news/2023/04/per-block-css-with-theme-json/#:~:text=%7B%20,spacing%3A%201px%3B%22%20%7D). In a Section Style JSON, you can include `"css": "& .your-selector { ... }"` to append extra rules. This is useful for edge cases (e.g. targeting a particular child element or using a pseudo-class not supported by schema). The `&` will be replaced by the section’s class (e.g. `.wp-block-group.is-style-section-hero`) when generated[developer.wordpress.org](https://developer.wordpress.org/news/2023/04/per-block-css-with-theme-json/#:~:text=Using%20the%20%26%20selector%20and,brackets)[developer.wordpress.org](https://developer.wordpress.org/news/2023/04/per-block-css-with-theme-json/#:~:text=block,a%20custom%20block%20style%20variation). If you use this, keep it minimal – *don’t* overload it with large chunks of CSS. And remember such CSS won’t be editable via Global Styles. Use it only when the JSON format truly cannot achieve the needed effect.

- **Prefer JSON Solutions:** As a rule, if something *can* be done within the theme.json schema, do it that way rather than writing custom CSS. This ensures consistency and that the styles show up in the editor UI. For example, setting padding via JSON means it’s reflected in the editor canvas and can be tweaked by design tools, whereas a manual CSS rule might not. Justin Tadlock, a core developer, noted: *“If it can be done via JSON, it usually should be… things like border, color, shadow, spacing, and typography are all easily portable to JSON… only use block stylesheets for things not part of the standard design tools.”*[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=Absolutely,to%20JSON%20from%20block%20stylesheets) In practice, this means leveraging presets, `elements`, and `blocks` keys in JSON to resolve conflicts (by increasing specificity in JSON) before reaching for `!important` or additional CSS.

**Debugging tip:** To troubleshoot a Section Style, use your browser’s inspector to see which CSS rules are affecting the element in question. Because WP outputs styles in a certain order (global styles, then global user customizations, then section style CSS, then block-specific user customizations, etc.), checking the order will show what’s winning. If your section JSON rule is getting overridden by a later rule, you might need to adjust by targeting a more specific element (as above) or accept that the user’s own style is intended to override it.

## **Example Implementations (JSON Templates)**

Let’s look at some concrete examples of Section Styles in JSON. Below are four common section types – **Hero, Card Grid, Info Row, and Call To Action** – with JSON snippets showing how you might implement each. These examples demonstrate using presets (`var:preset` tokens), nested element and block styling, and the occasional `css` string for edge cases.

**1\. Hero Section (Dark Hero)** – A full-width hero banner with a dark background and prominent text. Typically used for the top section of a page.

`{`  
 `"$schema": "https://schemas.wp.org/wp/6.6/theme.json",`  
 `"version": 3,`  
 `"slug": "section-hero",`  
 `"title": "Section · Hero",`  
 `"blockTypes": [ "core/group", "core/cover" ],`  
 `"styles": {`  
 `"color": {`  
 `"background": "var:preset|color|contrast",   /* dark background (e.g. black) */`  
 `"text": "var:preset|color|base"             /* light text (e.g. white) */`  
 `},`  
 `"typography": {`  
 `"fontSize": "var:preset|font-size|x-large", /* base font size for section */`  
 `"lineHeight": "1.3"`  
 `},`  
 `"spacing": {`  
 `"padding": {`  
 `"top": "var:preset|spacing|70",`  
 `"bottom": "var:preset|spacing|70",`  
 `"left": "var:preset|spacing|30",`  
 `"right": "var:preset|spacing|30"`  
 `}`  
 `},`  
 `"elements": {`  
 `"link": {`  
 `"color": {`  
 `"text": "var:preset|color|base"`  
 `},`  
 `"typography": {`  
 `"textDecoration": "underline"`  
 `},`  
 `":hover": {`  
 `"typography": {`  
 `"textDecoration": "none"`  
 `}`  
 `}`  
 `}`  
 `},`  
 `"blocks": {`  
 `"core/heading": {`  
 `"typography": {`  
 `"fontSize": "var:preset|font-size|xx-large",`  
 `"fontWeight": "700"`  
 `},`  
 `"color": {`  
 `"text": "var:preset|color|base"`  
 `},`  
 `"spacing": {`  
 `"margin": {`  
 `"bottom": "var:preset|spacing|20"`  
 `}`  
 `}`  
 `}`  
 `}`  
 `}`  
`}`

*About this style:* The Hero section uses the theme’s **“contrast” color** for a dark background and **“base” color** for text (assuming those presets are something like black and white)[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=,%7D%20%7D). It adds generous padding (`spacing.padding` presets) to top and bottom for a spacious feel. All headings (`core/heading`) inside are made extra large, bold, and also colored base (ensuring they appear in light text on the dark background). We also used `elements.link` to style links in the hero: here we make links the same light color and underline them by default, removing the underline on hover (to highlight that interactivity). If the hero is implemented with a Cover block, this style will still apply (we included core/cover in blockTypes). Note no custom `css` was needed – everything is handled via theme.json keys.

**2\. Card Grid Section** – A section for a grid of “card” items, e.g. a posts grid or features grid. Typically implemented with a Columns block containing multiple Column blocks, each acting as a card.

`{`  
 `"$schema": "https://schemas.wp.org/wp/6.6/theme.json",`  
 `"version": 3,`  
 `"slug": "section-cards",`  
 `"title": "Section · Cards",`  
 `"blockTypes": [ "core/group", "core/columns" ],`  
 `"styles": {`  
 `"color": {`  
 `"background": "var:preset|color|surface",    /* neutral light background for cards section */`  
 `"text": "var:preset|color|contrast"          /* use default text color (e.g. dark) */`  
 `},`  
 `"elements": {`  
 `"link": {`  
 `"color": {`  
 `"text": "var:preset|color|primary"       /* links in cards use primary brand color */`  
 `},`  
 `"typography": {`  
 `"textDecoration": "none"`  
 `}`  
 `}`  
 `},`  
 `"blocks": {`  
 `"core/heading": {`  
 `"typography": {`  
 `"fontSize": "var:preset|font-size|large",`  
 `"fontWeight": "600"`  
 `},`  
 `"spacing": {`  
 `"margin": {`  
 `"top": "0",`  
 `"bottom": "var:preset|spacing|20"`  
 `}`  
 `}`  
 `},`  
 `"core/paragraph": {`  
 `"typography": {`  
 `"fontSize": "var:preset|font-size|medium"`  
 `},`  
 `"spacing": {`  
 `"margin": {`  
 `"bottom": "var:preset|spacing|20"`  
 `}`  
 `}`  
 `}`  
 `},`  
 `"css": "& .wp-block-post-terms__separator { display: none; }"`  
 `}`  
`}`

*About this style:* The Cards section is scoped to Groups or Columns that serve as a container for a grid of items. It sets a **“surface” color** for the background (presumably a light gray or off-white) to distinguish the section from a plain white page background. Text remains the default contrast (dark) color for readability. We styled links within this section to use the theme’s **primary color** and removed underlines (since links might be buttons or titles of cards). We targeted headings and paragraphs inside the cards to adjust their size and spacing – headings get a larger font and a bottom margin, paragraphs get a medium font size. These ensure consistent typography in each card. Lastly, we demonstrate a `css` override: this example hides the separator character in a Post Terms block (which might be used to list categories on a post card). We used the `& .wp-block-post-terms__separator` selector to target that element inside this section. This is a niche tweak (removing the decorative separator), included to show how to handle something not available via standard JSON properties. In most cases, you might not need custom CSS in a cards section, but it’s there if needed.

**3\. Info Row Section** – A horizontal info bar or feature list, often used to highlight key points (e.g. stats, USPs). Could be a single Group with inner paragraphs or a Columns block with each column containing an icon and text.

`{`  
 `"$schema": "https://schemas.wp.org/wp/6.6/theme.json",`  
 `"version": 3,`  
 `"slug": "section-info-row",`  
 `"title": "Section · Info Row",`  
 `"blockTypes": [ "core/group", "core/columns" ],`  
 `"styles": {`  
 `"color": {`  
 `"background": "var:preset|color|accent-2",   /* a subtle accent background */`  
 `"text": "var:preset|color|contrast"          /* standard text color */`  
 `},`  
 `"spacing": {`  
 `"padding": {`  
 `"top": "var:preset|spacing|40",`  
 `"bottom": "var:preset|spacing|40",`  
 `"left": "var:preset|spacing|20",`  
 `"right": "var:preset|spacing|20"`  
 `}`  
 `},`  
 `"blocks": {`  
 `"core/heading": {`  
 `"typography": {`  
 `"fontSize": "var:preset|font-size|medium",`  
 `"fontWeight": "600"`  
 `},`  
 `"spacing": {`  
 `"margin": {`  
 `"bottom": "var:preset|spacing|10"`  
 `}`  
 `}`  
 `},`  
 `"core/paragraph": {`  
 `"typography": {`  
 `"fontSize": "var:preset|font-size|small"`  
 `}`  
 `}`  
 `}`  
 `}`  
`}`

*About this style:* The Info Row section uses an **accent color** (perhaps a light tinted background) to set it apart from plain content. We’ve added moderate padding so it has some vertical separation. Inside, we assume an info item might have a heading (for a stat or feature title) and a paragraph (for a description). The heading is styled to be slightly bolder and larger than normal text, but smaller than a typical heading (since info stats are often a bit more subtle). The paragraph is set to a small font size. These help multiple info items in a row appear uniform. If the info row uses Icons or other blocks, additional styling could be added (e.g. targeting `core/image` for icon images to set a max-width), but for brevity we haven’t included that here. There is no custom CSS needed in this example – it’s purely using tokens and basic properties.

**4\. Call-To-Action Section** – A banner or strip intended to draw user attention and prompt an action (like signing up or contacting sales). Often has a short line of text and a button.

`{`  
 `"$schema": "https://schemas.wp.org/wp/6.6/theme.json",`  
 `"version": 3,`  
 `"slug": "section-cta",`  
 `"title": "Section · Call To Action",`  
 `"blockTypes": [ "core/group", "core/cover" ],`  
 `"styles": {`  
 `"color": {`  
 `"background": "var:preset|color|primary",    /* brand primary color background */`  
 `"text": "var:preset|color|base"              /* light text for contrast */`  
 `},`  
 `"spacing": {`  
 `"padding": {`  
 `"top": "var:preset|spacing|50",`  
 `"bottom": "var:preset|spacing|50",`  
 `"left": "var:preset|spacing|30",`  
 `"right": "var:preset|spacing|30"`  
 `}`  
 `},`  
 `"elements": {`  
 `"link": {`  
 `"color": {`  
 `"text": "var:preset|color|base"`  
 `},`  
 `"typography": {`  
 `"textDecoration": "underline"`  
 `},`  
 `":hover": {`  
 `"typography": {`  
 `"textDecoration": "none"`  
 `}`  
 `}`  
 `}`  
 `},`  
 `"blocks": {`  
 `"core/heading": {`  
 `"typography": {`  
 `"fontSize": "var:preset|font-size|large",`  
 `"fontStyle": "italic"`  
 `}`  
 `},`  
 `"core/button": {`  
 `"color": {`  
 `"background": "var:preset|color|base",   /* white button */`  
 `"text": "var:preset|color|primary"       /* text in button matches section bg */`  
 `},`  
 `"border": {`  
 `"radius": "4px"`  
 `},`  
 `"spacing": {`  
 `"padding": {`  
 `"top": "0.5em", "bottom": "0.5em", "left": "1.5em", "right": "1.5em"`  
 `}`  
 `}`  
 `}`  
 `}`  
 `}`  
`}`

*About this style:* The CTA section uses the theme’s **primary brand color** as a bold background, with white (base) text for maximum contrast. We gave it generous padding so it stands out as a separate band. For any links in the text, we styled them to appear as standard underlined links in white (and removing underline on hover) – for instance, if the CTA text says *“Learn more about our services”* and “Learn more” is a link, it will be underlined. The assumption, though, is a CTA will have a Button block for the main action. We included a rule for `core/button` to style the button with a white background and primary-colored text (an “inverted” style that complements the section). We also added a small border radius and some padding to give the button a custom look. All of this is done in JSON. Note: the Button block’s default style might differ, but by specifying these under the Section Style, we ensure that whenever a Button is placed inside a Group/Cover with `section-cta` style, it adopts this inverted color scheme. (If the user applies a different button style or color manually, that will override our settings – which is fine.) No extra CSS was needed; hover states for the button background aren’t covered here due to theme.json limitations, but the button will at least match the section style.

Each of these JSON examples can be saved as a file in your theme’s `styles/block/` folder. In a real theme, you would replace the preset names with ones defined in your theme, and adjust values to match your design system. The above are illustrative, showing how to combine **color**, **spacing**, **typography**, **elements.link**, **blocks.core/**\*, and even **css** in your section style definitions.

## **Copilot Prompt Examples for Section Styles**

If you’re using GitHub Copilot (or another code assistant), here are some reusable prompt templates to help generate and troubleshoot Section Styles. These prompts assume Copilot has access to your theme context (design tokens, etc.) and can significantly speed up your workflow:

- **Generate a New Section Style:**

`"Create a /styles/block/section-{slug}.json for core/group and core/columns using these tokens: [list tokens]. Include nested styles for core/heading, core/paragraph, and elements.link. Avoid unsupported CSS (pseudo-elements, selectors) and keep to schema v3. Provide a short description and an A/B test name."`

*Use this prompt to have the AI draft a new section style JSON.* The instruction guides Copilot to use the correct file location, apply tokens you specify (e.g. colors or spacing values you want), include some inner element styling, and avoid things we know theme.json can’t do. It even asks for a short description/A/B name if you are doing testing. You would replace `[list tokens]` with actual token names from your design (for example: “accent-1 background, base text, large font size, 40px padding”). Copilot should then produce a JSON snippet following these guidelines.

- **Resolve a Style Conflict:**

`"Given section styles A (dark) and B (card), a Group inside a Group shows wrong heading colour. Propose which rules to move to inner block-scoped styles (styles.blocks.core/heading) in section B, and which remain at root, so the inner card’s heading wins. Confirm selectors/specificity assumptions for WP 6.6."`

*Use this prompt when two section styles are clashing (for example, nested as parent and child).* This asks the AI to analyze which CSS rules should be adjusted so that the inner section’s styles take precedence for a particular element (here, headings). It explicitly mentions moving rules to `styles.blocks.core/heading` in the inner style – which is the JSON way of increasing specificity – and asks for confirmation of how specificity works in WP 6.6. The AI’s answer can help you pinpoint what to change in your theme.json files to fix the conflict.

- **Scaffold a GitHub Issue for a New Style:**

`"Draft a GitHub issue for 'Section Style: Blog Sidebar'. Include: objective, affected blocks, design tokens used, constraints (WP 6.6 limits), a test plan (including Style Book note), and a rollback plan."`

*Use this prompt to generate a well-structured issue description* when you’re adding a new Section Style to your project. It reminds the AI to include key sections: what the goal of the new style is, which blocks it targets, which tokens or presets will be involved, any known constraints (perhaps “no hover state for links” etc.), how to test it (e.g. apply it in the editor, check front-end, check Style Book – noting that Style Book doesn’t show it), and how to roll it back if something goes wrong. This ensures your issue covers all bases for your team and QA.

Feel free to adapt these prompts to your team’s naming conventions or the particular problem you’re trying to solve. The idea is to leverage AI to follow the **“schema-first” approach** – enforcing the use of theme.json structure and known best practices from this guide, rather than blindly suggesting CSS that might not fit.

## **Figma → Theme.JSON Hand-off (Design Token Mapping)**

When translating a design system from Figma into theme.json presets, it’s important to map Figma’s **design tokens** to WordPress concepts in a consistent way. Below is a mapping of common token types to theme.json preset definitions:

**Color Tokens → theme.json Palette**  
 Designers often define colors with names like “Primary”, “Secondary”, “Neutral 100”, etc. In theme.json, these become entries in the **color palette** (under `settings.color.palette`). For example:

| Figma Color Token         | Example Value | theme.json Mapping                                                           |
| ------------------------- | ------------- | ---------------------------------------------------------------------------- |
| Primary (Brand Blue)      | `#0055EE`     | Palette color with `"slug": "primary"` – use \`var:preset                    |
| Secondary (Accent Orange) | `#FF7733`     | Palette color with `"slug": "secondary"` – use \`var:preset                  |
| Neutral 100 (Light Gray)  | `#F3F3F3`     | Palette color with `"slug": "surface"` (or “neutral-100”) – use \`var:preset |
| Neutral 900 (Dark Gray)   | `#111111`     | Palette color with `"slug": "contrast"` – use \`var:preset                   |
| Base (White)              | `#FFFFFF`     | Palette color `"slug": "base"` – use \`var:preset                            |

*Guidance:* Use clear, semantic slugs for colors (e.g. *primary, secondary, contrast, base, surface*). Ensure contrast pairs (text vs background) are considered – e.g. in the table above, “base” (white) is meant for backgrounds when “contrast” (black/dark) is used for text, and vice versa. Figma’s names might be numeric (Neutral 900\) – you can rename these to more semantic slugs in theme.json if desired (e.g. neutral-900 → contrast).

**Spacing Tokens → theme.json Spacing Scale**  
 If your design defines a spacing scale (e.g. increments like 4px, 8px, 16px labeled XS, S, M, L, etc.), map these to theme.json **`spacing.spacingSizes`** presets:

| Figma Spacing Token | Pixel Value | theme.json Mapping                                                          |
| ------------------- | ----------- | --------------------------------------------------------------------------- |
| XS (Extra Small)    | 4px         | Add to `spacingSizes`: `{ "slug": "xs", "size": "4px" }` – use \`var:preset |
| S (Small)           | 8px         | `spacingSizes`: `{ "slug": "s", "size": "8px" }` – use \`var:preset         |
| M (Medium)          | 16px        | `spacingSizes`: `{ "slug": "m", "size": "16px" }` – use \`var:preset        |
| L (Large)           | 32px        | `spacingSizes`: `{ "slug": "l", "size": "32px" }` – use \`var:preset        |
| XL (Extra Large)    | 64px        | `spacingSizes`: `{ "slug": "xl", "size": "64px" }` – use \`var:preset       |

*Guidance:* Keep the unit (px, em, etc.) in the value. Use slugs that make sense (avoid just numbers if possible; “m” is fine if scale is well-known, or use numbers like “spacing-4” but be consistent). Once defined, use these for margins, padding, gaps in your Section Styles. This way, if the design team updates spacing (or switches to fluid values), you update it in one place.

**Typography Tokens → theme.json Font Presets**  
 For typography, Figma might have font size names (H1, H2, Body, Small, etc.). Map these to **`fontSizes`** in theme.json, and font families to `fontFamilies` if you have custom fonts:

| Figma Text Style     | Size/Style             | theme.json Mapping                                                                                |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| H1 (Hero Heading)    | 48px, Bold             | `fontSizes`: `{ "slug": "xx-large", "size": "3rem" }` (approx 48px). Use \`var:preset             |
| H2 (Section Heading) | 36px, Bold             | `fontSizes`: `{ "slug": "x-large", "size": "2.25rem" }`. Use \`var:preset                         |
| Body (Paragraph)     | 16px, Regular          | `fontSizes`: `{ "slug": "medium", "size": "1rem" }`. Use \`var:preset                             |
| Small Text           | 14px, Regular          | `fontSizes`: `{ "slug": "small", "size": "0.875rem" }`. Use \`var:preset                          |
| Brand Font (Display) | Font Family "AcmeCorp" | `fontFamilies`: `{ "slug": "brand", "fontFamily": "\"AcmeCorp\", sans-serif" }`. Use \`var:preset |

*Guidance:* Establish a consistent set of font size slugs that cover your use cases (WP themes often use names like small, normal, medium, large, x-large, etc.). Match Figma styles to these. For font families, if you have custom fonts (like a brand display font), register them in `settings.typography.fontFamilies`. That provides a token you can use in styles (e.g. setting `typography.fontFamily`: `"var:preset|font-family|brand"` for a heading). Make sure to enqueue the font files or include them via Google Fonts as needed; theme.json can declare font face sources as well.

**Effect Tokens (Shadows, Radii) → theme.json Presets**  
 Figma may have standardized shadows or corner radii. WP 6.6 allows defining **shadow presets** and **border radius presets** similarly:

- *Example:* Figma shadow called "Card Shadow" \-\> add to `settings.shadow.presets` with a slug (e.g. `"card"`) and the CSS shadow value. Then use `var:preset|shadow|card` in Section Styles (`styles.shadow` property).

- *Example:* Figma border radius tokens (Small \= 4px, Round \= 999px) \-\> map to `settings.border.radiusSizes` with slugs (`"small"` \= 4px, `"round"` \= 999px). Then use in styles like `"border": { "radius": "var:preset|border-radius|small" }`. (Note: border radius presets usage in theme.json v3 uses a different key, but conceptually similar.)

By mapping design tokens to theme.json presets, you create a “source of truth” that both designers and developers share. When handing off, it’s useful to include in documentation a table like above so everyone knows that e.g. “Primary” in Figma equals `--wp--preset--color--primary` in code[developer.wordpress.org](https://developer.wordpress.org/themes/global-settings-and-styles/styles/using-presets/#:~:text=For%20example%2C%20when%20you%20learned,size%E2%80%93%7B%24slug).

**Generation Guardrails:** When generating JSON from design specs (manually or via AI tools), keep these tips in mind:

- *Double-check units:* Figma might use pixels, but theme.json can handle units like em, rem for scalability. Decide on a consistent unit (rem is common for font sizes to allow user scaling). Update token values accordingly during mapping.

- *Ensure schema validity:* Use the `$schema` link in your JSON and consider using a JSON linter/validator. A tiny syntax error can break your theme.json. The schema will catch unknown properties.

- *Name slugs predictably:* Slugs should be lowercase, alphanumeric (and hyphens). They become part of class names and variables, so keep them short and indicative (avoid spaces or special chars).

- \*Keep design tokens **global\***: Don’t create one-off presets hidden inside a Section Style. If a color is only used in one section, it’s still better to put it in the global palette so it’s documented and perhaps reusable later. It also lets editors use that color elsewhere if desired.

- *Document any deviations:* If a token couldn’t be mapped (e.g. a Figma gradient or complex effect), note that and decide if it will be handled via custom CSS. Theme.json doesn’t support gradients as presets in the same way as solid colors (though you can define gradient presets, they have specific format). Likewise, advanced filters or blend modes might be out of scope.

- \*Leverage **fluid presets\***: WordPress now supports fluid typography and spacing. If your Figma uses responsive sizing (say it specifies different values for mobile), consider using WP’s fluid preset features (e.g. font size presets can have fluid values). This might not directly map from Figma tokens, but it’s worth exploring for better responsiveness without media queries.

In summary, maintain a clear mapping of Figma design tokens to theme.json presets so that your Section Styles can directly use `var:preset` references. This ensures design fidelity and makes it easier to update values in one place.

## **GitHub Templates for New Section Styles**

When adding a new Section Style to your project, it’s helpful to standardize how you document and review it. Using an issue template can ensure all relevant details are captured. Below is a template outline you might use for GitHub issues (or pull requests) when proposing/implementing a new Section Style:

`**Title:** Section Style – [Name of Section]`

`**Labels:** enhancement, section-style, design-system 🎨`

`**Overview:**`
`- **Goal/Purpose:** Describe what this section style is for (e.g. “A promotional hero section for landing pages with background image and large title”).`
`- **Design Reference:** Link to Figma frames or design docs for this section. Include screenshot if possible.`
`- **Block Types:** Which blocks will this style apply to (Group, Columns, Cover, etc.).`
`- **Style Summary:** High-level summary of the stylistic choices (colors, typography, spacing, any special element tweaks).`

`**Implementation Plan:**`
``- Add JSON file `/styles/block/section-[slug].json` with defined presets.``
`- Use existing design tokens: [list key tokens like colors, font sizes, etc.].`
`- Include any needed nested styles (e.g. “style headings H3 and buttons inside the section”).`
`- (If needed) Include minimal custom CSS in the JSON for anything not supported (explain why).`

`**Constraints/Considerations:**`
`- Note any WP 6.6 limitations (e.g. “will not show in Style Book preview”, “button hover state not possible via theme.json – will accept default hover”).`
`- Accessibility check: e.g. color contrast meets guidelines (provide contrast ratios for text on background).`
`- Responsive: if using fluid typography or spacing, mention how it’s tested.`

`**Test Plan:**`
`1. **Editor:** Apply the Section Style in the Site Editor or post editor. Verify the styles (colors, fonts, etc.) appear as expected in editor.`
`2. **Front-end:** Publish and view on front-end. Verify it matches design and is responsive.`
`3. **Style Book:** (If applicable) Check Style Book – note that custom section styles might not preview (expected in 6.6).`
`4. **Nested Scenario:** Test a section of this style inside another section (if applicable) to confirm no weird inheritance issues.`
`5. **Cross-Browser:** Basic check on Chrome, Firefox, Safari for any rendering differences.`

`**Rollback Plan:**`
`- This feature is self-contained. To disable, we can remove or comment out the JSON file and unregister the style if needed.`
`- No migration for content needed (sections will just lose the style option if rolled back).`
`- We will keep a backup of the JSON in case of reintroducing.`

`**Additional Notes:**`
`- [Include any other info, e.g. if this is behind a feature flag or toggle in the theme.]`

This template ensures everyone involved considers the important aspects: design fidelity, technical constraints, testing, and fallback. You can further integrate this into GitHub by creating an **Issue Form** (YAML file in `.github/ISSUE_TEMPLATE`). For example, a simplified excerpt of such a form might look like:

`name: "Section Style: New Variation"`  
`labels: [ "section-style", "theme.json" ]`  
`description: "Propose a new Section Style (block style variation) including design and implementation details."`  
`body:`  
 `- type: markdown`  
 `attributes:`  
 `value: "## Goal\nBriefly describe the section's purpose..."`  
 `- type: textarea`  
 `id: design_tokens`  
 `attributes:`  
 `label: "Design Tokens Used"`  
 `description: "List key color, typography, spacing tokens for this style."`

…and so on for each section (Test Plan, Rollback). This would present a structured form for contributors when opening a new issue. Whether using a freeform template or an Issue Form, the key is to cover **labels** (to categorize it, e.g. `section-style` label), a clear **test plan**, and a **rollback plan** in case the style needs to be removed or adjusted. Including those shows forethought and makes QA and project managers happy.

## **Debug Playbooks for Common Problems**

Even with best practices, you may encounter some common issues when working with Section Styles. Use the following checklists to diagnose and resolve them:

**A. Section Style not applying (or part of it not working):**

- **Style registration:** Confirm the JSON file is in the correct folder (`/styles/block/`) and named properly (`section-*.json`). If the style isn’t appearing in the editor at all, it might not be loading – check your theme’s minimum WP version (must be ≥6.6 for version 3 theme.json) and that the file has a unique slug.

- **Block selection:** Make sure you applied the style to the intended block. The style will only show for the block types listed in `blockTypes`. E.g. if your style is for core/group but you applied it to a Cover block, nothing happens (unless you included core/cover in blockTypes).

- **Cascading override:** If a specific CSS property isn’t taking effect, inspect the page with developer tools. Look at the element’s classes and computed styles. Is another rule overriding yours (maybe an inline style or a more specific selector)? For example, if a paragraph inside has an inline color set, theme.json styles won’t override that[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=This%20is%20the%20intended%20behaviour). The solution might be to remove the manual formatting or ensure your style targets a more specific element.

- **Specificity issues:** Remember that global styles and section styles often have the same specificity. WordPress tries to output section styles later so they win, but in nested cases the order can be tricky[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=discovery%20into%20a%20single%20consistent,6). If your parent section’s styles are overriding a child, consider moving the child-specific rules into the child’s section style (as discussed in Conflict Management).

- **Schema errors:** If nothing is applying, your JSON might have a syntax error and WP ignored it. Check browser console or WP site health for JSON errors. Validate the JSON against the schema URL. Common mistakes include trailing commas, incorrect property names, or using an unsupported value (e.g. a wrong preset reference).

**B. Spacing or layout looks “off” (spacing drift between editor and front):**

- **Check theme layout settings:** If your theme uses `layout` (content size, etc.) or if the section is full-width vs constrained, differences can appear. The Site Editor might show padding differently if not in a full-width template. Test with the front-end in mind (often front is correct).

- **Fluid spacing/typography differences:** If you’re using fluid values (clamp, etc.), minor discrepancies can occur due to rounding or viewport differences. Ensure that the editor canvas is wide enough or zoom set to 100% to reflect fluid values. Also double-check the computed value on different screen sizes to ensure it stays within expected range (not too small on mobile, etc.). Adjust your clamp() min/max if needed.

- **Nested margins collapsing:** If you see unexpected extra or less space, remember that vertical margins can collapse in CSS. E.g. a heading with margin-bottom inside a group with margin-top might overlap. In such cases, consider using padding on the container rather than margins on the first/last element, or use the `:first-child/:last-child` selectors in custom CSS if absolutely needed (not available in theme.json). A quick fix can be giving the container a tiny padding (like 1px) to prevent margin collapse – or just be conscious of using only padding for section spacing.

- **Consistent units:** Ensure you didn’t mix units inadvertently – e.g. using `em` in one place and `px` in another could cause scaling issues. It’s usually fine, but if something looks off, try using the same unit for related measurements or rely on preset values.

**C. Missing styles for interactive states or elements (e.g. no hover effect, pagination unstyled):**

- **Hover/Focus styles:** As noted, theme.json supports link hover via `elements.link: hover/focus`, but not for other blocks. If your design calls for a hover change on a button or column, you’ll need to add custom CSS. For example, you might add in your theme’s stylesheet a rule targeting `.is-style-section-cta .wp-block-button__link:hover { background: ... }` for a CTA button hover. Keep these in a dedicated CSS file or inject via `styles.css` in theme.json for that block style[developer.wordpress.org](https://developer.wordpress.org/news/2023/04/per-block-css-with-theme-json/#:~:text=At%20the%20moment%2C%20WordPress%20only,ticket%20to%20add%20element%20support).

- **Pagination or complex block parts:** Some blocks (Navigation, Query Pagination, etc.) have sub-components that aren’t yet stylable via theme.json. Check the block’s documentation – if there are no Global Style options for that piece, you likely must write CSS. For instance, to style the current page number in Pagination, you might target `.wp-block-pagination__page.is-current` in CSS. Include these styles in your theme’s stylesheet or as a temporary fix in Additional CSS. Monitor WordPress dev notes – future versions may add support for these, and you can then migrate your CSS into theme.json presets.

- **Icons or pseudo-elements:** If an icon (say a SVG icon in a button) isn’t taking color from your Section Style, it might be an inline SVG that requires a CSS fill rule. Again, use custom CSS: e.g. `.is-style-section-info-row .wp-block-button__link svg { fill: white; }` if needed. Pseudo-elements (`::before/::after`) also can’t be styled via JSON; any needed (for decorative flourish, etc.) must be handled by adding custom CSS or perhaps using an extra HTML block.

- **Consider contributions to Core:** If you find yourself adding a lot of the same custom CSS for things that feel like they *should* be in theme.json (like a particular block part), consider checking Gutenberg GitHub issues. There may already be an open issue or PR to add support. For example, WordPress 6.7+ might introduce more pseudo-class or block-part options. If not, you might even contribute a suggestion. In the meantime, document these exceptions in your code comments so future maintainers know why that CSS exists.

Using the above playbooks, you can systematically address issues. The key theme is: **verify the source of truth (JSON), then verify how it’s output (CSS), then adjust either the JSON or add a bit of CSS as needed** – always favouring JSON where possible. With WordPress 6.6’s improvements and those on the horizon, Section Styles are becoming a robust tool for theme developers to create flexible, design-system-driven themes with less code and more consistency. Happy theming\!

**Sources:** Official WordPress Developer Blog and Make/Core announcements were referenced for accuracy on new features and limitations[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=discovery%20into%20a%20single%20consistent,6)[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=1,previewed%20within%20the%20Style%20Book)[make.wordpress.org](https://make.wordpress.org/core/2024/06/24/section-styles/#:~:text=This%20is%20the%20intended%20behaviour)[developer.wordpress.org](https://developer.wordpress.org/news/2024/06/styling-sections-nested-elements-and-more-with-block-style-variations-in-wordpress-6-6/#:~:text=Absolutely,to%20JSON%20from%20block%20stylesheets), alongside WordPress Handbook documentation on using presets[developer.wordpress.org](https://developer.wordpress.org/themes/global-settings-and-styles/styles/using-presets/#:~:text=To%20reference%20presets%20in%20,base) and theme.json structure. These provide further reading and context for the concepts covered in this guide.

Sources  
Extended thinking
