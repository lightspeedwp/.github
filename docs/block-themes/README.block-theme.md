# WordPress Block Theme

A template README for WordPress block themes. Rename this file to `README.md` in your theme repo.

## Description

A modern WordPress block theme supporting Full Site Editing (FSE), block patterns, and style variations.

## Features

- Full Site Editing (FSE) support
- Block patterns and template parts
- Style variations (e.g., dark mode)
- Modern build workflow
- End-to-end testing
- AI/Copilot integration (optional)
- Follows WordPress coding standards

## Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- Node.js 18+
- npm 9+
- Composer (for PHP dependencies)

## Installation

1. Upload the theme files to `/wp-content/themes/<theme-slug>` or install via WordPress admin.
2. Activate the theme in the 'Appearance' screen.
3. Customize theme settings in the Site Editor.

## Development

This theme follows WordPress coding standards and best practices.

### Setup

```bash
git clone https://github.com/<your-org>/<your-theme-repo>.git
cd <your-theme-repo>
npm install
composer install
npm run start
```bash

### Linting & Coding Standards

- PHP: `composer run lint`
- JS: `npm run lint:js`
- CSS: `npm run lint:css`
- All: `npm run lint`
- Auto-fix: `npm run lint:fix`

### Testing

- JS: `npm test`
- PHP: `composer test`
- E2E: `npm run test:e2e`

### Building

- Development: `npm run start`
- Production: `npm run build:production`

## Theme Structure

```bash
<theme-slug>/
├── assets/             # Images, fonts, etc.
├── inc/                # PHP includes
├── parts/              # Template parts
├── patterns/           # Block patterns
├── styles/             # Style variations
├── templates/          # Block templates
├── tests/              # Test files
├── functions.php       # Theme functions
├── style.css           # Main stylesheet
├── theme.json          # Theme configuration
├── .github/            # Workflows and automation
├── .husky/             # Git hooks
├── package.json        # JS dependencies/scripts
├── composer.json       # PHP dependencies
└── README.md           # This file
```text

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test and lint
5. Submit a pull request

## License

GPL v3 or later. See [LICENSE](LICENSE).
