# Mustache Placeholder Replacement Workflow for {{projectName}}

## Overview

All template and source files in this plugin use mustache-style placeholders (e.g. `{{slug}}`, `{{namespace}}`, `{{author}}`) for easy scaffolding.  
This workflow ensures values are replaced consistently when creating a new plugin.

## Steps

1. **Prepare your mapping JSON file:**  
   Example:  
   ```json
   {
     "slug": "copyright-block",
     "namespace": "lightspeedwp",
     "author": "Ashley Shaw",
     "version": "1.0.0"
   }
   ```
2. **Run the replacement script:**  
   ```sh
   node bin/replace-placeholders.js <file> --map mapping.json
   ```
   Repeat for all template files.  
   Automate for all files with a bash or Node loop.

3. **Validate:**  
   - Run `/tests/placeholder.test.js` to ensure no `{{key}}` placeholders remain.
   - Copilot agents should run this script automatically and validate output.

## References

- [`repo-template.md`](./repo-template.md)
- [`BUILD-SCRIPTS.single-block-plugin.md`](./BUILD-SCRIPTS.single-block-plugin.md)
- [`bin/replace-placeholders.js`](../bin/replace-placeholders.js)

---

**Note:**  
The `build/` folder is output-only; do not commit assets.  
Include a `.gitkeep` or README in `build/` to clarify.