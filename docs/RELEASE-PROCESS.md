---
title: 'AI Template Release Process'
description: 'Comprehensive release workflow for AI template assets.'
last_updated: '2025-10-24'
version: 'v2.0'
related:
    - SECURITY-AND-LICENSING.md
    - CONTRIBUTING-TEMPLATES.md
    - CODING-STYLE.md
---

# Release Process

We ship consumable ZIPs in `/dist` and attach them to GitHub Releases.

## Versioning

- Semantic versioning: `MAJOR.MINOR.PATCH`.
- Breaking folder/name changes bump MAJOR.

1. Update `CHANGELOG.md` with all new, changed, and removed templates.
2. Create a release branch: `release/x.y.z`.
3. Build ZIP: include only `*/**/*.md` templates + `README.md`.
4. Save as `/dist/ai-templates-x.y.z.zip`.
5. Create GitHub Release and upload ZIP.
6. Tag: `vX.Y.Z`.
7. Update all cross-links in documentation to reference the new release.

## Automation (optional)

Use a GitHub Action to build and upload ZIP on tag push. See [GitHub Actions docs](https://docs.github.com/en/actions) for workflow examples.

## References

- [Security & Licensing](./SECURITY-AND-LICENSING.md)
- [Contributing Templates](./CONTRIBUTING-TEMPLATES.md)
- [Coding & Content Style](./CODING-STYLE.md)
  _This document is part of the LightSpeedWP AI documentation suite. For more, see the [AI Docs Index](./README.md)._

---

<!-- RANDOM FOOTER: Keep calm and automate all the things! -->
