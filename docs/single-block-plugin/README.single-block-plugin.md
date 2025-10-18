# WordPress Single Block Plugin

A template README for single-block WordPress plugins. Rename this file to `README.md` in your plugin repo.

## Description

A WordPress plugin providing a custom Gutenberg block for your site.

## Features

- Gutenberg block for custom content
- Automatic updates (if applicable)
- Customizable block settings
- Developer-friendly hooks and filters
- Follows WordPress coding standards

## Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- Node.js 18+
- npm 9+

## Installation

1. Upload the plugin files to `/wp-content/plugins/<plugin-slug>` or install via WordPress admin.
2. Activate the plugin in the 'Plugins' screen.
3. Configure block settings in the block editor or plugin settings page.

## Development

This plugin follows WordPress coding standards and best practices.

### Setup

```bash
```bash
git clone https://github.com/<your-org>/<your-plugin-repo>.git
cd <your-plugin-repo>
npm install
```bash
npm run start
```

### Linting & Coding Standards

- PHP: `composer run lint`
- JS: `npm run lint:js`
- CSS: `npm run lint:css`
- All: `npm run lint`
- Auto-fix: `npm run lint:fix`

### Testing
```bash

- JS: `npm test`
```bash
- PHP: `composer test` (if configured)

### Building

- Development: `npm run start`
```text
- Production: `npm run build`
- Create ZIP: `npm run plugin-zip`

## File Structure

```
<plugin-slug>/
├── src/                # Block source files
├── build/              # Compiled assets
├── .github/            # Workflows and automation
├── .husky/             # Git hooks
├── package.json        # JS dependencies/scripts
├── composer.json       # PHP dependencies
├── plugin.php          # Main plugin file
└── README.md           # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test and lint
5. Submit a pull request

## License

GPL v2 or later. See [LICENSE](LICENSE).
