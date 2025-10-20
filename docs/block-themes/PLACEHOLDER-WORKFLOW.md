# Placeholder Replacement Workflow

This repository uses mustache placeholders (e.g., `{{theme_name}}`, `{{slug}}`, `{{author}}`) throughout all code, scripts, and documentation for rapid customization.

## Steps

1. **Create a `mapping.json` file:**
    ```json
    {
      "theme_name": "My Block Theme",
      "slug": "my-block-theme",
      "author": "Ashley Shaw",
      "version": "1.0.0"
    }
    ```

2. **Run the mustache replacement script for each file:**
    ```sh
    node bin/replace-placeholders.js README.md --map mapping.json
    node bin/replace-placeholders.js style.css --map mapping.json
    # Repeat for all files with placeholders
    ```

3. **Update `README.md` and `DEVELOPMENT.md`**  
   Document this process and your mapping conventions.

## Copilot Integration

Copilot will scaffold every new repo with this setup, referencing all docs, prompts, standards, and scripts.

## Validation

You may add automated tests (see `tests/` directory) to validate that all placeholders have been replaced in your files before deployment.