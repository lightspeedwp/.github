---
version: v0.1.0
last_updated: '2026-05-29'
title: Plugin Installation Guide
owners:
- lightspeedwp
file_type: documentation
description: Guide for installing and configuring LightSpeed plugins
---

# Plugin Installation Guide

## Installation Methods

### NPM Installation

```bash
npm install @lightspeedwp/plugin-name
```

Then import in your project:

```javascript
import { PluginName } from '@lightspeedwp/plugin-name';
```

### Composer Installation (PHP)

```bash
composer require lightspeedwp/plugin-name
```

Then include in your code:

```php
require_once 'vendor/autoload.php';
use LightSpeed\Plugin;
```

### Manual Installation

1. Download from GitHub releases
2. Extract to appropriate directory
3. Follow plugin-specific setup instructions

## Configuration

### Environment Variables

Create `.env` file with required variables:

```env
LIGHTSPEED_API_KEY=your_key_here
PLUGIN_DEBUG=false
PLUGIN_LOG_LEVEL=info
```

### Configuration File

Some plugins use a config file:

```json
{
  "plugin": {
    "enabled": true,
    "debug": false,
    "settings": {}
  }
}
```

## Verification

After installation, verify:

1. Plugin loads without errors
2. Configuration is accessible
3. Permissions are correct
4. Dependencies are installed

```bash
npm run verify:plugins
```

## Troubleshooting

### Plugin Not Loading

- Check permissions on plugin directory
- Verify all dependencies installed
- Check configuration file format
- Review error logs

### Configuration Issues

- Verify all required env vars set
- Check JSON syntax in config files
- Ensure permissions for config directory

## Updating Plugins

```bash
npm update @lightspeedwp/plugin-name
```

Review changelog for breaking changes.

## Security Considerations

- Keep plugins updated
- Review plugins before installation
- Use minimal permissions
- Monitor security advisories

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
