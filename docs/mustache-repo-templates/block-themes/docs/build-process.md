# Build & Asset Pipeline

- Uses `@wordpress/scripts` for JS/CSS build process.
- Source files: `src/js/`, `src/scss/`
- Output: `build/` folder (see build/README.md)
- Scripts:
  - `npm run start`: development/watch
  - `npm run build`: production
  - `bin/build.sh`: shell build script

See [placeholder-workflow.md](placeholder-workflow.md) for customizing with mustache placeholders.

Built assets are NOT committed—`build/` is an output directory.
