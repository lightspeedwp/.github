# Duplicate Label Analysis

**Audit date**: 2026-09-14 (label snapshot); analysis 2026-09-24  
**Scope**: the 169 labels in `evidence/canonical-labels.json`, the never-delete list snapshot and the 18 audited label documents, plus `CLAUDE.md` and `AGENTS.md`  
**Tasks**: spec 008 T021–T025 (User Story 2)

---

## Executive Summary

- **23 candidate pairs** checked: 12 real overlaps, 11 pairs that look alike but are kept on purpose.
- **5 overlaps are approved** in spec 008 FR-012: `status:completed` → `status:done`, `area:tests` → `area:testing`, and `area:agents`, `area:instructions` and `area:prompts` → their `aiops:*` labels (2026-09-24 clarification: AI assets live in `aiops:*`, `area:ai` stays as the umbrella).
- **5 proposed consolidations need @ashley's decision** before they go into the Stage 1 `[LABEL-UPDATE-REQUEST]`: the two priority scales, `status:needs-qa` / `status:needs-testing`, `area:block-editor` / `comp:block-editor`, and `area:compatibility`.
- **36 labelling gaps**: 24 labels named in documentation but not in `labels.yml`, and the 12 never-delete labels that were not in `labels.yml` (now removed from the list by T055).
- **Usage ranking is pending.** SC-004 ranks duplicates by issue and PR counts across every repository plus Linear counts. Those need the live inventory (T041) and the Linear export (T042); until then the tables show how many documents and automation files mention each label.

## Duplicate Families

| Family          | Pairs | What overlaps                                                                                                                                                                        |
| --------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `priority`      | 2     | Two scales in one family: critical / important / normal / minor, and high / low                                                                                                      |
| `status`        | 2     | Finished (`done` / `completed`); waiting for verification (`needs-qa` / `needs-testing`)                                                                                             |
| `area`          | 3     | `tests` / `testing`; `operations` / `infrastructure` (kept, descriptions to sharpen); `ai` is an umbrella, not a duplicate                                                           |
| `meta`          | 1     | `stale` versus `no-issue-activity` / `no-pr-activity`                                                                                                                                |
| Across families | 6     | `area:block-editor` / `comp:block-editor`; `area:agents`, `area:instructions`, `area:prompts` / `ai-ops:*`; `area:compatibility` / `compat:*`; `contrib:discussion` / `discussion:*` |
| `type` / `area` | 9     | Same word in both families on purpose: type says what kind of work, area says which part of the system (FR-015)                                                                      |

## Consolidation Matrix

| Label                | Overlaps with            | Confidence | Action | Keep                   | Status         | Rationale                                                                                                                                                         |
| -------------------- | ------------------------ | ---------- | ------ | ---------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status:done`        | `status:completed`       | high       | merge  | `status:done`          | approved       | Already approved in spec FR-012 (status:completed → status:done).                                                                                                 |
| `area:tests`         | `area:testing`           | high       | merge  | `area:testing`         | approved       | Already approved in spec FR-012 (area:tests → area:testing).                                                                                                      |
| `priority:important` | `priority:high`          | medium     | merge  | `priority:important`   | needs decision | Keep the four-step scale (critical, important, normal, minor) that labels.yml documents first; merge high → important.                                            |
| `priority:minor`     | `priority:low`           | medium     | merge  | `priority:minor`       | needs decision | Same scale; merge low → minor.                                                                                                                                    |
| `status:needs-qa`    | `status:needs-testing`   | medium     | merge  | `status:needs-testing` | needs decision | Mirror the area:qa / area:testing split only if QA sign-off is a separate step; otherwise merge needs-qa → needs-testing. Needs @ashley's decision.               |
| `meta:stale`         | `meta:no-issue-activity` | medium     | keep   | `both`                 | keep           | Keep meta:no-issue-activity and meta:no-pr-activity for the stale bot, and define meta:stale as their umbrella, or retire meta:stale if no automation applies it. |
| `area:block-editor`  | `comp:block-editor`      | high       | merge  | `comp:block-editor`    | needs decision | The comp:* family holds every other block-editor component, so keep comp:block-editor and retire area:block-editor.                                               |
| `area:agents`        | `ai-ops:agents`          | high       | merge  | `aiops:agents`         | approved       | Already approved in spec FR-012, 2026-09-24 clarification (area:agents → aiops:agents).                                                                           |
| `area:instructions`  | `ai-ops:instructions`    | high       | merge  | `aiops:instructions`   | approved       | Already approved in spec FR-012, 2026-09-24 clarification (area:instructions → aiops:instructions).                                                               |
| `area:prompts`       | `ai-ops:prompts`         | high       | merge  | `aiops:prompts`        | approved       | Already approved in spec FR-012, 2026-09-24 clarification (area:prompts → aiops:prompts).                                                                         |
| `area:operations`    | `area:infrastructure`    | medium     | keep   | `both`                 | keep           | Keep both with sharper descriptions: operations for running and supporting services, infrastructure for hosting and platform.                                     |
| `area:compatibility` | `compat:wordpress`       | medium     | retire | `compat:*`             | needs decision | Retire area:compatibility; use a specific compat:* label with type:compat.                                                                                        |

Pairs kept on purpose:

| Label                | Overlaps with          | Confidence | Action | Keep   | Status | Rationale                                                                                                                                                                                            |
| -------------------- | ---------------------- | ---------- | ------ | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contrib:discussion` | `discussion:community` | low        | keep   | `both` | keep   | contrib:* marks contributor entry points; discussion:* marks Discussions categories. Keep both.                                                                                                      |
| `area:ai`            | `area:agents`          | low        | keep   | `both` | keep   | Not duplicates: area:ai is the umbrella area label for AI work and stays; its children area:agents, area:instructions and area:prompts move to aiops:* (FR-012), and area:skills is decided in T043. |
| `type:a11y`          | `area:a11y`            | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |
| `type:security`      | `area:security`        | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |
| `type:performance`   | `area:performance`     | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |
| `type:ci`            | `area:ci`              | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |
| `type:automation`    | `area:automation`      | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |
| `type:docs`          | `area:documentation`   | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |
| `type:dependency`    | `area:dependencies`    | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |
| `type:release`       | `area:release`         | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |
| `type:chore`         | `area:maintenance`     | low        | keep   | `both` | keep   | Not duplicates: Type says what kind of work it is; area says which part of the system. FR-015 relies on this split (for example type:chore + area:maintenance).                                      |

## Impact Analysis

Files outside reports and archives that mention a label being merged or retired (from `evidence/consolidation-recommendations.json`). Every one must be updated in the Stage 2 configuration PR (T056, T057) before the label changes.

| Merge or retirement                                                 | Label(s) to change   | Files that mention them | Doc mentions                                   | Never-delete list (snapshot)                     |
| ------------------------------------------------------------------- | -------------------- | ----------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `status:done` / `status:completed` → `status:done`                  | `status:completed`   | 0                       | `status:done` 3, `status:completed` 0          | `status:done` no, `status:completed` no          |
| `area:tests` / `area:testing` → `area:testing`                      | `area:tests`         | 12                      | `area:tests` 3, `area:testing` 1               | `area:tests` yes, `area:testing` yes             |
| `priority:important` / `priority:high` → `priority:important`       | `priority:high`      | 31                      | `priority:important` 2, `priority:high` 6      | `priority:important` no, `priority:high` no      |
| `priority:minor` / `priority:low` → `priority:minor`                | `priority:low`       | 9                       | `priority:minor` 5, `priority:low` 2           | `priority:minor` no, `priority:low` no           |
| `status:needs-qa` / `status:needs-testing` → `status:needs-testing` | `status:needs-qa`    | 8                       | `status:needs-qa` 5, `status:needs-testing` 2  | `status:needs-qa` no, `status:needs-testing` no  |
| `area:block-editor` / `comp:block-editor` → `comp:block-editor`     | `area:block-editor`  | 7                       | `area:block-editor` 2, `comp:block-editor` 4   | `area:block-editor` yes, `comp:block-editor` no  |
| `area:agents` / `ai-ops:agents` → `aiops:agents`                    | `area:agents`        | 6                       | `area:agents` 0, `ai-ops:agents` 1             | `area:agents` no, `ai-ops:agents` no             |
| `area:instructions` / `ai-ops:instructions` → `aiops:instructions`  | `area:instructions`  | 0                       | `area:instructions` 0, `ai-ops:instructions` 1 | `area:instructions` no, `ai-ops:instructions` no |
| `area:prompts` / `ai-ops:prompts` → `aiops:prompts`                 | `area:prompts`       | 0                       | `area:prompts` 0, `ai-ops:prompts` 1           | `area:prompts` no, `ai-ops:prompts` no           |
| `area:compatibility` / `compat:wordpress` → `compat:*`              | `area:compatibility` | 2                       | `area:compatibility` 1, `compat:wordpress` 1   | `area:compatibility` no, `compat:wordpress` no   |

Per-file lists are in `evidence/consolidation-recommendations.json` (`automation_impact`). Usage counts per label are in `evidence/duplicate-consolidation-analysis.json` and read "pending T041" / "pending T042" until the live inventories exist.

## Migration Strategy

1. **Decide** the proposals marked "needs decision" in the Stage 1 `[LABEL-UPDATE-REQUEST]` (T046), labelled `meta:needs-approval` (FR-021). Only approved pairs move on.
2. **Configure** (Stage 2, one PR): update `labels.yml`, `labeler.yml`, `branch-labels.yml` and every file in the impact list; the FR-009 gate applies.
3. **Relabel** (Stage 3): rename in place where the target label does not exist in a repository; where it does, move every issue and PR to the target first (FR-012). Never delete and recreate, so issue associations are kept.
4. **Retire** (Stage 4): the source label is deleted only after the per-repository dry run is approved and the destructive-changes checklist is reviewed (T064c, FR-016).
5. **Linear** (Stage 5): relabel, then retire the source label; never delete (T069).

**Rollback**: until Stage 4 nothing is deleted, so a merge is undone by reverting the configuration PR and relabelling back. After Stage 4, the dry-run snapshot (`evidence/dry-run/{repo}.json`) holds each deleted label's name, colour, description and items, so it can be recreated and reapplied.

## Labelling Gaps

### Documentation-only labels

| Label                      | Mentions | First location                            | Recommendation                                                                                                                                   |
| -------------------------- | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `area:docs`                | 7        | `docs/ISSUE_MAINTENANCE_SCRIPTS.md:309`   | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `area:labels`              | 2        | `docs/LABEL_INVENTORY.md:159`             | decide: Not in labels.yml and not in the spec 008 mapping; decide in T043 whether to import it or remove it from the doc.                        |
| `area:quality`             | 1        | `docs/LABEL_INVENTORY.md:165`             | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `meta:dependabot-security` | 1        | `docs/LABEL_INVENTORY.md:135`             | decide: Not in labels.yml and not in the spec 008 mapping; decide in T043 whether to import it or remove it from the doc.                        |
| `meta:duplicate`           | 2        | `CLAUDE.md:288`                           | decide: Not in labels.yml and not in the spec 008 mapping; decide in T043 whether to import it or remove it from the doc.                        |
| `meta:needs-audit`         | 1        | `CLAUDE.md:288`                           | decide: Not in labels.yml and not in the spec 008 mapping; decide in T043 whether to import it or remove it from the doc.                        |
| `meta:triage`              | 1        | `docs/LABEL_STRATEGY.md:91`               | decide: Not in labels.yml and not in the spec 008 mapping; decide in T043 whether to import it or remove it from the doc.                        |
| `priority:medium`          | 1        | `docs/ISSUE_MANAGEMENT_QUICKSTART.md:116` | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `priority:urgent`          | 1        | `docs/ISSUE_TRIAGE_LABELING.md:116`       | remove from docs: Use priority:critical (CLAUDE.md label rules).                                                                                 |
| `status:closed`            | 2        | `docs/ISSUE_MANAGEMENT_QUICKSTART.md:108` | decide: Not in labels.yml and not in the spec 008 mapping; decide in T043 whether to import it or remove it from the doc.                        |
| `status:ready-for-use`     | 3        | `docs/ISSUE_UPDATES_GUIDE.md:19`          | decide: Not in labels.yml and not in the spec 008 mapping; decide in T043 whether to import it or remove it from the doc.                        |
| `type:ai-ops`              | 7        | `docs/ISSUE_FIELDS.md:75`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `type:code-refactor`       | 1        | `docs/ISSUE_TRIAGE_LABELING.md:94`        | remove from docs: The type family is fixed at the 25 labels in issue-types.yml (FR-008, FR-014); replace with the matching canonical type label. |
| `type:compatibility`       | 4        | `docs/ISSUE_FIELDS.md:80`                 | remove from docs: The type family is fixed at the 25 labels in issue-types.yml (FR-008, FR-014); replace with the matching canonical type label. |
| `type:discussion`          | 1        | `docs/LABEL_COLOR_STRATEGY.md:119`        | remove from docs: The type family is fixed at the 25 labels in issue-types.yml (FR-008, FR-014); replace with the matching canonical type label. |
| `type:documentation`       | 9        | `docs/ISSUE_FIELDS.md:62`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `type:enhancement`         | 1        | `docs/ISSUE_FIELDS.md:61`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `type:improvement`         | 1        | `docs/ISSUE_TRIAGE_LABELING.md:90`        | remove from docs: The type family is fixed at the 25 labels in issue-types.yml (FR-008, FR-014); replace with the matching canonical type label. |
| `type:integration`         | 4        | `docs/ISSUE_FIELDS.md:78`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `type:investigation`       | 2        | `docs/ISSUE_FIELDS.md:72`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `type:maintenance`         | 4        | `docs/ISSUE_FIELDS.md:69`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `type:story`               | 4        | `docs/ISSUE_FIELDS.md:82`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `type:support`             | 1        | `docs/ISSUE_FIELDS.md:86`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |
| `type:ui`                  | 3        | `docs/ISSUE_FIELDS.md:65`                 | remove from docs: Retired or merged by spec 008 (FR-012, FR-014, FR-015); update the doc to the approved label.                                  |

`CLAUDE.md` lists `area:labels`, `meta:duplicate` and `meta:needs-audit` as valid prefixed labels, but none of them is in `labels.yml` (`status:duplicate` is the canonical one). `area:labels` is also used in `packages/metadata-agent/src/label-utils.js`. These three need a decision in T043: import them, or correct `CLAUDE.md` and the code.

### Never-delete list (2026-09-14 snapshot)

| Label                      | Approved equivalent | Status                        |
| -------------------------- | ------------------- | ----------------------------- |
| `type:documentation`       | `type:docs`         | Removed from the list by T055 |
| `type:maintenance`         | `type:chore`        | Removed from the list by T055 |
| `type:ai-ops`              | `type:aiops`        | Removed from the list by T055 |
| `type:compatibility`       | `type:compat`       | Removed from the list by T055 |
| `type:investigation`       | `type:research`     | Removed from the list by T055 |
| `type:support`             | none                | Removed from the list by T055 |
| `type:story`               | none                | Removed from the list by T055 |
| `type:enhancement`         | `type:improve`      | Removed from the list by T055 |
| `type:help`                | none                | Removed from the list by T055 |
| `area:labels`              | none                | Removed from the list by T055 |
| `meta:duplicate`           | none                | Removed from the list by T055 |
| `meta:dependabot-security` | none                | Removed from the list by T055 |

## Evidence

- `evidence/duplicate-candidates.json` (T021)
- `evidence/duplicate-consolidation-analysis.json` (T022)
- `evidence/consolidation-recommendations.json` (T023)
- `evidence/labeling-gaps.json` (T024)
