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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
