# Performance Instructions

## Front-end

- Lazy-load images/video; set width/height; use responsive sources.
- Minimise JS; avoid unnecessary rerenders.
- Prefer CSS over JS for simple effects; respect reduced-motion.

## Editor

- Avoid heavy side-effects in `edit` components.
- Defer non-critical requests; cache metadata where safe.

# Instruction: Performance

- Minimise DOM depth; prefer CSS utilities/presets over custom CSS.
- Defer non-critical JS; avoid synchronous blocking.
- Use **`wp_enqueue_block_style`** and `wp_register_style` with dependencies.
- Avoid large images in patterns; recommend responsive sizes and lazy loading.
