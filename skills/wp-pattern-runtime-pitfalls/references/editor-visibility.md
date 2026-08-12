# Keeping hover-reveal panels editable in the editor

A block style whose child panel is hidden until `:hover` / `:focus-within` (a slide-out timeline milestone, a team-member overlay, etc.) is a problem **in the editor**: authors can't select or edit text they can't reveal. You can keep that panel **permanently visible inside the block editor** while it stays collapsed-until-hover on the front end.

## How it works

Enqueued block-style CSS (via `wp_enqueue_block_style`, or the `core-*.css` filename convention that auto-wires it) **loads inside the editor iframe too**. So a rule prefixed with `.editor-styles-wrapper` matches **only** in the editor and never on the front end:

```css
/* front end: collapsed until hover (in the block's enqueued CSS) */
.is-style-timeline-milestone .milestone__info { grid-template-rows: 0fr; }
.is-style-timeline-milestone:hover .milestone__info { grid-template-rows: 1fr; }

/* editor only: always revealed so authors can edit */
.editor-styles-wrapper .is-style-timeline-milestone .milestone__info { grid-template-rows: 1fr; }
```

## Division with the JSON style

- **Structure** (the panel, its layout) goes in the section-style JSON so it renders in the editor.
- **The collapse/reveal + `:hover` flip** goes in the enqueued `core-<block>.css` — because the JSON `css` field drops `:hover` and wraps at zero specificity (see `wp-blockstyle-css-field`).

## The reveal mechanism

`grid-template-rows: 0fr → 1fr` transition animates height **without pushing siblings**; the child needs `min-height: 0; overflow: hidden`. Shorten the transition under `prefers-reduced-motion`.

> Example (labelled): `styles/sections/cards/timeline-milestone.json` (structure) + the Timeline Milestone rules in `assets/styles/core-group.css` (reveal + editor-visibility override).
