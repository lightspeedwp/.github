# Prompt: Write Playwright tests for a block

Given: block slug `<namespace>/<slug>`
Write tests to:

- Insert block from inserter by title.
- Change a key control and assert HTML changes.
- If dynamic: save post, then request front-end and assert server HTML.
- If has InnerBlocks: enforce allowedBlocks and template creation.
- If variation of Query Loop: ensure namespace activates expected defaults.
- Take baseline screenshot.
