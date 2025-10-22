Certainly! Here’s a clear description of the **Pull Request (PR) creation process** for LightSpeed, aligned with your organizational standards and automation:

---

## LightSpeed PR Creation Process

1. **Start from an Issue**
   - Make sure your work is tracked by an actionable GitHub issue.
   - If one doesn’t exist, [create an issue](../../issues/new/choose) using the appropriate template and labels.
   - Reference the issue number in your PR (e.g., “Closes #123”).

2. **Branch from Latest Main**
   - Pull the latest changes from the `main` (or target) branch.
   - Create a new branch using the correct prefix (e.g., `feat/`, `fix/`, `docs/`, `chore/`), which will drive template and label automation.
   - Example: `feat/header-navigation-accessibility`.

3. **Implement Your Changes**
   - Make your code, documentation, or design changes.
   - Follow [coding standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md) and conventions.
   - Update or add tests as needed.

4. **Test Locally**
   - Run all tests and linters locally to ensure code quality and compliance.
   - For UI/UX changes, provide screenshots or demo videos if relevant.

5. **Update Documentation**
   - If your change impacts user behavior, APIs, or workflows, update the relevant documentation files.
   - Add or update a [CHANGELOG.md](../CHANGELOG.md) entry if the change is user-facing.

6. **Open the Pull Request**
   - Push your branch to GitHub.
   - Click “Compare & pull request” or use the “New pull request” button.
   - GitHub will prompt you to select a PR template that matches your work (feature, bugfix, docs, etc.).
   - Fill in all required fields in the template, including the PR checklist.

7. **Complete the PR Description**
   - Clearly describe what changed and why.
   - Reference related issues with keywords like `Closes #123`.
   - Add test instructions, screenshots, or videos as required.
   - Note any documentation updates or follow-up actions.

8. **Apply/Review Labels and Milestones**
   - Labels are added automatically based on your branch prefix and file changes, but review and add any missing ones:
     - Type (e.g., `type:feature`, `type:bug`)
     - Status (`status:needs-review`, `status:needs-qa`)
     - Area/Component (`area:ci`, `comp:block-editor`)
     - Release (`release:patch`, `release:minor`, `release:major`)
     - Meta (e.g., `meta:needs-changelog`)
   - Assign the PR to the correct milestone and project if required.

9. **Submit the PR and Respond to Reviews**
   - Submit the PR and monitor continuous integration (CI) status checks.
   - Respond promptly to reviewer feedback and requested changes.
   - Update your PR (with new commits, not force-push unless requested).
   - Mark checklist items as you address them.

10. **Merging the PR**
    - Only maintainers can merge PRs.
    - The PR will be merged once:
      - All status checks (tests, lint, accessibility) pass
      - At least one reviewer approves
      - Required labels, changelog entries, and documentation are present
    - When merged, PRs with `Closes #issue` will automatically close the linked issue(s).

11. **Release & Changelog**
    - User-facing PRs require an entry in [CHANGELOG.md](../CHANGELOG.md).
    - The release process uses PR labels to automate changelog generation and version bumps.

12. **After Merge**
    - Pull the latest changes into your local `main` branch.
    - Delete your feature branch if it’s no longer needed.

---

**References:**

- [Pull Request Template](https://github.com/lightspeedwp/.github/blob/master/.github/PULL_REQUEST_TEMPLATE.md)
- [PR Creation Guide](docs/PR_CREATION_GUIDE.md)
- [Label Guide](.github/ISSUE_LABELS.md)
- [Testing Guide](docs/TESTING.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

_For any questions or help, use [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions) or ask a maintainer._
