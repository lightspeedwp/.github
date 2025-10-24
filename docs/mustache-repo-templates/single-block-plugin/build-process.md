# **WordPress Build Process (General)**

*Last updated: 2025-10-16*

This guide defines a **practical, automated build pipeline** for WordPress projects (plugins, block libraries, block themes, or hybrid themes). It standardises your local setup, linting and tests, asset builds, packaging, and **GitHub Actions** workflows for **zip artefacts, releases, and changelogs**. It also shows where **AI agents** (e.g., GitHub Copilot) slot into the workflow.

TL;DR: Use **Node LTS (18/20)**, **npm**, and **@wordpress/scripts** for JS/CSS builds; **PHPCS (WordPress rules)** for PHP; **Jest \+ Playwright** for JS testing; package with a **clean `/build` \+ PHP assets**, and automate releases with **GitHub Actions** and **conventional commits**.

## **Baseline Toolchain**

Install these globally once (macOS shown with Homebrew; adapt per OS). See the **DEV-TOOLS.wordpress.md** for a full matrix.

- **Node.js LTS (18/20) \+ npm** — the default for `@wordpress/scripts` builds.  
- **PHP (\>=8.1)** \+ Composer — for PHP deps and static analysis.  
- **GitHub CLI (`gh`)** — to create releases and interact with issues/PRs.  
- **WP-CLI** — scripting WP tasks.  
- **Docker** (optional) — clean, reproducible local envs.

Yarn/pnpm are optional. For WordPress’ official tooling you can **standardise on npm**; see *Package managers* below.

## **Repository Layout**

Keep your sources in `/src/` and output compilations to `/build/` (plugins, multi-block libraries) or `/public/` (themes following the handbook). Commit sources; **do not commit `/build/`**.

Typical top-level:

```
/src/              # JS/TS, SCSS, block.json, assets
/build/            # output (ignored in Git)
/php/ or root      # PHP files
package.json
composer.json
phpcs.xml
.github/workflows/
```

## **Linting & Formatting**

- **ESLint** with `@wordpress/eslint-plugin` for JS/TS.  
- **Prettier** for formatting (run after ESLint fix).  
- **stylelint** for SCSS/CSS (optional).  
- **PHPCS** with **WordPress Coding Standards** for PHP.  
- **PHPStan** (optional) for static analysis.

Minimal scripts:

```json
{
  "scripts": {
    "lint:js": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:php": "phpcs",
    "format": "prettier . --write"
  },
  "devDependencies": {
    "@wordpress/eslint-plugin": "^x.y.z",
    "eslint": "^8",
    "prettier": "^3"
  }
}
```

## **Builds**

Use **@wordpress/scripts** for dev and production builds (works for plugins *and* themes) — start/watch for dev; build/minify for release. WordPress’ theme handbook shows how to map `resources → public` in themes; plugins can keep the default `src → build`.

```json
{
  "scripts": {
    "start": "wp-scripts start",
    "build": "wp-scripts build"
  },
  "devDependencies": {
    "@wordpress/scripts": "^x.y.z"
  }
}
```

- For themes that want `resources → public`, add the `--webpack-src-dir` and `--output-path` flags or a custom `webpack.config.js` per the handbook.

## **Testing**

- **Unit & integration (JS):** Jest (ships with `@wordpress/scripts`).  
- **E2E:** Playwright (preferred for modern WP editor flows).  
- **PHP unit:** WordPress core testing framework \+ PHPUnit (when PHP logic exists).

Example scripts:

```json
{
  "scripts": {
    "test": "wp-scripts test-unit-jest",
    "test:e2e": "wp-scripts test-e2e"
  }
}
```

## **Package Managers: npm vs Yarn vs pnpm**

Use **npm** as the default. **@wordpress/scripts** and the official docs assume npm; it avoids team divergence and CI surprises. Yarn or pnpm are fine if the **entire repo standardises** on one tool, but avoid Yarn PnP in WP projects (some CLIs and WordPress build tools expect a `node_modules` folder). For most LightSpeed repos, **npm suffices**.

## **Versioning & Changelogs**

- Adopt **Conventional Commits** (`feat:`, `fix:`, `docs:`…).  
- Generate changelogs via **Release Drafter** or **release-please**.  
- Tag semver releases (`v1.2.0`).

## **Packaging Installable ZIPs**

Your zip should include only runtime assets:

- PHP files  
- `/build` (compiled JS/CSS and `*.asset.php` files)  
- `readme.txt` / `readme.md`, `LICENSE`  
- `languages` (if any)

Exclude dev files: `src`, `node_modules`, `.github`, tests, configs.

## **GitHub Actions: CI \+ Release Automation**

Create two workflows:

**1\) CI (lint, build, test on PRs):**

```
name: ci
on: [pull_request, push]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint:js || true
      - run: npm run build
      - run: npm test --if-present
      - name: PHP lint
        run: php -v && vendor/bin/phpcs --report=summary || true
```

**2\) Release (build zip, create GitHub Release, attach artefact):**

```
name: release
on:
  push:
    tags: ['v*.*.*']
jobs:
  build_release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci && npm run build
      - name: Prepare zip
        run: |
          mkdir -p dist/my-plugin
          rsync -av --exclude-from='.distignore' ./ dist/my-plugin/
          cd dist && zip -r ../my-plugin-${ github.ref_name }.zip my-plugin
      - uses: softprops/action-gh-release@v2
        with: { files: 'my-plugin-*.zip' }
```

Themes can adapt the same, mapping `resources → public` per the handbook.

## **AI Agents in the Workflow**

Use **GitHub Copilot** (IDE) for the inner loop and **Copilot Agents/CLI** for scripted outer-loop tasks (e.g., changelog drafting, test scaffolding). Structure agent prompts as **modular Markdown primitives** (`.instructions.md`, `.prompt.md`, `.spec.md`) so they are reviewable and versioned in Git. See GitHub’s guidance on **agentic primitives** and **context engineering** to make AI-assisted steps predictable.

Recommended repo files:

```
.github/
  copilot-instructions.md
  prompts/code-review.prompt.md
  prompts/release-notes.prompt.md
```

## **Security & Compliance Gates**

- Run `npm audit` (or `audit-ci`) and Composer audits in CI.  
- License scanning for third‑party assets.  
- Verify `*.asset.php` dependency arrays are enqueued (prevents admin JS breakage).

## **References**

- [Block Editor: Getting Started](https://developer.wordpress.org/block-editor/getting-started/)  
- [Quick Start Guide](https://developer.wordpress.org/block-editor/getting-started/quick-start-guide/)  
- [Block Development Environment](https://developer.wordpress.org/block-editor/getting-started/devenv/)  
- [Theme Build Process](https://developer.wordpress.org/themes/advanced-topics/build-process/)  
- [Registering block templates via plugins (WP 6.7)](https://developer.wordpress.org/news/2024/08/registering-block-templates-via-plugins-in-wordpress-6-7/)  
- [What’s new for developers? (Sep 2024)](https://developer.wordpress.org/news/2024/09/whats-new-for-developers-september-2024/)  
- [Block Bindings API (dev note)](https://make.wordpress.org/core/2024/03/06/new-feature-the-block-bindings-api/)  
- [Block Bindings Part 1](https://developer.wordpress.org/news/2024/02/20/introducing-block-bindings-part-1-connecting-custom-fields/)  
- [Block Bindings Part 2](https://developer.wordpress.org/news/2024/03/06/introducing-block-bindings-part-2-working-with-custom-binding-sources/)  
- [Getting & setting binding values in the editor](https://developer.wordpress.org/news/2024/10/getting-and-setting-block-binding-values-in-the-editor/)  
- [GitHub Blog: Agentic primitives & context engineering](https://github.blog/ai-and-ml/github-copilot/how-to-build-reliable-ai-workflows-with-agentic-primitives-and-context-engineering/)

