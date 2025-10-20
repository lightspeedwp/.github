# Block Theme Build Process

- Use `@wordpress/scripts` for JS/CSS builds.
- Source assets: `/assets/` or `/resources/`
- Output: `/public/`
- Use `RemoveEmptyScriptsPlugin` in `webpack.config.js`.
- Enqueue assets in `functions.php` with `.asset.php` manifests.
- Scripts:
  - `npm run start`: dev/watch
  - `npm run build`: production
- Do not commit build artefacts, use `.gitignore`.