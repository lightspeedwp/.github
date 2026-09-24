# Label Mapping Schema

Defines `evidence/linear-labels.json` and the mapping table attached to the `[LABEL-UPDATE-REQUEST]` (spec FR-011, FR-012, FR-015). One entry per label that changes; labels that are identical in `labels.yml`, GitHub and Linear are omitted.

## JSON format

```json
{
  "generated_at": "2026-09-24T00:00:00Z",
  "sources": {
    "labels_yml_count": 169,
    "linear_workspace_count": 240,
    "linear_team": "LightSpeed"
  },
  "mappings": [
    {
      "source": "priority:medium",
      "systems": ["linear"],
      "action": "merge",
      "target": "priority:normal",
      "issue_count": 50,
      "concept_label": null,
      "requirement": "FR-012",
      "notes": ""
    },
    {
      "source": "meta:needs-approval",
      "systems": ["linear"],
      "action": "import",
      "target": null,
      "issue_count": 0,
      "concept_label": null,
      "requirement": "FR-012, FR-021",
      "color": "57606A",
      "description": "Explicit decision or sign-off required before the specified work proceeds; remove once the decision and approver are recorded.",
      "change_request": 3554,
      "notes": "Required by the FR-021 approval gate"
    }
  ]
}
```

## Fields

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `source` | string | ✅ | Exact label name, including stray spaces (for example `"scope: website"`) |
| `systems` | array | ✅ | Where the source exists: `github`, `linear` or both |
| `action` | enum | ✅ | See actions below |
| `target` | string or null | ✅ | Required for `rename`, `merge` and `re-prefix`; null otherwise. Must exist in `labels.yml` after the change |
| `issue_count` | integer | ✅ | Issues (and PRs, for GitHub) carrying the source label at generation time |
| `concept_label` | string or null | | For `re-prefix` only: the non-type label added alongside `target` (for example `area:maintenance`) |
| `requirement` | string | ✅ | The FR that authorises the action |
| `notes` | string | | Free text, for example why a merge was retired instead |
| `color` | string or null | For `import` | Six-digit hex; the `docs/LABEL_COLOR_STRATEGY.md` colour where the family has a rule, otherwise the colour in the approved request |
| `description` | string or null | For `import` | The label description to write to `labels.yml` |
| `change_request` | integer or null | | The `[LABEL-UPDATE-REQUEST]` issue that approves the entry (for example `3554`) |

## Actions

| Action | Meaning | Example |
| --- | --- | --- |
| `rename` | Rename in place; associations kept | `ai-ops:agents` → `aiops:agents` (FR-011) |
| `import` | Add to `labels.yml` and every repository | `area:builds` (FR-012) |
| `merge` | Move every issue to `target`, then retire or delete the source | `priority:medium` → `priority:normal` (FR-012) |
| `re-prefix` | Replace a Linear-only `type:*` label with `target` plus `concept_label` | `type:maintenance` → `type:chore` + `area:maintenance` (FR-015) |
| `retire` | Zero use, or would duplicate the issue's type label; retire in Linear, delete in GitHub | `meta:tech-debt`, `meta:enhancement` |
| `team-scope` | Move to a Linear team; not imported | `area:flow` → Flow team |
| `swap` | The type-family swap | `type:question` → retired; `type:decision` mapped (FR-014) |

## Validation rules

1. Every `target` and `concept_label` exists in the proposed `labels.yml`.
2. No mapping leaves an issue with zero or two `type:*` labels.
3. `import` entries have `issue_count` ≥ 1, or `notes` names the automation that requires the label.
4. `retire` entries with `issue_count` > 0 name the reason in `notes`.
5. After applying all mappings, the `type:*` family has exactly 25 labels.
6. Every `import` has `color` and `description`; a `meta:*` import uses `57606A`, and any family with a strategy rule uses that rule's colour.
7. No mapping merges `area:observability` into `area:monitoring` (both are imported), and `area:agents`, `area:instructions` and `area:prompts` map to their `aiops:*` labels.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
