# Images in Issues and Comments

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

How to embed images in GitHub issue bodies and comments programmatically via the CLI.

## Methods (ranked by reliability)

### 1. GitHub Contents API (recommended for private repos)

Push image files to a branch in the same repo, then reference them with a URL that works for authenticated viewers.

**Step 1: Create a branch**

```bash
# Get the SHA of the default branch
SHA=$(gh api repos/{owner}/{repo}/git/ref/heads/main --jq '.object.sha')

# Create a new branch
gh api repos/{owner}/{repo}/git/refs -X POST \
  -f ref="refs/heads/{username}/images" \
  -f sha="$SHA"
```

**Step 2: Upload images via Contents API**

```bash
# Base64-encode the image and upload
BASE64=$(base64 -i /path/to/image.png)

gh api repos/{owner}/{repo}/contents/docs/images/my-image.png \
  -X PUT \
  -f message="Add image" \
  -f content="$BASE64" \
  -f branch="{username}/images" \
  --jq '.content.path'
```

Repeat for each image. The Contents API creates a commit per file.

**Step 3: Reference in markdown**

```markdown
![Description](https://github.com/{owner}/{repo}/raw/{username}/images/docs/images/my-image.png)
```

> **Important:** Use `github.com/{owner}/{repo}/raw/{branch}/{path}` format, NOT `raw.githubusercontent.com`. The `raw.githubusercontent.com` URLs return 404 for private repos. The `github.com/.../raw/...` format works because the browser sends auth cookies when the viewer is logged in and has repo access.

**Pros:** Works for any repo the viewer has access to, images live in version control, no expiration.
**Cons:** Creates commits, viewers must be authenticated, images won't render in email notifications or for users without repo access.

### 2. Gist hosting (public images only)

Upload images as files in a gist. Only works for images you're comfortable making public.

```bash
# Create a gist with a placeholder file
gh gist create --public -f description.md <<< "Image hosting gist"

# Note: gh gist edit does NOT support binary files.
# You must use the API to add binary content to gists.
```

> **Limitation:** Gists don't support binary file uploads via the CLI. You'd need to base64-encode and store as text, which won't render as images. Not recommended.

### 3. Browser upload (most reliable rendering)

The most reliable way to get permanent image URLs is through the GitHub web UI:

1. Open the issue/comment in a browser
2. Drag-drop or paste the image into the comment editor
3. GitHub generates a permanent `https://github.com/user-attachments/assets/{UUID}` URL
4. These URLs work for anyone, even without repo access, and render in email notifications

> **Why the API can't do this:** GitHub's `upload/policies/assets` endpoint requires a browser session (CSRF token + cookies). It returns an HTML error page when called with API tokens. There is no public API for generating `user-attachments` URLs.

## Taking screenshots programmatically

Use `puppeteer-core` with local Chrome to screenshot HTML mockups:

```javascript
const puppeteer = require('puppeteer-core');

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  defaultViewport: { width: 900, height: 600, deviceScaleFactor: 2 }
});

const page = await browser.newPage();
await page.setContent(htmlString);

// Screenshot specific elements
const elements = await page.$$('.section');
for (let i = 0; i < elements.length; i++) {
  await elements[i].screenshot({ path: `mockup-${i + 1}.png` });
}

await browser.close();
```

> **Note:** MCP Playwright may not connect to localhost due to network isolation. Use puppeteer-core with a local Chrome installation instead.

## Quick reference

| Method | Private repos | Permanent | No auth needed | API-only |
|--------|:---:|:---:|:---:|:---:|
| Contents API + `github.com/raw/` | ✅ | ✅ | ❌ | ✅ |
| Browser drag-drop (`user-attachments`) | ✅ | ✅ | ✅ | ❌ |
| `raw.githubusercontent.com` | ❌ (404) | ✅ | ❌ | ✅ |
| Gist | Public only | ✅ | ✅ | ❌ (no binary) |

## Common pitfalls

- **`raw.githubusercontent.com` returns 404 for private repos** even with a valid token in the URL. GitHub's CDN does not pass auth headers through.
- **API download URLs are temporary.** URLs returned by `gh api repos/.../contents/...` with `download_url` include a token that expires.
- **`upload/policies/assets` requires a browser session.** Do not attempt to call this endpoint from the CLI.
- **Base64 encoding for large files** can hit API payload limits. The Contents API has a ~100MB file size limit but practical limits are lower for base64-encoded payloads.
- **Email notifications** will not render images that require authentication. If email readability matters, use the browser upload method.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
