# Placeholder Replacement Workflow

This repository uses mustache placeholders (e.g., `{{theme_name}}`, `{{slug}}`, `{{author}}`) throughout all code, scripts, and documentation for rapid customization.

## Steps

1. **Create a mapping.json file:**
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

3. **Update README.md and DEVELOPMENT.md**
   Document this process and your mapping conventions.

See [build-process.md](build-process.md) for more on the build pipeline.