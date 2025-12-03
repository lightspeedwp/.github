# .github/DISCUSSION_LABELS.md

## Purpose

Defines the org-wide standard for providing **Discussion labeling** for category routing, community hygiene, search, and metrics in LightSpeed projects. This guide explains how `discussion:*` labels are used, how they’re applied, and how automation works for GitHub Discussions.

## Label Families (Discussions)

- **`discussion:announcement`** — Official announcements and news in Discussions.
- **`discussion:showcase`** — Show & Tell, user project showcases.
- **`discussion:community`** — General community, introductions, and social topics.
- **`discussion:feedback`** — Ideas, suggestions, and user feedback.
- **`discussion:support`** — Peer/user support, troubleshooting, and “how do I…” questions.
- **`discussion:sponsorship`** — Sponsorship, funding, and GitHub Sponsors topics.
- **`discussion:partnership`** — Business partnerships, collaboration, and ecosystem opportunities.

See [labels.yml](./labels.yml) for full canonical definitions and colour mapping.

## How Discussion Labels Are Applied

### Category Form Automation

- **Each Discussion category** is mapped to a default `discussion:*` label.
- When a new Discussion is created in a category (e.g., “Show & Tell”), the corresponding label (e.g., `discussion:showcase`) is **automatically applied** via the category’s YAML form.
- Maintainers may manually add, remove, or update discussion labels as needed.

### Manual Labeling

- Discussion labels can be managed through the GitHub UI by maintainers, if a topic moves categories or the context changes.

### Automated Labeling Limitations

- **labeler.yml does NOT apply to Discussions:**  
  The [GitHub labeler workflow](./labeler.yml) only covers Issues and Pull Requests.
- **No advanced discussion label automation (yet):**  
  As of now, there’s no official GitHub support for content- or event-based automatic relabeling of Discussions. If such features become available, this documentation and workflow will be updated accordingly.

## Discussion Label Usage

- **Filter and Search:**  
  Use `discussion:*` label filtering to quickly find all showcase posts, announcements, or support threads.
- **Reporting:**  
  Metrics and dashboards can be constructed to track engagement using `discussion:*` labels.
- **Community Moderation:**  
  Clear labeling makes moderation and triage more efficient and transparent.

## Example Category Mapping

| Category              | Label                   | Description                                     |
| --------------------- | ----------------------- | ----------------------------------------------- |
| Announcements         | discussion:announcement | Official news, releases, and updates            |
| Show & Tell           | discussion:showcase     | Share your projects and user stories            |
| Community / General   | discussion:community    | Meet the community, open chat, intros           |
| Ideas & Feedback      | discussion:feedback     | Product ideas, feature requests, suggestions    |
| Product Support       | discussion:support      | Help with LSX Design, Tour Operator, etc.       |
| Sponsorship & Funding | discussion:sponsorship  | Funding, GitHub Sponsors, and financial support |
| Partnerships          | discussion:partnership  | Business partnerships and collaboration         |

## Automation Summary

- **Default label per category** is set via the category form YAML, not by workflow files.
- **Maintainers can update labels manually.**
- **labeler.yml does not control Discussions**—future automation may be added as GitHub support matures.

## Reference

- [labels.yml](./labels.yml): Canonical label definitions and colour mapping.
- [DISCUSSION_TEMPLATE/](./DISCUSSION_TEMPLATE/): Category forms for label assignment.
- [GitHub Docs: Creating category forms](https://docs.github.com/en/discussions/managing-discussions-for-your-community/creating-discussion-category-forms)

_This Discussion Labels standard extends the LightSpeed Projects/Issues/Labels strategy and supports org-wide community engagement, moderation, and metrics. All guidance here is directly reflected in labels.yml and category form YAML._
