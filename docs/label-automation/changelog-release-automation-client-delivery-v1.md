# **Changelog & Release Automation**

## *Client Delivery Workflow*

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025  
---

[Pull Request Changelog Content](#pull-request-changelog-content)

[Semantic Versioning with Labels](#semantic-versioning-with-labels)

[Automated Release Workflow on Merge](#automated-release-workflow-on-merge)

[Label Enforcement & PR Validation](#label-enforcement-&-pr-validation)

[Maintaining Consistent Labels](#maintaining-consistent-labels)

[Putting It Together (Client Delivery)](#putting-it-together-\(client-delivery\))

[Example Configuration Files](#example-configuration-files)

[Conclusion](#conclusion)

---

This blueprint outlines an automated system for changelog management and release generation tailored to **client delivery workflows**. It ensures every change is documented and released in a consistent, traceable manner. The approach uses GitHub Actions to enforce standards (like PR descriptions and labels) and to automate version bumping, changelog updates, and GitHub Releases for every merged pull request (PR).

## **Pull Request Changelog Content** {#pull-request-changelog-content}

Every PR should include a **structured "Changelog" section** in its description. This section is the single source of truth for updates, meaning whatever is written here will be included in the official `CHANGELOG.md`. To standardize this:

**PR Template:** Use a pull request template (e.g. `.github/pull_request_template.md`) that contains a placeholder for a changelog entry. For example:

 `## Changelog`  
`- **Added:** Description of new feature or change.`  
`- **Fixed:** Description of bug fix.`  
 The developer fills this out with bullet points or subsections like **Added**, **Changed**, **Fixed**, etc. (following the *Keep a Changelog* style)[stefanzweifel.dev](https://stefanzweifel.dev/posts/2021/11/13/introducing-the-changelog-updater-action/#:~:text=Personally%20though%2C%20I%20really%20like,have%20to%20update%20an%20implementation). For instance, a PR changelog might say:

 `## Changelog`  
`### Added`  
`- Support for multi-language input in the contact form.`

`### Fixed`  
`- Resolved a navigation menu bug on mobile devices.`

*   
* **Linking Issues:** If the PR is linked to an issue (using keywords like "Closes \#123"), the workflow can incorporate information from that issue. For example, if your issue template or project field contains a **“Planned Change”** or similar summary, you can configure the automation to prepend or append that to the PR’s changelog text. (This could be done by fetching the issue via GitHub API in the workflow.) This way, any pre-written context from the planning phase is not lost. If an issue has a structured description of the change, ensure the PR’s changelog entry reflects it – possibly even copy it into the PR description for accuracy.

* **Formatting:** Encourage using consistent terminology (e.g., **Added**, **Changed**, **Fixed**, **Removed**, etc.) and including references if relevant (such as issue numbers or contributor names). This yields a well-organized changelog in the final file[stefanzweifel.dev](https://stefanzweifel.dev/posts/2021/11/13/introducing-the-changelog-updater-action/#:~:text=Personally%20though%2C%20I%20really%20like,have%20to%20update%20an%20implementation). The PR template can include these sub-headings to remind contributors.

**Example PR Description (Client Delivery):**

 `## Changelog`  
`### Added`  
`- Implemented user login page with OAuth support.`

`### Changed`  
``- Updated database schema to include `last_login` field.``

`*Ref: Project requirements doc section 3.2*`

*  In a client delivery context, the wording might be more specific to the client’s project (for example, referencing client-specific modules or requirements).

This **Changelog section is mandatory for every PR** that will be merged. It will later be automatically extracted to update the main `CHANGELOG.md`.

## **Semantic Versioning with Labels** {#semantic-versioning-with-labels}

The project follows **Semantic Versioning (SemVer)** for releases (e.g., v1.2.3). To automate version bumps, PRs must be labeled with the intended release type:

* `release:patch` – for bug fixes and small changes (increment Z in X.Y.Z).

* `release:minor` – for new features that are backward-compatible (increment Y in X.Y.Z).

* `release:major` – for breaking changes or large features (increment X in X.Y.Z).

These labels inform the automation what the next version should be. For example, if the current version is 1.4.2 and a PR merged with `release:minor`, the next version will be 1.5.0. Using labels to determine the version bump is a common practice[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=This%20configuration%20sets%20how%20the,repository%20for%20more%20available%20configurations) – for instance, any PR labeled as a feature could trigger a minor bump[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=This%20configuration%20sets%20how%20the,repository%20for%20more%20available%20configurations) (in our case we explicitly use `release:minor` to signify that) while the default (if none specified) would be a patch[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=This%20configuration%20sets%20how%20the,repository%20for%20more%20available%20configurations).

**Overrides for Versioning:** In some cases, you might need to override this label-based bump:

* If a PR introduces breaking changes, include `BREAKING CHANGE:` in the PR description or commit message. The workflow can scan for this keyword; if found, it can treat the release as major even if the label was minor or patch. (It’s best practice to also label it `release:major` in such cases, to be explicit.)

* If a specific version is required (unusual in a continuous delivery model), you could use a special label like `release:x.y.z` or a commit footer like `Release-As: x.y.z`. In a client project, this might be used if aligning with an external version scheme. The automation can be extended to recognize such an indicator and use that exact version.

In general, **exactly one of the `release:*` labels is required on each PR** – this ensures the system knows how to bump the version. We will enforce this via automation (see **Label Enforcement** below).

## **Automated Release Workflow on Merge** {#automated-release-workflow-on-merge}

Under a **main-only release model**, whenever a PR is merged into the `main` branch, the system will automatically create a new release. This workflow handles determining the new version, generating release notes from the PR content, updating the changelog file, and tagging the release. Below is an example GitHub Actions workflow (`.github/workflows/changelog.yml`) that accomplishes this:

`name: Changelog & Release Automation`

`on:`  
  `pull_request:`  
    `types: [closed]`

`jobs:`  
  `release:`  
    `if: >`   
      `github.event.pull_request.merged == true &&`   
      `github.event.pull_request.base.ref == 'main'`  
    `runs-on: ubuntu-latest`  
    `permissions:`  
      `contents: write   # needed to push tags and changelog`  
      `issues: read      # if we need to read linked issue content`  
      `pull-requests: read`  
    `steps:`  
      `- name: Checkout repository`  
        `uses: actions/checkout@v3`  
        `with:`  
          `ref: main  # ensure we have the latest main code`

      `- name: Determine next version`  
        `id: version`  
        `run: |`  
          `# Fetch latest tag`  
          `LAST_TAG=$(git describe --tags --abbrev=0 --match "v[0-9]*" || echo "v0.0.0")`  
          `echo "Last tag: $LAST_TAG"`  
          `# Strip the 'v' and split into components`  
          `BASE_VER=${LAST_TAG#v}`  
          `IFS='.' read -r major minor patch <<< "$BASE_VER"`  
          `# Determine bump from PR labels`  
          `case "${{ github.event.pull_request.labels[*] }}" in`  
            `*"release:major"*)`  
              `((major+=1)); minor=0; patch=0;;`  
            `*"release:minor"*)`  
              `((minor+=1)); patch=0;;`  
            `*"release:patch"*)`  
              `((patch+=1));;`  
            `*)`  
              `# Default to patch if somehow no label (should not happen due to enforcement)`  
              `((patch+=1));;`  
          `esac`  
          `NEW_VER="$major.$minor.$patch"`  
          `# Override for BREAKING CHANGE in PR body`  
          `PR_BODY="${{ github.event.pull_request.body }}"`  
          `if echo "$PR_BODY" | grep -qi "BREAKING CHANGE:"; then`  
            `# If not already major bump, elevate to next major`  
            `((major+=1)); minor=0; patch=0`  
            `NEW_VER="$major.$minor.$patch"`  
          `fi`  
          `echo "NEW_VERSION=$NEW_VER" >> $GITHUB_OUTPUT`  
      `- name: Extract changelog from PR`  
        `id: changelog`  
        `run: |`  
          `PR_BODY="${{ github.event.pull_request.body }}"`  
          `# Extract lines under '## Changelog' section`  
          `CHANGELOG_TEXT=$(echo "$PR_BODY" | awk '/## Changelog/{flag=1;next} /^## /{flag=0} flag')`  
          `# Fallback if section not found (should be enforced to exist)`  
          `if [ -z "$CHANGELOG_TEXT" ]; then`   
            `CHANGELOG_TEXT="*No changelog details provided.*"`  
          `fi`  
          `# Optionally, append linked issue's planned change if available`  
          `%%% optional issue fetching logic could be inserted here %%%`  
          `echo "RELEASE_NOTES=$CHANGELOG_TEXT" >> $GITHUB_OUTPUT`

      `- name: Update CHANGELOG.md`  
        `run: |`  
          `NEW_VER="${{ steps.version.outputs.NEW_VERSION }}"`  
          `NOTES="${{ steps.changelog.outputs.RELEASE_NOTES }}"`  
          `DATE=$(date -u +'%Y-%m-%d')`  
          `# Compose new changelog entry`  
          `printf '## [%s] - %s\n%s\n\n' "v$NEW_VER" "$DATE" "$NOTES" > new_changes.txt`  
          `# Prepend to CHANGELOG.md (or create if not exist)`  
          `if [ -f CHANGELOG.md ]; then`  
            `cat CHANGELOG.md >> new_changes.txt`  
          `fi`  
          `mv new_changes.txt CHANGELOG.md`  
          `git config user.name "github-actions"`  
          `git config user.email "github-actions@users.noreply.github.com"`  
          `git add CHANGELOG.md`  
          `git commit -m "chore: update changelog for v$NEW_VER"`

      `- name: Create Git tag and GitHub Release`  
        `env:`  
          `NEW_VER: ${{ steps.version.outputs.NEW_VERSION }}`  
          `RELEASE_NOTES: ${{ steps.changelog.outputs.RELEASE_NOTES }}`  
        `run: |`  
          `git tag -a "v$NEW_VER" -m "Release v$NEW_VER"`  
          `git push origin "refs/tags/v$NEW_VER"`  
          `# Create GitHub Release`  
          `curl -s -X POST -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \`  
            `-H "Content-Type: application/json" \`  
            `-d @- https://api.github.com/repos/${{ github.repository }}/releases <<EOF`  
          `{`  
            `"tag_name": "v$NEW_VER",`  
            `"name": "v$NEW_VER",`  
            `"body": "$RELEASE_NOTES",`  
            `"draft": false,`  
            `"prerelease": false`  
          `}`  
          `EOF`

Let’s break down what this workflow does:

* **Trigger:** It runs on the `pull_request` event of type `closed`. The `if` condition ensures it proceeds only if the PR was merged into the `main` branch (ignoring closed-without-merge or merges to other branches).

* **Checkout:** Grabs the latest `main` branch code. This is important because the merge commit (from the PR) is now on main.

* **Determine next version:** The `Determine next version` step finds the latest tag (assuming tags are of the form `vX.Y.Z`). If none exists, it defaults to `v0.0.0`. Then it increments major, minor, or patch based on which label is present on the PR[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=This%20configuration%20sets%20how%20the,repository%20for%20more%20available%20configurations). It uses shell logic to parse the version number and apply the bump:

  * If the PR has `release:major`, increment the major version (and reset minor/patch to 0).

  * Else if it has `release:minor`, increment the minor (reset patch to 0).

  * Else (or if `release:patch`), increment the patch.

  * If the PR description contains **BREAKING CHANGE:** (case-insensitive grep), it forces a major version bump. This way, even if a developer forgot to label as major, any indicated breaking change will not be released as a mere minor/patch by accident.

  * The new version is output as `$NEW_VERSION` (e.g. “1.5.0”).

* **Extract changelog from PR:** This step takes the PR body and pulls out the text under the "\#\# Changelog" heading. In the shell snippet above, we use an `awk` command to grab everything between the "\#\# Changelog" line and the next heading. This captured text becomes our release notes (`RELEASE_NOTES`). If for some reason no changelog section is found (which should be rare due to our enforcement), it falls back to a placeholder. We indicated where one could also fetch linked issue details: for example, you could use GitHub CLI or API to get the linked issue’s "Planned Change" field and append it to `CHANGELOG_TEXT`. In practice, you might use a JavaScript or Python script in this step for more complex parsing or API calls (or use the `actions/github-script` action for convenience).

* **Update `CHANGELOG.md`:** This step opens (or creates) the `CHANGELOG.md` in the repository and prepends a new entry. It formats a new markdown heading for the version (e.g., `## [v1.5.0] - 2025-10-09`) with the current date, then inserts the release notes (which contain the bullet points from the PR). This follows a running changelog format, where the latest changes appear at the top. After updating the file, it commits the changes. (We use a bot user identity for the commit.) Committing here ensures the `CHANGELOG.md` in the main branch always reflects the latest release. The commit message "chore: update changelog for vX.Y.Z" is used.

* **Create Tag and Release:** Finally, the workflow creates a Git tag for the new version and pushes it. Then it calls the GitHub API to create a **Release** entry on GitHub, using the tag. The release’s title and body are set to the version and the changelog notes, respectively. We use `curl` with the `GITHUB_TOKEN` for simplicity here. (In more complex cases or to include binaries, one might use specialized actions or the GitHub CLI.) The release is marked not draft (`"draft": false`) so it’s published immediately. After this, the new release is visible under the repository’s Releases, and the tag is created in the repo.

**Result:** The merge of a PR triggers this workflow, which produces:

* An updated `CHANGELOG.md` with a new entry for the version.

* A git tag `vX.Y.Z` pointing to the latest commit.

* A GitHub Release named `vX.Y.Z` containing the changelog text from the PR as the description.

This means the team (and the client, if they have access or if notes are shared) can easily see what changed in each version. Each PR becomes an isolated release. If multiple PRs are merged around the same time, each triggers its own run (versions will increment sequentially for each).

**Main-Only Model:** We assume here that all merges go to the `main` branch which is always release-ready. For client projects with longer development cycles, you might have a `develop` branch to accumulate changes and only merge to main when delivering a batch. In that case, the workflow could be adjusted to trigger on merges to a release branch or on a manual trigger. But by default, a continuous delivery model (merge to main \= deliver) is used, which fits many client engagements where you deploy changes continuously or at least tag them for client review.

## **Label Enforcement & PR Validation** {#label-enforcement-&-pr-validation}

To ensure the process works smoothly, certain **labels and sections are enforced** on every PR (and issue):

* **Status and Priority Labels:** Every issue and PR should have exactly one `status:*` label and one `priority:*` label. For example, `status: in progress`, `status: ready for review`, or `status: done` (whatever statuses your team uses), and `priority: high/medium/low` (or P0/P1/P2 scheme). This helps in project tracking and is outside the direct scope of release notes, but it instills discipline and consistency. In our automation, we ensure these are present; otherwise, the PR cannot be merged.

* **Release (SemVer) Label:** As discussed, each PR must have one of `release:patch|minor|major`. This too will be enforced.

* **Changelog Section:** The PR description must contain a `## Changelog` section (even if the change is trivial, it should say something like "Internal refactor – no user-facing changes" and possibly you could allow a label like `skip-changelog` for such cases).

To enforce these, we set up a **PR validation workflow** that runs on PR creation and updates. This can be part of the same `changelog.yml` or a separate workflow (e.g., `pr-checks.yml`). It will run on events like `pull_request opened, edited, synchronize, labeled` etc., and perform checks:

**Using Required Labels Action:** We can use the third-party action **mheap/github-action-required-labels** to enforce label rules. For example, to require exactly one of each category of labels, you can configure multiple steps:

`on:`  
  `pull_request:`  
    `types: [opened, edited, reopened, labeled, unlabeled, synchronize]`

`jobs:`  
  `label-check:`  
    `runs-on: ubuntu-latest`  
    `steps:`  
      `- uses: mheap/github-action-required-labels@v5`  
        `with:`  
          `mode: exactly`  
          `count: 1`  
          `labels: |`  
            `release:patch`  
            `release:minor`  
            `release:major`  
      `- uses: mheap/github-action-required-labels@v5`  
        `with:`  
          `mode: exactly`  
          `count: 1`  
          `labels: |`  
            `status:Todo`  
            `status:In Progress`  
            `status:In Review`  
            `status:Done`  
          `use_regex: false`  
      `- uses: mheap/github-action-required-labels@v5`  
        `with:`  
          `mode: exactly`  
          `count: 1`  
          `labels: |`  
            `priority:Low`  
            `priority:Medium`  
            `priority:High`

Each step will fail if the condition is not met. The first ensures one `release:*` label is present[github.com](https://github.com/marketplace/actions/require-labels#:~:text=steps%3A%20,semver%3Apatch%20semver%3Aminor%20semver%3Amajor), the second ensures one status (the list of allowed status labels should be enumerated or you could use `use_regex: true` with something like `^status:`)[github.com](https://github.com/marketplace/actions/require-labels#:~:text=Use%20regular%20expressions), and similarly for priority. You can also add `add_comment: true` to these steps to comment on the PR with an error message if labels are missing, which is helpful for developers. (Alternatively, you could combine logic in a single script, but using the action multiple times is straightforward.)

**Changelog Section Check:** To enforce the presence of the `## Changelog` section in the PR description, you can use a small script. For example, with the **github-script** action:

     `- uses: actions/github-script@v6`  
        `id: check-changelog`  
        `with:`  
          `script: |`  
            `const body = github.context.payload.pull_request.body || "";`  
            `if (!body.match(/## Changelog/i)) {`  
              `core.setFailed("Please include a '## Changelog' section in the PR description.");`  
            `}`

This will cause the workflow to fail if "\#\# Changelog" is not found (case-insensitive). You might refine the regex to ensure there's content after it. This complements the template – if someone deletes the section or forgets to fill it, CI will remind them.

By making this PR check workflow a required status check (in branch protection settings), you ensure that a PR **cannot be merged** until it has the necessary labels and changelog info. This addresses the quality gates: no PR can slip through without the metadata we need for automation.

**Skip Changelog Option:** In rare cases (like a documentation typo fix or internal build change that doesn’t warrant a changelog entry), you can allow a label like `skip-changelog`. The PR template could note that if this label is applied, no changelog entry is needed. Your PR validation can be configured so that either a changelog section is present **or** the `skip-changelog` label is present. For example, you could modify the check script to pass if `skip-changelog` label is on the PR. And you can include `skip-changelog` as one option in a “require one of” set with bug/feature labels if you use those[github.com](https://github.com/marketplace/actions/enforce-pr-labels#:~:text=,changelog%27%5D%22%20BANNED_LABELS%3A%20%22banned). This way, trivial changes won’t block release automation, and the automation can ignore those PRs (the release notes generator could skip PRs with skip-changelog label). However, use this sparingly in client projects – ideally every deployment has at least a note.

## **Maintaining Consistent Labels** {#maintaining-consistent-labels}

When working across multiple repositories or teams, it’s good to have a **label synchronization strategy** so that all required labels exist (with correct naming and colors) and are used consistently:

* **Predefine Labels:** In a central place (organization README or `.github` repo) document the standard labels (`status:*`, `priority:*`, `release:*`, etc.) and their meanings. Ensure each repo (product or client-specific) has those labels created. You can do this manually or via script.

* **Label Sync Automation:** If you prefer automation, you can use a GitHub Action or script to synchronize labels. For example, the `actions/labeler` action is typically used to auto-apply labels based on file paths, but here we mean syncing the existence of labels. There are community actions or you can use the GitHub API in a script to create missing labels. A simple approach is to keep a YAML or JSON (for instance, `.github/labels.yml`) that lists all required labels (with colors/descriptions), and run a workflow (perhaps on a schedule or manual trigger) that reads this file and uses the API to create/update labels in the repo. This ensures that every repo has `status: In Progress`, `priority: High`, etc., so that contributors can apply them and the enforcement action finds them.

**Example labeler config:** While not directly related to changelog, an example `.github/labeler.yml` might be used for auto-labeling PRs. For instance, if certain paths are always docs changes, you could auto-label `skip-changelog` on PRs that only touch `docs/` or `.md` files. Another use: auto-label PRs with `release:patch` by default, and then developers can change to minor/major if needed. This reduces the chance a PR is unlabeled for release type. For example:

 `# .github/labeler.yml`  
`documentation:`  
  `- "docs/**/*"`  
  `- "*.md"`

*  And then set `documentation` label as `skip-changelog` type or simply use it to signal it’s a non-code change. (This requires the `actions/labeler` workflow to be enabled.)

In summary, having a label policy and automation to back it up will keep your workflow smooth and predictable. Every PR in a client delivery project will clearly indicate its status, priority, and release impact.

## **Putting It Together (Client Delivery)** {#putting-it-together-(client-delivery)}

In a client delivery scenario, each repository (likely one per client project) will include:

* **Changelog File:** A `CHANGELOG.md` in the repository root that adheres to a standard format (we recommend the *Keep a Changelog* format with dated entries and categorized changes). This file is updated automatically on each release.

* **GitHub Actions Workflows:**

  * `changelog.yml` (or similarly named) – handles the release process when PRs merge to main, as illustrated above.

  * `pr-label-check.yml` (optional name) – handles PR validation, ensuring labels and changelog sections are present.

  * Optionally, `labeler.yml` config and corresponding `labeler` action workflow if auto-labeling by file patterns is desired (less critical for this use-case).

* **Labels:** All required labels (`status:*`, `priority:*`, `release:*`, etc.) created in the repo, possibly synced via automation.

* **Usage:** When a developer opens a PR for a client feature/fix, they fill out the PR template including the changelog section, and assign appropriate labels (priority, status, and a release bump label). The PR checks will signal if anything is missing. Once approved and merged, the automation takes over to bump the version, tag it, update the changelog, and create a release. The team can then communicate this release to the client (for example, “Release v1.5.0 deployed with the following changes...” using the notes generated).

**Note on Client Delivery differences:** The above blueprint is very similar to a product workflow. One key difference in a client context is you might not publicize the release on a public registry, but you still tag it in GitHub for internal tracking or for the client's repository. Also, you might time the actual deployment of the release to the client’s environment – the tagging doesn’t necessarily mean the client site is updated, unless you tie that in. But the system ensures there is a packaged reference (GitHub Release) for every set of changes delivered. If a client project prefers batched releases (e.g., at end of a sprint), you could hold off merging PRs to main until the release date, or adjust the workflow to only run when a certain label or manual trigger is used (for example, merge PRs into a develop branch continuously, then when ready to deliver, open a "Release PR" into main that triggers the release). By default, though, merging to main produces a release – a true continuous delivery model, which many clients appreciate for incremental updates.

## **Example Configuration Files** {#example-configuration-files}

To complement the workflow, here are example configuration files that might be included in the repository:

**Changelog Config (`.github/changelog-config.yml`):** This could be used by certain tools or just as documentation. For instance, if using *Release Drafter* (an alternative approach), you would have a `.github/release-drafter.yml`. In our custom workflow, we don't need a separate config file for the changelog generation logic (since it's in the script), but we can document the changelog format or categories. An example (for documentation) could be:

 `changelog_style: keep-a-changelog`  
`categories:`  
  `- type: Added`  
    `prefix: "**Added:**"   # Look for lines that start with this in PR descriptions`  
  `- type: Fixed`  
    `prefix: "**Fixed:**"`  
  `- type: Changed`  
    `prefix: "**Changed:**"`  
`include_issues: true  # indicates that linked issue content should be appended if available`

*  This file isn't used directly by our script, but it serves as a reference for contributors (and could be used by a more advanced changelog tool or action if integrated later).

**Release Drafter Config (optional):** If at some point you decide not to release every PR immediately and instead draft a release note from multiple PRs, a tool like Release Drafter can be configured. For completeness, here’s a sample `.github/release-drafter.yml`:

 `name-template: 'v$RESOLVED_VERSION'`  
`tag-template: 'v$RESOLVED_VERSION'`  
`categories:`  
  `- title: '🚀 New Features'`  
    `labels: ['feature', 'enhancement']`  
  `- title: '🐛 Fixes'`  
    `labels: ['bug', 'fix']`  
  `- title: '🛠 Maintenance'`  
    `labels: ['chore', 'refactor']`  
`change-template: '- $TITLE (#$NUMBER) by @$AUTHOR'`  
`version-resolver:`  
  `major:`  
    `labels: ['release:major', 'breaking']`  
  `minor:`  
    `labels: ['release:minor', 'feature']`   
  `patch:`  
    `labels: ['release:patch']`

*  This config says: how to draft the release notes grouping by categories, and how to decide version bumps (here it listens to our `release:` labels among others)[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=This%20configuration%20sets%20how%20the,repository%20for%20more%20available%20configurations). While our primary approach does not rely on Release Drafter (we create releases immediately on merge), this could be used if one wanted to accumulate changes and release manually.

**Labeler Config (`.github/labeler.yml`):** If using the GitHub Labeler action for auto-labeling, define patterns for files:

 `"client-backend":`  
  `- "client_app/backend/**"`  
`"client-frontend":`  
  `- "client_app/frontend/**"`  
`"documentation":`  
  `- "**/*.md"`

*  And so on. This is project-specific; it automatically tags PRs touching certain areas. While not directly part of changelog or release, it can tie into the workflow (for example, PRs that only change docs could get `documentation` label and perhaps you decide those get `skip-changelog` automatically).

## **Conclusion** {#conclusion}

By implementing this blueprint, your client delivery projects will have an automated, reliable process for tracking changes and publishing releases. Each change is documented at the source (in the PR), verified by CI, and then propagated to the official changelog and release notes. This provides transparency to your clients (they can see what’s delivered in each version) and reduces manual effort for your team (no forgetting to update the changelog or bump versions). It also enforces good practices like labeling and clear PR descriptions, improving overall project hygiene.

With minimal adjustments, this same framework can be applied to product development repositories – the next section/document will outline those differences. But for client work, the above ensures every delivery is well-documented and easy to trace. Happy automating\!

---

