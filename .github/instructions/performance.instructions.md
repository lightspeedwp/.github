# Performance Instructions

## Front-end
- Lazy-load images/video; set width/height; use responsive sources.
- Minimise JS; avoid unnecessary rerenders.
- Prefer CSS over JS for simple effects; respect reduced-motion.

## Editor
- Avoid heavy side-effects in `edit` components.
- Defer non-critical requests; cache metadata where safe.
