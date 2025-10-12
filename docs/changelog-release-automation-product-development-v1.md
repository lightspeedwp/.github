# **Changelog & Release Automation** 

## *Product Development Workflow*

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025  
---

[Pull Request Changelog Content](#pull-request-changelog-content)  
[Semantic Versioning & Release Labeling](#semantic-versioning-&-release-labeling)  
[Automated Release Workflow](#automated-release-workflow)  
[PR Label Enforcement & Checks](#pr-label-enforcement-&-checks)  
[Maintaining Labels and Config for Product Repos](#maintaining-labels-and-config-for-product-repos)  
[Differences for Product Development](#differences-for-product-development)  
[Conclusion](#conclusion)

---

This blueprint describes a similar automation system, tailored for **product development workflows**. Many concepts overlap with the client workflow, but here we emphasize needs typical of product releases (for example, possibly wider audience release notes, and maybe more strict semantic versioning since the product is likely versioned for public or many users). The system ensures that every code change intended for release is documented via a structured changelog, and that merging into the main branch triggers an automated version bump, changelog update, and release creation.

## **Pull Request Changelog Content** {#pull-request-changelog-content}

For product development, it’s critical to maintain a **high-quality changelog** because end-users, other developers, or open-source consumers will read it. We require each PR to include a **“Changelog” section** in its description, serving as the content for release notes and the `CHANGELOG.md`:

* **PR Template & Structure:** Use a standardized pull request template that includes a `## Changelog` section prompt. The contributor must list the changes in the PR in a user-friendly way. For a product, this often means:

  * Explaining new features, enhancements, fixes, etc. in plain language.

  * Optionally grouping changes by type (Added, Changed, Fixed, Deprecated, etc.) similar to the Keep a Changelog convention[stefanzweifel.dev](https://stefanzweifel.dev/posts/2021/11/13/introducing-the-changelog-updater-action/#:~:text=Personally%20though%2C%20I%20really%20like,have%20to%20update%20an%20implementation). This helps users quickly scan release notes for what’s relevant[stefanzweifel.dev](https://stefanzweifel.dev/posts/2021/11/13/introducing-the-changelog-updater-action/#:~:text=Personally%20though%2C%20I%20really%20like,have%20to%20update%20an%20implementation).

  * Including references to issues or feature requests (e.g., “fixes \#45”) so that the changelog is traceable.

Example:

 `## Changelog`  
`### Added`  
`- **Integration with Payment API:** The product now supports PayFast integration for online payments.`

`### Fixed`  
`- **Security:** Resolved an XSS vulnerability in the comments module (thanks @contributor for reporting).`

*  In this example, headings like “Added” and “Fixed” are used to categorize changes, and important keywords (like “Security”) are highlighted for emphasis to users.

* **Linked Issues and Enhancements:** In product development, issues (feature requests, bug reports) often contain the initial problem statement or acceptance criteria. If your workflow uses GitHub Issues with fields or if you tag issues with something like `change log: ...` entries, you can configure the automation to pull that in. For instance, if an issue has a section “Planned Change” or a custom field in a GitHub Project, the release automation can append that detail. This ensures the release note captures not just what was done, but the context (often, product users appreciate knowing the why or the impact). If not pulling automatically, at least encourage developers to incorporate relevant details from the issue into the PR’s changelog entry.

* **Tone and Clarity:** Since this is a product, the changelog should be written for an **external audience** (end users or developers using the product). Avoid internal jargon. For example, say “Improved login performance (2x faster)” instead of “refactored AuthController logic”. The PR reviewer and the CI check will ensure the changelog entry is present, but it’s the team’s responsibility to keep it clear and useful.

Thus, as with client PRs, the **changelog section is mandatory** in every PR meant for release. It will be scraped and added to the product’s official changelog.

## **Semantic Versioning & Release Labeling** {#semantic-versioning-&-release-labeling}

The product adheres to **Semantic Versioning (SemVer)** (major.minor.patch) for releases, which is important for communicating changes to users and for dependency management (if it’s a library or package). We use the PR labels to signal what kind of version bump a change warrants:

* Use `release:patch` for bug fixes, small tweaks, or documentation changes. These should be backwards-compatible and increment the patch version (X.Y.Z \-\> X.Y.(Z+1)).

* Use `release:minor` for new features or significant updates that are backwards-compatible. This increments the minor version (X.Y.Z \-\> X.(Y+1).0).

* Use `release:major` for any backwards-incompatible changes or sweeping changes. This will increment the major version (X.Y.Z \-\> (X+1).0.0). This includes removals of features, changes that break APIs, or any change you deem as requiring user attention to upgrade.

Using labels for this ensures that even if commit messages vary, we have an explicit declaration of intent. As a safeguard, the process also respects Conventional Commit cues:

* If a commit or PR description contains `BREAKING CHANGE:` (or uses a `feat!:` syntax), the automation will treat it as a major bump regardless of label, to avoid accidentally releasing a breaking change as a minor[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=This%20configuration%20sets%20how%20the,repository%20for%20more%20available%20configurations).

* If needed, the team could introduce a special label like `release:skip` for changes that should not trigger a release (though in a product context, typically everything merged to main would be part of a release, unless you specifically mark it as internal-only change; even then you might release a patch with no notable changes).

Ensure that **exactly one release label is applied per PR**, so there’s no ambiguity. The continuous integration will check this.

One nuance in product development: sometimes multiple PRs are bundled into one release (especially if you don’t release every merge). In such cases, each PR still gets a label (for its significance), and the highest significance among them could determine the version. For example, if since the last release you merged 5 PRs: 4 labeled patch and 1 labeled minor, the upcoming release should be minor. Our automation is designed for each PR individually triggering a release, but if you adapt it to batch mode, you’d use a tool (like Release Drafter or the GitHub Release Notes auto-generator) to scan all merged PRs and pick the largest bump. This blueprint’s default is releasing each PR (so version bumps strictly follow that PR’s label).

## **Automated Release Workflow** {#automated-release-workflow}

In product development, we often want every merge to main to result in a new release (especially if doing continuous deployment) or at least an updated changelog. The workflow for automation is very similar to the client workflow, with possibly a bit more emphasis on **distribution** or additional steps if needed (for example, publishing a package). Below is an example `.github/workflows/changelog.yml` for the product:

`name: Release and Changelog`

`on:`  
  `pull_request:`  
    `types: [closed]`

`jobs:`  
  `release:`  
    `if: github.event.pull_request.merged == true && github.event.pull_request.base.ref == 'main'`  
    `runs-on: ubuntu-latest`  
    `permissions:`  
      `contents: write`  
      `pull-requests: read`  
      `issues: read`  
    `steps:`  
      `- uses: actions/checkout@v3`  
        `with:`  
          `ref: main`

      `- name: Calculate new version`  
        `id: ver`  
        `run: |`  
          `LAST_TAG=$(git describe --tags --abbrev=0 --match "v[0-9]*" || echo "v0.0.0")`  
          `BASE_VER=${LAST_TAG#v}`  
          `IFS='.' read -r major minor patch <<< "$BASE_VER"`  
          `case "${{ github.event.pull_request.labels[*] }}" in`  
            `*"release:major"*) ((major++)); minor=0; patch=0;;`  
            `*"release:minor"*) ((minor++)); patch=0;;`  
            `*"release:patch"*) ((patch++));;`  
            `*) ((patch++));;`  
          `esac`  
          `NEW_VER="$major.$minor.$patch"`  
          `# Check for BREAKING CHANGE override`  
          `PR_BODY="${{ github.event.pull_request.body }}"`  
          `if echo "$PR_BODY" | grep -q "BREAKING CHANGE:"; then`  
            `((major++)); minor=0; patch=0`  
            `NEW_VER="$major.$minor.$patch"`  
          `fi`  
          `echo "NEW_VERSION=$NEW_VER" >> $GITHUB_OUTPUT`

      `- name: Gather Changelog Notes`  
        `id: notes`  
        `run: |`  
          `PR_BODY="${{ github.event.pull_request.body }}"`  
          `CHANGELOG_SECTION=$(echo "$PR_BODY" | awk '/## Changelog/{flag=1;next} /^## /{flag=0} flag')`  
          `if [ -z "$CHANGELOG_SECTION" ]; then`   
            `CHANGELOG_SECTION="*No changelog provided.*"`  
          `fi`  
          `# Optionally get linked issue info (if any)`  
          `# For example, extract first linked issue number:`  
          `ISSUE=$(echo "$PR_BODY" | grep -oiE "closes\s+#([0-9]+)" | sed -E 's/closes\s+#//i')`  
          `if [ -n "$ISSUE" ]; then`  
            `echo "Linked issue: $ISSUE"`  
            `# (Here one could use gh or curl to get issue details, not shown for brevity)`  
          `fi`  
          `# Output the notes (escape quotes for JSON safety if needed)`  
          `NOTES="${CHANGELOG_SECTION//'\"'/'\"'}"`  
          `echo "NOTES=$NOTES" >> $GITHUB_OUTPUT`

      `- name: Update CHANGELOG.md`  
        `run: |`  
          `VER=${{ steps.ver.outputs.NEW_VERSION }}`  
          `DATE=$(date -u +'%Y-%m-%d')`  
          `printf '## [%s] - %s\n' "v$VER" "$DATE" > tmp_changelog.txt`  
          `echo "${{ steps.notes.outputs.NOTES }}" >> tmp_changelog.txt`  
          `echo -e "\n" >> tmp_changelog.txt`  
          `if [ -f CHANGELOG.md ]; then`  
            `cat CHANGELOG.md >> tmp_changelog.txt`  
          `fi`  
          `mv tmp_changelog.txt CHANGELOG.md`  
          `git config user.name "GitHub Actions"`  
          `git config user.email "actions@github.com"`  
          `git add CHANGELOG.md`  
          `git commit -m "docs(changelog): v$VER [skip ci]"`

      `- name: Create Tag and Release`  
        `env:`  
          `NEW_VER: ${{ steps.ver.outputs.NEW_VERSION }}`  
          `RELEASE_BODY: ${{ steps.notes.outputs.NOTES }}`  
        `run: |`  
          `git tag -a "v$NEW_VER" -m "Release v$NEW_VER"`  
          `git push origin "refs/tags/v$NEW_VER"`  
          `gh release create "v$NEW_VER" -t "v$NEW_VER" -n "$RELEASE_BODY"`   
          `# Using GitHub CLI for brevity; ensure it's installed or use an action`

Most of this is analogous to the client workflow, but there are a few product-specific tweaks:

* We included a `gh release create` command (which uses the GitHub CLI) to create the release. In product projects, you might already use the GitHub CLI in CI, or you can stick to the API call as shown earlier. The result is the same: a published GitHub Release with the notes. The CLI automatically uses the provided title (-t) and notes (-n) as the release content.

* We added `[skip ci]` in the commit message when updating the changelog. This is a minor detail: it prevents this documentation commit from triggering any other CI workflows (like tests or build) that also run on push. Because when we commit `CHANGELOG.md`, if we have other workflows that run on push to main (such as deployment or testing workflows), they might trigger again. Tagging the commit message with `[skip ci]` is a common practice to signal those should ignore this commit. (Our own workflow already ran, so we don’t need to run it again for this commit. GitHub Actions by default will not re-trigger the *same* workflow on a commit made by `GITHUB_TOKEN` to prevent infinite loops[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=Note), but other workflows could trigger unless skipped.)

* We print out an echo for a linked issue if found. This is just to show where you could integrate issue data. For example, if issue \#123 is closed by this PR, you might query GitHub for its details (like title or a custom field) to include more info in the release notes. We haven't fully implemented it here (to keep the script brief), but this is a spot for enhancements.

* The format of the changelog entry remains consistent: each release in `CHANGELOG.md` gets a new top-level `## [vX.Y.Z] - YYYY-MM-DD` heading with the notes. This follows *Keep a Changelog* format where each version is documented with a date.

* If the product has additional release steps (for example, publishing to a package registry, uploading build artifacts, etc.), those would be additional steps in this workflow or a subsequent workflow triggered by the release event. For example, if this is an NPM package, you might add a step to run `npm publish`. Or if it’s a compiled binary, you might build and attach binaries to the GitHub Release. The current workflow covers the tagging and changelog; extending it for publishing is straightforward but depends on the product’s tech stack.

By running this workflow, every merge to main produces a new release. If your product development cycle sometimes holds merges (using feature branches or flags) and then does a coordinated release, you could alter the trigger. For instance, use a manual trigger (`workflow_dispatch`) or a schedule, or trigger on pushing a version bump commit. In that scenario, you might not want to tag on every PR merge, but rather when you decide to cut a release. In that case, the automation can still help: you might accumulate changelog fragments (with something like Changie or keep-a-changelog style Unreleased section) and then run a release action that batches them. This blueprint assumes continuous releases for simplicity.

## **PR Label Enforcement & Checks** {#pr-label-enforcement-&-checks}

Similar to the client workflow, we enforce certain **labeling and description standards** in product PRs:

* Each PR must have `release:patch|minor|major` (enforced by CI). This prevents releasing without clarity on version impact.

* Each PR should have relevant **category labels** for the release notes if you use them. For instance, you might label PRs as `type: feature`, `type: bug`, etc., which a tool or just the maintainers can use to organize the changelog. This is optional, since the PR body itself can convey the categorization. But some teams use labels to generate sections in the release notes automatically (e.g., Release Drafter can group by such labels).

* Status/priority labels can be used in product dev too, though some product teams use different schemes (like `status: ready for QA`, `priority: P1`, etc.). We enforce them if that’s part of your workflow to maintain consistency in issue tracking.

The **PR validation workflow** for product dev looks essentially the same as for client:

`on:`  
  `pull_request:`  
    `types: [opened, edited, reopened, labeled, unlabeled]`

`jobs:`  
  `pr-lint:`  
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
      `- uses: actions/github-script@v6`  
        `with:`  
          `script: |`  
            `const body = github.context.payload.pull_request.body || "";`  
            `if (!body.match(/## Changelog/i)) {`  
              `core.setFailed("Changelog section is missing in PR description.");`  
            `}`

We might also require, for example, at least one of `type: feature/bug/doc` labels if we want to ensure categorization. This can be done with another `required-labels` step (similar to how we did for status/priority earlier). For example:

     `- uses: mheap/github-action-required-labels@v5`  
        `with:`  
          `mode: minimum`  
          `count: 1`  
          `labels: |`  
            `type:feature`  
            `type:bugfix`  
            `type:documentation`

This would force the PR to have at least one type label. This is not strictly required for the release to function, but it can improve the clarity of release notes if you use an automated tool or even just for filtering PRs.

As before, failing this check will prevent merging (assuming you set these checks as required in branch protection).

## **Maintaining Labels and Config for Product Repos** {#maintaining-labels-and-config-for-product-repos}

In a single product repository, it’s easier to manage labels (you create them once). If you have multiple product repos (say several components), consider centralizing the label scheme:

* Ensure all repos use the same `release:` labels (so the automation config can be shared).

* Ensure consistent use of `type:` labels or others if you plan on auto-generating combined release notes.

You can use the same label sync strategy described in the client section. Often for open-source products, the community might be adding PRs – having a clear contributing guide telling them to fill out the PR template and perhaps apply a label (or the maintainers will do it) is important. You can even use GitHub Actions to automatically label PRs from external contributors as needing triage, etc., but that’s beyond our scope.

One specific config for product releases is **GitHub’s release notes configuration**. GitHub can automatically generate release notes, and you can guide it with a `.github/release.yml` file. For example:

`# .github/release.yml`  
`changelog:`  
  `categories:`  
    `- title: "🚀 New Features"`  
      `labels: ["type:feature", "type:enhancement"]`  
    `- title: "🩹 Fixes"`  
      `labels: ["type:bugfix", "type:bug"]`  
    `- title: "📖 Documentation"`  
      `labels: ["type:documentation"]`  
  `exclude:`  
    `labels: ["skip-changelog", "internal"]`

If you use the GitHub UI or API auto-notes, it will then group PRs by those categories. However, in our case, we are manually assembling notes from the PR body, so this config might not be directly used. It’s good to be aware of, and you could incorporate those categories into your PR body (e.g., ensure PR body lines correspond to those categories). This is more of an advanced tweak if needed.

## **Differences for Product Development** {#differences-for-product-development}

To summarize where this **product workflow** might differ from a client workflow:

* **Audience:** The changelog and release notes might be public or widely read, so wording and completeness are vital. The process ensures nothing is released without a description.

* **Frequency:** Product releases might be more scheduled (e.g., version 2.0 planned after a set of features). Our setup does continuous releases by default, but can be adjusted to manual triggers if needed. If manual, you might not trigger on each PR merge but rather run the workflow when ready. In such a case, you would collect all PRs since last version and generate a combined changelog. You could still enforce PRs have entries (so nothing is forgotten), and then use a tool like Release Drafter to accumulate them. For instance, Release Drafter will draft a release with all merged PR titles and can use the labels to decide version[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=This%20configuration%20sets%20how%20the,repository%20for%20more%20available%20configurations), which is somewhat parallel to what we did but in a batch mode.

* **Version overrides:** In product dev, you might occasionally bump versions outside the normal flow (like skipping a number or doing a quick hotfix). The system is flexible – you could push a tag manually if needed, or alter the version in code. The automated versioning can be overridden by simply tagging a release yourself; then the next PR should base off that. Another approach is to allow a `Release-As: x.y.z` commit footer if absolutely needed (supported in some tools like conventional commits). This isn’t commonly needed unless doing something unusual.

* **Additional release actions:** As mentioned, products often require building artifacts or publishing packages. After the “Create Release” step, you could have jobs triggered on the release event (as Stefan Zweifel’s example uses an update-changelog on release event[stefanzweifel.dev](https://stefanzweifel.dev/posts/2021/11/13/introducing-the-changelog-updater-action/#:~:text=,version%3A%20%24%7B%7B%20github.event.release.name), or as PäksTech blog splits build/upload after release creation[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=on%3A%20release%3A%20types%3A%20)[pakstech.com](https://pakstech.com/blog/github-actions-release-workflow/#:~:text=RUSTTARGET%3A%20%24,archive)). For example, you could have:

  * A workflow `on: release(published)` that builds binaries and attaches them to the GitHub release, or

  * A job in the same workflow after tagging that runs deployment (maybe deploying to a production environment or publishing to DockerHub, etc.).

Those extensions depend on the nature of the product. The key part is that our changelog and version tagging mechanism will work as the trigger or foundation for those.

## **Conclusion** {#conclusion}

Implementing this automation in a product development repository ensures that every change is documented and versioned. Developers write human-readable entries at development time (when context is fresh), and the system compiles these into polished release notes for end-users[stefanzweifel.dev](https://stefanzweifel.dev/posts/2021/11/13/introducing-the-changelog-updater-action/#:~:text=Personally%20though%2C%20I%20really%20like,have%20to%20update%20an%20implementation). Semantic versioning is strictly adhered to, driven by labels[github.com](https://github.com/marketplace/actions/require-labels#:~:text=steps%3A%20,semver%3Apatch%20semver%3Aminor%20semver%3Amajor) and checks, so you won’t accidentally issue a major change as a minor release – it's all intentional and transparent.

The deliverables from this setup include:

* **An updated CHANGELOG.md** on each release, which can be included in your product documentation or announcements.

* **GitHub Releases** for each version, which users/watchers of the repo can subscribe to, and which can be used to distribute source code or compiled assets.

* **Consistency** across the team: PRs have a clear structure and labeling, which improves communication (even before release, one can see at a glance the nature of a PR by its labels and description).

By using the attached example workflow and configs (and adjusting to your repository’s needs), you set up a robust continuous release pipeline. This saves time (no manual changelog writing at release time) and reduces errors (no forgotten changes, no version conflicts), and gives your users confidence via clear, timely release notes. The development team can focus on building features, knowing that once they merge to main, the rest – from changelog entry to actual release – is handled automatically and correctly.

---

