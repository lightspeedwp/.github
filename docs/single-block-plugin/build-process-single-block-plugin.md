# **BUILD-PROCESS.single-block-plugin**

*Last updated: 2025-10-16*

A **single‑block plugin** focuses your scope on one block and uses the official `@wordpress/create-block` scaffolder and `@wordpress/scripts` for the build. Below is a **battle‑tested flow** from scaffolding to automated releases.

## **1\) Prerequisites (global)**

- Node.js **LTS (18/20)** and **npm**.  
- PHP ≥8.1 and Composer (if shipping PHP).  
- A local WP env (e.g., **wp-env** or LocalWP).  
- VS Code with ESLint/Prettier extensions.

npm is the default package manager for WordPress tooling. Yarn/pnpm are optional, but **standardise on one**; avoid Yarn PnP to keep `node_modules` available. For most repos, **npm suffices**.

## **2\) Scaffold**

```shell
cd wp-content/plugins
npx @wordpress/create-block my-first-block
cd my-first-block && npm install
```

- The scaffold sets up **`@wordpress/scripts`** and a dev server. Start it with:

```shell
npm run start   # watch mode
npm run build   # production bundle
```

## **3\) Develop**

Work in `/src/`:

- **block.json** — metadata (title, icon, attributes, script/style handles).  
- **index.js** — entry that ties metadata to `edit`/`save`.  
- **edit.js** — editor UI (React).  
- **save.js** — static markup (omit for dynamic blocks).  
- **render.php** — dynamic output.  
- **style.scss / editor.scss** — global vs editor‑only styles.

The build outputs compiled assets \+ `*.asset.php` files with dependencies, used when enqueueing (prevents broken editor).

## **4\) Linting & Tests**

Add scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier . --write",
    "test": "wp-scripts test-unit-jest"
  }
}
```

Enable **PHPCS** with WordPress rules if PHP is present.

## **5\) Packaging**

Ship only what sites need:

```
/my-first-block/
  my-first-block.php
  build/**           # compiled JS/CSS + *.asset.php
  block.json
  readme.txt / readme.md
  languages/** (optional)
```

Exclude `src`, `node_modules`, tests, and dotfiles.

## **6\) GitHub Actions (CI & Release)**

- **CI on PR:** install, lint, build, test.  
- **Release on tag:** build and zip artefact, attach to GitHub Release. (Use the sample workflows in **BUILD-PROCESS.md**.)

## **7\) When to consider Yarn?**

- Team already standardised on Yarn with classic `node_modules`.  
- Monorepos using workspaces (still compatible with `@wordpress/scripts`).  
  If unsure, **use npm**; it’s what WP docs assume.

## **8\) References**

- [Getting Started](https://developer.wordpress.org/block-editor/getting-started/)  
- [Quick Start Guide](https://developer.wordpress.org/block-editor/getting-started/quick-start-guide/)  
- [Block Development Environment](https://developer.wordpress.org/block-editor/getting-started/devenv/)  
- [Theme Build Process (background concepts)](https://developer.wordpress.org/themes/advanced-topics/build-process/)

