# Build & Scaffold Scripts for {{projectName}}

## Placeholder Replacement Script

The script `bin/replace-placeholders.js` lets you quickly replace all mustache-style placeholders in any template file.

### Usage

1. **Prepare your mapping file:**  
   Create a JSON file (e.g. `mapping.json`):  

   ```json
   {
     "slug": "copyright-block",
     "namespace": "lightspeedwp",
     "author": "Ashley Shaw",
     "version": "1.0.0"
   }
   ```

2. **Run the script:**  

   ```sh
   node bin/replace-placeholders.js README.md --map mapping.json
   ```

3. **Repeat for each templated file:**  
   Run the same command for every file with placeholders.

### When to Run

- Immediately after scaffolding a new repo.
- Whenever you change mapping values for a plugin.

### Troubleshooting

- If a file still shows `{{slug}}`, check your mapping JSON.
- Script overwrites the file in-place; keep a backup if needed.

### Reference

- See all placeholder mappings in `repo-template.md` and `DEVELOPMENT.md`.
- Update your build/test/lint scripts in `/bin/` as needed, and ensure all use mustache placeholders.

---
