# **Label Automation Strategy**

## *Includes Changelog Governance & Git Workflow strategies*

***Version:*** 1.0 • ***Last updated:*** 9 Oct 2025

This document outlines a comprehensive plan to standardise GitHub labels, automate changelogs, and enforce a consistent Git branching workflow across LightSpeed’s repositories (initially focusing on block themes, plugins, and documentation projects). It is structured as a detailed action guide with clear governance rules, automation strategies, and a phased rollout roadmap. All recommendations are made with scalability and maintainability in mind, supporting our Scrumban process and accommodating both design and development tracks.

---

[1\. Label Governance](#1.-label-governance)

[2\. Project & Milestone Sync](#2.-project-&-milestone-sync)

[3\. Changelog Automation](#3.-changelog-automation)

[4\. Branching Model & Triggers](#4.-branching-model-&-triggers)

[5\. Missing Metadata Recovery](#5.-missing-metadata-recovery)

[6\. Implementation Roadmap](#6.-implementation-roadmap)

---

## **1\. Label Governance** {#1.-label-governance}

**Centralised Label Families:** We will manage a unified set of issue/PR labels, grouped into logical “families” (categories), to be used consistently across all repos. These include:

* **Type/Category Labels:** Describe the nature of the issue/PR. Examples: `bug`, `feature` (for new enhancements), `task` (generic development task), `documentation`, and `design` (for design/UI tasks). These indicate **what kind** of work an item is[GitHub](https://github.com/daveremy/rustyray/blob/5c8b695a6ce11860483cbc7ec566506147ed9357/docs/LABEL_STRATEGY.md#L9-L17). Every issue/PR should carry exactly one type label for clarity.

* **Status Labels:** Indicate workflow status or state in the lifecycle. For example, `status: needs-triage` (newly opened, awaiting review), `status: in-progress` (actively being worked on), `status: blocked`, `status: needs-review` (PR awaiting code review), and `status: done` (completed/merged). Status labels are prefixed with “status:” and provide at-a-glance understanding of an item’s state[GitHub](https://github.com/daveremy/rustyray/blob/5c8b695a6ce11860483cbc7ec566506147ed9357/docs/LABEL_STRATEGY.md#L30-L38). New issues will start with `status: needs-triage` by default[GitHub](https://github.com/daveremy/rustyray/blob/5c8b695a6ce11860483cbc7ec566506147ed9357/docs/LABEL_STRATEGY.md#L109-L114).

* **Priority Labels:** Convey the urgency or importance. E.g. `priority: high`, `priority: medium`, `priority: low` (and optionally `priority: critical` for truly time-sensitive issues). These labels (prefixed with “priority:”) help filtering and focus[GitHub](https://github.com/daveremy/rustyray/blob/5c8b695a6ce11860483cbc7ec566506147ed9357/docs/LABEL_STRATEGY.md#L21-L29). Team leads will assign or adjust priority labels during triage.

* **Area/Component Labels:** Denote the functional area, subsystem, or component affected. Prefixed with “area:” (or another clear prefix), these will be tailored to each repo. For instance, a block theme might use `area: patterns`, `area: templates`, `area: styles`, while a plugin might use labels like `area: frontend`, `area: backend`, `area: integrations`, `area: API`, etc. This grouping makes it easy to filter issues by domain[GitHub](https://github.com/daveremy/rustyray/blob/5c8b695a6ce11860483cbc7ec566506147ed9357/docs/LABEL_STRATEGY.md#L50-L58). The set of area labels will be centrally defined but we’ll allow some repository-specific labels if needed (for unique components), all following the `area: X` naming.

* **Other Labels:** We will retain or introduce any additional labels needed for special purposes, such as `help wanted` (inviting community contributions), `good first issue` (low-hanging fruit for new contributors), or meta markers like `duplicate` or `wontfix`. These will be used sparingly and consistently. Colour-coding will be applied to distinguish categories (e.g. red for bugs, green for features, yellow/orange for status/priority, purple for areas) in line with established conventions[GitHub](https://github.com/daveremy/rustyray/blob/5c8b695a6ce11860483cbc7ec566506147ed9357/docs/LABEL_STRATEGY.md#L116-L124) for visual clarity.

**Central Management:** The above label families will be centrally managed via the LightSpeed `.github` repository (our shared configuration repo). We will maintain a single source-of-truth list of all allowed labels (name, description, color, category) in a config file. This ensures every repository uses the same taxonomy and definitions. For implementation, we can use a label synchronization tool or GitHub Action to propagate label changes. For example, if we update a label name or add a new one, the change can be applied organisation-wide through a script or GitHub Action (leveraging the GitHub API) so that all repos stay in sync. New repositories will inherit the standard label set as part of their setup. This central governance prevents drift and makes cross-repo collaboration easier.

**Automatic Labeling Rules:** To reduce manual effort and enforce consistency, we will employ GitHub Actions (and/or third-party bots) to apply labels automatically based on predefined rules:

* **By Branch Naming:** We will adopt a convention that the source branch name of a Pull Request encodes its type. For example, if a branch name starts with `feat/` (feature), `fix/` (bug fix), `docs/` (documentation), `design/` (design task), or `chore/` (routine maintenance), a corresponding label will be added to the PR. A GitHub Action will parse the `github.head_ref` of incoming PRs and assign the appropriate type label. *E.g.* a PR from branch **`feat/user-profile`** would automatically get the `feature` label, whereas **`fix/123-crash-on-load`** gets `bug`. This labelling by convention ensures that every PR is categorised correctly from the moment it’s opened, aligning with our branch naming standards (see Section 4). It also reinforces using the proper prefixes when developers create branches. (We will update our contributor guide to document these prefixes).

* **By File Paths & Content:** We will continue and expand the use of the GitHub Actions **Labeler** workflow to tag PRs based on changed files. Our central config defines patterns for various paths and file types to map to labels. For example, any PR modifying `theme.json`, `style.css` or files in a theme’s `assets/` folder will receive the `theme` label[GitHub](https://github.com/lightspeedwp/.github/blob/e98b6818d095dd2777787c8958ee6b544445798b/.github/labeler.yml#L8-L16). Changes under a `patterns/` directory will get a `pattern` label[GitHub](https://github.com/lightspeedwp/.github/blob/e98b6818d095dd2777787c8958ee6b544445798b/.github/labeler.yml#L15-L21), under `templates/` get `template`, and so on. We already have such rules in place (e.g. adding `blocks` label when `src/blocks/**/*` are changed[GitHub](https://github.com/lightspeedwp/tour-operator/blob/1cd14f880a5fccda26b31b9172da0e30369fd0e1/.github/labeler.yml#L42-L50)). We will review and unify these patterns across all repos so that, for instance, `.php` file changes always trigger the `php` or relevant area label, `.js` triggers `javascript` label, and config file changes trigger a `config` or `ci` label. This automated path-based labelling uses the `actions/labeler` action configured via our central **`labeler.yml`**, applied on each PR[GitHub](https://github.com/lightspeedwp/tour-operator/blob/1cd14f880a5fccda26b31b9172da0e30369fd0e1/.github/labeler.yml#L7-L15). It ensures component/area labels are consistently applied (e.g. a PR touching any WooCommerce integration file automatically gets the `woocommerce` integration label[GitHub](https://github.com/lightspeedwp/.github/blob/e98b6818d095dd2777787c8958ee6b544445798b/.github/labeler.yml#L52-L57)).

* **By Issue/PR Templates:** Our standardized issue templates already apply initial labels to new issues; we will leverage this further. For example, the “📝 Task” issue template auto-labels new issues with `task` and `needs-triage` by default[GitHub](https://github.com/lightspeedwp/.github/blob/e98b6818d095dd2777787c8958ee6b544445798b/.github/ISSUE_TEMPLATE/10-task.md#L2-L10), and the “❓ Help” template labels issues as `question`, `support`, `wordpress`[GitHub](https://github.com/lightspeedwp/.github/blob/e98b6818d095dd2777787c8958ee6b544445798b/.github/ISSUE_TEMPLATE/03-help.md#L2-L10). We will ensure each issue type template (Bug Report, Feature Request, Design Request, etc.) includes appropriate default labels (one type label like `bug` or `feature`, plus `needs-triage`). This guarantees that new issues enter the system already categorised and marked for triage. In addition, we will explore using **GitHub Issue Forms** to capture structured data from the reporter – for instance, a severity level or affected area – and map those to labels automatically.

  * For Pull Requests, we will update the PR template to include checkboxes or fields that relate to labels. For example, a PR template might ask the author to confirm “🔖 Added to changelog?” or “📖 Documentation updated?”. If the author ticks “documentation updated”, we could auto-apply the `documentation` label. We can use a GitHub Action that parses the PR body for certain keywords or checklist states and assigns labels accordingly. Similarly, if a PR is marked “**\[x\] Breaking change**” in the template, an action could label it `breaking-change` so we can easily spot it. These automated cues reduce the chance of oversight in labelling.

**Sync with GitHub Projects:** We will integrate our labels with GitHub Projects (our project boards and custom fields) to ensure smooth filtering and status tracking:

* For each Project where we need to filter or group items by a certain attribute, we’ll use a **custom field synced to labels**. For example, in our main sprint board we will have a custom single-select field for **Priority** (“High/Medium/Low”). We will configure that field to sync with our `priority:` labels – so if an issue has `priority: high`, the field “Priority” in the project will automatically reflect “High”[GitHub](https://github.com/daveremy/rustyray/blob/5c8b695a6ce11860483cbc7ec566506147ed9357/docs/LABEL_STRATEGY.md#L21-L28). This means the team can filter or sort by priority in the project view without manually setting the field for each item – the label drives it. We will do the same for **Status**: the project’s Status field (or the Project Column grouping) will be tied to `status:` labels. As we add or change a status label on an issue (e.g. when work starts, apply `status: in-progress`), the project item’s status field will update to “In Progress”, moving the card to the corresponding column if we use that field for grouping. (GitHub Projects can group items by a single-select field like Status – by syncing labels to that field, we achieve automatic column movement.)

* To implement the above, we will ensure label names closely match project field options. For instance, if our project board has a “Status” field with options *To Do, In Progress, Blocked, Done*, our labels might be `status: to-do`, `status: in-progress`, etc., or we configure the field’s “sync with labels” setting to recognize those labels. This guarantees no discrepancy between label and field. The same applies to priority (e.g. option “High” corresponds to label `priority: high`).

* **Status Automation:** We will add workflow automation to keep status labels in sync with item state. For example: when a Pull Request is opened, automatically label it `status: needs-review` (since a new PR awaits review) – this can be done via a GitHub Action trigger on PR creation. When an issue is closed or a PR is merged, we can have an action remove active status labels and add a `status: done` label if we choose to mark completed items explicitly. (This label would then sync to the project field “Done” and drop the card in the Done column, if not already handled by closing). New issues created without manual labels will default to `status: needs-triage` either via template or an `issues.opened` trigger[GitHub](https://github.com/daveremy/rustyray/blob/5c8b695a6ce11860483cbc7ec566506147ed9357/docs/LABEL_STRATEGY.md#L109-L114), ensuring they appear in a triage queue. Together, these measures align our labels with project management so that using either interface (labels or project board) reflects the same information.

## **2\. Project & Milestone Sync** {#2.-project-&-milestone-sync}

**Default Milestone Assignment:** To integrate with our sprint and release planning, we will automate the assignment of milestones to new issues and PRs. Our milestone naming conventions will be standardised as follows: for time-bound sprints we’ll use a format like **Sprint-YYYY-WW** (year and week number) or a more readable monthly sprint name; for release versions we’ll use **vX.Y.Z** tags (e.g. v2.3.0). The logic for auto-assignment will be:

* **New Issues → Sprint Milestone:** When a new issue is created (and after initial triage), if it’s accepted into the active sprint, it should be put into that sprint’s milestone. We will create a GitHub Action (triggered on issue labeled or on creation) that checks if the issue has no milestone. As a default fallback, it can assign a placeholder milestone such as **Backlog** or the upcoming sprint. One approach is to always assign new issues to a “Backlog” milestone initially, which we can then drag into specific sprint milestones during planning. Alternatively, if we want to automate further, we could have the action detect the current sprint timeframe (via date or a designated “current sprint” milestone marked somehow) and assign issues to **Sprint-\[current\]** by default – but this may conflict with planning, so we likely will default to a Backlog/Unscheduled milestone unless the issue template or triager specifies otherwise. This ensures no issue slips by without a milestone designation, aiding visibility.

* **Pull Requests → Release Milestone:** Every PR should ideally be tied to a release cycle. We will automate milestone assignment for PRs based on their target branch and type:

  * If a PR targets the `develop` branch (i.e. it’s a feature or enhancement for the next release), then on approval or merge readiness we assign it the **next upcoming version milestone** (e.g. the open milestone for the next minor release). We can determine the “next milestone” by picking the earliest open version milestone with a future due date, or we may maintain a special milestone called “Next Release” that always represents the forthcoming version. The WooCommerce team’s automation includes an *“assign-milestone”* step that **assigns the next milestone to a PR once it’s approved**[github.com](https://github.com/woocommerce/automations#:~:text=release%20%20This%20automation%20handles,once%20it%20has%20been%20approved) – we can adopt a similar approach. This means once maintainers approve a PR, a bot will add, say, the `v2.3.0` milestone to it, indicating it’s planned for that release[github.com](https://github.com/woocommerce/automations#:~:text=release%20%20This%20automation%20handles,once%20it%20has%20been%20approved).

  * If a PR targets `main` (for hotfix or emergency patch directly to production), the automation can assign the **current patch milestone**. For example, if the current release is v2.2.0 and we’re issuing a hotfix, the PR to `main` would get milestone v2.2.1. (We would need to have that milestone created; if not, the tool could even create one or default to a generic “Hotfix” milestone).

  * In cases of maintenance or documentation PRs that might not warrant a product release milestone, we can route them to a general milestone like “Documentation” or the ongoing sprint if they are to be done within that sprint.

* This automated linking of PRs to milestones ensures that every code change is accounted for in a release or sprint. It helps during release prep – we can easily generate the changelog from all PRs in a milestone, and during sprints, see which PRs were completed.

**Milestone Fallbacks:** If an issue or PR somehow remains without a milestone (e.g. an older item that predates this process), we will implement fallbacks:

* A scheduled GitHub Action (running daily or weekly) can scan for open issues/PRs with no milestone and add them to a **“Triage”** or **“Backlog”** milestone automatically. This acts as a safety net so that every item lives in some bucket.

* For closed issues with no milestone (perhaps closed before process), we may ignore these or retroactively assign them to an “Archived” milestone for record-keeping. For merged PRs with no milestone (which could mess up changelog generation), we’ll handle them in the Changelog automation step by including them under an “Unscheduled” category if needed. But the aim is to proactively catch items without milestones before they are merged or closed.

**Project Status Sync:** As mentioned, label-based status will reflect in project boards. We will also use milestones in combination with Projects:

* Our GitHub Projects (like a Sprint board or Release board) can have an **Iteration** field (for sprints) or simply rely on milestone to group items by sprint. If using GitHub Projects Iterations, we could tie those to milestones names (if supported) or maintain them separately. At minimum, we will ensure that when an issue is added to a sprint project, it has the sprint milestone, and vice versa for consistency.

* We will keep the project **Status** field in sync with issue status labels: e.g. moving a card to “In Progress” in the project should correspond with the issue being labeled `status: in-progress`. Since GitHub’s native project automation is limited in this direction, we might add a custom workflow: e.g. if an issue is moved to a specific project column (Project events are not directly accessible to Actions yet), we may rely on developers manually updating the status label when they start work, which will automatically reflect on the project as described. We will document this expected behaviour for the team (i.e. “when you begin work, add the `status: in-progress` label; when you stop or block, use `status: blocked`, etc., and the board will update accordingly”). In future, as GitHub adds more project automation hooks, we can further automate this bidirectionally.

In summary, every issue/PR will have a milestone from creation through closure, aligning with our sprints and releases, and the labels (status/priority) will mirror into project fields so that filtering by “Status: In Progress” or “Priority: High” in a project is as simple as filtering by those labels on the issue.

## **3\. Changelog Automation** {#3.-changelog-automation}

Keeping changelogs up-to-date will be automated for each repository, drawing inspiration from WooCommerce’s recent improvements in this area. The goal is that whenever we cut a new release, the changelog is generated and published with minimal manual work, ensuring accuracy and timeliness.

**Changelog Format and Location:** We will maintain a `CHANGELOG.md` (or `changelog.txt` for WP plugins if needed) in the root of each repository. This file will list all release versions with their release dates and highlights of changes. We will use a consistent format (e.g. Keep a Changelog style or similar to WooCommerce’s format). For example:

`## [1.2.0] - 2025-10-15`  
`- **New:** Added booking calendar block for tours. [#123](PR link)`  
`- **Fix:** Resolved price calculation rounding issue. [#150]`  
`- **Tweak:** Updated README and screenshots.`

The entries will be grouped by type (New Features, Fixes, Improvements, etc.) or indicated with a prefix as in WooCommerce’s changelog (they prefix lines with *Fix \-*, *Update \-*, *Dev \-* etc in their changelog file[raw.githubusercontent.com](https://raw.githubusercontent.com/woocommerce/woocommerce/master/changelog.txt#:~:text=https%3A%2F%2Fraw,update%20script%20issue%20where%20refunded)[raw.githubusercontent.com](https://raw.githubusercontent.com/woocommerce/woocommerce/master/changelog.txt#:~:text=product%20price%20display%20in%20RTL,site%20methods%20%5B%2361009%5D%28https%3A%2F%2Fgithub.com%2Fwoocommerce%2Fwoocommerce%2Fpull%2F61009%29%20%3D%2010.2.0)). We will decide on a set of prefixes: e.g. **Added/New**, **Fixed**, **Changed/Updated**, **Dev** (for developer-focused changes), **Docs**, etc., and use those in each entry for consistency. Each entry should also reference the issue or PR number for traceability.

**Labeling for Changelog Entries:** To generate the changelog automatically, we will rely on PR labels (and/or titles) to categorize changes:

* We will introduce a set of **Changelog category labels** that map to sections of the changelog. For instance, when a PR is labeled `feature` or `enhancement`, the changelog generator will know to list it under “New Features” (or prefix it as “Added \- …”). A `bug` label will map to the “Fixes” section (prefix “Fix \- …”), a `documentation` label might map to a “Documentation” section (if we decide to include docs changes in the changelog), and a `performance` label could map to “Improvement” section, etc. Essentially, the type labels we apply serve dual purpose: project management and changelog grouping. We’ll document the exact mapping so developers know how to label PRs.

* If a PR should **not** appear in the public changelog (for example, internal refactoring or build/test changes that users don’t need to read about), we will have a way to mark it. We can either label such PRs as `internal` or `no-changelog`. The changelog script will skip any PR with that label. By default, we assume most code changes in themes/plugins are user-relevant; exceptions (like test-only changes) should be explicitly labeled to skip. This opt-out approach ensures we don’t accidentally omit real changes.

* We will enforce that every code PR has either a changelog category label or a skip label before merge. This can be aided by a PR check (a GitHub Action or Probot rule) that fails if a PR is merged without an appropriate label indicating its changelog status. This way, the changelog generation won’t miss anything and developers are reminded to consider documentation impact for each PR.

**Automated Changelog Generation:** Once labels and milestones are in place, the generation process will work as follows:

* We will set up a GitHub Action (likely triggered when a release is being prepared, e.g. on pushing a tag or on merging a release branch into `main`). This action will gather all merged PRs since the last release. The common approach is to use the milestone: for example, when we’re releasing version 1.2.0, we gather all PRs assigned to the milestone “v1.2.0”. Alternatively, we can gather by Git commit history (e.g. all commits between the last tag and the new tag), but using milestones/labels is more targeted and allows excluding things by label.

* For each PR, the script will retrieve its title or a special field from the description (some projects have contributors include a “Changelog entry:” in the PR body – we might adopt that, but labels should suffice). It will then format an entry line. For example, a PR labeled `bug` might produce a line like “**Fix:** {PR title} (\#{PR number})”. If the PR has a label indicating an area or component, we could include that in the description if useful (though to keep changelog user-friendly, we might omit internal module names).

* The entries are then sorted into categories (features, fixes, etc.) according to their labels. The Action will then update the `CHANGELOG.md` file: it can either prepend the new version section at the top of the file (with date and version), listing all entries, or update a “Unreleased” section that we maintain. Our plan is to maintain unreleased changes in memory (via labels) and write them only at release time to avoid constant merge conflicts on the changelog file.

* After compiling the new release notes, the Action will commit the updated `CHANGELOG.md` to the repository (for example, directly to the `main` branch as part of the release commit). WooCommerce implemented a similar post-release changelog update workflow – *“Changelogs are now auto-updated post-release”* – meaning as soon as a release is cut, the changelog file is immediately updated with that release’s details. We will mirror this approach to ensure our changelog is always current.

* Optionally, we can also automate publishing a GitHub Release (the Releases section on GitHub) with the same notes. Tools like Release Drafter or our custom script can use the generated changelog content to create a release entry (tag, name, and body text). This is beneficial for those who follow GitHub releases or if we integrate with Packagist/NPM/etc for distribution. If our projects are WordPress plugins/themes intended for wordpress.org, we might also integrate the changelog update with the deployment workflow to update the readme.txt (for plugin directory) with the latest changelog – though that may be handled separately in our release action.

**Changelog Relevance and Maintenance:** Only certain types of changes will trigger changelog entries:

* **User-facing changes**: new features, enhancements, bug fixes, performance improvements, deprecated features, and notable UX or UI changes will always be included.

* **Developer-facing changes**: API changes, refactoring that affects extenders, or internal changes of note (like requiring a higher PHP version, or major refactors) can be included under a “Development” or “Internal” heading so that other developers are aware. We might label these as `dev` or `internal` and have a section in the changelog if needed.

* **Excluded**: purely internal housekeeping (tests, CI workflow updates, code style fixes, etc.) will not clutter the changelog. Those PRs will carry the `no-changelog` label or similar as discussed.

* We will make sure each repository’s README or documentation points to the CHANGELOG.md so users can find the history of changes easily.

By automating the changelog, we reduce the chance of human error (like forgetting an entry or inconsistent wording) and we free developers from manually editing the file for each PR. It also encourages better practices (ensuring PR titles are clear and labels set correctly). Moreover, it provides immediate feedback to the community – as soon as a release is out, the changelog is published alongside it, much like WooCommerce ensuring “changes in each release are immediately available to the developer community”.

*(Note: We will also automate updating the list of contributors for each release, if applicable – for example, generating a list of external contributors who authored PRs in the release. WooCommerce now auto-generates contributor lists; we can do the same to credit community contributors or team members in release notes. This could be an optional nice-to-have in our changelog or release announcement process.)*

## **4\. Branching Model & Triggers** {#4.-branching-model-&-triggers}

We will implement a consistent Git branching strategy across LightSpeed projects to support parallel development, easy hotfixes, and integration with our automation. The standard model will use **`main`** and **`develop`** branches:

* **`main` branch:** The main branch represents the latest stable code ready for production/release. Only release commits (after testing) and hotfixes go directly into main. Each release is tagged from main (e.g. v1.2.0 tag on main). Main is a protected branch (requiring PRs and reviews for any direct changes).

* **`develop` branch:** The develop branch is the default integration branch where ongoing development happens. All feature and fix branches are merged into `develop` first. This branch contains code for the next upcoming release. When the code in develop is deemed ready for release, it will be merged into main (via a PR or release workflow) – that marks the release cut. After releasing, we may bump version numbers on develop for the next cycle. This workflow (often called Git Flow Lite) allows us to accumulate changes and stabilize them in develop without affecting the production-ready main until we choose to.

* **Short-lived or simple repositories:** In some cases (like a documentation website or very simple projects), maintaining a separate develop branch may be overkill. For those, we can work directly on main (with feature branches still encouraged for organizing work). The decision will be based on the repo’s complexity and release needs. As a rule of thumb, product code (themes/plugins libraries) will use main+develop, whereas purely content repos might just use main with careful PR practices.

This branching model supports our scrumban approach: we can continuously integrate into develop and release at the end of a sprint or whenever ready by merging to main. It also facilitates urgent patches – we can branch off main for a hotfix without pulling in unfinished develop changes.

**Branch Naming Conventions:** To keep branches organised and to trigger the automation rules mentioned, we’ll follow a clear naming scheme for feature and fix branches:

* **Feature work:** Branches adding new features or enhancements should prefix with `feat/`. For example, `feat/booking-calendar` (for adding a booking calendar feature). This signals a new capability and will auto-label the PR as a feature.

* **Bug fixes:** Use the prefix `fix/`. Ideally include either a brief of the issue or the GitHub issue number it addresses. *E.g.* `fix/price-rounding-#234` or `fix/234-price-rounding`. Including the issue number (if one exists) helps trace the branch to its issue and might even allow GitHub to auto-link the PR to that issue. The PR will get labeled as a bug by our automation.

* **Chores/Maintenance:** For updates that are neither features nor direct bug fixes (e.g. dependency bumps, refactoring, build tool changes), use `chore/` or `build/`. Example: `chore/update-deps-Oct` or `build/webpack5-migration`. We will map `chore/` branches to a `maintenance` or `chore` label on PRs.

* **Documentation:** Documentation-specific changes should use `docs/` prefix, e.g. `docs/update-readme` or `docs/user-guide-section`. This indicates the changes are only in documentation and will trigger a documentation label.

* **Design:** If a branch is created for design assets or related changes in the repo (e.g. updating Figma exports in a docs repo), we can use `design/` prefix. (Design tasks that don’t involve code might not have a branch at all, but if they do, the prefix helps identify them.)

* **Release and Hotfix branches:** When preparing a release, we may use `release/` branches (for example `release/v1.2.0`) to finalize version bumps, changelog updates, etc., before merging to main. Similarly, a quick patch directly on main might use `hotfix/` prefix (e.g. `hotfix/urgent-checkout-bug`). These can be handled as special cases: a `release/` branch could automatically trigger certain CI (like building a release candidate) and a `hotfix/` branch could be treated akin to a fix. We will label PRs from `release/` branches accordingly (perhaps with a `release` label).

* **User or Team branches:** In some cases teams use user initials or names in branches (e.g. `alice/experiment-x`). We prefer the semantic prefixes above for consistency, but if personal branches are needed for WIP, we’ll encourage converting them to proper `feat/` or `fix/` names when turning into PRs.

These naming conventions will be documented and enforced as best practice. To assist, we might implement a lightweight check using a GitHub Action or a linter that warns if a PR’s branch name doesn’t match the expected patterns (not strictly blocking, but nudging for consistency).

**Triggers from Branches and Files:** The branch naming not only conveys intent but also triggers certain CI workflows:

* As described in Label Governance, our automation will read the branch prefix to auto-apply type labels. This immediate feedback loop reinforces the scheme (developers will see their PR labeled “Feature” or “Bug” thanks to the branch name).

* We could also tie branch patterns to CI pipelines. For example, when a branch named `release/…` is pushed or a PR targeting main is labeled as a hotfix, we might trigger a full regression test suite or a packaging step, since it’s a release candidate. Branch naming can be used in workflow condition expressions to run certain jobs only for release or hotfix branches.

* File triggers in CI: Similarly, changes in certain files might trigger specific actions beyond labeling. For instance, if a PR modifies a GitHub Actions workflow file or CI config, we might run an extra linter or require an extra reviewer (since CI changes are sensitive). We’ve already set up a label `github-actions` for changes to `.github/workflows/*`[GitHub](https://github.com/lightspeedwp/tour-operator/blob/1cd14f880a5fccda26b31b9172da0e30369fd0e1/.github/labeler.yml#L12-L20). We can expand on that by perhaps having CODEOWNERS or specific reviewers for CI changes. Another example: if `package.json` or `composer.json` changes (dependency change), the `dependencies` label is added[GitHub](https://github.com/lightspeedwp/tour-operator/blob/1cd14f880a5fccda26b31b9172da0e30369fd0e1/.github/labeler.yml#L16-L24); we might also have a workflow to automatically run `npm install` and verify build, or flag the PR for review by a maintainers group.

* These branch and file triggers integrate with our project tracking: e.g. a branch `feat/UX-improvement-#300` will produce a PR that gets labeled as Feature, which in turn could automatically add it to the Product roadmap project under “New Features” if we set up project filters for that label.

In essence, the branching model and naming conventions are not just for organisation; they actively drive our automation – from labeling to CI behaviour – ensuring that our workflow (design, dev, release) is as smooth and consistent as possible.

## **5\. Missing Metadata Recovery** {#5.-missing-metadata-recovery}

With the new systems in place, we need to handle legacy issues and PRs that may lack the labels or milestones required by our process. We will undertake a **backfill and triage initiative** to bring older items up to the new standards, and put mechanisms in place to prevent items from “falling through the cracks” in the future.

**Initial Backfill of Legacy Items:** Shortly after introducing the new label taxonomy and milestone scheme, we will run a one-time cleanup:

* **Issues:** We will query all open issues in the key repositories that do not have a type label (or that have no labels at all). Each of these will be reviewed. Where possible, we’ll programmatically assign obvious labels – for example, if an issue’s title contains words like “error” or “bug” and it’s not labeled, we’ll add the `bug` label. If an issue came from an older template we might parse its content (perhaps an older template had a section “Bug Report” that we can detect). However, automated inference can be error-prone, so for many unlabeled issues, the safest route is to mark them for human triage. We will apply the `status: needs-triage` label to any issue that is missing key labels. This surfaces them in the triage queue. A small task force can then go through these and manually assign the correct type, area, priority, etc., according to the new scheme. This one-time effort will greatly improve data quality going forward.

* **PRs:** Open PRs without labels will similarly be labeled. We can trigger our labeler action on all open PRs (it may have missed some if they were opened before the action was added). We could re-run the labeling workflow, which will apply file-based labels. Additionally, we can use branch names to label these PRs (perhaps by temporarily enabling our new branch-name parser on existing PRs). After that, any PR still missing a type label will be flagged – maintainers can quickly categorize it (since PRs are fewer than issues typically). Closed PRs from the past, if relevant for changelogs, will have been accounted for in past manual changelogs, so we don’t need to label closed PRs unless for historical search convenience. The focus is on open work.

* **Milestones:** Many older open issues might have no milestone (not scheduled). We will bulk-add a “Backlog” milestone to all open issues that remain unscheduled after triage. This clearly indicates these are acknowledged but not yet planned for a specific sprint or release. Similarly, for open PRs with no milestone: if they are near merge, assign them to the upcoming release milestone; if they are drafts or stalled, perhaps assign to a general “Undecided” milestone. Closed issues from the past could optionally be assigned to a milestone corresponding to the version they were fixed in (if we want historical completeness). If feasible, we might script: for each closed issue with no milestone, if it was closed by a PR that had a release milestone, assign that milestone. This gives a richer history, but it’s a nice-to-have. The primary aim is ensuring current and future items have milestones.

**Ongoing Triage Automation:** To prevent missing metadata in the future:

* We will maintain a **“Triage Queue”** using either a GitHub Project or simply the label `needs-triage` as a filter. Our Issue templates already add `needs-triage` on new issues[GitHub](https://github.com/lightspeedwp/.github/blob/e98b6818d095dd2777787c8958ee6b544445798b/.github/ISSUE_TEMPLATE/10-task.md#L4-L6), so every new issue starts in that queue. A regular triage meeting or rotation will handle these: verifying the issue, assigning proper labels (type, area, priority), assigning an owner if possible, and setting a milestone or project. Once triaged, the `needs-triage` label can be replaced with `status: ready` or removed.

* For any item (issue/PR) that remains unlabeled or without milestone beyond a certain timeframe, we can use a scheduled GH Action to gently remind or auto-label. For example, a nightly job could comment or label “Needs info” if an issue has no labels after a day. But since our templates and automation cover the initial labeling, this scenario should be rare.

* We will also configure the stale bot (if not already) to mark issues that haven’t been updated in a long time with a `status: stale` label and ultimately close if no activity. This ensures our backlog doesn’t collect forgotten items indefinitely. Before closing, stale issues could be reviewed to see if they simply lacked attention due to missing labels.

* In summary, any “missing” metadata becomes a trigger for triage. Unlabelled or un-milestoned equals unscheduled/untriaged in our process, and we treat that state itself as something that requires attention. Thus, the system is self-correcting: either automation assigns a default (like putting it in Backlog milestone), or it gets a triage label and human intervention.

By backfilling legacy items and instituting these safeguards, we ensure a clean and up-to-date issue tracker. This is important not just for organisation, but also so that our automated changelog and project reports have complete information (e.g. we don’t want a fix PR to slip into a release without a proper label or without being in the release milestone).

## **6\. Implementation Roadmap** {#6.-implementation-roadmap}

Rolling out these changes will be done in phases to minimise disruption and allow adjustments. Below is a proposed rollout plan:

**Phase 1: Planning & Consensus**

* **Define Taxonomy and Workflows:** Finalise the label categories, names, and colors in consultation with the development & design team. Ensure everyone agrees on the meanings of each label and the workflow changes (e.g. using develop branch, using milestones consistently). Document these in a short guide (perhaps in the `.github` repository or internal wiki).

* **Update Central Config Repo:** Implement the new labels and workflows in the LightSpeed `.github` repo. This includes updating the `labeler.yml` config with any new patterns (for area labels or file triggers), adding any new GitHub Actions workflows (for branch-name labeling, milestone assignment, changelog generation, etc.), and updating issue/PR templates with new labels or fields. We will also prepare reusable workflow files in `.github` where possible – for instance, a reusable workflow for “Auto Label by Branch” that we can call from multiple repos’ pipelines, and similarly one for “Assign Milestone” after PR approval.

* **Tooling for Label Sync:** Set up a script or action for label synchronisation. We might use an existing action (like `micnncim/label-sync-action` or GitHub’s GraphQL API via a custom script) to propagate our label set to all target repositories. Test this on a sample repository to ensure it creates/updates labels as expected.

* **Branch Protection & Settings:** Ensure the branch protection rules for `main` and `develop` are consistent across repos (this can be managed via a central settings config or manually). E.g. require PR reviews, ensure `develop` is default branch for repos using it, etc.

**Phase 2: Pilot Rollout**

* **Select Pilot Repos:** We’ll start with a couple of repositories that are high priority but low risk to experiment with (for example, one block theme and one plugin). Apply the new `.github` configurations to these repos. This may involve:

  * Creating a branch in those repos to add any needed workflow files (if they can’t be fully centralised). For instance, adding a workflow that calls our central “labeler” or branch-label reusable workflow. Because GitHub Actions from the `.github` repo can run in all org repos (as long as referenced), we might just need to reference them. If not using reusable workflows, we’ll copy the necessary YAMLs into each pilot repo for now.

  * Running the label sync script to update the labels in these repos to the new set (adding new ones, merging or renaming old ones).

  * Ensuring all existing issues/PRs in the pilot repos get triaged: apply the backfill script to mark old items with `needs-triage` or assign them default milestones as per Section 5\.

  * Enabling and testing the milestone assignment workflow and changelog generator in these repos. For example, simulate an approved PR to see if it auto-assigns a milestone, and simulate a release (perhaps by creating a dummy release branch and tag in a non-production scenario) to see if the changelog action compiles notes correctly.

* **Team Training (Pilot):** With the pilot teams (those responsible for the chosen repos), do a short review of the new process. Show them the new labels, how an issue flows from “needs-triage” to “in-progress” to “done” with labels and project, how branch naming will trigger labels, etc. Collect feedback and pain points. This early feedback is crucial to adjust things like label naming (maybe someone will suggest clearer wording) or automation thresholds (maybe auto-assigning every new issue to a sprint is too aggressive – we can switch to backlog milestone, etc.).

* **Documentation:** Refine documentation (in Markdown format, stored in `.github` or as CONTRIBUTING.md in each repo) to include these new practices. This doc (the one we are writing now, adapted) will serve as the base for that. It should be easily accessible to all team members and contributors.

**Phase 3: Organisation-Wide Rollout**

* Once the pilot repos have been running with the new system for a sprint or two and we’re satisfied with the outcomes, we proceed to roll out to all targeted repositories:

  * **Batch Updates:** Use the label sync tool to update labels on all repos (block themes, plugins, docs repos). We’ll communicate beforehand to repository maintainers that new labels will appear and some old ones may be consolidated or retired. (We will likely keep old labels temporarily as aliases if needed and then phase them out to not shock the system – for example, if we previously used a `design ✅` emoji label and now moving to `design` without emoji, we can support both for a while).

  * **Workflow Deployment:** Add the necessary GitHub Actions workflows to each repository. Ideally, we’ll convert as much as possible to **organization-level reusable workflows** to avoid duplicating code. For example, we can have a single workflow file in `.github` that contains the job for “Run Labeler on PR” and another for “Post-release Changelog Update”. Then, in each repo, we just create a stub workflow that calls `uses: lightspeedwp/.github/.github/workflows/labeler.yml@main` (if GitHub allows calling the org repo). This way, updates to the workflow logic can be done centrally. If direct reuse is not viable, we will copy the workflow files into each repo (possibly via a script to reduce manual work). Ensuring consistency is key – we might use a checklist or script to verify each repo has the correct versions of the workflow files.

  * **Migration of Issues/PRs:** Apply the missing metadata recovery steps org-wide. This might involve writing a one-off script using `gh` CLI or Octokit that goes through all repos to tag issues. If that’s too much at once, break it down by team: each team triages their backlog with guidance. However, a semi-automated approach is preferred to achieve consistency. For instance, auto-label all open issues without a type label as `needs-triage` across all repos, then ask each team to process those.

  * **Git Branch Aligning:** Ensure all repos now have `main` and `develop` branches where applicable. For any repo that didn’t have a develop branch but needs one (e.g., plugins that were committing straight to main), create the `develop` branch from current main. Update branch protection and settings so `develop` is default branch for PRs. Communicate this change clearly so contributors know to target the right branch.

  * **Milestone Creation:** Set up upcoming sprint milestones and release milestones across repos. For example, create Sprint-2025-42, 43, etc., and version milestones like v1.0, v1.1 if not already. This upfront work allows the automation to attach items to the correct milestones. We might automate milestone creation as well (some teams script the creation of a “Sprint X” milestone every week). Initially, we can do it manually or via the UI.

  * **Monitor & Support:** As the system goes live everywhere, we’ll monitor the GitHub Action runs and check for any failures or mislabeling. We’ll also be available on Slack/Teams for any developer who has questions or issues (e.g. “the bot mislabeled my PR” or “how do I mark an issue as design needed?”).

**Phase 4: Refinement & Scale**

* After full rollout, we gather feedback over the next few weeks. Are the automations saving time? Are there false positives or annoying behaviours? For example, if the auto milestone assignment isn’t quite aligning with how PMs want to schedule, we adjust the logic or maybe switch to manual for that part. Or if certain labels prove redundant, we prune them.

* **Design Track Integration:** We ensure the process works for design tasks. If design team finds the labels or flow not fitting (perhaps they want a separate Kanban board for design tasks), we adjust. Maybe we add a custom field “Track” with values Design/Dev as mentioned, to allow easy filtering of design issues. This could be an extra refinement: a label `track: design` for issues that are design-focused (with no PR expected in the short term). These could live in a design-specific column or project until ready for development.

* **Extend to Other Repos:** LightSpeed might have other repositories (outside block themes/plugins/docs, e.g. a marketing site or infrastructure scripts). After the initial focus repos, we can extend the same patterns to all remaining repos if beneficial. The `.github` configs and Actions can equally apply to them. We will however consider if some repos need slight tailoring (for example, a repository that is a fork or that has special release process).

* **Ongoing Maintenance:** Assign ownership of the central workflows and label config. Perhaps a DevOps or Tools team member will maintain the `.github` repo rules. Changes to labels or workflow logic should be reviewed and tested on a sample repo before broad application, to avoid disrupting everyone’s work unexpectedly. We’ll version control those workflow changes via PRs in `.github` so they’re transparent.

* **Regular Audits:** Every quarter or so, review the label usage and project health. Remove any labels that aren’t being used (or merge duplicates), adjust colors if needed for accessibility, and check if the automation is still aligned with our process (for example, if we introduce a new type of work, we add a new label and update the labeler config). This keeps the system lean and relevant.

Throughout the rollout, we will emphasise the benefits: less manual labeling, clearer processes, and reliable changelogs. As WooCommerce’s experience showed, investing in automation can drastically reduce manual effort and errors in release management. By Phase 4, we should have a smooth-running setup where a developer can open a PR and see it automatically labeled and slotted into the right project column, a product manager can filter the board by priority or area without additional tagging, and when release day comes, the changelog and release notes are generated with the click of a button. This strategy will bring all LightSpeed repositories into a coherent, efficient workflow, supporting our scrumban methodology and improving cross-team visibility into both design and development progress.

