# Release Process

We ship consumable ZIPs in `/dist` and attach them to GitHub Releases.

## Versioning
- Semantic versioning: `MAJOR.MINOR.PATCH`.
- Breaking folder/name changes bump MAJOR.

## Steps
1. Update `CHANGELOG.md`.
2. Create release branch `release/x.y.z`.
3. Build ZIP: include only `*/**/*.md` templates + `README.md`.
4. Save as `/dist/ai-templates-x.y.z.zip`.
5. Create GitHub Release and upload ZIP.
6. Tag: `vX.Y.Z`.

## Automation (optional)
Use GitHub Action to build and upload ZIP on tag push.
