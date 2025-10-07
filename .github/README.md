<!-- Paste the following two sections into your org `.github` repo’s `README.md`. 
The H2 headings match the anchors in your links so `#projects-bot` and `#setup-projects-automation` will work immediately. -->

## Projects Bot

**Purpose.** Automates labels and syncs Issues/PRs into GitHub Projects (Status / Priority / Type) across LightSpeed repos. Runs entirely in GitHub Actions using a GitHub App installation token—no external server, no user OAuth.

**What it does.**

- Applies labels on Issues/PRs (file‑ and branch‑based) and enforces exactly one `status:*`.
- Adds Issues/PRs to your Project (Beta) and updates **Status / Priority / Type** from labels & PR branch prefix.
- Nudges PRs without a changelog category via `meta:needs-changelog`.

**Workflows.**

- `.github/workflows/labels-issues-prs.yml` – Issue & PR labelling
- `.github/workflows/project-meta-sync.yml` – Add to Project + field sync
- `.github/labeler.yml` – label rules (file globs & branch regex)

**Required Project fields.** Single‑select options must match these values (or update the workflow mapping):

- **Status** → `Triage`, `Ready`, `In progress`, `In review`, `In QA`, `Blocked`, `Done`
- **Priority** → `Critical`, `Important`, `Normal`, `Minor`
- **Type** (optional) → `Feature`, `Bug`, `Documentation`, `Task`

**GitHub App (recommended).**

- **Org permissions:** Projects **Read & write**.
- **Repo permissions:** Issues **Read**, Pull requests **Read**, Contents **Read**.
- **Secrets/variables:**
  - `LS_APP_ID` (org/repo **variable**): your App ID
  - `LS_APP_PRIVATE_KEY` (org/repo **secret**): your App private key (PEM)
  - `LS_PROJECT_URL` (org/repo **variable**): e.g. `https://github.com/orgs/LightSpeed/projects/1`
- The sync workflow mints an installation token with `actions/create-github-app-token@v2` and passes it to the project steps.

**PAT fallback (optional).** If you can’t use a GitHub App, set `LS_PROJECT_PAT` (fine‑grained/classic PAT with Projects read/write + Repo read) and change `github-token:` inputs accordingly.

**Security.** No webhooks or callback URL required; the App only grants Actions a short‑lived installation token. Keep the private key in Actions secrets.

**Troubleshooting.**

- 403 on project updates → the App likely lacks **Org → Projects: Read & write**, or isn’t installed on the repo.
- Items not added to project → check `LS_PROJECT_URL` and that it’s a **Projects (Beta)** board, not Classic.
- Labels not applied → ensure `.github/labeler.yml` exists and patterns match the repo.

---

## Setup Projects Automation

Follow these steps once per organisation; then drop the workflows into any repo that should be automated.

### 1) Create & install the GitHub App

1. Org **Settings → Developer settings → GitHub Apps → New GitHub App**.
2. Name it (e.g. *LightSpeed Projects Bot*). Webhooks/callback not needed.
3. **Permissions:** Org → Projects **Read & write**. Repo → Issues **Read**, Pull requests **Read**, Contents **Read**.
4. **Generate private key** (download `.pem`).
5. **Install** the App to the org (all or selected repos).

### 2) Add Actions secrets & variables

At the **org level** (recommended) or per repo:

- Variables: `LS_APP_ID`, `LS_PROJECT_URL`
- Secrets: `LS_APP_PRIVATE_KEY`

**CLI (example):**
```bash
gh variable set LS_APP_ID --org LightSpeed --body 123456
gh variable set LS_PROJECT_URL --org LightSpeed --body https://github.com/orgs/LightSpeed/projects/1
gh secret set LS_APP_PRIVATE_KEY --org LightSpeed < path/to/private-key.pem
```

### 3) Create/align Project fields

In your Project (Beta), add single‑select fields with these options:

- **Status**: `Triage`, `Ready`, `In progress`, `In review`, `In QA`, `Blocked`, `Done`
- **Priority**: `Critical`, `Important`, `Normal`, `Minor`
- **Type** (optional): `Feature`, `Bug`, `Documentation`, `Task`

### 4) Add the workflows & label config

Commit these files to each target repo (or call reusable workflows from `.github`):

- `.github/workflows/labels-issues-prs.yml`
- `.github/workflows/project-meta-sync.yml`
- `.github/labeler.yml`

### 5) Protect branches & adopt branch naming

- Protect `main` and (if used) `develop` (require PR + review).
- Use prefixes: `feat/…`, `fix/…`, `docs/…`, `chore/…` (drives the **Type** field for PRs).

### 6) Smoke test (5 minutes)

1. Create an **issue** → should get `status:needs-triage`, be added to the Project, and have Status `Triage`.
2. Open a **PR** from `feat/my-change` → labeler applies area/lang labels; PR gets `status:needs-review`; Project fields set (Status `In review`, Type `Feature`).
3. Merge the PR → Project Status becomes `Done`.

### 7) Roll out at scale

- Put these files in the org `.github` repo as **reusable workflows**, or script repo bootstrap with `gh`.
- Keep `labels.yml` canonical in `.github` and sync (optional) via script.

### 8) FAQ

- **Do we need OAuth / callback URLs?** No. We use a GitHub **App** installation token inside Actions.
- **Can we use a PAT instead?** Yes (fallback), but a GitHub App is safer and org‑wide.
- **Classic vs Beta Projects?** These workflows target **Projects (Beta)**.
