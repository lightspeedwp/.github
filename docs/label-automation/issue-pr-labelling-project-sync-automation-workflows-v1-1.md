# **GitHub Labelling Workflows** (v1.1)

*Updated 17 Oct 2025: supports new BugHerd families. `status:*` rules unchanged (exactly one). Extend `actions/labeler` patterns to emit `type:*`, `block:*`, `template:*`, `woo:*`, `to:*`, etc.*

# **GitHub Labelling Workflows** 

## *Issue types & labelling, PR labelling and Project sync to add missing project meta*

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025

Below are ready‑to‑drop workflow files for **Issue & PR Labelling** and **Project Sync (add missing project meta)**. Replace placeholders noted with `<>` and set the secrets/variables as documented beneath each file.

---

[.github/workflows/labels-issues-prs.yml](#.github/workflows/labels-issues-prs.yml)

[Notes](#notes)

[.github/workflows/project-meta-sync.yml](#.github/workflows/project-meta-sync.yml)

[Notes](#notes-1)

[Optional: .github/labeler.yml (example extract)](#optional:-.github/labeler.yml-\(example-extract\))

[Secrets & variables to set](#secrets-&-variables-to-set)

[Field name alignment (Projects)](#field-name-alignment-\(projects\))

---

## **`.github/workflows/labels-issues-prs.yml`** {#.github/workflows/labels-issues-prs.yml}

```
name: Labels • Issues & PRs

on:
  issues:
    types: [opened, edited, reopened, labeled, unlabeled, transferred]
  pull_request:
    types: [opened, reopened, synchronize, ready_for_review, edited, labeled, unlabeled]

permissions:
  contents: read
  issues: write
  pull-requests: write

concurrency:
  group: labels-${{ github.event_name }}-${{ github.event.number || github.run_id }}
  cancel-in-progress: false

jobs:
  pr-labels:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - name: File & branch labeler (actions/labeler)
        uses: actions/labeler@v5
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          configuration-path: .github/labeler.yml
          sync-labels: true

      - name: Default PR status on open → status:needs-review
        if: contains(fromJson('["opened","reopened","ready_for_review"]'), github.event.action)
        run: |
          gh pr edit ${{ github.event.pull_request.number }} --add-label "status:needs-review"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Enforce exactly one status:* label (PR)
        id: enforce-status-pr
        run: |
          set -euo pipefail
          labels=$(gh pr view ${{ github.event.pull_request.number }} --json labels --jq '.labels[].name')
          count=$(echo "$labels" | grep -E '^status:' | wc -l | xargs)
          if [ "$count" -eq 0 ]; then
            echo "::notice::No status:* found → adding status:needs-review"
            gh pr edit ${{ github.event.pull_request.number }} --add-label "status:needs-review"
          elif [ "$count" -gt 1 ]; then
            echo "::error::Multiple status:* labels present. Keep exactly one."
            echo "found=$count" >> $GITHUB_OUTPUT
            exit 1
          fi
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Nudge for changelog label (adds meta:needs-changelog if missing)
        run: |
          labels=$(gh pr view ${{ github.event.pull_request.number }} --json labels --jq '.labels[].name')
          if ! echo "$labels" | grep -Eq '^(no-changelog|changelog:(added|changed|fixed|security|deprecated|removed))$'; then
            echo "::warning::No changelog label found → adding meta:needs-changelog"
            gh pr edit ${{ github.event.pull_request.number }} --add-label "meta:needs-changelog"
          fi
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  issue-intake:
    if: github.event_name == 'issues'
    runs-on: ubuntu-latest
    steps:
      - name: Default issue status on open → status:needs-triage
        if: contains(fromJson('["opened","reopened","transferred"]'), github.event.action)
        run: gh issue edit ${{ github.event.issue.number }} --add-label "status:needs-triage"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Ensure one status:* label (Issue)
        run: |
          set -euo pipefail
          labels=$(gh issue view ${{ github.event.issue.number }} --json labels --jq '.labels[].name')
          count=$(echo "$labels" | grep -E '^status:' | wc -l | xargs)
          if [ "$count" -gt 1 ]; then
            echo "::error::Multiple status:* labels present. Keep exactly one."
            exit 1
          fi
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Default priority if missing → priority:normal
        run: |
          labels=$(gh issue view ${{ github.event.issue.number }} --json labels --jq '.labels[].name')
          if ! echo "$labels" | grep -q '^priority:'; then
            gh issue edit ${{ github.event.issue.number }} --add-label "priority:normal"
          fi
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### **Notes** {#notes}

* Uses **actions/labeler v5** to apply labels based on changed files **and** branch regex (configured in `.github/labeler.yml`).

* Keeps **exactly one** `status:*` per item and adds sensible defaults.

* Adds `meta:needs-changelog` if a PR lacks a changelog category/skip label.

Provide/maintain `.github/labeler.yml` alongside this workflow.

---

## **`.github/workflows/project-meta-sync.yml`** {#.github/workflows/project-meta-sync.yml}

```
name: Projects • Add & Sync meta from labels

on:
  issues:
    types: [opened, edited, labeled, unlabeled, reopened, closed]
  pull_request:
    types: [opened, edited, labeled, unlabeled, reopened, ready_for_review, synchronize, closed]

permissions:
  contents: read
  issues: read
  pull-requests: read

env:
  PROJECT_URL: ${{ vars.LS_PROJECT_URL }}    # e.g. https://github.com/orgs/LightSpeed/projects/1

jobs:
  add-and-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Add item to project (new issues/PRs)
        id: addp
        uses: actions/add-to-project@v1
        with:
          project-url: ${{ env.PROJECT_URL }}
          github-token: ${{ secrets.LS_PROJECT_PAT }}
        # Optionally filter by labels:
        #  labeled: status:ready,status:in-progress
        #  label-operator: OR

      - name: Derive Status/Priority/Type from labels & branch
        id: derive
        run: |
          set -euo pipefail
          if [ "${{ github.event_name }}" = "issues" ]; then
            NUMBER=${{ github.event.issue.number }}
            LABELS=$(gh issue view $NUMBER --json labels --jq '.labels[].name')
          else
            NUMBER=${{ github.event.pull_request.number }}
            LABELS=$(gh pr view $NUMBER --json labels --jq '.labels[].name')
          fi

          # Status mapping (labels → project field values)
          STATUS=""
          echo "$LABELS" | grep -q '^status:in-progress' && STATUS='In progress'
          echo "$LABELS" | grep -q '^status:needs-review' && STATUS='In review'
          echo "$LABELS" | grep -q '^status:needs-qa' && STATUS='In QA'
          echo "$LABELS" | grep -q '^status:blocked' && STATUS='Blocked'
          echo "$LABELS" | grep -q '^status:ready' && STATUS='Ready'
          # Closed/merged → Done
          if [ "${{ github.event_name }}" = "issues" ] && [ "${{ github.event.action }}" = "closed" ]; then STATUS='Done'; fi
          if [ "${{ github.event_name }}" = "pull_request" ] && [ "${{ github.event.action }}" = "closed" ] && [ "${{ github.event.pull_request.merged }}" = "true" ]; then STATUS='Done'; fi
          [ -z "$STATUS" ] && STATUS='Triage'

          # Priority mapping
          PRIORITY=""
          echo "$LABELS" | grep -q '^priority:critical'  && PRIORITY='Critical'
          echo "$LABELS" | grep -q '^priority:important' && PRIORITY='Important'
          echo "$LABELS" | grep -q '^priority:normal'    && PRIORITY='Normal'
          echo "$LABELS" | grep -q '^priority:minor'     && PRIORITY='Minor'

          # Type mapping (from branch for PRs; optional)
          TYPE=""
          HEAD='${{ github.head_ref }}'
          if [ -n "$HEAD" ]; then
            [[ "$HEAD" =~ ^feat/  ]] && TYPE='Feature'
            [[ "$HEAD" =~ ^fix/   ]] && TYPE='Bug'
            [[ "$HEAD" =~ ^docs?/ ]] && TYPE='Documentation'
            [[ "$HEAD" =~ ^(chore/|build/) ]] && TYPE='Task'
          fi

          echo "status=$STATUS"   >> $GITHUB_OUTPUT
          echo "priority=$PRIORITY" >> $GITHUB_OUTPUT
          echo "type=$TYPE"       >> $GITHUB_OUTPUT
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Update project fields
        if: steps.addp.outputs.itemId != ''
        uses: titoportas/update-project-fields@v0.1.0
        with:
          project-url: ${{ env.PROJECT_URL }}
          github-token: ${{ secrets.LS_PROJECT_PAT }}
          item-id: ${{ steps.addp.outputs.itemId }}
          field-keys: Status,Priority,Type
          field-values: ${{ steps.derive.outputs.status }},${{ steps.derive.outputs.priority }},${{ steps.derive.outputs.type }}
```

### **Notes** {#notes-1}

* **`actions/add-to-project@v1`** adds the item to a **Projects (Beta)** board and returns an `itemId` we can update.

* **`titoportas/update-project-fields@v0.1.0`** sets single‑select/text/iteration fields by name using the returned `itemId`.

* Set an org/user‑level **variable** `LS_PROJECT_URL` and a **secret** `LS_PROJECT_PAT` (Fine‑grained PAT with `projects: read/write`, `issues: read`, `pull requests: read`; or classic PAT with `project` \+ `repo`).

---

## **Optional: `.github/labeler.yml` (example extract)** {#optional:-.github/labeler.yml-(example-extract)}

Keep this in the repo (or the org `.github` repo) to drive file‑ and branch‑based labels via **actions/labeler v5**.

```
# Label families → keep to the canonical names from labels-guide

# Head branch → status hints (works on PRs)
"status:needs-review":
  - head-branch: ['^feat/.*', '^fix/.*', '^docs?/.*', '^(chore|build)/.*']

# Blocks & Editor surfaces
"area:block-editor":
  - changed-files:
      - any-glob-to-any-file: ['**/block.json', '**/src/blocks/**']

"area:theme":
  - any:
      - changed-files:
          - any-glob-to-any-file: ['**/theme.json', '**/templates/**', '**/patterns/**', '**/parts/**']

# Languages / formats
"lang:php":
  - changed-files:
      - any-glob-to-any-file: ['**/*.php']
"lang:javascript":
  - changed-files:
      - any-glob-to-any-file: ['**/*.{js,jsx,ts,tsx}']
"lang:css":
  - changed-files:
      - any-glob-to-any-file: ['**/*.{css,scss}']

# CI / Ops
"area:ci":
  - changed-files:
      - any-glob-to-any-file: ['.github/workflows/**']
```

---

## **Secrets & variables to set** {#secrets-&-variables-to-set}

* **`LS_PROJECT_URL`** (Repository/Org *variable*): e.g. `https://github.com/orgs/LightSpeed/projects/1`.

* **`LS_PROJECT_PAT`** (Repository/Org *secret*): PAT with `projects` (read/write) and `repo` scopes (or fine‑grained equivalent) for Projects (Beta). For private repos include `repo` scope.

## **Field name alignment (Projects)** {#field-name-alignment-(projects)}

Make sure your Project single‑select values match the strings in the mapping above:

* **Status**: `Triage`, `Ready`, `In progress`, `In review`, `In QA`, `Blocked`, `Done`

* **Priority**: `Critical`, `Important`, `Normal`, `Minor`

* **Type** (optional): `Feature`, `Bug`, `Documentation`, `Task`

You can tweak the strings in `field-values` if your options differ.

```

```

